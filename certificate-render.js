/*===== TVBD CERTIFICATE RENDERER =====
   Draws a finished certificate. If the admin saved their own certificate design
   (settings/certTemplate) the name, Verify ID and QR code are printed on it;
   otherwise a built-in design is used.
   Also contains a tiny PDF writer and ZIP writer, so nothing else is required.
   Used by admin.html (download / bulk ZIP) and verify.html (participant download). */
(function () {
  const W = 1754, H = 1240;                       // A4 landscape @150dpi
  const NAVY = '#0f2557', GOLD = '#b8902f', INK = '#1f2937', MUTED = '#6b7280', PAPER = '#fdfbf6';
  const SERIF = 'Georgia, "Times New Roman", "Noto Serif Bengali", serif';
  const SANS = 'Arial, Helvetica, "Noto Sans Bengali", sans-serif';
  const VERIFY_BASE = 'https://talentversebd.github.io/tvbd/verify.html?id=';
  const QR_LIB = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';

  /* ---------- small helpers ---------- */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('script-load-failed'));
      document.head.appendChild(s);
    });
  }
  function loadImage(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
  async function getQR(text) {
    try {
      if (typeof window.qrcode !== 'function') await loadScript(QR_LIB);
      const qr = window.qrcode(0, 'M');
      qr.addData(text); qr.make();
      return qr;
    } catch (e) { return null; }
  }
  function kindOf(position) {
    const p = String(position || '').toLowerCase();
    if (/champion|winner|runner|1st|2nd|3rd|first|second|third|gold|silver|bronze|rank/.test(p)) return 'rank';
    if (/merit|honou?r|distinction/.test(p)) return 'merit';
    if (!p || /participa/.test(p)) return 'participant';
    return 'rank';
  }
  function fmtDate(d) {
    if (!d) return '';
    const dt = new Date(d);
    return isNaN(dt) ? String(d) : dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function fitFont(ctx, text, maxW, size, min, make) {
    let s = size; ctx.font = make(s);
    while (ctx.measureText(text).width > maxW && s > min) { s -= 2; ctx.font = make(s); }
    return s;
  }
  function wrapText(ctx, text, maxW) {
    const words = String(text).split(/\s+/); const lines = []; let cur = '';
    words.forEach(w => {
      const t = cur ? cur + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function spacedWidth(ctx, text, sp) {
    let w = 0; for (const ch of text) w += ctx.measureText(ch).width + sp;
    return w - sp;
  }
  function drawSpaced(ctx, text, cx, y, sp) {
    let x = cx - spacedWidth(ctx, text, sp) / 2;
    ctx.textAlign = 'left';
    for (const ch of text) { ctx.fillText(ch, x, y); x += ctx.measureText(ch).width + sp; }
    ctx.textAlign = 'center';
  }
  function diamond(ctx, x, y, r, color) {
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); ctx.fill();
  }
  function hline(ctx, x1, x2, y, color, w) {
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
  }

  /* ---------- the certificate drawing ---------- */
  async function renderBuiltIn(cert) {
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    const cx = W / 2;
    const kind = kindOf(cert.position);

    // paper + borders
    ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = NAVY; ctx.lineWidth = 16; ctx.strokeRect(36, 36, W - 72, H - 72);
    ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.strokeRect(68, 68, W - 136, H - 136);
    ctx.lineWidth = 1.5; ctx.strokeRect(80, 80, W - 160, H - 160);
    [[68, 68], [W - 68, 68], [68, H - 68], [W - 68, H - 68]].forEach(p => diamond(ctx, p[0], p[1], 16, GOLD));

    // logo
    const logo = await loadImage('logo.jpg');
    ctx.beginPath(); ctx.arc(cx, 182, 70, 0, Math.PI * 2); ctx.fillStyle = GOLD; ctx.fill();
    if (logo) {
      ctx.save(); ctx.beginPath(); ctx.arc(cx, 182, 64, 0, Math.PI * 2); ctx.clip();
      const side = Math.min(logo.naturalWidth, logo.naturalHeight);
      ctx.drawImage(logo, (logo.naturalWidth - side) / 2, (logo.naturalHeight - side) / 2, side, side, cx - 64, 118, 128, 128);
      ctx.restore();
    }

    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';

    // organisation + title
    ctx.fillStyle = NAVY; ctx.font = `bold 26px ${SANS}`;
    drawSpaced(ctx, 'TALENTVERSE BANGLADESH', cx, 292, 8);

    const title = kind === 'participant' ? 'CERTIFICATE OF PARTICIPATION' : kind === 'merit' ? 'CERTIFICATE OF MERIT' : 'CERTIFICATE OF ACHIEVEMENT';
    let tsize = 58; ctx.font = `bold ${tsize}px ${SERIF}`;
    while (spacedWidth(ctx, title, 6) > W - 360 && tsize > 30) { tsize -= 2; ctx.font = `bold ${tsize}px ${SERIF}`; }
    ctx.fillStyle = NAVY; drawSpaced(ctx, title, cx, 372, 6);

    hline(ctx, cx - 280, cx - 20, 408, GOLD, 2); hline(ctx, cx + 20, cx + 280, 408, GOLD, 2);
    diamond(ctx, cx, 408, 8, GOLD);

    // recipient
    ctx.fillStyle = MUTED; ctx.font = `italic 30px ${SERIF}`;
    ctx.fillText('This certificate is proudly presented to', cx, 466);

    const name = String(cert.name || '').trim();
    ctx.fillStyle = NAVY;
    fitFont(ctx, name, 1300, 104, 44, s => `italic bold ${s}px ${SERIF}`);
    ctx.fillText(name, cx, 566);
    const nameW = Math.min(ctx.measureText(name).width + 140, 1420);
    hline(ctx, cx - nameW / 2, cx + nameW / 2, 592, GOLD, 2);

    // body
    ctx.fillStyle = MUTED; ctx.font = `italic 30px ${SERIF}`;
    const event = String(cert.event || '').trim();
    if (kind === 'participant') {
      ctx.fillText('for successfully participating in', cx, 650);
      ctx.fillStyle = NAVY;
      let sz = fitFont(ctx, event, 1400, 54, 38, s => `bold ${s}px ${SERIF}`);
      const lines = ctx.measureText(event).width > 1400 ? wrapText(ctx, event, 1400) : [event];
      lines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, cx, 732 + i * (sz + 12)));
    } else {
      ctx.fillText('for outstanding performance and achieving', cx, 650);
      ctx.fillStyle = GOLD;
      fitFont(ctx, String(cert.position || ''), 1300, 70, 36, s => `bold ${s}px ${SERIF}`);
      ctx.fillText(String(cert.position || ''), cx, 734);
      ctx.fillStyle = MUTED; ctx.font = `italic 30px ${SERIF}`; ctx.fillText('in', cx, 786);
      ctx.fillStyle = NAVY;
      let sz = fitFont(ctx, event, 1400, 46, 34, s => `bold ${s}px ${SERIF}`);
      const lines = ctx.measureText(event).width > 1400 ? wrapText(ctx, event, 1400) : [event];
      lines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, cx, 848 + i * (sz + 10)));
    }

    // footer: date | QR | signature
    ctx.fillStyle = INK; ctx.font = `bold 28px ${SERIF}`;
    ctx.fillText(fmtDate(cert.issueDate), 400, 1034);
    hline(ctx, 230, 570, 1054, NAVY, 2);
    ctx.fillStyle = MUTED; ctx.font = `20px ${SANS}`; ctx.fillText('Date of Issue', 400, 1086);

    ctx.fillStyle = NAVY; ctx.font = `italic bold 30px ${SERIF}`;
    ctx.fillText('TalentVerse Bangladesh', W - 400, 1034);
    hline(ctx, W - 570, W - 230, 1054, NAVY, 2);
    ctx.fillStyle = MUTED; ctx.font = `20px ${SANS}`; ctx.fillText('Authorized Signature', W - 400, 1086);

    const verifyUrl = VERIFY_BASE + encodeURIComponent(cert.certId || '');
    const qr = await getQR(verifyUrl);
    const S = 150, qx = cx - S / 2, qy = 930;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(qx - 10, qy - 10, S + 20, S + 20);
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.strokeRect(qx - 10, qy - 10, S + 20, S + 20);
    if (qr) {
      const n = qr.getModuleCount(), cell = S / n;
      ctx.fillStyle = NAVY;
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) ctx.fillRect(qx + c * cell, qy + r * cell, cell + 0.6, cell + 0.6);
      }
    } else {
      ctx.fillStyle = MUTED; ctx.font = `16px ${SANS}`; ctx.fillText('Verify online', cx, qy + S / 2);
    }
    ctx.fillStyle = NAVY; ctx.font = `bold 22px ${SANS}`;
    ctx.fillText('ID: ' + (cert.certId || ''), cx, 1124);
    ctx.fillStyle = MUTED; ctx.font = `15px ${SANS}`;
    ctx.fillText('Verify at talentversebd.github.io/tvbd/verify.html', cx, 1146);

    return canvas;
  }

  /* ---------- certificate on the admin's OWN design ----------
     The admin uploads a designed certificate (image) once and taps where the
     Name, Verify ID and QR code should go. Every certificate is that image with
     those three things printed on it. */
  function defaultCfg() {
    return {
      url: '',
      examOnly: true,                 // only people who took the exam can get a certificate
      name: { x: 50, y: 48, size: 5, color: '#0f2557', font: 'serif-italic', maxW: 70 },
      id:   { x: 50, y: 92, size: 1.6, color: '#374151', show: true },
      qr:   { x: 88, y: 84, size: 9, color: '#000000', show: true }
    };
  }
  function mergeCfg(c) {
    const d = defaultCfg(), o = c || {};
    return { url: o.url || '', examOnly: o.examOnly !== false, name: Object.assign(d.name, o.name || {}), id: Object.assign(d.id, o.id || {}), qr: Object.assign(d.qr, o.qr || {}) };
  }
  function fontFor(kind, px) {
    if (kind === 'sans-bold') return `bold ${px}px ${SANS}`;
    if (kind === 'serif') return `bold ${px}px ${SERIF}`;
    return `italic bold ${px}px ${SERIF}`;
  }
  const tplImgCache = {};
  function loadTemplateImage(url) {
    if (tplImgCache[url]) return tplImgCache[url];
    tplImgCache[url] = new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => { delete tplImgCache[url]; resolve(null); };
      img.src = url;
    });
    return tplImgCache[url];
  }

  async function renderOnTemplate(cert, cfgIn, img, opts) {
    const cfg = mergeCfg(cfgIn);
    const maxSide = (opts && opts.maxSide) || 2800;
    let w = img.naturalWidth, h = img.naturalHeight;
    const sc = Math.min(1, maxSide / Math.max(w, h));
    w = Math.round(w * sc); h = Math.round(h * sc);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    // name
    const n = cfg.name, name = String(cert.name || '').trim();
    ctx.fillStyle = n.color;
    fitFont(ctx, name, (n.maxW / 100) * w, (n.size / 100) * w, 14, px => fontFor(n.font, px));
    ctx.fillText(name, (n.x / 100) * w, (n.y / 100) * h);

    // verify id
    if (cfg.id.show !== false) {
      ctx.fillStyle = cfg.id.color;
      ctx.font = `bold ${Math.max(10, (cfg.id.size / 100) * w)}px ${SANS}`;
      ctx.fillText('Verify ID: ' + (cert.certId || ''), (cfg.id.x / 100) * w, (cfg.id.y / 100) * h);
    }

    // qr code
    if (cfg.qr.show !== false) {
      const qr = await getQR(VERIFY_BASE + encodeURIComponent(cert.certId || ''));
      const S = (cfg.qr.size / 100) * w, pad = S * 0.07;
      const qx = (cfg.qr.x / 100) * w - S / 2, qy = (cfg.qr.y / 100) * h - S / 2;
      ctx.fillStyle = '#ffffff'; ctx.fillRect(qx - pad, qy - pad, S + pad * 2, S + pad * 2);
      if (qr) {
        const cnt = qr.getModuleCount(), cell = S / cnt;
        ctx.fillStyle = cfg.qr.color;
        for (let r = 0; r < cnt; r++) for (let c = 0; c < cnt; c++) {
          if (qr.isDark(r, c)) ctx.fillRect(qx + c * cell, qy + r * cell, cell + 0.6, cell + 0.6);
        }
      }
    }
    return canvas;
  }

  // which event does this certificate belong to? (new ones store eventId, older ones are matched by title)
  async function findEventId(cert) {
    if (cert.eventId) return cert.eventId;
    const norm = v => String(v || '').trim().toLowerCase();
    const get = () => (typeof window.getOlympiads === 'function' ? window.getOlympiads() : []) || [];
    let list = get();
    if (!list.length && typeof window.loadAllData === 'function') { try { await window.loadAllData(); } catch (e) {} list = get(); }
    const o = list.find(x => norm(x.title) === norm(cert.event));
    return o ? o.id : '';
  }
  // the event's own design if it has one, otherwise the default design
  async function resolveCfg(cert) {
    if (typeof window.loadCertTemplate !== 'function') return null;
    try {
      const eid = await findEventId(cert);
      if (eid) {
        const own = await window.loadCertTemplate(false, eid);
        if (own && own.url) return own;
      }
    } catch (e) { console.error('Event template lookup failed', e); }
    return window.loadCertTemplate(false);
  }

  // cfgIn: pass a config to preview it (admin editor); leave undefined to use the saved one
  async function render(cert, cfgIn, opts) {
    const cfg = cfgIn !== undefined ? cfgIn : await resolveCfg(cert);
    if (cfg && cfg.url) {
      const img = await loadTemplateImage(cfg.url);
      if (img) return renderOnTemplate(cert, cfg, img, opts);
      const fb = await renderBuiltIn(cert);       // template could not be loaded -> built-in design
      fb.templateFailed = true;
      return fb;
    }
    return renderBuiltIn(cert);
  }

  /* ---------- file builders ---------- */
  function canvasBlob(canvas, type, q) {
    return new Promise(res => canvas.toBlob(res, type, q));
  }
  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  function safe(s) { return String(s || '').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, ''); }

  function pdfFromJpeg(jpeg, wpx, hpx) {
    const enc = new TextEncoder(); const parts = []; let len = 0; const off = [];
    const push = b => { const u = typeof b === 'string' ? enc.encode(b) : b; parts.push(u); len += u.length; };
    const PW = wpx >= hpx ? 841.89 : 595.28, PH = PW * hpx / wpx;
    push('%PDF-1.4\n');
    off[1] = len; push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    off[2] = len; push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    off[3] = len; push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
    off[4] = len; push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${wpx} /Height ${hpx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
    push(jpeg); push('\nendstream\nendobj\n');
    const content = `q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`;
    off[5] = len; push(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
    const xref = len;
    let x = 'xref\n0 6\n0000000000 65535 f \n';
    for (let i = 1; i <= 5; i++) x += String(off[i]).padStart(10, '0') + ' 00000 n \n';
    push(x + `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
    const out = new Uint8Array(len); let p = 0;
    parts.forEach(u => { out.set(u, p); p += u.length; });
    return out;
  }

  const CRC_T = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(u8) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function zip(files) {                       // "store" method: the images are already compressed
    const enc = new TextEncoder(); const chunks = []; const central = []; let offset = 0;
    const d = new Date();
    const dosTime = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    const dosDate = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    files.forEach(f => {
      const name = enc.encode(f.name), crc = crc32(f.data), size = f.data.length;
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
      lh.setUint16(10, dosTime, true); lh.setUint16(12, dosDate, true); lh.setUint32(14, crc, true);
      lh.setUint32(18, size, true); lh.setUint32(22, size, true); lh.setUint16(26, name.length, true); lh.setUint16(28, 0, true);
      chunks.push(new Uint8Array(lh.buffer), name, f.data);
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
      ch.setUint16(10, 0, true); ch.setUint16(12, dosTime, true); ch.setUint16(14, dosDate, true); ch.setUint32(16, crc, true);
      ch.setUint32(20, size, true); ch.setUint32(24, size, true); ch.setUint16(28, name.length, true);
      ch.setUint32(42, offset, true);
      central.push(new Uint8Array(ch.buffer), name);
      offset += 30 + name.length + size;
    });
    let cdSize = 0; central.forEach(u => { cdSize += u.length; });
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
    return new Blob([...chunks, ...central, new Uint8Array(end.buffer)], { type: 'application/zip' });
  }

  /* ---------- public API ---------- */
  window.tvbdCert = {
    render,
    download,
    async imageBlob(cert, type, q) { return canvasBlob(await render(cert), type || 'image/png', q || 0.92); },
    async downloadImage(cert) {
      const blob = await this.imageBlob(cert, 'image/png');
      download(blob, `Certificate_${safe(cert.certId)}.png`);
    },
    async downloadPdf(cert) {
      const canvas = await render(cert);
      const jpeg = new Uint8Array(await (await canvasBlob(canvas, 'image/jpeg', 0.92)).arrayBuffer());
      download(new Blob([pdfFromJpeg(jpeg, canvas.width, canvas.height)], { type: 'application/pdf' }), `Certificate_${safe(cert.certId)}.pdf`);
    },
    // many certificates -> one ZIP of JPEG images
    async zipBlob(certs, onProgress) {
      const files = [];
      for (let i = 0; i < certs.length; i++) {
        if (onProgress) onProgress(i + 1, certs.length);
        const canvas = await render(certs[i]);
        const data = new Uint8Array(await (await canvasBlob(canvas, 'image/jpeg', 0.9)).arrayBuffer());
        files.push({ name: `${safe(certs[i].certId)}_${safe(certs[i].name) || 'certificate'}.jpg`, data });
        await new Promise(r => setTimeout(r, 0));          // let the page breathe on phones
      }
      return zip(files);
    },
    defaultCfg, mergeCfg,
    _pdfFromJpeg: pdfFromJpeg, _zip: zip, _kindOf: kindOf
  };
})();
