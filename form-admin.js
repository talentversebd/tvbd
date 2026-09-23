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
  dropdown: 'Dropdown'
};

let ffFields = []; // working list of fields while the builder modal is open

function genFieldId() {
  return 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/*===== OPEN BUILDER (CREATE) =====*/
function openFormBuilder() {
  document.getElementById('ffm-title').textContent = "Create Form";
  document.getElementById('ff-eid').value = '';
  document.getElementById('ff-title').value = '';
  document.getElementById('ff-desc').value = '';
  document.getElementById('ff-status').value = 'draft';
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
  ffFields.push({ id: genFieldId(), type: 'short', label: '', required: false, options: ['Option 1'] });
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
  f.options[idx] = value;
}

function removeFieldOption(fid, idx) {
  const f = ffFields.find(x => x.id === fid);
  if(!f) return;
  f.options.splice(idx, 1);
  renderFieldRows();
}

function renderFieldRows() {
  const wrap = document.getElementById('ff-fields');
  wrap.innerHTML = ffFields.map((f, i) => {
    const needsOptions = ['mcq', 'checkbox', 'dropdown'].includes(f.type);
    const optionsHtml = needsOptions ? `
      <div class="ff-opts">
        ${(f.options || []).map((opt, oi) => `
          <div class="qf-opt-row">
            <span>${f.type === 'checkbox' ? '☐' : (f.type === 'dropdown' ? (oi + 1) + '.' : '○')}</span>
            <input class="fi" type="text" value="${(opt || '').replace(/"/g, '&quot;')}"
              onchange="updateFieldOption('${f.id}', ${oi}, this.value)" placeholder="Option ${oi + 1}">
            <button class="qf-opt-del" onclick="removeFieldOption('${f.id}', ${oi})">✕</button>
          </div>`).join('')}
        <button class="qf-addopt" onclick="addFieldOption('${f.id}')">+ Add Option</button>
      </div>` : '';

    return `
      <div class="qf-qrow">
        <div class="qf-qrow-head">
          <span class="qf-qnum">Q${i + 1}</span>
          <select class="fi" style="width:auto;" onchange="updateFieldProp('${f.id}', 'type', this.value)">
            ${Object.entries(FIELD_TYPES).map(([val, lbl]) => `<option value="${val}" ${f.type === val ? 'selected' : ''}>${lbl}</option>`).join('')}
          </select>
          <button class="qf-qdel" onclick="removeFormFieldRow('${f.id}')">Delete</button>
        </div>
        <input class="fi" type="text" value="${(f.label || '').replace(/"/g, '&quot;')}"
          placeholder="Question text" onchange="updateFieldProp('${f.id}', 'label', this.value)" style="margin-bottom:8px;">
        ${optionsHtml}
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

  if(!title) return toast("Form title is required!", true);
  if(!ffFields.length) return toast("Add at least one question!", true);
  for(const f of ffFields) {
    if(!f.label.trim()) return toast("Every question needs text!", true);
    if(['mcq', 'checkbox', 'dropdown'].includes(f.type) && (!f.options || f.options.filter(o => o.trim()).length < 2)) {
      return toast(`"${f.label}" needs at least 2 options!`, true);
    }
  }

  const formData = { title, description, status, fields: ffFields };
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
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No forms yet. Click "+ New Form" to create one.</td></tr>`;
    return;
  }
  tbody.innerHTML = forms.map(f => `
    <tr>
      <td><strong>${f.title}</strong></td>
      <td>${(f.fields || []).length}</td>
      <td><span class="bs ${f.status === 'published' ? 'bs-active' : 'bs-past'}" style="cursor:pointer;" onclick="toggleFormStatus('${f.id}')" title="Click to toggle">${f.status === 'published' ? 'Published' : 'Draft'}</span></td>
      <td>${(getFormResponses(f.id) || []).length || '—'}</td>
      <td class="tbl-acts">
        <button class="e-btn" onclick="editCustomForm('${f.id}')">Edit</button>
        <button class="r-btn" onclick="viewFormResponses('${f.id}')">Responses</button>
        <button class="d-btn" onclick="deleteFormAction('${f.id}')">Delete</button>
      </td>
    </tr>`).join('');
}

/*===== COPY LINK =====*/
function copyFormLink() {
  const inp = document.getElementById('ff-share-url');
  inp.select();
  navigator.clipboard.writeText(inp.value).then(() => toast("Link copied!")).catch(() => toast("Couldn't copy — copy it manually.", true));
}

/*===== RESPONSES VIEW =====*/
let fadmCurrentFormId = null;

async function viewFormResponses(id) {
  fadmCurrentFormId = id;
  const f = getCustomForms().find(x => x.id === id);
  if(!f) return toast("Form not found!", true);

  document.getElementById('fadm-list-view').style.display = 'none';
  document.getElementById('fadm-resp-view').style.display = 'block';
  document.getElementById('fadm-resp-title').textContent = `Responses — ${f.title}`;
  document.getElementById('fadm-resp-thead').innerHTML = `<tr><th colspan="99">Loading…</th></tr>`;
  document.getElementById('fadm-resp-tbody').innerHTML = '';

  const responses = await loadFormResponses(id);
  renderResponsesTable(f, responses);
}

function closeResponsesView() {
  document.getElementById('fadm-resp-view').style.display = 'none';
  document.getElementById('fadm-list-view').style.display = 'block';
  renderFormsTable();
}

function fmtRespValue(val) {
  if(val === undefined || val === null || val === '') return '<span style="color:var(--muted);">—</span>';
  if(Array.isArray(val)) return val.join(', ') || '<span style="color:var(--muted);">—</span>';
  return String(val);
}

function renderResponsesTable(form, responses) {
  const thead = document.getElementById('fadm-resp-thead');
  const tbody = document.getElementById('fadm-resp-tbody');
  const fields = form.fields || [];

  thead.innerHTML = `<tr><th>Submitted</th>${fields.map(f => `<th>${f.label}</th>`).join('')}<th>Actions</th></tr>`;

  if(!responses.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${fields.length + 2}">No responses yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = responses.map(r => `
    <tr>
      <td>${new Date(r.submittedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</td>
      ${fields.map(f => `<td>${fmtRespValue(r.answers ? r.answers[f.id] : undefined)}</td>`).join('')}
      <td class="tbl-acts"><button class="d-btn" onclick="deleteResponseAction('${r.id}')">Delete</button></td>
    </tr>`).join('');
}

async function deleteResponseAction(id) {
  if(!confirm("Delete this response?")) return;
  const ok = await deleteFormResponse(fadmCurrentFormId, id);
  if(ok) {
    toast("Response deleted.");
    const f = getCustomForms().find(x => x.id === fadmCurrentFormId);
    renderResponsesTable(f, getFormResponses(fadmCurrentFormId));
  } else {
    toast("Failed to delete response.", true);
  }
}

/*===== CSV EXPORT =====*/
function downloadFormResponsesCSV() {
  const f = getCustomForms().find(x => x.id === fadmCurrentFormId);
  if(!f) return;
  const responses = getFormResponses(fadmCurrentFormId);
  if(!responses.length) return toast("No responses to export.", true);

  const fields = f.fields || [];
  const escCsv = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Submitted', ...fields.map(fl => fl.label)];
  const rows = responses.map(r => [
    new Date(r.submittedAt).toLocaleString(),
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
