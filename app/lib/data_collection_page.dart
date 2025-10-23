// lib/data_collection_page.dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cross_head/home_page.dart';

class DataCollectionPage extends StatefulWidget {
  @override
  _DataCollectionPageState createState() => _DataCollectionPageState();
}

class _DataCollectionPageState extends State<DataCollectionPage> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _mobileNoController = TextEditingController();
  final _rollNoController = TextEditingController();
  final _roomIdController = TextEditingController();

  String? _gender;
  String? _department;
  String? _course;
  String? _currentYear;
  String? _currentSemester;
  bool _isLoading = false;

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; });

    final userId = Supabase.instance.client.auth.currentUser!.id;
    final data = {
      'id': userId,
      'full_name': _fullNameController.text,
      'mobile_no': _mobileNoController.text,
      'gender': _gender,
      'department': _department,
      'course': _course,
      'roll_no': _rollNoController.text,
      'current_year': _currentYear,
      'current_semester': _currentSemester,
      'room_id': _roomIdController.text,
      'updated_at': DateTime.now().toIso8601String(),
    };

    try {
      await Supabase.instance.client.from('profiles').upsert(data);
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => HomePage()));
    } on PostgrestException catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message), backgroundColor: Colors.red));
    } finally {
      if(mounted) setState(() { _isLoading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Complete Your Profile'),
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
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
                  Image.asset('assets/images/crossheadlogo.PNG', height: 60),
                  SizedBox(height: 20),
                  Text('Fill up your details', style: Theme.of(context).textTheme.headlineSmall, textAlign: TextAlign.center),
                  SizedBox(height: 30),
                  // Form Fields
                  TextFormField(controller: _fullNameController, decoration: InputDecoration(labelText: 'Full Name *'), validator: (val) => val!.isEmpty ? 'Required' : null),
                  SizedBox(height: 16),
                  TextFormField(controller: _mobileNoController, decoration: InputDecoration(labelText: 'Mobile No *'), keyboardType: TextInputType.phone, validator: (val) => val!.isEmpty ? 'Required' : null),
                  SizedBox(height: 16),
                  DropdownButtonFormField(value: _gender, items: ['Male', 'Female', 'Other'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(), onChanged: (val) => setState(() => _gender = val), decoration: InputDecoration(labelText: 'Gender *'), validator: (val) => val == null ? 'Required' : null),
                  SizedBox(height: 16),
                  DropdownButtonFormField(value: _department, items: ['Engineering', 'Arts', 'Science'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(), onChanged: (val) => setState(() => _department = val), decoration: InputDecoration(labelText: 'Department *'), validator: (val) => val == null ? 'Required' : null),
                  SizedBox(height: 16),
                  DropdownButtonFormField(value: _course, items: ['CSE', 'ECE', 'Mechanical'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(), onChanged: (val) => setState(() => _course = val), decoration: InputDecoration(labelText: 'Course *'), validator: (val) => val == null ? 'Required' : null),
                  SizedBox(height: 16),
                  TextFormField(controller: _rollNoController, decoration: InputDecoration(labelText: 'Roll No *'), validator: (val) => val!.isEmpty ? 'Required' : null),
                  SizedBox(height: 16),
                  DropdownButtonFormField(value: _currentYear, items: ['1st', '2nd', '3rd', '4th'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(), onChanged: (val) => setState(() => _currentYear = val), decoration: InputDecoration(labelText: 'Current year *'), validator: (val) => val == null ? 'Required' : null),
                  SizedBox(height: 16),
                  DropdownButtonFormField(value: _currentSemester, items: ['1', '2', '3', '4', '5', '6', '7', '8'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(), onChanged: (val) => setState(() => _currentSemester = val), decoration: InputDecoration(labelText: 'Current semester'), validator: (val) => val == null ? 'Required' : null),
                  SizedBox(height: 16),
                  TextFormField(controller: _roomIdController, decoration: InputDecoration(labelText: 'Room ID')),
                  SizedBox(height: 24),
                  _isLoading
                      ? Center(child: CircularProgressIndicator())
                      : ElevatedButton(
                    onPressed: _saveProfile,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade700,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Text('Save and Continue'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}