
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
auth.languageCode = 'en'

const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click", function () {

  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log(user);
      window.location.href = "loggedIn.html";


    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    })


})





