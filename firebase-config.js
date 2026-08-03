/**
 * ========================================================================
 * HEALTHIANS® LIVE CLOUD FIRESTORE DATABASE CONFIGURATION
 * Connected to Production Project: gen-lang-client-0690808506
 * ========================================================================
 */

(function() {
  // Production Firebase SDK Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBrMIo12geXVEdhaU1wOxxHMU7sTAM7fa8",
    authDomain: "gen-lang-client-0690808506.firebaseapp.com",
    projectId: "gen-lang-client-0690808506",
    storageBucket: "gen-lang-client-0690808506.firebasestorage.app",
    messagingSenderId: "235301003444",
    appId: "1:235301003444:web:4eaa644848660e344af7e1"
  };

  // Initialize Firebase using Browser Compat SDK
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // Export global database connection handle
    window.healthiansDb = firebase.firestore();
    console.log('✅ Healthians Cloud Firestore Production Backend Connected!');
  } else {
    console.error('⚠️ Firebase SDKs not detected on page.');
  }
})();
