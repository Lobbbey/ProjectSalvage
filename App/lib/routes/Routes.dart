import 'package:flutter/material.dart';
import 'package:flutter_application_1/screens/LoginScreen.dart';
import 'package:flutter_application_1/screens/IncomeScreen.dart';
import 'package:flutter_application_1/screens/ExpenseScreen.dart';
import 'package:flutter_application_1/screens/AnalyticsScreen.dart';
import 'package:flutter_application_1/screens/SignUpScreen.dart';
import 'package:flutter_application_1/screens/HomeScreen.dart';
import 'package:flutter_application_1/screens/AddInitialScreen.dart';
import 'package:flutter_application_1/screens/DebtScreen.dart';
import 'package:flutter_application_1/screens/SavingScreen.dart';



class Routes {
  static const String LOGINSCREEN = '/login';
  static const String INCOMESCREEN = '/income';
  static const String EXPENSESCREEN = '/expense';
  static const String SAVINGSCREEN = '/saving';
  static const String DEBTSCREEN = '/debt';
  static const String ANALYTICSSCREEN = '/analytics';
  static const String HOMESCREEN = '/home';
  static const String SIGNUPSCREEN = '/signup';
  static const String ADDINITIALSCREEN = '/initial';


  // routes of pages in the app
  static Map<String, Widget Function(BuildContext)> get getroutes => {
    HOMESCREEN: (context) => HomeScreen(),
    LOGINSCREEN: (context) => LoginScreen(),
    ADDINITIALSCREEN: (context) => AddInitialScreen(),
    SIGNUPSCREEN: (context) => SignUpScreen(),
    INCOMESCREEN: (context) => IncomeScreen(),
    EXPENSESCREEN: (context) => ExpenseScreen(),
    SAVINGSCREEN: (context) => SavingScreen(),
    DEBTSCREEN: (context) => DebtScreen(),
    ANALYTICSSCREEN: (context) => AnalyticsScreen(),
  };
}
