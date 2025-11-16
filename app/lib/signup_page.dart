// lib/signup_page.dart
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cross_head/data_collection_page.dart';

class SignUpPage extends StatefulWidget {
  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _agreeToTerms = false;
  bool _isLoading = false;

  Future<void> _signUp() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('You must agree to the terms and conditions'), backgroundColor: Colors.red));
      return;
    }

    setState(() { _isLoading = true; });
    try {
      final response = await Supabase.instance.client.auth.signUp(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      if (response.user != null) {
        Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => DataCollectionPage()));
      }
    } on AuthException catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message), backgroundColor: Colors.red));
    } finally {
      if(mounted) setState(() { _isLoading = false; });
    }
  }

  /// Signs up the user with Google OAuth
  Future<void> _googleSignUp() async {
    if (!_agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('You must agree to the terms and conditions'), backgroundColor: Colors.red),
      );
      return;
    }

    try {
      await Supabase.instance.client.auth.signInWithOAuth(
        OAuthProvider.google,
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
                  Image.asset('assets/images/crossheadlogo.PNG', height: 80),
                  SizedBox(height: 24),
                  Text('Welcome', style: Theme.of(context).textTheme.headlineSmall, textAlign: TextAlign.center),
                  SizedBox(height: 8),
                  Text('Create your CrossHead account', style: Theme.of(context).textTheme.bodyMedium, textAlign: TextAlign.center),
                  SizedBox(height: 32),
                  TextFormField(
                    controller: _emailController,
                    decoration: InputDecoration(labelText: 'Institute Email Address'),
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) => value!.isEmpty ? 'Please enter an email' : null,
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    decoration: InputDecoration(labelText: 'Password *'),
                    obscureText: true,
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Please enter a password';
                      if (value.length < 6) return 'Password must be at least 6 characters';
                      return null;
                    },
                  ),
                  SizedBox(height: 16),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Checkbox(value: _agreeToTerms, onChanged: (val) => setState(() => _agreeToTerms = val!)),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(top: 12.0),
                          child: RichText(
                            text: TextSpan(
                              text: 'I agree to the ',
                              style: DefaultTextStyle.of(context).style.copyWith(fontSize: 14),
                              children: <TextSpan>[
                                TextSpan(
                                  text: 'terms and conditions',
                                  style: TextStyle(color: Colors.blue, fontSize: 14),
                                  recognizer: TapGestureRecognizer()..onTap = () {},
                                ),
                                TextSpan(text: ' and '),
                                TextSpan(
                                  text: 'Privacy Policy',
                                  style: TextStyle(color: Colors.blue, fontSize: 14),
                                  recognizer: TapGestureRecognizer()..onTap = () {},
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  _isLoading
                      ? Center(child: CircularProgressIndicator())
                      : ElevatedButton(
                    onPressed: _signUp,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade700,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Text('Sign Up'),
                  ),
                  SizedBox(height: 16),
                  OutlinedButton.icon(
                    icon: Image.asset(
                      'assets/images/google-logo.png',
                      height: 35,
                      width: 35,
                    ),
                    onPressed: _googleSignUp,
                    label: Text('Sign up with Google'),
                    style: OutlinedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                  SizedBox(height: 16),
                  Row(children: [Expanded(child: Divider()), Padding(padding: EdgeInsets.symmetric(horizontal: 8), child: Text('or')), Expanded(child: Divider())]),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Already have an account?'),
                      TextButton(onPressed: () => Navigator.of(context).pop(), child: Text('Sign in')),
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