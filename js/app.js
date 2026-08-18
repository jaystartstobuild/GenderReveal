/**
 * Gender Reveal Party Main Application Logic
 * Event: September 5, 2026, 5:30 PM PDT
 * Location: 15807 134 Ave E. South Hill, WA 98374
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CONSTANTS & EVENT DETAILS
  // ==========================================
  const EVENT_DATE = new Date('2026-09-05T17:30:00-07:00');
  const EVENT_TITLE = 'Gender Reveal Party - What Will Baby Be?';
  const EVENT_LOCATION = '15807 134 Ave E. South Hill, WA 98374';
  const EVENT_DETAILS = "Please join us for our Gender Reveal Party! What will baby be? Pink or Blue! Dress code: Blue or Pink.";

  // Google Sheets Webhook Integration
  const GOOGLE_SCRIPT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzrvBs4YCKUIVv1XN-hysmu5Xna_jsqFQmud76HsMs2DmyuPLFw8jMMJ9LVeO18fTzk6w/exec';

  // LocalStorage Keys
  const STORAGE_KEY_RSVPS = 'gr_party_rsvps_v2';
  const STORAGE_KEY_POLL = 'gr_party_poll_v2';
  const STORAGE_KEY_WISHES = 'gr_party_wishes_v2';
  const STORAGE_KEY_USER_VOTE = 'gr_user_voted_team_v2';

  // ==========================================
  // 2. LIVE COUNTDOWN TIMER
  // ==========================================
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = EVENT_DATE.getTime() - now;

    if (distance <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 3. 3D CARD PARALLAX TILT EFFECT
  // ==========================================
  const tiltCard = document.getElementById('tilt-card');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  // ==========================================
  // 4. AUDIO TOGGLE & SOUND FX
  // ==========================================
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      if (window.soundEffects) {
        const isPlaying = window.soundEffects.toggleAmbient();
        btnAudioToggle.innerHTML = isPlaying ? '🔊' : '🎵';
        btnAudioToggle.style.color = isPlaying ? 'var(--gold-600)' : 'var(--text-muted)';
        showToast(isPlaying ? '🎵 Playing soft ambient melody' : '🔇 Ambient audio paused');
      }
    });
  }

  // ==========================================
  // 5. CALENDAR & LOCATION ACTIONS
  // ==========================================
  function openGoogleCalendar() {
    const startTime = '20260906T003000Z'; // 5:30 PM PDT is 00:30 UTC next day
    const endTime = '20260906T033000Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_TITLE)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(EVENT_DETAILS)}&location=${encodeURIComponent(EVENT_LOCATION)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function downloadIcsCalendar() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Gender Reveal Celebration//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:' + EVENT_TITLE,
      'DESCRIPTION:' + EVENT_DETAILS,
      'LOCATION:' + EVENT_LOCATION,
      'DTSTART:20260906T003000Z',
      'DTEND:20260906T033000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Gender_Reveal_Party_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📅 Calendar invite (.ics) downloaded!');
  }

  const btnGoogleCal = document.getElementById('btn-google-cal');
  const btnIcalDl = document.getElementById('btn-ical-dl');
  const heroAddCal = document.getElementById('hero-add-calendar-btn');
  const btnSuccessCal = document.getElementById('btn-success-calendar');
  const flankBtnCal = document.getElementById('flank-btn-cal');

  if (btnGoogleCal) btnGoogleCal.addEventListener('click', openGoogleCalendar);
  if (btnIcalDl) btnIcalDl.addEventListener('click', downloadIcsCalendar);
  if (heroAddCal) heroAddCal.addEventListener('click', openGoogleCalendar);
  if (btnSuccessCal) btnSuccessCal.addEventListener('click', openGoogleCalendar);
  if (flankBtnCal) flankBtnCal.addEventListener('click', openGoogleCalendar);

  // Copy Address Button
  const btnCopyAddress = document.getElementById('btn-copy-address');
  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(EVENT_LOCATION);
        showToast('📍 Address copied to clipboard!');
        if (window.soundEffects) window.soundEffects.playSparkle();
      } catch (err) {
        showToast(`Address: ${EVENT_LOCATION}`);
      }
    });
  }

  // ==========================================
  // 6. INTERACTIVE PREDICTION POLL SYSTEM
  // ==========================================
  function getPollData() {
    const saved = localStorage.getItem(STORAGE_KEY_POLL);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return { pink: 0, blue: 0 };
  }

  function savePollData(data) {
    localStorage.setItem(STORAGE_KEY_POLL, JSON.stringify(data));
    renderPoll();
  }

  function renderPoll() {
    const data = getPollData();
    const total = data.pink + data.blue;
    let pinkPct = 50;
    let bluePct = 50;
    if (total > 0) {
      pinkPct = Math.round((data.pink / total) * 100);
      bluePct = 100 - pinkPct;
    }

    const pinkLabel = document.getElementById('poll-pink-label');
    const blueLabel = document.getElementById('poll-blue-label');
    const barPink = document.getElementById('poll-bar-pink');
    const barBlue = document.getElementById('poll-bar-blue');

    if (pinkLabel) {
      pinkLabel.innerHTML = total > 0 
        ? `🎀 Team Girl: ${pinkPct}% (${data.pink} votes)` 
        : `🎀 Team Girl (${data.pink} votes)`;
    }
    if (blueLabel) {
      blueLabel.innerHTML = total > 0 
        ? `Team Boy: ${bluePct}% (${data.blue} votes) 🧸` 
        : `Team Boy (${data.blue} votes) 🧸`;
    }

    if (barPink) barPink.style.width = `${pinkPct}%`;
    if (barBlue) barBlue.style.width = `${bluePct}%`;

    // Check if user has already voted to disable duplicate voting
    const userVoted = localStorage.getItem(STORAGE_KEY_USER_VOTE);
    const btnQuickPink = document.getElementById('btn-quick-pink');
    const btnQuickBlue = document.getElementById('btn-quick-blue');

    if (btnQuickPink && btnQuickBlue) {
      if (userVoted === 'Pink') {
        btnQuickPink.innerHTML = '<span>🎀</span> ✓ You Voted Team Girl!';
        btnQuickPink.style.opacity = '1';
        btnQuickPink.style.borderColor = '#d85a85';
        btnQuickPink.style.cursor = 'default';
        btnQuickPink.disabled = true;

        btnQuickBlue.innerHTML = '<span>🧸</span> Team Boy';
        btnQuickBlue.style.opacity = '0.5';
        btnQuickBlue.style.cursor = 'not-allowed';
        btnQuickBlue.disabled = true;
      } else if (userVoted === 'Blue') {
        btnQuickBlue.innerHTML = '<span>🧸</span> ✓ You Voted Team Boy!';
        btnQuickBlue.style.opacity = '1';
        btnQuickBlue.style.borderColor = '#3880c9';
        btnQuickBlue.style.cursor = 'default';
        btnQuickBlue.disabled = true;

        btnQuickPink.innerHTML = '<span>🎀</span> Team Girl';
        btnQuickPink.style.opacity = '0.5';
        btnQuickPink.style.cursor = 'not-allowed';
        btnQuickPink.disabled = true;
      } else {
        btnQuickPink.innerHTML = '<span>🎀</span> Vote Team Pink (Girl)';
        btnQuickPink.style.opacity = '1';
        btnQuickPink.style.cursor = 'pointer';
        btnQuickPink.disabled = false;

        btnQuickBlue.innerHTML = '<span>🧸</span> Vote Team Blue (Boy)';
        btnQuickBlue.style.opacity = '1';
        btnQuickBlue.style.cursor = 'pointer';
        btnQuickBlue.disabled = false;
      }
    }

    // Admin stat updates if open
    const statPink = document.getElementById('stat-pink-votes');
    const statBlue = document.getElementById('stat-blue-votes');
    if (statPink) statPink.textContent = `${data.pink} Votes (${pinkPct}%)`;
    if (statBlue) statBlue.textContent = `${data.blue} Votes (${bluePct}%)`;
  }

  const btnQuickPink = document.getElementById('btn-quick-pink');
  const btnQuickBlue = document.getElementById('btn-quick-blue');

  if (btnQuickPink) {
    btnQuickPink.addEventListener('click', (e) => {
      if (localStorage.getItem(STORAGE_KEY_USER_VOTE)) {
        showToast('⚠️ You have already cast your vote!');
        return;
      }
      const data = getPollData();
      data.pink += 1;
      localStorage.setItem(STORAGE_KEY_USER_VOTE, 'Pink');
      savePollData(data);
      if (window.soundEffects) window.soundEffects.playVote('pink');
      if (window.confettiManager) window.confettiManager.burst(e.clientX, e.clientY, 50);
      showToast('🎀 You voted Team Pink (Girl)!');
    });
  }

  if (btnQuickBlue) {
    btnQuickBlue.addEventListener('click', (e) => {
      if (localStorage.getItem(STORAGE_KEY_USER_VOTE)) {
        showToast('⚠️ You have already cast your vote!');
        return;
      }
      const data = getPollData();
      data.blue += 1;
      localStorage.setItem(STORAGE_KEY_USER_VOTE, 'Blue');
      savePollData(data);
      if (window.soundEffects) window.soundEffects.playVote('blue');
      if (window.confettiManager) window.confettiManager.burst(e.clientX, e.clientY, 50);
      showToast('🧸 You voted Team Blue (Boy)!');
    });
  }

  renderPoll();

  // ==========================================
  // 7. DYNAMIC +1s AND FORM HANDLING
  // ==========================================
  const rsvpForm = document.getElementById('rsvp-form');
  const attendingStatusRadios = document.getElementsByName('rsvp_status');
  const attendingFieldsWrapper = document.getElementById('attending-fields-wrapper');
  const plusOnesRadios = document.getElementsByName('plus_ones_count');
  const plusOnesDetailsContainer = document.getElementById('plus-ones-details-container');
  const successBanner = document.getElementById('rsvp-success-banner');
  const btnEditRsvp = document.getElementById('btn-edit-rsvp');

  // Handle Attending vs Declined Toggle
  function handleStatusChange() {
    let status = 'attending';
    for (const r of attendingStatusRadios) {
      if (r.checked) status = r.value;
    }

    if (status === 'declined') {
      attendingFieldsWrapper.style.display = 'none';
      document.getElementById('btn-submit-form').innerHTML = '<span>💌</span> Send Regrets & Warm Wishes';
    } else {
      attendingFieldsWrapper.style.display = 'contents';
      document.getElementById('btn-submit-form').innerHTML = '<span>✨</span> Submit My RSVP & Vote';
    }
  }

  for (const r of attendingStatusRadios) {
    r.addEventListener('change', handleStatusChange);
  }

  // Handle Dynamic +1 inputs (Max 3)
  function renderPlusOnesInputs() {
    let count = 0;
    for (const r of plusOnesRadios) {
      if (r.checked) count = parseInt(r.value, 10);
    }

    plusOnesDetailsContainer.innerHTML = '';
    if (count === 0) return;

    const heading = document.createElement('div');
    heading.style.fontWeight = '600';
    heading.style.fontSize = '0.95rem';
    heading.style.marginTop = '0.5rem';
    heading.style.color = 'var(--gold-600)';
    heading.textContent = `✨ Please specify details for your ${count} guest(s):`;
    plusOnesDetailsContainer.appendChild(heading);

    for (let i = 1; i <= count; i++) {
      const card = document.createElement('div');
      card.className = 'guest-card-sub';
      card.innerHTML = `
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.85rem;">
            Guest #${i} Full Name <span class="required-star">*</span>
          </label>
          <input type="text" class="form-input sub-guest-name" placeholder="Guest #${i} Name" required>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.85rem;">
            Guest #${i} Food Preference <span class="required-star">*</span>
          </label>
          <select class="form-select sub-guest-food">
            <option value="Vegetarian">🥗 Vegetarian (Veg)</option>
            <option value="Non-Vegetarian">🍗 Non-Vegetarian (Non-Veg)</option>
          </select>
        </div>
      `;
      plusOnesDetailsContainer.appendChild(card);
    }
  }

  for (const r of plusOnesRadios) {
    r.addEventListener('change', renderPlusOnesInputs);
  }

  // ==========================================
  // 8. RSVP SUBMISSION & STORAGE
  // ==========================================
  function getStoredRSVPs() {
    const saved = localStorage.getItem(STORAGE_KEY_RSVPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  }

  function saveRSVP(rsvp) {
    const list = getStoredRSVPs();
    list.unshift(rsvp);
    localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(list));
    renderGuestbook();
    updateAdminStats();
  }

  async function sendRsvpToGoogleSheet(rsvp) {
    if (!GOOGLE_SCRIPT_WEBHOOK_URL) return;

    const plusOnesDetailsStr = (rsvp.plusOnesList || []).map(g => `${g.name} (${g.food})`).join(', ');

    // Calculate food breakdown for spreadsheet clarity
    let vegCount = rsvp.foodPreference === 'Vegetarian' ? 1 : 0;
    let nonVegCount = rsvp.foodPreference === 'Non-Vegetarian' ? 1 : 0;
    if (rsvp.plusOnesList && Array.isArray(rsvp.plusOnesList)) {
      rsvp.plusOnesList.forEach(g => {
        if (g.food === 'Vegetarian') vegCount += 1;
        else if (g.food === 'Non-Vegetarian') nonVegCount += 1;
      });
    }

    const payload = {
      timestamp: new Date().toLocaleString(),
      name: rsvp.name,
      status: rsvp.status === 'attending' ? 'Joyfully Attending' : 'Regretfully Declined',
      plusOnesCount: rsvp.plusOnesCount || 0,
      plusOnesDetails: plusOnesDetailsStr || 'None',
      totalGuests: rsvp.totalGuests || (rsvp.status === 'attending' ? 1 : 0),
      foodPreference: rsvp.foodPreference,
      vegCount: rsvp.status === 'attending' ? vegCount : 0,
      nonVegCount: rsvp.status === 'attending' ? nonVegCount : 0,
      dietaryNotes: rsvp.dietaryNotes || 'None',
      prediction: rsvp.prediction || 'None',
      contact: rsvp.contact,
      message: rsvp.message || ''
    };

    try {
      // Send as plain text to avoid CORS preflight issues with Google Apps Script
      await fetch(GOOGLE_SCRIPT_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });
      console.log('✨ RSVP synced to Google Sheet successfully!');
    } catch (err) {
      console.warn('⚠️ Google Sheet sync notice:', err);
    }
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('guest-name');
      const contactInput = document.getElementById('guest-contact');

      if (!nameInput.value.trim()) {
        showToast('⚠️ Please enter your full name');
        nameInput.focus();
        return;
      }
      if (!contactInput.value.trim()) {
        showToast('⚠️ Please provide an email or phone number');
        contactInput.focus();
        return;
      }

      let status = 'attending';
      for (const r of attendingStatusRadios) {
        if (r.checked) status = r.value;
      }

      let plusOnesCount = 0;
      let plusOnesList = [];
      let foodPreference = 'Vegetarian';
      let dietaryNotes = '';
      let prediction = 'Pink';

      if (status === 'attending') {
        for (const r of plusOnesRadios) {
          if (r.checked) plusOnesCount = parseInt(r.value, 10);
        }

        // Validate sub-guests
        const subNames = document.querySelectorAll('.sub-guest-name');
        const subFoods = document.querySelectorAll('.sub-guest-food');
        for (let i = 0; i < subNames.length; i++) {
          const sName = subNames[i].value.trim();
          if (!sName) {
            showToast(`⚠️ Please enter the name for Guest #${i + 1}`);
            subNames[i].focus();
            return;
          }
          plusOnesList.push({
            name: sName,
            food: subFoods[i].value
          });
        }

        const foodRadios = document.getElementsByName('food_preference');
        for (const r of foodRadios) {
          if (r.checked) foodPreference = r.value;
        }

        const predRadios = document.getElementsByName('rsvp_prediction');
        for (const r of predRadios) {
          if (r.checked) prediction = r.value;
        }

        // Update live poll tally without duplicate counting
        const previousVote = localStorage.getItem(STORAGE_KEY_USER_VOTE);
        const poll = getPollData();
        if (!previousVote) {
          // First time vote
          if (prediction === 'Pink') poll.pink += (1 + plusOnesCount);
          else poll.blue += (1 + plusOnesCount);
        } else if (previousVote !== prediction) {
          // User switched vote in RSVP form
          if (previousVote === 'Pink') {
            poll.pink = Math.max(0, poll.pink - 1);
            poll.blue += (1 + plusOnesCount);
          } else {
            poll.blue = Math.max(0, poll.blue - 1);
            poll.pink += (1 + plusOnesCount);
          }
        }
        localStorage.setItem(STORAGE_KEY_USER_VOTE, prediction);
        savePollData(poll);
      }

      const message = document.getElementById('guest-message').value.trim();

      const newRsvp = {
        id: 'rsvp-' + Date.now(),
        name: nameInput.value.trim(),
        contact: contactInput.value.trim(),
        status: status,
        plusOnesCount: status === 'attending' ? plusOnesCount : 0,
        plusOnesList: plusOnesList,
        totalGuests: status === 'attending' ? (1 + plusOnesCount) : 0,
        foodPreference: status === 'attending' ? foodPreference : 'N/A',
        dietaryNotes: 'None',
        prediction: status === 'attending' ? prediction : 'None',
        message: message,
        timestamp: new Date().toISOString()
      };

      saveRSVP(newRsvp);

      // Automatically sync to Google Sheet
      sendRsvpToGoogleSheet(newRsvp);

      // Sound & Confetti Magic
      if (window.soundEffects) window.soundEffects.playCelebration();
      if (window.confettiManager) window.confettiManager.doubleBurst();

      // Show Success View
      rsvpForm.style.display = 'none';
      successBanner.style.display = 'block';

      const summaryBox = document.getElementById('success-summary-box');
      if (summaryBox) {
        if (status === 'attending') {
          let plusOnesText = plusOnesCount > 0 ? ` + ${plusOnesCount} additional guest(s) (${plusOnesList.map(g => g.name).join(', ')})` : '';
          let foodSummary = `Primary: ${foodPreference}`;
          if (plusOnesList.length > 0) {
            foodSummary += ` | Guests: ${plusOnesList.map(g => `${g.name} (${g.food})`).join(', ')}`;
          }

          summaryBox.innerHTML = `
            <div style="font-size: 0.95rem; line-height: 1.8;">
              <div><strong>👤 Guest Name:</strong> ${newRsvp.name}</div>
              <div><strong>🎉 Status:</strong> Joyfully Attending</div>
              <div><strong>👥 Total Party Size:</strong> ${1 + plusOnesCount} person(s)${plusOnesText}</div>
              <div><strong>🍽️ Meal Preference:</strong> ${foodSummary}</div>
              <div><strong>🔮 Baby Guess:</strong> Team ${prediction} ${prediction === 'Pink' ? '🎀' : '🧸'}</div>
            </div>
          `;
        } else {
          summaryBox.innerHTML = `
            <div style="font-size: 0.95rem; line-height: 1.8;">
              <div><strong>👤 Guest Name:</strong> ${newRsvp.name}</div>
              <div><strong>💌 Status:</strong> Regretfully Declined</div>
              <div>Thank you for letting us know and sending your warm wishes!</div>
            </div>
          `;
        }
      }

      showToast('🎉 RSVP submitted successfully!');
    });
  }

  if (btnEditRsvp) {
    btnEditRsvp.addEventListener('click', () => {
      successBanner.style.display = 'none';
      rsvpForm.style.display = 'block';
      if (window.soundEffects) window.soundEffects.playSparkle();
    });
  }

  // ==========================================
  // 9. GUESTBOOK WISHES WALL
  // ==========================================
  function renderGuestbook() {
    const grid = document.getElementById('guestbook-cards-grid');
    if (!grid) return;

    const rsvps = getStoredRSVPs();
    const wishes = rsvps.filter(r => r.message && r.message.trim().length > 0);

    grid.innerHTML = '';
    if (wishes.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2.75rem 1.5rem; background: var(--card-bg); border-radius: 24px; border: 1.5px dashed var(--card-border); color: var(--text-muted); box-shadow: var(--card-shadow);">
          <span style="font-size: 2.4rem; display: block; margin-bottom: 0.5rem;">💌</span>
          <p style="font-weight: 700; font-family: var(--font-serif); font-size: 1.3rem; color: var(--text-main); margin-bottom: 0.35rem;">The Wishes Wall is Open!</p>
          <p style="font-size: 0.95rem; max-width: 480px; margin: 0 auto; color: var(--text-muted);">Leave a sweet blessing or prediction for Jeyanth, Charani &amp; baby when you submit your RSVP above to appear here!</p>
        </div>
      `;
      return;
    }

    wishes.forEach(w => {
      const card = document.createElement('div');
      card.className = 'wish-card';

      let tagClass = 'neutral';
      let tagText = '💌 Guest';
      if (w.prediction === 'Pink') {
        tagClass = 'pink';
        tagText = '🎀 Team Pink';
      } else if (w.prediction === 'Blue') {
        tagClass = 'blue';
        tagText = '🧸 Team Blue';
      }

      const dateStr = new Date(w.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });

      card.innerHTML = `
        <div>
          <div class="wish-header">
            <span class="wish-author">${escapeHtml(w.name)}</span>
            <span class="wish-tag ${tagClass}">${tagText}</span>
          </div>
          <p class="wish-content">“${escapeHtml(w.message)}”</p>
        </div>
        <div class="wish-time">${dateStr}</div>
      `;
      grid.appendChild(card);
    });
  }

  renderGuestbook();

  // ==========================================
  // 10. HOST / ADMIN DASHBOARD & EXPORT CSV
  // ==========================================
  const modalAdmin = document.getElementById('admin-modal');
  const btnOpenAdmin = document.getElementById('btn-open-admin');
  const btnCloseAdmin = document.getElementById('btn-close-admin');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnResetDemo = document.getElementById('btn-reset-demo');

  function updateAdminStats() {
    const rsvps = getStoredRSVPs();
    let totalHeadcount = 0;
    let vegCount = 0;
    let nonvegCount = 0;
    let declinedCount = 0;
    let pinkVotes = 0;
    let blueVotes = 0;

    const tbody = document.getElementById('admin-guest-tbody');
    if (tbody) tbody.innerHTML = '';

    rsvps.forEach(r => {
      if (r.status === 'attending') {
        totalHeadcount += (1 + (r.plusOnesCount || 0));

        // Primary guest food
        if (r.foodPreference === 'Vegetarian') vegCount += 1;
        else if (r.foodPreference === 'Non-Vegetarian') nonvegCount += 1;

        // Sub guests food
        if (r.plusOnesList && Array.isArray(r.plusOnesList)) {
          r.plusOnesList.forEach(sub => {
            if (sub.food === 'Vegetarian') vegCount += 1;
            else if (sub.food === 'Non-Vegetarian') nonvegCount += 1;
          });
        }

        if (r.prediction === 'Pink') pinkVotes += (1 + (r.plusOnesCount || 0));
        else if (r.prediction === 'Blue') blueVotes += (1 + (r.plusOnesCount || 0));
      } else {
        declinedCount += 1;
      }

      if (tbody) {
        const row = document.createElement('tr');
        const formattedDate = new Date(r.timestamp).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        let plusOnesStr = '0';
        if (r.plusOnesCount > 0 && r.plusOnesList) {
          plusOnesStr = `${r.plusOnesCount} (${r.plusOnesList.map(g => `${g.name}: ${g.food}`).join(', ')})`;
        }

        row.innerHTML = `
          <td><strong>${escapeHtml(r.name)}</strong></td>
          <td><span style="padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; background: ${r.status === 'attending' ? '#e8f5e9; color: #2e7d32;' : '#f5f5f5; color: #757575;'}">${r.status === 'attending' ? 'Attending' : 'Declined'}</span></td>
          <td>${escapeHtml(plusOnesStr)}</td>
          <td><strong>${r.totalGuests || 0}</strong></td>
          <td>${escapeHtml(r.foodPreference)}</td>
          <td><small>${escapeHtml(r.dietaryNotes || 'None')}</small></td>
          <td>${r.prediction === 'Pink' ? '🎀 Girl' : (r.prediction === 'Blue' ? '🧸 Boy' : '-')}</td>
          <td><small>${escapeHtml(r.contact)}</small></td>
          <td><small style="color: #888;">${formattedDate}</small></td>
        `;
        tbody.appendChild(row);
      }
    });

    const elStatHeadcount = document.getElementById('stat-total-headcount');
    const elStatVeg = document.getElementById('stat-veg-count');
    const elStatNonVeg = document.getElementById('stat-nonveg-count');
    const elStatDeclined = document.getElementById('stat-declined-count');

    if (elStatHeadcount) elStatHeadcount.textContent = totalHeadcount;
    if (elStatVeg) elStatVeg.textContent = vegCount;
    if (elStatNonVeg) elStatNonVeg.textContent = nonvegCount;
    if (elStatDeclined) elStatDeclined.textContent = declinedCount;
  }

  if (btnOpenAdmin) {
    btnOpenAdmin.addEventListener('click', () => {
      updateAdminStats();
      modalAdmin.style.display = 'flex';
      modalAdmin.setAttribute('aria-hidden', 'false');
      if (window.soundEffects) window.soundEffects.playSparkle();
    });
  }

  if (btnCloseAdmin) {
    btnCloseAdmin.addEventListener('click', () => {
      modalAdmin.style.display = 'none';
      modalAdmin.setAttribute('aria-hidden', 'true');
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modalAdmin) {
      modalAdmin.style.display = 'none';
      modalAdmin.setAttribute('aria-hidden', 'true');
    }
  });

  // Export to CSV Functionality
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const rsvps = getStoredRSVPs();
      let csv = 'Guest Name,Status,+1 Count,+1 Details,Total Guests,Primary Food Preference,Dietary Restrictions,Prediction,Contact,Message,Timestamp\n';

      rsvps.forEach(r => {
        const plusDetails = (r.plusOnesList || []).map(g => `${g.name} (${g.food})`).join('; ');
        const row = [
          `"${(r.name || '').replace(/"/g, '""')}"`,
          `"${r.status}"`,
          `"${r.plusOnesCount || 0}"`,
          `"${plusDetails.replace(/"/g, '""')}"`,
          `"${r.totalGuests || 0}"`,
          `"${r.foodPreference || ''}"`,
          `"${(r.dietaryNotes || '').replace(/"/g, '""')}"`,
          `"${r.prediction || ''}"`,
          `"${(r.contact || '').replace(/"/g, '""')}"`,
          `"${(r.message || '').replace(/"/g, '""')}"`,
          `"${r.timestamp || ''}"`
        ];
        csv += row.join(',') + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `Gender_Reveal_Guest_List_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📥 Guest list exported to CSV!');
    });
  }

  if (btnResetDemo) {
    btnResetDemo.addEventListener('click', () => {
      if (confirm('Reset guest list and poll back to sample data?')) {
        localStorage.removeItem(STORAGE_KEY_RSVPS);
        localStorage.removeItem(STORAGE_KEY_POLL);
        savePollData({ pink: 28, blue: 26 });
        renderGuestbook();
        updateAdminStats();
        showToast('🔄 Demo data reset!');
      }
    });
  }

  // ==========================================
  // 11. TOAST HELPER
  // ==========================================
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
