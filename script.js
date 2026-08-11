document.addEventListener('DOMContentLoaded', function () {
  var sidebar = document.querySelector('.sidebar');
  var backdrop = document.querySelector('.sidebar-backdrop');
  var toggle = document.querySelector('.menu-toggle');

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeSidebar);
  });
});

/* ==========================================================================
   Shared feedback storage — backed by Firebase Firestore
   Feedback starts empty. It only appears once someone actually submits
   a response through a survey (see respond.html). Firestore keeps it in
   sync in real time across every device/browser, not just the one that
   submitted it. Requires firebase-config.js + the Firebase SDK scripts to
   be loaded on the page before this file (see respond.html / feedback.html).
   ========================================================================== */

var FP_COLLECTION = 'feedback';

// Adds a response. Returns a Promise that resolves once it's saved.
function fpAddFeedback(entry) {
  if (typeof db === 'undefined') {
    return Promise.reject(new Error('Firestore is not configured. Check firebase-config.js.'));
  }
  entry.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  return db.collection(FP_COLLECTION).add(entry);
}

// Subscribes to live updates. Calls callback(list) immediately and again
// every time feedback changes anywhere (any device). Returns an unsubscribe
// function you can call to stop listening (e.g. on page unload).
//
// If ownerId is passed, only feedback tagged with that account's uid is
// included (feedback gets tagged automatically based on which account
// published the survey it came from — see respond.html). Filtering happens
// client-side after the snapshot so no Firestore composite index is needed.
function fpListenFeedback(callback, ownerId) {
  if (typeof db === 'undefined') {
    callback([]);
    return function () {};
  }
  return db.collection(FP_COLLECTION)
    .orderBy('createdAt', 'desc')
    .onSnapshot(function (snapshot) {
      var list = snapshot.docs.map(function (doc) {
        var data = doc.data();
        data.id = doc.id;
        return data;
      });
      if (ownerId) {
        list = list.filter(function (item) { return item.ownerId === ownerId; });
      }
      callback(list);
    }, function (err) {
      console.error('Feedback listener error:', err);
      callback([]);
    });
}

// Resolves the best available JS Date for a feedback item: prefers the
// server-confirmed Firestore timestamp, falls back to the display date
// string if the write hasn't been confirmed by the server yet.
function fpItemDate(item) {
  if (item.createdAt && typeof item.createdAt.toDate === 'function') return item.createdAt.toDate();
  if (item.date) {
    var d = new Date(item.date);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

// True if the given feedback item's date falls on today's calendar date
// (local time). Used to build "today only" dashboard previews that
// naturally reset every day without any extra scheduling logic.
function fpIsToday(item) {
  var d = fpItemDate(item);
  if (!d) return false;
  var now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function fpFormatDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fpInitials(name) {
  var parts = name.trim().split(/\s+/);
  var initials = parts.slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
  return initials || 'A';
}

function fpStarsHtml(rating) {
  var full = '★'.repeat(rating);
  var empty = rating < 5 ? '<span class="off">' + '★'.repeat(5 - rating) + '</span>' : '';
  return full + empty;
}

/* ==========================================================================
   Auth guard + account menu
   Call fpRequireAuth(callback) on any page that should only be visible to
   logged-in users. It redirects to index.html if nobody's signed in, and
   otherwise fills in the avatar initials + account dropdown (name, email,
   Settings link, Log Out) with the real signed-in user's profile, pulled
   from Firestore (users/{uid}) where company/job title are stored.
   Requires firebase-app-compat.js, firebase-auth-compat.js,
   firebase-firestore-compat.js, and firebase-config.js loaded first.
   ========================================================================== */

function fpRequireAuth(onReady) {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.warn('Firebase Auth scripts are not loaded on this page.');
    return;
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    var profile = { fullName: user.displayName || '', email: user.email || '', company: '', jobTitle: '' };

    function finish() {
      fpSetupAccountMenu(user, profile);
      if (onReady) onReady(user, profile);
    }

    if (typeof db !== 'undefined') {
      db.collection('users').doc(user.uid).get()
        .then(function (doc) { if (doc.exists) Object.assign(profile, doc.data()); })
        .catch(function () { /* fall back to auth-only profile */ })
        .then(finish);
    } else {
      finish();
    }
  });
}

function fpSetupAccountMenu(user, profile) {
  var name = profile.fullName || user.email || 'Account';
  var initials = fpInitials(name);

  var initialsEls = document.querySelectorAll('[data-account="initials"]');
  initialsEls.forEach(function (el) { el.textContent = initials; });

  var nameEl = document.getElementById('accountMenuName');
  var emailEl = document.getElementById('accountMenuEmail');
  if (nameEl) nameEl.textContent = name;
  if (emailEl) emailEl.textContent = profile.email || user.email || '';

  var avatarBtn = document.getElementById('avatarBtn');
  var menu = document.getElementById('accountMenu');
  if (avatarBtn && menu) {
    avatarBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', function () {
      menu.classList.remove('open');
    });
    menu.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      firebase.auth().signOut().then(function () {
        window.location.href = 'index.html';
      });
    });
  }
}