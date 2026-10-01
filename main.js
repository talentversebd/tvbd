/*===== SCROLL HEADER =====*/
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if(!header) return;
  if(window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

/*===== MOBILE NAV =====*/
function toggleMobileNav() {
  const nav = document.getElementById('hnav');
  if(!nav) return;
  const hamburger = document.querySelector('.hamburger');

  let backdrop = document.querySelector('.nav-backdrop');
  if(!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.onclick = closeMobileNav;
    document.body.appendChild(backdrop);
  }

  const isOpen = nav.classList.toggle('open');
  backdrop.classList.toggle('open', isOpen);
  if(hamburger) hamburger.classList.toggle('active', isOpen);
}

function closeMobileNav() {
  const nav = document.getElementById('hnav');
  const hamburger = document.querySelector('.hamburger');
  const backdrop = document.querySelector('.nav-backdrop');
  if(nav) nav.classList.remove('open');
  if(hamburger) hamburger.classList.remove('active');
  if(backdrop) backdrop.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.h-nav a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });
});

/*===== SCROLL TO TOP BUTTON =====*/
(function() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.id = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '↑';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(btn);
  });

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
})();

/*===== TOAST =====*/
function toast(msg, isErr = false) {
  const t = document.getElementById('toast');
  const ico = document.getElementById('t-ico');
  const tmsg = document.getElementById('t-msg');
  if(!t) return;
  if(ico) ico.textContent = isErr ? '❌' : '✅';
  if(tmsg) tmsg.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/*===== ACTIVE NAV LINK =====*/
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.h-nav a').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if(href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/*===== EMAIL VALIDATION =====*/
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/*===== CONTACT FORM (EmailJS + Firestore) =====*/
async function submitContact(e) {
  if(e) e.preventDefault();

  const name = document.getElementById('cf-name')?.value.trim();
  const email = document.getElementById('cf-email')?.value.trim();
  const subject = document.getElementById('cf-subject')?.value.trim();
  const message = document.getElementById('cf-message')?.value.trim();

  if(!name) return toast("Please enter your name!", true);
  if(!email) return toast("Please enter your email!", true);
  if(!isValidEmail(email)) return toast("Please enter a valid email!", true);
  if(!message) return toast("Please enter your message!", true);

  const btn = document.querySelector('.cf-btn');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;

  try {
    // 1. Send Email via EmailJS
    const emailParams = {
      from_name: name,
      from_email: email,
      subject: subject || 'Contact from ' + name,
      message: message
    };

    // Wait for EmailJS to load
    if(typeof emailjs !== 'undefined') {
      await emailjs.send(
        window.EMAILJS_CONFIG.serviceId,
        window.EMAILJS_CONFIG.templateId,
        emailParams,
        window.EMAILJS_CONFIG.publicKey
      );
    }

    // 2. Save to Firestore
    await addMessage({
      name, email, subject: subject || '', message
    });

    // Success
    toast("Message sent successfully! ✅");
    
    // Reset form
    document.getElementById('cf-name').value = '';
    document.getElementById('cf-email').value = '';
    document.getElementById('cf-subject').value = '';
    document.getElementById('cf-message').value = '';

  } catch(err) {
    console.error("Contact form error:", err);
    toast("Failed to send. Please try again!", true);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

/*===== REGISTRATION FORM =====*/
async function submitRegistration(e) {
  if(e) e.preventDefault();

  // Defense in depth: even though the UI hides this form until logged in
  // with a complete profile, double-check here too.
  const user = window.firebaseAuth && window.firebaseAuth.currentUser;
  if(!user || !user.emailVerified) {
    return toast("রেজিস্ট্রেশন করতে আগে account দিয়ে Log In করতে হবে।", true);
  }

  const profile = window.rfCurrentProfile;
  if(!profile || !profile.firstName || !profile.lastName || !profile.phone) {
    return toast("আগে Dashboard থেকে তোমার Profile সম্পূর্ণ করো।", true);
  }
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const email = user.email; // always the verified account email — never trust a form field for this
  const olympiad = document.getElementById('rf-olympiad')?.value;
  const segment = document.getElementById('rf-segment')?.value.trim();
  const txnId = document.getElementById('rf-txnid')?.value.trim();
  const msg = document.getElementById('rf-message')?.value.trim();

  if(!olympiad) return toast("Please select an olympiad!", true);

  const selectedOlympiad = (typeof getOlympiads === 'function' ? getOlympiads() : []).find(o => o.title === olympiad);
  const needsSegment = selectedOlympiad && (selectedOlympiad.segments || []).length > 0;
  const isPaid = selectedOlympiad && selectedOlympiad.fee;

  if(needsSegment && !segment) return toast("একটা Segment সিলেক্ট করো!", true);
  if(isPaid && !txnId) return toast("Transaction ID দিতে হবে — এটা Paid Event!", true);

  const btn = document.querySelector('.rf-btn');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Submitting...';
  btn.disabled = true;

  try {
    // Snapshot the participant's name/phone/school/class from their Profile at
    // the time of registration — so this record stays accurate even if they
    // edit their profile later, and so the admin can see everything in one place.
    const saved = await addRegistration({
      uid: user.uid, email, olympiad, segment, transactionId: txnId, message: msg,
      name: fullName, phone: profile.phone,
      class: profile.classLevel || '', school: profile.institution || '',
      address: profile.district || ''
    });

    if(!saved) {
      toast("Failed to submit. Please try again!", true);
      return;
    }

    // Send confirmation email — best-effort only. A missing/misconfigured
    // EmailJS setup or a failed send must never make a successful registration
    // look like a failure.
    if(typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.serviceId) {
      try {
        const emailParams = {
          from_name: fullName,
          from_email: email,
          subject: `New Registration: ${olympiad}`,
          message: `
New Registration Received!

Name: ${fullName}
Email: ${email}
Phone: ${profile.phone}
Olympiad: ${olympiad}
Segment: ${segment || 'N/A'}
Transaction ID: ${txnId || 'N/A'}
Class: ${profile.classLevel || 'N/A'}
School: ${profile.institution || 'N/A'}

Message: ${msg || 'N/A'}
          `.trim()
        };

        await emailjs.send(
          window.EMAILJS_CONFIG.serviceId,
          window.EMAILJS_CONFIG.templateId,
          emailParams,
          window.EMAILJS_CONFIG.publicKey
        );
      } catch(emailErr) {
        console.error("Registration email notification failed (registration was still saved):", emailErr);
      }
    }

    toast("Registration successful! We'll contact you soon. ✅");

    // Reset form
    document.getElementById('rf-segment').value = '';
    document.getElementById('rf-txnid').value = '';
    document.getElementById('rf-message').value = '';

    // Show success screen (optional)
    setTimeout(() => {
      const success = document.getElementById('reg-success');
      const formWrap = document.getElementById('reg-form-wrap') || document.getElementById('reg-form');
      if(success) {
        success.style.display = 'block';
        if(formWrap) formWrap.style.display = 'none';
      }
    }, 1000);

  } catch(err) {
    console.error("Registration error:", err);
    toast("Failed to submit. Please try again!", true);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

/*===== INLINE REGISTRATION SUBMIT (from the event modal) =====*/
async function submitInlineRegistration(olympiadId) {
  const user = window.firebaseAuth && window.firebaseAuth.currentUser;
  if(!user || !user.emailVerified) {
    return toast("রেজিস্ট্রেশন করতে আগে account দিয়ে Log In করতে হবে।", true);
  }

  const o = (typeof getOlympiads === 'function' ? getOlympiads() : []).find(x => x.id === olympiadId);
  if(!o) return toast("Event not found!", true);

  const profile = await getRegisteredUserById(user.uid);
  if(!profile || !profile.firstName || !profile.lastName || !profile.phone) {
    return toast("আগে Dashboard থেকে তোমার Profile সম্পূর্ণ করো।", true);
  }
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const email = user.email;

  const segment = document.getElementById('im-segment')?.value.trim() || '';
  const txnId = document.getElementById('im-txnid')?.value.trim() || '';
  const msg = document.getElementById('im-message')?.value.trim() || '';

  const needsSegment = (o.segments || []).length > 0;
  const isPaid = !!o.fee;

  if(needsSegment && !segment) return toast("একটা Segment সিলেক্ট করো!", true);
  if(isPaid && !txnId) return toast("Transaction ID দিতে হবে — এটা Paid Event!", true);

  const btn = document.querySelector('.im-submit-btn');
  const originalText = btn ? btn.textContent : '';
  if(btn) { btn.textContent = '⏳ Submitting...'; btn.disabled = true; }

  try {
    const saved = await addRegistration({
      uid: user.uid, email, olympiad: o.title, segment, transactionId: txnId, message: msg,
      name: fullName, phone: profile.phone,
      class: profile.classLevel || '', school: profile.institution || '',
      address: profile.district || ''
    });

    if(!saved) {
      toast("Failed to submit. Please try again!", true);
      if(btn) { btn.textContent = originalText; btn.disabled = false; }
      return;
    }

    if(typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.serviceId) {
      try {
        await emailjs.send(
          window.EMAILJS_CONFIG.serviceId,
          window.EMAILJS_CONFIG.templateId,
          {
            from_name: fullName,
            from_email: email,
            subject: `New Registration: ${o.title}`,
            message: `New Registration Received!\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${profile.phone}\nOlympiad: ${o.title}\nSegment: ${segment || 'N/A'}\nTransaction ID: ${txnId || 'N/A'}\nClass: ${profile.classLevel || 'N/A'}\nSchool: ${profile.institution || 'N/A'}\n\nMessage: ${msg || 'N/A'}`
          },
          window.EMAILJS_CONFIG.publicKey
        );
      } catch(emailErr) {
        console.error("Registration email notification failed (registration was still saved):", emailErr);
      }
    }

    toast("Registration successful! We'll contact you soon. ✅");
    const reg = document.getElementById('m-reg');
    if(reg) {
      reg.innerHTML = `
        <div class="modal-reg-section" style="text-align:center;">
          <div style="font-size:2rem;margin-bottom:8px;">🎉</div>
          <h4 style="font-family:Montserrat;font-weight:800;margin-bottom:6px;">Registered!</h4>
          <p style="color:var(--muted);font-size:.85rem;">তোমার registration পেয়েছি। Dashboard-এ গিয়ে পরে এটা দেখতে পারবে।</p>
        </div>`;
    }
  } catch(err) {
    console.error("Registration error:", err);
    toast("Failed to submit. Please try again!", true);
    if(btn) { btn.textContent = originalText; btn.disabled = false; }
  }
}

/*===== POPULATE OLYMPIAD DROPDOWN =====*/
function populateOlympiadDropdown() {
  const select = document.getElementById('rf-olympiad');
  if(!select) return;

  const olympiads = getOlympiads().filter(o => o.regEnabled && o.status !== 'past');

  select.innerHTML = '<option value="">-- Select an Olympiad --</option>';

  if(olympiads.length === 0) {
    select.innerHTML += '<option disabled>No open registrations available</option>';
    return;
  }

  // Check if URL has olympiad param
  const urlParams = new URLSearchParams(window.location.search);
  const preSelected = urlParams.get('olympiad');

  olympiads.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.title;
    opt.textContent = o.title;
    if(preSelected && preSelected === o.title) opt.selected = true;
    select.appendChild(opt);
  });

  onOlympiadSelectChange();
}

/*===== SHOW/HIDE SEGMENT + TRANSACTION ID BASED ON SELECTED EVENT =====*/
function onOlympiadSelectChange() {
  const select = document.getElementById('rf-olympiad');
  const segWrap = document.getElementById('rf-segment-wrap');
  const segSelect = document.getElementById('rf-segment');
  const feeNote = document.getElementById('rf-fee-note');
  const txnWrap = document.getElementById('rf-txn-wrap');
  if(!select || typeof getOlympiads !== 'function') return;

  const o = getOlympiads().find(x => x.title === select.value);

  // Segments
  if(o && (o.segments || []).length > 0) {
    segSelect.innerHTML = '<option value="">-- Select a segment --</option>' +
      o.segments.map(s => `<option value="${s}">${s}</option>`).join('');
    segWrap.style.display = 'block';
  } else {
    segWrap.style.display = 'none';
    segSelect.innerHTML = '';
  }

  // Paid event → show fee note + require Transaction ID
  if(o && o.fee) {
    feeNote.style.display = 'block';
    feeNote.innerHTML = `💰 <strong>Registration Fee: ${o.fee}</strong><br><span style="font-size:.8rem;color:var(--muted);">পেমেন্ট সম্পন্ন করে নিচে Transaction ID দাও।</span>`;
    txnWrap.style.display = 'block';
  } else {
    feeNote.style.display = 'none';
    txnWrap.style.display = 'none';
    document.getElementById('rf-txnid').value = '';
  }
}

/*===== KEYBOARD EVENTS =====*/
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') {
    const modal = document.getElementById('o-modal');
    const lb = document.getElementById('lb');
    if(modal && modal.classList.contains('open')) closeModal();
    if(lb && lb.classList.contains('open')) closeLB();
  }
});

