// lib/qr_scanner_page.dart
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class QRScannerPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Scan Location QR Code')),
      body: MobileScanner(
        onDetect: (capture) {
          final List<Barcode> barcodes = capture.barcodes;
          if (barcodes.isNotEmpty) {
            final String? scannedValue = barcodes.first.rawValue;
            if (scannedValue != null) {
              // Return the scanned data to the previous page
              Navigator.of(context).pop(scannedValue);
            }
          }
        },
      ),
    );
  }
}