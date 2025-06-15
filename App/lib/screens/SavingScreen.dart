import 'package:flutter/material.dart';
import 'HomeScreen.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/AuthProvider.dart';

class SavingScreen extends StatefulWidget {
  @override
  _SavingScreenState createState() => _SavingScreenState();
}

class _SavingScreenState extends State<SavingScreen> {
  final TextEditingController _NameController = TextEditingController();
  final TextEditingController _AmountController = TextEditingController();
  final TextEditingController _APRController = TextEditingController();
  final TextEditingController _InitialTimeController = TextEditingController();
  bool _isLoading = false;
  String _alertMessage = '';
  bool _loadingSaving = false;
  int? _editingIndex;

  @override
  void initState() {
    super.initState();
    _loadSavings();
  }

  Future<void> _loadSavings() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() => _loadingSaving = true);
    try {
      await authProvider.ShowAllInfo();
    } finally {
      setState(() => _loadingSaving = false);
    }
  }

  Future<void> _deleteSaving(int index) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() => _isLoading = true);
    try {
      await authProvider.DeleteSaving(index);
      await _loadSavings();
      setState(() {
        _alertMessage = 'Saving deleted successfully';
        _clearForm();
      });
    } catch (e) {
      setState(() => _alertMessage = 'Failed to delete Saving');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _editSaving(int index) {
    final savings =
        Provider.of<AuthProvider>(
          context,
          listen: false,
        ).userData?['Savings'] ??
        [];
    if (index >= 0 && index < savings.length) {
      final saving = savings[index];
      _NameController.text = saving['Name'];
      _AmountController.text = saving['Amount'].toString();
      _APRController.text = saving['APR'];
      _InitialTimeController.text =
          '${saving['InitialTime']['Month']}/${saving['InitialTime']['Day']}/${saving['InitialTime']['Year']}';
      setState(() {
        _editingIndex = index;
      });
    }
  }

  void _clearForm() {
    _NameController.clear();
    _APRController.clear();
    _AmountController.clear();
    _InitialTimeController.clear();
    setState(() {
      _editingIndex = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final savings = authProvider.userData?['Savings'] ?? [];

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
            // Saving Form
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      TextField(
                        controller: _NameController,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(),
                          labelText: 'Saving Name',
                        ),
                      ),
                      SizedBox(height: 5),
                      TextField(
                        controller: _AmountController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(),
                          labelText: 'Amount',
                        ),
                      ),
                      SizedBox(height: 5),
                      TextField(
                        controller: _APRController,
                        keyboardType: TextInputType.text,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(),
                          labelText: 'APR',
                        ),
                      ),
                      SizedBox(height: 5),
                      TextField(
                        controller: _InitialTimeController,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.white,
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
                            style: TextStyle(color: Colors.white),
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
                                      await authProvider.EditSaving(
                                        _NameController.text,
                                        _editingIndex!,
                                        int.parse(_AmountController.text),
                                        _APRController.text,
                                        InitialTime: {
                                          'Month': int.parse(dateParts[0]),
                                          'Day': int.parse(dateParts[1]),
                                          'Year': int.parse(dateParts[2]),
                                        },
                                      );
                                    } else {
                                      await authProvider.AddSaving(
                                        _NameController.text,
                                        int.parse(_AmountController.text),
                                        _APRController.text,
                                        InitialTime: {
                                          'Month': int.parse(dateParts[0]),
                                          'Day': int.parse(dateParts[1]),
                                          'Year': int.parse(dateParts[2]),
                                        },
                                      );
                                    }
                                    await _loadSavings();
                                    setState(() {
                                      _alertMessage =
                                          _editingIndex != null
                                              ? 'Savings updated successfully'
                                              : 'Savings added successfully';
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
                                      ? 'Update Savings'
                                      : 'Add Savings',
                                ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Saving List
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child:
                    _loadingSaving
                        ? Center(child: CircularProgressIndicator())
                        : savings.isEmpty
                        ? Center(child: Text('No Saving yet'))
                        : ListView.builder(
                          itemCount: savings.length,
                          itemBuilder: (context, index) {
                            final saving = savings[index];
                            return ListTile(
                              title: Text(saving['Name']),
                              subtitle: Text(
                                '${saving['APR']} • \$${saving['Amount']} • ${saving['InitialTime']['Month']}/${saving['InitialTime']['Day']}/${saving['InitialTime']['Year']}',
                              ),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: Icon(Icons.edit, color: Colors.blue),
                                    onPressed: () => _editSaving(index),
                                  ),
                                  IconButton(
                                    icon: Icon(Icons.delete, color: Colors.red),
                                    onPressed: () => _deleteSaving(index),
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
