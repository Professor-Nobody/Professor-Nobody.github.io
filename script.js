/* ==========================================================================
   SYED ASHHAR IMAM ("PROFESSOR NOBODY") - PORTFOLIO INTERACTIVITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. STATE & CONSTANTS ---
    const state = {
        isGamerMode: false,
        isSfxOn: false,
        audioCtx: null,
        konamiSequence: [],
        konamiTarget: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    };

    // --- 2. DOM ELEMENTS ---
    const body = document.body;
    const modeToggleBtn = document.getElementById('mode-toggle');
    const modeLabel = document.getElementById('mode-label');
    const modeIcon = document.getElementById('mode-icon');
    const modeBadge = document.getElementById('mode-badge');
    
    const sfxToggleBtn = document.getElementById('sfx-toggle');
    const sfxLabel = document.getElementById('sfx-label');
    const sfxIcon = document.getElementById('sfx-icon');

    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    const termOpenBtn = document.getElementById('term-open-btn');
    const termModal = document.getElementById('terminal-modal');
    const termCloseBtn = document.getElementById('term-close-btn');
    const termCloseDot = document.getElementById('term-close-dot');
    const cliInputField = document.getElementById('cli-input-field');
    const cliOutput = document.getElementById('cli-output');

    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileToggleIcon = document.getElementById('mobile-toggle-icon');

    // --- 3. AUDIO SYNTHESIZER (WEB AUDIO API) ---
    function initAudio() {
        if (!state.audioCtx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) state.audioCtx = new AudioCtx();
        }
    }

    function playSound(freq = 440, type = 'sine', duration = 0.05) {
        if (!state.isSfxOn) return;
        try {
            initAudio();
            if (!state.audioCtx) return;
            if (state.audioCtx.state === 'suspended') {
                state.audioCtx.resume();
            }
            const osc = state.audioCtx.createOscillator();
            const gain = state.audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
            
            gain.gain.setValueAtTime(0.08, state.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(state.audioCtx.destination);

            osc.start();
            osc.stop(state.audioCtx.currentTime + duration);
        } catch (e) {
            console.warn('Audio play failed:', e);
        }
    }

    // --- 4. MODE TOGGLE (DEV MODE <-> GAMER MODE) ---
    function toggleMode() {
        state.isGamerMode = !state.isGamerMode;
        playSound(state.isGamerMode ? 660 : 330, 'square', 0.08);

        if (state.isGamerMode) {
            body.classList.add('gamer-mode');
            modeLabel.textContent = 'GAMER MODE';
            modeIcon.textContent = '🎮';
            if (modeBadge) modeBadge.textContent = 'GAMER MODE';
        } else {
            body.classList.remove('gamer-mode');
            modeLabel.textContent = 'DEV MODE';
            modeIcon.textContent = '💻';
            if (modeBadge) modeBadge.textContent = 'DEV MODE';
        }
    }

    if (modeToggleBtn) modeToggleBtn.addEventListener('click', toggleMode);

    // --- 5. SFX TOGGLE ---
    if (sfxToggleBtn) {
        sfxToggleBtn.addEventListener('click', () => {
            state.isSfxOn = !state.isSfxOn;
            if (state.isSfxOn) {
                sfxLabel.textContent = 'SFX: ON';
                sfxIcon.textContent = '🔊';
                sfxToggleBtn.classList.add('active');
                playSound(520, 'sine', 0.1);
            } else {
                sfxLabel.textContent = 'SFX: OFF';
                sfxIcon.textContent = '🔇';
                sfxToggleBtn.classList.remove('active');
            }
        });
    }

    // --- 6. MOBILE NAVIGATION TOGGLE ---
    if (mobileToggleBtn && mobileDrawer) {
        mobileToggleBtn.addEventListener('click', () => {
            const isActive = mobileDrawer.classList.toggle('active');
            mobileToggleIcon.textContent = isActive ? '✕' : '☰';
            playSound(isActive ? 480 : 360, 'sine', 0.04);
        });

        // Close drawer when any mobile nav link is clicked
        const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('active');
                mobileToggleIcon.textContent = '☰';
            });
        });

        // Close drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileDrawer.contains(e.target) && !mobileToggleBtn.contains(e.target) && mobileDrawer.classList.contains('active')) {
                mobileDrawer.classList.remove('active');
                mobileToggleIcon.textContent = '☰';
            }
        });
    }

    // --- 7. CUSTOM CROSSHAIR CURSOR ---
    if (window.innerWidth > 600 && cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            
            cursorRing.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 150, fill: 'forwards' });
        });

        const hoverables = document.querySelectorAll('a, button, .project-card, .hud-btn, .social-btn, .contact-card-link, .experience-card, .skills-cat-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                body.classList.add('cursor-hover');
                playSound(800, 'triangle', 0.02);
            });
            el.addEventListener('mouseleave', () => {
                body.classList.remove('cursor-hover');
            });
        });
    }

    // --- 8. INTERACTIVE TERMINAL CLI ---
    function openTerminal() {
        if (!termModal) return;
        termModal.classList.add('active');
        if (cliInputField) cliInputField.focus();
        playSound(400, 'sine', 0.06);
    }

    function closeTerminal() {
        if (!termModal) return;
        termModal.classList.remove('active');
        playSound(300, 'sine', 0.06);
    }

    if (termOpenBtn) termOpenBtn.addEventListener('click', openTerminal);
    if (termCloseBtn) termCloseBtn.addEventListener('click', closeTerminal);
    if (termCloseDot) termCloseDot.addEventListener('click', closeTerminal);

    if (termModal) {
        termModal.addEventListener('click', (e) => {
            if (e.target === termModal) closeTerminal();
        });
    }

    // Terminal Commands Logic
    const commands = {
        'help': `Available Commands:
  - <span class="accent-text">whoami</span>      : Display bio and verified identity
  - <span class="accent-text">experience</span>  : View current experience & roles
  - <span class="accent-text">flagship</span>    : Details on HowlBot SaaS platform
  - <span class="accent-text">projects</span>    : List featured and verified repositories
  - <span class="accent-text">skills</span>      : Technical inventory (Applied vs Exploring)
  - <span class="accent-text">education</span>   : Academic background & degree
  - <span class="accent-text">operations</span>  : Esports & tournament operations
  - <span class="accent-text">contact</span>     : Direct communication channels & links
  - <span class="accent-text">mode</span>        : Toggle Dev / Gamer visual mode
  - <span class="accent-text">clear</span>       : Clear CLI terminal
  - <span class="accent-text">exit</span>        : Close CLI window`,
        
        'whoami': `Syed Ashhar Imam [Alias: Professor Nobody]
Professional: Software Developer | AI-Assisted Software Engineer | Builder
Location: Prayagraj, Uttar Pradesh, India
Current: Software Development Intern @ The Web Wolves
Flagship: Founder / Product Developer @ HowlBot (https://howlbot.in)
Philosophy: Full engineering ownership across architecture, AI acceleration, and code verification.`,

        'experience': `1. The Web Wolves
   - Role: Software Development Intern
   - Location: Prayagraj, Uttar Pradesh, India
   - Focus: Business websites, software solutions, workflow automation.
2. HowlBot (howlbot.in)
   - Role: Founder / Product Developer
   - Scope: Multi-tenant SaaS, concurrency-safe booking logic, salon/spa automation, messaging.`,

        'flagship': `HowlBot — Multi-Tenant Business Automation Platform (https://howlbot.in)
Features:
  - Multi-tenant isolated architecture
  - Business-specific workflow configuration
  - Salon & Spa appointment lifecycle management
  - Concurrency-safe booking logic & double-booking prevention
  - Messaging integrations & automated conversational communication`,

        'howlbot': `Visit HowlBot at: https://howlbot.in
Multi-tenant SaaS platform focused on business automation and conversational customer interactions.`,

        'projects': `Featured & Open-Source Projects:
1. HowlBot                   : Multi-Tenant Business Automation Platform (howlbot.in)
2. 2D Open-World Portfolio   : Canvas-based driving engine with arcade physics (Vite, Canvas API)
3. ClearLedger               : Offline-first personal expense ledger app (Flutter, Dart)
4. Mouse Gesture Controller  : Touchless cursor control using computer vision (Python, OpenCV, PyAutoGUI)
5. Python WhatsApp AI Bot    : Webhook-driven bot with Meta Cloud API & LLM integration (Python, Flask)
6. Discord Advance RPC       : Customizable rich presence client utility (Node.js)
7. Self-Hosted Homelab       : Dockerized Jellyfin & rclone cloud storage on headless Ubuntu Linux`,

        'skills': `TECHNICAL SKILLS & INVENTORY:
[Applied in Projects]:
  - Languages  : Python, JavaScript (ES6+), Dart / Flutter, HTML5, CSS3, C/C++
  - Backend    : Linux (Ubuntu), Docker, REST APIs, Webhook Handlers, Git/GitHub
  - Systems    : Concurrency-Safe Booking Logic, Multi-Tenant Architecture, Cloud Storage Mounts
[Methodology & Exploration]:
  - AI Dev     : AI Coding Assistant Workflows, Prompt Architecture, Spec & Code Review
  - Exploring  : LLM Applications, Distributed Systems, High-Concurrency Queues`,

        'education': `Bachelor of Technology (B.Tech)
Branch: Computer Science and Engineering
Institution: Radharaman Institute of Technology & Science
Focus: Data Structures, Operating Systems, DBMS, OOP, Networking, Software Engineering`,

        'operations': `Esports & Event Operations:
1. Omen Valorant Campus Quest Season 3 — Bhopal Point of Contact (Logistics & Player Communication)
2. BMSD 2025 — Esports event operations & tournament flow coordination
3. Professor Nobody — Gaming streams, tactical breakdowns & tech troubleshooting guides on YouTube`,

        'contact': `Direct Communication Channels:
  - Email:    ashhar.thewebwolves@gmail.com
  - Phone:    +91 9060424160
  - LinkedIn: https://www.linkedin.com/in/syed-ashhar-imam-38223a216/
  - GitHub:   https://github.com/Professor-Nobody
  - Location: Prayagraj, Uttar Pradesh, India`,

        'sudo': `Nice try, but you are not in the sudoers file. This incident will be reported.`,

        'coffee': `Permission denied: Caffeine levels currently optimal. Keep building! ☕`,

        'sudo coffee': `[OK] Brewing high-octane engineering roast... ☕ Complete!`,

        'clear': 'CLEAR_CMD',

        'mode': 'TOGGLE_MODE_CMD',

        'exit': 'EXIT_CMD'
    };

    if (cliInputField) {
        cliInputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawVal = cliInputField.value.trim();
                const cmd = rawVal.toLowerCase();
                cliInputField.value = '';

                playSound(500, 'square', 0.04);

                if (!cmd) return;

                // Output command prompt line
                const promptLine = document.createElement('div');
                promptLine.innerHTML = `<span style="color: var(--theme-primary);">prof-nobody@system:~$</span> ${escapeHtml(rawVal)}`;
                cliOutput.appendChild(promptLine);

                if (cmd === 'clear') {
                    cliOutput.innerHTML = '';
                    return;
                }

                if (cmd === 'exit' || cmd === 'close') {
                    closeTerminal();
                    return;
                }

                if (cmd === 'mode') {
                    toggleMode();
                    const modeMsg = document.createElement('div');
                    modeMsg.style.color = 'var(--accent-amber)';
                    modeMsg.textContent = `[SYSTEM] Switched to ${state.isGamerMode ? 'GAMER MODE' : 'DEV MODE'}`;
                    cliOutput.appendChild(modeMsg);
                    cliOutput.scrollTop = cliOutput.scrollHeight;
                    return;
                }

                const responseDiv = document.createElement('div');
                responseDiv.style.margin = '0.3rem 0 0.8rem 0';
                responseDiv.style.color = 'var(--text-muted)';
                responseDiv.style.whiteSpace = 'pre-wrap';

                if (commands[cmd]) {
                    responseDiv.innerHTML = commands[cmd];
                } else {
                    responseDiv.innerHTML = `<span style="color: var(--accent-red);">command not found: ${escapeHtml(cmd)}</span>. Type <span style="color: var(--theme-primary);">help</span> for available commands.`;
                }

                cliOutput.appendChild(responseDiv);
                cliOutput.scrollTop = cliOutput.scrollHeight;
            }
        });
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Shortcut to open CLI with '~' or '`' key
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            if (termModal && termModal.classList.contains('active')) {
                closeTerminal();
            } else {
                openTerminal();
            }
        }
        if (e.key === 'Escape' && termModal && termModal.classList.contains('active')) {
            closeTerminal();
        }
    });

    // --- 9. KONAMI CODE EASTER EGG ---
    document.addEventListener('keydown', (e) => {
        state.konamiSequence.push(e.key);
        if (state.konamiSequence.length > state.konamiTarget.length) {
            state.konamiSequence.shift();
        }

        if (state.konamiSequence.join(',') === state.konamiTarget.join(',')) {
            triggerKonamiEgg();
            state.konamiSequence = [];
        }
    });

    function triggerKonamiEgg() {
        playSound(880, 'sawtooth', 0.4);
        alert('🎉 KONAMI CODE UNLOCKED! Welcome to Professor Nobody secret mode.');
        toggleMode();
    }
});
