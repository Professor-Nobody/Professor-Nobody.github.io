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
            modeBadge.textContent = 'GAMER MODE';
        } else {
            body.classList.remove('gamer-mode');
            modeLabel.textContent = 'DEV MODE';
            modeIcon.textContent = '💻';
            modeBadge.textContent = 'DEV MODE';
        }
    }

    modeToggleBtn.addEventListener('click', toggleMode);

    // --- 5. SFX TOGGLE ---
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

    // --- 6. CUSTOM CROSSHAIR CURSOR ---
    if (window.innerWidth > 600) {
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            
            // Smooth ring tracking
            cursorRing.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 150, fill: 'forwards' });
        });

        // Hover scale effect for interactive elements
        const hoverables = document.querySelectorAll('a, button, .project-card, .hud-btn, .social-btn');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                body.classList.add('cursor-hover');
                playSound(800, 'triangle', 0.03);
            });
            el.addEventListener('mouseleave', () => {
                body.classList.remove('cursor-hover');
            });
        });
    }

    // --- 7. INTERACTIVE TERMINAL CLI ---
    function openTerminal() {
        termModal.classList.add('active');
        cliInputField.focus();
        playSound(400, 'sine', 0.06);
    }

    function closeTerminal() {
        termModal.classList.remove('active');
        playSound(300, 'sine', 0.06);
    }

    termOpenBtn.addEventListener('click', openTerminal);
    termCloseBtn.addEventListener('click', closeTerminal);
    termCloseDot.addEventListener('click', closeTerminal);

    termModal.addEventListener('click', (e) => {
        if (e.target === termModal) closeTerminal();
    });

    // Terminal Commands Logic
    const commands = {
        'help': `Available Commands:
  - <span class="accent-text">whoami</span>     : Display bio info
  - <span class="accent-text">projects</span>   : List core infrastructure projects
  - <span class="accent-text">gaming</span>     : View gaming & esports role
  - <span class="accent-text">skills</span>     : View primary system loadout
  - <span class="accent-text">sudo</span>       : Run command with superuser privileges
  - <span class="accent-text">coffee</span>     : Request caffeine refill
  - <span class="accent-text">mode</span>       : Toggle Dev/Gamer visual theme
  - <span class="accent-text">clear</span>      : Clear CLI screen
  - <span class="accent-text">exit</span>       : Close CLI window`,
        
        'whoami': `Syed Ashhar Imam (aka "Professor Nobody")
Location: Bhopal, Madhya Pradesh, India
Role: B.Tech CSE Student, Gamer, Tech & Infrastructure Enthusiast.
Motto: "It works. Don't ask why."`,

        'projects': `1. Self-Hosted NAS & Media Server (Google Drive + rclone + Jellyfin + Docker)
2. Linux Workstation & Dotfiles Automation (Shell, Systemd, Networking)
3. Esports & Tournament Operations Hub (Python, Discord API, Webhooks)
4. Local Service Health Dashboard (Docker stats, Nginx)`,

        'gaming': `Main Game: Valorant ( Tac-FPS & Streaming )
Other Titles: BGMI, Call of Duty Mobile, Genshin Impact
Esports Role: Management & Organizational Involvement (Behind the scenes)
Identity: Professor Nobody`,

        'skills': `CODE: Python, C/C++, JavaScript
SYSTEMS: Linux, Docker, Networking, Self-hosting
TOOLS: Git, GitHub, rclone, Jellyfin`,

        'sudo': `Nice try, but you are not in the sudoers file. This incident will be reported.`,

        'coffee': `Permission denied: You haven't had enough caffeine to request another cup. ☕`,

        'sudo coffee': `[OK] Brewing 100% pure caffeine stream... ☕ Success!`,

        'clear': 'CLEAR_CMD',

        'mode': 'TOGGLE_MODE_CMD',

        'exit': 'EXIT_CMD'
    };

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

            if (commands[cmd]) {
                responseDiv.innerHTML = commands[cmd];
            } else {
                responseDiv.innerHTML = `<span style="color: var(--accent-red);">command not found: ${escapeHtml(cmd)}</span>. Type <span style="color: var(--theme-primary);">help</span> for available commands.`;
            }

            cliOutput.appendChild(responseDiv);
            cliOutput.scrollTop = cliOutput.scrollHeight;
        }
    });

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Shortcut to open CLI with '~' key or 'Ctrl + T'
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            if (termModal.classList.contains('active')) {
                closeTerminal();
            } else {
                openTerminal();
            }
        }
        if (e.key === 'Escape' && termModal.classList.contains('active')) {
            closeTerminal();
        }
    });

    // --- 8. KONAMI CODE EASTER EGG ---
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
        alert('🎉 KONAMI CODE UNLOCKED! Professor Nobody level cheat code activated.');
        toggleMode();
    }
});
