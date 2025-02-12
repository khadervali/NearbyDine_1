# README - Nearby Dine App Development

## **Project Overview**
Nearby Dine is a hybrid mobile application built using React Native or Flutter, designed to help users find nearby restaurants based on their location. The app integrates Google Authentication, Google Places API, and Google Maps API to provide a seamless experience.

## **Step-by-Step Development Process**

### **1. Project Setup**

#### **1.1 Prerequisites**
- Node.js & npm (for React Native) or Flutter SDK (for Flutter)
- Android Studio / Xcode (for emulator or real device testing)
- Firebase Account (for Google Authentication)
- Google Cloud Account (for Places & Maps APIs)

#### **1.2 Initialize the Project**
**For React Native:**
```sh
npx react-native init NearbyDine
cd NearbyDine
npm install
```

**For Flutter:**
```sh
flutter create NearbyDine
cd NearbyDine
flutter pub get
```

### **2. Configure Firebase Authentication**
1. Create a new project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Google Authentication** in Firebase Authentication settings.
3. Download and add the **google-services.json** (for Android) and **GoogleService-Info.plist** (for iOS) to the project.

#### **2.1 Install Firebase SDK**
**For React Native:**
```sh
npm install @react-native-firebase/app @react-native-firebase/auth
```

**For Flutter:**
```sh
flutter pub add firebase_auth firebase_core
```

### **3. Implement Google Authentication**
- Configure Firebase authentication for **React Native** using `@react-native-google-signin/google-signin`.
- Configure Firebase authentication for **Flutter** using `google_sign_in` package.

### **4. Fetch Nearby Restaurants**
1. Enable **Google Places API** and **Google Maps API** from Google Cloud Console.
2. Generate an **API key** and restrict it for security.
3. Install necessary packages:

**For React Native:**
```sh
npm install react-native-maps axios
```

**For Flutter:**
```sh
flutter pub add google_maps_flutter http
```

4. Fetch restaurant data using Google Places API.

```javascript
axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=LATITUDE,LONGITUDE&radius=1500&type=restaurant&key=API_KEY`)
```

### **5. Display Restaurants in List & Map View**
- Implement a **FlatList** (React Native) or **ListView.builder** (Flutter) to display restaurant details.
- Use **react-native-maps** or **google_maps_flutter** to show restaurant locations on a map.

### **6. Implement Search & Filters**
- Add a search bar to filter restaurants by name or cuisine.
- Implement sorting options by **rating** or **distance**.

### **7. Implement Favorites & History (For Logged-in Users)**
- Save favorite restaurants to Firebase Firestore.
- Display a history of previously viewed restaurants.

### **8. Testing & Deployment**
#### **8.1 Testing on Devices & Emulators**
```sh
# For React Native
react-native run-android
react-native run-ios
```
```sh
# For Flutter
flutter run
```

#### **8.2 App Store & Play Store Deployment**
- **iOS:** Configure `App Store Connect`, update `Info.plist`, and generate an **App Store build**.
- **Android:** Configure `AndroidManifest.xml`, sign the app, and upload to **Google Play Console**.

---

## **Future Enhancements**
- Add user reviews & ratings.
- Implement table booking via third-party APIs.
- Improve UI/UX with animations and dark mode.

---

## **Contributing**
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## **License**
[MIT License](LICENSE)
