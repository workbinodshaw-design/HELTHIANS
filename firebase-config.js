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
            if (doc.id && doc.id.startsWith('_SYS_')) return;
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
    },

    // ========================================================================
    // DYNAMIC PACKAGE & PROMOTIONAL OFFER MANAGEMENT ENGINE
    // ========================================================================
    getDefaultPackages: function() {
      return [
        {
          id: "pkg_1",
          title: "Smart Full Body Checkup",
          oldPrice: "2,499",
          newPrice: "999",
          badge: "Most Booked",
          benefits: [
            "Complete Blood Count (CBC) & Thyroid (TSH)",
            "Liver, Kidney, Lipid Profile & Fasting Sugar",
            "Free Smart PDF Report & Doctor Telephone Consult"
          ],
          params: "74 Diagnostic Parameters Included",
          fasting: "Fasting required: 8-10 hours overnight",
          order: 1
        },
        {
          id: "pkg_2",
          title: "Senior Citizen Health Profile",
          oldPrice: "3,400",
          newPrice: "1,499",
          badge: "",
          benefits: [
            "Designed specifically for parents over 50 years",
            "Heart Risk, Arthritis & Bone Health screening",
            "Vitamin D & B12, Thyroid, Liver & Kidney profile"
          ],
          params: "85 Comprehensive Parameters Included",
          fasting: "Fasting required: 8-10 hours overnight",
          order: 2
        },
        {
          id: "pkg_3",
          title: "Diabetes Screening Package",
          oldPrice: "1,200",
          newPrice: "499",
          badge: "",
          benefits: [
            "Accurate 3-month average glucose level (HbA1c)",
            "Fasting Blood Sugar & Urine Glucose evaluation",
            "Express report delivery within 12 hours"
          ],
          params: "28 Essential Diabetes Parameters Included",
          fasting: "Fasting required: 8 hours overnight",
          order: 3
        }
      ];
    },

    getDefaultOffer: function() {
      return {
        ribbon: "🔥 LIMITED TIME OFFER",
        title: "Healthians SUPER SAVER PACKAGE",
        tag: "ESSENTIAL TESTS. COMPLETE CARE.",
        offerPrice: "299",
        mrpPrice: "1,299",
        btnText: "Book Now at ₹299",
        warnText: "Limited slots per day!",
        active: true
      };
    },

    getPackages: function() {
      try {
        const cached = localStorage.getItem('healthians_custom_packages');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return this.getDefaultPackages();
    },

    subscribePackages: function(onData) {
      if (this.isOnline()) {
        return dbInstance.collection('bookings').doc('_SYS_CONFIG_PACKAGES_').onSnapshot((doc) => {
          let pkgs = null;
          if (doc.exists && Array.isArray(doc.data().items) && doc.data().items.length > 0) {
            pkgs = doc.data().items;
          } else {
            pkgs = this.getPackages();
            if (pkgs && pkgs.length > 0) {
              dbInstance.collection('bookings').doc('_SYS_CONFIG_PACKAGES_').set({ items: pkgs, updated: Date.now() }).catch(() => {});
            }
          }
          pkgs.sort((a, b) => (a.order || 0) - (b.order || 0));
          try {
            localStorage.setItem('healthians_custom_packages', JSON.stringify(pkgs));
          } catch (e) {}
          onData(pkgs);
        }, () => {
          onData(this.getPackages());
        });
      } else {
        onData(this.getPackages());
        return () => {};
      }
    },

    savePackage: async function(pkgData) {
      if (!pkgData.id) pkgData.id = 'pkg_' + Date.now();
      let pkgs = this.getPackages();
      try {
        const idx = pkgs.findIndex(p => p.id === pkgData.id);
        if (idx !== -1) pkgs[idx] = pkgData;
        else pkgs.push(pkgData);
        pkgs.sort((a, b) => (a.order || 0) - (b.order || 0));
        localStorage.setItem('healthians_custom_packages', JSON.stringify(pkgs));
      } catch (e) {}

      if (this.isOnline()) {
        try {
          await dbInstance.collection('bookings').doc('_SYS_CONFIG_PACKAGES_').set({ items: pkgs, updated: Date.now() });
          dbInstance.collection('website_packages').doc(pkgData.id).set(pkgData).catch(() => {});
          return { status: 'success', cloud: true };
        } catch (err) {
          console.error("Firebase Cloud save failed:", err);
          return { status: 'success', cloud: false, error: err.message };
        }
      }
      return { status: 'success', cloud: false };
    },

    deletePackage: async function(id) {
      let pkgs = this.getPackages().filter(p => p.id !== id);
      try {
        localStorage.setItem('healthians_custom_packages', JSON.stringify(pkgs));
      } catch (e) {}

      if (this.isOnline()) {
        try {
          await dbInstance.collection('bookings').doc('_SYS_CONFIG_PACKAGES_').set({ items: pkgs, updated: Date.now() });
          dbInstance.collection('website_packages').doc(id).delete().catch(() => {});
        } catch (err) {}
      }
    },

    getOfferConfig: function() {
      try {
        const cached = localStorage.getItem('healthians_offer_config');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
      return this.getDefaultOffer();
    },

    subscribeOffer: function(onData) {
      if (this.isOnline()) {
        return dbInstance.collection('bookings').doc('_SYS_CONFIG_OFFER_').onSnapshot((doc) => {
          let offer = doc.exists && doc.data().offer ? doc.data().offer : (this.getOfferConfig() || this.getDefaultOffer());
          if (!doc.exists) {
            try {
              dbInstance.collection('bookings').doc('_SYS_CONFIG_OFFER_').set({ offer: offer, updated: Date.now() }).catch(() => {});
            } catch(e) {}
          }
          try {
            localStorage.setItem('healthians_offer_config', JSON.stringify(offer));
          } catch (e) {}
          onData(offer);
        }, () => {
          onData(this.getOfferConfig());
        });
      } else {
        onData(this.getOfferConfig());
        return () => {};
      }
    },

    saveOfferConfig: async function(offerData) {
      try {
        localStorage.setItem('healthians_offer_config', JSON.stringify(offerData));
      } catch (e) {}

      if (this.isOnline()) {
        try {
          await dbInstance.collection('bookings').doc('_SYS_CONFIG_OFFER_').set({ offer: offerData, updated: Date.now() });
          dbInstance.collection('website_config').doc('super_saver_offer').set(offerData).catch(() => {});
          return { status: 'success', cloud: true };
        } catch (err) {
          console.error("Cloud offer save failed:", err);
          return { status: 'success', cloud: false, error: err.message };
        }
      }
      return { status: 'success', cloud: false };
    }
  };
})();
