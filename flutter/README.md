# Flutter - Mobile Application

This directory will contain the Flutter mobile application code for the User Service.

## Structure

```
flutter/
├── android/       # Android-specific code
├── ios/          # iOS-specific code
├── lib/          # Dart source code
│   ├── models/   # Data models
│   ├── screens/  # UI screens
│   ├── services/ # API services
│   ├── widgets/  # Reusable widgets
│   └── main.dart # Application entry point
├── test/         # Unit and widget tests
├── pubspec.yaml  # Dependencies
└── README.md     # This file
```

## Getting Started

Instructions for setting up and running the Flutter mobile application will be added here.

## Prerequisites

- Flutter SDK 3.0+
- Dart 2.17+
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Development

```bash
# Install dependencies
flutter pub get

# Run the app (development)
flutter run

# Run tests
flutter test

# Build for Android
flutter build apk

# Build for iOS
flutter build ios
```

## Technology Stack

- Flutter Framework
- Dart programming language
- HTTP package for API calls
- Provider or Riverpod for state management
- SharedPreferences for local storage

## Documentation

For more information, see the main project documentation in the `/docs` directory.
