// lib/my_pass_widget.dart
import 'package:flutter/material.dart';

class MyPassWidget extends StatelessWidget {
  final Map<String, dynamic> activePassData;
  final VoidCallback onSignOff; // Callback function for signing off

  const MyPassWidget({
    Key? key,
    required this.activePassData,
    required this.onSignOff,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Safely access data from the map
    final String locationName = activePassData['details'] ?? 'Unknown Location';
    final String entryTime = activePassData['entry_time'] != null
        ? DateTime.parse(activePassData['entry_time']).toLocal().toString()
        : 'N/A';

    return Container(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Active Pass', style: Theme.of(context).textTheme.headlineSmall, textAlign: TextAlign.center),
          SizedBox(height: 24),
          ListTile(
            leading: Icon(Icons.location_pin, color: Colors.blue),
            title: Text('Location'),
            subtitle: Text(locationName, style: Theme.of(context).textTheme.titleLarge),
          ),
          ListTile(
            leading: Icon(Icons.access_time, color: Colors.green),
            title: Text('Entry Time'),
            subtitle: Text(entryTime, style: Theme.of(context).textTheme.titleLarge),
          ),
          SizedBox(height: 32),
          ElevatedButton(
            onPressed: onSignOff,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              padding: EdgeInsets.symmetric(vertical: 16),
            ),
            child: Text('Sign Off'),
          ),
        ],
      ),
    );
  }
}