# APN Atlas VN

A local-first APN profile catalog for Vietnamese MNOs and MVNOs, available as a Progressive Web App and via native Android/iOS wrappers.

- Search carrier APNs, view sources and verification status
- Create and save personal APN profiles
- Export/import JSON backups; Android reference XML is **not** an APN installer
- Works offline after installation / caching
- Android APK builds via GitHub Actions; iOS simulator builds via macOS runner
- Signed iOS IPA requires Apple signing secrets

**Important:** Android/iOS restrict third-party changes to system APN settings. This app cannot directly write APN settings. Some MVNO values are community references rather than official values; the app labels them accordingly.

## Develop

```bash
npm install
npm test
npm run build:site
npm run build:web
```

## Continuous integration

- **Web + Pages**: tests and deploys `site/` to GitHub Pages on each push to `main`. Set **Settings → Pages → Build and deployment → GitHub Actions** once.
- **Android APK**: builds Gradle debug APK, uploads an installable `app-debug.apk` artifact.
- **iOS simulator**: checks iOS build and uploads an unsigned simulator `.app` artifact (not an IPA for physical iPhone).
- **iOS signed IPA**: manual workflow; requires Apple Developer distribution certificate, provisioning profile, team ID and export options in GitHub Actions secrets.

After creating the repo, GitHub Pages is expected at https://danhthanh4182.github.io/apn-atlas-vn/ **only once the Pages workflow actually deploys successfully**.

## iOS signing secrets (Actions → Settings → Secrets and variables)

`APPLE_TEAM_ID`, `IOS_CERTIFICATE_P12_BASE64`, `IOS_CERTIFICATE_PASSWORD`, `IOS_PROVISIONING_PROFILE_BASE64`, `IOS_EXPORT_OPTIONS_PLIST_BASE64`. Never commit actual certificate or profile files.

## License

MIT.

## One-time setup / troubleshooting

1. **Pages:** Visit [Settings → Pages](https://github.com/danhthanh4182/apn-atlas-vn/settings/pages), choose **GitHub Actions** as the publishing source. Until then, the website builds but the deploy job fails with `Get Pages site failed: Not Found`.
2. **Android APK:** Actions → Android APK → latest successful run → Artifacts → `apn-atlas-vn-android-debug`. This is a Gradle-built installable debug build, not a Play Store release.
3. **Signed Android APK:** Set secrets `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. Then manually run **Android signed release APK**.
4. **iOS Simulator:** Actions → iOS simulator build → artifact `apn-atlas-vn-ios-simulator` is for Simulator only. Capacitor 8 uses a Swift Package Manager Xcode project (`ios/App/App.xcodeproj`).
5. **Signed iPhone IPA:** Configure the Apple signing secrets above and manually run **iOS signed IPA**. It cannot produce a device-installable IPA without your Apple provisioning.

### Unsigned iOS IPA for later signing

The **iOS unsigned IPA (for external signing)** workflow runs on each push to `main` and produces `APN-Atlas-VN-unsigned.ipa` for the iOS device architecture. **This IPA is unsigned and cannot be directly installed on an iPhone**; a valid Apple signing identity and provisioning profile (or a compatible external re-signing service/tool) are required. For a ready-to-install IPA, supply signing secrets and run **iOS signed IPA** instead. The iOS Simulator artifact contains a different binary and is not suitable for a physical phone.

## Carrier logo assets

CI downloads and optimizes brand images for the web and native applications using `npm run assets:carriers`, then bundles the PNG files for offline display. Missing assets display a neutral text fallback. Brand artwork is the property of each network operator and **not included in the MIT code license**. See [sources and attribution](assets/carriers/README.md).
