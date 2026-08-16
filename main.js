// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
import { getAuth ,GoogleAuthProvider ,signInWithPopup} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO3B3jf2ma81PhLZunnf-NMFXzkaI5N5c",
  authDomain: "trimetrics-188e8.firebaseapp.com",
  projectId: "trimetrics-188e8",
  storageBucket: "trimetrics-188e8.firebasestorage.app",
  messagingSenderId: "593943192399",
  appId: "1:593943192399:web:ba65abed5b7f57c5aedb3a",
  measurementId: "G-D6B2WBKCTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();


const googleLoginButton = document.getElementById("google-login-button");
googleLoginButton.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        window.location.href = "dashboard.html"; // Redirect to dashboard after successful login
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;        
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
    });



})

function updateUI(user) {
  if (user) {
    // User is signed in.
    console.log("User is signed in:", user);
    // You can update the UI to show user information or redirect to another page.
  } else {
    // User is signed out.
    console.log("User is signed out.");
    // You can update the UI to show a sign-in button or redirect to the login page.
  }
}
