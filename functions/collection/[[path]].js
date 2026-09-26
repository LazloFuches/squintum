// ============================================================
// Art Collection - Single Router
// All routes for /collection/* handled here.
// ============================================================

// --- UTILITIES ---

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function parseCookies(header) {
  const cookies = {};
  (header || '').split(';').forEach(pair => {
    const [name, ...rest] = pair.trim().split('=');
    if (name) cookies[name] = rest.join('=');
  });
  return cookies;
}

function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

function redirect(path, cookie) {
  const headers = { 'Location': path };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(null, { status: 302, headers });
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

async function getFormData(request) {
  const text = await request.text();
  const params = new URLSearchParams(text);
  const data = {};
  for (const [key, value] of params) {
    if (key in data) {
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }
  return data;
}

async function hashPassword(password) {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  const hash = Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt, b => b.toString(16).padStart(2, '0')).join('');
  return saltHex + ':' + hash;
}

async function verifyPassword(password, stored) {
  const [saltHex, expectedHash] = stored.split(':');
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  const hash = Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
  return hash === expectedHash;
}

function jsonParse(str, fallback) {
  try { return JSON.parse(str || '[]'); } catch { return fallback || []; }
}

// --- EMAIL ---

async function sendEmail(env, to, subject, html) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Collection <noreply@squintum.com>',
      to: [to],
      subject,
      html
    })
  });
  return res.ok;
}

// --- PAGE SHELL ---

function pageShell(title, content, user) {
  const adminLink = user && user.role === 'admin'
    ? '<a href="/collection/admin" class="nav-admin">Admin</a>' : '';
  const userNav = user
    ? `<div class="nav-user">
        ${adminLink}
        <form method="POST" action="/collection/logout" class="inline-form">
          <button type="submit" class="nav-logout">Sign out</button>
        </form>
      </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)}</title>
<link rel="stylesheet" href="/collection/style.css">
</head>
<body>
<nav class="site-nav">
  <div class="nav-inner">
    <div class="nav-left">
      <a href="/" class="nav-parent">Squintum's</a>
      <a href="/collection/" class="site-title">Collection</a>
    </div>
    ${userNav}
  </div>
</nav>
<div class="hero-spacer"></div>
${content}
<footer>
  <div class="page-container">
    <p>Private Collection</p>
  </div>
</footer>
</body>
</html>`;
}

function authShell(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)}</title>
<link rel="stylesheet" href="/collection/style.css">
</head>
<body>
<div class="auth-screen">
  <div class="auth-box">
    ${content}
  </div>
