var firebaseConfig = {
  apiKey: "AIzaSyA03B3jf2ma81PhLZunnf-NMFXzkaI5N5c",
  authDomain:"trimetrics-188e8.firebaseapp.com",
  databaseURL: "https://trimetrics-188e8-default-rtdb.firebaseio.com",
  projectId: "trimetrics-188e8",
    storageBucket: "trimetrics-188e8.firebasestorage.app",
    messagingSenderId: "593943192399",
    appId: "1:593943192399:web:2e45ff9d7f166309aedb3a"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();