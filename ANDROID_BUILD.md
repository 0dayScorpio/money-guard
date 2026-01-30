# NotaGuard - Android Build Guide

## Prerequisites

- Node.js 18+ and npm
- Android Studio (latest stable version)
- JDK 17+
- Android SDK (API 34)

## Initial Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd notaguard
npm install
```

### 2. Add Android Platform

```bash
npx cap add android
npx cap update android
```

### 3. Build and Sync

```bash
npm run build
npx cap sync android
```

## Development Testing

### Run on Emulator or Device

```bash
npx cap run android
```

Or open in Android Studio:

```bash
npx cap open android
```

## Production Build (Google Play)

### 1. Generate Upload Keystore

First time only - create a signing keystore:

```bash
keytool -genkey -v -keystore notaguard-upload-key.keystore -alias notaguard-upload -keyalg RSA -keysize 2048 -validity 10000
```

**IMPORTANT:** Keep this keystore file safe! You'll need it for all future updates.

### 2. Configure Signing

1. Copy `keystore.properties.template` to `keystore.properties`
2. Update with your actual keystore credentials:

```properties
NOTAGUARD_UPLOAD_STORE_FILE=/path/to/notaguard-upload-key.keystore
NOTAGUARD_UPLOAD_STORE_PASSWORD=your_actual_password
NOTAGUARD_UPLOAD_KEY_ALIAS=notaguard-upload
NOTAGUARD_UPLOAD_KEY_PASSWORD=your_actual_password
```

**Never commit keystore.properties to git!**

### 3. Build Release AAB

```bash
# Build the web app
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android
```

In Android Studio:
1. Go to **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Select your keystore and enter credentials
4. Choose **release** build variant
5. Click **Create**

The AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

### 4. Alternative: Command Line Build

```bash
cd android
./gradlew bundleRelease
```

## Camera Permissions

The app requests camera permission at runtime. The `@capacitor/camera` plugin handles:
- Runtime permission requests on Android 6+
- Proper permission dialogs
- Fallback handling if denied

## Troubleshooting

### Camera Not Working
- Ensure the device has a camera
- Check app permissions in device settings
- Clear app data and try again

### Build Failures
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Hot Reload During Development
The `capacitor.config.ts` is configured to connect to the Lovable preview server for live development. For production, comment out the `server` block.

## App Store Checklist

Before uploading to Google Play:
- [ ] Update `versionCode` and `versionName` in `android/app/build.gradle`
- [ ] Test on multiple device sizes
- [ ] Test camera functionality
- [ ] Verify all features work offline (if applicable)
- [ ] Prepare store listing assets (screenshots, descriptions)
- [ ] Generate signed AAB file
