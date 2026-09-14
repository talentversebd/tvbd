/*===== QUIZ LINK HELPER =====*/
// Returns the linked, published quiz object for an olympiad/event (or null).
// Used to decide whether to show a "Take Quiz" button on that event's
// card and modal. Scheduling (not-open-yet / closed) is handled by
// quiz.html itself, so we only check status here.
function getLinkedQuizFor(o) {
  if(!o || !o.quizId) return null;
  if(typeof getQuizzes !== 'function') return null;
  const q = getQuizzes().find(x => x.id === o.quizId);
  return (q && q.status === 'published') ? q : null;
}

function quizTakeButtonHtml(o) {
  const q = getLinkedQuizFor(o);
  if(!q) return '';
  return `<a href="quiz.html?id=${q.id}" onclick="event.stopPropagation()"
    style="display:block;text-align:center;margin-top:8px;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;text-decoration:none;padding:10px;border-radius:8px;font-weight:700;font-size:.85rem;">
    📝 Take Quiz Now
  </a>`;
}

/*===== RENDER ALL =====*/
function renderAll() {
  renderHome();
  renderOlympiads();
  renderGallery();
  renderNews();
}

/*===== RENDER HOME =====*/
function renderHome() {
  const h = getHome();

  // Hero Section
  const badge = document.getElementById('hb-text');
  const title = document.getElementById('ht-title');
  const sub = document.getElementById('ht-sub');
  const b1 = document.getElementById('hb1');
  const b2 = document.getElementById('hb2');
  const odesc = document.getElementById('olymp-sec-desc');
  const s1n = document.getElementById('hs1n');
  const s1l = document.getElementById('hs1l');
  const s2n = document.getElementById('hs2n');
  const s2l = document.getElementById('hs2l');
  const s3n = document.getElementById('hs3n');
  const s3l = document.getElementById('hs3l');
  const quote = document.getElementById('av-quote');
  const femail = document.getElementById('f-email');
  const fphone = document.getElementById('f-phone');
  const faddr = document.getElementById('f-addr');

  if(badge) badge.textContent = h.badge;
  if(title) title.innerHTML = h.title.replace('[','<span>').replace(']','</span>');
  if(sub) sub.textContent = h.sub;
  if(b1) b1.textContent = h.b1;
  if(b2) b2.textContent = h.b2;
  if(odesc) odesc.textContent = h.odesc;
  if(s1n) s1n.textContent = h.s1n;
  if(s1l) s1l.textContent = h.s1l;
  if(s2n) s2n.textContent = h.s2n;
  if(s2l) s2l.textContent = h.s2l;
  if(s3n) s3n.textContent = h.s3n;
  if(s3l) s3l.textContent = h.s3l;
  if(quote) quote.textContent = h.quote;
  if(femail) { femail.textContent = h.femail; femail.href = 'mailto:' + h.femail; }
  if(fphone) { fphone.textContent = h.fphone; fphone.href = 'tel:' + h.fphone; }
  if(faddr) faddr.textContent = h.faddr;
}

/*===== RENDER OLYMPIADS =====*/
function renderOlympiads() {
  const grid = document.getElementById('olymp-grid');
  if(!grid) return;

  // Home page shows only the 3 most recently published events (data is
  // already ordered newest-first); the Events page shows all of them.
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isHome = (page === 'index.html' || page === '');
  const all = getOlympiads();
  const olympiads = isHome ? all.slice(0, 3) : all;

  grid.innerHTML = '';

  if(olympiads.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="ei">🔍</div>
        <p>No olympiads found. Check back later!</p>
      </div>`;
    return;
  }

  olympiads.forEach((o) => {
    const i = all.indexOf(o);
    const card = document.createElement('div');
    card.className = 'o-card';
    card.onclick = () => openModal(i);
    card.innerHTML = `
      ${o.img
        ? `<img src="${o.img}" class="o-card-img" alt="${o.title}">`
        : `<div class="o-card-noimg">🏆</div>`}
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
        ${quizTakeButtonHtml(o)}
      </div>`;
    grid.appendChild(card);
  });
}

/*===== RENDER GALLERY =====*/
function renderGallery() {
  const grid = document.getElementById('gal-grid');
  if(!grid) return;

  const gallery = getGallery();
  grid.innerHTML = '';

  if(gallery.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="ei">📷</div>
        <p>No media found yet.</p>
      </div>`;
    return;
  }

  gallery.forEach((g, i) => {
    const item = document.createElement('div');
    item.className = 'g-item';
    item.onclick = () => openLB(i);
    item.innerHTML = `
      ${g.type === 'video'
        ? `<video src="${g.url}"></video>
           <div class="g-vid-badge">VIDEO</div>`
        : `<img src="${g.url}" alt="${g.cap}">`}
      <div class="g-caption">${g.cap}</div>`;
    grid.appendChild(item);
  });
}

