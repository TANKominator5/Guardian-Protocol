// lib/login_page.dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cross_head/signup_page.dart';
import 'package:cross_head/data_collection_page.dart';
import 'package:cross_head/home_page.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  /// Signs in the user with email and password
  Future<void> _signIn() async {
    // Validate the form
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await Supabase.instance.client.auth.signInWithPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      // If sign-in is successful, check the user's profile to redirect
      if (response.user != null && mounted) {
        await _checkUserProfile();
      }
    } on AuthException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message), backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('An unexpected error occurred.'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  /// Signs in the user with Google OAuth
  Future<void> _googleSignIn() async {
    try {
      await Supabase.instance.client.auth.signInWithOAuth(
        OAuthProvider.google,
        // This MUST match the scheme you configured in the native files (Android & iOS)
        redirectTo: 'io.supabase.crossheadapp://login-callback/',
      );
    } on AuthException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message), backgroundColor: Colors.red),
        );
      }
    }
  }

  /// Checks if the user has a profile and redirects accordingly
  Future<void> _checkUserProfile() async {
    final userId = Supabase.instance.client.auth.currentUser!.id;
    try {
      final response = await Supabase.instance.client
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .maybeSingle(); // Use maybeSingle to prevent error if no row is found

      // If no profile exists or the name is null, user needs to fill details
      if (response == null || response['full_name'] == null) {
        if (mounted) {
          Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => DataCollectionPage()));
        }
      } else {
        // Otherwise, the user has a profile and can go to the home page
        if (mounted) {
          Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => HomePage()));
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error checking profile.'), backgroundColor: Colors.red),
        );
        // Fallback to data collection page on error
        Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => DataCollectionPage()));
      }
    }
  }

  @override
  void dispose() {
    // Clean up the controllers when the widget is removed from the widget tree
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: 400),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Image.asset('assets/images/crossheadlogo.png', height: 80),
                  SizedBox(height: 24),
                  Text('Sign in to your account', style: Theme.of(context).textTheme.headlineSmall, textAlign: TextAlign.center),
                  SizedBox(height: 8),
                  Text('to continue to CrossHead', style: Theme.of(context).textTheme.bodyMedium, textAlign: TextAlign.center),
                  SizedBox(height: 32),
                  TextFormField(
                    controller: _emailController,
                    decoration: InputDecoration(labelText: 'Institute Email Address'),
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) => value == null || value.isEmpty ? 'Please enter an email' : null,
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    decoration: InputDecoration(labelText: 'Password *'),
                    obscureText: true,
                    validator: (value) => value == null || value.isEmpty ? 'Please enter a password' : null,
                  ),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // You can add state management for this checkbox if needed
                      Row(children: [Checkbox(value: false, onChanged: (val){}), Text('Remember me')]),
                      TextButton(onPressed: (){}, child: Text('Forgot Password?')),
                    ],
                  ),
                  SizedBox(height: 16),
                  _isLoading
                      ? Center(child: CircularProgressIndicator())
                      : ElevatedButton(
                    onPressed: _signIn,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade700,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Text('Sign In'),
                  ),
                  SizedBox(height: 16),
                  OutlinedButton.icon(
                    // You need a google logo in 'assets/images/google_logo.png'
                    icon: Image.asset('assets/images/google_logo.png', height: 20),
                    onPressed: _googleSignIn,
                    label: Text('Sign in with google'),
                    style: OutlinedButton.styleFrom(padding: EdgeInsets.symmetric(vertical: 12), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                  ),
                  SizedBox(height: 16),
                  Row(children: [
                    Expanded(child: Divider()),
                    Padding(padding: EdgeInsets.symmetric(horizontal: 8), child: Text('or')),
                    Expanded(child: Divider())
                  ]),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Need to create an account?'),
                      TextButton(
                        onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => SignUpPage())),
                        child: Text('Sign Up'),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}