/*===== FOOTER DYNAMIC DATA =====*/
function renderFooter() {
  const h = getHome();
  const femail = document.getElementById('f-email');
  const fphone = document.getElementById('f-phone');
  const faddr = document.getElementById('f-addr');
  const fdesc = document.getElementById('f-desc');

  if(femail) { femail.textContent = h.femail; femail.href = 'mailto:' + h.femail; }
  if(fphone) { fphone.textContent = h.fphone; fphone.href = 'tel:' + h.fphone; }
  if(faddr) faddr.textContent = h.faddr;
  if(fdesc) fdesc.textContent = h.fdesc;
}

/*===== FILTER OLYMPIADS =====*/
function filterOlympiads(query, status) {
  const grid = document.getElementById('olymp-grid');
  if(!grid) return;

  const olympiads = getOlympiads();
  grid.innerHTML = '';

  const filtered = olympiads.filter(o => {
    const matchQuery = !query ||
      o.title.toLowerCase().includes(query.toLowerCase()) ||
      (o.cat && o.cat.toLowerCase().includes(query.toLowerCase())) ||
      (o.desc && o.desc.toLowerCase().includes(query.toLowerCase()));
    const matchStatus = !status || status === 'all' || o.status === status;
    return matchQuery && matchStatus;
  });

  if(filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="ei">🔍</div>
        <p>No olympiads found matching your search.</p>
      </div>`;
    return;
  }

  filtered.forEach((o) => {
    const idx = olympiads.indexOf(o);
    const card = document.createElement('div');
    card.className = 'o-card';
    card.onclick = () => openModal(idx);
    card.innerHTML = `
      ${o.img ? `<img src="${o.img}" class="o-card-img" alt="${o.title}">` : `<div class="o-card-noimg">🏆</div>`}
      <div class="o-card-badge">${o.status}</div>
      <div class="o-card-body">
        <h3 class="o-card-title">${o.title}</h3>
        <div class="o-chips">
          <span class="chip">📅 ${o.date || 'TBA'}</span>
          <span class="chip">🏷️ ${o.cat}</span>
          ${o.venue ? `<span class="chip">📍 ${o.venue}</span>` : ''}
        </div>
        <p class="o-card-desc">${o.desc}</p>
        <button class="rm-btn">Read More</button>
        ${(typeof quizTakeButtonHtml === 'function') ? quizTakeButtonHtml(o) : ''}
      </div>`;
    grid.appendChild(card);
  });
}

/*===== BACK TO TOP =====*/
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if(!btn) return;
  if(window.scrollY > 400) btn.style.display = 'flex';
  else btn.style.display = 'none';
});

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/*===== PAGE INIT =====*/
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  renderFooter();

  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Wait for data to load then render
  const check = setInterval(() => {
    if(typeof getHome === 'function' && getHome()) {
      clearInterval(check);
      
      if(page === 'index.html' || page === '') {
        if(typeof renderHome === 'function') renderHome();
        if(typeof renderOlympiads === 'function') renderOlympiads();
        if(typeof renderGallery === 'function') renderGallery();
        if(typeof renderNews === 'function') renderNews();
      } else if(page === 'olympiads.html' || page === 'events.html') {
        if(typeof renderOlympiads === 'function') renderOlympiads();
      } else if(page === 'gallery.html') {
        if(typeof renderGallery === 'function') renderGallery();
      } else if(page === 'news.html') {
        if(typeof renderNews === 'function') renderNews();
      } else if(page === 'contact.html') {
        if(typeof renderHome === 'function') renderHome();
      } else if(page === 'register.html') {
        populateOlympiadDropdown();
      } else if(page === 'admin.html') {
        if(typeof checkAdminAuth === 'function') checkAdminAuth();
      }

      renderFooter();
    }
  }, 200);
});

/*===== LOGIN ENTER KEY =====*/
document.addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    const lu = document.getElementById('lu');
    const lp = document.getElementById('lp');
    if(document.activeElement === lu || document.activeElement === lp) {
      if(typeof doLogin === 'function') doLogin();
    }
  }
});

/*===== REGISTER AGAIN =====*/
function registerAgain() {
  const success = document.getElementById('reg-success');
  const form = document.getElementById('reg-form-wrap');
  if(success) success.style.display = 'none';
  if(form) form.style.display = 'block';
  populateOlympiadDropdown();
}
