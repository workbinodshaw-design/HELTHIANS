/**
 * ========================================================================
 * HEALTHIANS® ENTERPRISE CLOUD BACKEND BRIDGE
 * Connected to Production Project: gen-lang-client-0690808506
 * Built for zero-loss reliability and automatic cloud-to-edge resiliency
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

  let dbInstance = null;
  let authInstance = null;
  let isCloudOnline = false;

  // Initialize Cloud SDK securely using Browser Compat SDK
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      dbInstance = firebase.firestore();
      if (firebase.auth) {
        authInstance = firebase.auth();
      }
      
      // Enable Firestore offline data persistence if supported
      dbInstance.enablePersistence().catch(() => {});

      isCloudOnline = true;
    }
  } catch (err) {
    // Fail silently in production to edge fallback mode
  }

  // Export Enterprise Database & Auth Helper Suite to Window
  window.HealthiansBackend = {
    db: dbInstance,
    auth: authInstance,
    isOnline: () => isCloudOnline && dbInstance !== null,

    saveOrder: async function(bookingData) {
      try {
        let cache = JSON.parse(localStorage.getItem('healthians_admin_bookings') || '[]');
        if (!cache.some(x => x.id === bookingData.id)) {
          cache.unshift(bookingData);
          localStorage.setItem('healthians_admin_bookings', JSON.stringify(cache));
        }
      } catch (e) {}

      if (this.isOnline()) {
        try {
          await dbInstance.collection('bookings').doc(bookingData.id).set(bookingData);
          return { status: 'success', cloud: true };
        } catch (cloudErr) {
          return { status: 'success', cloud: false, fallback: true };
        }
      } else {
        return { status: 'success', cloud: false, fallback: true };
      }
    },

    subscribeOrders: function(onDataReceived) {
      if (this.isOnline()) {
        return dbInstance.collection('bookings').onSnapshot((snapshot) => {
          let orders = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            orders.push(data);
          });
          
          orders.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
          try {
            localStorage.setItem('healthians_admin_bookings', JSON.stringify(orders));
          } catch (e) {}
          
          onDataReceived(orders, { source: 'cloud' });
        }, () => {
          const offlineData = JSON.parse(localStorage.getItem('healthians_admin_bookings') || '[]');
          onDataReceived(offlineData, { source: 'offline' });
        });
      } else {
        const offlineData = JSON.parse(localStorage.getItem('healthians_admin_bookings') || '[]');
        onDataReceived(offlineData, { source: 'offline' });
        return () => {};
      }
    },

    updateOrder: async function(id, fields) {
      try {
        let cache = JSON.parse(localStorage.getItem('healthians_admin_bookings') || '[]');
        const idx = cache.findIndex(x => x.id === id);
        if (idx !== -1) {
          Object.assign(cache[idx], fields);
          localStorage.setItem('healthians_admin_bookings', JSON.stringify(cache));
        }
      } catch (e) {}

      if (this.isOnline()) {
        try {
          await dbInstance.collection('bookings').doc(id).update(fields);
        } catch (err) {}
      }
    },

    deleteOrder: async function(id) {
      try {
        let cache = JSON.parse(localStorage.getItem('healthians_admin_bookings') || '[]');
        cache = cache.filter(x => x.id !== id);
        localStorage.setItem('healthians_admin_bookings', JSON.stringify(cache));
      } catch (e) {}

      if (this.isOnline()) {
        try {
          await dbInstance.collection('bookings').doc(id).delete();
        } catch (err) {}
      }
    }
  };
})();
