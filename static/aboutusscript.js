// Firebase and Firestore initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc,updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQvGkprrLIhpk5gS1QIfjHF7fjomidHMI",
  authDomain: "vertex-trading-platform.firebaseapp.com",
  projectId: "vertex-trading-platform",
  storageBucket: "vertex-trading-platform.appspot.com",
  messagingSenderId: "570296071360",
  appId: "1:570296071360:web:583bf8b724f8d224c1e925"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, onAuthStateChanged, doc, setDoc, updateDoc, getDoc };

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  const googleLogin = document.getElementById("google-login-btn");
  
  if (googleLogin) {
    googleLogin.addEventListener("click", function () {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          console.log(user);

          const userDoc = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDoc);

          if (!userDocSnap.exists()) {
            // Create a new document for new users
            await setDoc(userDoc, {
              firstName: user.displayName.split(' ')[0],
              lastName: user.displayName.split(' ')[1] || '',
              email: user.email,
            
              balance: 1000000,
              orders: [] // Initialize an empty orders array for new users
            });
          }

          window.location.href = "/dashboard";  // Redirect to a specific Flask route
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Error during sign in:", errorCode, errorMessage);
        });
    });
  } else {
    console.error('Google login button not found.');
  }
});
