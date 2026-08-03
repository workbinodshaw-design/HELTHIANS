/**
 * ========================================================================
 * HEALTHIANS® OPS COMMAND DESK - PRODUCTION CLOUD FIRESTORE ENGINE
 * Real-time streaming database connection & callback reminder system
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const tbody = document.getElementById('bookings-tbody');
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

  // 1. CONNECT TO REAL-TIME GOOGLE CLOUD FIRESTORE DATABASE
  function initRealtimeDatabase() {
    if (window.healthiansDb) {
      console.log('⚡ Listening to live streaming customer bookings from Google Cloud Firestore...');
      window.healthiansDb.collection('bookings')
        .onSnapshot((snapshot) => {
          currentLiveBookings = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // Ensure document ID is attached
            currentLiveBookings.push(data);
          });

          // Sort by timestamp newest first
          currentLiveBookings.sort((a, b) => {
            const timeA = new Date(a.timestamp || 0).getTime();
            const timeB = new Date(b.timestamp || 0).getTime();
            return timeB - timeA;
          });

          render();
        }, (err) => {
          console.error('⚠️ Firestore snapshot notification error. Please ensure Firestore is created in Test Mode:', err);
          fallbackToLocal();
        });
    } else {
      console.warn('⚠️ Cloud Firestore connection not found, falling back to local cache.');
      fallbackToLocal();
    }
  }

  function fallbackToLocal() {
    try {
      currentLiveBookings = JSON.parse(localStorage.getItem('healthians_admin_bookings') || '[]');
    } catch (e) {
      currentLiveBookings = [];
    }
    render();
  }

  // Helper to persist edits back to Cloud Firestore
  function updateBookingField(id, updateData) {
    if (window.healthiansDb) {
      window.healthiansDb.collection('bookings').doc(id).update(updateData)
        .then(() => console.log(`✅ Order ${id} updated in cloud database`))
        .catch(err => console.error(`Error updating cloud document:`, err));
    } else {
      // Offline fallback
      const idx = currentLiveBookings.findIndex(x => x.id === id);
      if (idx !== -1) {
        Object.assign(currentLiveBookings[idx], updateData);
        localStorage.setItem('healthians_admin_bookings', JSON.stringify(currentLiveBookings));
        render();
      }
    }
  }

  function deleteBookingDoc(id) {
    if (window.healthiansDb) {
      window.healthiansDb.collection('bookings').doc(id).delete()
        .then(() => console.log(`🗑️ Order ${id} deleted from cloud database`))
        .catch(err => console.error(`Error deleting doc:`, err));
    } else {
      currentLiveBookings = currentLiveBookings.filter(x => x.id !== id);
      localStorage.setItem('healthians_admin_bookings', JSON.stringify(currentLiveBookings));
      render();
    }
  }

  // 2. RENDER TABLE & COMPUTE METRICS
  function render() {
    const bookings = currentLiveBookings;
    const now = new Date().toISOString().slice(0, 16);

    // Filter logic
    const filtered = bookings.filter(b => {
      const matchSearch = ((b.name || '') + ' ' + (b.mobile || '') + ' ' + (b.city || '') + ' ' + (b.selectedPackage || '')).toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      if (currentFilter === 'new') return b.status === 'New Booking';
      if (currentFilter === 'callback') return Boolean(b.callBackDate);
      if (currentFilter === 'assigned') return b.status === 'Collector Assigned' || Boolean(b.technician);
      if (currentFilter === 'lab') return b.status === 'In Lab Analysis';
      if (currentFilter === 'completed') return b.status === 'Report Ready';
      return true; // 'all'
    });

    // Compute Quick Statistics & Badges
    let countCb = 0;
    let dueCallbacks = 0;
    let countAsg = 0;
    let countLb = 0;
    let countRdy = 0;
    let countNw = 0;

    bookings.forEach(b => {
      if (b.callBackDate) {
        countCb++;
        if (b.callBackDate <= now) {
          dueCallbacks++;
        }
      }
      if (b.status === 'New Booking') countNw++;
      if (b.status === 'Collector Assigned' || b.technician) countAsg++;
      if (b.status === 'In Lab Analysis') countLb++;
      if (b.status === 'Report Ready') countRdy++;
    });

    // Update Stat Cards & Badges
    statTotal.textContent = bookings.length;
    statCallback.textContent = countCb;
    statDispatch.textContent = countAsg;
    statCompleted.textContent = countRdy;

    countAll.textContent = bookings.length;
    countNew.textContent = countNw;
    countCallbackPill.textContent = countCb;
    countAssigned.textContent = countAsg;
    countLab.textContent = countLb;
    countCompletedPill.textContent = countRdy;

    // Trigger Top Alert Banner if Callbacks are due today/now
    if (dueCallbacks > 0) {
      alertBanner.classList.remove('hidden');
      alertCountTitle.textContent = `⚠️ ${dueCallbacks} Scheduled Call Back${dueCallbacks > 1 ? 's' : ''} Due Today or Now!`;
    } else {
      alertBanner.classList.add('hidden');
    }

    // Render Table Content
    tbody.innerHTML = '';
    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      filtered.forEach(b => {
        const row = document.createElement('tr');
        const isDue = b.callBackDate && b.callBackDate <= now;
        if (isDue) {
          row.classList.add('row-alert-highlight');
        }

        let statusClass = 'status-new';
        if (b.status === 'Collector Assigned') statusClass = 'status-assigned';
        if (b.status === 'In Lab Analysis') statusClass = 'status-lab';
        if (b.status === 'Report Ready') statusClass = 'status-ready';
        if (b.status === 'Cancelled') statusClass = 'status-cancel';

        const dateObj = new Date(b.timestamp || Date.now());
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        let callbackHtml = `<button class="btn-callback-add" data-id="${b.id}">⏰ Schedule Call Back</button>`;
        if (b.callBackDate) {
          const cbDate = new Date(b.callBackDate).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
          callbackHtml = `
            <div class="callback-badge" data-id="${b.id}" title="Click to edit or remove reminder">
              <span class="cb-time">⏰ ${isDue ? '🚨 DUE NOW: ' : ''}${cbDate}</span>
              <span class="cb-note">${b.callBackNote || 'No special instructions written.'}</span>
            </div>
          `;
        }

        row.innerHTML = `
          <td class="patient-meta">
            <span class="p-name">${b.name || 'Patient'}</span>
            <span class="p-city">${b.city || 'India'}</span>
            <br>
            <a href="tel:${b.mobile}" class="p-phone">📞 +91 ${b.mobile || ''}</a>
            <span class="p-time">ID: ${b.id} &bull; Booked: ${dateStr}</span>
          </td>
          
          <td>
            <span class="pkg-pill">${b.selectedPackage || 'General Inquiry'}</span>
          </td>

          <td>
            <select class="table-select slot-select" data-id="${b.id}">
              <option value="Pending Scheduling" ${b.scheduleSlot === 'Pending Scheduling' ? 'selected' : ''}>Pending Scheduling</option>
              <option value="Today 06:00 - 07:00 AM Fasting" ${b.scheduleSlot === 'Today 06:00 - 07:00 AM Fasting' ? 'selected' : ''}>Today 06:00 - 07:00 AM Fasting</option>
              <option value="Today 07:00 - 08:00 AM Fasting" ${b.scheduleSlot === 'Today 07:00 - 08:00 AM Fasting' ? 'selected' : ''}>Today 07:00 - 08:00 AM Fasting</option>
              <option value="Today 09:00 - 11:00 AM" ${b.scheduleSlot === 'Today 09:00 - 11:00 AM' ? 'selected' : ''}>Today 09:00 - 11:00 AM</option>
              <option value="Today 12:00 - 02:00 PM" ${b.scheduleSlot === 'Today 12:00 - 02:00 PM' ? 'selected' : ''}>Today 12:00 - 02:00 PM</option>
              <option value="Tomorrow 06:00 - 07:00 AM Fasting" ${b.scheduleSlot === 'Tomorrow 06:00 - 07:00 AM Fasting' ? 'selected' : ''}>Tomorrow 06:00 - 07:00 AM Fasting</option>
              <option value="Tomorrow 08:00 - 10:00 AM" ${b.scheduleSlot === 'Tomorrow 08:00 - 10:00 AM' ? 'selected' : ''}>Tomorrow 08:00 - 10:00 AM</option>
              <option value="Completed" ${b.scheduleSlot === 'Completed' ? 'selected' : ''}>✅ Slot Visit Completed</option>
            </select>
          </td>

          <td>
            <select class="table-select status-select ${statusClass}" data-id="${b.id}" style="margin-bottom: 6px;">
              <option value="New Booking" ${b.status === 'New Booking' ? 'selected' : ''}>🟡 New Booking</option>
              <option value="Collector Assigned" ${b.status === 'Collector Assigned' ? 'selected' : ''}>🔵 Collector Assigned</option>
              <option value="Sample Collected" ${b.status === 'Sample Collected' ? 'selected' : ''}>🟣 Sample Collected</option>
              <option value="In Lab Analysis" ${b.status === 'In Lab Analysis' ? 'selected' : ''}>🧪 In Lab Analysis</option>
              <option value="Report Ready" ${b.status === 'Report Ready' ? 'selected' : ''}>🟢 Report Ready</option>
              <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
            </select>
            <br>
            <select class="table-select tech-select" data-id="${b.id}" style="font-size: 0.8rem; color: #475569;">
              <option value="" ${!b.technician ? 'selected' : ''}>— Assign Phlebotomist —</option>
              <option value="Rahul Sharma [HLT-104]" ${b.technician === 'Rahul Sharma [HLT-104]' ? 'selected' : ''}>🛵 Rahul Sharma [HLT-104]</option>
              <option value="Vikram Singh [HLT-209]" ${b.technician === 'Vikram Singh [HLT-209]' ? 'selected' : ''}>🛵 Vikram Singh [HLT-209]</option>
              <option value="Sunita Rao [HLT-312]" ${b.technician === 'Sunita Rao [HLT-312]' ? 'selected' : ''}>🛵 Sunita Rao [HLT-312]</option>
              <option value="Amit Kumar [HLT-401]" ${b.technician === 'Amit Kumar [HLT-401]' ? 'selected' : ''}>🛵 Amit Kumar [HLT-401]</option>
            </select>
          </td>

          <td class="callback-cell">
            ${callbackHtml}
          </td>

          <td>
            <div class="actions-flex">
              <button class="btn-wa-dispatch" data-id="${b.id}">
                <span>💬 WhatsApp</span>
              </button>
              <button class="btn-delete-row" data-id="${b.id}" title="Delete Order">🗑️</button>
            </div>
          </td>
        `;

        tbody.appendChild(row);
      });
    }

    bindRowEvents();
  }

  // 3. ROW EVENT LISTENERS
  function bindRowEvents() {
    const bookings = currentLiveBookings;

    // Slot Change -> Sync to Cloud Firestore
    document.querySelectorAll('.slot-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        updateBookingField(id, { scheduleSlot: e.target.value });
      });
    });

    // Status Change -> Sync to Cloud Firestore
    document.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        updateBookingField(id, { status: e.target.value });
      });
    });

    // Technician Change -> Sync to Cloud Firestore
    document.querySelectorAll('.tech-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const order = bookings.find(x => x.id === id);
        if (order) {
          const updates = { technician: e.target.value };
          if (updates.technician && order.status === 'New Booking') {
            updates.status = 'Collector Assigned';
          }
          updateBookingField(id, updates);
        }
      });
    });

    // Open Callback Modal
    document.querySelectorAll('.btn-callback-add, .callback-badge').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openCallbackModal(id);
      });
    });

    // WhatsApp Dispatch
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

    // Delete Booking from Cloud Firestore
    document.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to permanently delete patient order ${id}?`)) {
          deleteBookingDoc(id);
        }
      });
    });
  }

  // 4. CALLBACK MODAL ENGINE ("Call Me Tomorrow")
  function openCallbackModal(id) {
    const bookings = currentLiveBookings;
    const order = bookings.find(x => x.id === id);
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
      const formatted = targetDate.toISOString().slice(0, 16);
      callbackDatetime.value = formatted;
    });
  });

  if (clearCallbackBtn) {
    clearCallbackBtn.addEventListener('click', () => {
      const id = modalOrderId.value;
      updateBookingField(id, { callBackDate: '', callBackNote: '' });
      closeModal();
    });
  }

  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = modalOrderId.value;
      updateBookingField(id, {
        callBackDate: callbackDatetime.value,
        callBackNote: callbackNote.value
      });
      closeModal();
    });
  }

  // 5. SEARCH & FILTER CONTROLS
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      render();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      render();
    });
  });

  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', () => {
      const filterTarget = card.getAttribute('data-filter');
      const matchPill = document.querySelector(`.filter-pill[data-filter="${filterTarget}"]`);
      if (matchPill) matchPill.click();
    });
  });

  if (filterCallbacksBtn) {
    filterCallbacksBtn.addEventListener('click', () => {
      const cbPill = document.querySelector('.filter-pill[data-filter="callback"]');
      if (cbPill) cbPill.click();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
  }

  // INIT REAL-TIME DATABASE
  initRealtimeDatabase();
});
