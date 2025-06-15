import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/AuthProvider.dart';
import 'package:flutter_application_1/theme/ThemeProvider.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Salvage Financial')),
      drawer: CustomDrawer(),
      body: const Center(child: Text("Welcome to Salvage Financial!")),
    );
  }
}

class CustomDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    bool isDarkMode = themeProvider.isDarkMode;
    return Drawer(
      child: ListView(
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.blue),
            child: Text('Dashboard'),
          ),
          SwitchListTile(
            title: isDarkMode ? const Text("Dark Mode") : const Text("Light Mode"),
            value: isDarkMode,
            onChanged: (val) => themeProvider.toggleTheme(val),
            secondary: Icon(isDarkMode ? Icons.dark_mode : Icons.light_mode),
          ),
          ListTile(
            title: const Text('Home'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushReplacementNamed(context, '/home');
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
                Navigator.pop(context); // close the drawer
                Navigator.pushReplacementNamed(context, '/income'); // or your target screen
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
