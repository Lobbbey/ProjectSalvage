import 'package:flutter/material.dart';
import 'HomeScreen.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/AuthProvider.dart';

class DebtScreen extends StatefulWidget {
  @override
  _DebtScreenState createState() => _DebtScreenState();
}

class _DebtScreenState extends State<DebtScreen> {
  final TextEditingController _NameController = TextEditingController();
  final TextEditingController _AmountController = TextEditingController();
  final TextEditingController _APRController = TextEditingController();
  final TextEditingController _MonthlyController = TextEditingController();
  final TextEditingController _LoanLengthController = TextEditingController();
  final TextEditingController _InitialTimeController = TextEditingController();
  bool _isLoading = false;
  String _alertMessage = '';
  bool _loadingDebt = false;
  int? _editingIndex;

  @override
  void initState() {
    super.initState();
    _loadDebts();
  }

  Future<void> _loadDebts() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() => _loadingDebt = true);
    try {
      await authProvider.ShowAllInfo();
    } finally {
      setState(() => _loadingDebt = false);
    }
  }

  Future<void> _deleteDebt(int index) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() => _isLoading = true);
    try {
      await authProvider.DeleteDebt(index);
      await _loadDebts();
      setState(() {
        _alertMessage = 'Debt deleted successfully';
        _clearForm();
      });
    } catch (e) {
      setState(() => _alertMessage = 'Failed to delete debt');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _editDebt(int index) {
    final debts =
        Provider.of<AuthProvider>(context, listen: false).userData?['Debt'] ??
        [];
    if (index >= 0 && index < debts.length) {
      final debt = debts[index];
      _NameController.text = debt['Name'];
      _AmountController.text = debt['Amount'].toString();
      _APRController.text = debt['APR'].toString();
      _MonthlyController.text = debt['Monthly'].toString();
      _LoanLengthController.text = debt['LoanLength'].toString();
      _InitialTimeController.text =
          '${debt['InitialTime']['Month']}/${debt['InitialTime']['Day']}/${debt['InitialTime']['Year']}';
      setState(() {
        _editingIndex = index;
      });
    }
  }

  void _clearForm() {
    _NameController.clear();
    _APRController.clear();
    _AmountController.clear();
    _LoanLengthController.clear();
    _InitialTimeController.clear();
    setState(() {
      _editingIndex = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final debts = authProvider.userData?['Debt'] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Salvage Financials'),
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
            // Debt Form
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
                          labelText: 'Debt Name',
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
                        controller: _APRController,
                        keyboardType: TextInputType.text,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'APR',
                        ),
                      ),
                      SizedBox(height: 5),
                      TextField(
                        controller: _MonthlyController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'Monthly',
                        ),
                      ),
                      SizedBox(height: 5),
                      TextField(
                        controller: _LoanLengthController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'Loan Length',
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
                      if (_alertMessage.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8.0),
                          child: Text(
                            _alertMessage,
                          ),
                        ),
                      ElevatedButton(
                        onPressed:
                            _isLoading
                                ? null
                                : () async {
                                  if (_NameController.text.isEmpty ||
                                      _APRController.text.isEmpty ||
                                      _AmountController.text.isEmpty ||
                                      _MonthlyController.text.isEmpty ||
                                      _LoanLengthController.text.isEmpty ||
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
                                      await authProvider.EditDebt(
                                        _NameController.text,
                                        _editingIndex!,
                                        int.parse(_AmountController.text),
                                        int.parse(_APRController.text),
                                        int.parse(_MonthlyController.text),
                                        int.parse(_LoanLengthController.text),
                                        InitialTime: {
                                          'Month': int.parse(dateParts[0]),
                                          'Day': int.parse(dateParts[1]),
                                          'Year': int.parse(dateParts[2]),
                                        },
                                      );
                                    } else {
                                      await authProvider.AddDebt(
                                        _NameController.text,
                                        int.parse(_AmountController.text),
                                        int.parse(_APRController.text),
                                        int.parse(_MonthlyController.text),
                                        int.parse(_LoanLengthController.text),
                                        InitialTime: {
                                          'Month': int.parse(dateParts[0]),
                                          'Day': int.parse(dateParts[1]),
                                          'Year': int.parse(dateParts[2]),
                                        },
                                      );
                                    }
                                    await _loadDebts();
                                    setState(() {
                                      _alertMessage =
                                          _editingIndex != null
                                              ? 'Debt updated successfully'
                                              : 'Debt added successfully';
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
                                      ? 'Update Debt'
                                      : 'Add Debt',
                                ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Debt List
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(10),
                    topRight: Radius.circular(10),
                  ),
                ),
                child:
                    _loadingDebt
                        ? Center(child: CircularProgressIndicator())
                        : debts.isEmpty
                        ? Center(child: Text('No Debt yet'))
                        : ListView.builder(
                          itemCount: debts.length,
                          itemBuilder: (context, index) {
                            final debt = debts[index];
                            return ListTile(
                              title: Text(debt['Name']),
                              subtitle: Text(
                                '\$${debt['Amount']} • \$${debt['APR']} • \$${debt['Monthly']} • \$${debt['LoanLength']} • /${debt['InitialTime']['Month']}/${debt['InitialTime']['Day']}/${debt['InitialTime']['Year']}',
                              ),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: Icon(Icons.edit, color: Colors.blue),
                                    onPressed: () => _editDebt(index),
                                  ),
                                  IconButton(
                                    icon: Icon(Icons.delete, color: Colors.red),
                                    onPressed: () => _deleteDebt(index),
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