/*===== RENDER NEWS =====*/
function renderNews() {
  const grid = document.getElementById('news-grid');
  if(!grid) return;

  const news = getNews();
  grid.innerHTML = '';

  if(news.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="ei">📰</div>
        <p>No news available yet.</p>
      </div>`;
    return;
  }

  news.slice().reverse().forEach(n => {
    const card = document.createElement('div');
    card.className = 'n-card';
    card.innerHTML = `
      <div class="n-date">${n.date}</div>
      <h3 class="n-title">${n.title}</h3>
      <p class="n-body">${n.body}</p>`;
    grid.appendChild(card);
  });
}

/*===== OPEN OLYMPIAD MODAL =====*/
function openModal(i) {
  const o = getOlympiads()[i];
  if(!o) return;

  const media = document.getElementById('m-media');
  const cat = document.getElementById('m-cat');
  const title = document.getElementById('m-title');
  const details = document.getElementById('m-details');
  const desc = document.getElementById('m-desc');
  const reg = document.getElementById('m-reg');

  if(media) media.innerHTML = o.img
    ? `<img src="${o.img}" class="modal-img" alt="${o.title}">`
    : `<div class="modal-noimg">🏆</div>`;

  if(cat) cat.textContent = o.cat;
  if(title) title.textContent = o.title;
  if(desc) desc.textContent = o.fullDesc || o.desc;

  if(details) details.innerHTML = `
    <div class="md-box">
      <div class="md-lbl">Event Date</div>
      <div class="md-val">${o.date || 'TBA'}</div>
    </div>
    <div class="md-box">
      <div class="md-lbl">Reg. Deadline</div>
      <div class="md-val">${o.deadline || 'TBA'}</div>
    </div>
    <div class="md-box">
      <div class="md-lbl">Venue</div>
      <div class="md-val">${o.venue || 'Online / TBA'}</div>
    </div>
    <div class="md-box">
      <div class="md-lbl">Eligibility</div>
      <div class="md-val">${o.eligibility || 'N/A'}</div>
    </div>
    <div class="md-box">
      <div class="md-lbl">Reg. Fee</div>
      <div class="md-val">${o.fee || 'N/A'}</div>
    </div>
    <div class="md-box">
      <div class="md-lbl">Prize</div>
      <div class="md-val">${o.prize || 'N/A'}</div>
    </div>`;

  const linkedQuiz = getLinkedQuizFor(o);
  if(reg) {
    let regHtml = o.regLink
      ? `<a href="${o.regLink}" target="_blank" class="modal-reg-btn">Register Now 🚀</a>`
      : '';
    if(linkedQuiz) {
      regHtml += `<a href="quiz.html?id=${linkedQuiz.id}" class="modal-reg-btn"
        style="background:linear-gradient(135deg,#16a34a,#15803d);margin-top:10px;">📝 Take Quiz Now</a>`;
    }
    reg.innerHTML = regHtml;
  }

  const modal = document.getElementById('o-modal');
  if(modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('o-modal');
  if(modal) modal.classList.remove('open');
  document.body.style.overflow = 'auto';
}

/*===== LIGHTBOX =====*/
function openLB(i) {
  const g = getGallery()[i];
  if(!g) return;

  const content = g.type === 'video'
    ? `<video src="${g.url}" controls autoplay></video>`
    : `<img src="${g.url}" alt="${g.cap}">`;

  const lb = document.getElementById('lb');
  const lbContent = document.getElementById('lb-content');

  if(lbContent) lbContent.innerHTML = content;
  if(lb) lb.classList.add('open');
}

function closeLB() {
  const lb = document.getElementById('lb');
  const lbContent = document.getElementById('lb-content');
  if(lb) lb.classList.remove('open');
  if(lbContent) lbContent.innerHTML = '';
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
