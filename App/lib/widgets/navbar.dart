import 'package:flutter/material.dart';
import 'package:flutter_application_1/screens/IncomeScreen.dart';
import 'package:flutter_application_1/screens/AnalyticsScreen.dart';
import 'package:flutter_application_1/screens/DebtScreen.dart';
import 'package:flutter_application_1/screens/ExpenseScreen.dart';
import 'package:flutter_application_1/screens/LoginScreen.dart';
import 'package:flutter_application_1/screens/SignUpScreen.dart';
import 'package:flutter_application_1/AuthProvider.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/widgets/CustomDrawer.dart';

class PersistentNavScaffold extends StatefulWidget {
  const PersistentNavScaffold({super.key});

  @override
  State<PersistentNavScaffold> createState() => _PersistentNavScaffoldState();
}

class _PersistentNavScaffoldState extends State<PersistentNavScaffold> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    IncomeScreen(),
    ExpenseScreen(),
    AnalyticsScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        final isLoggedIn = authProvider.isLoggedIn;

        return Scaffold(
          drawer: CustomDrawer(),
          body: IndexedStack(
            index: _selectedIndex,
            children:
                isLoggedIn
                    ? [
                      IncomeScreen(),
                      ExpenseScreen(),
                      AnalyticsScreen(),
                    ]
                    : [
                      LoginScreen(), 
                      SignUpScreen()
                    ],
          ),
          bottomNavigationBar: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            currentIndex: _selectedIndex,
            selectedItemColor: Colors.blue,
            unselectedItemColor: Colors.grey,
            onTap: (index) {
              setState(() {
                _selectedIndex = index;
              });
            },
            items:
                isLoggedIn
                    ? const [
                      BottomNavigationBarItem(
                        icon: Icon(Icons.attach_money),
                        label: "Income",
                      ),
                      BottomNavigationBarItem(
                        icon: Icon(Icons.money_off),
                        label: "Exspense",
                      ),
                      BottomNavigationBarItem(
                        icon: Icon(Icons.analytics),
                        label: "Analytics",
                      ),
                    ]
                    : const [
                      BottomNavigationBarItem(
                        icon: Icon(Icons.login),
                        label: "Login",
                      ),
                      BottomNavigationBarItem(
                        icon: Icon(Icons.person_add),
                        label: "Sign Up",
                      ),
                    ],
          ),
        );
      },
    );
  }
}
