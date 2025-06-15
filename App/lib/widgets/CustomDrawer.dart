import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/AuthProvider.dart';

class CustomDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    return Drawer(
      child: ListView(
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.blue),
            child: Text('Dashboard'),
          ),
          ListTile(
            title: const Text('Home'),
            onTap: () {
              Navigator.pushNamed(context, '/home');
            },
          ),
          if (!authProvider.isLoggedIn)
            ListTile(
              title: const Text('Login'),
              onTap: () {
                Navigator.pushNamed(context, '/login');
              },
            ),
          if (!authProvider.isLoggedIn)
            ListTile(
              title: const Text('SignUp'),
              onTap: () {
                Navigator.pushNamed(context, '/signup');
              },
            ),
          if (authProvider.isLoggedIn)
            ListTile(
              title: const Text('Income'),
              onTap: () {
                Navigator.pushNamed(context, '/income');
              },
            ),
          if (authProvider.isLoggedIn)
            ListTile(
              title: const Text('Expenses'),
              onTap: () {
                Navigator.pushNamed(context, '/expense');
              },
            ),
          if (authProvider.isLoggedIn)
            ListTile(
              title: const Text('Savings'),
              onTap: () {
                Navigator.pushNamed(context, '/saving');
              },
            ),
          if (authProvider.isLoggedIn)
            ListTile(
              title: const Text('Debts'),
              onTap: () {
                Navigator.pushNamed(context, '/debt');
              },
            ),
          if (authProvider.isLoggedIn)
            ListTile(
              title: const Text('Analytics'),
              onTap: () {
                Navigator.pushNamed(context, '/analytics');
              },
            ),
          if (authProvider.isLoggedIn)
            ListTile(
              title: const Text('Logout'),
              onTap: () async {
                authProvider.logout();
                Navigator.pushNamed(context, '/home');
              },
            ),
        ],
      ),
    );
  }
}