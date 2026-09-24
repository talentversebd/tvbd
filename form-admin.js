console.log("🚀 form-admin.js loaded");

/*===== SEPARATE ADMIN CREDENTIALS (own login, own session — not linked to admin.html) =====*/
const FORM_ADMIN_EMAIL = "talentversebd5@gmail.com";
const FORM_ADMIN_PASS = "Frame to Fiction";

/*===== TOAST (self-contained, no dependency on main.js) =====*/
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

/*===== LOGIN / LOGOUT =====*/
function doFormAdminLogin() {
  const u = document.getElementById('flu').value.trim();
  const p = document.getElementById('flp').value;
  const err = document.getElementById('flerr');

  if(!u || !p) {
    err.textContent = "Please enter both email and password!";
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 3000);
    return;
  }

  if(u === FORM_ADMIN_EMAIL && p === FORM_ADMIN_PASS) {
    sessionStorage.setItem('tvbd_form_admin', 'true');
    document.getElementById('fadm-login').style.display = 'none';
    document.getElementById('fadm-shell').style.display = 'flex';
    loadCustomForms().then(() => renderFormsTable());
    toast("Welcome back! 👋");
  } else {
    err.textContent = "❌ Incorrect email or password!";
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 4000);
  }
}

function doFormAdminLogout() {
  sessionStorage.removeItem('tvbd_form_admin');
  window.location.reload();
}

