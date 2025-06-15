import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/AuthProvider.dart'; 
import 'HomeScreen.dart';

class SignUpScreen extends StatelessWidget {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();

  // Email regex pattern
  static final RegExp _emailRegExp = RegExp(
    r'^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$',
  );

  // Password regex pattern ( At least 1 number, 1 symbol, and a minimum of 8 characters)
  static final RegExp _passwordRegExp = RegExp(
    r'^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$',
  );

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Salvage Financials'),
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
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _firstNameController,
              decoration: InputDecoration(
                labelText: 'First Name',
              ),
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: _lastNameController,
              decoration: InputDecoration(
                labelText: 'Last Name',
              ),
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: 'Email',
                errorText: _emailController.text.isNotEmpty && !_emailRegExp.hasMatch(_emailController.text)
                    ? 'Please enter a valid email'
                    : null,
              ),
              onChanged: (value) {
                // Trigger rebuild when email changes to show/hide error
                (context as Element).markNeedsBuild();
              },
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Password',
                errorText: _passwordController.text.isNotEmpty && !_passwordRegExp.hasMatch(_passwordController.text)
                    ? 'Password must be at least 8 characters with at least one symbol and one number'
                    : null,
              ),
              onChanged: (value) {
                // Trigger rebuild when password changes to show/hide error
                (context as Element).markNeedsBuild();
              },
            ),
            SizedBox(height: 24.0),
            ElevatedButton(
              onPressed: () async {
                // Validate fields before proceeding
                if (!_emailRegExp.hasMatch(_emailController.text)) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Please enter a valid email address'),
                    ),
                  );
                  return;
                }

                if (!_passwordRegExp.hasMatch(_passwordController.text)) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Password must be at least 8 characters with at least one letter and one number'),
                    ),
                  );
                  return;
                }

                if (_firstNameController.text.isEmpty || _lastNameController.text.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Please enter your first and last name'),
                    ),
                  );
                  return;
                }

                try {
                  // Call the API for sign-up
                  await authProvider.signUp(
                    _firstNameController.text.trim(),
                    _lastNameController.text.trim(),
                    _emailController.text.trim(),
                    _passwordController.text.trim(),
                  );
                  // Navigate to the home page after successful sign-up
                  Navigator.pushReplacementNamed(context, '/login');
                } catch (e) {
                  // Show error message
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(e.toString()),
                    ),
                  );
                }
              },
              child: Text('Sign Up'),
            ),
          ],
        ),
      ),
    );
  }
}