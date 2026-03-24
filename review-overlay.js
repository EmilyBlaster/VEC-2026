/**
 * VEC Review Overlay System
 * Figma-style inline comment pins for stakeholder feedback
 *
 * Usage: Add <script src="review-overlay.js"></script> before </body>
 * Auto-enables with ?review=1 URL parameter
 */
(function () {
  'use strict';

  /* =============================================================
     CONFIGURATION — Update APPS_SCRIPT_URL after deploying
     ============================================================= */
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOdN_ws0Po-yhW3MexyoaBL1wKEqPgPYxesM98iGLYYcwJTEGLOU1BQq0LDEsy_UA5gQ/exec';

  /* =============================================================
     STATE
     ============================================================= */
  var reviewMode = false;
  var pins = [];
  var pinCounter = 0;
  var activePopover = null;
  var activePanel = null;

  /* =============================================================
     CSS INJECTION
     ============================================================= */
  function injectStyles() {
    var css = document.createElement('style');
    css.id = 'review-overlay-styles';
    css.textContent = [
      /* ---------- Review mode indicator ---------- */
      'body.review-mode { box-shadow: inset 0 0 0 3px #E523FF !important; }',
      'body.review-mode::after {',
      '  content: "REVIEW MODE"; position: fixed; top: 12px; left: 50%;',
      '  transform: translateX(-50%); z-index: 10002;',
      '  font-family: "DM Mono", monospace; font-size: 11px; letter-spacing: 0.15em;',
      '  background: #E523FF; color: #fff; padding: 6px 18px; border-radius: 20px;',
      '  pointer-events: none;',
      '}',

      /* ---------- Toggle FAB ---------- */
      '.review-toggle {',
      '  display: flex; align-items: center; gap: 8px;',
      '  background: #060B2B; color: #fff; border: 2px solid rgba(255,255,255,0.15);',
      '  padding: 10px 20px; border-radius: 50px; cursor: pointer;',
      '  font-family: "DM Mono", monospace; font-size: 12px; letter-spacing: 0.08em;',
      '  transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.3);',
      '}',
      '.review-toggle:hover { background: #1a1f4a; transform: translateY(-2px); }',
      '.review-toggle--active {',
      '  background: #E523FF !important; border-color: #E523FF;',
      '}',
      '.review-toggle__icon { font-size: 16px; line-height: 1; }',
      '.review-toolbar {',
      '  position: fixed; bottom: 24px; left: 24px; z-index: 10001;',
      '  display: none; flex-direction: column; gap: 10px; align-items: flex-start;',
      '}',
      'body.review-mode .review-toolbar { display: flex; }',
      '.review-toolbar__btn {',
      '  background: #060B2B; color: #fff; border: 2px solid rgba(255,255,255,0.15);',
      '  padding: 10px 18px; border-radius: 50px; cursor: pointer;',
      '  font-family: "DM Mono", monospace; font-size: 11px; letter-spacing: 0.08em;',
      '  transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.3);',
      '  white-space: nowrap; user-select: none;',
      '}',
      '.review-toolbar__btn:hover { background: #1a1f4a; transform: translateY(-2px); }',

      /* ---------- Pin markers ---------- */
      '.review-pin {',
      '  position: absolute; z-index: 10000; cursor: pointer;',
      '  transition: transform 0.15s ease;',
      '}',
      '.review-pin:hover { transform: scale(1.2); }',
      '.review-pin__dot {',
      '  width: 32px; height: 32px; border-radius: 50%;',
      '  background: #E523FF; color: #fff;',
      '  display: flex; align-items: center; justify-content: center;',
      '  font-family: "DM Mono", monospace; font-size: 12px; font-weight: 700;',
      '  box-shadow: 0 2px 12px rgba(229,35,255,0.4), 0 0 0 3px rgba(255,255,255,0.9);',
      '  pointer-events: auto;',
      '}',
      '.review-pin__dot--resolved {',
      '  background: #3BD85E; box-shadow: 0 2px 12px rgba(59,216,94,0.4), 0 0 0 3px rgba(255,255,255,0.9);',
      '}',
      /* Pin tail/arrow pointing down */
      '.review-pin__tail {',
      '  width: 2px; height: 12px; background: #E523FF;',
      '  margin: 0 auto; border-radius: 0 0 2px 2px;',
      '}',

      /* ---------- New comment popover ---------- */
      '.review-popover {',
      '  position: absolute; z-index: 10003; width: 320px;',
      '  background: #fff; border-radius: 16px;',
      '  box-shadow: 0 12px 40px rgba(6,11,43,0.2), 0 0 0 1px rgba(6,11,43,0.06);',
      '  padding: 20px; font-family: "Avenir Next Intuit", Montserrat, sans-serif;',
      '}',
      '.review-popover__header {',
      '  font-family: "DM Mono", monospace; font-size: 10px;',
      '  letter-spacing: 0.14em; text-transform: uppercase;',
      '  color: #999; margin-bottom: 12px;',
      '}',
      '.review-popover__field { margin-bottom: 12px; }',
      '.review-popover__label {',
      '  display: block; font-size: 12px; font-weight: 600;',
      '  color: #060B2B; margin-bottom: 4px;',
      '}',
      '.review-popover__input, .review-popover__textarea {',
      '  width: 100%; padding: 10px 12px; border: 1.5px solid #ddd;',
      '  border-radius: 10px; font-family: inherit; font-size: 14px;',
      '  outline: none; transition: border-color 0.2s; box-sizing: border-box;',
      '}',
      '.review-popover__input:focus, .review-popover__textarea:focus {',
      '  border-color: #E523FF;',
      '}',
      '.review-popover__textarea { resize: vertical; min-height: 80px; }',
      '.review-popover__actions { display: flex; gap: 8px; margin-top: 4px; }',
      '.review-popover__btn {',
      '  flex: 1; padding: 10px; border: none; border-radius: 10px;',
      '  font-family: inherit; font-size: 13px; font-weight: 700;',
      '  cursor: pointer; transition: all 0.2s;',
      '}',
      '.review-popover__btn--submit {',
      '  background: #3BD85E; color: #fff;',
      '}',
      '.review-popover__btn--submit:hover { background: #2fc04e; }',
      '.review-popover__btn--cancel {',
      '  background: #f0f0f0; color: #666;',
      '}',
      '.review-popover__btn--cancel:hover { background: #e0e0e0; }',

      /* ---------- Comment detail panel ---------- */
      '.review-panel-overlay {',
      '  position: fixed; inset: 0; background: rgba(6,11,43,0.3);',
      '  z-index: 10004; opacity: 0; transition: opacity 0.3s;',
      '}',
      '.review-panel-overlay--visible { opacity: 1; }',
      '.review-panel {',
      '  position: fixed; right: -400px; top: 0; width: 380px; height: 100vh;',
      '  background: #fff; z-index: 10005; overflow-y: auto;',
      '  box-shadow: -8px 0 30px rgba(6,11,43,0.15);',
      '  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);',
      '  font-family: "Avenir Next Intuit", Montserrat, sans-serif;',
      '}',
      '.review-panel--visible { right: 0; }',
      '.review-panel__header {',
      '  padding: 24px 24px 16px; border-bottom: 1px solid #eee;',
      '  display: flex; justify-content: space-between; align-items: center;',
      '}',
      '.review-panel__title {',
      '  font-weight: 900; font-size: 18px; color: #060B2B;',
      '}',
      '.review-panel__section {',
      '  font-family: "DM Mono", monospace; font-size: 10px;',
      '  letter-spacing: 0.12em; text-transform: uppercase;',
      '  color: #E523FF; margin-top: 4px;',
      '}',
      '.review-panel__close {',
      '  width: 32px; height: 32px; border-radius: 50%;',
      '  background: #f5f5f5; border: none; cursor: pointer;',
      '  font-size: 18px; color: #666; display: flex;',
      '  align-items: center; justify-content: center; transition: background 0.2s;',
      '}',
      '.review-panel__close:hover { background: #eee; }',
      '.review-panel__body { padding: 24px; }',
      '.review-panel__comment {',
      '  background: #f8f8fc; border-radius: 12px; padding: 16px;',
      '  margin-bottom: 16px;',
      '}',
      '.review-panel__author {',
      '  font-weight: 700; font-size: 14px; color: #060B2B;',
      '}',
      '.review-panel__time {',
      '  font-family: "DM Mono", monospace; font-size: 10px;',
      '  color: #999; margin-top: 2px; letter-spacing: 0.05em;',
      '}',
      '.review-panel__text {',
      '  font-size: 14px; color: #333; line-height: 1.6; margin-top: 10px;',
      '}',
      '.review-panel__resolve {',
      '  display: block; width: 100%; padding: 12px; border: 2px solid #3BD85E;',
      '  border-radius: 10px; background: transparent; color: #3BD85E;',
      '  font-family: inherit; font-size: 13px; font-weight: 700;',
      '  cursor: pointer; text-align: center; transition: all 0.2s;',
      '}',
      '.review-panel__resolve:hover { background: #3BD85E; color: #fff; }',

      /* ---------- Toast notification ---------- */
      '.review-toast {',
      '  position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px);',
      '  z-index: 10006; background: #060B2B; color: #fff;',
      '  padding: 12px 24px; border-radius: 12px;',
      '  font-family: "DM Mono", monospace; font-size: 12px; letter-spacing: 0.05em;',
      '  box-shadow: 0 8px 30px rgba(6,11,43,0.3);',
      '  opacity: 0; transition: opacity 0.3s, transform 0.3s;',
      '  pointer-events: none;',
      '}',
      '.review-toast--visible { opacity: 1; transform: translateX(-50%) translateY(0); }',

      /* ---------- Responsive ---------- */
      '@media (max-width: 768px) {',
      '  .review-popover { width: 280px; }',
      '  .review-panel { width: 100%; right: -100%; }',
      '  .review-toggle__refresh { left: auto; right: 24px; bottom: 80px; }',
      '}'
    ].join('\n');
    document.head.appendChild(css);
  }

  /* =============================================================
     GOOGLE SHEETS API
     ============================================================= */
  function fetchComments(callback) {
    if (APPS_SCRIPT_URL.indexOf('__REPLACE') === 0) {
      console.warn('[Review] Apps Script URL not configured. Using localStorage fallback.');
      var stored = localStorage.getItem('vec-review-pins');
      pins = stored ? JSON.parse(stored) : [];
      if (callback) callback();
      return;
    }

    fetch(APPS_SCRIPT_URL)
      .then(function (res) { return res.json(); })
      .then(function (rows) {
        pins = rows.map(function (r) {
          return {
            id: r.id,
            author: r.author,
            text: r.text,
            timestamp: r.timestamp,
            pageX: parseFloat(r.pageX),
            pageY: parseFloat(r.pageY),
            sectionId: r.sectionId,
            xPercent: parseFloat(r.xPercent),
            yOffsetInSection: parseFloat(r.yOffsetInSection),
            viewportWidth: parseFloat(r.viewportWidth),
            resolved: r.resolved === true || r.resolved === 'true' || r.resolved === 'TRUE'
          };
        });
        if (callback) callback();
      })
      .catch(function (err) {
        console.error('[Review] Failed to load comments:', err);
        // Fallback to localStorage
        var stored = localStorage.getItem('vec-review-pins');
        pins = stored ? JSON.parse(stored) : [];
        if (callback) callback();
      });
  }

  function postComment(data) {
    // Always save to localStorage as backup
    pins.push(data);
    localStorage.setItem('vec-review-pins', JSON.stringify(pins));

    if (APPS_SCRIPT_URL.indexOf('__REPLACE') === 0) {
      console.warn('[Review] Apps Script URL not configured. Saved to localStorage only.');
      return;
    }

    // Use GET with URL params to avoid Workspace CORS/redirect issues with POST
    var params = new URLSearchParams({
      action: 'write',
      timestamp: data.timestamp,
      id: data.id,
      author: data.author,
      text: data.text,
      pageX: data.pageX,
      pageY: data.pageY,
      sectionId: data.sectionId,
      xPercent: data.xPercent,
      yOffsetInSection: data.yOffsetInSection,
      viewportWidth: data.viewportWidth,
      resolved: data.resolved || false
    });

    fetch(APPS_SCRIPT_URL + '?' + params.toString())
      .then(function (res) { return res.json(); })
      .then(function (result) {
        console.log('[Review] Comment saved:', result);
      })
      .catch(function (err) {
        console.error('[Review] Failed to save comment:', err);
      });
  }

  /* =============================================================
     PIN POSITIONING
     ============================================================= */
  function getPlacementData(e) {
    var pageX = e.pageX;
    var pageY = e.pageY;
    var docWidth = document.documentElement.scrollWidth;
    var xPercent = pageX / docWidth;
    var closestSection = null;
    var yOffsetInSection = 0;

    var sections = document.querySelectorAll('section[id], nav, footer');
    sections.forEach(function (sec) {
      var rect = sec.getBoundingClientRect();
      var top = rect.top + window.scrollY;
      var bottom = top + rect.height;
      if (pageY >= top && pageY <= bottom) {
        closestSection = sec;
        yOffsetInSection = pageY - top;
      }
    });

    return {
      pageX: pageX,
      pageY: pageY,
      xPercent: xPercent,
      sectionId: closestSection ? (closestSection.id || closestSection.className.split(' ')[0]) : 'unknown',
      yOffsetInSection: yOffsetInSection,
      viewportWidth: window.innerWidth
    };
  }

  function calculatePinPosition(pin) {
    if (pin.sectionId && pin.sectionId !== 'unknown') {
      var section = document.getElementById(pin.sectionId) ||
        document.querySelector('.' + pin.sectionId);
      if (section) {
        var rect = section.getBoundingClientRect();
        var sectionTop = rect.top + window.scrollY;
        var x = pin.xPercent * document.documentElement.scrollWidth;
        var y = sectionTop + pin.yOffsetInSection;
        return { x: x, y: y };
      }
    }
    return { x: pin.pageX, y: pin.pageY };
  }

  /* =============================================================
     PIN RENDERING
     ============================================================= */
  function clearRenderedPins() {
    document.querySelectorAll('.review-pin').forEach(function (el) {
      el.remove();
    });
  }

  function renderPin(pinData, index) {
    var pos = calculatePinPosition(pinData);
    var el = document.createElement('div');
    el.className = 'review-pin';
    el.setAttribute('data-pin-id', pinData.id);
    el.style.left = (pos.x - 16) + 'px';
    el.style.top = (pos.y - 44) + 'px';

    var dot = document.createElement('div');
    dot.className = 'review-pin__dot' + (pinData.resolved ? ' review-pin__dot--resolved' : '');
    dot.textContent = (index + 1);

    var tail = document.createElement('div');
    tail.className = 'review-pin__tail';

    el.appendChild(dot);
    el.appendChild(tail);

    el.addEventListener('click', function (e) {
      e.stopPropagation();
      showCommentPanel(pinData, index);
    });

    document.body.appendChild(el);
  }

  function renderAllPins() {
    clearRenderedPins();
    pinCounter = 0;
    var unresolvedPins = pins.filter(function (p) { return !p.resolved; });
    unresolvedPins.forEach(function (pin, i) {
      renderPin(pin, i);
      pinCounter = i + 1;
    });
  }

  /* =============================================================
     NEW COMMENT POPOVER
     ============================================================= */
  function closeActivePopover() {
    if (activePopover) {
      activePopover.remove();
      activePopover = null;
    }
    // Remove any temp pins
    var temp = document.querySelector('.review-pin--temp');
    if (temp) temp.remove();
  }

  function showNewCommentPopover(pageX, pageY, placement) {
    closeActivePopover();
    closeCommentPanel();

    // Create temp pin
    var tempPin = document.createElement('div');
    tempPin.className = 'review-pin review-pin--temp';
    tempPin.style.left = (pageX - 16) + 'px';
    tempPin.style.top = (pageY - 44) + 'px';
    var tempDot = document.createElement('div');
    tempDot.className = 'review-pin__dot';
    tempDot.textContent = '+';
    var tempTail = document.createElement('div');
    tempTail.className = 'review-pin__tail';
    tempPin.appendChild(tempDot);
    tempPin.appendChild(tempTail);
    document.body.appendChild(tempPin);

    // Create popover
    var popover = document.createElement('div');
    popover.className = 'review-popover';

    // Position: to the right of the pin, or left if near right edge
    var popX = pageX + 24;
    if (popX + 320 > window.innerWidth + window.scrollX) {
      popX = pageX - 344;
    }
    popover.style.left = popX + 'px';
    popover.style.top = (pageY - 20) + 'px';

    var savedName = localStorage.getItem('vec-reviewer-name') || '';

    popover.innerHTML = [
      '<div class="review-popover__header">New Comment &#x2014; ' + (placement.sectionId || 'page') + '</div>',
      '<div class="review-popover__field">',
      '  <label class="review-popover__label">Your Name</label>',
      '  <input class="review-popover__input" type="text" placeholder="Enter your name" value="' + savedName + '" id="reviewNameInput">',
      '</div>',
      '<div class="review-popover__field">',
      '  <label class="review-popover__label">Comment</label>',
      '  <textarea class="review-popover__textarea" placeholder="What feedback do you have?" id="reviewCommentInput"></textarea>',
      '</div>',
      '<div class="review-popover__actions">',
      '  <button class="review-popover__btn review-popover__btn--cancel" id="reviewCancel">Cancel</button>',
      '  <button class="review-popover__btn review-popover__btn--submit" id="reviewSubmit">Submit</button>',
      '</div>'
    ].join('');

    document.body.appendChild(popover);
    activePopover = popover;

    // Focus the right field
    if (savedName) {
      document.getElementById('reviewCommentInput').focus();
    } else {
      document.getElementById('reviewNameInput').focus();
    }

    // Cancel
    document.getElementById('reviewCancel').addEventListener('click', function (e) {
      e.stopPropagation();
      closeActivePopover();
    });

    // Submit
    document.getElementById('reviewSubmit').addEventListener('click', function (e) {
      e.stopPropagation();
      var name = document.getElementById('reviewNameInput').value.trim();
      var text = document.getElementById('reviewCommentInput').value.trim();

      if (!name) {
        document.getElementById('reviewNameInput').style.borderColor = '#FF5C37';
        document.getElementById('reviewNameInput').focus();
        return;
      }
      if (!text) {
        document.getElementById('reviewCommentInput').style.borderColor = '#FF5C37';
        document.getElementById('reviewCommentInput').focus();
        return;
      }

      var data = {
        id: crypto.randomUUID ? crypto.randomUUID() : 'pin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        author: name,
        text: text,
        timestamp: new Date().toISOString(),
        pageX: pageX,
        pageY: pageY,
        sectionId: placement.sectionId,
        xPercent: placement.xPercent,
        yOffsetInSection: placement.yOffsetInSection,
        viewportWidth: placement.viewportWidth,
        resolved: false
      };

      // Save name
      localStorage.setItem('vec-reviewer-name', name);

      // Post to backend
      postComment(data);

      // Close popover, remove temp pin, render real pin
      closeActivePopover();
      renderAllPins();
    });

    // Escape to close
    function escHandler(e) {
      if (e.key === 'Escape') {
        closeActivePopover();
        document.removeEventListener('keydown', escHandler);
      }
    }
    document.addEventListener('keydown', escHandler);
  }

  /* =============================================================
     COMMENT DETAIL PANEL
     ============================================================= */
  function closeCommentPanel() {
    if (activePanel) {
      var overlay = document.querySelector('.review-panel-overlay');
      var panel = document.querySelector('.review-panel');
      if (overlay) {
        overlay.classList.remove('review-panel-overlay--visible');
        setTimeout(function () { overlay.remove(); }, 300);
      }
      if (panel) {
        panel.classList.remove('review-panel--visible');
        setTimeout(function () { panel.remove(); }, 350);
      }
      activePanel = null;
    }
  }

  function showCommentPanel(pinData, index) {
    closeActivePopover();
    closeCommentPanel();

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'review-panel-overlay';
    document.body.appendChild(overlay);
    setTimeout(function () {
      overlay.addEventListener('click', closeCommentPanel);
    }, 100);

    // Panel
    var panel = document.createElement('div');
    panel.className = 'review-panel';

    var timeStr = '';
    try {
      var d = new Date(pinData.timestamp);
      timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch (e) {
      timeStr = pinData.timestamp;
    }

    panel.innerHTML = [
      '<div class="review-panel__header">',
      '  <div>',
      '    <div class="review-panel__title">Comment #' + (index + 1) + '</div>',
      '    <div class="review-panel__section">' + (pinData.sectionId || 'page') + ' section</div>',
      '  </div>',
      '  <button class="review-panel__close" id="reviewPanelClose">&times;</button>',
      '</div>',
      '<div class="review-panel__body">',
      '  <div class="review-panel__comment">',
      '    <div class="review-panel__author">' + pinData.author + '</div>',
      '    <div class="review-panel__time">' + timeStr + '</div>',
      '    <div class="review-panel__text">' + pinData.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>',
      '  </div>',
      '  <button class="review-panel__resolve" id="reviewResolve">Mark as Resolved</button>',
      '</div>'
    ].join('');

    document.body.appendChild(panel);
    activePanel = panel;

    // Animate in
    requestAnimationFrame(function () {
      overlay.classList.add('review-panel-overlay--visible');
      panel.classList.add('review-panel--visible');
    });

    // Close button
    document.getElementById('reviewPanelClose').addEventListener('click', closeCommentPanel);

    // Resolve button
    document.getElementById('reviewResolve').addEventListener('click', function (e) {
      e.stopPropagation();
      pinData.resolved = true;
      localStorage.setItem('vec-review-pins', JSON.stringify(pins));
      closeCommentPanel();
      renderAllPins();
      showToast('Comment resolved');
    });

    // Escape to close
    function escHandler(e) {
      if (e.key === 'Escape') {
        closeCommentPanel();
        document.removeEventListener('keydown', escHandler);
      }
    }
    document.addEventListener('keydown', escHandler);
  }

  /* =============================================================
     TOAST NOTIFICATION
     ============================================================= */
  function showToast(message) {
    var existing = document.querySelector('.review-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'review-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('review-toast--visible');
    });

    setTimeout(function () {
      toast.classList.remove('review-toast--visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2500);
  }

  /* =============================================================
     ALL FEEDBACK PANEL
     ============================================================= */
  function showAllFeedbackPanel() {
    closeActivePopover();
    closeCommentPanel();

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'review-panel-overlay';
    document.body.appendChild(overlay);
    setTimeout(function () {
      overlay.addEventListener('click', closeCommentPanel);
    }, 100);

    // Panel
    var panel = document.createElement('div');
    panel.className = 'review-panel';

    var unresolvedPins = pins.filter(function (p) { return !p.resolved; });
    var resolvedPins = pins.filter(function (p) { return p.resolved; });

    var commentsHTML = '';
    if (unresolvedPins.length === 0 && resolvedPins.length === 0) {
      commentsHTML = '<p style="color:#999;text-align:center;padding:2rem 0;font-size:14px;">No feedback yet. Click anywhere on the page to leave a comment.</p>';
    } else {
      unresolvedPins.forEach(function (pin, i) {
        var timeStr = '';
        try {
          var d = new Date(pin.timestamp);
          timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
            ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } catch (e) { timeStr = pin.timestamp; }

        commentsHTML += [
          '<div class="review-panel__comment" style="cursor:pointer;" data-pin-index="' + i + '">',
          '  <div style="display:flex;justify-content:space-between;align-items:center;">',
          '    <div class="review-panel__author">' + pin.author + '</div>',
          '    <span style="font-family:DM Mono,monospace;font-size:10px;letter-spacing:0.1em;color:#E523FF;background:rgba(229,35,255,0.08);padding:3px 8px;border-radius:6px;">' + (pin.sectionId || 'page') + '</span>',
          '  </div>',
          '  <div class="review-panel__time">' + timeStr + '</div>',
          '  <div class="review-panel__text">' + pin.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>',
          '  <button class="review-panel__resolve" style="margin-top:10px;" data-resolve-id="' + pin.id + '">Resolve</button>',
          '</div>'
        ].join('');
      });

      if (resolvedPins.length > 0) {
        commentsHTML += '<div style="font-family:DM Mono,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#999;margin:24px 0 12px;text-align:center;">Resolved (' + resolvedPins.length + ')</div>';
        resolvedPins.forEach(function (pin) {
          commentsHTML += [
            '<div class="review-panel__comment" style="opacity:0.5;">',
            '  <div class="review-panel__author">' + pin.author + '</div>',
            '  <div class="review-panel__text" style="text-decoration:line-through;">' + pin.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>',
            '</div>'
          ].join('');
        });
      }
    }

    panel.innerHTML = [
      '<div class="review-panel__header">',
      '  <div>',
      '    <div class="review-panel__title">All Feedback</div>',
      '    <div class="review-panel__section">' + unresolvedPins.length + ' open, ' + resolvedPins.length + ' resolved</div>',
      '  </div>',
      '  <button class="review-panel__close" id="reviewPanelClose">&times;</button>',
      '</div>',
      '<div class="review-panel__body">',
      commentsHTML,
      '</div>'
    ].join('');

    document.body.appendChild(panel);
    activePanel = panel;

    // Animate in
    requestAnimationFrame(function () {
      overlay.classList.add('review-panel-overlay--visible');
      panel.classList.add('review-panel--visible');
    });

    // Close button
    document.getElementById('reviewPanelClose').addEventListener('click', closeCommentPanel);

    // Resolve buttons
    panel.querySelectorAll('[data-resolve-id]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var pinId = btn.getAttribute('data-resolve-id');
        var pin = pins.find(function (p) { return p.id === pinId; });
        if (pin) {
          pin.resolved = true;
          localStorage.setItem('vec-review-pins', JSON.stringify(pins));
        }
        // Remove this comment card from the panel with animation
        var card = btn.closest('.review-panel__comment');
        if (card) {
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          card.style.opacity = '0';
          card.style.transform = 'translateX(20px)';
          setTimeout(function () { card.remove(); }, 300);
        }
        // Update pin on page
        renderAllPins();
        // Update the count in the header
        var unresolvedCount = pins.filter(function (p) { return !p.resolved; }).length;
        var resolvedCount = pins.filter(function (p) { return p.resolved; }).length;
        var sectionEl = panel.querySelector('.review-panel__section');
        if (sectionEl) sectionEl.textContent = unresolvedCount + ' open, ' + resolvedCount + ' resolved';
        showToast('Comment resolved');
      });
    });

    // Click comment to scroll to pin
    panel.querySelectorAll('[data-pin-index]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.review-panel__resolve')) return;
        var idx = parseInt(card.getAttribute('data-pin-index'));
        var pin = unresolvedPins[idx];
        if (pin) {
          var pos = calculatePinPosition(pin);
          window.scrollTo({ top: pos.y - 200, behavior: 'smooth' });
        }
      });
    });

    // Escape to close
    function escHandler(e) {
      if (e.key === 'Escape') {
        closeCommentPanel();
        document.removeEventListener('keydown', escHandler);
      }
    }
    document.addEventListener('keydown', escHandler);
  }

  /* =============================================================
     REVIEW MODE TOGGLE
     ============================================================= */
  function createToggleButton() {
    // Main toggle
    var btn = document.createElement('div');
    btn.className = 'review-toggle';
    btn.innerHTML = '<span class="review-toggle__icon">&#x1F4AC;</span> Review';
    btn.addEventListener('click', function () {
      if (reviewMode) {
        disableReviewMode();
      } else {
        enableReviewMode();
      }
    });
    // Toolbar with action buttons
    var toolbar = document.createElement('div');
    toolbar.className = 'review-toolbar';

    var viewAll = document.createElement('div');
    viewAll.className = 'review-toolbar__btn';
    viewAll.innerHTML = 'View All Feedback';
    viewAll.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      // Fetch latest from Google Sheet, show toast, then open panel
      fetchComments(function () {
        renderAllPins();
        var unresolvedCount = pins.filter(function (p) { return !p.resolved; }).length;
        showToast(unresolvedCount > 0 ? unresolvedCount + ' comment' + (unresolvedCount !== 1 ? 's' : '') + ' found' : 'No feedback yet');
        showAllFeedbackPanel();
      });
    });

    toolbar.appendChild(viewAll);
    toolbar.appendChild(btn);

    // Stop all clicks inside toolbar from triggering page click
    toolbar.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.body.appendChild(toolbar);
  }

  function enableReviewMode() {
    reviewMode = true;
    document.body.classList.add('review-mode');
    var toggle = document.querySelector('.review-toggle');
    toggle.classList.add('review-toggle--active');
    toggle.innerHTML = '<span class="review-toggle__icon">&times;</span> Exit Review';

    // Load and render pins
    fetchComments(function () {
      renderAllPins();
    });

    // Add page click handler
    document.addEventListener('click', handlePageClick);
  }

  function disableReviewMode() {
    reviewMode = false;
    document.body.classList.remove('review-mode');
    var toggle = document.querySelector('.review-toggle');
    toggle.classList.remove('review-toggle--active');
    toggle.innerHTML = '<span class="review-toggle__icon">&#x1F4AC;</span> Review';

    // Clean up
    clearRenderedPins();
    closeActivePopover();
    closeCommentPanel();
    document.removeEventListener('click', handlePageClick);
  }

  /* =============================================================
     PAGE CLICK HANDLER
     ============================================================= */
  function handlePageClick(e) {
    if (!reviewMode) return;

    // Ignore clicks on review UI
    if (e.target.closest('.review-pin, .review-popover, .review-panel, .review-panel-overlay, .review-toggle, .review-toggle__refresh')) return;

    // Ignore clicks on interactive site elements
    if (e.target.closest('a, button, input, textarea, select')) return;

    var placement = getPlacementData(e);
    showNewCommentPopover(e.pageX, e.pageY, placement);
  }

  /* =============================================================
     WINDOW RESIZE — REPOSITION PINS
     ============================================================= */
  var resizeTimer;
  window.addEventListener('resize', function () {
    if (!reviewMode) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      renderAllPins();
    }, 300);
  });

  /* =============================================================
     INIT
     ============================================================= */
  function init() {
    injectStyles();
    createToggleButton();

    // Auto-enable if ?review=1 in URL
    if (new URLSearchParams(window.location.search).get('review') === '1') {
      enableReviewMode();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
