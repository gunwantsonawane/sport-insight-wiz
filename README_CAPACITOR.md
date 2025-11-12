# SportLens AI - Capacitor Mobile Setup

This app is built as a web application that can be converted to a native mobile app using Capacitor.

## Prerequisites

- **Node.js** and **npm** installed
- **For iOS**: Mac with Xcode installed
- **For Android**: Android Studio installed

## Initial Setup

The Capacitor dependencies are already installed. Now follow these steps:

### 1. Export to GitHub and Clone

1. Click the "Export to GitHub" button in Lovable
2. Clone your repository:
```bash
git clone <your-repo-url>
cd sportlens-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Native Platforms

Add iOS and/or Android platforms:

```bash
# For iOS (Mac only)
npx cap add ios

# For Android
npx cap add android
```

### 4. Build the Web App

```bash
npm run build
```

### 5. Sync with Native Projects

```bash
# Update native platform dependencies
npx cap update ios
npx cap update android

# Sync web code to native projects
npx cap sync
```

### 6. Run on Device/Emulator

```bash
# For iOS
npx cap run ios

# For Android
npx cap run android
```

## Development Workflow

When you make changes to your code:

1. **Pull latest changes**: `git pull`
2. **Rebuild**: `npm run build`
3. **Sync**: `npx cap sync`
4. **Run**: `npx cap run ios` or `npx cap run android`

## Features

### Native Capabilities

- **Camera Access**: Direct access to device camera for video recording
- **File Storage**: Save videos locally on the device
- **Full Device Features**: Access to all native APIs through Capacitor plugins

### Hot Reload During Development

The app is configured to connect to the development server:
- URL: `https://f8f0e91c-cd5b-44cc-85bf-e3b4d1a3581a.lovableproject.com`
- This allows you to see changes in real-time while developing in Lovable

### For Production

When ready for production:

1. Remove the `server` configuration from `capacitor.config.ts`
2. Build the app: `npm run build`
3. Sync: `npx cap sync`
4. Run: `npx cap run ios/android`

## OpenAI Integration

The app will use OpenAI's Vision API to analyze sport videos:

1. Enable **Lovable Cloud** in your project
2. Configure the OpenAI API integration
3. Upload videos through the app
4. Get AI-powered coaching suggestions

## Troubleshooting

### iOS Issues
- Make sure Xcode is up to date
- Check that your Apple Developer account is configured
- Run `npx cap open ios` to open in Xcode

### Android Issues
- Ensure Android Studio is installed
- Check that Android SDK is configured
- Run `npx cap open android` to open in Android Studio

### Build Errors
- Clean install: `rm -rf node_modules && npm install`
- Clean native builds: `npx cap sync --clean`

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Lovable Documentation](https://docs.lovable.dev)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
