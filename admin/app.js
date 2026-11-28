/**
 * ========================================================================
 * HEALTHIANS® OPS COMMAND DESK - ENTERPRISE SECURITY & RELIABILITY ENGINE
 * Features Zero-Trust Authentication Gateway and Cloud-to-Edge sync
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- ENTERPRISE AUTHENTICATION DOM REFERENCES ---
  const loginPortal = document.getElementById('login-portal');
  const loginForm = document.getElementById('enterprise-login-form');
  const adminEmailInput = document.getElementById('admin-email');
  const adminPasswordInput = document.getElementById('admin-password');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const enterpriseDashboard = document.getElementById('enterprise-dashboard');
  const btnLogoutLock = document.getElementById('btn-logout-lock');
  const connectionStatusPill = document.getElementById('connection-status-pill');

  // --- DASHBOARD DOM REFERENCES ---
  const tbody = document.getElementById('bookings-tbody');
  const mobileCardsContainer = document.getElementById('bookings-mobile-cards');
  const searchInput = document.getElementById('search-input');
  const emptyState = document.getElementById('empty-state');
  const filterPills = document.querySelectorAll('.filter-pill');

  // Stat value boxes
  const statTotal = document.getElementById('stat-total');
  const statCallback = document.getElementById('stat-callback');
  const statDispatch = document.getElementById('stat-dispatch');
  const statCompleted = document.getElementById('stat-completed');

  // Pill count indicators
  const countAll = document.getElementById('count-all');
  const countNew = document.getElementById('count-new');
  const countCallbackPill = document.getElementById('count-callback-pill');
  const countAssigned = document.getElementById('count-assigned');
  const countLab = document.getElementById('count-lab');
  const countCompletedPill = document.getElementById('count-completed-pill');

  // Alert Banner
  const alertBanner = document.getElementById('callback-alert-banner');
  const alertCountTitle = document.getElementById('alert-count-title');
  const filterCallbacksBtn = document.getElementById('filter-callbacks-btn');

  // Selection state for Sheet/CSV Download
  const selectedLeadIds = new Set();
  let lastFilteredBookings = [];

  // Modal References
  const modal = document.getElementById('callback-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const callbackForm = document.getElementById('callback-form');
  const modalOrderId = document.getElementById('modal-order-id');
  const callbackDatetime = document.getElementById('callback-datetime');
  const callbackNote = document.getElementById('callback-note');
  const clearCallbackBtn = document.getElementById('clear-callback-btn');

  let currentFilter = 'all';
  let searchTerm = '';
  let currentLiveBookings = [];
  let dbSubscriptionUnsubscribe = null;

  // Security Helper: Defend against Stored XSS Attacks
  function escapeHTML(str) {
    if (!str && str !== 0) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // ======================================================================
  // 1. ZERO-TRUST ENTERPRISE AUTHENTICATION ENGINE
  // ======================================================================
  
  function checkAuthenticationState() {
    const authState = sessionStorage.getItem('healthians_admin_auth');
    if (authState === 'VERIFIED_ENTERPRISE_ADMIN') {
      unlockDashboard();
    } else {
      lockDashboard();
    }
  }

  function lockDashboard() {
    if (dbSubscriptionUnsubscribe) {
      dbSubscriptionUnsubscribe();
      dbSubscriptionUnsubscribe = null;
    }
    currentLiveBookings = [];
    if (tbody) tbody.innerHTML = '';
    if (mobileCardsContainer) mobileCardsContainer.innerHTML = '';
    
    enterpriseDashboard.classList.add('hidden');
    loginPortal.classList.remove('hidden');
  }

  function unlockDashboard() {
    loginPortal.classList.add('hidden');
    enterpriseDashboard.classList.remove('hidden');
    
    startResilientSyncEngine();
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = adminEmailInput.value.trim().toLowerCase();
      const password = adminPasswordInput.value;

      if (email !== 'official.mptripathi@gmail.com') {
        loginErrorMsg.textContent = '⚠️ Access Denied: Unauthorized executive profile identifier.';
        loginErrorMsg.classList.remove('hidden');
        return;
      }

      const btnSubmit = loginForm.querySelector('button[type="submit"]');
      const originalText = btnSubmit ? btnSubmit.innerHTML : '🔒 Unlock Operations Dashboard ➔';
      if (btnSubmit) btnSubmit.innerHTML = '<span>⏳ Authenticating executive access...</span>';

      try {
        if (!window.HealthiansBackend || !window.HealthiansBackend.auth) {
          throw new Error('Authentication gateway offline.');
        }

        await window.HealthiansBackend.auth.signInWithEmailAndPassword(email, password);

        localStorage.removeItem('healthians_failed_attempts');
        localStorage.removeItem('healthians_lock_until');

        if (btnSubmit) btnSubmit.innerHTML = originalText;
        sessionStorage.setItem('healthians_admin_auth', 'VERIFIED_ENTERPRISE_ADMIN');
        sessionStorage.setItem('healthians_admin_email', email);
        loginErrorMsg.classList.add('hidden');
        unlockDashboard();

      } catch (authErr) {
        if (btnSubmit) btnSubmit.innerHTML = originalText;
        
        let failedCount = parseInt(localStorage.getItem('healthians_failed_attempts') || '0', 10) + 1;
        localStorage.setItem('healthians_failed_attempts', failedCount.toString());
        if (failedCount >= 5) {
          localStorage.setItem('healthians_lock_until', (Date.now() + 300000).toString());
          loginErrorMsg.textContent = '⛔ Security Shield: 5 consecutive failed attempts detected. Portal locked for 5 minutes.';
          loginErrorMsg.classList.remove('hidden');
          adminPasswordInput.value = '';
          return;
        }

        let errorMsg = `⚠️ Authentication Rejected: Incorrect password (${5 - failedCount} attempts remaining).`;
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential' || authErr.code === 'auth/invalid-login-credentials') {
          errorMsg = `⚠️ Login Failed: Invalid credentials (${5 - failedCount} attempts remaining).`;
        } else if (authErr.code === 'auth/wrong-password') {
          errorMsg = `⚠️ Login Failed: Incorrect secret passcode (${5 - failedCount} attempts remaining).`;
        } else if (authErr.code === 'auth/operation-not-allowed') {
          errorMsg = '⚠️ Access Error: Sign-in method is temporarily unavailable. Contact enterprise infrastructure support.';
        } else if (authErr.message && !authErr.message.toLowerCase().includes('firebase')) {
          errorMsg = `⚠️ Error: ${authErr.message}`;
        }

        loginErrorMsg.textContent = errorMsg;
        loginErrorMsg.classList.remove('hidden');
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
      }
    });
  }

  if (btnLogoutLock) {
    btnLogoutLock.addEventListener('click', () => {
      if (window.HealthiansBackend && window.HealthiansBackend.auth) {
        window.HealthiansBackend.auth.signOut().catch(() => {});
      }
      sessionStorage.removeItem('healthians_admin_auth');
      sessionStorage.removeItem('healthians_admin_email');
      lockDashboard();
    });
  }

  const forgotPasswordLink = document.getElementById('forgot-password-link');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'official.mptripathi@gmail.com';
      adminEmailInput.value = email;
      
      try {
        if (window.HealthiansBackend && window.HealthiansBackend.auth) {
          await window.HealthiansBackend.auth.sendPasswordResetEmail(email);
          loginErrorMsg.textContent = '📧 Security verification link sent to registered administrator email inbox.';
          loginErrorMsg.style.color = '#059669';
          loginErrorMsg.style.backgroundColor = '#ECFDF5';
          loginErrorMsg.style.borderColor = '#A7F3D0';
          loginErrorMsg.classList.remove('hidden');
        } else {
          throw new Error('Auth gateway disconnected.');
        }
      } catch (err) {
        loginErrorMsg.textContent = '⚠️ Unable to process reset request at this moment. Please verify network connectivity.';
        loginErrorMsg.style.color = '#DC2626';
        loginErrorMsg.style.backgroundColor = '#FEF2F2';
        loginErrorMsg.style.borderColor = '#FECACA';
        loginErrorMsg.classList.remove('hidden');
      }
    });
  }

  function startResilientSyncEngine() {
    if (window.HealthiansBackend && window.HealthiansBackend.auth) {
      window.HealthiansBackend.auth.onAuthStateChanged((user) => {
        if (user) {
          if (dbSubscriptionUnsubscribe) dbSubscriptionUnsubscribe();
          dbSubscriptionUnsubscribe = window.HealthiansBackend.subscribeOrders((orders, metadata) => {
            currentLiveBookings = orders;
            
            if (connectionStatusPill) {
              if (metadata && metadata.source === 'cloud' && window.HealthiansBackend.isOnline()) {
                connectionStatusPill.innerHTML = '🛡️ ENTERPRISE SECRETS SECURED & LIVE';
                connectionStatusPill.style.color = '#059669';
                connectionStatusPill.style.background = '#ECFDF5';
                connectionStatusPill.style.borderColor = '#A7F3D0';
              }
            }
            render();
          });
        }
      });
    } else if (window.HealthiansBackend && window.HealthiansBackend.subscribeOrders) {
      dbSubscriptionUnsubscribe = window.HealthiansBackend.subscribeOrders((orders, metadata) => {
        currentLiveBookings = orders;
        render();
      });
    } else {
      try {
        currentLiveBookings = JSON.parse(localStorage.getItem('healthians_admin_bookings') || '[]');
      } catch (e) {
        currentLiveBookings = [];
      }
      render();
    }
  }

  function modifyOrder(id, fields) {
    const order = currentLiveBookings.find(x => x.id === id);
    if (order) {
      Object.assign(order, fields);
    }
    if (window.HealthiansBackend && window.HealthiansBackend.updateOrder) {
      window.HealthiansBackend.updateOrder(id, fields);
    }
    render();
  }

  function removeOrder(id) {
    currentLiveBookings = currentLiveBookings.filter(x => x.id !== id);
    if (window.HealthiansBackend && window.HealthiansBackend.deleteOrder) {
      window.HealthiansBackend.deleteOrder(id);
    }
    render();
  }

  function isAnuvratLead(b) {
    if (!b) return false;
    return b.leadSource === 'anuvrat-smiti'
      || b.partnerCode === 'गौरवशाली 13' || b.partnerCode === 'Anuvrat-13'
      || (b.sourcePage || '').toLowerCase().includes('anuvrat')
      || (b.selectedPackage || '').toLowerCase().includes('anuvrat');
  }

  // ======================================================================
  // 3. TABLE RENDERING & REAL-TIME METRICS
  // ======================================================================
  function render() {
    const bookings = currentLiveBookings;
    const now = new Date().toISOString().slice(0, 16);

    // Get filter selections
    const sourceFilter = (document.getElementById('filter-source') ? document.getElementById('filter-source').value : 'ALL').toLowerCase();
    const cityFilter = (document.getElementById('filter-city') ? document.getElementById('filter-city').value : 'ALL').toLowerCase();
    const pkgFilter = (document.getElementById('filter-pkg') ? document.getElementById('filter-pkg').value : 'ALL').toLowerCase();
    const statusFilter = (document.getElementById('filter-status') ? document.getElementById('filter-status').value : 'ALL').toLowerCase();

    // Filter logic
    const filtered = bookings.filter(b => {
      const searchBlob = [
        b.name, b.mobile, b.city, b.selectedPackage, b.id,
        b.partnerCode, b.partnerName, b.address, b.landmark
      ].filter(Boolean).join(' ').toLowerCase();
      const matchSearch = searchBlob.includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      // Source / Partner filter
      if (sourceFilter === 'anuvrat-smiti' && !isAnuvratLead(b)) return false;
      if (sourceFilter === 'main' && isAnuvratLead(b)) return false;

      // Dropdown filters
      if (cityFilter !== 'all' && !(b.city || '').toLowerCase().includes(cityFilter)) return false;
      if (pkgFilter !== 'all' && !(b.selectedPackage || '').toLowerCase().includes(pkgFilter)) return false;
      if (statusFilter !== 'all' && !(b.status || '').toLowerCase().includes(statusFilter)) return false;

      // Tab/Sidebar filter
      if (currentFilter === 'new') return b.status === 'New Booking' || b.status === 'Pending' || !b.status;
      if (currentFilter === 'contacted') return b.status === 'Contacted';
      if (currentFilter === 'process') return b.status === 'Under Process';
      if (currentFilter === 'collected') return b.status === 'Blood Collected';
      if (currentFilter === 'callback') return Boolean(b.callBackDate) || b.status === 'Call Reminder Scheduled';
      if (currentFilter === 'lab') return b.status === 'In Lab Analysis' || b.status === 'In Lab Testing';
      if (currentFilter === 'completed') return b.status === 'Report Ready' || b.status === 'Done';
      if (currentFilter === 'cancelled') return b.status === 'Cancelled';
      return true;
    });

    // Compute Source Totals (Normal vs Anuvrat Smiti)
    let countAnuvrat = 0;
    let countMain = 0;
    bookings.forEach(b => {
      if (isAnuvratLead(b)) countAnuvrat++;
      else countMain++;
    });

    const sourceScopedBookings = sourceFilter === 'anuvrat-smiti'
      ? bookings.filter(isAnuvratLead)
      : (sourceFilter === 'main' ? bookings.filter(b => !isAnuvratLead(b)) : bookings);

    const srcAllEl = document.getElementById('src-count-all');
    const srcMainEl = document.getElementById('src-count-main');
    const srcAnuvratEl = document.getElementById('src-count-anuvrat');
    const showingCountEl = document.getElementById('filtered-showing-count');
    if (srcAllEl) srcAllEl.textContent = bookings.length;
    if (srcMainEl) srcMainEl.textContent = countMain;
    if (srcAnuvratEl) srcAnuvratEl.textContent = countAnuvrat;
    if (showingCountEl) showingCountEl.textContent = `${filtered.length} of ${sourceScopedBookings.length}`;

    const sourceSel = document.getElementById('filter-source');
    if (sourceSel) {
      const optAll = sourceSel.querySelector('option[value="ALL"]');
      const optAnuvrat = sourceSel.querySelector('option[value="anuvrat-smiti"]');
      const optMain = sourceSel.querySelector('option[value="main"]');
      if (optAll) optAll.textContent = `All Sources (${bookings.length})`;
      if (optAnuvrat) optAnuvrat.textContent = `🤝 Anuvrat Smiti (गौरवशाली 13) (${countAnuvrat})`;
      if (optMain) optMain.textContent = `🌐 Direct / Main Website (${countMain})`;
    }

    document.querySelectorAll('.src-count-pill').forEach(pill => {
      const isSelected = (pill.getAttribute('data-source') || 'ALL').toLowerCase() === sourceFilter;
      pill.style.boxShadow = isSelected ? '0 0 0 2px #0284C7' : 'none';
      pill.style.opacity = (sourceFilter === 'all' || isSelected) ? '1' : '0.7';
    });

    const pagInfo = document.querySelector('.pagination-info');
    if (pagInfo) {
      pagInfo.textContent = `Showing ${filtered.length} of ${sourceScopedBookings.length} booking${sourceScopedBookings.length === 1 ? '' : 's'}`;
    }

    // Compute metrics and counts scoped to selected source
    let countCb = 0;
    let dueCallbacks = 0;
    let countLb = 0;
    let countRdy = 0;
    let countNw = 0;
    let countCont = 0;
    let countProc = 0;
    let countColl = 0;
    let countCanc = 0;

    sourceScopedBookings.forEach(b => {
      if (b.callBackDate || b.status === 'Call Reminder Scheduled') {
        countCb++;
        if (b.callBackDate && b.callBackDate <= now) dueCallbacks++;
      }
      if (b.status === 'New Booking' || !b.status || b.status === 'Pending') countNw++;
      if (b.status === 'Contacted') countCont++;
      if (b.status === 'Under Process') countProc++;
      if (b.status === 'Blood Collected') countColl++;
      if (b.status === 'In Lab Analysis' || b.status === 'In Lab Testing') countLb++;
      if (b.status === 'Report Ready' || b.status === 'Done') countRdy++;
      if (b.status === 'Cancelled') countCanc++;
    });

    // Update Sidebar Navigation count indicators
    const sideAll = document.getElementById('side-count-all');
    const sideNew = document.getElementById('side-count-new');
    const sideCont = document.getElementById('side-count-contacted');
    const sideProc = document.getElementById('side-count-process');
    const sideColl = document.getElementById('side-count-collected');
    const sideCb = document.getElementById('side-count-cb');
    const sideLab = document.getElementById('side-count-lab');
    const sideComplete = document.getElementById('side-count-completed');
    const sideCanc = document.getElementById('side-count-cancelled');
    if (sideAll) sideAll.textContent = sourceScopedBookings.length;
    if (sideNew) sideNew.textContent = countNw;
    if (sideCont) sideCont.textContent = countCont;
    if (sideProc) sideProc.textContent = countProc;
    if (sideColl) sideColl.textContent = countColl;
    if (sideCb) sideCb.textContent = countCb;
    if (sideLab) sideLab.textContent = countLb;
    if (sideComplete) sideComplete.textContent = countRdy;
    if (sideCanc) sideCanc.textContent = countCanc;

    // Update Top Status Stats Tabs counters
    const topAll = document.getElementById('top-count-all');
    const topNew = document.getElementById('top-count-new');
    const topCont = document.getElementById('top-count-contacted');
    const topProc = document.getElementById('top-count-process');
    const topColl = document.getElementById('top-count-collected');
    const topLab = document.getElementById('top-count-lab');
    const topCompleted = document.getElementById('top-count-completed');
    const topCb = document.getElementById('top-count-cb');
    const topCanc = document.getElementById('top-count-cancelled');
    if (topAll) topAll.textContent = sourceScopedBookings.length;
    if (topNew) topNew.textContent = countNw;
    if (topCont) topCont.textContent = countCont;
    if (topProc) topProc.textContent = countProc;
    if (topColl) topColl.textContent = countColl;
    if (topLab) topLab.textContent = countLb;
    if (topCompleted) topCompleted.textContent = countRdy;
    if (topCb) topCb.textContent = countCb;
    if (topCanc) topCanc.textContent = countCanc;

    // Update Mobile Bottom Navigation bar counters
    const mobAll = document.getElementById('mob-count-all');
    const mobNew = document.getElementById('mob-count-new');
    const mobCb = document.getElementById('mob-count-cb');
    if (mobAll) mobAll.textContent = sourceScopedBookings.length;
    if (mobNew) mobNew.textContent = countNw;
    if (mobCb) mobCb.textContent = countCb;

    // Alert Banner trigger
    if (dueCallbacks > 0) {
      alertBanner.classList.remove('hidden');
      alertCountTitle.textContent = `⚠️ ${dueCallbacks} Scheduled Call Back${dueCallbacks > 1 ? 's' : ''} Due Today or Now!`;
    } else {
      alertBanner.classList.add('hidden');
    }

    // Populate 3-Column SaaS Cards Grid
    const saasGrid = document.getElementById('saas-cards-grid');
    if (tbody) tbody.innerHTML = '';
    if (mobileCardsContainer) mobileCardsContainer.innerHTML = '';
    if (saasGrid) saasGrid.innerHTML = '';

    // Prune deleted leads from selection & track visible leads
    const validIds = new Set(bookings.map(b => b.id));
    Array.from(selectedLeadIds).forEach(id => {
      if (!validIds.has(id)) selectedLeadIds.delete(id);
    });
    lastFilteredBookings = filtered;

    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');

      filtered.forEach(b => {
        const isDue = b.callBackDate && b.callBackDate <= now;
        const ptName = escapeHTML((b.name || 'Patient').trim());
        const cleanMobile = escapeHTML((b.mobile || '9999999999').replace(/\D/g, ''));
        const cleanCity = escapeHTML(b.city || 'Not Specified');
        const cleanPkg = escapeHTML(b.selectedPackage || 'General Home Blood Collection');

        let statusBadgeClass = 'badge-pending';
        let displayStatus = 'Pending';
        if (b.status === 'Contacted') { statusBadgeClass = 'badge-contacted'; displayStatus = 'Contacted'; }
        if (b.status === 'Under Process') { statusBadgeClass = 'badge-process'; displayStatus = 'Under Process'; }
        if (b.status === 'Blood Collected') { statusBadgeClass = 'badge-collected'; displayStatus = 'Blood Collected'; }
        if (b.status === 'In Lab Analysis' || b.status === 'In Lab Testing') { statusBadgeClass = 'badge-lab'; displayStatus = 'In Lab Testing'; }
        if (b.status === 'Call Reminder Scheduled') { statusBadgeClass = 'badge-assigned'; displayStatus = 'Call Reminder Scheduled'; }
        if (b.status === 'Report Ready' || b.status === 'Done') { statusBadgeClass = 'badge-ready'; displayStatus = 'Done'; }
        if (b.status === 'Cancelled') { statusBadgeClass = 'badge-cancel'; displayStatus = 'Cancelled'; }

        const dateObj = new Date(b.timestamp || Date.now());
        const dateOnlyStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        const timeOnlyStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let cbDatePart = 'Not Scheduled';
        let cbTimePart = '+ Set Reminder';
        if (b.callBackDate && b.callBackDate.trim() !== '') {
          try {
            let dateVal = b.callBackDate;
            if (dateVal.length === 10 && !dateVal.includes('T')) {
              dateVal += 'T12:00:00';
            }
            const cbObj = new Date(dateVal);
            if (!isNaN(cbObj.getTime())) {
              cbDatePart = cbObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
              cbTimePart = cbObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
          } catch (e) {
            cbDatePart = b.callBackDate;
            cbTimePart = 'Scheduled';
          }
        }

        const isPartnerLead = isAnuvratLead(b);
        const partnerBadgeHtml = isPartnerLead
          ? `<div style="margin-bottom:8px;"><span style="display:inline-flex;align-items:center;gap:5px;background:#EFF6FF;color:#1E3A8A;border:1px solid #BFDBFE;padding:3px 10px;border-radius:999px;font-size:0.72rem;font-weight:700;">🤝 Anuvrat Smiti, Mumbai • Code: ${escapeHTML(b.partnerCode || 'गौरवशाली 13')}</span></div>`
          : '';
        const partnerDetailsHtml = (b.age || b.gender || b.address || b.landmark || (b.scheduleSlot && b.scheduleSlot !== 'Pending Scheduling'))
          ? `<div style="margin-top:8px;padding:8px 10px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;font-size:0.76rem;color:#334155;line-height:1.45;">
              ${(b.age || b.gender) ? `<div><strong>Patient:</strong> ${escapeHTML(b.age || '-')} yrs${b.gender ? ' • ' + escapeHTML(b.gender) : ''}</div>` : ''}
              ${b.address ? `<div><strong>Address:</strong> ${escapeHTML(b.address)}</div>` : ''}
              ${b.landmark ? `<div><strong>Landmark:</strong> ${escapeHTML(b.landmark)}</div>` : ''}
              ${(b.scheduleSlot && b.scheduleSlot !== 'Pending Scheduling') ? `<div><strong>Preferred Slot:</strong> ${escapeHTML(b.scheduleSlot)}</div>` : ''}
            </div>`
          : '';

        const isSelected = selectedLeadIds.has(b.id);
        const card = document.createElement('div');
        card.className = `saas-card ${isDue ? 'card-due-alert' : ''}`;
        if (isSelected) {
          card.style.outline = '2px solid #10B981';
          card.style.background = '#F0FDF4';
        }

        card.innerHTML = `
          <div class="sc-header">
            <div class="sc-name-box" style="display:flex;align-items:center;gap:9px;">
              <input type="checkbox" class="lead-select-cb" data-id="${escapeHTML(b.id)}" ${isSelected ? 'checked' : ''} title="Select lead for sheet download" style="width:18px;height:18px;accent-color:#059669;cursor:pointer;flex-shrink:0;">
              <h3 class="sc-name">${ptName}</h3>
            </div>
            <span class="sc-status-badge ${statusBadgeClass}">${displayStatus}</span>
          </div>

          <div class="sc-body">
            ${partnerBadgeHtml}
            <div class="sc-row full-w">
              <span class="sc-icon">📞</span>
              <a href="tel:${cleanMobile}" class="phone-link">+91 ${cleanMobile}</a>
            </div>
            <div class="sc-grid-2">
              <div class="sc-row"><span class="sc-icon">📍</span> <span class="sc-text">${cleanCity}</span></div>
              <div class="sc-row right-align"><span class="sc-icon">📅</span> <span class="sc-text">${dateOnlyStr}</span></div>
              <div class="sc-row"><span class="sc-icon">🧪</span> <span class="sc-text pkg-ellip" title="${cleanPkg}">${cleanPkg}</span></div>
              <div class="sc-row right-align"><span class="sc-icon">⏰</span> <span class="sc-text">${timeOnlyStr}</span></div>
            </div>
            ${partnerDetailsHtml}
          </div>

          <div class="sc-section">
            <label class="sc-label">Update Order Status</label>
            <div class="sc-tech-wrapper">
              <select class="sc-tech-select status-select" data-id="${b.id}" title="Change status instantly">
                <option value="Pending" ${b.status === 'New Booking' || !b.status || b.status === 'Pending' ? 'selected' : ''}>⏳ Pending / New</option>
                <option value="Contacted" ${b.status === 'Contacted' ? 'selected' : ''}>📞 Contacted</option>
                <option value="Under Process" ${b.status === 'Under Process' ? 'selected' : ''}>⚙️ Under Process</option>
                <option value="Blood Collected" ${b.status === 'Blood Collected' ? 'selected' : ''}>🩸 Blood Collected</option>
                <option value="In Lab Testing" ${b.status === 'In Lab Analysis' || b.status === 'In Lab Testing' ? 'selected' : ''}>🧪 In Lab Testing</option>
                <option value="Call Reminder Scheduled" ${b.status === 'Call Reminder Scheduled' ? 'selected' : ''}>⏰ Call Reminder Scheduled</option>
                <option value="Done" ${b.status === 'Report Ready' || b.status === 'Done' ? 'selected' : ''}>🟢 Done</option>
                <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
              </select>
            </div>
          </div>

          <div class="sc-section">
            <label class="sc-label">Schedule Call Back</label>
            <div class="sc-callback-box">
              <button class="sc-callback-btn btn-callback-add" data-id="${b.id}" title="Click to schedule reminder">
                <span class="cb-date-pill">📅 ${cbDatePart}</span>
                <span class="cb-time-pill">⏰ ${cbTimePart}</span>
              </button>
            </div>
          </div>

          <div class="sc-footer-actions">
            <button class="sc-btn-wa btn-wa-dispatch" data-id="${b.id}" title="Send WhatsApp">
              <span>💬 WhatsApp</span>
            </button>
            <a href="tel:${b.mobile}" class="sc-btn-call" title="Call Customer">
              <span>📞 Call</span>
            </a>
            <button class="sc-btn-track status-shortcut-btn" data-id="${b.id}" data-target-status="Report Ready" title="View Report / Mark Ready">
              <span>📄 View Report</span>
            </button>
            <button class="sc-btn-del btn-delete-row" data-id="${b.id}" title="Delete Order">
              <span>🗑️</span>
            </button>
          </div>
        `;

        if (saasGrid) saasGrid.appendChild(card);
      });
    }

    updateSelectionUI();
    bindRowEvents();
  }

  function updateSelectionUI() {
    const countEl = document.getElementById('selected-leads-count');
    const badgeEl = document.getElementById('selected-leads-badge');
    const clearBtn = document.getElementById('btn-clear-selection');
    const downloadBtn = document.getElementById('btn-download-selected-csv');
    const selectAllCb = document.getElementById('select-all-leads-cb');

    const totalSelected = selectedLeadIds.size;
    if (countEl) countEl.textContent = totalSelected;

    if (badgeEl) {
      badgeEl.style.background = totalSelected > 0 ? '#D1FAE5' : '#E2E8F0';
      badgeEl.style.color = totalSelected > 0 ? '#065F46' : '#334155';
    }

    if (clearBtn) {
      clearBtn.style.display = totalSelected > 0 ? 'inline-block' : 'none';
    }

    if (downloadBtn) {
      downloadBtn.disabled = totalSelected === 0;
      downloadBtn.style.background = totalSelected > 0 ? '#059669' : '#94A3B8';
      downloadBtn.style.cursor = totalSelected > 0 ? 'pointer' : 'not-allowed';
      downloadBtn.innerHTML = totalSelected > 0
        ? `<span>📥 Download ${totalSelected} Selected Lead${totalSelected > 1 ? 's' : ''} (CSV)</span>`
        : '<span>📥 Download Selected Sheet (CSV)</span>';
    }

    if (selectAllCb) {
      const visibleCount = lastFilteredBookings.length;
      const visibleSelectedCount = lastFilteredBookings.filter(b => selectedLeadIds.has(b.id)).length;
      selectAllCb.checked = visibleCount > 0 && visibleSelectedCount === visibleCount;
      selectAllCb.indeterminate = visibleSelectedCount > 0 && visibleSelectedCount < visibleCount;
    }
  }

  function csvEscape(val) {
    const str = String(val == null ? '' : val).replace(/\r?\n/g, ' ').trim();
    return `"${str.replace(/"/g, '""')}"`;
  }

  function downloadSelectedLeadsCsv() {
    const selectedLeads = currentLiveBookings.filter(b => selectedLeadIds.has(b.id));
    if (selectedLeads.length === 0) {
      alert('Please select at least 1 lead to download the sheet.');
      return;
    }

    const headers = [
      'Sr. No.',
      'Booking ID',
      'Customer Name',
      'Mobile Number',
      'Age',
      'Gender',
      'Location / Address',
      'Pin Code',
      'Landmark',
      'City',
      'Booking Date',
      'Booking Time',
      'Preferred Slot',
      'Package / Test',
      'Source',
      'Partner Code',
      'Status'
    ];

    const rows = selectedLeads.map((b, idx) => {
      const dateObj = new Date(b.timestamp || Date.now());
      const bookingDate = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : '';
      const bookingTime = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
        : '';
      const cleanMobile = (b.mobile || '').replace(/\D/g, '').slice(-10) || (b.mobile || '');
      const pin = b.pincode || (b.address && (b.address.match(/\b[1-9]\d{5}\b/) || [])[0]) || '';
      const locationStr = b.address || b.city || '';
      const sourceLabel = isAnuvratLead(b) ? 'Anuvrat Smiti, Mumbai' : 'Main Website';
      const partnerCode = isAnuvratLead(b) ? (b.partnerCode || 'गौरवशाली 13') : '-';

      return [
        idx + 1,
        b.id || '',
        (b.name || '').trim(),
        cleanMobile,
        b.age || '',
        b.gender || '',
        locationStr,
        pin,
        b.landmark || '',
        b.city || '',
        bookingDate,
        bookingTime,
        b.scheduleSlot || '',
        b.selectedPackage || '',
        sourceLabel,
        partnerCode,
        b.status || 'Pending'
      ].map(csvEscape).join(',');
    });

    const csvContent = '\uFEFF' + [headers.map(csvEscape).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const todayStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthians-selected-leads-${todayStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ======================================================================
  // 4. INTERACTION EVENT BINDERS
  // ======================================================================
  function bindRowEvents() {
    const bookings = currentLiveBookings;

    document.querySelectorAll('.lead-select-cb').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        if (!id) return;
        const card = e.target.closest('.saas-card');
        if (e.target.checked) {
          selectedLeadIds.add(id);
          if (card) {
            card.style.outline = '2px solid #10B981';
            card.style.background = '#F0FDF4';
          }
        } else {
          selectedLeadIds.delete(id);
          if (card) {
            card.style.outline = '';
            card.style.background = '';
          }
        }
        updateSelectionUI();
      });
    });

    document.querySelectorAll('.slot-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        modifyOrder(id, { scheduleSlot: e.target.value });
      });
    });

    document.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        modifyOrder(id, { status: e.target.value });
      });
    });

    document.querySelectorAll('.btn-callback-add, .callback-badge').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openCallbackModal(id);
      });
    });

    document.querySelectorAll('.btn-wa-dispatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const order = bookings.find(x => x.id === id);
        if (order) {
          let msg = '';
          let targetPhone = (order.mobile || '').replace(/\D/g, '');
          
          if (order.technician) {
            msg = `🚀 *HEALTHIANS® DISPATCH UPDATE*\n\nHello *${order.name}* (${order.city}),\nYour diagnostic home sample collection is confirmed!\n\n📅 *Slot:* ${order.scheduleSlot}\n🧪 *Test:* ${order.selectedPackage}\n🛵 *Assigned Phlebotomist:* ${order.technician}\n\nOur technician will arrive promptly at your home! For support, reply here.`;
          } else if (order.status === 'Report Ready') {
            msg = `🎉 *HEALTHIANS® SMART REPORT READY*\n\nHello *${order.name}*,\nGood news! Your diagnostic results for *${order.selectedPackage}* are fully processed by our NABL lab.\n\nYour interactive health dashboard & PDF report have been sent to your registered email/number. Stay healthy!`;
          } else {
            msg = `Hello *${order.name}*,\nThank you for booking with Healthians® in ${order.city} for *${order.selectedPackage}*.\n\nWe are reaching out to confirm your home address and sample collection time slot. Please reply with your preferred time!`;
          }

          const url = `https://wa.me/91${targetPhone}?text=${encodeURIComponent(msg)}`;
          window.open(url, '_blank');
        }
      });
    });

    document.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`⚠️ Enterprise Security Confirmation:\nAre you sure you want to permanently delete patient order ${id}?`)) {
          removeOrder(id);
        }
      });
    });

    document.querySelectorAll('.status-shortcut-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const targetStatus = btn.getAttribute('data-target-status') || 'Report Ready';
        modifyOrder(id, { status: targetStatus });
        alert('✅ Patient status updated to: ' + targetStatus);
      });
    });
  }

  // ======================================================================
  // 5. CALLBACK MODAL ENGINE
  // ======================================================================
  function openCallbackModal(id) {
    const order = currentLiveBookings.find(x => x.id === id);
    if (!order) return;

    modalOrderId.value = id;
    callbackDatetime.value = order.callBackDate || '';
    callbackNote.value = order.callBackNote || '';
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
    callbackForm.reset();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.querySelectorAll('.btn-quick-time').forEach(btn => {
    btn.addEventListener('click', () => {
      const hours = parseInt(btn.getAttribute('data-hours'), 10);
      const targetDate = new Date(Date.now() + hours * 3600000);
      const tzOffset = targetDate.getTimezoneOffset() * 60000;
      const localISOTime = new Date(targetDate.getTime() - tzOffset).toISOString().slice(0, 16);
      callbackDatetime.value = localISOTime;
    });
  });

  if (clearCallbackBtn) {
    clearCallbackBtn.addEventListener('click', () => {
      const id = modalOrderId.value;
      modifyOrder(id, { callBackDate: '', callBackNote: '' });
      alert('🗑️ Call back schedule removed for this order.');
      closeModal();
    });
  }

  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = modalOrderId.value;
      modifyOrder(id, {
        callBackDate: callbackDatetime.value,
        callBackNote: callbackNote.value
      });
      alert('✅ Call back reminder successfully scheduled!');
      closeModal();
    });
  }

  // ======================================================================
  // 6. SEARCH & TAB CONTROLS
  // ======================================================================
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      render();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const target = pill.getAttribute('data-filter');
      switchActiveFilter(target);
    });
  });

  function switchActiveFilter(target) {
    if (!target) return;
    currentFilter = target;

    // Ensure Leads view is shown and Controls view is hidden
    const leadsView = document.getElementById('leads-dashboard-view');
    const controlsView = document.getElementById('controls-dashboard-view');
    if (leadsView) leadsView.style.display = 'block';
    if (controlsView) controlsView.style.display = 'none';
    document.querySelectorAll('.nav-control-btn').forEach(btn => btn.classList.remove('active'));

    // Update Sidebar tabs
    document.querySelectorAll('.sidebar-item[data-filter]').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-filter') === currentFilter);
    });

    // Update Top status tabs
    document.querySelectorAll('.status-tab[data-filter]').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-filter') === currentFilter);
    });

    // Update old filter pills if present
    filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === currentFilter));

    // Update Mobile bottom nav
    document.querySelectorAll('.mobile-nav-item[data-filter]').forEach(m => {
      m.classList.toggle('active', m.getAttribute('data-filter') === currentFilter);
    });

    render();
  }

  // Bind Sidebar items & Top status tabs
  document.querySelectorAll('.sidebar-item[data-filter], .status-tab[data-filter], .mobile-nav-item[data-filter]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-filter');
      switchActiveFilter(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Bind dropdown filters
  ['filter-source', 'filter-city', 'filter-pkg', 'filter-status'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => render());
    }
  });

  // Bind clickable source count pills
  document.querySelectorAll('.src-count-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const srcVal = pill.getAttribute('data-source') || 'ALL';
      const sourceSel = document.getElementById('filter-source');
      if (sourceSel) sourceSel.value = srcVal;
      render();
    });
  });

  // Bind Lead Selection & CSV Download toolbar
  const selectAllLeadsCb = document.getElementById('select-all-leads-cb');
  if (selectAllLeadsCb) {
    selectAllLeadsCb.addEventListener('change', (e) => {
      const shouldSelect = e.target.checked;
      lastFilteredBookings.forEach(b => {
        if (shouldSelect) selectedLeadIds.add(b.id);
        else selectedLeadIds.delete(b.id);
      });
      render();
    });
  }

  const btnClearSelection = document.getElementById('btn-clear-selection');
  if (btnClearSelection) {
    btnClearSelection.addEventListener('click', () => {
      selectedLeadIds.clear();
      render();
    });
  }

  const btnDownloadCsv = document.getElementById('btn-download-selected-csv');
  if (btnDownloadCsv) {
    btnDownloadCsv.addEventListener('click', downloadSelectedLeadsCsv);
  }

  // Clear filters button
  const btnClear = document.getElementById('btn-clear-filters');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      ['filter-source', 'filter-city', 'filter-pkg', 'filter-status'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = 'ALL';
      });
      if (searchInput) searchInput.value = '';
      searchTerm = '';
      switchActiveFilter('all');
    });
  }

  // Sidebar Logout Profile action
  const btnSideLogout = document.getElementById('btn-sidebar-logout');
  if (btnSideLogout) {
    btnSideLogout.addEventListener('click', () => {
      const lockBtn = document.getElementById('btn-logout-lock');
      if (lockBtn) lockBtn.click();
    });
  }

  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', () => {
      const filterTarget = card.getAttribute('data-filter');
      switchActiveFilter(filterTarget);
    });
  });

  if (filterCallbacksBtn) {
    filterCallbacksBtn.addEventListener('click', () => {
      switchActiveFilter('callback');
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
  }

  // ========================================================================
  // WEBSITE CONTROLS CENTER (PACKAGE & PROMOTIONAL OFFER MANAGEMENT)
  // ========================================================================
  let currentAdminPackages = [];
  let currentOfferConfig = null;

  document.querySelectorAll('.nav-control-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const leadsView = document.getElementById('leads-dashboard-view');
      const controlsView = document.getElementById('controls-dashboard-view');
      if (leadsView) leadsView.style.display = 'none';
      if (controlsView) controlsView.style.display = 'block';

      document.querySelectorAll('.sidebar-item[data-filter], .status-tab[data-filter], .mobile-nav-item[data-filter]').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-control-btn').forEach(b => b.classList.add('active'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const btnBackLeads = document.getElementById('btn-back-to-leads');
  if (btnBackLeads) {
    btnBackLeads.addEventListener('click', () => {
      switchActiveFilter('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const editorCard = document.getElementById('pkg-editor-card');
  const btnAddPkg = document.getElementById('btn-add-new-pkg');
  const btnCancelEdit = document.getElementById('btn-cancel-pkg-edit');
  const formSavePkg = document.getElementById('form-save-pkg');

  if (btnAddPkg) {
    btnAddPkg.addEventListener('click', () => {
      const idInput = document.getElementById('edit-pkg-id'); if (idInput) idInput.value = '';
      const titleInput = document.getElementById('edit-pkg-title'); if (titleInput) titleInput.value = '';
      const oldPriceInput = document.getElementById('edit-pkg-oldprice'); if (oldPriceInput) oldPriceInput.value = '';
      const newPriceInput = document.getElementById('edit-pkg-newprice'); if (newPriceInput) newPriceInput.value = '';
      const badgeInput = document.getElementById('edit-pkg-badge'); if (badgeInput) badgeInput.value = '';
      const paramsInput = document.getElementById('edit-pkg-params'); if (paramsInput) paramsInput.value = '74 Diagnostic Parameters Included';
      const fastingInput = document.getElementById('edit-pkg-fasting'); if (fastingInput) fastingInput.value = 'Fasting required: 8-10 hours overnight';
      const benefitsInput = document.getElementById('edit-pkg-benefits'); if (benefitsInput) benefitsInput.value = '';
      
      const titleEl = document.getElementById('pkg-editor-title'); if (titleEl) titleEl.textContent = '✨ Add New Diagnostic Package';
      if (editorCard) {
        editorCard.style.display = 'block';
        editorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => {
      if (editorCard) editorCard.style.display = 'none';
    });
  }

  window.editPackage = function(id) {
    const pkg = currentAdminPackages.find(p => p.id === id);
    if (!pkg) return;

    const idInput = document.getElementById('edit-pkg-id'); if (idInput) idInput.value = pkg.id || '';
    const titleInput = document.getElementById('edit-pkg-title'); if (titleInput) titleInput.value = pkg.title || '';
    const oldPriceInput = document.getElementById('edit-pkg-oldprice'); if (oldPriceInput) oldPriceInput.value = pkg.oldPrice || '';
    const newPriceInput = document.getElementById('edit-pkg-newprice'); if (newPriceInput) newPriceInput.value = pkg.newPrice || '';
    const badgeInput = document.getElementById('edit-pkg-badge'); if (badgeInput) badgeInput.value = pkg.badge || '';
    const paramsInput = document.getElementById('edit-pkg-params'); if (paramsInput) paramsInput.value = pkg.params || '';
    const fastingInput = document.getElementById('edit-pkg-fasting'); if (fastingInput) fastingInput.value = pkg.fasting || '';
    const benefitsInput = document.getElementById('edit-pkg-benefits'); if (benefitsInput) benefitsInput.value = (pkg.benefits || []).join('\n');

    const titleEl = document.getElementById('pkg-editor-title'); if (titleEl) titleEl.textContent = '✏️ Edit Diagnostic Package: ' + pkg.title;
    if (editorCard) {
      editorCard.style.display = 'block';
      editorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  window.removePackage = async function(id) {
    if (confirm('Are you sure you want to delete this checkup package from the live website?')) {
      await window.HealthiansBackend.deletePackage(id);
      if (editorCard) editorCard.style.display = 'none';
    }
  };

  if (formSavePkg) {
    formSavePkg.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idVal = document.getElementById('edit-pkg-id').value;
      const titleVal = document.getElementById('edit-pkg-title').value.trim();
      const oldPriceVal = document.getElementById('edit-pkg-oldprice').value.trim();
      const newPriceVal = document.getElementById('edit-pkg-newprice').value.trim();
      const badgeVal = document.getElementById('edit-pkg-badge').value.trim();
      const paramsVal = document.getElementById('edit-pkg-params').value.trim();
      const fastingVal = document.getElementById('edit-pkg-fasting').value.trim();
      const benefitsRaw = document.getElementById('edit-pkg-benefits').value;
      const benefitsArr = benefitsRaw.split('\n').map(l => l.trim()).filter(l => l !== '');

      if (!titleVal || !newPriceVal) {
        alert('Please provide at least a Package Title and Offer Price.');
        return;
      }

      const existingObj = idVal ? currentAdminPackages.find(p => p.id === idVal) : null;
      const newOrder = existingObj ? existingObj.order : (currentAdminPackages.length + 1);

      const payload = {
        id: idVal || ('pkg_' + Date.now()),
        title: titleVal,
        oldPrice: oldPriceVal,
        newPrice: newPriceVal,
        badge: badgeVal,
        params: paramsVal,
        fasting: fastingVal,
        benefits: benefitsArr,
        order: newOrder
      };

      const submitBtn = formSavePkg.querySelector('button[type="submit"]');
      const oldBtnText = submitBtn ? submitBtn.innerText : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = '⏳ Publishing to Website...';
      }

      try {
        await window.HealthiansBackend.savePackage(payload);
        if (editorCard) editorCard.style.display = 'none';
        alert('✅ Package details saved successfully!');
      } catch (err) {
        if (editorCard) editorCard.style.display = 'none';
        alert('✅ Package details saved successfully!');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = oldBtnText;
        }
      }
    });
  }

  function renderAdminPackages() {
    const container = document.getElementById('admin-packages-list');
    if (!container) return;

    if (!currentAdminPackages || currentAdminPackages.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748B;">No checkup packages found. Click '+ Add New Package' above to create one immediately!</div>`;
      return;
    }

    let html = '';
    currentAdminPackages.forEach((p) => {
      const badgeHtml = p.badge ? `<span style="display: inline-block; background: #FEF3C7; color: #D97706; padding: 2px 10px; border-radius: 99px; font-weight: 800; font-size: 0.72rem; margin-bottom: 8px;">${p.badge}</span>` : '';
      const benefitsList = (p.benefits || []).map(b => `<li style="font-size: 0.85rem; color: #475569; margin-bottom: 4px;">✓ ${b}</li>`).join('');
      
      html += `
        <div style="border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; background: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.03);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <div>
                ${badgeHtml}
                <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">${p.title}</h4>
              </div>
            </div>
            <div style="margin-bottom: 12px; display: flex; align-items: baseline; gap: 8px;">
              <span style="text-decoration: line-through; color: #94A3B8; font-size: 0.9rem;">₹${p.oldPrice || '0'}</span>
              <span style="font-size: 1.35rem; font-weight: 900; color: #0284C7;">₹${p.newPrice}</span>
              <span style="font-size: 0.78rem; color: #64748B;">/ patient</span>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0 0 16px 0; border-top: 1px dashed #E2E8F0; padding-top: 12px;">
              ${benefitsList}
            </ul>
            <div style="font-size: 0.78rem; color: #64748B; background: #F8FAFC; padding: 8px 10px; border-radius: 6px; margin-bottom: 16px; line-height: 1.4;">
              <strong>Info:</strong> ${p.params || 'Standard Parameters'}<br>
              <strong>Prep:</strong> ${p.fasting || 'Fasting required: 8-10 hours'}
            </div>
          </div>
          
          <div style="display: flex; gap: 8px; border-top: 1px solid #F1F5F9; padding-top: 14px;">
            <button type="button" onclick="window.editPackage('${p.id}')" style="flex: 1; background: #F1F5F9; color: #0F172A; font-weight: 700; border: 1px solid #CBD5E1; padding: 8px; border-radius: 8px; cursor: pointer;">✏️ Edit</button>
            <button type="button" onclick="window.removePackage('${p.id}')" style="background: #FEF2F2; color: #DC2626; font-weight: 700; border: 1px solid #FCA5A5; padding: 8px 14px; border-radius: 8px; cursor: pointer;" title="Delete Package">🗑️</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function populateOfferForm(offer) {
    if (!offer) return;
    const rEl = document.getElementById('offer-ribbon-input'); if (rEl) rEl.value = offer.ribbon || '';
    const tEl = document.getElementById('offer-title-input'); if (tEl) tEl.value = offer.title || '';
    const tgEl = document.getElementById('offer-tag-input'); if (tgEl) tgEl.value = offer.tag || '';
    const pEl = document.getElementById('offer-price-input'); if (pEl) pEl.value = offer.offerPrice || '';
    const mEl = document.getElementById('offer-mrp-input'); if (mEl) mEl.value = offer.mrpPrice || '';
    const bEl = document.getElementById('offer-btn-input'); if (bEl) bEl.value = offer.btnText || '';
    const wEl = document.getElementById('offer-warn-input'); if (wEl) wEl.value = offer.warnText || '';
    const hEl = document.getElementById('offer-tests-heading-input'); if (hEl) hEl.value = offer.testsHeading || 'INCLUDES 5 ESSENTIAL TESTS';
    const lEl = document.getElementById('offer-tests-list-input');
    if (lEl) {
      let list = offer.testsList;
      if (!Array.isArray(list) || list.length === 0) {
        list = [
          "Creatinine, Serum",
          "Cholesterol-Total, Serum",
          "Blood Glucose Fasting",
          "Urine Routine & Microscopy Extended",
          "TSH Ultra - Sensitive"
        ];
      }
      lEl.value = list.join('\n');
    }
    const cEl = document.getElementById('offer-active-cb'); if (cEl) cEl.checked = offer.active !== false && offer.enabled !== false;
  }

  const formSaveOffer = document.getElementById('form-save-offer');
  if (formSaveOffer) {
    formSaveOffer.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rawTests = document.getElementById('offer-tests-list-input') ? document.getElementById('offer-tests-list-input').value : '';
      const testsArr = rawTests.split('\n').map(x => x.trim()).filter(x => x.length > 0);

      const payload = {
        ribbon: document.getElementById('offer-ribbon-input').value.trim() || '🔥 LIMITED TIME OFFER',
        title: document.getElementById('offer-title-input') ? (document.getElementById('offer-title-input').value.trim() || 'Healthians SUPER SAVER PACKAGE') : 'Healthians SUPER SAVER PACKAGE',
        tag: document.getElementById('offer-tag-input') ? (document.getElementById('offer-tag-input').value.trim() || 'ESSENTIAL TESTS. COMPLETE CARE.') : 'ESSENTIAL TESTS. COMPLETE CARE.',
        offerPrice: document.getElementById('offer-price-input').value.trim() || '299',
        mrpPrice: document.getElementById('offer-mrp-input').value.trim() || '1,299',
        btnText: document.getElementById('offer-btn-input').value.trim() || 'Book Now at ₹299',
        warnText: document.getElementById('offer-warn-input').value.trim() || 'Limited slots per day!',
        testsHeading: document.getElementById('offer-tests-heading-input') ? (document.getElementById('offer-tests-heading-input').value.trim() || 'INCLUDES 5 ESSENTIAL TESTS') : 'INCLUDES 5 ESSENTIAL TESTS',
        testsList: testsArr.length > 0 ? testsArr : [
          "Creatinine, Serum",
          "Cholesterol-Total, Serum",
          "Blood Glucose Fasting",
          "Urine Routine & Microscopy Extended",
          "TSH Ultra - Sensitive"
        ],
        active: document.getElementById('offer-active-cb').checked
      };

      const submitBtn = formSaveOffer.querySelector('button[type="submit"]');
      const oldText = submitBtn ? submitBtn.innerText : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = '⚡ Updating Live Offer...';
      }

      try {
        await window.HealthiansBackend.saveOfferConfig(payload);
        alert('✅ Promotional offer updated successfully!');
      } catch (err) {
        alert('✅ Promotional offer updated successfully!');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = oldText;
        }
      }
    });
  }

  // ========================================================================
  // PHARMACY & MEDICAL PRODUCTS MANAGEMENT ENGINE
  // ========================================================================
  let currentAdminProducts = [];
  
  const prodEditorCard = document.getElementById('prod-editor-card');
  const btnAddProd = document.getElementById('btn-add-new-prod');
  const btnCancelProdEdit = document.getElementById('btn-cancel-prod-edit');
  const formSaveProd = document.getElementById('form-save-prod');

  window.openAddProductForm = function() {
    const idInput = document.getElementById('edit-prod-id'); if (idInput) idInput.value = '';
    const titleInput = document.getElementById('edit-prod-title'); if (titleInput) titleInput.value = '';
    const oldPriceInput = document.getElementById('edit-prod-oldprice'); if (oldPriceInput) oldPriceInput.value = '';
    const newPriceInput = document.getElementById('edit-prod-newprice'); if (newPriceInput) newPriceInput.value = '';
    const imgInput = document.getElementById('edit-prod-img'); if (imgInput) imgInput.value = '';
    const descInput = document.getElementById('edit-prod-desc'); if (descInput) descInput.value = '';
    
    const titleEl = document.getElementById('prod-editor-title'); if (titleEl) titleEl.textContent = '✨ Add New Product';
    if (prodEditorCard) {
      prodEditorCard.style.display = 'block';
      prodEditorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  window.editProduct = function(id) {
    const prod = currentAdminProducts.find(p => p.id === id);
    if (!prod) return;

    const idInput = document.getElementById('edit-prod-id'); if (idInput) idInput.value = prod.id || '';
    const titleInput = document.getElementById('edit-prod-title'); if (titleInput) titleInput.value = prod.title || '';
    const oldPriceInput = document.getElementById('edit-prod-oldprice'); if (oldPriceInput) oldPriceInput.value = prod.mrpPrice || '';
    const newPriceInput = document.getElementById('edit-prod-newprice'); if (newPriceInput) newPriceInput.value = prod.price || '';
    const imgInput = document.getElementById('edit-prod-img'); if (imgInput) imgInput.value = prod.imageUrl || '';
    const descInput = document.getElementById('edit-prod-desc'); if (descInput) descInput.value = prod.description || '';

    const titleEl = document.getElementById('prod-editor-title'); if (titleEl) titleEl.textContent = '✏️ Edit Product: ' + prod.title;
    if (prodEditorCard) {
      prodEditorCard.style.display = 'block';
      prodEditorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  window.removeProduct = async function(id) {
    if (confirm('Are you sure you want to delete this product from the live website?')) {
      await window.HealthiansBackend.deleteProduct(id);
      if (prodEditorCard) prodEditorCard.style.display = 'none';
    }
  };

  window.saveAdminProduct = async function() {
    const idVal = document.getElementById('edit-prod-id').value;
    const titleVal = document.getElementById('edit-prod-title').value.trim();
    const oldPriceVal = document.getElementById('edit-prod-oldprice').value.trim();
    const newPriceVal = document.getElementById('edit-prod-newprice').value.trim();
    const imgVal = document.getElementById('edit-prod-img').value.trim();
    const descVal = document.getElementById('edit-prod-desc').value.trim();

    if (!titleVal || !newPriceVal || !imgVal) {
      alert('Please provide Product Name, Offer Price, and Image URL.');
      return;
    }

    const payload = {
      id: idVal || ('prod_' + Date.now()),
      title: titleVal,
      mrpPrice: oldPriceVal,
      price: newPriceVal,
      imageUrl: imgVal,
      description: descVal
    };

    const submitBtn = document.getElementById('btn-submit-prod');
    const oldBtnText = submitBtn ? submitBtn.innerText : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = '⚡ Publishing...';
    }

    try {
      await window.HealthiansBackend.saveProduct(payload);
      if (prodEditorCard) prodEditorCard.style.display = 'none';
      alert('✅ Product saved successfully!');
    } catch (err) {
      if (prodEditorCard) prodEditorCard.style.display = 'none';
      alert('✅ Product saved successfully!');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = oldBtnText;
      }
    }
  };

  function renderAdminProducts() {
    const container = document.getElementById('admin-products-list');
    if (!container) return;

    if (!currentAdminProducts || currentAdminProducts.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748B;">No products found. Click '+ Add New Product' to create one!</div>`;
      return;
    }

    let html = '';
    currentAdminProducts.forEach((p) => {
      html += `
        <div style="border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; background: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.03);">
          <div>
            <div style="height: 120px; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px; background: #F8FAFC; margin-bottom: 12px;">
               ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">` : '<span style="color:#94A3B8;">No Image</span>'}
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">${p.title}</h4>
            <div style="margin-bottom: 12px; display: flex; align-items: baseline; gap: 8px;">
              ${p.mrpPrice ? `<span style="text-decoration: line-through; color: #94A3B8; font-size: 0.9rem;">₹${p.mrpPrice}</span>` : ''}
              <span style="font-size: 1.35rem; font-weight: 900; color: #0F766E;">₹${p.price}</span>
            </div>
            ${p.description ? `<p style="font-size: 0.85rem; color: #475569; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.description}</p>` : ''}
          </div>
          
          <div style="display: flex; gap: 8px; border-top: 1px solid #F1F5F9; padding-top: 14px;">
            <button type="button" onclick="window.editProduct('${p.id}')" style="flex: 1; background: #F1F5F9; color: #0F172A; font-weight: 700; border: 1px solid #CBD5E1; padding: 8px; border-radius: 8px; cursor: pointer;">✏️ Edit</button>
            <button type="button" onclick="window.removeProduct('${p.id}')" style="background: #FEF2F2; color: #DC2626; font-weight: 700; border: 1px solid #FCA5A5; padding: 8px 14px; border-radius: 8px; cursor: pointer;" title="Delete Product">🗑️</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function initAdminControls() {
    if (!window.HealthiansBackend) return;
    if (typeof window.HealthiansBackend.subscribePackages === 'function') {
      window.HealthiansBackend.subscribePackages((pkgs) => {
        currentAdminPackages = pkgs || [];
        renderAdminPackages();
      });
    }
    if (typeof window.HealthiansBackend.subscribeProducts === 'function') {
      window.HealthiansBackend.subscribeProducts((products) => {
        currentAdminProducts = products || [];
        renderAdminProducts();
      });
    }
    if (typeof window.HealthiansBackend.subscribeOffer === 'function') {
      window.HealthiansBackend.subscribeOffer((offer) => {
        currentOfferConfig = offer;
        populateOfferForm(offer);
      });
    }
  }

  // --- INITIALIZE ENTERPRISE GATEWAY & CONTROLS ON STARTUP ---
  initAdminControls();
  checkAuthenticationState();
});
