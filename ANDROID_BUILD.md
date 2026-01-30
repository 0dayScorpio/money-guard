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

### 1. Generate Upload Keystore (First Time Only)

```bash
cd android
keytool -genkey -v -keystore notaguard-upload-key.keystore -alias notaguard-upload -keyalg RSA -keysize 2048 -validity 10000
```

**CRITICAL:** Keep this keystore file safe! You need it for ALL future app updates.

### 2. Configure Signing

```bash
# Copy the template
cp keystore.properties.template keystore.properties

# Edit with your credentials
nano keystore.properties
```

Update `keystore.properties` with your actual values:

```properties
NOTAGUARD_UPLOAD_STORE_FILE=notaguard-upload-key.keystore
NOTAGUARD_UPLOAD_STORE_PASSWORD=your_actual_password
NOTAGUARD_UPLOAD_KEY_ALIAS=notaguard-upload
NOTAGUARD_UPLOAD_KEY_PASSWORD=your_actual_password
```

**⚠️ NEVER commit keystore.properties to git!**

### 3. Build Signed AAB (Command Line)

```bash
# From project root
npm run build
npx cap sync android

# Build signed AAB
cd android
./gradlew bundleRelease
```

### 4. Output Location

The signed AAB file will be at:

```
android/app/build/outputs/bundle/release/app-release.aab
```

### 5. Verify the AAB is Signed

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

## Runtime Permissions (Android 12-14)

The app handles these runtime permissions via `@capacitor/camera`:

| Permission | Android Version | Purpose |
|------------|-----------------|---------|
| `CAMERA` | All | Live scanning & photo capture |
| `READ_EXTERNAL_STORAGE` | ≤ API 32 | Gallery access |
| `READ_MEDIA_IMAGES` | API 33+ | Gallery access (granular) |

The Capacitor Camera plugin automatically:
- Shows native permission dialogs
- Handles permission rationale
- Provides callbacks for denied permissions

## Switching to Production Server

Before final release, update `capacitor.config.ts` to remove the dev server:

```typescript
// Comment out or remove for production:
// server: {
//   url: '...',
//   cleartext: true
// },
```

## Full Build Commands Summary

```bash
# 1. Build web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Build signed AAB
cd android && ./gradlew bundleRelease

# 4. Find AAB at:
# android/app/build/outputs/bundle/release/app-release.aab
```

## Troubleshooting

### "Keystore was tampered with, or password incorrect"
- Double-check passwords in `keystore.properties`
- Ensure keystore file path is correct (relative to `android/` folder)

### Build fails with signing errors
```bash
cd android
./gradlew clean
./gradlew bundleRelease --info
```

### Camera not working on device
1. Check app permissions in device Settings
2. Ensure physical camera exists
3. Clear app data and reinstall

## Version Updates

Before each release, update in `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 2        // Increment for each release
    versionName "1.1.0"  // User-visible version
}
```
