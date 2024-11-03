import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = firebase.firestore();
  
    window.addEventListener('load', async function (){
      await Clerk.load()
  
      if (Clerk.user) {
        document.getElementById('page-content').style.pointerEvents = 'auto';
        document.getElementById('body').innerHTML = `
          <div id="user-button"></div>
        `;
        const user = Clerk.user;
        const username = user.username || user.firstName || user.emailAddress || 'User';
        const userButtonDiv = document.getElementById('user-button');
        document.getElementById('user-info').innerHTML = `
          <div id ="info">Welcome, ${username} !!</div>
          <style>
            #info{
              color:white;
            }
            </style>
          `
          try {
          const token = await Clerk.session.getToken({ template: 'integration_firebase' });
          const userCredentials = await signInWithCustomToken(auth, token);
          console.log('User signed into Firebase:', userCredentials.user);
        } catch (error) {
          console.error('Error signing into Firebase:', error);
        }
  
        Clerk.mountUserButton(userButtonDiv);
      } 
      else {
        document.getElementById('page-content').style.pointerEvents = 'none';
        Clerk.openSignUp({ 
            afterSignInUrl: window.location.href, 
            afterSignUpUrl: window.location.href 
        });
       /* Clerk.openSignIn({
            afterSignInUrl: window.location.href,
            afterSignUpUrl: window.location.href
          }); */ 
      }
    })