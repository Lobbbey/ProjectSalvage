import 'package:flutter/material.dart';
import 'HomeScreen.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/AuthProvider.dart';

class ExpenseScreen extends StatefulWidget {
  const ExpenseScreen({super.key});

  @override
  _ExpenseScreenState createState() => _ExpenseScreenState();
}

class _ExpenseScreenState extends State<ExpenseScreen> {
  final TextEditingController _NameController = TextEditingController();
  final TextEditingController _AmountController = TextEditingController();
  final TextEditingController _CategoryController = TextEditingController();
  final TextEditingController _InitialTimeController = TextEditingController();
  bool _isLoading = false;
  bool _isRecurring = false;
  String _alertMessage = '';
  bool _loadingExpenses = false;
  int? _editingIndex;

  @override
  void initState() {
    super.initState();
    _loadExpenses();
  }

  Future<void> _loadExpenses() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() => _loadingExpenses = true);
    try {
      await authProvider.ShowAllInfo();
    } finally {
      setState(() => _loadingExpenses = false);
    }
  }

  Future<void> _deleteExpense(int index) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() => _isLoading = true);
    try {
      await authProvider.DeleteExpense(index);
      await _loadExpenses();
      setState(() {
        _alertMessage = 'Expense deleted successfully';
        _clearForm();
      });
    } catch (e) {
      setState(() => _alertMessage = 'Failed to delete expense');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _editExpense(int index) {
    final expenses =
        Provider.of<AuthProvider>(
          context,
          listen: false,
        ).userData?['Expenses'] ??
        [];
    if (index >= 0 && index < expenses.length) {
      final expense = expenses[index];
      _NameController.text = expense['Name'];
      _AmountController.text = expense['Amount'].toString();
      _CategoryController.text = expense['Category'];
      if (expense['InitialTime'] != null) {
        _InitialTimeController.text =
            '${expense['InitialTime']['Month']}/${expense['InitialTime']['Day']}/${expense['InitialTime']['Year']}';
      } else {
        _InitialTimeController.clear();
      }

      setState(() {
        _isRecurring = expense['IfRecurring'];
        _editingIndex = index;
      });
    }
  }

  void _clearForm() {
    _NameController.clear();
    _CategoryController.clear();
    _AmountController.clear();
    _InitialTimeController.clear();
    setState(() {
      _isRecurring = false;
      _editingIndex = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final expenses = authProvider.userData?['Expenses'] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Salvage Financial'),
        leading: Builder(
          builder:
              (context) => IconButton(
                icon: const Icon(Icons.menu),
                onPressed: () => Scaffold.of(context).openDrawer(),
              ),
        ),
      ),
      drawer: CustomDrawer(),
      body: SafeArea(
        child: Column(
          children: [
            // Expense Form
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      TextField(
                        controller: _NameController,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'Expense Name',
                        ),
                      ),
                      SizedBox(height: 5),
                      TextField(
                        controller: _AmountController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'Amount',
                        ),
                      ),
                      SizedBox(height: 5),
                      TextField(
                        controller: _CategoryController,
                        keyboardType: TextInputType.text,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'Category',
                        ),
                      ),
                      SizedBox(height: 5),
                      TextField(
                        controller: _InitialTimeController,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'Date (MM/DD/YYYY)',
                        ),
                        onTap: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime(2000),
                            lastDate: DateTime(2100),
                          );
                          if (date != null) {
                            _InitialTimeController.text =
                                '${date.month}/${date.day}/${date.year}';
                          }
                        },
                      ),
                      SizedBox(height: 5),
                      Row(
                        children: [
                          Text('Recurring:'),
                          Radio(
                            value: true,
                            groupValue: _isRecurring,
                            onChanged:
                                (value) =>
                                    setState(() => _isRecurring = value!),
                          ),
                          Text('Yes'),
                          Radio(
                            value: false,
                            groupValue: _isRecurring,
                            onChanged:
                                (value) =>
                                    setState(() => _isRecurring = value!),
                          ),
                          Text('No'),
                        ],
                      ),
                      if (_alertMessage.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8.0),
                          child: Text(_alertMessage),
                        ),
                      ElevatedButton(
                        onPressed:
                            _isLoading
                                ? null
                                : () async {
                                  if (_NameController.text.isEmpty ||
                                      _CategoryController.text.isEmpty ||
                                      _AmountController.text.isEmpty ||
                                      _InitialTimeController.text.isEmpty) {
                                    setState(
                                      () =>
                                          _alertMessage =
                                              'Please fill all fields',
                                    );
                                    return;
                                  }

                                  setState(() => _isLoading = true);
                                  try {
                                    final dateParts = _InitialTimeController
                                        .text
                                        .split('/');
                                    if (dateParts.length != 3) {
                                      setState(
                                        () =>
                                            _alertMessage =
                                                'Invalid date format',
                                      );
                                      return;
                                    }

                                    if (_editingIndex != null) {
                                      await authProvider.EditExpense(
                                        _NameController.text,
                                        _editingIndex!,
                                        int.parse(_AmountController.text),
                                        _CategoryController.text,
                                        _isRecurring,
                                        InitialTime: {
                                          'Month': int.parse(dateParts[0]),
                                          'Day': int.parse(dateParts[1]),
                                          'Year': int.parse(dateParts[2]),
                                        },
                                      );
                                    } else {
                                      await authProvider.AddExpense(
                                        _NameController.text,
                                        int.parse(_AmountController.text),
                                        _CategoryController.text,
                                        _isRecurring,
                                        InitialTime: {
                                          'Month': int.parse(dateParts[0]),
                                          'Day': int.parse(dateParts[1]),
                                          'Year': int.parse(dateParts[2]),
                                        },
                                      );
                                    }
                                    await _loadExpenses();
                                    setState(() {
                                      _alertMessage =
                                          _editingIndex != null
                                              ? 'Expense updated successfully'
                                              : 'Expense added successfully';
                                      _clearForm();
                                    });
                                  } catch (e) {
                                    setState(
                                      () =>
                                          _alertMessage =
                                              'Error: ${e.toString()}',
                                    );
                                  } finally {
                                    setState(() => _isLoading = false);
                                  }
                                },
                        child:
                            _isLoading
                                ? CircularProgressIndicator(color: Colors.white)
                                : Text(
                                  _editingIndex != null
                                      ? 'Update Expense'
                                      : 'Add Expense',
                                ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Expense List
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child:
                    _loadingExpenses
                        ? Center(child: CircularProgressIndicator())
                        : expenses.isEmpty
                        ? Center(child: Text('No Expense yet'))
                        : ListView.builder(
                          itemCount: expenses.length,
                          itemBuilder: (context, index) {
                            final expense = expenses[index];
                            final initialTime = expense['InitialTime'];
                            final dateString =
                                (initialTime != null)
                                    ? '${initialTime['Month']}/${initialTime['Day']}/${initialTime['Year']}'
                                    : 'No date';

                            return ListTile(
                              title: Text(expense['Name']),
                              subtitle: Text(
                                '${expense['Category']} • \$${expense['Amount']} • $dateString',
                              ),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: Icon(Icons.edit, color: Colors.blue),
                                    onPressed: () => _editExpense(index),
                                  ),
                                  IconButton(
                                    icon: Icon(Icons.delete, color: Colors.red),
                                    onPressed: () => _deleteExpense(index),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
