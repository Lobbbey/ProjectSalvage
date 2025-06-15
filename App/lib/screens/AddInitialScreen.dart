import 'package:flutter/material.dart';
import 'package:flutter_application_1/AuthProvider.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/screens/HomeScreen.dart';

class AddInitialScreen extends StatefulWidget {
  @override
  _AddInitialScreen createState() => _AddInitialScreen();
}

class _AddInitialScreen extends State<AddInitialScreen> {
  final TextEditingController _initialDebtController = TextEditingController();
  final TextEditingController _initialAmountController = TextEditingController();
   bool _isLoading = false;
  
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    if (authProvider.errorMessage.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(authProvider.errorMessage),
            backgroundColor: Colors.red,
          ),
        );
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Initial'),
        leading: Builder(
          builder: (context) {
            return IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () async {
                Scaffold.of(context).openDrawer();
              },
            );
          },
        ),
      ),
      drawer: CustomDrawer(),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 1.0,
                vertical: 1.0,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  SizedBox(
                    width: 250,
                    child: TextField(
                      controller: _initialDebtController,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: 'InitialDebt',
                        hintText: 'Enter Your Initial Debt',
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  SizedBox(
                    width: 250,
                    child: TextField(
                      controller: _initialAmountController,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: 'Initial Amount',
                        hintText: 'Enter Your Initial Amount',
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  _isLoading
                    ? CircularProgressIndicator()
                    : ElevatedButton(
                    onPressed: () async {
                      setState(() => _isLoading = true);
                        try {
                            // Parse inputs to integers
                            final initialDebt = int.tryParse(_initialDebtController.text) ?? 0;
                            final initialAmount = int.tryParse(_initialAmountController.text) ?? 0;
                            
                            await authProvider.AddInitial(initialDebt, initialAmount);
                            
                            if (authProvider.addedInitial) {
                              Navigator.pushNamed(context, '/analytics');
                            }
                          } finally {
                            setState(() => _isLoading = false);
                          }
                    },
                    child: Text(
                      'Add',
                      style: TextStyle(fontSize: 16, color: Colors.black),
                    ),
                    ),
                ]
              ),
            ),
          ),
        ),
      ),
    );
  }
}