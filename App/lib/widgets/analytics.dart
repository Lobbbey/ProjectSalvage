import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:percent_indicator/percent_indicator.dart';

class DashboardWidget extends StatelessWidget {
  final double totalIncome;
  final double totalExpenses;
  final double savingsPercent;
  final double debtPercent;

  const DashboardWidget({
    super.key,
    required this.totalIncome,
    required this.totalExpenses,
    required this.savingsPercent,
    required this.debtPercent,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Text(
            'Financial Overview',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              SizedBox(
                width: 150,
                height: 150,
                child: PieChart(
                  PieChartData(
                    sectionsSpace: 2,
                    centerSpaceRadius: 30,
                    sections: [
                      PieChartSectionData(
                        color: Colors.green,
                        value: totalIncome,
                        title: 'Income',
                        radius: 60,
                        titleStyle: const TextStyle(color: Colors.white, fontSize: 14),
                      ),
                      PieChartSectionData(
                        color: Colors.red,
                        value: totalExpenses,
                        title: 'Expenses',
                        radius: 60,
                        titleStyle: const TextStyle(color: Colors.white, fontSize: 14),
                      ),
                    ],
                  ),
                ),
              ),
              Column(
                children: [
                  CircularPercentIndicator(
                    radius: 60.0,
                    lineWidth: 10.0,
                    animation: true,
                    percent: savingsPercent,
                    center: Text("${(savingsPercent * 100).toStringAsFixed(0)}%"),
                    footer: const Text("Savings Goal"),
                    progressColor: Colors.blue,
                    backgroundColor: Colors.grey[300]!,
                  ),
                  const SizedBox(height: 20),
                  CircularPercentIndicator(
                    radius: 60.0,
                    lineWidth: 10.0,
                    animation: true,
                    percent: debtPercent,
                    center: Text("${(debtPercent * 100).toStringAsFixed(0)}%"),
                    footer: const Text("Debt Paid"),
                    progressColor: Colors.purple,
                    backgroundColor: Colors.grey[300]!,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
