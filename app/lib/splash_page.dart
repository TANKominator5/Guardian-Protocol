// lib/splash_page.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cross_head/login_page.dart';
import 'package:cross_head/data_collection_page.dart';
import 'package:cross_head/home_page.dart';

class SplashPage extends StatefulWidget {
  @override
  _SplashPageState createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  // Use a StreamSubscription to manage the listener
  late final StreamSubscription<AuthState> _authSubscription;

  @override
  void initState() {
    super.initState();
    _setupAuthListener();
  }

  void _setupAuthListener() {
    // Listen to auth state changes
    _authSubscription = Supabase.instance.client.auth.onAuthStateChange.listen((data) {
      final Session? session = data.session;

      // If the user is signed in, check their profile
      if (session != null) {
        _checkUserProfileAndRedirect();
      } else {
        // If the user is signed out, send them to the login page
        Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => LoginPage()));
      }
    });
  }

  Future<void> _checkUserProfileAndRedirect() async {
    final user = Supabase.instance.client.auth.currentUser;
    if (user == null) {
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => LoginPage()));
      return;
    }

    try {
      // Check if a profile exists
      final response = await Supabase.instance.client
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle to avoid errors if no row is found

      // If no profile exists or the name is null, go to data collection
      if (response == null || response['full_name'] == null) {
        Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => DataCollectionPage()));
      } else {
        // Otherwise, go to the home page
        Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => HomePage()));
      }
    } catch (e) {
      // On any error, default to the data collection page as a safe fallback
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => DataCollectionPage()));
    }
  }

  @override
  void dispose() {
    // VERY IMPORTANT: Cancel the subscription when the widget is disposed
    _authSubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // This page shows a loading indicator while the auth listener is working
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}