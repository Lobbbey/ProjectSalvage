import 'package:flutter/material.dart';
import 'HomeScreen.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/AuthProvider.dart';

class IncomeScreen extends StatefulWidget {
  const IncomeScreen({super.key});

  @override
  _IncomeScreenState createState() => _IncomeScreenState();
}

class _IncomeScreenState extends State<IncomeScreen> {
  final TextEditingController _NameController = TextEditingController();
  final TextEditingController _AmountController = TextEditingController();
  final TextEditingController _InitialTimeController = TextEditingController();
  bool _isLoading = false;
  bool _isRecurring = false;
  String _alertMessage = '';
  bool _loadingIncomes = false;
  int? _editingIndex;

  @override
  void initState() {
    super.initState();
    _loadIncomes();
  }

  Future<void> _loadIncomes() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() => _loadingIncomes = true);
    try {
      await authProvider.ShowAllInfo();
    } finally {
      setState(() => _loadingIncomes = false);
    }
  }

  Future<void> _deleteIncome(int index) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() => _isLoading = true);
    try {
      await authProvider.DeleteIncome(index);
      await _loadIncomes();
      setState(() {
        _alertMessage = 'Income deleted successfully';
        _clearForm();
      });
    } catch (e) {
      setState(() => _alertMessage = 'Failed to delete income');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _editIncome(int index) {
    final incomes =
        Provider.of<AuthProvider>(context, listen: false).userData?['Income'] ??
        [];
    if (index >= 0 && index < incomes.length) {
      final income = incomes[index];
      _NameController.text = income['Name'];
      _AmountController.text = income['Amount'].toString();
      _InitialTimeController.text =
          '${income['InitialTime']['Month']}/${income['InitialTime']['Day']}/${income['InitialTime']['Year']}';
      setState(() {
        _isRecurring = income['IfRecurring'];
        _editingIndex = index;
      });
    }
  }

  void _clearForm() {
    _NameController.clear();
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
    final incomes = authProvider.userData?['Income'] ?? [];

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
            // Income Form
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
                          labelText: 'Income Name',
                        ),
                      ),
                      SizedBox(height: 10),
                      TextField(
                        controller: _AmountController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'Amount',
                        ),
                      ),
                      SizedBox(height: 10),
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
                      SizedBox(height: 10),
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
                                      await authProvider.EditIncome(
                                        _NameController.text,
                                        _editingIndex!,
                                        int.parse(_AmountController.text),
                                        _isRecurring,
                                        InitialTime: {
                                          'Month': int.parse(dateParts[0]),
                                          'Day': int.parse(dateParts[1]),
                                          'Year': int.parse(dateParts[2]),
                                        },
                                      );
                                    } else {
                                      await authProvider.AddIncome(
                                        _NameController.text,
                                        int.parse(_AmountController.text),
                                        _isRecurring,
                                        InitialTime: {
                                          'Month': int.parse(dateParts[0]),
                                          'Day': int.parse(dateParts[1]),
                                          'Year': int.parse(dateParts[2]),
                                        },
                                      );
                                    }
                                    await _loadIncomes();
                                    setState(() {
                                      _alertMessage =
                                          _editingIndex != null
                                              ? 'Income updated successfully'
                                              : 'Income added successfully';
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
                                      ? 'Update Income'
                                      : 'Add Income',
                                ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Income List
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child:
                    _loadingIncomes
                        ? Center(child: CircularProgressIndicator())
                        : incomes.isEmpty
                        ? Center(child: Text('No incomes yet'))
                        : ListView.builder(
                          itemCount: incomes.length,
                          itemBuilder: (context, index) {
                            final income = incomes[index];
                            final initialTime = income['InitialTime'];
                            final dateString =
                                (initialTime != null)
                                    ? '${initialTime['Month']}/${initialTime['Day']}/${initialTime['Year']}'
                                    : 'No date';

                            return ListTile(
                              title: Text(income['Name']),
                              subtitle: Text('\$${income['Amount']} • $dateString'),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: Icon(Icons.edit, color: Colors.blue),
                                    onPressed: () => _editIncome(index),
                                  ),
                                  IconButton(
                                    icon: Icon(Icons.delete, color: Colors.red),
                                    onPressed: () => _deleteIncome(index),
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
