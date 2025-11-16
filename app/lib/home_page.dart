// lib/home_page.dart
import 'dart:convert';
import 'dart:io';

import 'package:cross_head/qr_scanner_page.dart';
import 'package:cross_head/my_pass_widget.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cross_head/login_page.dart';
import 'package:device_info_plus/device_info_plus.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  Map<String, dynamic>? _profile;
  Map<String, dynamic>? _activePass; // Holds data for the active pass
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initializePage();
  }

  Future<void> _initializePage() async {
    await _getProfile();
    await _fetchActivePass(); // Check for an active pass when the page loads
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _getProfile() async {
    try {
      final userId = Supabase.instance.client.auth.currentUser!.id;
      final response = await Supabase.instance.client.from('profiles').select().eq('id', userId).single();
      if (mounted) setState(() => _profile = response);
    } on PostgrestException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message), backgroundColor: Colors.red));
    }
  }

  /// Checks the 'events' table for a pass with a null exit_time
  Future<void> _fetchActivePass() async {
    try {
      final userId = Supabase.instance.client.auth.currentUser!.id;
      final response = await Supabase.instance.client
          .from('events')
          .select()
          .eq('id', userId)
          .isFilter('exit_time', null) // Check for a pass that hasn't been signed off
          .maybeSingle(); // Use maybeSingle to get one record or null

      if (mounted) setState(() => _activePass = response);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Could not check for active pass."), backgroundColor: Colors.red));
    }
  }

  /// Main function to orchestrate scanning and creating a pass
  Future<void> _scanAndGeneratePass() async {
    // 1. Navigate to scanner and get result
    final scannedData = await Navigator.of(context).push<String>(
      MaterialPageRoute(builder: (context) => QRScannerPage()),
    );

    if (scannedData == null) return; // User canceled the scan

    try {
      // 2. Parse the QR code JSON
      final qrJson = jsonDecode(scannedData) as Map<String, dynamic>;
      final placeName = qrJson['name_of_the_place'] as String?;
      // IMPORTANT: See note below about location_id
      final locationId = qrJson['location_id'] as String?;

      if (placeName == null || locationId == null) {
        throw 'Invalid QR code format.';
      }

      // 3. Get device information
      final deviceInfo = await _getDeviceInfo();
      final userId = Supabase.instance.client.auth.currentUser!.id;
      final currentTime = DateTime.now().toIso8601String();

      // 4. Upsert device data
      await Supabase.instance.client.from('devices').upsert({
        'id': userId,
        'mac_address': deviceInfo['mac_address'],
        'device_type': deviceInfo['device_type'],
        'last_seen': currentTime, // Also handled by trigger, but good to send
      });

      // 5. Insert event data
      await Supabase.instance.client.from('events').insert({
        'id': userId,
        'event_type': 'swipe',
        'location_id': locationId,
        'entry_time': currentTime,
        'details': placeName, // Storing place name in details column
      });

      // 6. Refresh the state to show "My Pass" button
      await _fetchActivePass();

    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error generating pass: ${e.toString()}'), backgroundColor: Colors.red));
    }
  }

  /// Shows the modal with the active pass details
  void _showMyPass() {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return MyPassWidget(
          activePassData: _activePass!,
          onSignOff: _signOutFromPass,
        );
      },
    );
  }

  /// Updates the event with an exit_time
  Future<void> _signOutFromPass() async {
    if (_activePass == null) return;

    Navigator.of(context).pop(); // Close the bottom sheet

    try {
      final eventId = _activePass!['event_id']; // **ASSUMING you have a primary key column `event_id`**
      await Supabase.instance.client
          .from('events')
          .update({'exit_time': DateTime.now().toIso8601String()})
          .eq('event_id', eventId);

      // Refresh the state to change button back to "Generate pass"
      await _fetchActivePass();

    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error signing off: ${e.toString()}'), backgroundColor: Colors.red));
    }
  }

  /// Helper to get device info
  Future<Map<String, String>> _getDeviceInfo() async {
    final deviceInfoPlugin = DeviceInfoPlugin();
    String deviceType = 'Unknown';
    String deviceId = 'unknown';

    if (Platform.isAndroid) {
      final androidInfo = await deviceInfoPlugin.androidInfo;
      deviceType = 'Android ${androidInfo.version.release} (${androidInfo.model})';
      deviceId = androidInfo.id; // Android ID - unique to each device
    } else if (Platform.isIOS) {
      final iosInfo = await deviceInfoPlugin.iosInfo;
      deviceType = 'iOS ${iosInfo.systemVersion} (${iosInfo.utsname.machine})';
      deviceId = iosInfo.identifierForVendor ?? 'unknown'; // iOS identifier
    }

    return {'device_type': deviceType, 'mac_address': deviceId};
  }

  Future<void> _signOut() async {
    await Supabase.instance.client.auth.signOut();
    if(mounted) Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => LoginPage()));
  }

  @override
  Widget build(BuildContext context) {
    // Determine button text and action based on whether a pass is active
    final bool isPassActive = _activePass != null;
    final String buttonText = isPassActive ? 'My Pass' : 'Generate pass';
    final VoidCallback buttonAction = isPassActive ? _showMyPass : _scanAndGeneratePass;

    return Scaffold(
      appBar: AppBar(
        title: Text('CrossHead'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: _signOut,
            tooltip: 'Sign Out',
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _profile == null
          ? Center(child: Text('Could not load profile.'))
          : Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 50,
              child: Icon(Icons.person, size: 50),
            ),
            SizedBox(height: 24),
            Text(
              _profile!['full_name'] ?? 'User',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            SizedBox(height: 8),
            Text(
              _profile!['email'] ?? Supabase.instance.client.auth.currentUser?.email ?? '',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            SizedBox(height: 8),
            Text(
              'Roll: ${_profile!['roll_number'] ?? 'N/A'}',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            Spacer(),
            ElevatedButton(
              onPressed: buttonAction,
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 50),
              ),
              child: Text(buttonText),
            ),
            SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}