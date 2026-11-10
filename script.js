/**
 * ========================================================================
 * HEALTHIANS® MODERN PRODUCT INTERACTION & ANALYTICS ENGINE
 * High-Converting CRO + Zero-Loss Lead Capture + Real-Time Firestore Sync
 * ========================================================================
 */

window.currentSelectedPackage = window.currentSelectedPackage || '';

document.addEventListener('DOMContentLoaded', () => {
  window._pageLoadTimestamp = Date.now();
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

  function cleanFieldText(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/[<>{}\\]/g, '')
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeIndianMobile(val) {
    let digits = String(val || '').replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) {
      digits = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits.slice(1))) {
      digits = digits.slice(1);
    }
    return digits;
  }

  const CITY_SLUG_MAP = {
    'delhi': 'Delhi NCR',
    'new-delhi': 'New Delhi',
    'mumbai': 'Mumbai',
    'bengaluru': 'Bangalore (Bengaluru)',
    'bangalore': 'Bangalore (Bengaluru)',
    'pune': 'Pune',
    'hyderabad': 'Hyderabad',
    'gurugram': 'Gurgaon (Gurugram)',
    'gurgaon': 'Gurgaon (Gurugram)',
    'noida': 'Noida',
    'ghaziabad': 'Ghaziabad',
    'faridabad': 'Faridabad',
    'jaipur': 'Jaipur',
    'lucknow': 'Lucknow',
    'chandigarh': 'Chandigarh',
    'ahmedabad': 'Ahmedabad',
    'kolkata': 'Kolkata',
    'chennai': 'Chennai',
    'indore': 'Indore',
    'bhopal': 'Bhopal',
    'kanpur': 'Kanpur',
    'nagpur': 'Nagpur',
    'patna': 'Patna',
    'surat': 'Surat',
    'vadodara': 'Vadodara',
    'ludhiana': 'Ludhiana',
    'agra': 'Agra',
    'varanasi': 'Varanasi',
    'amritsar': 'Amritsar',
    'meerut': 'Meerut',
    'dehradun': 'Dehradun',
    'allahabad': 'Allahabad (Prayagraj)',
    'prayagraj': 'Allahabad (Prayagraj)'
  };

  const TEST_SLUG_MAP = {
    'cbc-test': 'Complete Blood Count (CBC)',
    'thyroid-test': 'Thyroid Profile (T3, T4, TSH)',
    'hba1c-test': 'HbA1c (Glycated Hemoglobin) Test',
    'vitamin-d-test': 'Vitamin D (25-OH) Test',
    'vitamin-b12-test': 'Vitamin B12 (Cyanocobalamin) Test',
    'lft-test': 'Liver Function Test (LFT)',
    'kft-test': 'Kidney Function Test (KFT / RFT)',
    'lipid-profile-test': 'Lipid Profile (Cholesterol Panel)',
    'fasting-blood-sugar-test': 'Fasting Blood Sugar (FBS)',
    'post-prandial-blood-sugar-test': 'Post Prandial Blood Sugar (PPBS)',
    'urine-routine-test': 'Urine Routine & Microscopy',
    'esr-test': 'Erythrocyte Sedimentation Rate (ESR)',
    'crp-test': 'C-Reactive Protein (CRP)',
    'iron-ferritin-test': 'Iron Deficiency & Ferritin Profile',
    'serum-electrolytes-test': 'Serum Electrolytes (Na, K, Cl)',
    'uric-acid-test': 'Serum Uric Acid Test',
    'calcium-test': 'Serum Calcium Total Test',
    'dengue-test': 'Dengue NS1 Antigen & Antibody Test',
    'beta-hcg-test': 'Beta HCG Pregnancy Blood Test',
    'allergy-test': 'Allergy Profile (Total IgE & Common Allergens)',
    'double-marker-test': 'Double Marker Test (First Trimester Screening)',
    'psa-test': 'Prostate Specific Antigen (PSA) Test',
    'full-body-checkup': 'Full Body Health Checkup',
    'senior-citizen-package': 'Senior Citizen Health Package',
    'diabetes-package': 'Comprehensive Diabetes Health Package',
    'women-health-package': 'Women Care & Wellness Health Package',
    'men-health-package': 'Men Executive Health Checkup Package',
    'thyroid-package': 'Advanced Thyroid & Metabolism Care Package',
    'cardiac-care-package': 'Healthy Heart Cardiac Screening Package',
    'vitamin-deficiency-package': 'Complete Vitamin & Mineral Deficiency Package',
    'fitness-health-package': 'Active Fitness & Sports Health Package',
    'fever-screening-package': 'Fever & Acute Infection Screening Package'
  };

  function resolveTestOrPkgName(rawSlugOrName) {
    const clean = cleanFieldText(rawSlugOrName);
    if (!clean) return '';
    const key = clean.toLowerCase();
    if (TEST_SLUG_MAP[key]) return TEST_SLUG_MAP[key];
    if (clean.includes(' ') || clean.length > 40) return clean;
    return clean
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, ch => ch.toUpperCase());
  }

  // 1. MINIMALIST NOTION/APPLE FAQ ACCORDION HANDLER
  const faqRows = document.querySelectorAll('.faq-row');

  faqRows.forEach(row => {
    const btn = row.querySelector('.faq-question-btn');
    const answerBox = row.querySelector('.faq-answer-box');
    const answerInner = row.querySelector('.faq-answer-inner');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');

      // Close other open rows for clean mobile reading
      faqRows.forEach(other => {
        if (other !== row && other.classList.contains('open')) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          const otherBox = other.querySelector('.faq-answer-box');
          if (otherBox) otherBox.style.maxHeight = '0px';
        }
      });

      if (!isOpen) {
        row.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        if (answerBox && answerInner) {
          answerBox.style.maxHeight = (answerInner.scrollHeight + 30) + 'px';
        }
      } else {
        row.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        if (answerBox) {
          answerBox.style.maxHeight = '0px';
        }
      }
    });
  });

  // 2. PACKAGE SELECTION & PROGRESSIVE DISCLOSURE (Shared global state for SEO pages & URL params)
  const selectedPackageBox = document.getElementById('selected-package-box');
  const packageTitleText = document.getElementById('package-title-text');
  const removePackageBtn = document.getElementById('remove-package-btn');
  const bookCardDestination = document.getElementById('booking-card-destination');
  const leadNameInput = document.getElementById('lead-name');
  const leadPhoneInput = document.getElementById('lead-phone');
  let currentSelectedPackage = window.currentSelectedPackage || '';

  function setSelectedPackage(pkgName) {
    const cleaned = cleanFieldText(pkgName);
    currentSelectedPackage = cleaned;
    window.currentSelectedPackage = cleaned;
    if (cleaned) {
      if (packageTitleText) packageTitleText.textContent = cleaned;
      if (selectedPackageBox) selectedPackageBox.style.display = 'flex';
    } else {
      if (selectedPackageBox) selectedPackageBox.style.display = 'none';
    }
  }

  window.setSelectedHealthiansPackage = setSelectedPackage;

  // Read pre-populated package on /tests/* and /packages/* subpages
  if (!currentSelectedPackage && selectedPackageBox && packageTitleText) {
    const isBoxVisible = window.getComputedStyle(selectedPackageBox).display !== 'none' || selectedPackageBox.style.display === 'flex';
    const existingLabel = cleanFieldText(packageTitleText.textContent);
    if (isBoxVisible && existingLabel) {
      setSelectedPackage(existingLabel);
    }
  }

  document.addEventListener('click', (e) => {
    // Check if clicked element is a Book Package / Select Test button
    const selectBtn = e.target.closest('.select-pkg-btn');
    if (selectBtn) {
      const explicitPkg = selectBtn.getAttribute('data-pkg');
      const pkgItem = selectBtn.closest('.package-item, .super-saver-card, .product-card');
      const pkgName = explicitPkg || (pkgItem ? pkgItem.getAttribute('data-pkg') : '') || '';
      if (pkgName) {
        setSelectedPackage(pkgName);
        logConversionEvent('Select_Diagnostic_Package', { package: pkgName });

        if (bookCardDestination) {
          bookCardDestination.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
      setSelectedPackage('');
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

  function resolveCityDisplay(rawCity) {
    const cleaned = cleanFieldText(rawCity);
    if (!cleaned) return '';
    const slugKey = cleaned.toLowerCase();
    if (CITY_SLUG_MAP[slugKey]) return CITY_SLUG_MAP[slugKey];
    const match = masterCitiesList.find(c => c.toLowerCase() === slugKey)
      || masterCitiesList.find(c => c.toLowerCase().startsWith(slugKey));
    return match || cleaned.replace(/[-_]+/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
  }

  // Apply URL query parameters or hash pre-fills (?test=..., ?pkg=..., ?city=..., #city-..., #book-...)
  (function applyUrlPrefills() {
    try {
      const params = new URLSearchParams(window.location.search);
      const qTest = params.get('test') || params.get('pkg') || params.get('package') || params.get('q') || '';
      const qCity = params.get('city') || '';
      const hash = (window.location.hash || '').replace(/^#/, '');

      let resolvedTest = qTest;
      let resolvedCity = qCity;

      if (!resolvedCity && hash.startsWith('city-')) {
        resolvedCity = hash.slice(5);
      }
      if (!resolvedTest && hash.startsWith('book-')) {
        resolvedTest = hash.slice(5);
      }

      if (resolvedTest) {
        const pkgLabel = resolveTestOrPkgName(resolvedTest);
        if (pkgLabel) setSelectedPackage(pkgLabel);
      }
      if (resolvedCity && leadCityInput) {
        leadCityInput.value = resolveCityDisplay(resolvedCity);
      }
    } catch (err) {
      // Non-fatal
    }
  })();

  function renderCityDropdown(filterText = "") {
    if (!cityMenu) return;
    cityMenu.innerHTML = "";
    const cleanFilter = filterText.trim().toLowerCase();

    const matched = masterCitiesList.filter(c => c.toLowerCase().includes(cleanFilter));

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

  // 4B. LEAD FORM SUBMISSION & INLINE CRO VALIDATION
  const bookingForm = document.getElementById('healthians-booking-form');

  function ensureValidationBox(formEl) {
    let box = document.getElementById('form-validation-msg');
    if (!box && formEl) {
      box = document.createElement('div');
      box.id = 'form-validation-msg';
      box.setAttribute('role', 'alert');
      box.style.cssText = 'display:none;background:#FEF2F2;border:1px solid #FECACA;color:#B91C1C;padding:10px 14px;border-radius:12px;font-size:0.84rem;font-weight:600;margin-bottom:4px;line-height:1.4;';
      formEl.insertBefore(box, formEl.firstChild);
    }
    return box;
  }

  function ensureWaFallbackBox(formEl) {
    let box = document.getElementById('form-wa-fallback');
    if (!box && formEl) {
      box = document.createElement('div');
      box.id = 'form-wa-fallback';
      box.style.cssText = 'display:none;margin-top:8px;';
      formEl.appendChild(box);
    }
    return box;
  }

  function highlightInvalidCell(inputEl) {
    if (!inputEl) return;
    const cell = inputEl.closest('.input-cell');
    if (cell) {
      cell.style.borderColor = '#E11D48';
      setTimeout(() => { cell.style.borderColor = ''; }, 2600);
    }
    inputEl.focus();
  }

  function clearFormFeedback(formEl) {
    const errBox = document.getElementById('form-validation-msg');
    if (errBox) {
      errBox.style.display = 'none';
      errBox.textContent = '';
    }
    const waBox = document.getElementById('form-wa-fallback');
    if (waBox) {
      waBox.style.display = 'none';
      waBox.innerHTML = '';
    }
    if (formEl) {
      formEl.querySelectorAll('.input-cell').forEach(c => { c.style.borderColor = ''; });
    }
  }

  function showFormError(formEl, message, inputEl) {
    const errBox = ensureValidationBox(formEl);
    if (errBox) {
      errBox.textContent = message;
      errBox.style.display = 'block';
    } else {
      alert(message);
    }
    highlightInvalidCell(inputEl);
  }

  // Auto-normalize +91 / 0xx mobile autofills smoothly on input/blur
  if (leadPhoneInput) {
    const normalizePhoneField = () => {
      const normalized = normalizeIndianMobile(leadPhoneInput.value);
      if (/^[6-9]\d{9}$/.test(normalized) && leadPhoneInput.value !== normalized) {
        leadPhoneInput.value = normalized;
      }
    };
    leadPhoneInput.addEventListener('blur', normalizePhoneField);
    leadPhoneInput.addEventListener('change', normalizePhoneField);
    leadPhoneInput.addEventListener('input', () => clearFormFeedback(bookingForm));
  }
  if (leadNameInput) leadNameInput.addEventListener('input', () => clearFormFeedback(bookingForm));
  if (leadCityInput) leadCityInput.addEventListener('input', () => clearFormFeedback(bookingForm));

  if (bookingForm) {
    let isSubmittingLead = false;

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormFeedback(bookingForm);

      if (isSubmittingLead) {
        console.warn('Booking submission already in progress. Ignoring duplicate click.');
        return false;
      }

      const nowTs = Date.now();
      const lastSubmitTs = parseInt(sessionStorage.getItem('healthians_last_submit_ts') || '0', 10);
      if (nowTs - lastSubmitTs < 8000) {
        showFormError(
          bookingForm,
          currentLang === 'hi'
            ? 'कृपया कुछ सेकंड प्रतीक्षा करें। आपकी पिछली बुकिंग प्रक्रियाधीन है।'
            : 'Please wait a few seconds. Your previous booking request is being processed.',
          null
        );
        return false;
      }

      const formData = new FormData(bookingForm);

      // Security Check 1: Invisible Honeypot Anti-Bot Shield
      const honeypot = formData.get('_system_verification_code');
      if (honeypot && String(honeypot).trim() !== '') {
        console.warn('[Security Shield] Automated spam bot intercepted and blocked.');
        return false;
      }

      const patientName = cleanFieldText(formData.get('patient_name') || '');
      const chosenCity = cleanFieldText(formData.get('city') || '');
      const rawMobile = normalizeIndianMobile(formData.get('mobile_number') || '');

      if (leadPhoneInput && /^[6-9]\d{9}$/.test(rawMobile)) {
        leadPhoneInput.value = rawMobile;
      }

      // Security Check 2: Patient Name Validation
      if (!patientName || patientName.length < 2 || patientName.length > 75) {
        showFormError(
          bookingForm,
          currentLang === 'hi'
            ? 'कृपया मरीज का सही नाम दर्ज करें (कम से कम 2 अक्षर)।'
            : 'Please enter a valid Patient Name (2 to 75 characters).',
          leadNameInput
        );
        return false;
      }

      // Security Check 3: Indian Mobile 10-Digit Standard (Starting with 6, 7, 8, or 9)
      const indianMobileRegex = /^[6-9]\d{9}$/;
      if (!indianMobileRegex.test(rawMobile)) {
        showFormError(
          bookingForm,
          currentLang === 'hi'
            ? 'कृपया सही 10-अंकीय मोबाइल नंबर दर्ज करें (जैसे 9876543210)।'
            : 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).',
          leadPhoneInput
        );
        return false;
      }

      // Security Check 4: Block Fake Repeated Numbers
      if (/^(\d)\1{9}$/.test(rawMobile)) {
        showFormError(
          bookingForm,
          currentLang === 'hi' ? 'कृपया अपना सक्रिय मोबाइल नंबर दर्ज करें।' : 'Please enter an active mobile number.',
          leadPhoneInput
        );
        return false;
      }

      // Security Check 5: City Validation (min 2 chars matches Firestore security rules)
      if (!chosenCity || chosenCity.length < 2 || chosenCity.length > 80) {
        showFormError(
          bookingForm,
          currentLang === 'hi'
            ? 'कृपया अपना पूरा शहर या लोकेशन चुनें (कम से कम 2 अक्षर)।'
            : 'Please enter or select your city name (at least 2 characters).',
          leadCityInput
        );
        return false;
      }

      // Sync package name from box if global state wasn't updated cleanly
      const domPkg = (packageTitleText && selectedPackageBox && window.getComputedStyle(selectedPackageBox).display !== 'none')
        ? cleanFieldText(packageTitleText.textContent)
        : '';
      const activePkg = cleanFieldText(window.currentSelectedPackage || currentSelectedPackage || domPkg);
      const selectedPkgName = activePkg || 'General Home Blood Collection Inquiry';

      // Duplicate Detection within 60s
      const submissionFingerprint = `${rawMobile}_${patientName.toLowerCase()}_${chosenCity.toLowerCase()}`;
      const lastFingerprint = sessionStorage.getItem('healthians_last_lead_fingerprint');
      if (lastFingerprint === submissionFingerprint && (nowTs - lastSubmitTs < 60000)) {
        window.location.href = `/thankyou.html?name=${encodeURIComponent(patientName)}&pkg=${encodeURIComponent(selectedPkgName)}&city=${encodeURIComponent(chosenCity)}`;
        return false;
      }

      isSubmittingLead = true;
      const submitBtn = bookingForm.querySelector('button[type="submit"]') || bookingForm.querySelector('.btn-primary');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = (currentLang === 'hi') ? '⏳ आपकी बुकिंग दर्ज हो रही है...' : '⏳ Securing Visit Slot...';
        submitBtn.style.opacity = '0.75';
        submitBtn.style.cursor = 'not-allowed';
      }

      const uniqueOrderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);

      const bookingData = {
        id: uniqueOrderId,
        name: patientName,
        mobile: rawMobile,
        city: chosenCity,
        selectedPackage: selectedPkgName,
        sourcePage: window.location.pathname || '/',
        timestamp: new Date().toISOString(),
        status: 'New Booking',
        technician: '',
        scheduleSlot: 'Pending Scheduling',
        callBackDate: '',
        callBackNote: ''
      };

      // Build clean payload for Apps Script Email & Calendar webhook
      const webhookPayload = new FormData();
      webhookPayload.append('order_id', bookingData.id);
      webhookPayload.append('patient_name', patientName);
      webhookPayload.append('name', patientName);
      webhookPayload.append('mobile_number', rawMobile);
      webhookPayload.append('phone', rawMobile);
      webhookPayload.append('city', chosenCity);
      webhookPayload.append('package', selectedPkgName);
      webhookPayload.append('page_url', window.location.href);

      const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwW8eTLsWx-PxpD4jekGGWqAEwf2OhVcPyRi5tL9gSsbEIZfvtr0iMNSDBbjjTlmP-W/exec";

      // Dispatch Cloud DB save AND Apps Script webhook in parallel cleanly
      const cloudSavePromise = (async () => {
        if (window.HealthiansBackend && typeof window.HealthiansBackend.saveOrder === 'function') {
          try {
            const res = await window.HealthiansBackend.saveOrder(bookingData);
            return Boolean(res && (res.cloud === true || res.duplicate === true));
          } catch (err) {
            return false;
          }
        }
        return false;
      })();

      const webhookPromise = (async () => {
        try {
          const fetchReq = fetch(APPS_SCRIPT_URL, {
            method: "POST",
            body: webhookPayload,
            mode: "no-cors",
            keepalive: true
          }).then(() => true).catch(() => false);
          // Give up to 1800ms before redirect continues while keepalive finishes in background
          const timer = new Promise(resolve => setTimeout(() => resolve('timeout'), 1800));
          const outcome = await Promise.race([fetchReq, timer]);
          return outcome === true;
        } catch (err) {
          return false;
        }
      })();

      const [cloudSaved, webhookCompleted] = await Promise.all([cloudSavePromise, webhookPromise]);

      // If NEITHER Firestore NOR Webhook succeeded, give user instant retry + 1-tap WhatsApp fallback instead of losing lead silently
      if (!cloudSaved && !webhookCompleted) {
        isSubmittingLead = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
        }
        const waMsg = `Hello, I want to book a home blood test:\nName: ${patientName}\nMobile: ${rawMobile}\nCity: ${chosenCity}\nTest/Package: ${selectedPkgName}`;
        const waHref = `https://wa.me/919044401435?text=${encodeURIComponent(waMsg)}`;
        showFormError(
          bookingForm,
          currentLang === 'hi'
            ? 'नेटवर्क धीमा होने के कारण सर्वर से संपर्क नहीं हो पाया। कृपया नीचे दिए WhatsApp बटन से तुरंत बुकिंग पूरा करें या पुनः प्रयास करें।'
            : 'Network connection interrupted while saving. Please retry or complete your booking in 1 click on WhatsApp below:',
          null
        );
        const waBox = ensureWaFallbackBox(bookingForm);
        if (waBox) {
          waBox.style.display = 'block';
          waBox.innerHTML = `<a href="${waHref}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px 18px;background:#25D366;color:#FFF;border-radius:50px;font-weight:700;font-size:0.95rem;text-decoration:none;box-shadow:0 6px 18px rgba(37,211,102,0.3);">💬 Complete Booking on WhatsApp Now</a>`;
        }
        return false;
      }

      // Save locally in browser history after cloud or webhook delivery succeeded
      try {
        let currentBookings = JSON.parse(localStorage.getItem('healthians_admin_bookings') || '[]');
        if (!currentBookings.some(b => b.id === bookingData.id)) {
          currentBookings.unshift({ ...bookingData, cloudSaved: Boolean(cloudSaved) });
          localStorage.setItem('healthians_admin_bookings', JSON.stringify(currentBookings.slice(0, 50)));
        }
      } catch (e) {}

      // Record successful submission fingerprint & rate-limit timestamp
      sessionStorage.setItem('healthians_last_lead_fingerprint', submissionFingerprint);
      sessionStorage.setItem('healthians_last_submit_ts', nowTs.toString());

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = (currentLang === 'hi') ? '✅ बुकिंग सफल! रीडायरेक्ट हो रहा है...' : '✅ Booking Confirmed! Redirecting...';
        submitBtn.style.opacity = '0.92';
      }

      logConversionEvent('Lead_Submitted_Success', bookingData);

      const redirectUrl = `/thankyou.html?id=${encodeURIComponent(bookingData.id)}&name=${encodeURIComponent(patientName)}&pkg=${encodeURIComponent(selectedPkgName)}&city=${encodeURIComponent(chosenCity)}`;
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 250);

      bookingForm.reset();
      setSelectedPackage('');
      if (leadCityInput) leadCityInput.value = '';
      if (cityMenu) cityMenu.classList.remove('show');
      if (cityChevron) cityChevron.style.transform = 'translateY(-50%) rotate(0deg)';
    });
  }

  // 5. CLICK TRACKING FOR CALL & WHATSAPP CTAS
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
    document.documentElement.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    if (currentLangText) {
      currentLangText.textContent = lang === 'en' ? 'हिंदी' : 'English';
    } else if (langSwitcherBtn && dict.lang_toggle) {
      langSwitcherBtn.innerHTML = dict.lang_toggle;
    }

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
  const filterPills = document.querySelectorAll('.filter-pill');
  const packageItems = document.querySelectorAll('.packages-wrapper .package-item');

  if (filterPills.length > 0 && packageItems.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filterVal = pill.getAttribute('data-filter').toLowerCase();

        packageItems.forEach(item => {
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