function checkFormAdminAuth() {
  const isLogged = sessionStorage.getItem('tvbd_form_admin');
  const login = document.getElementById('fadm-login');
  const shell = document.getElementById('fadm-shell');
  if(isLogged === 'true') {
    login.style.display = 'none';
    shell.style.display = 'flex';
    loadCustomForms().then(() => renderFormsTable());
  } else {
    login.style.display = 'flex';
    shell.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', checkFormAdminAuth);

/*===== MODAL HELPERS =====*/
function openFM(id) { document.getElementById(id)?.classList.add('open'); }
function closeFM(id) { document.getElementById(id)?.classList.remove('open'); }

/*===== FIELD TYPE LABELS =====*/
const FIELD_TYPES = {
  short: 'Short Text',
  paragraph: 'Paragraph',
  mcq: 'Multiple Choice',
  checkbox: 'Checkboxes',
  dropdown: 'Dropdown',
  file: '📎 File Upload (Image)',
  section: '— Section Heading —'
};

let ffFields = []; // working list of fields while the builder modal is open
let ffIsQuiz = false;

function genFieldId() {
  return 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Converts an epoch-ms timestamp to the local value a <input type="datetime-local"> expects.
function ffTsToLocalInput(ts) {
  if(!ts) return '';
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function onToggleQuizMode(checked) {
  ffIsQuiz = checked;
  document.getElementById('ff-duration-wrap').style.display = checked ? 'block' : 'none';
  renderFieldRows();
}

/*===== OPEN BUILDER (CREATE) =====*/
function openFormBuilder() {
  document.getElementById('ffm-title').textContent = "Create Form";
  document.getElementById('ff-eid').value = '';
  document.getElementById('ff-title').value = '';
  document.getElementById('ff-desc').value = '';
  document.getElementById('ff-status').value = 'draft';
  document.getElementById('ff-isquiz').checked = false;
  ffIsQuiz = false;
  document.getElementById('ff-duration-wrap').style.display = 'none';
  document.getElementById('ff-duration').value = '';
  document.getElementById('ff-startat').value = '';
  document.getElementById('ff-endat').value = '';
  document.getElementById('ff-closedmsg').value = '';
  document.getElementById('ff-thankyoutitle').value = '';
  document.getElementById('ff-thankyoumsg').value = '';
  document.getElementById('ff-share-wrap').style.display = 'none';
  ffFields = [];
  addFormFieldRow();
  renderFieldRows();
  openFM('ffm');
}

/*===== OPEN BUILDER (EDIT) =====*/
function editCustomForm(id) {
  const f = getCustomForms().find(x => x.id === id);
  if(!f) return toast("Form not found!", true);

  document.getElementById('ffm-title').textContent = "Edit Form";
  document.getElementById('ff-eid').value = f.id;
  document.getElementById('ff-title').value = f.title || '';
  document.getElementById('ff-desc').value = f.description || '';
  document.getElementById('ff-status').value = f.status || 'draft';
  document.getElementById('ff-isquiz').checked = !!f.isQuiz;
  ffIsQuiz = !!f.isQuiz;
  document.getElementById('ff-duration-wrap').style.display = ffIsQuiz ? 'block' : 'none';
  document.getElementById('ff-duration').value = f.duration || '';
  document.getElementById('ff-startat').value = ffTsToLocalInput(f.startAt);
  document.getElementById('ff-endat').value = ffTsToLocalInput(f.endAt);
  document.getElementById('ff-closedmsg').value = f.closedMessage || '';
  document.getElementById('ff-thankyoutitle').value = f.thankYouTitle || '';
  document.getElementById('ff-thankyoumsg').value = f.thankYouMessage || '';

  const shareWrap = document.getElementById('ff-share-wrap');
  if(f.status === 'published') {
    shareWrap.style.display = 'block';
    document.getElementById('ff-share-url').value = `${window.location.origin}${window.location.pathname.replace('form-admin.html', '')}form.html?id=${f.id}`;
  } else {
    shareWrap.style.display = 'none';
  }

  ffFields = JSON.parse(JSON.stringify(f.fields || []));
  if(!ffFields.length) addFormFieldRow();
  renderFieldRows();
  openFM('ffm');
}

/*===== FIELD ROW MANAGEMENT =====*/
function addFormFieldRow() {
  ffFields.push({ id: genFieldId(), type: 'short', label: '', description: '', required: false, options: ['Option 1'], points: 1, correctAnswer: '', correctAnswers: [] });
  renderFieldRows();
}

function removeFormFieldRow(fid) {
  ffFields = ffFields.filter(f => f.id !== fid);
  renderFieldRows();
}

function updateFieldProp(fid, prop, value) {
  const f = ffFields.find(x => x.id === fid);
  if(!f) return;
  f[prop] = value;
  if(prop === 'type' && ['mcq', 'checkbox', 'dropdown'].includes(value) && (!f.options || !f.options.length)) {
    f.options = ['Option 1'];
    renderFieldRows();
  } else if(prop === 'type') {
    renderFieldRows();
  }
}

function addFieldOption(fid) {
  const f = ffFields.find(x => x.id === fid);
  if(!f) return;
  f.options = f.options || [];
  f.options.push(`Option ${f.options.length + 1}`);
  renderFieldRows();
}

function updateFieldOption(fid, idx, value) {
  const f = ffFields.find(x => x.id === fid);
  if(!f) return;
  const oldVal = f.options[idx];
  f.options[idx] = value;
  // Keep correct-answer references pointing at the right option after a text edit.
  if(f.correctAnswer === oldVal) f.correctAnswer = value;
  if(Array.isArray(f.correctAnswers)) {
    const ci = f.correctAnswers.indexOf(oldVal);
    if(ci > -1) f.correctAnswers[ci] = value;
  }
}

function removeFieldOption(fid, idx) {
  const f = ffFields.find(x => x.id === fid);
  if(!f) return;
  const removedVal = f.options[idx];
  f.options.splice(idx, 1);
  if(f.correctAnswer === removedVal) f.correctAnswer = '';
  if(Array.isArray(f.correctAnswers)) f.correctAnswers = f.correctAnswers.filter(v => v !== removedVal);
  renderFieldRows();
}

function setFieldCorrectSingle(fid, value) {
  const f = ffFields.find(x => x.id === fid);
  if(!f) return;
  f.correctAnswer = value;
  renderFieldRows();
}

function toggleFieldCorrectMulti(fid, value, checked) {
  const f = ffFields.find(x => x.id === fid);
  if(!f) return;
  f.correctAnswers = f.correctAnswers || [];
  if(checked) { if(!f.correctAnswers.includes(value)) f.correctAnswers.push(value); }
  else { f.correctAnswers = f.correctAnswers.filter(v => v !== value); }
}

function renderFieldRows() {
  const wrap = document.getElementById('ff-fields');
  let qNum = 0;
  wrap.innerHTML = ffFields.map((f, i) => {
    if(f.type === 'section') {
      return `
      <div class="qf-qrow" style="border-left:3px solid var(--blue-br);">
        <div class="qf-qrow-head">
          <span class="qf-qnum">§</span>
          <select class="fi" style="width:auto;" onchange="updateFieldProp('${f.id}', 'type', this.value)">
            ${Object.entries(FIELD_TYPES).map(([val, lbl]) => `<option value="${val}" ${f.type === val ? 'selected' : ''}>${lbl}</option>`).join('')}
          </select>
          <button class="qf-qdel" onclick="removeFormFieldRow('${f.id}')">Delete</button>
        </div>
        <input class="fi" type="text" value="${(f.label || '').replace(/"/g, '&quot;')}"
          placeholder="Section title" onchange="updateFieldProp('${f.id}', 'label', this.value)" style="margin-bottom:8px;font-weight:700;">
        <textarea class="fi" placeholder="Optional description shown under the title" onchange="updateFieldProp('${f.id}', 'description', this.value)" style="min-height:50px;">${(f.description || '')}</textarea>
        <p style="font-size:.7rem;color:var(--muted);margin-top:6px;">📄 This is just a heading — it doesn't collect an answer, only visually splits the form into parts.</p>
      </div>`;
    }

    const needsOptions = ['mcq', 'checkbox', 'dropdown'].includes(f.type);
    qNum++;
    const gradable = ffIsQuiz && needsOptions;
    const optionsHtml = needsOptions ? `
      <div class="ff-opts">
        ${(f.options || []).map((opt, oi) => {
          const escOpt = (opt || '').replace(/"/g, '&quot;');
          let correctCtrl = '';
          if(gradable && f.type !== 'checkbox') {
            correctCtrl = `<input type="radio" name="correct-${f.id}" title="Mark as correct answer"
              ${f.correctAnswer === opt ? 'checked' : ''} onclick="setFieldCorrectSingle('${f.id}', this.value)" value="${escOpt}" style="accent-color:#22c55e;flex-shrink:0;">`;
          } else if(gradable && f.type === 'checkbox') {
            correctCtrl = `<input type="checkbox" title="Mark as correct answer"
              ${(f.correctAnswers || []).includes(opt) ? 'checked' : ''} onclick="toggleFieldCorrectMulti('${f.id}', this.value, this.checked)" value="${escOpt}" style="accent-color:#22c55e;flex-shrink:0;">`;
          }
          return `
          <div class="qf-opt-row">
            ${correctCtrl}
            <span>${f.type === 'checkbox' ? '☐' : (f.type === 'dropdown' ? (oi + 1) + '.' : '○')}</span>
            <input class="fi" type="text" value="${escOpt}"
              onchange="updateFieldOption('${f.id}', ${oi}, this.value)" placeholder="Option ${oi + 1}">
            <button class="qf-opt-del" onclick="removeFieldOption('${f.id}', ${oi})">✕</button>
          </div>`;
        }).join('')}
        <button class="qf-addopt" onclick="addFieldOption('${f.id}')">+ Add Option</button>
        ${gradable ? `<p style="font-size:.7rem;color:var(--muted);margin-top:6px;">✅ Tick/select the correct answer${f.type === 'checkbox' ? '(s)' : ''} above.</p>` : ''}
      </div>` : (f.type === 'file'
        ? `<p style="font-size:.72rem;color:var(--muted);margin-top:4px;">📎 Respondents can upload one image (photo, screenshot, scanned doc as an image). PDFs/docs aren't supported — only image files.</p>`
        : (ffIsQuiz ? `<p style="font-size:.72rem;color:var(--muted);margin-top:4px;">This is a short/paragraph answer — it won't be auto-scored.</p>` : ''));

    const pointsHtml = gradable ? `
      <div class="fg" style="max-width:120px;margin-top:10px;margin-bottom:0;">
        <label>Points</label>
        <input class="fi" type="number" min="0" value="${f.points ?? 1}" onchange="updateFieldProp('${f.id}', 'points', parseFloat(this.value) || 0)">
      </div>` : '';

    return `
      <div class="qf-qrow">
        <div class="qf-qrow-head">
          <span class="qf-qnum">Q${qNum}</span>
          <select class="fi" style="width:auto;" onchange="updateFieldProp('${f.id}', 'type', this.value)">
            ${Object.entries(FIELD_TYPES).map(([val, lbl]) => `<option value="${val}" ${f.type === val ? 'selected' : ''}>${lbl}</option>`).join('')}
          </select>
          <button class="qf-qdel" onclick="removeFormFieldRow('${f.id}')">Delete</button>
        </div>
        <input class="fi" type="text" value="${(f.label || '').replace(/"/g, '&quot;')}"
          placeholder="Question text" onchange="updateFieldProp('${f.id}', 'label', this.value)" style="margin-bottom:8px;">
        ${optionsHtml}
        ${pointsHtml}
        <div class="chk-wrap">
          <input type="checkbox" id="req-${f.id}" ${f.required ? 'checked' : ''} onchange="updateFieldProp('${f.id}', 'required', this.checked)">
          <label for="req-${f.id}">Required question</label>
        </div>
      </div>`;
  }).join('');
}

/*===== SAVE FORM =====*/
async function saveCustomForm() {
  const eid = document.getElementById('ff-eid').value;
  const title = document.getElementById('ff-title').value.trim();
  const description = document.getElementById('ff-desc').value.trim();
  const status = document.getElementById('ff-status').value;
  const isQuiz = document.getElementById('ff-isquiz').checked;
  const durationVal = document.getElementById('ff-duration').value;
  const duration = isQuiz && durationVal ? parseInt(durationVal) : null;
  const startatVal = document.getElementById('ff-startat').value;
  const endatVal = document.getElementById('ff-endat').value;
  const startAt = startatVal ? new Date(startatVal).getTime() : null;
  const endAt = endatVal ? new Date(endatVal).getTime() : null;
  const closedMessage = document.getElementById('ff-closedmsg').value.trim();
  const thankYouTitle = document.getElementById('ff-thankyoutitle').value.trim();
  const thankYouMessage = document.getElementById('ff-thankyoumsg').value.trim();

  if(!title) return toast("Form title is required!", true);
  if(startAt && endAt && endAt <= startAt) return toast("Closing time must be after opening time!", true);
  if(!ffFields.length) return toast("Add at least one question!", true);
  if(!ffFields.some(f => f.type !== 'section')) return toast("Add at least one real question (not just a section heading)!", true);
  for(const f of ffFields) {
    if(!f.label.trim()) return toast("Every question needs text!", true);
    if(['mcq', 'checkbox', 'dropdown'].includes(f.type) && (!f.options || f.options.filter(o => o.trim()).length < 2)) {
      return toast(`"${f.label}" needs at least 2 options!`, true);
    }
    if(isQuiz && ['mcq', 'dropdown'].includes(f.type) && !f.correctAnswer) {
      return toast(`Mark the correct answer for "${f.label}"!`, true);
    }
    if(isQuiz && f.type === 'checkbox' && (!f.correctAnswers || !f.correctAnswers.length)) {
      return toast(`Mark at least one correct answer for "${f.label}"!`, true);
    }
  }

  const formData = { title, description, status, isQuiz, duration, startAt, endAt, closedMessage, thankYouTitle, thankYouMessage, fields: ffFields };
  const result = eid ? await updateCustomForm(eid, formData) : await addCustomForm(formData);

  if(result.success) {
    toast(eid ? "Form updated!" : "Form created!");
    closeFM('ffm');
    renderFormsTable();
  } else {
    toast("Something went wrong. Try again.", true);
  }
}

/*===== DELETE FORM =====*/
async function deleteFormAction(id) {
  if(!confirm("Delete this form and all of its saved responses' link? This can't be undone.")) return;
  const ok = await deleteCustomForm(id);
  if(ok) { toast("Form deleted."); renderFormsTable(); }
  else toast("Failed to delete form.", true);
}

/*===== TOGGLE PUBLISH STATUS QUICKLY =====*/
async function toggleFormStatus(id) {
  const f = getCustomForms().find(x => x.id === id);
  if(!f) return;
  const newStatus = f.status === 'published' ? 'draft' : 'published';
  const result = await updateCustomForm(id, { ...f, status: newStatus });
  if(result.success) { toast(newStatus === 'published' ? "Form published!" : "Form set to draft."); renderFormsTable(); }
  else toast("Failed to update status.", true);
}

/*===== RENDER FORMS TABLE =====*/
function renderFormsTable() {
  const tbody = document.getElementById('fadm-tbl');
  const forms = getCustomForms();
  if(!forms.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No forms yet. Click "+ New Form" to create one.</td></tr>`;
    return;
  }
  tbody.innerHTML = forms.map(f => {
    const avail = getFormAvailability(f);
    const availBadge = {
      draft:     `<span class="bs bs-past">—</span>`,
      scheduled: `<span class="bs bs-upcoming" title="Opens ${new Date(avail.startAt).toLocaleString()}">🕒 Opens ${new Date(avail.startAt).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span>`,
      open:      `<span class="bs bs-active">🟢 Open Now</span>`,
      closed:    `<span class="bs bs-past" title="Closed ${new Date(avail.endAt).toLocaleString()}">⛔ Closed</span>`
    }[avail.state];
    return `
    <tr>
      <td><strong>${f.title}</strong></td>
      <td>${(f.fields || []).filter(fl => fl.type !== 'section').length}</td>
      <td>${(f.fields || []).filter(fl => fl.type === 'section').length || '—'}</td>
      <td><span class="bs ${f.status === 'published' ? 'bs-active' : 'bs-past'}" style="cursor:pointer;" onclick="toggleFormStatus('${f.id}')" title="Click to toggle">${f.status === 'published' ? 'Published' : 'Draft'}</span></td>
      <td>${availBadge}</td>
      <td>${(getFormResponses(f.id) || []).length || '—'}</td>
      <td class="tbl-acts">
        <button class="e-btn" onclick="editCustomForm('${f.id}')">Edit</button>
        <button class="r-btn" onclick="viewFormResponses('${f.id}')">Responses</button>
        <button class="d-btn" onclick="deleteFormAction('${f.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

/*===== COPY LINK =====*/
function copyFormLink() {
  const inp = document.getElementById('ff-share-url');
  inp.select();
  navigator.clipboard.writeText(inp.value).then(() => toast("Link copied!")).catch(() => toast("Couldn't copy — copy it manually.", true));
}

/*===== RESPONSES VIEW =====*/
let fadmCurrentFormId = null;
let fadmAllResponses = [];      // full, unfiltered list for the form currently being viewed
let fadmFilteredResponses = []; // whatever's currently shown (after search)
let fadmRespSearchQ = '';

async function viewFormResponses(id) {
  fadmCurrentFormId = id;
  const f = getCustomForms().find(x => x.id === id);
  if(!f) return toast("Form not found!", true);

  document.getElementById('fadm-list-view').style.display = 'none';
  document.getElementById('fadm-resp-view').style.display = 'block';
  document.getElementById('fadm-resp-title').textContent = `Responses — ${f.title}`;
  document.getElementById('fadm-resp-thead').innerHTML = `<tr><th colspan="99">Loading…</th></tr>`;
  document.getElementById('fadm-resp-tbody').innerHTML = '';
  document.getElementById('fadm-resp-search').value = '';
  fadmRespSearchQ = '';

  fadmAllResponses = await loadFormResponses(id);
  fadmFilteredResponses = fadmAllResponses;
  renderResponsesTable(f, fadmFilteredResponses);
  updateRespCount();
}

function closeResponsesView() {
  document.getElementById('fadm-resp-view').style.display = 'none';
  document.getElementById('fadm-list-view').style.display = 'block';
  renderFormsTable();
}

function updateRespCount() {
  const el = document.getElementById('fadm-resp-count');
  if(!el) return;
  el.textContent = fadmRespSearchQ
    ? `Showing ${fadmFilteredResponses.length} of ${fadmAllResponses.length}`
    : `${fadmAllResponses.length} response${fadmAllResponses.length === 1 ? '' : 's'}`;
}

// Matches the search text against every answer value and the submitted date
// (whatever's visible in the table), case-insensitive substring match.
function filterResponsesTable(q) {
  fadmRespSearchQ = (q || '').trim().toLowerCase();
  const f = getCustomForms().find(x => x.id === fadmCurrentFormId);
  if(!f) return;

  if(!fadmRespSearchQ) {
    fadmFilteredResponses = fadmAllResponses;
  } else {
    fadmFilteredResponses = fadmAllResponses.filter(r => {
      const dateStr = new Date(r.submittedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }).toLowerCase();
      if(dateStr.includes(fadmRespSearchQ)) return true;
      const answers = r.answers || {};
      return Object.values(answers).some(v => {
        const s = Array.isArray(v) ? v.join(', ') : String(v ?? '');
        return s.toLowerCase().includes(fadmRespSearchQ);
      });
    });
  }
  renderResponsesTable(f, fadmFilteredResponses);
  updateRespCount();
}

function fmtRespValue(val, fieldType) {
  if(val === undefined || val === null || val === '') return '<span style="color:var(--muted);">—</span>';
  if(fieldType === 'file' && typeof val === 'string' && val.startsWith('http')) {
    return `<a href="${val}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;color:var(--blue-br);text-decoration:none;">
      <img src="${val}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;border:1px solid var(--bdr);" loading="lazy">📎 View
    </a>`;
  }
  if(Array.isArray(val)) return val.join(', ') || '<span style="color:var(--muted);">—</span>';
  return String(val);
}

function renderResponsesTable(form, responses) {
  const thead = document.getElementById('fadm-resp-thead');
  const tbody = document.getElementById('fadm-resp-tbody');
  const fields = (form.fields || []).filter(f => f.type !== 'section');
  const scoreCol = form.isQuiz ? '<th>Score</th>' : '';

  thead.innerHTML = `<tr><th>Submitted</th>${scoreCol}${fields.map(f => `<th>${f.label}</th>`).join('')}<th>Actions</th></tr>`;

  if(!responses.length) {
    const msg = fadmRespSearchQ ? 'No responses match your search.' : 'No responses yet.';
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${fields.length + (form.isQuiz ? 3 : 2)}">${msg}</td></tr>`;
    return;
  }

  tbody.innerHTML = responses.map(r => `
    <tr>
      <td>${new Date(r.submittedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</td>
      ${form.isQuiz ? `<td><strong>${r.score ?? 0} / ${r.totalPossible ?? 0}</strong></td>` : ''}
      ${fields.map(f => `<td>${fmtRespValue(r.answers ? r.answers[f.id] : undefined, f.type)}</td>`).join('')}
      <td class="tbl-acts"><button class="d-btn" onclick="deleteResponseAction('${r.id}')">Delete</button></td>
    </tr>`).join('');
}

async function deleteResponseAction(id) {
  if(!confirm("Delete this response?")) return;
  const ok = await deleteFormResponse(fadmCurrentFormId, id);
  if(ok) {
    toast("Response deleted.");
    fadmAllResponses = getFormResponses(fadmCurrentFormId);
    filterResponsesTable(fadmRespSearchQ); // re-apply whatever search was active
  } else {
    toast("Failed to delete response.", true);
  }
}

/*===== CSV EXPORT (exports whatever's currently visible — respects an active search) =====*/
function downloadFormResponsesCSV() {
  const f = getCustomForms().find(x => x.id === fadmCurrentFormId);
  if(!f) return;
  const responses = fadmFilteredResponses;
  if(!responses.length) return toast("No responses to export.", true);

  const fields = (f.fields || []).filter(fl => fl.type !== 'section');
  const escCsv = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Submitted', ...(f.isQuiz ? ['Score'] : []), ...fields.map(fl => fl.label)];
  const rows = responses.map(r => [
    new Date(r.submittedAt).toLocaleString(),
    ...(f.isQuiz ? [`${r.score ?? 0} / ${r.totalPossible ?? 0}`] : []),
    ...fields.map(fl => {
      const v = r.answers ? r.answers[fl.id] : '';
      return Array.isArray(v) ? v.join('; ') : (v ?? '');
    })
  ]);

  const csv = [header, ...rows].map(row => row.map(escCsv).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${f.title.replace(/[^a-z0-9]+/gi, '_')}_responses.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
