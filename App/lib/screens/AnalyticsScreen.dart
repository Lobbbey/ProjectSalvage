import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/widgets/analytics.dart';
import 'HomeScreen.dart';
import 'package:flutter_application_1/AuthProvider.dart'; // adjust path if needed

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  _AnalyticsScreenState createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final userData = auth.userData ?? {};

    final List<dynamic> incomes = userData['Income'] ?? [];
    final List<dynamic> expenses = userData['Expenses'] ?? [];

    final double totalIncome =
        incomes.fold(0.0, (sum, item) => sum + (item['Amount'] ?? 0));
    final double totalExpenses =
        expenses.fold(0.0, (sum, item) => sum + (item['Amount'] ?? 0));

    final double initialAmount =
        (userData['InitialAmount'] ?? 1).toDouble(); // avoid divide by 0
    final double initialDebt =
        (userData['InitialDebt'] ?? 1).toDouble(); // avoid divide by 0

    final double savingsPercent =
        ((totalIncome - totalExpenses) / initialAmount).clamp(0.0, 1.0);
    final double debtPercent =
        (totalExpenses / initialDebt).clamp(0.0, 1.0);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Salvage Financial'),
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
      ),
      drawer: CustomDrawer(),
      body: DashboardWidget(
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        savingsPercent: savingsPercent,
        debtPercent: debtPercent,
      ),
    );
  }
}
