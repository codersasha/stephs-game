/**
 * Player username (account name) — separate from your warrior cat name.
 * Worldwide uniqueness when window.WC_USERNAME_DB_URL is set (Firebase RTDB).
 * See USERNAME_REGISTRY.md for setup.
 */
(function () {
    const STORAGE_USERNAME = 'warriorcats_player_username';
    const STORAGE_LOCAL_TAKEN = 'warriorcats_local_reserved_usernames';

    function getDbBase() {
        const u = (typeof window !== 'undefined' && window.WC_USERNAME_DB_URL) || '';
        return typeof u === 'string' ? u.replace(/\/+$/, '') : '';
    }

    function encodeFirebaseKey(name) {
        return String(name)
            .replace(/[.#$\[\]/\s]/g, '_')
            .slice(0, 96);
    }

    function normalizeUsername(raw) {
        if (raw == null) return '';
        return String(raw).trim().toLowerCase();
    }

    function validateFormat(norm) {
        if (norm.length < 3) return { ok: false, message: 'Use at least 3 characters.' };
        if (norm.length > 24) return { ok: false, message: 'Maximum 24 characters.' };
        if (!/^[a-z0-9_]+$/.test(norm)) {
            return { ok: false, message: 'Only letters, numbers, and underscores (no spaces).' };
        }
        return { ok: true };
    }

    function hasPlayerUsername() {
        const v = localStorage.getItem(STORAGE_USERNAME);
        return !!(v && v.trim());
    }

    function getPlayerUsername() {
        return (localStorage.getItem(STORAGE_USERNAME) || '').trim();
    }

    function setPlayerUsername(norm) {
        localStorage.setItem(STORAGE_USERNAME, norm);
    }

    /** When no cloud DB: reserve names only on this browser (best-effort). */
    function claimLocalOnly(norm) {
        try {
            const raw = localStorage.getItem(STORAGE_LOCAL_TAKEN);
            const set = new Set(raw ? JSON.parse(raw) : []);
            if (set.has(norm)) {
                return { ok: false, reason: 'taken', localOnly: true };
            }
            set.add(norm);
            localStorage.setItem(STORAGE_LOCAL_TAKEN, JSON.stringify([...set]));
            return { ok: true, localOnly: true };
        } catch (e) {
            return { ok: false, reason: 'error', message: 'Could not save locally.' };
        }
    }

    /**
     * Claim username globally (Firebase RTDB) or locally if WC_USERNAME_DB_URL is unset.
     * RTDB rules: see USERNAME_REGISTRY.md
     */
    async function claimUsername(rawInput) {
        const norm = normalizeUsername(rawInput);
        const fmt = validateFormat(norm);
        if (!fmt.ok) {
            return { ok: false, reason: 'invalid', message: fmt.message };
        }

        const base = getDbBase();
        if (!base) {
            return claimLocalOnly(norm);
        }

        const key = encodeFirebaseKey(norm);
        const url = `${base}/wc_usernames/${key}.json`;

        try {
            const checkRes = await fetch(url);
            if (checkRes.ok) {
                const existing = await checkRes.json();
                if (existing !== null && existing !== undefined) {
                    return { ok: false, reason: 'taken', message: 'That name is already taken.' };
                }
            }

            const putRes = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ t: Date.now() })
            });

            if (putRes.status === 401 || putRes.status === 403) {
                return {
                    ok: false,
                    reason: 'config',
                    message: 'Server rejected the name (check database rules).'
                };
            }

            if (!putRes.ok) {
                const txt = await putRes.text();
                if (/permission|denied/i.test(txt) || putRes.status === 400) {
                    return { ok: false, reason: 'taken', message: 'That name is already taken.' };
                }
                return { ok: false, reason: 'network', message: 'Could not reach name server. Try again.' };
            }

            return { ok: true, localOnly: false };
        } catch (e) {
            return { ok: false, reason: 'network', message: 'Network error. Check your connection.' };
        }
    }

    function updateOfflineNote() {
        const el = document.getElementById('username-fr-offline-note');
        if (!el) return;
        if (getDbBase()) {
            el.textContent = '';
            el.classList.add('hidden');
        } else {
            el.textContent =
                'No worldwide database URL is set on this copy of the game — names are only checked on this device. ' +
                'See USERNAME_REGISTRY.md to enable global uniqueness.';
            el.classList.remove('hidden');
        }
    }

    function showGate(show) {
        const gate = document.getElementById('username-first-run-gate');
        const home = document.getElementById('home-screen');
        if (!gate || !home) return;
        if (show) {
            gate.classList.remove('hidden');
            home.classList.add('username-gate-active');
            updateOfflineNote();
        } else {
            gate.classList.add('hidden');
            home.classList.remove('username-gate-active');
        }
    }

    let gateListenersBound = false;

    function revealUsernameForm() {
        const stepWrap = document.getElementById('username-fr-step-btn-wrap');
        const form = document.getElementById('username-fr-form');
        const input = document.getElementById('username-fr-input');
        if (stepWrap) stepWrap.classList.add('hidden');
        if (form) form.classList.remove('hidden');
        input?.focus();
    }

    /** Show gate and form (e.g. user tried to start without a name). */
    function promptUsername() {
        showGate(true);
        revealUsernameForm();
        updateOfflineNote();
    }

    function initUsernameGate() {
        const gate = document.getElementById('username-first-run-gate');
        if (!gate) return;

        if (hasPlayerUsername()) {
            showGate(false);
            return;
        }

        showGate(true);

        if (gateListenersBound) {
            return;
        }
        gateListenersBound = true;

        const revealBtn = document.getElementById('username-fr-reveal-btn');
        const stepWrap = document.getElementById('username-fr-step-btn-wrap');
        const form = document.getElementById('username-fr-form');
        const input = document.getElementById('username-fr-input');
        const submitBtn = document.getElementById('username-fr-submit');
        const errEl = document.getElementById('username-fr-error');

        function setError(msg) {
            if (errEl) {
                errEl.textContent = msg || '';
            }
        }

        if (revealBtn && form && stepWrap) {
            revealBtn.addEventListener('click', () => {
                stepWrap.classList.add('hidden');
                form.classList.remove('hidden');
                input?.focus();
            });
        }

        async function doSubmit() {
            setError('');
            const raw = input ? input.value : '';
            const norm = normalizeUsername(raw);
            const fmt = validateFormat(norm);
            if (!fmt.ok) {
                setError(fmt.message);
                return;
            }
            if (submitBtn) submitBtn.disabled = true;
            const result = await claimUsername(raw);
            if (submitBtn) submitBtn.disabled = false;

            if (!result.ok) {
                setError(result.message || 'Could not save that name.');
                return;
            }

            setPlayerUsername(norm);
            showGate(false);
            if (typeof showMessage === 'function') {
                showMessage(`Welcome, ${norm}! Your player name is saved.`);
            }
        }

        submitBtn?.addEventListener('click', doSubmit);
        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                doSubmit();
            }
        });
    }

    window.WarriorCatsUsername = {
        hasPlayerUsername,
        getPlayerUsername,
        normalizeUsername,
        validateFormat,
        claimUsername,
        initUsernameGate,
        showUsernameGate: () => showGate(true),
        promptUsername,
        getDbBase
    };
})();