</div>
</body>
</html>`;
}

// --- AUTH PAGES ---

function loginPage(error) {
  return authShell('Sign In - Collection', `
    <h1>Private Collection</h1>
    <p class="auth-subtitle">Sign in to continue</p>
    ${error ? `<div class="auth-error">${esc(error)}</div>` : ''}
    <form method="POST" action="/collection/login">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autocomplete="email">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required autocomplete="current-password">
      <button type="submit">Sign In</button>
    </form>
    <a href="/collection/forgot-password" class="auth-link">Forgot password?</a>
  `);
}

function forgotPage(error, success) {
  return authShell('Forgot Password - Collection', `
    <h1>Forgot Password</h1>
    <p class="auth-subtitle">Enter your email to receive a reset link</p>
    ${error ? `<div class="auth-error">${esc(error)}</div>` : ''}
    ${success ? `<div class="auth-success">${esc(success)}</div>` : `
    <form method="POST" action="/collection/forgot-password">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autocomplete="email">
      <button type="submit">Send Reset Link</button>
    </form>`}
    <a href="/collection/login" class="auth-link">Back to sign in</a>
  `);
}

function resetPage(token, error, success) {
  return authShell('Reset Password - Collection', `
    <h1>Reset Password</h1>
    ${error ? `<div class="auth-error">${esc(error)}</div>` : ''}
    ${success ? `<div class="auth-success">${esc(success)}</div><a href="/collection/login" class="auth-link">Sign in</a>` : `
    <form method="POST" action="/collection/reset-password">
      <input type="hidden" name="token" value="${esc(token)}">
      <label for="password">New Password</label>
      <input type="password" id="password" name="password" required minlength="8" autocomplete="new-password">
      <label for="confirm">Confirm Password</label>
      <input type="password" id="confirm" name="confirm" required minlength="8" autocomplete="new-password">
      <button type="submit">Reset Password</button>
    </form>`}
  `);
}

// --- COLLECTION PAGES ---

function gridPage(artworks, user) {
  let cards = '';
  for (const w of artworks) {
    const images = jsonParse(w.images_json);
    const hasImage = images.length > 0;
    const placeholder = w.is_placeholder ? '<span class="badge-placeholder">In progress</span>' : '';

    cards += `
      <a href="/collection/${esc(w.slug)}" class="work-card${w.is_placeholder ? ' is-placeholder' : ''}">
        <div class="card-image${hasImage ? '' : ' no-image'}">
          ${hasImage ? `<img src="${esc(images[0].src)}" alt="${esc(images[0].alt)}" loading="lazy">` : 'Image pending'}
        </div>
        <div class="card-info">
          ${w.category ? `<div class="card-category">${esc(w.category)}</div>` : ''}
          <h2>${esc(w.title)}</h2>
          ${w.artist ? `<div class="card-artist">${esc(w.artist)}</div>` : ''}
          ${w.date_text ? `<div class="card-date">${esc(w.date_text)}</div>` : ''}
          ${placeholder}
        </div>
      </a>`;
  }

  return pageShell('Collection', `
    <main class="page-container">
      <header class="collection-header">
        <h1>Collection</h1>
        <div class="subtitle">${artworks.length} works</div>
      </header>
      <div class="work-grid">${cards}</div>
    </main>`, user);
}

function detailPage(artwork, prev, next, user) {
  const images = jsonParse(artwork.images_json);
  const specs = jsonParse(artwork.specs_json);
  const provenance = jsonParse(artwork.provenance_json);

  const mainImg = images.length > 0
    ? `<img src="${esc(images[0].src)}" alt="${esc(images[0].alt)}" id="main-image">`
    : '<p class="no-image-message">Image pending</p>';

  let thumbs = '';
  if (images.length > 1) {
    thumbs = '<div class="gallery-thumbs">';
    images.forEach((img, i) => {
      thumbs += `<img src="${esc(img.src)}" alt="${esc(img.alt)}" onclick="setMainImage(this)" class="${i === 0 ? 'active' : ''}">`;
    });
    thumbs += '</div>';
  }

  let specsHtml = '';
  if (specs.length) {
    specsHtml = '<div class="section-label">Specifications</div><dl class="specs-table">';
    for (const s of specs) {
      specsHtml += `<div class="spec-row"><dt class="spec-label">${esc(s.label)}</dt><dd class="spec-value">${esc(s.value)}</dd></div>`;
    }
    specsHtml += '</dl>';
  }

  let provHtml = '';
  if (provenance.length) {
    provHtml = '<div class="section-label">Provenance</div><ol class="provenance-list">';
    for (const p of provenance) {
      provHtml += `<li>${esc(p)}</li>`;
    }
    provHtml += '</ol>';
  }

  let descHtml = '';
  if (artwork.description) {
    descHtml = '<div class="section-label">Description</div><div class="detail-text">';
    artwork.description.split('\n\n').forEach(p => {
      if (p.trim()) descHtml += `<p>${esc(p.trim())}</p>`;
    });
    descHtml += '</div>';
  }

  let condHtml = '';
  if (artwork.condition_text) {
    condHtml = `<div class="section-label">Condition</div><div class="detail-text"><p>${esc(artwork.condition_text)}</p></div>`;
  }

  let notesHtml = '';
  if (artwork.notes) {
    notesHtml = `<div class="section-label">Notes</div><div class="detail-text"><p>${esc(artwork.notes)}</p></div>`;
  }

  const artistLine = artwork.artist ? `<div class="detail-artist">${esc(artwork.artist)}</div>` : '';
  const placeholderBanner = artwork.is_placeholder
    ? '<div class="placeholder-banner">Documentation in progress</div>' : '';

  let navHtml = '';
  if (prev || next) {
    navHtml = '<nav class="detail-nav">';
    navHtml += prev
      ? `<a href="/collection/${esc(prev.slug)}"><span class="nav-label">Previous</span><span class="nav-title">${esc(prev.title)}</span></a>`
      : '<span></span>';
    navHtml += next
      ? `<a href="/collection/${esc(next.slug)}" class="nav-next"><span class="nav-label">Next</span><span class="nav-title">${esc(next.title)}</span></a>`
      : '<span></span>';
    navHtml += '</nav>';
  }

  const editLink = user && user.role === 'admin'
    ? `<a href="/collection/admin/edit/${esc(artwork.slug)}" class="edit-link">Edit</a>` : '';

  return pageShell(`${artwork.title} - Collection`, `
    <main class="page-container">
      ${placeholderBanner}
      <article>
        <header class="detail-hero">
          <div class="breadcrumb">
            <a href="/collection/">Collection</a> &rsaquo; ${esc(artwork.category || 'Uncategorized')}
          </div>
          <h1>${esc(artwork.title)}</h1>
          ${artwork.date_text ? `<div class="detail-date">${esc(artwork.date_text)}</div>` : ''}
          ${artistLine}
          ${editLink}
        </header>

        <div class="gallery">
          <div class="gallery-main${images.length ? ' zoomable' : ''}">${mainImg}</div>
          ${thumbs}
        </div>

        <div class="detail-content">
          <div class="content-left">
            ${descHtml}
            ${condHtml}
            ${notesHtml}
          </div>
          <div class="content-right">
            ${specsHtml}
            ${provHtml}
          </div>
        </div>

        ${navHtml}
      </article>
    </main>
    <script src="/collection/zoom.js"></script>
    <script>
    function setMainImage(thumb) {
      var main = document.getElementById('main-image');
      if (main) { main.src = thumb.src; main.alt = thumb.alt; }
      document.querySelectorAll('.gallery-thumbs img').forEach(function(t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    }
    </script>`, user);
}

// --- ADMIN PAGES ---

function adminPage(users, artworks, user, msg) {
  let userRows = '';
  for (const u of users) {
    const isSelf = u.id === user.id;
    userRows += `<tr>
      <td>${esc(u.email)}</td>
      <td>${esc(u.name)}</td>
      <td>${esc(u.role)}</td>
      <td>${esc(u.created_at?.slice(0, 10) || '')}</td>
      <td>${isSelf ? '' : `<form method="POST" action="/collection/admin/delete-user" class="inline-form">
        <input type="hidden" name="user_id" value="${u.id}">
        <button type="submit" class="btn-danger" onclick="return confirm('Revoke access for ${esc(u.email)}?')">Revoke</button>
      </form>`}</td>
    </tr>`;
  }

  let artworkRows = '';
  for (const a of artworks) {
    artworkRows += `<tr>
      <td>${a.sort_order}</td>
      <td>${esc(a.title)}</td>
      <td>${esc(a.artist || '')}</td>
      <td>${a.is_placeholder ? '<span class="badge-placeholder">Placeholder</span>' : 'Complete'}</td>
      <td><a href="/collection/admin/edit/${esc(a.slug)}">Edit</a></td>
    </tr>`;
  }

  return pageShell('Admin - Collection', `
    <main class="page-container admin-page">
      ${msg ? `<div class="admin-msg">${esc(msg)}</div>` : ''}
      <h1>Admin</h1>

      <section class="admin-section">
        <div class="section-header">
          <h2>Users</h2>
          <a href="/collection/admin/invite" class="btn-primary">Invite User</a>
        </div>
        <table class="admin-table">
          <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Created</th><th></th></tr></thead>
          <tbody>${userRows}</tbody>
        </table>
      </section>

      <section class="admin-section">
        <h2>Artworks</h2>
        <table class="admin-table">
          <thead><tr><th>#</th><th>Title</th><th>Artist</th><th>Status</th><th></th></tr></thead>
          <tbody>${artworkRows}</tbody>
        </table>
      </section>
    </main>`, user);
}

function invitePage(user, error, success) {
  return pageShell('Invite User - Collection', `
    <main class="page-container admin-page">
      <h1>Invite User</h1>
      ${error ? `<div class="auth-error">${esc(error)}</div>` : ''}
      ${success ? `<div class="auth-success">${esc(success)}</div>` : ''}
      <form method="POST" action="/collection/admin/invite" class="admin-form">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
        <label for="role">Role</label>
        <select id="role" name="role">
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" class="btn-primary">Send Invitation</button>
      </form>
      <a href="/collection/admin" class="back-link">Back to admin</a>
    </main>`, user);
}

function editPage(artwork, user, success) {
  const images = jsonParse(artwork.images_json);
  const specs = jsonParse(artwork.specs_json);
  const provenance = jsonParse(artwork.provenance_json);

  let imageFields = '';
  images.forEach((img, i) => {
    imageFields += `
      <div class="repeatable-row">
        <input type="text" name="img_src" value="${esc(img.src)}" placeholder="Path (e.g. /collection/images/slug/photo.jpg)">
        <input type="text" name="img_alt" value="${esc(img.alt)}" placeholder="Alt text">
      </div>`;
  });
  imageFields += `
    <div class="repeatable-row">
      <input type="text" name="img_src" value="" placeholder="Path (e.g. /collection/images/slug/photo.jpg)">
      <input type="text" name="img_alt" value="" placeholder="Alt text">
    </div>`;

  let specFields = '';
  specs.forEach((s, i) => {
    specFields += `
      <div class="repeatable-row">
        <input type="text" name="spec_label" value="${esc(s.label)}" placeholder="Label">
        <input type="text" name="spec_value" value="${esc(s.value)}" placeholder="Value">
      </div>`;
  });
  specFields += `
    <div class="repeatable-row">
      <input type="text" name="spec_label" value="" placeholder="Label">
      <input type="text" name="spec_value" value="" placeholder="Value">
    </div>`;

  let provFields = '';
  provenance.forEach((p, i) => {
    provFields += `
      <div class="repeatable-row">
        <input type="text" name="provenance" value="${esc(p)}" placeholder="e.g. 2016: Christie's, New York, April 12">
      </div>`;
  });
  provFields += `
    <div class="repeatable-row">
      <input type="text" name="provenance" value="" placeholder="e.g. 2016: Christie's, New York, April 12">
    </div>`;

  return pageShell(`Edit: ${artwork.title} - Collection`, `
    <main class="page-container admin-page">
      <h1>Edit: ${esc(artwork.title)}</h1>
      ${success ? '<div class="auth-success">Changes saved.</div>' : ''}
      <form method="POST" action="/collection/admin/edit/${esc(artwork.slug)}" class="admin-form edit-form">

        <fieldset>
          <legend>Basic Info</legend>
          <label for="title">Title</label>
          <input type="text" id="title" name="title" value="${esc(artwork.title)}" required>
          <label for="artist">Artist</label>
          <input type="text" id="artist" name="artist" value="${esc(artwork.artist)}">
          <label for="category">Category</label>
          <input type="text" id="category" name="category" value="${esc(artwork.category)}" placeholder="e.g. Ancient Greek, Contemporary, Works on Paper">
          <label for="date_text">Date</label>
          <input type="text" id="date_text" name="date_text" value="${esc(artwork.date_text)}">
          <label for="period">Period</label>
          <input type="text" id="period" name="period" value="${esc(artwork.period)}">
          <label for="medium">Medium</label>
          <input type="text" id="medium" name="medium" value="${esc(artwork.medium)}">
          <label for="dimensions">Dimensions</label>
          <input type="text" id="dimensions" name="dimensions" value="${esc(artwork.dimensions)}">
        </fieldset>

        <fieldset>
          <legend>Description</legend>
          <textarea name="description" rows="8">${esc(artwork.description)}</textarea>
        </fieldset>

        <fieldset>
          <legend>Condition</legend>
          <textarea name="condition_text" rows="4">${esc(artwork.condition_text)}</textarea>
        </fieldset>

        <fieldset>
          <legend>Notes</legend>
          <textarea name="notes" rows="3">${esc(artwork.notes)}</textarea>
        </fieldset>

        <fieldset>
          <legend>Images</legend>
          <p class="field-help">One image per row. Leave empty rows blank to skip. Add images by committing files to /collection/images/ in the repo.</p>
          ${imageFields}
        </fieldset>

        <fieldset>
          <legend>Specifications</legend>
          <p class="field-help">Label/value pairs. Leave empty rows blank to skip.</p>
          ${specFields}
        </fieldset>

        <fieldset>
          <legend>Provenance</legend>
          <p class="field-help">One entry per row, oldest first. Leave empty rows blank to skip.</p>
          ${provFields}
        </fieldset>

        <fieldset>
          <legend>Status</legend>
          <label class="checkbox-label">
            <input type="checkbox" name="is_placeholder" value="1" ${artwork.is_placeholder ? 'checked' : ''}>
            Mark as placeholder (documentation in progress)
          </label>
        </fieldset>

        <button type="submit" class="btn-primary">Save Changes</button>
      </form>
      <a href="/collection/admin" class="back-link">Back to admin</a>
    </main>`, user);
}

// --- AUTH HANDLERS ---

async function handleLogin(context) {
  const method = context.request.method;
  if (method === 'GET') return htmlResponse(loginPage());

  const form = await getFormData(context.request);
  const { email, password } = form;
  if (!email || !password) return htmlResponse(loginPage('Email and password are required.'));

  const db = context.env.DB;
  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase().trim()).first();
  if (!user) return htmlResponse(loginPage('Invalid email or password.'));

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return htmlResponse(loginPage('Invalid email or password.'));

  const token = generateToken();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, user.id, expires).run();

  return redirect('/collection/', `collection_session=${token}; Path=/collection; Max-Age=${30 * 24 * 3600}; HttpOnly; Secure; SameSite=Lax`);
}

async function handleLogout(context) {
  const cookies = parseCookies(context.request.headers.get('Cookie') || '');
  const token = cookies['collection_session'];
  if (token) {
    await context.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
  }
  return redirect('/collection/login', 'collection_session=; Path=/collection; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
}

async function handleForgotPassword(context) {
  const method = context.request.method;
  if (method === 'GET') return htmlResponse(forgotPage());

  const form = await getFormData(context.request);
  const email = (form.email || '').toLowerCase().trim();
  if (!email) return htmlResponse(forgotPage('Please enter your email.'));

  const db = context.env.DB;
  const user = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();

  if (user) {
    const token = generateToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await db.prepare('DELETE FROM password_resets WHERE user_id = ?').bind(user.id).run();
    await db.prepare('INSERT INTO password_resets (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, user.id, expires).run();

    const url = new URL(context.request.url);
    const resetLink = `${url.origin}/collection/reset-password?token=${token}`;
    await sendEmail(context.env, email, 'Password Reset - Collection', `
      <p>You requested a password reset for your Collection account.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
    `);
  }

  return htmlResponse(forgotPage(null, 'If that email is registered, a reset link has been sent.'));
}

async function handleResetPassword(context) {
  const method = context.request.method;
  const url = new URL(context.request.url);

  if (method === 'GET') {
    const token = url.searchParams.get('token');
    if (!token) return htmlResponse(resetPage('', 'Invalid or missing reset token.'));
    return htmlResponse(resetPage(token));
  }

  const form = await getFormData(context.request);
  const { token, password, confirm } = form;

  if (!token) return htmlResponse(resetPage('', 'Invalid reset token.'));
  if (!password || password.length < 8) return htmlResponse(resetPage(token, 'Password must be at least 8 characters.'));
  if (password !== confirm) return htmlResponse(resetPage(token, 'Passwords do not match.'));

  const db = context.env.DB;
  const reset = await db.prepare('SELECT * FROM password_resets WHERE token = ?').bind(token).first();
  if (!reset || new Date(reset.expires_at) < new Date()) {
    if (reset) await db.prepare('DELETE FROM password_resets WHERE token = ?').bind(token).run();
    return htmlResponse(resetPage('', 'This reset link has expired. Please request a new one.'));
  }

  const hash = await hashPassword(password);
  await db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(hash, reset.user_id).run();
  await db.prepare('DELETE FROM password_resets WHERE user_id = ?').bind(reset.user_id).run();
  await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(reset.user_id).run();

  return htmlResponse(resetPage('', null, 'Your password has been reset.'));
}

// --- PAGE HANDLERS ---

async function handleGrid(context) {
  const db = context.env.DB;
  const { results } = await db.prepare('SELECT * FROM artworks ORDER BY sort_order').all();
  return htmlResponse(gridPage(results, context.data.user));
}

async function handleDetail(context, slug) {
  const db = context.env.DB;
  const artwork = await db.prepare('SELECT * FROM artworks WHERE slug = ?').bind(slug).first();
  if (!artwork) return context.next();

  const { results: all } = await db.prepare('SELECT slug, title, sort_order FROM artworks ORDER BY sort_order').all();
  const idx = all.findIndex(a => a.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return htmlResponse(detailPage(artwork, prev, next, context.data.user));
}

// --- ADMIN HANDLERS ---

async function handleAdmin(context) {
  if (context.data.user?.role !== 'admin') return redirect('/collection/');

  const db = context.env.DB;
  const url = new URL(context.request.url);
  const msg = url.searchParams.get('msg');
  const { results: users } = await db.prepare('SELECT * FROM users ORDER BY created_at').all();
  const { results: artworks } = await db.prepare('SELECT * FROM artworks ORDER BY sort_order').all();
  return htmlResponse(adminPage(users, artworks, context.data.user, msg));
}

async function handleInvite(context) {
  if (context.data.user?.role !== 'admin') return redirect('/collection/');
  const method = context.request.method;

  if (method === 'GET') return htmlResponse(invitePage(context.data.user));

  const form = await getFormData(context.request);
  const email = (form.email || '').toLowerCase().trim();
  const name = (form.name || '').trim();
  const role = form.role === 'admin' ? 'admin' : 'viewer';

  if (!email || !name) return htmlResponse(invitePage(context.data.user, 'Email and name are required.'));

  const db = context.env.DB;
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return htmlResponse(invitePage(context.data.user, 'A user with that email already exists.'));

  const tempPassword = generateToken().slice(0, 12);
  const hash = await hashPassword(tempPassword);
  await db.prepare('INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)').bind(email, name, hash, role).run();

  const url = new URL(context.request.url);
  const loginUrl = `${url.origin}/collection/login`;
  await sendEmail(context.env, email, 'Collection Access', `
    <p>You have been invited to access the private art collection at Squintum's.</p>
    <p><strong>Email:</strong> ${email}<br>
    <strong>Temporary Password:</strong> ${tempPassword}</p>
    <p><a href="${loginUrl}">Sign in here</a></p>
    <p>Please change your password after signing in.</p>
  `);

  return htmlResponse(invitePage(context.data.user, null, `Invitation sent to ${email}.`));
}

async function handleDeleteUser(context) {
  if (context.data.user?.role !== 'admin') return redirect('/collection/');
  const form = await getFormData(context.request);
  const userId = parseInt(form.user_id);

  if (userId === context.data.user.id) return redirect('/collection/admin?msg=Cannot+revoke+your+own+access');

  const db = context.env.DB;
  await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId).run();
  await db.prepare('DELETE FROM password_resets WHERE user_id = ?').bind(userId).run();
  await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

  return redirect('/collection/admin?msg=User+access+revoked');
}

async function handleEditArtwork(context, slug) {
  if (context.data.user?.role !== 'admin') return redirect('/collection/');
  const method = context.request.method;
  const db = context.env.DB;

  const artwork = await db.prepare('SELECT * FROM artworks WHERE slug = ?').bind(slug).first();
  if (!artwork) return redirect('/collection/admin?msg=Artwork+not+found');

  if (method === 'GET') {
    const url = new URL(context.request.url);
    const success = url.searchParams.get('saved') === '1';
    return htmlResponse(editPage(artwork, context.data.user, success));
  }

  const form = await getFormData(context.request);

  const imgSrcs = Array.isArray(form.img_src) ? form.img_src : (form.img_src ? [form.img_src] : []);
  const imgAlts = Array.isArray(form.img_alt) ? form.img_alt : (form.img_alt ? [form.img_alt] : []);
  const images = [];
  for (let i = 0; i < imgSrcs.length; i++) {
    if (imgSrcs[i]?.trim()) images.push({ src: imgSrcs[i].trim(), alt: (imgAlts[i] || '').trim() });
  }

  const specLabels = Array.isArray(form.spec_label) ? form.spec_label : (form.spec_label ? [form.spec_label] : []);
  const specValues = Array.isArray(form.spec_value) ? form.spec_value : (form.spec_value ? [form.spec_value] : []);
  const specs = [];
  for (let i = 0; i < specLabels.length; i++) {
    if (specLabels[i]?.trim()) specs.push({ label: specLabels[i].trim(), value: (specValues[i] || '').trim() });
  }

  const provEntries = Array.isArray(form.provenance) ? form.provenance : (form.provenance ? [form.provenance] : []);
  const provenance = provEntries.filter(p => p?.trim()).map(p => p.trim());

  await db.prepare(`
    UPDATE artworks SET
      title = ?, artist = ?, category = ?, date_text = ?, period = ?,
      medium = ?, dimensions = ?, description = ?, condition_text = ?,
      notes = ?, is_placeholder = ?, images_json = ?, specs_json = ?,
      provenance_json = ?, updated_at = datetime('now')
    WHERE slug = ?
  `).bind(
    form.title || artwork.title,
    form.artist || '',
    form.category || '',
    form.date_text || '',
    form.period || '',
    form.medium || '',
    form.dimensions || '',
    form.description || '',
    form.condition_text || '',
    form.notes || '',
    form.is_placeholder ? 1 : 0,
    JSON.stringify(images),
    JSON.stringify(specs),
    JSON.stringify(provenance),
    slug
  ).run();

  return redirect(`/collection/admin/edit/${slug}?saved=1`);
}

// --- ROUTER ---

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const segments = context.params.path || [];
  const path = segments.join('/');
  const method = context.request.method;

  if (/\.(css|js|jpg|jpeg|png|gif|svg|ico|webp|woff2?|pdf|map)$/i.test(path)) {
    return context.next();
  }

  switch (path) {
    case '':
      return handleGrid(context);
    case 'login':
      return handleLogin(context);
    case 'logout':
      if (method !== 'POST') return redirect('/collection/');
      return handleLogout(context);
    case 'forgot-password':
      return handleForgotPassword(context);
    case 'reset-password':
      return handleResetPassword(context);
    case 'admin':
      return handleAdmin(context);
    case 'admin/invite':
      return handleInvite(context);
    case 'admin/delete-user':
      if (method !== 'POST') return redirect('/collection/admin');
      return handleDeleteUser(context);
    default:
      if (path.startsWith('admin/edit/')) {
        const slug = path.replace('admin/edit/', '');
        return handleEditArtwork(context, slug);
      }
      return handleDetail(context, path);
  }
}
