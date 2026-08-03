/**
 * ========================================================================
 * HEALTHIANS® OPS COMMAND DESK - INTERACTION ENGINE & CALLBACK ALARM
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'healthians_admin_bookings';
  
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

  // 1. INITIALIZE DEMO / REAL STORAGE
  function initStorage() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing || JSON.parse(existing).length === 0) {
      loadDefaultSampleData();
    }
  }

  function loadDefaultSampleData() {
    const now = new Date();
    // Create an alarm date that is due RIGHT NOW (15 mins ago) to showcase the alarm banner!
    const dueTime = new Date(now.getTime() - 15 * 60000).toISOString().slice(0, 16);
    const tomorrowTime = new Date(now.getTime() + 24 * 3600000).toISOString().slice(0, 16);

    const defaultOrders = [
      {
        id: 'ORD-98214',
        name: 'Sneha Sharma',
        mobile: '9876543210',
        city: 'Delhi NCR',
        selectedPackage: 'Full Body Vital Super',
        timestamp: new Date(now.getTime() - 40 * 60000).toISOString(),
        status: 'New Booking',
        technician: '',
        scheduleSlot: 'Today 06:00 - 07:00 AM Fasting',
        callBackDate: dueTime,
        callBackNote: 'Patient was driving. Requested immediate call back at this time for package discount details.'
      },
      {
        id: 'ORD-84721',
        name: 'Amit Verma',
        mobile: '9123456789',
        city: 'Gurgaon',
        selectedPackage: 'Diabetes & Lipid Profile Care',
        timestamp: new Date(now.getTime() - 120 * 60000).toISOString(),
        status: 'Collector Assigned',
        technician: 'Rahul Sharma [HLT-104]',
        scheduleSlot: 'Tomorrow 07:00 - 08:00 AM Fasting',
        callBackDate: '',
        callBackNote: ''
      },
      {
        id: 'ORD-65342',
        name: 'Rajesh Gupta',
        mobile: '9988776655',
        city: 'Noida',
        selectedPackage: 'Thyroid Care Shield',
        timestamp: new Date(now.getTime() - 300 * 60000).toISOString(),
        status: 'In Lab Analysis',
        technician: 'Vikram Singh [HLT-209]',
        scheduleSlot: 'Today 06:00 - 07:00 AM Fasting',
        callBackDate: '',
        callBackNote: ''
      },
      {
        id: 'ORD-44910',
        name: 'Pooja Nair',
        mobile: '9012345678',
        city: 'Mumbai',
        selectedPackage: 'Vitamin D & B12 Advanced Check',
        timestamp: new Date(now.getTime() - 600 * 60000).toISOString(),
        status: 'Report Ready',
        technician: 'Sunita Rao [HLT-312]',
        scheduleSlot: 'Completed',
        callBackDate: tomorrowTime,
        callBackNote: 'Report sent. Call back tomorrow morning to check if patient wantsdoctor explanation.'
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOrders));
  }

  function getBookings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  // 2. RENDER TABLE & COMPUTE METRICS
  function render() {
    const bookings = getBookings();
    const now = new Date().toISOString().slice(0, 16);

    // Filter logic
    const filtered = bookings.filter(b => {
      // Search term filter
      const matchSearch = (b.name + ' ' + b.mobile + ' ' + b.city + ' ' + b.selectedPackage).toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      // Category tab filter
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

        // Status style class helper
        let statusClass = 'status-new';
        if (b.status === 'Collector Assigned') statusClass = 'status-assigned';
        if (b.status === 'In Lab Analysis') statusClass = 'status-lab';
        if (b.status === 'Report Ready') statusClass = 'status-ready';
        if (b.status === 'Cancelled') statusClass = 'status-cancel';

        // Format timestamp nice
        const dateObj = new Date(b.timestamp || Date.now());
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Format callback date display
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
            <span class="p-name">${b.name}</span>
            <span class="p-city">${b.city}</span>
            <br>
            <a href="tel:${b.mobile}" class="p-phone">📞 +91 ${b.mobile}</a>
            <span class="p-time">ID: ${b.id} &bull; Booked: ${dateStr}</span>
          </td>
          
          <td>
            <span class="pkg-pill">${b.selectedPackage}</span>
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

  // 3. ROW EVENT LISTENERS (Status changes, schedule dropdowns, WhatsApp dispatch)
  function bindRowEvents() {
    const bookings = getBookings();

    // Slot Change
    document.querySelectorAll('.slot-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const order = bookings.find(x => x.id === id);
        if (order) {
          order.scheduleSlot = e.target.value;
          saveBookings(bookings);
          render();
        }
      });
    });

    // Status Change
    document.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const order = bookings.find(x => x.id === id);
        if (order) {
          order.status = e.target.value;
          saveBookings(bookings);
          render();
        }
      });
    });

    // Technician Change
    document.querySelectorAll('.tech-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const order = bookings.find(x => x.id === id);
        if (order) {
          order.technician = e.target.value;
          if (order.technician && order.status === 'New Booking') {
            order.status = 'Collector Assigned'; // Automatically update status!
          }
          saveBookings(bookings);
          render();
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

    // WhatsApp Dispatch & Customer Messaging
    document.querySelectorAll('.btn-wa-dispatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const order = bookings.find(x => x.id === id);
        if (order) {
          let msg = '';
          let targetPhone = order.mobile.replace(/\D/g, '');
          
          if (order.technician) {
            // Send dispatch alert to Technician or Customer
            msg = `🚀 *HEALTHIANS® DISPATCH UPDATE*\n\nHello *${order.name}* (${order.city}),\nYour diagnostic home sample collection is confirmed!\n\n📅 *Slot:* ${order.scheduleSlot}\n🧪 *Test:* ${order.selectedPackage}\n🛵 *Assigned Phlebotomist:* ${order.technician}\n\nOur technician will arrive promptly at your home! For support, reply here.`;
          } else if (order.status === 'Report Ready') {
            msg = `🎉 *HEALTHIANS® SMART REPORT READY*\n\nHello *${order.name}*,\nGood news! Your diagnostic results for *${order.selectedPackage}* are fully processed by our NABL lab.\n\nYour interactive health dashboard & PDF report have been sent to your registered email/number. Stay healthy!`;
          } else {
            msg = `Hello *${order.name}*,\nThank you for booking with Healthians® in ${order.city} for *${order.selectedPackage}*.\n\nWe are reaching out to confirm your home address and sample collection time slot. Please reply with your preferred time!`;
          }

          // Open WhatsApp web or mobile
          const url = `https://wa.me/91${targetPhone}?text=${encodeURIComponent(msg)}`;
          window.open(url, '_blank');
        }
      });
    });

    // Delete Booking
    document.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete patient order ${id}?`)) {
          const updated = bookings.filter(x => x.id !== id);
          saveBookings(updated);
          render();
        }
      });
    });
  }

  // 4. CALLBACK MODAL ENGINE ("Call Me Tomorrow")
  function openCallbackModal(id) {
    const bookings = getBookings();
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

  // Quick shortcut buttons (+3h, +24h)
  document.querySelectorAll('.btn-quick-time').forEach(btn => {
    btn.addEventListener('click', () => {
      const hours = parseInt(btn.getAttribute('data-hours'), 10);
      const targetDate = new Date(Date.now() + hours * 3600000);
      // format for datetime-local (YYYY-MM-DDTHH:MM)
      const formatted = targetDate.toISOString().slice(0, 16);
      callbackDatetime.value = formatted;
    });
  });

  if (clearCallbackBtn) {
    clearCallbackBtn.addEventListener('click', () => {
      const id = modalOrderId.value;
      const bookings = getBookings();
      const order = bookings.find(x => x.id === id);
      if (order) {
        order.callBackDate = '';
        order.callBackNote = '';
        saveBookings(bookings);
        closeModal();
        render();
      }
    });
  }

  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = modalOrderId.value;
      const bookings = getBookings();
      const order = bookings.find(x => x.id === id);
      if (order) {
        order.callBackDate = callbackDatetime.value;
        order.callBackNote = callbackNote.value;
        saveBookings(bookings);
        closeModal();
        render();
      }
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

  // Click on stat summary cards to filter table
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

  // 6. EXTRA DEMO TOOLS (Add Sample / Reset Data)
  const addSampleBtn = document.getElementById('add-sample-btn');
  if (addSampleBtn) {
    addSampleBtn.addEventListener('click', () => {
      const sampleNames = ['Anjali Deshpande', 'Vikramaditya Rao', 'Meera Joshi', 'Ramesh Patel', 'Divya Kapoor', 'Harshvardhan Sinha'];
      const sampleCities = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Kolkata'];
      const samplePackages = ['Full Body Vital Super', 'Diabetes & Lipid Profile Care', 'Thyroid Care Shield', 'Vitamin D & B12 Advanced Check', 'Senior Citizen Complete Guardian'];
      const sampleSlots = ['Pending Scheduling', 'Today 06:00 - 07:00 AM Fasting', 'Tomorrow 07:00 - 08:00 AM Fasting', 'Tomorrow 09:00 - 11:00 AM'];

      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomCity = sampleCities[Math.floor(Math.random() * sampleCities.length)];
      const randomPkg = samplePackages[Math.floor(Math.random() * samplePackages.length)];
      const randomSlot = sampleSlots[Math.floor(Math.random() * sampleSlots.length)];
      const randomPhone = '9' + Math.floor(100000000 + Math.random() * 900000000);

      const newOrder = {
        id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
        name: randomName,
        mobile: randomPhone,
        city: randomCity,
        selectedPackage: randomPkg,
        timestamp: new Date().toISOString(),
        status: 'New Booking',
        technician: '',
        scheduleSlot: randomSlot,
        callBackDate: '',
        callBackNote: ''
      };

      const bookings = getBookings();
      bookings.unshift(newOrder);
      saveBookings(bookings);
      render();
    });
  }

  const resetStorageBtn = document.getElementById('reset-storage-btn');
  if (resetStorageBtn) {
    resetStorageBtn.addEventListener('click', () => {
      if (confirm('This will restore the default demo test patients. Continue?')) {
        localStorage.removeItem(STORAGE_KEY);
        loadDefaultSampleData();
        render();
      }
    });
  }

  // INIT
  initStorage();
  render();
});
