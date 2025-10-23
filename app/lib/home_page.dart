// lib/home_page.dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cross_head/login_page.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  Map<String, dynamic>? _profile;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _getProfile();
  }

  Future<void> _getProfile() async {
    setState(() => _isLoading = true);
    try {
      final userId = Supabase.instance.client.auth.currentUser!.id;
      final response = await Supabase.instance.client.from('profiles').select().eq('id', userId).single();
      setState(() {
        _profile = response;
        _isLoading = false;
      });
    } on PostgrestException catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message), backgroundColor: Colors.red));
      setState(() => _isLoading = false);
    }
  }

  Future<void> _signOut() async {
    await Supabase.instance.client.auth.signOut();
    Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => LoginPage()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Image.asset('assets/images/crossheadlogo.png'),
        ),
        actions: [
          IconButton(onPressed: _signOut, icon: Icon(Icons.logout)),
        ],
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _profile == null
          ? Center(child: Text('Could not load profile. Please try again.'))
          : Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 60,
              child: Icon(Icons.person, size: 60),
            ),
            SizedBox(height: 24),
            Text(
              _profile!['full_name'] ?? 'N/A',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            SizedBox(height: 8),
            Text(
              '${_profile!['course'] ?? 'Course'} in ${_profile!['department'] ?? 'Dept.'}',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.grey[600]),
            ),
            Spacer(),
            OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                minimumSize: Size(double.infinity, 50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text('Generate passes / My Pass'),
            ),
            SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}