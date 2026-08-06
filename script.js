/**
 * ========================================================================
 * HEALTHIANS® MODERN PRODUCT INTERACTION & ANALYTICS ENGINE
 * Built for High-Converting Ads Traffic (Apple/Stripe UX Pattern)
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global App Language & Security Sanitation Engine
  let currentLang = localStorage.getItem('healthians_lang') || 'en';

  function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>&"'/]/g, function(s) {
      const entityMap = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
      };
      return entityMap[s] || s;
    }).trim();
  }

  // 1. MINIMALIST NOTION/APPLE FAQ ACCORDION HANDLER
  const faqRows = document.querySelectorAll('.faq-row');
  
  faqRows.forEach(row => {
    const btn = row.querySelector('.faq-question-btn');
    const answerBox = row.querySelector('.faq-answer-box');
    const answerInner = row.querySelector('.faq-answer-inner');
    
    btn.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      
      // Close other open rows for clean mobile reading
      faqRows.forEach(other => {
        if (other !== row && other.classList.contains('open')) {
          other.classList.remove('open');
          const otherBox = other.querySelector('.faq-answer-box');
          if (otherBox) otherBox.style.maxHeight = '0px';
        }
      });
      
      if (!isOpen) {
        row.classList.add('open');
        if (answerBox && answerInner) {
          answerBox.style.maxHeight = (answerInner.scrollHeight + 30) + 'px';
        }
      } else {
        row.classList.remove('open');
        if (answerBox) {
          answerBox.style.maxHeight = '0px';
        }
      }
    });
  });

  // 2. PACKAGE SELECTION & PROGRESSIVE DISCLOSURE (Using Event Delegation for Dynamic Admin Packages)
  const selectedPackageBox = document.getElementById('selected-package-box');
  const packageTitleText = document.getElementById('package-title-text');
  const removePackageBtn = document.getElementById('remove-package-btn');
  const bookCardDestination = document.getElementById('booking-card-destination');
  const leadNameInput = document.getElementById('lead-name');
  let currentSelectedPackage = '';

  document.addEventListener('click', (e) => {
    // Check if clicked element is a Book Package button
    const selectBtn = e.target.closest('.select-pkg-btn');
    if (selectBtn) {
      const pkgItem = selectBtn.closest('.package-item');
      if (pkgItem) {
        const pkgName = pkgItem.getAttribute('data-pkg') || 'Selected Package';
        currentSelectedPackage = pkgName;
        if (packageTitleText) packageTitleText.innerText = pkgName;
        if (selectedPackageBox) selectedPackageBox.style.display = 'flex';
        
        // Track test package conversion click event
        logConversionEvent('Select_Diagnostic_Package', { package: pkgName });

        // Smooth scroll to luxury lead form
        if (bookCardDestination) {
          bookCardDestination.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Auto focus name field after smooth scroll animation
        setTimeout(() => {
          if (leadNameInput) leadNameInput.focus();
        }, 550);
      }
      return;
    }

    // Check if clicked element is an Accordion Toggle for test details
    const toggleBtn = e.target.closest('[data-action="toggle-pkg-details"]');
    if (toggleBtn) {
      const pkgItem = toggleBtn.closest('.package-item');
      const panel = pkgItem ? pkgItem.querySelector('.accordion-panel') : null;
      if (panel) {
        const isActive = panel.classList.contains('active');
        if (isActive) {
          panel.style.maxHeight = '0px';
          panel.classList.remove('active');
          toggleBtn.innerHTML = '<span data-i18n="view_details">' + (currentLang === 'hi' ? 'टेस्ट का पूरा विवरण ▾' : 'View test details ▾') + '</span>';
        } else {
          panel.classList.add('active');
          panel.style.maxHeight = (panel.scrollHeight + 40) + 'px';
          toggleBtn.innerHTML = '<span>' + (currentLang === 'hi' ? 'विवरण छुपाएं ▴' : 'Hide details ▴') + '</span>';
        }
      }
      return;
    }
  });

  if (removePackageBtn) {
    removePackageBtn.addEventListener('click', () => {
      currentSelectedPackage = '';
      if (selectedPackageBox) selectedPackageBox.style.display = 'none';
    });
  }

  // 4. INTERACTIVE SEARCHABLE & MANUAL TYPING CITY SELECTOR
  const cityContainer = document.getElementById('city-select-container');
  const leadCityInput = document.getElementById('lead-city');
  const cityMenu = document.getElementById('city-dropdown-menu');
  const cityChevron = document.getElementById('city-chevron');

  const masterCitiesList = [
    "Agra", "Ahmedabad", "Ahmednagar", "Aizawl", "Ajmer", "Akola", "Aligarh", "Allahabad (Prayagraj)", "Alwar", "Ambala", "Amravati", "Amritsar", "Anand", "Asansol", "Assam", "Aurangabad", "Ayodhya",
    "Baddi", "Balasore", "Bangalore (Bengaluru)", "Bareilly", "Baroda (Vadodara)", "Bathinda", "Belgaum", "Bellary", "Berhampur", "Bhagalpur", "Bharatpur", "Bharuch", "Bhavnagar", "Bhilai", "Bhiwadi", "Bhilwara", "Bhiwandi", "Bhopal", "Bhubaneswar", "Bidar", "Bihar", "Bikaner", "Bilaspur", "Bokaro", "Bulandshahr", "Burdwan", "Burhanpur",
    "Calicut (Kozhikode)", "Chandigarh", "Chandrapur", "Chennai", "Chhapra", "Chhindwara", "Chittoor", "Chittorgarh", "Coimbatore", "Cuttack",
    "Daman", "Darbhanga", "Darjeeling", "Davangere", "Dehradun", "Delhi", "Delhi NCR", "Dewas", "Dhanbad", "Dharamsala", "Dharwad", "Dhule", "Dibrugarh", "Dindigul", "Durgapur", "Durg",
    "Eluru", "Ernakulam", "Erode", "Etah", "Etawah",
    "Faizabad", "Faridabad", "Faridkot", "Fatehpur", "Firozabad", "Firozpur",
    "Gandhidham", "Gandhinagar", "Gangtok", "Gaya", "Ghaziabad", "Ghazipur", "Goa", "Godhra", "Gorakhpur", "Greater Noida", "Guntur", "Gurdaspur", "Gurgaon (Gurugram)", "Guwahati", "Gwalior",
    "Haldia", "Haldwani", "Haridwar", "Hassan", "Hathras", "Hisar", "Hoshiarpur", "Hosur", "Howrah", "Hubli", "Hyderabad",
    "Idukki", "Imphal", "Indore", "Itanagar",
    "Jabalpur", "Jagdalpur", "Jaipur", "Jajpur", "Jalandhar", "Jalgaon", "Jalpaiguri", "Jammu", "Jamnagar", "Jamshedpur", "Jaunpur", "Jhaijar", "Jhalawar", "Jhansi", "Jhunjhunu", "Jodhpur", "Jorhat", "Junagadh",
    "Kakinada", "Kanchipuram", "Kanyakumari", "Kanpur", "Kapurthala", "Karimnagar", "Karnal", "Karur", "Kashipur", "Katni", "Khammam", "Khandwa", "Kharagpur", "Kochi", "Kodaikanal", "Kolar", "Kolhapur", "Kolkata", "Kollam", "Kota", "Kottayam", "Kozhikode", "Kurnool", "Kurukshetra",
    "Latur", "Leh", "Lucknow", "Ludhiana",
    "Madurai", "Mahbubnagar", "Malappuram", "Malda", "Manali", "Mandi", "Mangalore", "Mathura", "Meerut", "Mehsana", "Mirzapur", "Mohali", "Moradabad", "Morbi", "Morena", "Mumbai", "Mumbai & Thane", "Muzaffarnagar", "Muzaffarpur", "Mysore",
    "Nadiad", "Nagaon", "Nagercoil", "Nagpur", "Nainital", "Nanded", "Narnaul", "Nashik", "Navsari", "Nellore", "New Delhi", "Nizamabad", "Noida",
    "Ooty", "Orai", "Osmanabad",
    "Palakkad", "Pali", "Palwal", "Panaji", "Panchkula", "Panipat", "Panvel", "Pathankot", "Patiala", "Patna", "Pimpri-Chinchwad", "Puducherry (Pondicherry)", "Port Blair", "Prayagraj", "Proddatur", "Pune", "Puri", "Purnia", "Purulia",
    "Qadian", "Quilon",
    "Raichur", "Raigarh", "Raipur", "Rajahmundry", "Rajkot", "Rajouri", "Rajsamand", "Ramagundam", "Ramanathapuram", "Rampur", "Ranchi", "Raniganj", "Ratlam", "Ratnagiri", "Rewa", "Rishikesh", "Rohtak", "Roorkee", "Rourkela", "Rudrapur",
    "Sagar", "Saharanpur", "Saharsa", "Salem", "Samastipur", "Sambalpur", "Sangareddy", "Sangli", "Satara", "Satna", "Secunderabad", "Sehore", "Shillong", "Shimla", "Shimoga", "Shivpuri", "Sikar", "Silvassa", "Silchar", "Siliguri", "Sindhudurg", "Singrauli", "Sirmaur", "Sirsa", "Sitapur", "Sivakasi", "Siwan", "Solan", "Solapur", "Sonepat", "Sriganganagar", "Srinagar", "Sultanpur", "Surat", "Surendranagar", "Suryapet",
    "Tadepalligudem", "Tenali", "Tezpur", "Thane", "Thanjavur", "Thiruvananthapuram", "Thrissur", "Tinsukia", "Tirunelveli", "Tirupati", "Tirupattur", "Tiruppur", "Tiruvannamalai", "Tonk", "Trichy (Tiruchirappalli)", "Trivandrum", "Tumkur", "Tuticorin",
    "Udaipur", "Udupi", "Ujjain", "Ulhasnagar", "Una", "Unnao", "Uttarkashi",
    "Vadodara", "Valsad", "Vapi", "Varanasi", "Vasai-Virar", "Vellore", "Veraval", "Vidisha", "Vijayawada", "Villupuram", "Virudhunagar", "Visakhapatnam", "Vizianagaram", "Vrindavan",
    "Warangal", "Wardha", "Wayanad", "West Bengal",
    "Yamuna Nagar", "Yavatmal", "Yercaud",
    "Zirakpur"
  ];

  function renderCityDropdown(filterText = "") {
    if (!cityMenu) return;
    cityMenu.innerHTML = "";
    const cleanFilter = filterText.trim().toLowerCase();
    
    // Filter list or show all if filter is empty
    const matched = masterCitiesList.filter(c => c.toLowerCase().includes(cleanFilter));
    
    // If typing something custom or not found in quick suggestions, display manual typing confirmation option
    if (matched.length === 0 && cleanFilter.length > 0) {
      const customDiv = document.createElement('div');
      customDiv.className = 'dropdown-item';
      customDiv.innerHTML = `Use custom location: <strong style="color:#0E7490; margin-left: 4px;">${sanitizeInput(filterText.trim())}</strong>`;
      customDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        if (leadCityInput) leadCityInput.value = filterText.trim();
        cityMenu.classList.remove('show');
        if (cityChevron) cityChevron.style.transform = 'translateY(-50%) rotate(0deg)';
      });
      cityMenu.appendChild(customDiv);
      return;
    }

    // Render up to top 60 matches for lightning fast performance and smooth UI
    const listToRender = matched.slice(0, 60);
    listToRender.forEach(cityName => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'dropdown-item';
      itemDiv.textContent = cityName;
      itemDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        if (leadCityInput) {
          leadCityInput.value = cityName;
        }
        cityMenu.classList.remove('show');
        if (cityChevron) cityChevron.style.transform = 'translateY(-50%) rotate(0deg)';
        logConversionEvent('City_Selected', { city: cityName });
      });
      cityMenu.appendChild(itemDiv);
    });
  }

  if (leadCityInput && cityMenu) {
    leadCityInput.addEventListener('focus', () => {
      renderCityDropdown(leadCityInput.value);
      cityMenu.classList.add('show');
      if (cityChevron) cityChevron.style.transform = 'translateY(-50%) rotate(180deg)';
    });

    leadCityInput.addEventListener('click', (e) => {
      e.stopPropagation();
      renderCityDropdown(leadCityInput.value);
      cityMenu.classList.add('show');
      if (cityChevron) cityChevron.style.transform = 'translateY(-50%) rotate(180deg)';
    });

    leadCityInput.addEventListener('input', (e) => {
      renderCityDropdown(e.target.value);
      if (!cityMenu.classList.contains('show')) {
        cityMenu.classList.add('show');
        if (cityChevron) cityChevron.style.transform = 'translateY(-50%) rotate(180deg)';
      }
    });
  }

  if (cityChevron && cityMenu) {
    cityChevron.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShow = cityMenu.classList.toggle('show');
      cityChevron.style.transform = isShow ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0deg)';
      if (isShow && leadCityInput) {
        renderCityDropdown(leadCityInput.value);
        leadCityInput.focus();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (cityContainer && !cityContainer.contains(e.target)) {
      if (cityMenu) cityMenu.classList.remove('show');
      if (cityChevron) cityChevron.style.transform = 'translateY(-50%) rotate(0deg)';
    }
  });

  // 4B. LEAD FORM SUBMISSION & SUCCESS MODAL (Google Ads & Meta Pixel Lead Event)
  const bookingForm = document.getElementById('healthians-booking-form');
  const successModal = document.getElementById('booking-success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Anti-Spam / Rate-Limiting Protection (Prevent Flood Attacks)
      const nowTs = Date.now();
      const lastSubmitTs = parseInt(sessionStorage.getItem('healthians_last_submit_ts') || '0', 10);
      if (nowTs - lastSubmitTs < 15000) {
        alert(currentLang === 'hi' ? 'कृपया कुछ देर प्रतीक्षा कर के पुनः प्रयास करें।' : 'Please wait a few seconds before submitting another booking request.');
        return;
      }

      const formData = new FormData(bookingForm);
      const chosenCity = sanitizeInput(formData.get('city') || '');
      const patientName = sanitizeInput(formData.get('patient_name') || '');
      const rawMobile = (formData.get('mobile_number') || '').replace(/\D/g, '');

      if (!patientName || patientName.length < 2) {
        alert(currentLang === 'hi' ? 'कृपया मरीज का पूरा नाम दर्ज करें।' : 'Please enter a valid Patient Name.');
        const nameInput = document.getElementById('lead-name');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!rawMobile || rawMobile.length < 10) {
        alert(currentLang === 'hi' ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
        const phoneInput = document.getElementById('lead-phone');
        if (phoneInput) phoneInput.focus();
        return;
      }

      if (!chosenCity || chosenCity.trim() === '') {
        alert(currentLang === 'hi' ? 'कृपया अपना शहर चुनें।' : 'Please select your city.');
        if (cityContainer) {
          cityContainer.style.borderColor = '#E11D48';
          setTimeout(() => cityContainer.style.borderColor = '', 2000);
        }
        return;
      }

      const bookingData = {
        id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
        name: patientName,
        mobile: rawMobile,
        city: chosenCity,
        selectedPackage: sanitizeInput(currentSelectedPackage || 'General Home Blood Collection Inquiry'),
        timestamp: new Date().toISOString(),
        status: 'New Booking',
        technician: '',
        scheduleSlot: 'Pending Scheduling',
        callBackDate: '',
        callBackNote: ''
      };

      // Show clean, professional loading state
      const submitBtn = bookingForm.querySelector('button[type="submit"]') || bookingForm.querySelector('.btn-primary');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = (currentLang === 'hi') ? '⏳ आपकी बुकिंग दर्ज हो रही है...' : '⏳ Securing Visit Slot...';
        submitBtn.style.opacity = '0.85';
      }

      let isSavedSuccessfully = false;
      if (window.HealthiansBackend) {
        try {
          const result = await window.HealthiansBackend.saveOrder(bookingData);
          if (result && result.status === 'success') {
            isSavedSuccessfully = true;
          }
        } catch (err) {
          // Silent error handling to prevent leaking infrastructure details
        }
      } 
      
      if (!isSavedSuccessfully) {
        try {
          let currentBookings = JSON.parse(localStorage.getItem('healthians_admin_bookings') || '[]');
          currentBookings.unshift(bookingData);
          localStorage.setItem('healthians_admin_bookings', JSON.stringify(currentBookings));
          isSavedSuccessfully = true;
        } catch (e) {
          // Silent fallback failure handling
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        submitBtn.style.opacity = '1';
      }

      if (!isSavedSuccessfully) {
        alert(currentLang === 'hi' ? 'बुकिंग दर्ज करने में समस्या हुई। कृपया अपने नेटवर्क की जांच करें।' : 'Unable to confirm booking at this time. Please verify your internet connection and try again.');
        return;
      }

      // Record rate limit timestamp upon confirmed successful submission
      sessionStorage.setItem('healthians_last_submit_ts', Date.now().toString());

      // Log Lead conversion event for Google & Meta Ads tracking only on confirmed save
      logConversionEvent('Lead_Submitted_Success', bookingData);

      // Trigger high-converting visual confirmation modal with dynamic patient personalization
      if (successModal) {
        const modalNameSpan = document.getElementById('modal-patient-name');
        const modalPkgSpan = document.getElementById('modal-pkg-name');
        const modalCitySpan = document.getElementById('modal-city-name');
        
        if (modalNameSpan) modalNameSpan.textContent = patientName;
        if (modalPkgSpan) modalPkgSpan.textContent = bookingData.selectedPackage;
        if (modalCitySpan) modalCitySpan.textContent = chosenCity;

        successModal.style.display = 'flex';
        successModal.classList.add('active');
      }

      // Reset form fields and custom selector
      bookingForm.reset();
      currentSelectedPackage = '';
      if (selectedPackageBox) selectedPackageBox.style.display = 'none';
      const leadCityElem = document.getElementById('lead-city');
      if (leadCityElem) leadCityElem.value = '';
      if (cityMenu) cityMenu.classList.remove('show');
      if (cityChevron) cityChevron.style.transform = 'translateY(-50%) rotate(0deg)';
    });
  }

  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.style.display = 'none';
      successModal.classList.remove('active');
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.style.display = 'none';
        successModal.classList.remove('active');
      }
    });
  }

  // 5. CLICK TRACKING FOR CALL & WHATSAPP CTAS (For ads attribution)
  const callButtons = document.querySelectorAll('a[href^="tel:"]');
  const waButtons = document.querySelectorAll('a[href*="wa.me"]');

  callButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      logConversionEvent('Call_Button_Clicked', { number: '+91-9044401435' });
    });
  });

  waButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      logConversionEvent('WhatsApp_Chat_Initiated', { destination: '+91-9044401435' });
    });
  });

  // 6. INSTANT HINDI / ENGLISH LANGUAGE TRANSLATION ENGINE
  const langSwitcherBtn = document.getElementById('lang-switcher') || document.getElementById('lang-toggle-btn');
  const currentLangText = document.getElementById('current-lang-text');

  function applyLanguage(lang) {
    if (!window.HEALTHIANS_TRANSLATIONS || !window.HEALTHIANS_TRANSLATIONS[lang]) return;
    
    const dict = window.HEALTHIANS_TRANSLATIONS[lang];
    document.documentElement.lang = lang;

    // Update innerHTML for all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Update placeholders for inputs with data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update language button text
    if (currentLangText) {
      currentLangText.textContent = lang === 'en' ? 'हिंदी' : 'English';
    } else if (langSwitcherBtn && dict.lang_toggle) {
      langSwitcherBtn.innerHTML = dict.lang_toggle;
    }

    // Refresh open FAQ heights
    document.querySelectorAll('.faq-row.open').forEach(row => {
      const answerBox = row.querySelector('.faq-answer-box');
      const answerInner = row.querySelector('.faq-answer-inner');
      if (answerBox && answerInner) {
        answerBox.style.maxHeight = (answerInner.scrollHeight + 30) + 'px';
      }
    });

    localStorage.setItem('healthians_lang', lang);
    logConversionEvent('Language_Switch', { newLanguage: lang });
  }

  if (langSwitcherBtn) {
    langSwitcherBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'hi' : 'en';
      applyLanguage(currentLang);
    });
  }

  // Initial translation if previously saved as Hindi
  if (currentLang === 'hi') {
    applyLanguage('hi');
  }
});

// 13. INDEPENDENT REAL-TIME CLOUD PACKAGE & PROMOTIONAL OFFER SUBSCRIPTION
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.HealthiansBackend && typeof window.HealthiansBackend.subscribePackages === 'function') {
      const packagesWrapper = document.querySelector('.packages-wrapper');
      window.HealthiansBackend.subscribePackages((pkgs) => {
        try {
          if (!packagesWrapper || !Array.isArray(pkgs) || pkgs.length === 0) return;
          const currentLang = localStorage.getItem('healthians_lang') || 'en';
          
          let html = '';
          pkgs.forEach(pkg => {
            const badgeHtml = pkg.badge ? `<span class="pkg-most-booked-pill">${pkg.badge}</span>` : '';
            const benefitsHtml = (pkg.benefits || []).map(b => `<div class="pkg-point"><span class="pkg-point-check">✓</span> <span>${b}</span></div>`).join('');
            const oldPriceHtml = pkg.oldPrice ? `<span class="pkg-strike">₹${pkg.oldPrice}</span>` : '';
            const unitText = currentLang === 'hi' ? '/ प्रति मरीज' : '/ patient';
            const detailsText = currentLang === 'hi' ? 'टेस्ट का पूरा विवरण ▾' : 'View test details ▾';
            const bookText = currentLang === 'hi' ? 'पैकेज बुक करें' : 'Book Package';
            
            html += `
              <div class="package-item" data-pkg="${pkg.title} (₹${pkg.newPrice})">
                ${badgeHtml}
                <div>
                  <div class="pkg-top-info">
                    <h3 class="pkg-title">${pkg.title}</h3>
                    <div class="pkg-price-row">
                      ${oldPriceHtml}
                      <span class="pkg-val">₹${pkg.newPrice}</span>
                      <span class="pkg-unit">${unitText}</span>
                    </div>
                  </div>
                  <div class="pkg-benefits-list">
                    ${benefitsHtml}
                  </div>
                  <button type="button" class="accordion-toggle" data-action="toggle-pkg-details">
                    <span>${detailsText}</span>
                  </button>
                  <div class="accordion-panel">
                    <p style="font-weight:600; color:#111827; margin-bottom:4px;">${pkg.params || 'Comprehensive Diagnostic Test Profile'}</p>
                    <p>${pkg.fasting || 'Fasting required: 8-10 hours overnight'}</p>
                  </div>
                </div>
                <button class="btn btn-primary pkg-cta-btn select-pkg-btn">${bookText}</button>
              </div>
            `;
          });
          packagesWrapper.innerHTML = html;
        } catch (err) {
          console.error("Error rendering packages:", err);
        }
      });
    }

    if (window.HealthiansBackend && typeof window.HealthiansBackend.subscribeOffer === 'function') {
      window.HealthiansBackend.subscribeOffer((offer) => {
        try {
          if (!offer) return;
          const superSaverCard = document.querySelector('.super-saver-card');
          if (!superSaverCard) return;
          if (offer.active === false || offer.enabled === false) {
            superSaverCard.style.display = 'none';
            return;
          } else {
            superSaverCard.style.display = 'block';
          }
          
          superSaverCard.setAttribute('data-pkg', `${offer.title || 'Super Saver Offer'} (₹${offer.offerPrice || '299'})`);
          const ribbonEl = superSaverCard.querySelector('.offer-ribbon');
          if (ribbonEl && offer.ribbon) ribbonEl.textContent = offer.ribbon;
          
          const titleEl = superSaverCard.querySelector('.saver-main-title');
          if (titleEl && offer.title) {
            let t = offer.title;
            if (!t.includes('<br>') && !t.includes('span') && t.includes('SUPER SAVER')) {
              t = t.replace('SUPER SAVER', '<br><span class="highlight-navy">SUPER SAVER</span><br>');
            } else if (!t.includes('span') && t.includes('SUPER SAVER')) {
              t = t.replace('SUPER SAVER', '<span class="highlight-navy">SUPER SAVER</span>');
            }
            titleEl.innerHTML = t;
          }
          const tagEl = superSaverCard.querySelector('.saver-tag-pill');
          if (tagEl && offer.tag) tagEl.textContent = offer.tag;
          
          const amountEl = superSaverCard.querySelector('.amount-val');
          if (amountEl && offer.offerPrice) amountEl.textContent = offer.offerPrice;
          
          const mrpEl = superSaverCard.querySelector('.old-mrp-price');
          if (mrpEl && offer.mrpPrice) mrpEl.textContent = `₹${offer.mrpPrice}`;
          
          const bookBtnSpan = superSaverCard.querySelector('.btn-saver-book span:first-child');
          if (bookBtnSpan && (offer.btnText || offer.offerPrice)) {
            bookBtnSpan.textContent = offer.btnText || `Book Now at ₹${offer.offerPrice}`;
          }
          
          const warnEl = superSaverCard.querySelector('.saver-limit-txt');
          if (warnEl && offer.warnText) warnEl.textContent = offer.warnText;

          const headingEl = superSaverCard.querySelector('.tests-list-heading');
          if (headingEl && offer.testsHeading) {
            headingEl.textContent = offer.testsHeading;
          }

          const testsBoxEl = superSaverCard.querySelector('.tests-list-box');
          if (testsBoxEl && Array.isArray(offer.testsList) && offer.testsList.length > 0) {
            const icons = [
              `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 3C4.5 3 2 5.5 2 8.5C2 12.5 5 16 7.5 19C10 16 12 12.5 12 8.5C12 5.5 10 3 7.5 3ZM16.5 3C14 3 12 5.5 12 8.5C12 12.5 14 16 16.5 19C19 16 22 12.5 22 8.5C22 5.5 19.5 3 16.5 3Z"/></svg>`,
              `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
              `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
              `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 18h8M10 22h4M12 18v4M9 6h6M11 2v4M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><line x1="7" y1="14" x2="17" y2="14"/><circle cx="12" cy="14" r="5" stroke="currentColor"/></svg>`,
              `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5.5c-2.5-3-6.5-3.5-9-1-2 2-2 6 0 9.5s7.5 7.5 9 7.5 7-4 9-7.5 2-7.5 0-9.5c-2.5-2.5-6.5-2-9 1z"/></svg>`
            ];
            testsBoxEl.innerHTML = offer.testsList.map((t, idx) => `
              <div class="test-item-row ${idx === offer.testsList.length - 1 ? 'no-border' : ''}">
                <div class="test-teal-circle">
                  ${icons[idx % icons.length]}
                </div>
                <span class="test-name-txt">${t}</span>
              </div>
            `).join('');
          }
        } catch (err) {
          console.error("Error rendering promotional offer:", err);
        }
      });
    }
  } catch (e) {
    console.error("Error in independent subscription block:", e);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Packages Filter Logic
  const filterPills = document.querySelectorAll('.filter-pill');
  const packageItems = document.querySelectorAll('.package-item');

  if (filterPills.length > 0 && packageItems.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Remove active class from all
        filterPills.forEach(p => p.classList.remove('active'));
        // Add active class to clicked
        pill.classList.add('active');

        const filterVal = pill.getAttribute('data-filter').toLowerCase();

        packageItems.forEach(item => {
          // If "all" is clicked, show it. Otherwise check if text contains filter keyword.
          if (filterVal === 'all' || item.textContent.toLowerCase().includes(filterVal)) {
            item.style.display = ''; 
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
});

/**
 * Professional Analytics Telemetry Bridge (Google Tag Manager & Meta Pixel compatible)
 */
function logConversionEvent(eventName, eventData) {
  try {
    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      window.dataLayer.push({ event: eventName, ...eventData });
    }
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, eventData);
    }
  } catch (e) {
    // Silent execution in production
  }
}
