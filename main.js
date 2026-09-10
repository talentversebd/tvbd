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
  if(nav) nav.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.h-nav a').forEach(a => {
    a.addEventListener('click', () => {
      const nav = document.getElementById('hnav');
      if(nav) nav.classList.remove('open');
    });
  });
});

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

  const name = document.getElementById('rf-name')?.value.trim();
  const email = document.getElementById('rf-email')?.value.trim();
  const phone = document.getElementById('rf-phone')?.value.trim();
  const olympiad = document.getElementById('rf-olympiad')?.value;
  const cls = document.getElementById('rf-class')?.value.trim();
  const school = document.getElementById('rf-school')?.value.trim();
  const address = document.getElementById('rf-address')?.value.trim();
  const msg = document.getElementById('rf-message')?.value.trim();

  if(!name) return toast("Please enter your name!", true);
  if(!email) return toast("Please enter your email!", true);
  if(!isValidEmail(email)) return toast("Please enter a valid email!", true);
  if(!phone) return toast("Please enter your phone number!", true);
  if(!olympiad) return toast("Please select an olympiad!", true);

  const btn = document.querySelector('.rf-btn');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Submitting...';
  btn.disabled = true;

  try {
    // 1. Save to Firestore
    await addRegistration({
      name, email, phone, olympiad,
      class: cls, school, address, message: msg
    });

    // 2. Send confirmation email
    if(typeof emailjs !== 'undefined') {
      const emailParams = {
        from_name: name,
        from_email: email,
        subject: `New Registration: ${olympiad}`,
        message: `
New Registration Received!

Name: ${name}
Email: ${email}
Phone: ${phone}
Olympiad: ${olympiad}
Class: ${cls || 'N/A'}
School: ${school || 'N/A'}
Address: ${address || 'N/A'}

Message: ${msg || 'N/A'}
        `.trim()
      };

      await emailjs.send(
        window.EMAILJS_CONFIG.serviceId,
        window.EMAILJS_CONFIG.templateId,
        emailParams,
        window.EMAILJS_CONFIG.publicKey
      );
    }

    toast("Registration successful! We'll contact you soon. ✅");
    
    // Reset form
    document.getElementById('rf-name').value = '';
    document.getElementById('rf-email').value = '';
    document.getElementById('rf-phone').value = '';
    document.getElementById('rf-class').value = '';
    document.getElementById('rf-school').value = '';
    document.getElementById('rf-address').value = '';
    document.getElementById('rf-message').value = '';

    // Show success screen (optional)
    setTimeout(() => {
      const success = document.getElementById('reg-success');
      if(success) {
        success.style.display = 'block';
        document.getElementById('reg-form-wrap').style.display = 'none';
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
