import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class AuthProvider with ChangeNotifier {
  bool _isLoggedIn = false;
  String _errorMessage = '';
  bool _addedInitial = false;
  String _jwtToken = '';
  Map<String, dynamic>? _userData;

  Map<String, dynamic>? get userData => _userData;
  bool get isLoggedIn => _isLoggedIn;
  bool get addedInitial => _addedInitial;
  String get errorMessage => _errorMessage;
  String get jwtToken => _jwtToken;

  Future<void> login(String email, String password) async {
    try {
      final String loginUrl = 'http://salvagefinancial.xyz:5000/api/Login';
      _errorMessage = '';
      notifyListeners();

      final response = await http.post(
        Uri.parse(loginUrl),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        encoding: Encoding.getByName("utf-8"),
        body: jsonEncode({'Email': email.trim(), 'Password': password.trim()}),
      );

      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        if (responseData['Result'] == 'Found user' &&
            responseData['token'] != null) {
          _jwtToken = responseData['token'];
          _isLoggedIn = true;
          _errorMessage = '';
          notifyListeners();
          return;
        } else {
          _isLoggedIn = false;
          _errorMessage =
              responseData['message'] ??
              (responseData['error'] ?? 'User/Password Invalid');
          notifyListeners();
          return;
        }
      } else {
        _isLoggedIn = false;
        _errorMessage =
            responseData['message'] ??
            'Server responded with ${response.statusCode}';
        notifyListeners();
        return;
      }
    } on FormatException {
      _isLoggedIn = false;
      _errorMessage = 'Invalid server response format';
      notifyListeners();
    } catch (e) {
      _isLoggedIn = false;
      _errorMessage = 'Login failed: ${e.toString()}';
      notifyListeners();
    }
  }

  Future<void> signUp(
    String fName,
    String lName,
    String email,
    String password,
  ) async {
    try {
      const String signUpUrl = 'http://salvagefinancial.xyz:5000/api/signup';
      final response = await http.post(
        Uri.parse(signUpUrl),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'Email': email,
          'Password': password,
          'FName': fName,
          'LName': lName,
        }),
      );

      if (response.statusCode == 200) {
        // Successful sign-up
        final responseData = json.decode(response.body);
        String result = responseData['Result'] ?? "Unknown error";
        if (result == 'Added user') {
          _isLoggedIn = true;
          notifyListeners();
        } else {
          throw Exception('Sign-up failed');
        }
      } else {
        throw Exception('Failed to sign up');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  void logout() {
    _isLoggedIn = false;
    _errorMessage = '';
    notifyListeners();
  }

  Future<void> ResetPassword(String newEmail, String newPass) async {
    try {
      const String rstPwdURI =
          'http://salvagefinancial.xyz:5000/api/ResetPassword';
      final response = await http.post(
        Uri.parse(rstPwdURI),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        body: json.encode({'Email': newEmail, 'Password': newPass}),
      );

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        String result = responseData['Result'] ?? "Unknown error";
        if (result != 'Changed password of user') {
          throw Exception('Password Change Failed Check info');
        }
      } else {}
    } catch (e) {
      _errorMessage = '';
    } finally {
      notifyListeners();
    }
  }

  Future<void> AddInitial(int InitialDebt, int InitialAmount) async {
    _errorMessage = '';
    _addedInitial = false;
    try {
      const String addInitURL =
          'http://salvagefinancial.xyz:5000/api/AddInitial';
      final response = await http.post(
        Uri.parse(addInitURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        body: json.encode({
          'InitialDebt': InitialDebt,
          'InitialAmount': InitialAmount,
        }),
      );

      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _addedInitial = true;
        _errorMessage = '';
      } else {
        _addedInitial = false;
        _errorMessage =
            responseData['message'] ??
            (responseData['error'] ?? 'Error adding info');
      }
    } catch (e) {
      _errorMessage = 'Could Not add initial amount and debt';
      return;
    } finally {
      notifyListeners();
    }
  }

  Future<void> AddIncome(
    String Name,
    int Amount,
    bool IfRecurring, {
    required Map<String, int> InitialTime,
  }) async {
    final String addIncomeURL =
        'http://salvagefinancial.xyz:5000/api/AddIncome';

    try {
      _errorMessage = '';

      final Map<String, dynamic> requestBody = {
        'Name': Name,
        'Amount': Amount,
        'IfRecurring': IfRecurring,
        'InitialTime': {
          'Month': InitialTime['Month'],
          'Day': InitialTime['Day'],
          'Year': InitialTime['Year'],
        },
      };

      final response = await http.post(
        Uri.parse(addIncomeURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        body: jsonEncode(requestBody),
      );

      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        _errorMessage = "";
        return;
      } else {
        _errorMessage =
            "⚠️ Error: ${responseData['Result'] ?? 'Unknown error (Status ${response.statusCode})'}";
        return;
      }
    } catch (e) {
      _errorMessage = "Failed to Add Income: ${e.toString()}";
      return;
    }
  }

  Future<void> AddExpense(
    String Name,
    int Amount,
    String Category,
    bool IfRecurring, {
    required Map<String, int> InitialTime,
  }) async {
    _errorMessage = '';
    final String addExpenseURL =
        'http://salvagefinancial.xyz:5000/api/AddExpense';
    try {
      final response = await http.post(
        Uri.parse(addExpenseURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        encoding: Encoding.getByName("utf-8"),
        body: jsonEncode({
          'Name': Name,
          'Amount': Amount,
          'Category': Category,
          'IfRecurring': IfRecurring,
          'InitialTime': {
            'Month': InitialTime['Month'],
            'Day': InitialTime['Day'],
            'Year': InitialTime['Year'],
          },
        }),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "";
        return;
      } else {
        _errorMessage = "Error: ${responseData['Result']}";
        return;
      }
    } catch (e) {
      _errorMessage = 'Failed to add expense';
      return;
    }
  }

  Future<void> AddSaving(
    String Name,
    int Amount,
    String APR, {
    required Map<String, int> InitialTime,
  }) async {
    _errorMessage = '';
    final String addSavingURL =
        'http://salvagefinancial.xyz:5000/api/AddSaving';
    try {
      final response = await http.post(
        Uri.parse(addSavingURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        encoding: Encoding.getByName("utf-8"),
        body: jsonEncode({
          'Name': Name,
          'Amount': Amount,
          'APR': APR,
          'InitialTime': {
            'Month': InitialTime['Month'],
            'Day': InitialTime['Day'],
            'Year': InitialTime['Year'],
          },
        }),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "";
        return;
      } else {
        _errorMessage = "Error: ${responseData['Result']}";
        return;
      }
    } catch (e) {
      _errorMessage = 'Failed to add saving';
      return;
    }
  }

  Future<void> AddDebt(
    String Name,
    int Amount,
    int APR,
    int Monthly,
    int LoanLength, {
    required Map<String, int> InitialTime,
  }) async {
    _errorMessage = '';
    final String addSavingURL = 'http://salvagefinancial.xyz:5000/api/AddDebt';
    try {
      final response = await http.post(
        Uri.parse(addSavingURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        encoding: Encoding.getByName("utf-8"),
        body: jsonEncode({
          'Name': Name,
          'Amount': Amount,
          'APR': APR,
          'Monthly': Monthly,
          'LoanLength': LoanLength,
          'InitialTime': {
            'Month': InitialTime['Month'],
            'Day': InitialTime['Day'],
            'Year': InitialTime['Year'],
          },
        }),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "";
        return;
      } else {
        _errorMessage = "Error: ${responseData['Result']}";
        return;
      }
    } catch (e) {
      _errorMessage = 'Failed to add debt';
      return;
    }
  }

  Future<void> EditIncome(
    String newName,
    int index,
    int newAmount,
    bool newIfRecurring, {
    required Map<String, int> InitialTime,
  }) async {
    _errorMessage = '';
    final String editIncomeURL =
        'http://salvagefinancial.xyz:5000/api/EditIncome';

    try {
      final response = await http.post(
        Uri.parse(editIncomeURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        encoding: Encoding.getByName("utf-8"),
        body: jsonEncode({
          'Name': newName,
          'index': index,
          'Amount': newAmount,
          'IfReccuring': newIfRecurring,
          'InitialTime': {
            'Month': InitialTime['Month'],
            'Day': InitialTime['Day'],
            'Year': InitialTime['Year'],
          },
        }),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "Success: ${responseData['Result']}";
      } else {
        _errorMessage = "⚠️ Error: ${responseData['Result']}";
      }
    } catch (e) {
      _errorMessage = "Failed to edit income";
    }
  }

  Future<void> EditExpense(
    String newName,
    int index,
    int newAmount,
    String newCategory,
    bool newIfRecurring, {
    required Map<String, int> InitialTime,
  }) async {
    _errorMessage = '';
    final String editExpenseURL =
        'http://salvagefinancial.xyz:5000/api/EditExpense';

    try {
      final response = await http.post(
        Uri.parse(editExpenseURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        encoding: Encoding.getByName("utf-8"),
        body: jsonEncode({
          'Name': newName,
          'index': index,
          'Amount': newAmount,
          'Category': newCategory,
          'IfReccuring': newIfRecurring,
          'InitialTime': {
            'Month': InitialTime['Month'],
            'Day': InitialTime['Day'],
            'Year': InitialTime['Year'],
          },
        }),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "Success: ${responseData['Result']}";
      } else {
        _errorMessage = "⚠️ Error: ${responseData['Result']}";
      }
    } catch (e) {
      _errorMessage = "Failed to edit expense";
    }
  }

  Future<void> EditSaving(
    String newName,
    int index,
    int newAmount,
    String newAPR, {
    required Map<String, int> InitialTime,
  }) async {
    _errorMessage = '';
    final String editSavingURL =
        'http://salvagefinancial.xyz:5000/api/EditSaving';

    try {
      final response = await http.post(
        Uri.parse(editSavingURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        encoding: Encoding.getByName("utf-8"),
        body: jsonEncode({
          'Name': newName,
          'index': index,
          'Amount': newAmount,
          'APR': newAPR,
          'InitialTime': {
            'Month': InitialTime['Month'],
            'Day': InitialTime['Day'],
            'Year': InitialTime['Year'],
          },
        }),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "Success: ${responseData['Result']}";
      } else {
        _errorMessage = "⚠️ Error: ${responseData['Result']}";
      }
    } catch (e) {
      _errorMessage = "Failed to edit saving";
    }
  }

  Future<void> EditDebt(
    String newName,
    int index,
    int newAmount,
    int newAPR,
    int newMonthly,
    int newLoadLength, {
    required Map<String, int> InitialTime,
  }) async {
    _errorMessage = '';
    final String editDebtURL = 'http://salvagefinancial.xyz:5000/api/EditDebt';

    try {
      final response = await http.post(
        Uri.parse(editDebtURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        encoding: Encoding.getByName("utf-8"),
        body: jsonEncode({
          'Name': newName,
          'index': index,
          'Amount': newAmount,
          'APR': newAPR,
          'Monthly': newMonthly,
          'LoanLength': newLoadLength,
          'InitialTime': {
            'Month': InitialTime['Month'],
            'Day': InitialTime['Day'],
            'Year': InitialTime['Year'],
          },
        }),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "Success: ${responseData['Result']}";
      } else {
        _errorMessage = "⚠️ Error: ${responseData['Result']}";
      }
    } catch (e) {
      _errorMessage = "Failed to edit debt";
    }
  }

  Future<void> DeleteIncome(int index) async {
    _errorMessage = '';
    final String deleteIncmURL =
        'http://salvagefinancial.xyz:5000/api/DeleteIncome';

    try {
      final response = await http.post(
        Uri.parse(deleteIncmURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        body: jsonEncode({'index': index}),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "Success: ${responseData['Result']}";
      } else {
        _errorMessage = "⚠️ Error: ${responseData['Result']}";
      }
    } catch (e) {
      _errorMessage = 'Could Not Delete Income';
    }
  }

  Future<void> DeleteExpense(int index) async {
    _errorMessage = '';
    final String deleteExpenseURL =
        'http://salvagefinancial.xyz:5000/api/DeleteExpense';

    try {
      final response = await http.post(
        Uri.parse(deleteExpenseURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        body: jsonEncode({'index': index}),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "Success: ${responseData['Result']}";
      } else {
        _errorMessage = "⚠️ Error: ${responseData['Result']}";
      }
    } catch (e) {
      _errorMessage = 'Could Not Delete Expense';
    }
  }

  Future<void> DeleteSaving(int index) async {
    _errorMessage = '';
    final String deleteSavingURL =
        'http://salvagefinancial.xyz:5000/api/DeleteSaving';

    try {
      final response = await http.post(
        Uri.parse(deleteSavingURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        body: jsonEncode({'index': index}),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "Success: ${responseData['Result']}";
      } else {
        _errorMessage = "⚠️ Error: ${responseData['Result']}";
      }
    } catch (e) {
      _errorMessage = 'Could Not Delete Saving';
    }
  }

  Future<void> DeleteDebt(int index) async {
    _errorMessage = '';
    final String deleteDebtURL =
        'http://salvagefinancial.xyz:5000/api/DeleteDebt';

    try {
      final response = await http.post(
        Uri.parse(deleteDebtURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        body: jsonEncode({'index': index}),
      );
      final responseData = json.decode(response.body);
      if (response.statusCode == 200) {
        _errorMessage = "Success: ${responseData['Result']}";
      } else {
        _errorMessage = "⚠️ Error: ${responseData['Result']}";
      }
    } catch (e) {
      _errorMessage = 'Could Not Delete Debt';
    }
  }

  Future<void> ShowAllInfo() async {
    _errorMessage = '';
    final String showAllInfoURL =
        'http://salvagefinancial.xyz:5000/api/ShowAllInfo';

    try {
      final response = await http.post(
        Uri.parse(showAllInfoURL),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
      );

      final responseData = json.decode(response.body);

      if (response.statusCode == 200 &&
          responseData['Result'] == "Found user") {
        _userData = responseData['User'];
      } else {
        _errorMessage = responseData['Result'] ?? 'Failed to fetch user data';
      }
    } catch (e) {
      _errorMessage = 'Could not display all user info: ${e.toString()}';
    } finally {
      notifyListeners();
    }
  }
}