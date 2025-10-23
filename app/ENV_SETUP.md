# Environment Variables Setup

This project uses environment variables to securely store API keys and sensitive configuration.

## Setup Instructions

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Get your Supabase credentials**:
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Select your project
   - Go to Settings → API
   - Copy the following:
     - **Project URL** (under Configuration)
     - **anon/public key** (under Project API keys)

3. **Update the .env file**:
   Open `.env` and replace the placeholders:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Important**: Never commit the `.env` file to version control!
   - The `.env` file is already added to `.gitignore`
   - Always use `.env.example` as a template for others

## Files Created

- **`.env`** - Contains your actual API keys (not committed to git)
- **`.env.example`** - Template file showing required variables (committed to git)
- **`ENV_SETUP.md`** - This setup guide

## How It Works

The app loads environment variables in `lib/main.dart`:
```dart
await dotenv.load(fileName: ".env");
await Supabase.initialize(
  url: dotenv.env['SUPABASE_URL'] ?? '',
  anonKey: dotenv.env['SUPABASE_ANON_KEY'] ?? '',
);
```

## Package Used

- **flutter_dotenv** (v5.2.1) - For loading environment variables from .env file

