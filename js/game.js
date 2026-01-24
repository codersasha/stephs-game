// Warrior Cats Game - Main Game Logic

// Game State
const GameState = {
    currentScreen: 'home',
    selectedClan: null,
    selectedSlot: null,
    catData: null,
    tutorialPage: 1,
    isNewGame: false,
    // Cat customization
    customization: {
        furColor: '#e67e22',
        furColorName: 'orange',
        pattern: 'solid',
        eyeColor: '#2ecc71',
        eyeColorName: 'green',
        startingRank: 'kit',
        nameSuffix: 'kit',
        startingAge: 0,
        randomSuffix: ''
    },
    // Player position in camp
    playerX: 200,
    playerY: 200,
    // Current location
    currentLocation: 'camp',
    // Collected herbs
    herbs: [],
    // Day/night cycle
    isNight: false,
    dayStartTime: null,
    mealsToday: 0,
    drinksToday: 0,
    isGatheringNight: false,
    // Emotion/pose
    currentEmotion: 'normal',
    isSitting: false,
    isSleeping: false,
    isHiding: false
};

// NPC Cats in the clan
const CLAN_CATS = [
    { name: 'Brambleclaw', rank: 'Warrior', furColor: '#8B4513', pattern: 'tabby' },
    { name: 'Sandstorm', rank: 'Warrior', furColor: '#F4A460', pattern: 'solid' },
    { name: 'Graystripe', rank: 'Warrior', furColor: '#808080', pattern: 'solid' },
    { name: 'Dustpelt', rank: 'Warrior', furColor: '#8B7355', pattern: 'tabby' },
    { name: 'Cloudtail', rank: 'Warrior', furColor: '#FFFFFF', pattern: 'solid' },
    { name: 'Brightheart', rank: 'Warrior', furColor: '#FFA500', pattern: 'patched' },
    { name: 'Leafpool', rank: 'Medicine Cat', furColor: '#D2B48C', pattern: 'tabby' },
    { name: 'Firestar', rank: 'Leader', furColor: '#FF4500', pattern: 'solid' },
    { name: 'Squirrelpaw', rank: 'Apprentice', furColor: '#CD853F', pattern: 'solid' },
    { name: 'Spiderpaw', rank: 'Apprentice', furColor: '#2F2F2F', pattern: 'solid' },
    // Kits in the nursery!
    { name: 'Molekit', rank: 'Kit', furColor: '#8B7355', pattern: 'solid', eyeColor: '#f1c40f' },
    { name: 'Cherrykit', rank: 'Kit', furColor: '#CD853F', pattern: 'patched', eyeColor: '#27ae60' },
    { name: 'Lilykit', rank: 'Kit', furColor: '#D2B48C', pattern: 'tabby', eyeColor: '#3498db' },
    { name: 'Seedkit', rank: 'Kit', furColor: '#F5DEB3', pattern: 'solid', eyeColor: '#f1c40f' },
    { name: 'Honeykit', rank: 'Kit', furColor: '#FFD700', pattern: 'spotted', eyeColor: '#27ae60' }
];

// Herb types (no emojis)
const HERBS = {
    cobweb: { name: 'Cobweb', heals: 15, desc: 'Stops bleeding' },
    catmint: { name: 'Catmint', heals: 30, desc: 'Cures greencough' },
    marigold: { name: 'Marigold', heals: 20, desc: 'Heals wounds' },
    poppy: { name: 'Poppy Seeds', heals: 10, desc: 'Helps sleep' },
    juniper: { name: 'Juniper Berries', heals: 25, desc: 'Strength' },
    dock: { name: 'Dock Leaves', heals: 15, desc: 'Soothes scratches' }
};

// Camp locations/dens (no emojis)
const CAMP_LOCATIONS = {
    nursery: { x: 50, y: 280, width: 80, height: 60, name: 'Nursery' },
    elders: { x: 320, y: 280, width: 80, height: 60, name: "Elders' Den" },
    warriors: { x: 50, y: 150, width: 80, height: 60, name: "Warriors' Den" },
    apprentices: { x: 320, y: 150, width: 80, height: 60, name: "Apprentices' Den" },
    medicine: { x: 185, y: 80, width: 80, height: 60, name: 'Medicine Den' },
    leader: { x: 185, y: 280, width: 80, height: 60, name: "Leader's Den" },
    highrock: { x: 185, y: 180, width: 80, height: 50, name: 'High Rock' },
    freshkill: { x: 100, y: 220, width: 50, height: 40, name: 'Fresh-kill Pile' },
    exit: { x: 370, y: 30, width: 50, height: 50, name: 'Camp Exit' }
};

// Name suffixes for different ranks
const NAME_SUFFIXES = {
    kit: 'kit',
    apprentice: 'paw',
    warrior: ['storm', 'tail', 'step', 'stripe', 'fur', 'claw', 'heart', 'pelt', 'whisker', 'fang', 'cloud', 'leaf', 'shine', 'frost', 'blaze']
};

// Clans
const CLANS = {
    thunder: { name: 'ThunderClan', color: '#ff9800' },
    river: { name: 'RiverClan', color: '#2196f3' },
    wind: { name: 'WindClan', color: '#8bc34a' },
    shadow: { name: 'ShadowClan', color: '#673ab7' },
    loner: { name: 'Loner', color: '#8a7a6a' }
};

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    initHomeScreen();
    setupEventListeners();
    createCatsSVG();
});

// Create warrior cats SVG scene
function createCatsSVG() {
    const catsScene = document.getElementById('cats-scene');
    catsScene.innerHTML = `
        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Ground -->
            <ellipse cx="200" cy="190" rx="180" ry="20" fill="#1a3a2e"/>
            
            <!-- Moon -->
            <circle cx="350" cy="40" r="25" fill="#ffd700" opacity="0.9"/>
            <circle cx="340" cy="35" r="20" fill="#0d1b2a"/>
            
            <!-- Cat 1 - Orange tabby (ThunderClan style) -->
            <g transform="translate(50, 100)">
                <!-- Body -->
                <ellipse cx="40" cy="50" rx="35" ry="25" fill="#d35400"/>
                <ellipse cx="40" cy="50" rx="32" ry="22" fill="#e67e22"/>
                <!-- Stripes -->
                <path d="M25 35 Q30 50 25 65" stroke="#c0392b" stroke-width="3" fill="none"/>
                <path d="M40 30 Q45 50 40 70" stroke="#c0392b" stroke-width="3" fill="none"/>
                <path d="M55 35 Q50 50 55 65" stroke="#c0392b" stroke-width="3" fill="none"/>
                <!-- Head -->
                <circle cx="75" cy="35" r="20" fill="#e67e22"/>
                <!-- Ears -->
                <polygon points="60,20 65,0 75,15" fill="#e67e22"/>
                <polygon points="85,15 95,0 90,20" fill="#e67e22"/>
                <polygon points="63,18 67,5 73,15" fill="#ffb6c1"/>
                <polygon points="87,15 92,5 88,18" fill="#ffb6c1"/>
                <!-- Face -->
                <ellipse cx="70" cy="35" rx="3" ry="4" fill="#2c3e50"/>
                <ellipse cx="82" cy="35" rx="3" ry="4" fill="#2c3e50"/>
                <ellipse cx="76" cy="42" rx="3" ry="2" fill="#ffb6c1"/>
                <!-- Tail -->
                <path d="M5 50 Q-15 30 -10 15" stroke="#e67e22" stroke-width="8" fill="none" stroke-linecap="round"/>
            </g>
            
            <!-- Cat 2 - Gray cat (RiverClan style) -->
            <g transform="translate(150, 110)">
                <!-- Body -->
                <ellipse cx="40" cy="45" rx="30" ry="22" fill="#5d6d7e"/>
                <ellipse cx="40" cy="45" rx="27" ry="19" fill="#85929e"/>
                <!-- Head -->
                <circle cx="70" cy="30" r="18" fill="#85929e"/>
                <!-- Ears -->
                <polygon points="57,15 60,-3 70,10" fill="#85929e"/>
                <polygon points="78,10 88,-3 83,15" fill="#85929e"/>
                <polygon points="59,13 62,2 68,10" fill="#ffb6c1"/>
                <polygon points="80,10 86,2 82,13" fill="#ffb6c1"/>
                <!-- Face -->
                <ellipse cx="64" cy="30" rx="2.5" ry="3.5" fill="#2c3e50"/>
                <ellipse cx="76" cy="30" rx="2.5" ry="3.5" fill="#2196f3"/>
                <ellipse cx="70" cy="36" rx="2.5" ry="1.5" fill="#ffb6c1"/>
                <!-- Tail -->
                <path d="M10 45 Q-5 60 5 75" stroke="#85929e" stroke-width="7" fill="none" stroke-linecap="round"/>
            </g>
            
            <!-- Cat 3 - Black cat (ShadowClan style) - in fighting pose -->
            <g transform="translate(250, 95)">
                <!-- Body -->
                <ellipse cx="40" cy="55" rx="32" ry="24" fill="#1a1a2e" transform="rotate(-15 40 55)"/>
                <ellipse cx="40" cy="55" rx="29" ry="21" fill="#2c2c4a" transform="rotate(-15 40 55)"/>
                <!-- Head -->
                <circle cx="78" cy="30" r="19" fill="#2c2c4a"/>
                <!-- Ears -->
                <polygon points="63,15 68,-5 78,12" fill="#2c2c4a"/>
                <polygon points="88,12 98,-5 93,15" fill="#2c2c4a"/>
                <polygon points="66,13 70,0 76,11" fill="#ffb6c1"/>
                <polygon points="90,11 95,0 91,13" fill="#ffb6c1"/>
                <!-- Glowing eyes -->
                <ellipse cx="72" cy="30" rx="3" ry="4" fill="#ffd700"/>
                <ellipse cx="85" cy="30" rx="3" ry="4" fill="#ffd700"/>
                <ellipse cx="72" cy="30" rx="1" ry="3" fill="#1a1a2e"/>
                <ellipse cx="85" cy="30" rx="1" ry="3" fill="#1a1a2e"/>
                <ellipse cx="78" cy="38" rx="3" ry="2" fill="#4a4a6a"/>
                <!-- Raised paw -->
                <path d="M95 45 L110 30 L115 35 L100 50" fill="#2c2c4a"/>
                <!-- Tail -->
                <path d="M8 60 Q-10 45 -5 25" stroke="#2c2c4a" stroke-width="8" fill="none" stroke-linecap="round"/>
            </g>
            
            <!-- Stars -->
            <circle cx="50" cy="20" r="2" fill="white" opacity="0.8"/>
            <circle cx="100" cy="35" r="1.5" fill="white" opacity="0.6"/>
            <circle cx="150" cy="15" r="2" fill="white" opacity="0.9"/>
            <circle cx="280" cy="25" r="1.5" fill="white" opacity="0.7"/>
            <circle cx="320" cy="70" r="2" fill="white" opacity="0.8"/>
        </svg>
    `;
}

// Setup all event listeners
function setupEventListeners() {
    // Home screen - any key or touch to start
    document.getElementById('home-screen').addEventListener('click', startGame);
    document.getElementById('home-screen').addEventListener('touchstart', startGame);
    document.addEventListener('keydown', (e) => {
        if (GameState.currentScreen === 'home') {
            startGame();
        }
    });

    // Clan selection
    document.querySelectorAll('.clan-btn').forEach(btn => {
        btn.addEventListener('click', () => selectClan(btn.dataset.clan));
    });

    // Save slots
    document.querySelectorAll('.save-slot').forEach(slot => {
        slot.addEventListener('click', () => selectSaveSlot(slot.dataset.slot));
    });
    
    // Delete save buttons
    document.querySelectorAll('.delete-save-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSaveSlot(btn.dataset.slot);
        });
    });

    // Back buttons
    document.getElementById('back-to-clan').addEventListener('click', () => showScreen('clan'));
    document.getElementById('back-to-saves').addEventListener('click', () => showScreen('saves'));

    // Name input
    const nameInput = document.getElementById('cat-name-input');
    nameInput.addEventListener('input', updateNamePreview);

    // Start game button
    document.getElementById('start-game-btn').addEventListener('click', beginAdventure);

    // Fur color selection
    document.querySelectorAll('#fur-colors .color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#fur-colors .color-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            GameState.customization.furColor = btn.dataset.color;
            GameState.customization.furColorName = btn.dataset.name;
            updateCatPreview();
        });
    });

    // Pattern selection
    document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            GameState.customization.pattern = btn.dataset.pattern;
            updateCatPreview();
        });
    });

    // Eye color selection
    document.querySelectorAll('#eye-colors .color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#eye-colors .color-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            GameState.customization.eyeColor = btn.dataset.color;
            GameState.customization.eyeColorName = btn.dataset.name;
            updateCatPreview();
        });
    });

    // Rank selection
    document.querySelectorAll('.rank-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.rank-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            GameState.customization.startingRank = btn.dataset.rank;
            GameState.customization.nameSuffix = btn.dataset.suffix;
            GameState.customization.startingAge = parseInt(btn.dataset.age);
            
            // Update the name suffix display
            const suffixSpan = document.getElementById('name-suffix');
            const nameInput = document.getElementById('cat-name-input');
            const fullNamePreview = document.getElementById('full-name-preview');
            
            if (btn.dataset.suffix) {
                suffixSpan.textContent = btn.dataset.suffix;
                suffixSpan.style.display = 'inline';
            } else {
                // Warriors, Medicine Cats, Queens, Elders get random suffix
                const suffixes = ['storm', 'tail', 'heart', 'fur', 'claw', 'stripe', 'pelt', 'leaf', 'flower', 'wing'];
                const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                GameState.customization.randomSuffix = randomSuffix;
                suffixSpan.textContent = randomSuffix;
                suffixSpan.style.display = 'inline';
            }
            
            // Update the full name preview
            const firstName = nameInput.value.trim() || '___';
            fullNamePreview.textContent = firstName + suffixSpan.textContent;
        });
    });

    // Movement buttons
    document.getElementById('move-up').addEventListener('click', () => movePlayer(0, -20));
    document.getElementById('move-down').addEventListener('click', () => movePlayer(0, 20));
    document.getElementById('move-left').addEventListener('click', () => movePlayer(-20, 0));
    document.getElementById('move-right').addEventListener('click', () => movePlayer(20, 0));
    
    // Keyboard movement
    document.addEventListener('keydown', handleKeyDown);
    
    // Action and inventory buttons
    document.getElementById('action-btn').addEventListener('click', checkLocationAction);
    document.getElementById('inventory-btn').addEventListener('click', showInventory);
    document.getElementById('close-popup').addEventListener('click', closePopup);
    document.getElementById('close-inventory').addEventListener('click', closeInventory);

    // StarClan buttons
    document.getElementById('stay-starclan').addEventListener('click', stayInStarClan);
    document.getElementById('visit-dreams').addEventListener('click', visitDreams);
    document.getElementById('restart-portal').addEventListener('click', restartGame);

    // Tutorial buttons
    document.getElementById('tutorial-prev').addEventListener('click', tutorialPrev);
    document.getElementById('tutorial-next').addEventListener('click', tutorialNext);
    
    // Tutorial dots
    document.querySelectorAll('.tutorial-dots .dot').forEach(dot => {
        dot.addEventListener('click', () => goToTutorialPage(parseInt(dot.dataset.page)));
    });
    
    // Emotion/action buttons
    document.getElementById('emote-happy').addEventListener('click', () => setEmotion('happy'));
    document.getElementById('emote-sad').addEventListener('click', () => doSad());
    document.getElementById('emote-mad').addEventListener('click', () => setEmotion('mad'));
    document.getElementById('emote-purr').addEventListener('click', () => doPurr());
    document.getElementById('emote-hiss').addEventListener('click', () => doHiss());
    document.getElementById('emote-sit').addEventListener('click', () => toggleSit());
    document.getElementById('emote-hide').addEventListener('click', () => toggleHide());
    document.getElementById('emote-sleep').addEventListener('click', () => toggleRest());
    document.getElementById('emote-meow').addEventListener('click', () => doMeow());
    document.getElementById('emote-talk').addEventListener('click', () => openSpeechPopup());
    document.getElementById('emote-attack').addEventListener('click', () => doAttack());
    
    // Speech popup
    document.getElementById('say-speech').addEventListener('click', () => sayPlayerSpeech());
    document.getElementById('cancel-speech').addEventListener('click', () => closeSpeechPopup());
    document.getElementById('speech-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sayPlayerSpeech();
    });
    
    // Quick speech buttons
    document.querySelectorAll('.quick-speech-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('speech-input').value = btn.dataset.text;
            sayPlayerSpeech();
        });
    });
}

// Initialize home screen
function initHomeScreen() {
    showScreen('home');
}

// Show a specific screen
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
    GameState.currentScreen = screenName;
}

// Start the game (from home screen)
function startGame() {
    if (GameState.currentScreen === 'home') {
        showScreen('clan');
    }
}

// Select a clan
function selectClan(clanId) {
    GameState.selectedClan = clanId;
    updateSaveSlots();
    showScreen('saves');
}

// Update save slots display
function updateSaveSlots() {
    for (let i = 1; i <= 3; i++) {
        const saveData = loadSaveData(i);
        const slotElement = document.querySelector(`.save-slot[data-slot="${i}"]`);
        const slotInfo = slotElement.querySelector('.slot-info');
        const deleteBtn = document.querySelector(`.delete-save-btn[data-slot="${i}"]`);
        
        if (saveData) {
            // Show existing save with clan info
            const clanName = CLANS[saveData.clan]?.name || 'Unknown Clan';
            slotInfo.textContent = `${saveData.name} - ${saveData.rank} (${saveData.age} moons) - ${clanName}`;
            slotElement.classList.add('has-save');
            deleteBtn.classList.remove('hidden');
        } else {
            slotInfo.textContent = `New Game - ${CLANS[GameState.selectedClan].name}`;
            slotElement.classList.remove('has-save');
            deleteBtn.classList.add('hidden');
        }
    }
}

// Load save data from localStorage
function loadSaveData(slot) {
    const data = localStorage.getItem(`warriorcats_save_${slot}`);
    return data ? JSON.parse(data) : null;
}

// Save game data to localStorage
function saveGameData() {
    if (GameState.selectedSlot && GameState.catData) {
        localStorage.setItem(
            `warriorcats_save_${GameState.selectedSlot}`,
            JSON.stringify(GameState.catData)
        );
    }
}

// Select a save slot
function selectSaveSlot(slot) {
    GameState.selectedSlot = slot;
    const saveData = loadSaveData(slot);
    
    if (saveData) {
        // Load existing game (use saved clan, not selected one)
        GameState.catData = saveData;
        GameState.selectedClan = saveData.clan;
        startGameplay();
    } else {
        // New game - go to name screen
        initNameScreen();
        showScreen('name');
    }
}

// Delete a save slot
function deleteSaveSlot(slot) {
    const saveData = loadSaveData(slot);
    if (!saveData) return;
    
    if (confirm(`Are you sure you want to delete ${saveData.name}'s save?`)) {
        localStorage.removeItem(`warriorcats_save_${slot}`);
        updateSaveSlots();
        showMessage('🗑️ Save deleted!');
    }
}

// Update name preview
function updateNamePreview() {
    const nameInput = document.getElementById('cat-name-input');
    const preview = document.getElementById('full-name-preview');
    const startBtn = document.getElementById('start-game-btn');
    const suffix = document.getElementById('name-suffix');
    
    const firstName = nameInput.value.trim();
    
    if (firstName.length > 0) {
        // Capitalize first letter
        const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        preview.textContent = formattedName + suffix.textContent;
        startBtn.disabled = false;
    } else {
        preview.textContent = '___' + suffix.textContent;
        startBtn.disabled = true;
    }
}

// Update cat preview in customization screen
function updateCatPreview() {
    const preview = document.getElementById('cat-preview');
    const { furColor, pattern, eyeColor } = GameState.customization;
    
    // Calculate darker shade for shadows
    const darkerFur = adjustColor(furColor, -30);
    const patternColor = adjustColor(furColor, -50);
    
    let patternMarkings = '';
    
    // Body is centered at (50, 55) with rx=32, ry=22
    if (pattern === 'tabby') {
        patternMarkings = `
            <path d="M30 45 Q35 55 30 65" stroke="${patternColor}" stroke-width="3" fill="none"/>
            <path d="M45 40 Q50 55 45 70" stroke="${patternColor}" stroke-width="3" fill="none"/>
            <path d="M60 42 Q65 55 60 68" stroke="${patternColor}" stroke-width="3" fill="none"/>
        `;
    } else if (pattern === 'spotted') {
        patternMarkings = `
            <circle cx="30" cy="50" r="4" fill="${patternColor}"/>
            <circle cx="45" cy="58" r="5" fill="${patternColor}"/>
            <circle cx="55" cy="48" r="4" fill="${patternColor}"/>
            <circle cx="65" cy="60" r="3" fill="${patternColor}"/>
        `;
    } else if (pattern === 'patched') {
        patternMarkings = `
            <ellipse cx="35" cy="55" rx="12" ry="10" fill="${patternColor}"/>
            <ellipse cx="60" cy="52" rx="10" ry="8" fill="${patternColor}"/>
        `;
    }
    
    preview.innerHTML = `
        <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Tail -->
            <path d="M15 55 Q0 35 5 15" stroke="${furColor}" stroke-width="10" fill="none" stroke-linecap="round"/>
            
            <!-- Back legs -->
            <rect x="25" y="68" width="10" height="22" rx="4" fill="${darkerFur}"/>
            <rect x="40" y="68" width="10" height="22" rx="4" fill="${furColor}"/>
            
            <!-- Front legs -->
            <rect x="65" y="68" width="10" height="22" rx="4" fill="${darkerFur}"/>
            <rect x="78" y="68" width="10" height="22" rx="4" fill="${furColor}"/>
            
            <!-- Paws -->
            <ellipse cx="30" cy="90" rx="6" ry="4" fill="${darkerFur}"/>
            <ellipse cx="45" cy="90" rx="6" ry="4" fill="${furColor}"/>
            <ellipse cx="70" cy="90" rx="6" ry="4" fill="${darkerFur}"/>
            <ellipse cx="83" cy="90" rx="6" ry="4" fill="${furColor}"/>
            
            <!-- Body -->
            <ellipse cx="50" cy="55" rx="35" ry="25" fill="${darkerFur}"/>
            <ellipse cx="50" cy="55" rx="32" ry="22" fill="${furColor}"/>
            ${patternMarkings}
            
            <!-- Head -->
            <circle cx="85" cy="40" r="22" fill="${furColor}"/>
            
            <!-- Ears -->
            <polygon points="68,22 73,0 85,18" fill="${furColor}"/>
            <polygon points="97,18 107,0 102,22" fill="${furColor}"/>
            <polygon points="71,20 75,6 83,17" fill="#ffb6c1"/>
            <polygon points="99,17 105,6 101,20" fill="#ffb6c1"/>
            
            <!-- Eyes -->
            <ellipse cx="78" cy="38" rx="5" ry="6" fill="white"/>
            <ellipse cx="92" cy="38" rx="5" ry="6" fill="white"/>
            <ellipse cx="78" cy="38" rx="3" ry="5" fill="${eyeColor}"/>
            <ellipse cx="92" cy="38" rx="3" ry="5" fill="${eyeColor}"/>
            <ellipse cx="78" cy="38" rx="1.5" ry="4" fill="#1a1a2e"/>
            <ellipse cx="92" cy="38" rx="1.5" ry="4" fill="#1a1a2e"/>
            
            <!-- Nose -->
            <ellipse cx="85" cy="48" rx="4" ry="3" fill="#ffb6c1"/>
            
            <!-- Whiskers -->
            <line x1="70" y1="46" x2="55" y2="44" stroke="#888" stroke-width="1"/>
            <line x1="70" y1="50" x2="55" y2="52" stroke="#888" stroke-width="1"/>
            <line x1="100" y1="46" x2="115" y2="44" stroke="#888" stroke-width="1"/>
            <line x1="100" y1="50" x2="115" y2="52" stroke="#888" stroke-width="1"/>
        </svg>
    `;
}

// Helper function to adjust color brightness
function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Initialize cat preview when going to name screen
function initNameScreen() {
    // Reset customization to defaults
    GameState.customization = {
        furColor: '#e67e22',
        furColorName: 'orange',
        pattern: 'solid',
        eyeColor: '#2ecc71',
        eyeColorName: 'green'
    };
    
    // Reset selection UI
    document.querySelectorAll('#fur-colors .color-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.color === '#e67e22');
    });
    document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.pattern === 'solid');
    });
    document.querySelectorAll('#eye-colors .color-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.color === '#2ecc71');
    });
    
    // Clear name input
    document.getElementById('cat-name-input').value = '';
    document.getElementById('full-name-preview').textContent = '___kit';
    document.getElementById('start-game-btn').disabled = true;
    
    // Render preview
    updateCatPreview();
}

// Begin the adventure (create new cat)
function beginAdventure() {
    const nameInput = document.getElementById('cat-name-input');
    const firstName = nameInput.value.trim();
    const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    
    // Check if starting as a loner
    const isLoner = GameState.selectedClan === 'loner';
    
    // Get the selected starting rank
    const startingRank = GameState.customization.startingRank || 'kit';
    const startingAge = GameState.customization.startingAge || 0;
    
    // Determine the name suffix and proper rank name
    let nameSuffix = '';
    let rankName = 'Kit';
    let experience = 0;
    let isDeputy = false;
    let isLeader = false;
    
    if (isLoner) {
        nameSuffix = '';
        rankName = 'Loner';
        experience = 50;
    } else {
        switch (startingRank) {
            case 'kit':
                nameSuffix = 'kit';
                rankName = 'Kit';
                experience = 0;
                break;
            case 'apprentice':
                nameSuffix = 'paw';
                rankName = 'Apprentice';
                experience = 20;
                break;
            case 'warrior':
                nameSuffix = GameState.customization.randomSuffix || 'heart';
                rankName = 'Warrior';
                experience = 100;
                break;
            case 'medicine':
                nameSuffix = GameState.customization.randomSuffix || 'leaf';
                rankName = 'Medicine Cat';
                experience = 150;
                break;
            case 'queen':
                nameSuffix = GameState.customization.randomSuffix || 'flower';
                rankName = 'Queen';
                experience = 80;
                break;
            case 'elder':
                nameSuffix = GameState.customization.randomSuffix || 'fur';
                rankName = 'Elder';
                experience = 200;
                break;
            case 'leader':
                nameSuffix = 'star';
                rankName = 'Leader';
                experience = 500;
                isLeader = true;
                break;
        }
    }
    
    const fullName = isLoner ? formattedName : formattedName + nameSuffix;
    
    // Create new cat data with customization
    GameState.catData = {
        firstName: formattedName,
        name: fullName,
        clan: isLoner ? 'Loner' : GameState.selectedClan,
        rank: rankName,
        age: isLoner ? 12 : startingAge,
        health: 100,
        hunger: isLoner ? 70 : 100,
        thirst: isLoner ? 70 : 100,
        experience: experience,
        isDeputy: isDeputy,
        isLeader: isLeader,
        lives: isLeader ? 9 : 1, // Leaders have 9 lives!
        isLoner: isLoner,
        inStarClan: false,
        hasSeenTutorial: false,
        // Save customization
        furColor: GameState.customization.furColor,
        furColorName: GameState.customization.furColorName,
        pattern: GameState.customization.pattern,
        eyeColor: GameState.customization.eyeColor,
        eyeColorName: GameState.customization.eyeColorName
    };
    
    saveGameData();
    
    // Show tutorial for new players
    GameState.isNewGame = true;
    GameState.tutorialPage = 1;
    updateTutorialPage();
    showScreen('tutorial');
}

// Tutorial navigation
function tutorialPrev() {
    if (GameState.tutorialPage > 1) {
        GameState.tutorialPage--;
        updateTutorialPage();
    }
}

function tutorialNext() {
    const totalPages = 4;
    if (GameState.tutorialPage < totalPages) {
        GameState.tutorialPage++;
        updateTutorialPage();
    } else {
        // Tutorial finished, start gameplay
        GameState.catData.hasSeenTutorial = true;
        saveGameData();
        startGameplay();
    }
}

function goToTutorialPage(page) {
    GameState.tutorialPage = page;
    updateTutorialPage();
}

function updateTutorialPage() {
    const totalPages = 4;
    const currentPage = GameState.tutorialPage;
    
    // Update pages
    document.querySelectorAll('.tutorial-page').forEach(page => {
        page.classList.remove('active');
    });
    document.querySelector(`.tutorial-page[data-page="${currentPage}"]`).classList.add('active');
    
    // Update dots
    document.querySelectorAll('.tutorial-dots .dot').forEach(dot => {
        dot.classList.remove('active');
    });
    document.querySelector(`.tutorial-dots .dot[data-page="${currentPage}"]`).classList.add('active');
    
    // Update buttons
    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');
    
    prevBtn.disabled = currentPage === 1;
    
    if (currentPage === totalPages) {
        nextBtn.textContent = "Let's Play! 🐱";
    } else {
        nextBtn.textContent = 'Next →';
    }
}

// Start the main gameplay
function startGameplay() {
    showScreen('game');
    updateGameUI();
    
    const cat = GameState.catData;
    
    // Loners start in the forest, clan cats start in camp
    if (cat.isLoner) {
        GameState.playerX = 300;
        GameState.playerY = 250;
        GameState.currentLocation = 'forest';
    } else {
        GameState.playerX = 225;
        GameState.playerY = 250;
        GameState.currentLocation = 'camp';
    }
    
    GameState.herbs = cat.herbs || [];
    
    // Set clan-specific background
    const gameWorld = document.getElementById('game-world');
    gameWorld.className = 'game-world ' + GameState.selectedClan;
    
    // Render the game world
    renderGameWorld();
    
    // Update herb count display
    document.getElementById('herb-count').textContent = GameState.herbs.length;
    
    // Start game loop
    startGameLoop();
    
    // Welcome message for loners
    if (cat.isLoner) {
        showMessage('You are a loner, living free in the forest. Hunt for yourself and stay alive!');
    }
}

// Update the game UI
function updateGameUI() {
    const cat = GameState.catData;
    
    document.getElementById('cat-name-display').textContent = cat.name;
    
    // Show lives for leaders
    if (cat.rank === 'Leader' && cat.lives) {
        document.getElementById('cat-rank').textContent = `${cat.rank} (${cat.lives} lives)`;
    } else {
        document.getElementById('cat-rank').textContent = cat.rank;
    }
    
    document.getElementById('cat-age').textContent = `${cat.age} moons`;
    
    document.getElementById('health-fill').style.width = `${cat.health}%`;
    document.getElementById('hunger-fill').style.width = `${cat.hunger}%`;
    document.getElementById('thirst-fill').style.width = `${cat.thirst}%`;
    
    // Hide attack button for kits
    const attackBtn = document.getElementById('emote-attack');
    if (attackBtn) {
        if (cat.rank === 'Kit') {
            attackBtn.style.display = 'none';
        } else {
            attackBtn.style.display = '';
        }
    }
}

// Render the game world (camp or forest)
function renderGameWorld() {
    const gameWorld = document.getElementById('game-world');
    
    if (GameState.currentLocation === 'camp') {
        renderCamp();
    } else {
        renderForest();
    }
}

// Render the camp with all dens
function renderCamp() {
    const gameWorld = document.getElementById('game-world');
    const clan = GameState.selectedClan;
    
    // Clan-specific colors with richer palettes
    const clanColors = {
        thunder: { ground: '#2a4a2a', accent: '#4d7a3d', light: '#6d9a5d', dark: '#1a3a1a' },
        river: { ground: '#1a3a4a', accent: '#2d5a7a', light: '#4d8aaa', dark: '#0a2a3a' },
        wind: { ground: '#4a4a3d', accent: '#6a6a5d', light: '#8a8a7d', dark: '#3a3a2d' },
        shadow: { ground: '#1a1a2a', accent: '#2d2d4d', light: '#4d4d6d', dark: '#0a0a1a' }
    };
    const colors = clanColors[clan] || clanColors.thunder;
    
    // Night overlay
    const nightOverlay = GameState.isNight ? 
        `<rect x="0" y="0" width="450" height="400" fill="rgba(10,10,40,0.5)"/>` : '';
    
    let worldHTML = `
        <svg id="camp-svg" viewBox="0 0 450 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
            <defs>
                <!-- Gradients for better visuals -->
                <radialGradient id="campGround" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${colors.ground};stop-opacity:1" />
                </radialGradient>
                <radialGradient id="denGradient" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" style="stop-color:#8B7355;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#5D4037;stop-opacity:1" />
                </radialGradient>
                <radialGradient id="waterGradient" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" style="stop-color:#5dade2;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2874a6;stop-opacity:1" />
                </radialGradient>
                <radialGradient id="rockGradient" cx="30%" cy="20%" r="80%">
                    <stop offset="0%" style="stop-color:#95a5a6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#566573;stop-opacity:1" />
                </radialGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.4"/>
                </filter>
                <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                </filter>
            </defs>
            
            <!-- Camp ground with gradient -->
            <rect x="0" y="0" width="450" height="400" fill="url(#campGround)"/>
            
            <!-- Ground texture - scattered leaves and grass -->
            <g opacity="0.3">
                <circle cx="50" cy="180" r="3" fill="#2d5a2d"/>
                <circle cx="380" cy="250" r="2" fill="#2d5a2d"/>
                <circle cx="120" cy="350" r="4" fill="#3d6a3d"/>
                <circle cx="300" cy="120" r="2" fill="#2d5a2d"/>
                <circle cx="180" cy="280" r="3" fill="#3d6a3d"/>
                <ellipse cx="350" cy="180" rx="5" ry="2" fill="#4a7a4a"/>
                <ellipse cx="100" cy="250" rx="4" ry="2" fill="#3d6a3d"/>
            </g>
            
            <!-- Bushes around camp edge -->
            <g filter="url(#softShadow)">
                <ellipse cx="20" cy="100" rx="25" ry="20" fill="#2d6a2d"/>
                <ellipse cx="430" cy="280" rx="30" ry="22" fill="#2d6a2d"/>
                <ellipse cx="15" cy="350" rx="22" ry="18" fill="#3d7a3d"/>
                <ellipse cx="440" cy="100" rx="20" ry="16" fill="#3d7a3d"/>
            </g>
            
            <!-- Dens with improved graphics -->
            
            <!-- Nursery - cozy with bramble covering -->
            <g class="camp-den" data-location="nursery" filter="url(#shadow)">
                <ellipse cx="90" cy="320" rx="55" ry="40" fill="#4a3527"/>
                <ellipse cx="90" cy="308" rx="50" ry="35" fill="url(#denGradient)"/>
                <ellipse cx="90" cy="302" rx="42" ry="28" fill="#7d6550" opacity="0.5"/>
                <!-- Entrance shadow -->
                <ellipse cx="90" cy="318" rx="18" ry="12" fill="#2a1a10"/>
                <text x="90" y="350" text-anchor="middle" fill="#f0e6d2" font-size="11" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">Nursery</text>
            </g>
            
            <!-- Elders Den -->
            <g class="camp-den" data-location="elders" filter="url(#shadow)">
                <ellipse cx="360" cy="320" rx="55" ry="40" fill="#3a2a1a"/>
                <ellipse cx="360" cy="308" rx="50" ry="35" fill="#5a4a3a"/>
                <ellipse cx="360" cy="302" rx="42" ry="28" fill="#7a6a5a" opacity="0.5"/>
                <ellipse cx="360" cy="318" rx="16" ry="10" fill="#1a1510"/>
                <text x="360" y="350" text-anchor="middle" fill="#f0e6d2" font-size="10" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">Elders Den</text>
            </g>
            
            <!-- Warriors Den - large and sturdy -->
            <g class="camp-den" data-location="warriors" filter="url(#shadow)">
                <ellipse cx="70" cy="160" rx="60" ry="45" fill="#2d3a2d"/>
                <ellipse cx="70" cy="148" rx="55" ry="40" fill="#3d5a3d"/>
                <ellipse cx="70" cy="142" rx="46" ry="32" fill="#4d6a4d" opacity="0.6"/>
                <ellipse cx="70" cy="156" rx="20" ry="12" fill="#1a2a1a"/>
                <text x="70" y="190" text-anchor="middle" fill="#f0e6d2" font-size="10" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">Warriors Den</text>
            </g>
            
            <!-- Apprentices Den -->
            <g class="camp-den" data-location="apprentices" filter="url(#shadow)">
                <ellipse cx="380" cy="160" rx="55" ry="40" fill="#2a3a4a"/>
                <ellipse cx="380" cy="148" rx="50" ry="35" fill="#3a5a6a"/>
                <ellipse cx="380" cy="142" rx="42" ry="28" fill="#4a6a7a" opacity="0.6"/>
                <ellipse cx="380" cy="156" rx="16" ry="10" fill="#1a2a3a"/>
                <text x="380" y="188" text-anchor="middle" fill="#f0e6d2" font-size="10" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">Apprentices</text>
            </g>
            
            <!-- Medicine Den - with fern cover -->
            <g class="camp-den" data-location="medicine" filter="url(#shadow)">
                <ellipse cx="225" cy="90" rx="60" ry="45" fill="#3a4a3a"/>
                <ellipse cx="225" cy="78" rx="55" ry="40" fill="#4a6a4a"/>
                <ellipse cx="225" cy="72" rx="46" ry="32" fill="#5a7a5a" opacity="0.6"/>
                <ellipse cx="225" cy="86" rx="18" ry="11" fill="#2a3a2a"/>
                <!-- Herb symbols -->
                <circle cx="200" cy="60" r="4" fill="#27ae60" opacity="0.7"/>
                <circle cx="250" cy="65" r="3" fill="#2ecc71" opacity="0.7"/>
                <text x="225" y="120" text-anchor="middle" fill="#f0e6d2" font-size="10" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">Medicine Den</text>
            </g>
            
            <!-- High Rock - imposing stone -->
            <g class="camp-den" data-location="highrock" filter="url(#shadow)">
                <polygon points="225,150 170,230 280,230" fill="#4a4a5a"/>
                <polygon points="225,155 180,225 270,225" fill="url(#rockGradient)"/>
                <polygon points="225,162 192,220 258,220" fill="#a0a0b0" opacity="0.3"/>
                <!-- Rock texture -->
                <line x1="200" y1="200" x2="210" y2="195" stroke="#6a6a7a" stroke-width="1" opacity="0.5"/>
                <line x1="240" y1="190" x2="255" y2="200" stroke="#6a6a7a" stroke-width="1" opacity="0.5"/>
                <text x="225" y="218" text-anchor="middle" fill="#f0e6d2" font-size="10" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">High Rock</text>
            </g>
            
            <!-- Leader's Den - beneath High Rock -->
            <g class="camp-den" data-location="leader" filter="url(#shadow)">
                <ellipse cx="225" cy="330" rx="50" ry="38" fill="#5a4a2a"/>
                <ellipse cx="225" cy="318" rx="45" ry="33" fill="#7a6a4a"/>
                <ellipse cx="225" cy="312" rx="38" ry="26" fill="#9a8a6a" opacity="0.4"/>
                <ellipse cx="225" cy="326" rx="15" ry="10" fill="#3a2a1a"/>
                <text x="225" y="358" text-anchor="middle" fill="#f0e6d2" font-size="10" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">Leader's Den</text>
            </g>
            
            <!-- Fresh-kill Pile - with prey shapes -->
            <g class="camp-den" data-location="freshkill" filter="url(#softShadow)">
                <ellipse cx="140" cy="238" rx="35" ry="22" fill="#4a3a2a"/>
                <ellipse cx="140" cy="232" rx="28" ry="16" fill="#6a4a3a"/>
                <!-- Prey shapes -->
                <ellipse cx="132" cy="228" rx="8" ry="4" fill="#8B7355"/>
                <ellipse cx="148" cy="232" rx="6" ry="3" fill="#9a8a7a"/>
                <ellipse cx="140" cy="225" rx="5" ry="3" fill="#7a6a5a"/>
                <text x="140" y="262" text-anchor="middle" fill="#f0e6d2" font-size="9" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">Fresh-kill</text>
            </g>
            
            <!-- Water - pool with reflection -->
            <g class="camp-den" data-location="water" filter="url(#softShadow)">
                <ellipse cx="310" cy="238" rx="35" ry="22" fill="#1a3a5a"/>
                <ellipse cx="310" cy="233" rx="28" ry="17" fill="url(#waterGradient)"/>
                <!-- Water ripples -->
                <ellipse cx="310" cy="230" rx="18" ry="10" fill="none" stroke="#7dbbe8" stroke-width="1" opacity="0.5"/>
                <ellipse cx="310" cy="233" rx="10" ry="6" fill="none" stroke="#aad4f0" stroke-width="0.5" opacity="0.4"/>
                <text x="310" y="262" text-anchor="middle" fill="#f0e6d2" font-size="9" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">Water</text>
            </g>
            
            <!-- Camp Exit - tunnel through brambles -->
            <g class="camp-den" data-location="exit" filter="url(#shadow)">
                <ellipse cx="420" cy="45" rx="30" ry="35" fill="#2d5a2d"/>
                <ellipse cx="420" cy="50" rx="22" ry="28" fill="#1a3a1a"/>
                <ellipse cx="420" cy="55" rx="14" ry="20" fill="#0a2a0a"/>
                <!-- Arrow indicating exit -->
                <polygon points="420,35 412,45 428,45" fill="#7dbb7d"/>
                <text x="420" y="85" text-anchor="middle" fill="#f0e6d2" font-size="9" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">Exit</text>
            </g>
            
            ${nightOverlay}
    `;
    
    // Add the leader on high rock (always there)
    worldHTML += renderLeaderOnHighRock();
    
    // Add some NPC cats around camp
    worldHTML += renderNPCCats();
    
    // Add player cat
    worldHTML += renderPlayerCat();
    
    // Add speech bubbles on top
    worldHTML += renderSpeechBubbles();
    
    worldHTML += `</svg>`;
    
    gameWorld.innerHTML = worldHTML;
    
    // Add click handlers to dens
    document.querySelectorAll('.camp-den').forEach(den => {
        den.addEventListener('click', () => {
            const location = den.dataset.location;
            interactWithLocation(location);
        });
    });
}

// Helper function to render a detailed NPC cat
function renderDetailedNPCCat(x, y, furColor, eyeColor, name, scale = 1) {
    const darkerFur = adjustColor(furColor, -30);
    const lighterFur = adjustColor(furColor, 20);
    const veryDarkFur = adjustColor(furColor, -50);
    const chestFur = adjustColor(furColor, 35);
    
    return `
        <g class="npc-cat" transform="translate(${x}, ${y}) scale(${scale})" style="pointer-events: none;">
            <!-- Ground shadow -->
            <ellipse cx="0" cy="16" rx="18" ry="5" fill="rgba(0,0,0,0.3)"/>
            
            <!-- Fluffy tail with curve -->
            <path d="M-14 4 Q-24 2 -26 -8 Q-28 -14 -22 -16" stroke="${darkerFur}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M-14 4 Q-23 2 -25 -7 Q-26 -12 -21 -14" stroke="${furColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M-22 -14 Q-20 -16 -18 -14" stroke="${lighterFur}" stroke-width="2" fill="none" stroke-linecap="round"/>
            
            <!-- Back legs -->
            <ellipse cx="-8" cy="10" rx="5" ry="7" fill="${darkerFur}"/>
            <ellipse cx="-8" cy="14" rx="3" ry="3" fill="${veryDarkFur}"/>
            
            <!-- Body - more cat-like shape -->
            <ellipse cx="0" cy="4" rx="16" ry="11" fill="${darkerFur}"/>
            <ellipse cx="2" cy="2" rx="14" ry="9" fill="${furColor}"/>
            <!-- Fur texture on body -->
            <ellipse cx="0" cy="0" rx="10" ry="6" fill="${lighterFur}" opacity="0.2"/>
            <path d="M-6 -2 Q-4 2 -6 5" stroke="${darkerFur}" stroke-width="0.5" fill="none" opacity="0.4"/>
            <path d="M2 -3 Q4 1 2 4" stroke="${darkerFur}" stroke-width="0.5" fill="none" opacity="0.4"/>
            
            <!-- Front legs -->
            <rect x="-4" y="8" width="5" height="10" rx="2" fill="${darkerFur}"/>
            <rect x="6" y="8" width="5" height="10" rx="2" fill="${furColor}"/>
            <!-- Paws -->
            <ellipse cx="-1.5" cy="17" rx="3" ry="2" fill="${darkerFur}"/>
            <ellipse cx="8.5" cy="17" rx="3" ry="2" fill="${furColor}"/>
            
            <!-- Chest fluff -->
            <ellipse cx="10" cy="4" rx="5" ry="6" fill="${chestFur}" opacity="0.6"/>
            
            <!-- Neck -->
            <ellipse cx="12" cy="-2" rx="6" ry="7" fill="${furColor}"/>
            
            <!-- Head - more feline shape -->
            <ellipse cx="16" cy="-8" rx="10" ry="9" fill="${furColor}"/>
            <ellipse cx="17" cy="-9" rx="8" ry="7" fill="${lighterFur}" opacity="0.15"/>
            
            <!-- Ears - tall and pointed like a cat -->
            <polygon points="8,-12 10,-24 16,-14" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="10,-13 11,-21 14,-14" fill="#e8b4b8" opacity="0.6"/>
            <polygon points="20,-14 26,-24 24,-12" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="21,-14 24,-21 23,-14" fill="#e8b4b8" opacity="0.6"/>
            
            <!-- Face markings -->
            <ellipse cx="16" cy="-4" rx="5" ry="4" fill="${chestFur}" opacity="0.4"/>
            
            <!-- Eyes - almond shaped like real cats -->
            <ellipse cx="12" cy="-9" rx="3" ry="3.5" fill="white"/>
            <ellipse cx="20" cy="-9" rx="3" ry="3.5" fill="white"/>
            <ellipse cx="12" cy="-9" rx="2" ry="3" fill="${eyeColor}"/>
            <ellipse cx="20" cy="-9" rx="2" ry="3" fill="${eyeColor}"/>
            <!-- Pupils -->
            <ellipse cx="12" cy="-9" rx="1" ry="2.5" fill="#0a0a0a"/>
            <ellipse cx="20" cy="-9" rx="1" ry="2.5" fill="#0a0a0a"/>
            <!-- Eye shine -->
            <circle cx="11" cy="-10.5" r="0.8" fill="white" opacity="0.9"/>
            <circle cx="19" cy="-10.5" r="0.8" fill="white" opacity="0.9"/>
            
            <!-- Nose - pink triangle -->
            <path d="M15,-4 L17,-4 L16,-2 Z" fill="#d88a90"/>
            <ellipse cx="16" cy="-3.5" rx="1.2" ry="0.8" fill="#c87a80"/>
            
            <!-- Mouth -->
            <path d="M14,-2 Q16,-1 18,-2" stroke="${veryDarkFur}" stroke-width="0.5" fill="none"/>
            
            <!-- Whiskers -->
            <g stroke="#d8d8d8" stroke-width="0.4" opacity="0.7">
                <line x1="9" y1="-4" x2="2" y2="-6"/>
                <line x1="9" y1="-3" x2="2" y2="-3"/>
                <line x1="9" y1="-2" x2="2" y2="0"/>
                <line x1="23" y1="-4" x2="30" y2="-6"/>
                <line x1="23" y1="-3" x2="30" y2="-3"/>
                <line x1="23" y1="-2" x2="30" y2="0"/>
            </g>
            
            <!-- Name tag -->
            <text x="8" y="28" text-anchor="middle" fill="#f0e6d2" font-size="8" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.9)">${name}</text>
        </g>
    `;
}

// Render the leader sitting on High Rock
function renderLeaderOnHighRock() {
    const cat = GameState.catData;
    
    // If player is the leader, don't show Firestar - player will be on high rock
    if (cat && cat.rank === 'Leader') {
        return ''; // Player is rendered separately
    }
    
    const leader = CLAN_CATS.find(c => c.rank === 'Leader');
    if (!leader) return '';
    
    const furColor = leader.furColor;
    const darkerFur = adjustColor(furColor, -30);
    const lighterFur = adjustColor(furColor, 20);
    const chestFur = adjustColor(furColor, 40);
    
    return `
        <g id="leader-cat" transform="translate(215, 165)">
            <!-- Leader sitting proudly on high rock -->
            <!-- Shadow on rock -->
            <ellipse cx="10" cy="22" rx="16" ry="5" fill="rgba(0,0,0,0.35)"/>
            
            <!-- Majestic tail curled around -->
            <path d="M-10 12 Q-20 8 -18 -2 Q-15 -12 -8 -14 Q-2 -15 0 -10" stroke="${darkerFur}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M-9 11 Q-18 7 -16 -1 Q-14 -10 -8 -12 Q-3 -13 -1 -9" stroke="${furColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
            
            <!-- Body (sitting pose - proud posture) -->
            <ellipse cx="8" cy="12" rx="14" ry="12" fill="${darkerFur}"/>
            <ellipse cx="8" cy="10" rx="12" ry="10" fill="${furColor}"/>
            <!-- Chest fluff -->
            <ellipse cx="12" cy="6" rx="7" ry="8" fill="${chestFur}" opacity="0.5"/>
            <ellipse cx="8" cy="4" rx="6" ry="5" fill="${lighterFur}" opacity="0.2"/>
            
            <!-- Front paws - neat and together -->
            <ellipse cx="0" cy="18" rx="5" ry="4" fill="${furColor}"/>
            <ellipse cx="12" cy="18" rx="5" ry="4" fill="${furColor}"/>
            <ellipse cx="0" cy="20" rx="4" ry="2" fill="${darkerFur}"/>
            <ellipse cx="12" cy="20" rx="4" ry="2" fill="${darkerFur}"/>
            
            <!-- Neck fur -->
            <ellipse cx="14" cy="0" rx="8" ry="10" fill="${furColor}"/>
            <ellipse cx="16" cy="-2" rx="5" ry="6" fill="${chestFur}" opacity="0.4"/>
            
            <!-- Head (noble expression) -->
            <ellipse cx="18" cy="-8" rx="12" ry="11" fill="${furColor}"/>
            <ellipse cx="19" cy="-10" rx="10" ry="9" fill="${lighterFur}" opacity="0.15"/>
            
            <!-- Ears - tall and alert -->
            <polygon points="8,-14 8,-28 17,-16" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="10,-15 10,-25 15,-17" fill="#e8b4b8" opacity="0.5"/>
            <polygon points="24,-16 32,-28 28,-14" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="26,-16 30,-25 27,-16" fill="#e8b4b8" opacity="0.5"/>
            
            <!-- Wise leader eyes - green like Firestar -->
            <ellipse cx="13" cy="-9" rx="3.5" ry="4" fill="white"/>
            <ellipse cx="23" cy="-9" rx="3.5" ry="4" fill="white"/>
            <ellipse cx="13" cy="-9" rx="2.5" ry="3.5" fill="#27ae60"/>
            <ellipse cx="23" cy="-9" rx="2.5" ry="3.5" fill="#27ae60"/>
            <ellipse cx="13" cy="-9" rx="1.2" ry="3" fill="#0a0a0a"/>
            <ellipse cx="23" cy="-9" rx="1.2" ry="3" fill="#0a0a0a"/>
            <circle cx="12" cy="-11" r="1" fill="white" opacity="0.9"/>
            <circle cx="22" cy="-11" r="1" fill="white" opacity="0.9"/>
            
            <!-- Nose -->
            <path d="M17,-3 L19,-3 L18,-1 Z" fill="#d88a90"/>
            <ellipse cx="18" cy="-2.5" rx="1.5" ry="1" fill="#c87a80"/>
            
            <!-- Mouth -->
            <path d="M16,0 Q18,1 20,0" stroke="${darkerFur}" stroke-width="0.5" fill="none"/>
            
            <!-- Whiskers -->
            <g stroke="#d8d8d8" stroke-width="0.5" opacity="0.7">
                <line x1="10" y1="-2" x2="0" y2="-4"/>
                <line x1="10" y1="-1" x2="0" y2="-1"/>
                <line x1="10" y1="0" x2="0" y2="2"/>
                <line x1="26" y1="-2" x2="36" y2="-4"/>
                <line x1="26" y1="-1" x2="36" y2="-1"/>
                <line x1="26" y1="0" x2="36" y2="2"/>
            </g>
            
            <!-- Leader name with star -->
            <text x="12" y="34" text-anchor="middle" fill="#ffd700" font-size="9" font-weight="bold" style="text-shadow: 1px 1px 3px rgba(0,0,0,1)">${leader.name}</text>
        </g>
    `;
}

// Render NPC cats around camp
// NPC cat positions for animation
if (!window.npcPositions) {
    window.npcPositions = {
        dustpelt: { x: 120, y: 280, targetX: 180, targetY: 280, speed: 0.3 },
        cloudtail: { x: 320, y: 140, targetX: 280, targetY: 180, speed: 0.4 },
        brightheart: { x: 60, y: 220, targetX: 100, targetY: 200, speed: 0.25 },
        ferncloud: { x: 180, y: 120, targetX: 220, targetY: 140, speed: 0.2 },
        // Kits - they move faster and stay near nursery!
        molekit: { x: 70, y: 295, targetX: 100, targetY: 290, speed: 0.6, isKit: true },
        cherrykit: { x: 95, y: 300, targetX: 80, targetY: 310, speed: 0.7, isKit: true },
        lilykit: { x: 110, y: 290, targetX: 90, targetY: 295, speed: 0.5, isKit: true },
        seedkit: { x: 85, y: 310, targetX: 105, targetY: 300, speed: 0.55, isKit: true },
        honeykit: { x: 100, y: 285, targetX: 75, targetY: 305, speed: 0.65, isKit: true },
    };
}

// Update NPC positions (called in game loop)
function updateNPCPositions() {
    const npcs = window.npcPositions;
    for (const name in npcs) {
        const npc = npcs[name];
        // Move towards target
        const dx = npc.targetX - npc.x;
        const dy = npc.targetY - npc.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 2) {
            npc.x += (dx / dist) * npc.speed;
            npc.y += (dy / dist) * npc.speed;
        } else {
            // Pick new random target
            if (npc.isKit) {
                // Kits stay near the nursery area (playing!)
                npc.targetX = 50 + Math.random() * 100; // x: 50-150
                npc.targetY = 275 + Math.random() * 50; // y: 275-325
            } else {
                // Adults can roam the whole camp
                npc.targetX = 60 + Math.random() * 320;
                npc.targetY = 100 + Math.random() * 200;
            }
        }
    }
}

function renderNPCCats() {
    let npcHTML = '';
    const cat = GameState.catData;
    const npcs = window.npcPositions;
    
    // Show warriors returning with prey for kits/elders
    if (cat && (cat.rank === 'Kit' || cat.rank === 'Elder')) {
        // Graystripe bringing prey
        npcHTML += renderDetailedNPCCat(160, 245, '#808080', '#f1c40f', 'Graystripe', 0.85);
        // Add prey in mouth
        npcHTML += `<ellipse cx="175" cy="240" rx="5" ry="3" fill="#8B7355"/>`;
        
        // Sandstorm bringing water in moss
        npcHTML += renderDetailedNPCCat(290, 245, '#F4A460', '#27ae60', 'Sandstorm', 0.85);
        // Add moss with water
        npcHTML += `<ellipse cx="305" cy="240" rx="4" ry="3" fill="#4a7a4a"/>`;
    }
    
    // Stationary cats with detailed graphics
    npcHTML += renderDetailedNPCCat(85, 175, '#8B4513', '#f1c40f', 'Brambleclaw', 0.8);
    npcHTML += renderDetailedNPCCat(355, 175, '#CD853F', '#27ae60', 'Squirrelpaw', 0.7);
    npcHTML += renderDetailedNPCCat(258, 105, '#D2B48C', '#f1c40f', 'Leafpool', 0.8);
    npcHTML += renderDetailedNPCCat(150, 275, '#2c2c2c', '#f1c40f', 'Spiderleg', 0.75);
    npcHTML += renderDetailedNPCCat(330, 95, '#ecf0f1', '#27ae60', 'Whitewing', 0.8);
    
    // Moving cats
    npcHTML += renderDetailedNPCCat(npcs.dustpelt.x, npcs.dustpelt.y, '#5D4037', '#f1c40f', 'Dustpelt', 0.8);
    npcHTML += renderDetailedNPCCat(npcs.cloudtail.x, npcs.cloudtail.y, '#FFFFFF', '#3498db', 'Cloudtail', 0.8);
    npcHTML += renderDetailedNPCCat(npcs.brightheart.x, npcs.brightheart.y, '#E67E22', '#27ae60', 'Brightheart', 0.8);
    npcHTML += renderDetailedNPCCat(npcs.ferncloud.x, npcs.ferncloud.y, '#95a5a6', '#27ae60', 'Ferncloud', 0.8);
    
    // KITS in the nursery area! (tiny and cute)
    npcHTML += renderDetailedNPCCat(npcs.molekit.x, npcs.molekit.y, '#8B7355', '#f1c40f', 'Molekit', 0.4);
    npcHTML += renderDetailedNPCCat(npcs.cherrykit.x, npcs.cherrykit.y, '#CD853F', '#27ae60', 'Cherrykit', 0.4);
    npcHTML += renderDetailedNPCCat(npcs.lilykit.x, npcs.lilykit.y, '#D2B48C', '#3498db', 'Lilykit', 0.4);
    npcHTML += renderDetailedNPCCat(npcs.seedkit.x, npcs.seedkit.y, '#F5DEB3', '#f1c40f', 'Seedkit', 0.4);
    npcHTML += renderDetailedNPCCat(npcs.honeykit.x, npcs.honeykit.y, '#FFD700', '#27ae60', 'Honeykit', 0.4);
    
    return npcHTML;
}

// Render the forest (outside camp) for hunting/herb gathering
function renderForest() {
    const gameWorld = document.getElementById('game-world');
    const clan = GameState.selectedClan;
    const isNight = GameState.isNight;
    
    // Forest is bigger! 600x500
    const herbSpots = [
        { x: 100, y: 120, herb: 'cobweb' },
        { x: 480, y: 100, herb: 'catmint' },
        { x: 150, y: 380, herb: 'marigold' },
        { x: 400, y: 420, herb: 'dock' },
        { x: 70, y: 280, herb: 'juniper' },
        { x: 520, y: 320, herb: 'poppy' },
        { x: 300, y: 80, herb: 'cobweb' },
        { x: 550, y: 200, herb: 'marigold' }
    ];
    
    // Different ground colors based on clan territory
    const groundColors = {
        thunder: { base: '#1a3a1a', accent: '#2a4a2a' },
        shadow: { base: '#1a1a2a', accent: '#2a2a3a' },
        river: { base: '#1a2a3a', accent: '#2a3a4a' },
        wind: { base: '#2a3a2a', accent: '#3a4a3a' }
    };
    const colors = groundColors[clan] || groundColors.thunder;
    const skyColor = isNight ? '#0a0a1a' : '#1a3a2a';
    
    let worldHTML = `
        <svg id="forest-svg" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
            <defs>
                <radialGradient id="forestGlow" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stop-color="${isNight ? '#1a2a3a' : '#2a4a3a'}"/>
                    <stop offset="100%" stop-color="${skyColor}"/>
                </radialGradient>
                <filter id="treeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="3" dy="5" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
                </filter>
                <linearGradient id="treeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#3d6d26"/>
                    <stop offset="100%" stop-color="#1e4d2b"/>
                </linearGradient>
                <linearGradient id="treeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2d5d16"/>
                    <stop offset="100%" stop-color="#1a3a1a"/>
                </linearGradient>
            </defs>
            
            <!-- Forest ground with texture -->
            <rect x="0" y="0" width="600" height="500" fill="url(#forestGlow)"/>
            
            <!-- Ground texture - grass patches -->
            <ellipse cx="100" cy="450" rx="80" ry="30" fill="${colors.accent}" opacity="0.6"/>
            <ellipse cx="300" cy="480" rx="100" ry="40" fill="${colors.accent}" opacity="0.5"/>
            <ellipse cx="500" cy="460" rx="90" ry="35" fill="${colors.accent}" opacity="0.6"/>
            <ellipse cx="200" cy="350" rx="60" ry="25" fill="${colors.accent}" opacity="0.4"/>
            <ellipse cx="450" cy="300" rx="70" ry="30" fill="${colors.accent}" opacity="0.5"/>
            
            <!-- Fallen leaves scattered -->
            <circle cx="120" cy="320" r="3" fill="#8B4513" opacity="0.7"/>
            <circle cx="250" cy="400" r="2" fill="#CD853F" opacity="0.6"/>
            <circle cx="380" cy="280" r="3" fill="#A0522D" opacity="0.7"/>
            <circle cx="480" cy="380" r="2" fill="#8B4513" opacity="0.6"/>
            <circle cx="180" cy="220" r="2" fill="#CD853F" opacity="0.5"/>
            <circle cx="520" cy="150" r="3" fill="#A0522D" opacity="0.7"/>
            
            <!-- Trees - many more! -->
            <!-- Back row (distant, smaller) -->
            <polygon points="50,150 65,50 80,150" fill="url(#treeGrad2)" filter="url(#treeShadow)"/>
            <polygon points="130,160 150,40 170,160" fill="url(#treeGrad1)" filter="url(#treeShadow)"/>
            <polygon points="220,140 240,30 260,140" fill="url(#treeGrad2)" filter="url(#treeShadow)"/>
            <polygon points="310,150 330,20 350,150" fill="url(#treeGrad1)" filter="url(#treeShadow)"/>
            <polygon points="400,140 420,35 440,140" fill="url(#treeGrad2)" filter="url(#treeShadow)"/>
            <polygon points="490,155 510,45 530,155" fill="url(#treeGrad1)" filter="url(#treeShadow)"/>
            <polygon points="560,145 575,60 590,145" fill="url(#treeGrad2)" filter="url(#treeShadow)"/>
            
            <!-- Middle row trees -->
            <polygon points="20,320 45,150 70,320" fill="url(#treeGrad1)" filter="url(#treeShadow)"/>
            <polygon points="90,340 120,180 150,340" fill="url(#treeGrad2)" filter="url(#treeShadow)"/>
            <polygon points="530,300 555,140 580,300" fill="url(#treeGrad1)" filter="url(#treeShadow)"/>
            <polygon points="560,350 580,200 600,350" fill="url(#treeGrad2)" filter="url(#treeShadow)"/>
            
            <!-- Tree trunks -->
            <rect x="60" y="150" width="10" height="30" fill="#5D4037"/>
            <rect x="145" y="160" width="12" height="35" fill="#4E342E"/>
            <rect x="235" y="140" width="10" height="30" fill="#5D4037"/>
            <rect x="325" y="150" width="12" height="32" fill="#4E342E"/>
            <rect x="415" y="140" width="10" height="28" fill="#5D4037"/>
            <rect x="505" y="155" width="11" height="30" fill="#4E342E"/>
            <rect x="40" y="320" width="12" height="40" fill="#5D4037"/>
            <rect x="115" y="340" width="14" height="45" fill="#4E342E"/>
            <rect x="550" y="300" width="12" height="35" fill="#5D4037"/>
            
            <!-- Bushes -->
            <ellipse cx="180" cy="250" rx="25" ry="18" fill="#2d5d26"/>
            <ellipse cx="350" cy="200" rx="30" ry="20" fill="#1e4d1b"/>
            <ellipse cx="450" cy="350" rx="28" ry="16" fill="#2d5d26"/>
            <ellipse cx="80" cy="400" rx="22" ry="14" fill="#1e4d1b"/>
            <ellipse cx="520" cy="420" rx="25" ry="15" fill="#2d5d26"/>
            
            <!-- Stream for RiverClan territory -->
            ${clan === 'river' ? `
            <path d="M0,250 Q150,220 300,260 Q450,300 600,270" stroke="#4a8aaa" stroke-width="20" fill="none" opacity="0.7"/>
            <path d="M0,250 Q150,220 300,260 Q450,300 600,270" stroke="#6aaacc" stroke-width="8" fill="none" opacity="0.5"/>
            ` : ''}
            
            <!-- Moorland grass for WindClan -->
            ${clan === 'wind' ? `
            <line x1="100" y1="300" x2="110" y2="280" stroke="#5a7a4a" stroke-width="2"/>
            <line x1="200" y1="350" x2="210" y2="330" stroke="#5a7a4a" stroke-width="2"/>
            <line x1="350" y1="320" x2="360" y2="300" stroke="#5a7a4a" stroke-width="2"/>
            <line x1="480" y1="280" x2="490" y2="260" stroke="#5a7a4a" stroke-width="2"/>
            ` : ''}
            
            <!-- Dark pines for ShadowClan -->
            ${clan === 'shadow' ? `
            <polygon points="280,380 300,200 320,380" fill="#1a3a2a" filter="url(#treeShadow)"/>
            <polygon points="380,400 400,250 420,400" fill="#0a2a1a" filter="url(#treeShadow)"/>
            ` : ''}
            
            <!-- Herb spots -->
    `;
    
    herbSpots.forEach((spot, i) => {
        const herb = HERBS[spot.herb];
        worldHTML += `
            <g class="herb-spot clickable" data-herb="${spot.herb}" data-index="${i}" style="cursor: pointer;">
                <circle cx="${spot.x}" cy="${spot.y}" r="22" fill="#2a4a2a" stroke="#5a8a5a" stroke-width="2"/>
                <circle cx="${spot.x-5}" cy="${spot.y-3}" r="4" fill="#4a8a4a"/>
                <circle cx="${spot.x+5}" cy="${spot.y+2}" r="3" fill="#3a7a3a"/>
                <circle cx="${spot.x}" cy="${spot.y-6}" r="3" fill="#5a9a5a"/>
                <text x="${spot.x}" y="${spot.y + 32}" text-anchor="middle" font-size="11" fill="#aaffaa" style="text-shadow: 1px 1px 2px black;">${herb.name}</text>
            </g>
        `;
    });
    
    // Multiple prey spots around the forest
    const preySpots = [
        { x: 280, y: 300, type: 'mouse' },
        { x: 450, y: 180, type: 'mouse' },
        { x: 180, y: 450, type: 'vole' },
        { x: 380, y: 380, type: 'mouse' }
    ];
    
    preySpots.forEach((prey, i) => {
        worldHTML += `
            <g class="prey-spot clickable" data-action="hunt" data-index="${i}" style="cursor: pointer;">
                <circle cx="${prey.x}" cy="${prey.y}" r="28" fill="#4a3a2a" stroke="#7a6a5a" stroke-width="2"/>
                <ellipse cx="${prey.x}" cy="${prey.y}" rx="10" ry="6" fill="#8B7355"/>
                <circle cx="${prey.x-4}" cy="${prey.y-2}" r="2" fill="#1a1a1a"/>
                <ellipse cx="${prey.x+8}" cy="${prey.y}" rx="3" ry="1" fill="#9a8a7a"/>
                <text x="${prey.x}" y="${prey.y + 38}" text-anchor="middle" fill="#f0e6d2" font-size="11" style="text-shadow: 1px 1px 2px black;">Hunt ${prey.type}</text>
            </g>
        `;
    });
    
    // Danger spot (fox den or dog area)
    worldHTML += `
        <g class="danger-spot" data-danger="fox">
            <ellipse cx="550" cy="80" rx="35" ry="25" fill="#3a2a1a" stroke="#5a4a3a" stroke-width="2"/>
            <ellipse cx="550" cy="85" rx="20" ry="12" fill="#1a0a0a"/>
            <text x="550" y="120" text-anchor="middle" fill="#ff6666" font-size="10" style="text-shadow: 1px 1px 2px black;">??? Den</text>
        </g>
    `;
    
    // Your camp entrance (bigger, clearer)
    const cat = GameState.catData;
    const yourClan = cat?.clan || 'ThunderClan';
    const clanColors = {
        'ThunderClan': { bg: '#4a3a2a', accent: '#ffa500', text: 'ThunderClan' },
        'ShadowClan': { bg: '#2a2a3a', accent: '#9966cc', text: 'ShadowClan' },
        'RiverClan': { bg: '#2a3a4a', accent: '#4a90d9', text: 'RiverClan' },
        'WindClan': { bg: '#3a3a2a', accent: '#c4a35a', text: 'WindClan' }
    };
    
    // Only show your clan camp if you're not a loner
    if (!cat?.isLoner) {
        worldHTML += `
            <g class="camp-den clickable" data-location="camp" style="cursor: pointer;">
                <ellipse cx="35" cy="250" rx="30" ry="40" fill="${clanColors[yourClan]?.bg || '#4a3a2a'}" stroke="${clanColors[yourClan]?.accent || '#6a5a4a'}" stroke-width="3"/>
                <polygon points="35,215 20,250 50,250" fill="#3a5a3a"/>
                <text x="35" y="300" text-anchor="middle" fill="${clanColors[yourClan]?.accent || '#ffd700'}" font-size="10" font-weight="bold" style="text-shadow: 1px 1px 2px black;">YOUR CAMP</text>
            </g>
        `;
    }
    
    // Paths to ALL clan territories!
    const clanPaths = [
        { clan: 'ThunderClan', x: 35, y: 480, color: '#ffa500' },
        { clan: 'ShadowClan', x: 200, y: 480, color: '#9966cc' },
        { clan: 'RiverClan', x: 400, y: 480, color: '#4a90d9' },
        { clan: 'WindClan', x: 565, y: 250, color: '#c4a35a' }
    ];
    
    clanPaths.forEach(path => {
        // Show all clans except your own (since your camp is already shown)
        if (path.clan !== yourClan || cat?.isLoner) {
            worldHTML += `
                <g class="clan-path clickable" data-clan="${path.clan}" style="cursor: pointer;">
                    <ellipse cx="${path.x}" cy="${path.y}" rx="35" ry="20" fill="#3a3a2a" stroke="${path.color}" stroke-width="2"/>
                    <path d="M${path.x-10},${path.y-5} L${path.x},${path.y-15} L${path.x+10},${path.y-5}" fill="${path.color}" opacity="0.8"/>
                    <text x="${path.x}" y="${path.y + 8}" text-anchor="middle" fill="${path.color}" font-size="9" font-weight="bold" style="text-shadow: 1px 1px 2px black;">${path.clan.replace('Clan', '')}</text>
                </g>
            `;
        }
    });
    
    // Loner's den option (if you want to become/stay a loner)
    worldHTML += `
        <g class="loner-den clickable" data-location="loner" style="cursor: pointer;">
            <ellipse cx="300" cy="50" rx="35" ry="25" fill="#3a2a1a" stroke="#8a7a6a" stroke-width="2"/>
            <text x="300" y="45" text-anchor="middle" fill="#ccbbaa" font-size="9" style="text-shadow: 1px 1px 2px black;">Abandoned Den</text>
            <text x="300" y="58" text-anchor="middle" fill="#aa9988" font-size="7" style="text-shadow: 1px 1px 2px black;">(Loner's Home)</text>
        </g>
    `;
    
    // Add warrior companion if with one
    if (GameState.withWarrior) {
        worldHTML += renderWarriorCompanion();
    }
    
    // Add kit friend if sneaking with one
    if (GameState.sneakingWithFriend) {
        worldHTML += renderKitFriend();
    }
    
    // Add player cat
    worldHTML += renderPlayerCat();
    
    // Add speech bubbles
    worldHTML += renderSpeechBubbles();
    
    // Moon/Sun indicator
    if (isNight) {
        worldHTML += `
            <circle cx="550" cy="40" r="15" fill="#ffffcc" opacity="0.8"/>
            <circle cx="545" cy="38" r="12" fill="${skyColor}"/>
        `;
    }
    
    worldHTML += `</svg>`;
    
    gameWorld.innerHTML = worldHTML;
    
    // Add click handlers
    document.querySelectorAll('.herb-spot').forEach(spot => {
        spot.addEventListener('click', () => collectHerb(spot.dataset.herb, spot.dataset.index));
    });
    
    document.querySelectorAll('.prey-spot').forEach(spot => {
        spot.addEventListener('click', () => startHuntingGame());
    });
    
    document.querySelector('.danger-spot')?.addEventListener('click', () => encounterDanger('fox'));
    
    document.querySelectorAll('.camp-den').forEach(den => {
        den.addEventListener('click', () => {
            if (den.dataset.location === 'camp') {
                GameState.currentLocation = 'camp';
                GameState.playerX = 225;
                GameState.playerY = 250;
                
                // Clear companions when returning
                if (GameState.withWarrior) {
                    showMessage(`${GameState.withWarrior} brought you back to camp safely!`);
                    GameState.withWarrior = null;
                } else if (GameState.sneakingWithFriend) {
                    showMessage(`You and ${GameState.sneakingWithFriend} snuck back into camp!`);
                    GameState.sneakingWithFriend = null;
                } else {
                    showMessage('You returned to camp safely!');
                }
                
                renderGameWorld();
            }
        });
    });
    
    // Click handlers for clan paths
    document.querySelectorAll('.clan-path').forEach(path => {
        path.addEventListener('click', () => {
            const targetClan = path.dataset.clan;
            showClanPathPopup(targetClan);
        });
    });
    
    // Loner den click handler
    document.querySelector('.loner-den')?.addEventListener('click', () => {
        showLonerDenPopup();
    });
    
    // Check for random forest events
    checkForestEvents();
}

// Show popup when clicking on a clan path
function showClanPathPopup(targetClan) {
    const cat = GameState.catData;
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    title.textContent = `Path to ${targetClan}`;
    
    if (cat.isLoner) {
        desc.textContent = `This path leads to ${targetClan} territory. As a loner, you can visit or ask to join.`;
    } else if (targetClan === cat.clan) {
        desc.textContent = `This is your home! The path leads back to ${targetClan} camp.`;
    } else {
        desc.textContent = `This path leads to ${targetClan} territory. They might not welcome trespassers!`;
    }
    
    actions.innerHTML = '';
    
    if (cat.isLoner) {
        addAction(actions, `Visit ${targetClan}`, () => {
            closePopup();
            visitOtherClan(targetClan);
        });
        
        addAction(actions, `Ask to Join ${targetClan}`, () => {
            closePopup();
            askToJoinClan(targetClan);
        });
    } else if (targetClan === cat.clan) {
        addAction(actions, 'Go to Camp', () => {
            closePopup();
            GameState.currentLocation = 'camp';
            GameState.playerX = 225;
            GameState.playerY = 250;
            GameState.withWarrior = null;
            GameState.sneakingWithFriend = null;
            renderGameWorld();
            showMessage('You returned to camp!');
        });
    } else {
        addAction(actions, 'Sneak In', () => {
            closePopup();
            sneakIntoOtherClan(targetClan);
        });
        
        if (cat.rank !== 'Kit') {
            addAction(actions, 'Border Patrol', () => {
                closePopup();
                showMessage(`You patrol the border with ${targetClan}. All seems quiet...`);
                cat.experience += 5;
                updateGameUI();
                saveGameData();
            });
        }
    }
    
    addAction(actions, 'Stay Here', closePopup);
    popup.classList.remove('hidden');
}

// Show popup for loner den
function showLonerDenPopup() {
    const cat = GameState.catData;
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    title.textContent = 'Abandoned Den';
    
    if (cat.isLoner) {
        desc.textContent = 'This is your home now. A quiet place away from the Clans.';
    } else {
        desc.textContent = 'An old abandoned den. Loners and rogues sometimes live here, away from Clan life.';
    }
    
    actions.innerHTML = '';
    
    if (cat.isLoner) {
        addAction(actions, 'Rest Here', () => {
            closePopup();
            cat.health = Math.min(100, cat.health + 10);
            showMessage('You rest in your den. (+10 health)');
            updateGameUI();
            saveGameData();
        });
        
        addAction(actions, 'Hunt Alone', () => {
            closePopup();
            lonerHunt();
        });
    } else {
        addAction(actions, 'Become a Loner', () => {
            closePopup();
            becomeLoner();
        });
        
        addAction(actions, 'Just Look Around', () => {
            closePopup();
            showMessage('You sniff around the abandoned den. It smells of old moss and loneliness...');
        });
    }
    
    addAction(actions, 'Leave', closePopup);
    popup.classList.remove('hidden');
}

// Become a loner!
function becomeLoner() {
    const cat = GameState.catData;
    
    showMessage('Are you sure you want to leave your Clan and become a loner?');
    
    setTimeout(() => {
        const popup = document.getElementById('location-popup');
        const title = document.getElementById('location-title');
        const desc = document.getElementById('location-desc');
        const actions = document.getElementById('location-actions');
        
        title.textContent = 'Leave Your Clan?';
        desc.textContent = `You would be leaving ${cat.clan} forever. Life as a loner is hard and lonely, but free.`;
        
        actions.innerHTML = '';
        
        addAction(actions, 'Yes, Leave', () => {
            closePopup();
            cat.isLoner = true;
            cat.previousClan = cat.clan;
            cat.clan = 'Loner';
            
            // Remove rank suffix for loners
            const baseName = cat.name.replace(/paw$|kit$|star$/i, '');
            if (cat.rank === 'Apprentice') {
                cat.name = baseName; // Remove -paw
            }
            cat.rank = 'Loner';
            
            showMessage(`You have left ${cat.previousClan}. You are now a loner.`);
            setTimeout(() => {
                showMessage('You must hunt for yourself now. Be careful out there...');
                GameState.currentLocation = 'forest';
                renderGameWorld();
                updateGameUI();
                saveGameData();
            }, 2500);
        });
        
        addAction(actions, 'No, Stay', () => {
            closePopup();
            showMessage('You decide to stay with your Clan.');
        });
        
        popup.classList.remove('hidden');
    }, 1500);
}

// Ask to join a clan (for loners)
function askToJoinClan(clanName) {
    const cat = GameState.catData;
    
    showMessage(`You approach the ${clanName} border and call out...`);
    
    setTimeout(() => {
        // 60% chance they accept
        if (Math.random() < 0.6) {
            const leaders = {
                'ThunderClan': 'Firestar',
                'ShadowClan': 'Blackstar',
                'RiverClan': 'Leopardstar',
                'WindClan': 'Onestar'
            };
            const leader = leaders[clanName] || 'the leader';
            
            showMessage(`${leader} considers your request...`);
            
            setTimeout(() => {
                showSpeechBubble(leader, 'We could use another cat. You may join us.');
                showMessage(`${leader}: "We could use another cat. You may join ${clanName}!"`);
                
                setTimeout(() => {
                    cat.isLoner = false;
                    cat.clan = clanName;
                    cat.rank = 'Warrior'; // Loners join as warriors
                    cat.name = cat.name + 'heart'; // Give a warrior name
                    
                    GameState.selectedClan = clanName.toLowerCase().replace('clan', '');
                    GameState.currentLocation = 'camp';
                    GameState.playerX = 225;
                    GameState.playerY = 250;
                    
                    showMessage(`Welcome to ${clanName}! You are now ${cat.name}!`);
                    renderGameWorld();
                    updateGameUI();
                    saveGameData();
                }, 2500);
            }, 2000);
        } else {
            showMessage(`The ${clanName} cats chase you away! "We don't need rogues here!"`);
            cat.health -= 10;
            updateGameUI();
            saveGameData();
        }
    }, 2000);
}

// Loner hunting (harder than clan hunting)
function lonerHunt() {
    showMessage('You stalk through the forest alone...');
    
    setTimeout(() => {
        // 50% success rate for loners (no training)
        if (Math.random() < 0.5) {
            const cat = GameState.catData;
            cat.hunger = Math.min(100, cat.hunger + 30);
            showMessage('You caught a mouse! It\'s not much, but it\'s yours.');
            updateGameUI();
            saveGameData();
        } else {
            showMessage('The prey escapes. Hunting alone is hard...');
        }
    }, 2000);
}

// Sneak into another clan's territory
function sneakIntoOtherClan(clanName) {
    const cat = GameState.catData;
    
    showMessage(`You creep into ${clanName} territory...`);
    
    setTimeout(() => {
        // 40% chance of getting caught
        if (Math.random() < 0.4) {
            const warriors = ['a patrol', 'enemy warriors', 'border guards'];
            const caught = warriors[Math.floor(Math.random() * warriors.length)];
            
            showMessage(`You've been spotted by ${caught}!`);
            
            setTimeout(() => {
                showMessage(`"Intruder! Get out of ${clanName} territory!"`);
                cat.health -= 15;
                showMessage('They chase you back! (-15 health)');
                updateGameUI();
                saveGameData();
            }, 2000);
        } else {
            showMessage(`You sneak through ${clanName} territory undetected...`);
            cat.experience += 10;
            
            setTimeout(() => {
                // Small chance to find something useful
                if (Math.random() < 0.3) {
                    showMessage('You find some prey and steal it!');
                    cat.hunger = Math.min(100, cat.hunger + 20);
                }
                updateGameUI();
                saveGameData();
            }, 2000);
        }
    }, 2000);
}

// Visit another clan (for loners - more peaceful)
function visitOtherClan(clanName) {
    showMessage(`You cautiously approach ${clanName} territory...`);
    
    setTimeout(() => {
        showMessage(`You observe the ${clanName} cats from a distance. Clan life looks busy...`);
        
        setTimeout(() => {
            const observations = [
                'Warriors are returning from a patrol.',
                'Kits are playing near the nursery.',
                'The leader is speaking from a high place.',
                'Apprentices are training nearby.'
            ];
            showMessage(observations[Math.floor(Math.random() * observations.length)]);
        }, 2500);
    }, 2000);
}

// Render the warrior companion in the forest
function renderWarriorCompanion() {
    const warriorName = GameState.withWarrior;
    if (!warriorName) return '';
    
    // Find warrior data or use default colors
    const warriorData = {
        'Sandstorm': { fur: '#e8d4a0', eye: '#7fb069' },
        'Graystripe': { fur: '#888899', eye: '#f4d35e' },
        'Dustpelt': { fur: '#8B7355', eye: '#c4a35a' },
        'Cloudtail': { fur: '#ffffff', eye: '#4a90d9' },
        'Brackenfur': { fur: '#c4a35a', eye: '#c4a35a' },
        'Thornclaw': { fur: '#d4a45a', eye: '#c4a35a' }
    };
    
    const data = warriorData[warriorName] || { fur: '#8d6e63', eye: '#2ecc71' };
    const furColor = data.fur;
    const eyeColor = data.eye;
    const darkerFur = adjustColor(furColor, -30);
    const lighterFur = adjustColor(furColor, 20);
    const chestFur = adjustColor(furColor, 40);
    
    // Position near the player but slightly behind
    const x = GameState.playerX - 50;
    const y = GameState.playerY + 10;
    
    return `
        <!-- Warrior Companion: ${warriorName} -->
        <g class="warrior-companion" transform="translate(${x}, ${y}) scale(0.9)" style="pointer-events: none;">
            <!-- Shadow -->
            <ellipse cx="15" cy="25" rx="20" ry="6" fill="rgba(0,0,0,0.3)"/>
            
            <!-- Tail up -->
            <path d="M-10 5 Q-25 0 -22 -18 Q-20 -25 -15 -22" stroke="${darkerFur}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M-9 4 Q-23 0 -20 -16 Q-18 -22 -14 -20" stroke="${furColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
            
            <!-- Back legs -->
            <ellipse cx="-5" cy="18" rx="5" ry="6" fill="${darkerFur}"/>
            <ellipse cx="5" cy="18" rx="5" ry="6" fill="${furColor}"/>
            
            <!-- Body -->
            <ellipse cx="8" cy="4" rx="18" ry="12" fill="${darkerFur}"/>
            <ellipse cx="8" cy="2" rx="16" ry="10" fill="${furColor}"/>
            <ellipse cx="12" cy="0" rx="6" ry="5" fill="${chestFur}" opacity="0.4"/>
            
            <!-- Front legs -->
            <ellipse cx="18" cy="18" rx="4" ry="6" fill="${darkerFur}"/>
            <ellipse cx="26" cy="18" rx="4" ry="6" fill="${furColor}"/>
            
            <!-- Neck -->
            <ellipse cx="22" cy="-2" rx="7" ry="8" fill="${furColor}"/>
            
            <!-- Head -->
            <ellipse cx="26" cy="-10" rx="11" ry="10" fill="${furColor}"/>
            <ellipse cx="26" cy="-12" rx="8" ry="7" fill="${lighterFur}" opacity="0.15"/>
            
            <!-- Ears -->
            <polygon points="18,-14 18,-28 26,-18" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="19,-15 19,-25 24,-18" fill="#e8b4b8" opacity="0.6"/>
            <polygon points="30,-18 38,-28 36,-14" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="31,-17 36,-25 35,-15" fill="#e8b4b8" opacity="0.6"/>
            
            <!-- Eyes - alert and watching -->
            <ellipse cx="22" cy="-11" rx="3" ry="3.5" fill="white"/>
            <ellipse cx="30" cy="-11" rx="3" ry="3.5" fill="white"/>
            <ellipse cx="22" cy="-11" rx="2" ry="3" fill="${eyeColor}"/>
            <ellipse cx="30" cy="-11" rx="2" ry="3" fill="${eyeColor}"/>
            <ellipse cx="22" cy="-11" rx="1" ry="2.5" fill="#0a0a0a"/>
            <ellipse cx="30" cy="-11" rx="1" ry="2.5" fill="#0a0a0a"/>
            <circle cx="21" cy="-12.5" r="0.8" fill="white" opacity="0.9"/>
            <circle cx="29" cy="-12.5" r="0.8" fill="white" opacity="0.9"/>
            
            <!-- Nose -->
            <path d="M25,-6 L27,-6 L26,-4 Z" fill="#d88a90"/>
            
            <!-- Whiskers -->
            <g stroke="#d8d8d8" stroke-width="0.4" opacity="0.7">
                <line x1="19" y1="-6" x2="10" y2="-8"/>
                <line x1="19" y1="-5" x2="10" y2="-5"/>
                <line x1="33" y1="-6" x2="42" y2="-8"/>
                <line x1="33" y1="-5" x2="42" y2="-5"/>
            </g>
            
            <!-- Name -->
            <text x="20" y="38" text-anchor="middle" fill="#ffd700" font-size="9" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.9);">${warriorName}</text>
        </g>
    `;
}

// Render kit friend in the forest
function renderKitFriend() {
    const friendName = GameState.sneakingWithFriend;
    if (!friendName) return '';
    
    // Kit friend colors
    const kitData = {
        'Molekit': { fur: '#d4a574', eye: '#c4a35a' },
        'Cherrykit': { fur: '#cc8866', eye: '#7fb069' },
        'Lilykit': { fur: '#f0e6d2', eye: '#4a90d9' },
        'Seedkit': { fur: '#c4a35a', eye: '#c4a35a' },
        'Honeykit': { fur: '#e8c078', eye: '#c4a35a' }
    };
    
    const data = kitData[friendName] || { fur: '#d4a574', eye: '#7fb069' };
    const furColor = data.fur;
    const eyeColor = data.eye;
    const darkerFur = adjustColor(furColor, -30);
    const lighterFur = adjustColor(furColor, 20);
    
    // Position near the player
    const x = GameState.playerX + 30;
    const y = GameState.playerY + 5;
    
    return `
        <!-- Kit Friend: ${friendName} -->
        <g class="kit-friend" transform="translate(${x}, ${y}) scale(0.35)" style="pointer-events: none;">
            <!-- Shadow -->
            <ellipse cx="10" cy="22" rx="18" ry="5" fill="rgba(0,0,0,0.25)"/>
            
            <!-- Tail -->
            <path d="M-12 6 Q-18 10 -14 16 Q-8 18 0 14" stroke="${darkerFur}" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M-11 5 Q-16 9 -12 14 Q-6 16 0 12" stroke="${furColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
            
            <!-- Body -->
            <ellipse cx="0" cy="6" rx="16" ry="11" fill="${darkerFur}"/>
            <ellipse cx="0" cy="4" rx="14" ry="9" fill="${furColor}"/>
            <ellipse cx="0" cy="2" rx="10" ry="6" fill="${lighterFur}" opacity="0.2"/>
            
            <!-- Legs -->
            <ellipse cx="-6" cy="14" rx="5" ry="4" fill="${furColor}"/>
            <ellipse cx="6" cy="14" rx="5" ry="4" fill="${furColor}"/>
            
            <!-- Head - big for a kit -->
            <ellipse cx="16" cy="-6" rx="13" ry="11" fill="${furColor}"/>
            <ellipse cx="16" cy="-8" rx="10" ry="8" fill="${lighterFur}" opacity="0.15"/>
            
            <!-- Big ears -->
            <polygon points="6,-10 6,-26 16,-14" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="8,-11 8,-22 14,-14" fill="#e8b4b8" opacity="0.6"/>
            <polygon points="20,-14 30,-26 28,-10" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="22,-13 28,-22 27,-11" fill="#e8b4b8" opacity="0.6"/>
            
            <!-- Big eyes - excited/scared -->
            <ellipse cx="12" cy="-7" rx="4" ry="4.5" fill="white"/>
            <ellipse cx="22" cy="-7" rx="4" ry="4.5" fill="white"/>
            <ellipse cx="12" cy="-7" rx="3" ry="4" fill="${eyeColor}"/>
            <ellipse cx="22" cy="-7" rx="3" ry="4" fill="${eyeColor}"/>
            <ellipse cx="12" cy="-7" rx="1.5" ry="3" fill="#0a0a0a"/>
            <ellipse cx="22" cy="-7" rx="1.5" ry="3" fill="#0a0a0a"/>
            <circle cx="10.5" cy="-9" r="1" fill="white" opacity="0.9"/>
            <circle cx="20.5" cy="-9" r="1" fill="white" opacity="0.9"/>
            
            <!-- Nose -->
            <path d="M15,-1 L18,-1 L16.5,1 Z" fill="#d88a90"/>
            
            <!-- Whiskers -->
            <g stroke="#d8d8d8" stroke-width="0.3" opacity="0.6">
                <line x1="9" y1="-2" x2="0" y2="-4"/>
                <line x1="9" y1="0" x2="0" y2="0"/>
                <line x1="25" y1="-2" x2="34" y2="-4"/>
                <line x1="25" y1="0" x2="34" y2="0"/>
            </g>
            
            <!-- Name -->
            <text x="12" y="32" text-anchor="middle" fill="#f0e6d2" font-size="10" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.9);">${friendName}</text>
        </g>
    `;
}

// Render player cat at current position
function renderPlayerCat() {
    const cat = GameState.catData;
    const furColor = cat.furColor || '#8d6e63';
    const eyeColor = cat.eyeColor || '#2ecc71';
    const pattern = cat.pattern || 'solid';
    const darkerFur = adjustColor(furColor, -30);
    const veryDarkFur = adjustColor(furColor, -60);
    const lighterFur = adjustColor(furColor, 20);
    const chestFur = adjustColor(furColor, 40);
    const patternColor = adjustColor(furColor, -50);
    
    // Scale based on rank - kits are tiny!
    let scale = 1.0;
    if (cat.rank === 'Kit') {
        scale = 0.28; // Kits are super tiny like Molekit!
    } else if (cat.rank === 'Apprentice') {
        scale = 0.7; // Apprentices are smaller
    } else if (cat.rank === 'Elder') {
        scale = 0.9; // Elders are slightly smaller
    }
    
    // Better pattern markings
    let catPatternMarkings = '';
    if (pattern === 'tabby') {
        catPatternMarkings = `
            <path d="M-12 -4 Q-9 0 -12 4" stroke="${patternColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M-6 -6 Q-3 0 -6 6" stroke="${patternColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M0 -5 Q3 0 0 5" stroke="${patternColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M6 -4 Q9 0 6 4" stroke="${patternColor}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        `;
    } else if (pattern === 'spotted') {
        catPatternMarkings = `
            <circle cx="-10" cy="-2" r="3.5" fill="${patternColor}" opacity="0.9"/>
            <circle cx="-2" cy="4" r="3" fill="${patternColor}" opacity="0.9"/>
            <circle cx="8" cy="-2" r="2.5" fill="${patternColor}" opacity="0.9"/>
            <circle cx="-5" cy="-6" r="2" fill="${patternColor}" opacity="0.9"/>
            <circle cx="3" cy="-4" r="2" fill="${patternColor}" opacity="0.9"/>
        `;
    } else if (pattern === 'patched') {
        catPatternMarkings = `
            <ellipse cx="-6" cy="-2" rx="9" ry="7" fill="${patternColor}" opacity="0.85"/>
            <ellipse cx="10" cy="3" rx="6" ry="5" fill="${patternColor}" opacity="0.8"/>
        `;
    }
    
    const x = GameState.playerX;
    const y = GameState.playerY;
    
    // Get current emotion and pose
    const emotion = GameState.currentEmotion || 'normal';
    const isSitting = GameState.isSitting;
    const isSleeping = GameState.isSleeping;
    const isHiding = GameState.isHiding;
    
    // Hiding makes cat nearly invisible
    const hideOpacity = isHiding ? 0.3 : 1.0;
    
    // Emotion-based eye and mouth variations
    let eyeStyle = '';
    let mouthStyle = '';
    let extraEffects = '';
    
    if (emotion === 'happy') {
        // Happy - curved closed eyes (^_^) style
        eyeStyle = `
            <path d="M10,-12 Q14,-8 18,-12" stroke="${eyeColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M22,-12 Q26,-8 30,-12" stroke="${eyeColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
        `;
        mouthStyle = `
            <path d="M17,-3 Q20,1 23,-3" stroke="#d88a90" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        `;
        extraEffects = `
            <circle cx="36" cy="-18" r="3" fill="#ffb6c1" opacity="0.7"/>
            <circle cx="4" cy="-18" r="3" fill="#ffb6c1" opacity="0.7"/>
        `;
    } else if (emotion === 'mad') {
        // Mad - angry narrow eyes
        eyeStyle = `
            <ellipse cx="14" cy="-12" rx="3.5" ry="3" fill="white"/>
            <ellipse cx="26" cy="-12" rx="3.5" ry="3" fill="white"/>
            <ellipse cx="14" cy="-12" rx="2.5" ry="2.5" fill="${eyeColor}"/>
            <ellipse cx="26" cy="-12" rx="2.5" ry="2.5" fill="${eyeColor}"/>
            <ellipse cx="14" cy="-12" rx="1.2" ry="2" fill="#0a0a0a"/>
            <ellipse cx="26" cy="-12" rx="1.2" ry="2" fill="#0a0a0a"/>
            <!-- Angry eyebrows -->
            <line x1="9" y1="-17" x2="17" y2="-15" stroke="${veryDarkFur}" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="31" y1="-17" x2="23" y2="-15" stroke="${veryDarkFur}" stroke-width="2.5" stroke-linecap="round"/>
        `;
        mouthStyle = `
            <path d="M17,-2 L20,-4 L23,-2" stroke="#d88a90" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        `;
        extraEffects = `
            <g fill="#ff6b6b" opacity="0.8">
                <polygon points="36,-20 38,-16 34,-16"/>
                <polygon points="38,-18 40,-14 36,-14"/>
            </g>
        `;
    } else if (emotion === 'sad') {
        // Sad - droopy eyes with tears
        eyeStyle = `
            <ellipse cx="14" cy="-11" rx="4" ry="3.5" fill="white"/>
            <ellipse cx="26" cy="-11" rx="4" ry="3.5" fill="white"/>
            <ellipse cx="14" cy="-10" rx="3" ry="3" fill="${eyeColor}"/>
            <ellipse cx="26" cy="-10" rx="3" ry="3" fill="${eyeColor}"/>
            <ellipse cx="14" cy="-10" rx="1.5" ry="2.5" fill="#0a0a0a"/>
            <ellipse cx="26" cy="-10" rx="1.5" ry="2.5" fill="#0a0a0a"/>
            <!-- Sad eyebrows -->
            <line x1="10" y1="-15" x2="17" y2="-16" stroke="${darkerFur}" stroke-width="2" stroke-linecap="round"/>
            <line x1="30" y1="-15" x2="23" y2="-16" stroke="${darkerFur}" stroke-width="2" stroke-linecap="round"/>
        `;
        mouthStyle = `
            <path d="M17,-2 Q20,-5 23,-2" stroke="#d88a90" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        `;
        extraEffects = `
            <ellipse cx="10" cy="-6" rx="1.5" ry="2.5" fill="#7ec8e3" opacity="0.8"/>
        `;
    } else if (isSleeping) {
        // Sleeping - peaceful closed eyes
        eyeStyle = `
            <path d="M10,-12 Q14,-10 18,-12" stroke="#3a3a4a" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M22,-12 Q26,-10 30,-12" stroke="#3a3a4a" stroke-width="2" fill="none" stroke-linecap="round"/>
        `;
        mouthStyle = `
            <ellipse cx="20" cy="-4" rx="2" ry="1.5" fill="#d88a90" opacity="0.8"/>
        `;
        extraEffects = `
            <text x="34" y="-22" fill="#9999aa" font-size="11" font-weight="bold">z</text>
            <text x="40" y="-28" fill="#7777aa" font-size="9" font-weight="bold">z</text>
            <text x="45" y="-33" fill="#5555aa" font-size="7" font-weight="bold">z</text>
        `;
    } else {
        // Normal - beautiful almond-shaped cat eyes
        eyeStyle = `
            <!-- Eye whites -->
            <ellipse cx="14" cy="-12" rx="4" ry="4.5" fill="white"/>
            <ellipse cx="26" cy="-12" rx="4" ry="4.5" fill="white"/>
            <!-- Iris -->
            <ellipse cx="14" cy="-12" rx="3" ry="4" fill="${eyeColor}"/>
            <ellipse cx="26" cy="-12" rx="3" ry="4" fill="${eyeColor}"/>
            <!-- Pupils (vertical cat slits) -->
            <ellipse cx="14" cy="-12" rx="1.2" ry="3.5" fill="#0a0a0a"/>
            <ellipse cx="26" cy="-12" rx="1.2" ry="3.5" fill="#0a0a0a"/>
            <!-- Eye shine -->
            <circle cx="12.5" cy="-14" r="1.2" fill="white" opacity="0.95"/>
            <circle cx="24.5" cy="-14" r="1.2" fill="white" opacity="0.95"/>
            <circle cx="15" cy="-10" r="0.6" fill="white" opacity="0.6"/>
            <circle cx="27" cy="-10" r="0.6" fill="white" opacity="0.6"/>
        `;
        mouthStyle = `
            <!-- Muzzle area -->
            <ellipse cx="20" cy="-5" rx="6" ry="4" fill="${chestFur}" opacity="0.4"/>
            <!-- Nose - pink triangle -->
            <path d="M18,-5 L22,-5 L20,-2 Z" fill="#d88a90"/>
            <ellipse cx="20" cy="-4.5" rx="1.5" ry="1" fill="#c87a80"/>
            <!-- Mouth lines -->
            <path d="M18,-2 Q20,-1 22,-2" stroke="${veryDarkFur}" stroke-width="0.8" fill="none"/>
        `;
    }
    
    // Different pose based on sitting/sleeping
    let bodyPose = '';
    let tailPose = '';
    let legsPose = '';
    
    if (isSitting || isSleeping) {
        // Sitting/sleeping pose - elegant curled up cat
        tailPose = `
            <!-- Fluffy curled tail -->
            <path d="M-16 10 Q-28 14 -24 22 Q-16 26 -4 22" stroke="${veryDarkFur}" stroke-width="8" fill="none" stroke-linecap="round"/>
            <path d="M-15 9 Q-26 13 -22 20 Q-14 24 -3 20" stroke="${darkerFur}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M-14 8 Q-24 12 -20 18 Q-12 22 -2 18" stroke="${furColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
            <!-- Tail tip fluff -->
            <ellipse cx="-3" cy="18" rx="4" ry="3" fill="${furColor}"/>
        `;
        legsPose = `
            <!-- Neatly tucked front paws -->
            <ellipse cx="-6" cy="14" rx="7" ry="5" fill="${darkerFur}"/>
            <ellipse cx="6" cy="14" rx="7" ry="5" fill="${darkerFur}"/>
            <ellipse cx="-6" cy="13" rx="6" ry="4" fill="${furColor}"/>
            <ellipse cx="6" cy="13" rx="6" ry="4" fill="${furColor}"/>
            <!-- Paw details -->
            <ellipse cx="-6" cy="15" rx="3" ry="2" fill="${darkerFur}"/>
            <ellipse cx="6" cy="15" rx="3" ry="2" fill="${darkerFur}"/>
        `;
        bodyPose = `
            <!-- Main body - curled -->
            <ellipse cx="0" cy="6" rx="20" ry="14" fill="${veryDarkFur}"/>
            <ellipse cx="0" cy="4" rx="18" ry="12" fill="${darkerFur}"/>
            <ellipse cx="0" cy="2" rx="16" ry="10" fill="${furColor}"/>
            <!-- Fur highlights -->
            <ellipse cx="0" cy="-2" rx="12" ry="6" fill="${lighterFur}" opacity="0.25"/>
            <ellipse cx="-4" cy="0" rx="6" ry="4" fill="${chestFur}" opacity="0.2"/>
            ${catPatternMarkings}
        `;
    } else {
        // Standing pose - proud warrior cat
        tailPose = `
            <!-- Fluffy upright tail -->
            <path d="M-20 4 Q-36 -2 -34 -24 Q-32 -34 -26 -32" stroke="${veryDarkFur}" stroke-width="9" fill="none" stroke-linecap="round"/>
            <path d="M-19 3 Q-34 -2 -32 -23 Q-30 -32 -25 -30" stroke="${darkerFur}" stroke-width="7" fill="none" stroke-linecap="round"/>
            <path d="M-18 2 Q-32 -2 -30 -22 Q-28 -30 -24 -28" stroke="${furColor}" stroke-width="5" fill="none" stroke-linecap="round"/>
            <!-- Tail tip poof -->
            <ellipse cx="-25" cy="-30" rx="4" ry="5" fill="${furColor}"/>
        `;
        legsPose = `
            <!-- Back legs - muscular and realistic -->
            <path d="M-18 8 L-20 18 Q-18 24 -14 22" stroke="${veryDarkFur}" stroke-width="8" fill="none" stroke-linecap="round"/>
            <ellipse cx="-14" cy="22" rx="5" ry="3" fill="${darkerFur}"/>
            <path d="M-10 8 L-8 18 Q-6 24 -2 22" stroke="${darkerFur}" stroke-width="7" fill="none" stroke-linecap="round"/>
            <ellipse cx="-2" cy="22" rx="5" ry="3" fill="${furColor}"/>
            
            <!-- Front legs - slender -->
            <path d="M8 8 L6 18 Q8 24 12 22" stroke="${darkerFur}" stroke-width="7" fill="none" stroke-linecap="round"/>
            <ellipse cx="12" cy="22" rx="5" ry="3" fill="${darkerFur}"/>
            <path d="M16 8 L18 18 Q20 24 24 22" stroke="${furColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <ellipse cx="24" cy="22" rx="5" ry="3" fill="${furColor}"/>
            
            <!-- Paw details -->
            <ellipse cx="-14" cy="23" rx="3" ry="1.5" fill="${veryDarkFur}"/>
            <ellipse cx="12" cy="23" rx="3" ry="1.5" fill="${veryDarkFur}"/>
        `;
        bodyPose = `
            <!-- Body with depth and fur texture -->
            <ellipse cx="0" cy="2" rx="22" ry="15" fill="${veryDarkFur}"/>
            <ellipse cx="0" cy="0" rx="20" ry="13" fill="${darkerFur}"/>
            <ellipse cx="0" cy="-2" rx="18" ry="11" fill="${furColor}"/>
            <!-- Highlight fur -->
            <ellipse cx="0" cy="-5" rx="14" ry="7" fill="${lighterFur}" opacity="0.2"/>
            ${catPatternMarkings}
            
            <!-- Fluffy chest -->
            <ellipse cx="14" cy="0" rx="8" ry="7" fill="${chestFur}" opacity="0.5"/>
            <ellipse cx="12" cy="-2" rx="5" ry="4" fill="${lighterFur}" opacity="0.3"/>
            
            <!-- Neck fluff -->
            <ellipse cx="18" cy="-6" rx="6" ry="8" fill="${furColor}"/>
            <ellipse cx="20" cy="-8" rx="4" ry="5" fill="${chestFur}" opacity="0.3"/>
        `;
    }
    
    return `
        <!-- Player cat - beautiful Warrior Cat style -->
        <g id="player-cat" transform="translate(${x}, ${y}) scale(${scale})" filter="url(#softShadow)" opacity="${hideOpacity}" style="pointer-events: none;">
            <!-- Ground shadow -->
            <ellipse cx="4" cy="24" rx="26" ry="7" fill="rgba(0,0,0,0.3)"/>
            
            <!-- Tail -->
            ${tailPose}
            
            <!-- Legs -->
            ${legsPose}
            
            <!-- Body -->
            ${bodyPose}
            
            <!-- Head - more feline shaped -->
            <ellipse cx="20" cy="-10" rx="14" ry="12" fill="${veryDarkFur}"/>
            <ellipse cx="20" cy="-11" rx="13" ry="11" fill="${darkerFur}"/>
            <ellipse cx="20" cy="-12" rx="12" ry="10" fill="${furColor}"/>
            <!-- Head highlight -->
            <ellipse cx="20" cy="-14" rx="9" ry="7" fill="${lighterFur}" opacity="0.15"/>
            
            <!-- Ears - tall pointed cat ears -->
            <polygon points="7,-16 8,-32 18,-20" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="9,-17 9,-28 16,-20" fill="${darkerFur}" opacity="0.25"/>
            <polygon points="10,-18 10,-26 15,-20" fill="#e8b4b8" opacity="0.7"/>
            
            <polygon points="22,-20 32,-32 33,-16" fill="${furColor}" stroke="${darkerFur}" stroke-width="0.5"/>
            <polygon points="24,-20 30,-28 31,-18" fill="${darkerFur}" opacity="0.25"/>
            <polygon points="25,-20 29,-26 30,-19" fill="#e8b4b8" opacity="0.7"/>
            
            <!-- Ear tufts -->
            <ellipse cx="8" cy="-30" rx="2" ry="3" fill="${lighterFur}" opacity="0.6"/>
            <ellipse cx="32" cy="-30" rx="2" ry="3" fill="${lighterFur}" opacity="0.6"/>
            
            <!-- Eyes (emotion-based) -->
            ${eyeStyle}
            
            <!-- Mouth (emotion-based) -->
            ${mouthStyle}
            
            <!-- Extra effects -->
            ${extraEffects}
            
            <!-- Long whiskers -->
            <g stroke="#e0e0e0" stroke-width="0.6" opacity="0.8">
                <line x1="9" y1="-5" x2="-6" y2="-8"/>
                <line x1="9" y1="-3" x2="-6" y2="-3"/>
                <line x1="9" y1="-1" x2="-6" y2="2"/>
                <line x1="31" y1="-5" x2="46" y2="-8"/>
                <line x1="31" y1="-3" x2="46" y2="-3"/>
                <line x1="31" y1="-1" x2="46" y2="2"/>
            </g>
            
            <!-- Fur tufts on cheeks -->
            <ellipse cx="4" cy="-8" rx="3" ry="4" fill="${chestFur}" opacity="0.4"/>
            <ellipse cx="36" cy="-8" rx="3" ry="4" fill="${chestFur}" opacity="0.4"/>
        </g>
    `;
}

// Movement functions
function handleKeyDown(e) {
    if (GameState.currentScreen !== 'game') return;
    
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            movePlayer(0, -20);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            movePlayer(0, 20);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            movePlayer(-20, 0);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            movePlayer(20, 0);
            break;
        case ' ':
        case 'Enter':
            checkLocationAction();
            break;
    }
}

function movePlayer(dx, dy) {
    const newX = GameState.playerX + dx;
    const newY = GameState.playerY + dy;
    
    // Bounds checking
    const minX = 30, maxX = 420;
    const minY = 50, maxY = 370;
    
    if (newX >= minX && newX <= maxX) {
        GameState.playerX = newX;
    }
    if (newY >= minY && newY <= maxY) {
        GameState.playerY = newY;
    }
    
    renderGameWorld();
    updateActionButton();
}

function updateActionButton() {
    const btn = document.getElementById('action-btn');
    const location = getCurrentLocation();
    
    if (location) {
        btn.textContent = `🎯 ${location.name}`;
    } else {
        btn.textContent = '❓ Look Around';
    }
}

function getCurrentLocation() {
    const x = GameState.playerX;
    const y = GameState.playerY;
    const threshold = 50;
    
    if (GameState.currentLocation === 'camp') {
        // Check camp locations
        const locations = {
            nursery: { x: 90, y: 310 },
            elders: { x: 360, y: 310 },
            warriors: { x: 70, y: 150 },
            apprentices: { x: 380, y: 150 },
            medicine: { x: 225, y: 80 },
            leader: { x: 225, y: 320 },
            highrock: { x: 225, y: 200 },
            freshkill: { x: 140, y: 230 },
            water: { x: 310, y: 230 },
            exit: { x: 420, y: 50 }
        };
        
        for (const [key, loc] of Object.entries(locations)) {
            const dist = Math.sqrt((x - loc.x) ** 2 + (y - loc.y) ** 2);
            if (dist < threshold) {
                return { key, ...CAMP_LOCATIONS[key] || { name: key } };
            }
        }
    }
    
    return null;
}

function checkLocationAction() {
    const location = getCurrentLocation();
    
    if (location) {
        interactWithLocation(location.key);
    } else {
        showMessage('Nothing interesting here...');
    }
}

function interactWithLocation(locationKey) {
    const cat = GameState.catData;
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    actions.innerHTML = '';
    
    switch (locationKey) {
        case 'nursery':
            title.textContent = 'Nursery';
            desc.textContent = 'Where queens and kits rest safely. Warriors leave food and water here.';
            if (cat.rank === 'Kit') {
                addAction(actions, 'Sleep', () => {
                    restInDen();
                    closePopup();
                });
                addAction(actions, 'Eat (food left by warriors)', () => {
                    cat.hunger = Math.min(100, cat.hunger + 30);
                    showMessage('You ate the food left by the warriors!');
                    updateGameUI();
                    saveGameData();
                    closePopup();
                });
                addAction(actions, 'Drink (water in moss)', () => {
                    cat.thirst = Math.min(100, cat.thirst + 30);
                    showMessage('You drank water from the moss!');
                    updateGameUI();
                    saveGameData();
                    closePopup();
                });
            } else if (cat.rank === 'Warrior' || cat.rank === 'Apprentice') {
                addAction(actions, 'Leave food for kits', () => {
                    showMessage('You left some prey for the kits!');
                    cat.experience += 5;
                    closePopup();
                });
                addAction(actions, 'Leave water in moss for kits', () => {
                    showMessage('You brought water in moss for the kits!');
                    cat.experience += 5;
                    closePopup();
                });
            }
            break;
            
        case 'elders':
            title.textContent = "Elders' Den";
            desc.textContent = 'The elders share stories of the old days.';
            if (cat.rank === 'Elder') {
                addAction(actions, 'Rest', () => {
                    restInDen();
                    closePopup();
                });
            }
            addAction(actions, 'Listen to stories', () => {
                showMessage('The elders tell you about the great battles of the past!');
                cat.experience += 5;
                closePopup();
            });
            break;
            
        case 'warriors':
            title.textContent = "Warriors' Den";
            desc.textContent = 'Where the brave warriors rest between patrols.';
            if (cat.rank === 'Warrior' || cat.rank === 'Deputy') {
                addAction(actions, 'Rest', () => {
                    restInDen();
                    closePopup();
                });
            }
            break;
            
        case 'apprentices':
            title.textContent = "Apprentices' Den";
            desc.textContent = 'Young cats learning to become warriors.';
            if (cat.rank === 'Apprentice') {
                addAction(actions, 'Rest', () => {
                    restInDen();
                    closePopup();
                });
            }
            break;
            
        case 'medicine':
            title.textContent = 'Medicine Den';
            desc.textContent = 'The medicine cat can heal you with herbs.';
            if (GameState.herbs.length > 0) {
                addAction(actions, 'Give herbs to medicine cat', () => {
                    giveHerbsToMedicineCat();
                    closePopup();
                });
            }
            if (cat.health < 100) {
                addAction(actions, 'Ask for healing', () => {
                    askForHealing();
                    closePopup();
                });
            }
            break;
            
        case 'leader':
            title.textContent = "Leader's Den";
            desc.textContent = 'The clan leader rests here.';
            if (cat.rank === 'Leader') {
                addAction(actions, 'Rest', () => {
                    restInDen();
                    closePopup();
                });
                addAction(actions, 'Call a clan meeting', () => {
                    showMessage('All cats gather at the High Rock!');
                    closePopup();
                });
            }
            break;
            
        case 'highrock':
            title.textContent = 'High Rock';
            desc.textContent = 'Where clan meetings are held.';
            if (cat.rank === 'Leader') {
                addAction(actions, 'Address the clan', () => {
                    showMessage('"Let all cats old enough to catch their own prey gather!"');
                    cat.experience += 10;
                    closePopup();
                });
            }
            break;
            
        case 'freshkill':
            title.textContent = 'Fresh-kill Pile';
            desc.textContent = 'Food for the clan. Warriors and apprentices add prey here.';
            // Check meal limit for warriors/apprentices
            if (cat.rank === 'Warrior' || cat.rank === 'Apprentice' || cat.rank === 'Deputy') {
                if (GameState.mealsToday >= 3) {
                    desc.textContent += ' You have already eaten 3 times today.';
                } else {
                    addAction(actions, `Eat (${3 - GameState.mealsToday} meals left today)`, () => {
                        eatFromPile();
                        closePopup();
                    });
                }
                addAction(actions, 'Add prey to pile', () => {
                    showMessage('You added your catch to the fresh-kill pile!');
                    cat.experience += 5;
                    closePopup();
                });
            } else {
                addAction(actions, 'Eat', () => {
                    eatFromPile();
                    closePopup();
                });
            }
            break;
            
        case 'water':
            title.textContent = 'Water';
            desc.textContent = `Fresh water for drinking. (Drinks today: ${GameState.drinksToday}/5)`;
            addAction(actions, 'Drink', () => {
                cat.thirst = Math.min(100, cat.thirst + 40);
                GameState.drinksToday++;
                showMessage('Refreshing water!');
                updateGameUI();
                saveGameData();
                closePopup();
                checkMealsForNight();
            });
            break;
            
        case 'exit':
            title.textContent = 'Camp Exit';
            
            // If visiting another clan, go back home
            if (GameState.visitingClan) {
                desc.textContent = 'Return to your own clan?';
                addAction(actions, 'Go back home', () => {
                    GameState.selectedClan = GameState.homeClan;
                    cat.clan = GameState.homeClan;
                    GameState.visitingClan = false;
                    GameState.playerX = 200;
                    GameState.playerY = 200;
                    renderGameWorld();
                    showMessage('You return to your own camp. Home sweet home!');
                    closePopup();
                });
                addAction(actions, 'Stay a bit longer', closePopup);
                break;
            }
            
            // Kits can sneak out if no one is watching!
            if (cat.rank === 'Kit') {
                const watchChance = Math.random();
                const watchers = ['Dustpelt', 'Sandstorm', 'Cloudtail', 'Brightheart', 'Thornclaw'];
                const watcher = watchers[Math.floor(Math.random() * watchers.length)];
                
                // 65% chance no one is watching (35% someone is watching)
                if (watchChance < 0.35) {
                    const watcherSays = [
                        `${watcher} is sitting by the exit, watching carefully.`,
                        `${watcher} sees you and shakes their head. "Not so fast, little one!"`,
                        `${watcher} is guarding the entrance. No sneaking out right now!`,
                        `Uh oh! ${watcher} is right there watching the exit!`
                    ];
                    desc.textContent = watcherSays[Math.floor(Math.random() * watcherSays.length)];
                    addAction(actions, 'Wait for them to leave', () => {
                        showMessage('You wait, but they\'re still watching... Maybe try again later?');
                        closePopup();
                    });
                } else {
                    const clearMessages = [
                        'No one is watching the exit! Now\'s your chance!',
                        'The coast is clear! All the warriors are busy...',
                        'Everyone is distracted. You could sneak out!',
                        'The exit is unguarded! Quick, before someone sees!'
                    ];
                    desc.textContent = clearMessages[Math.floor(Math.random() * clearMessages.length)];
                    
                    // Ask a friend to come!
                    addAction(actions, 'Ask a friend to come', () => {
                        closePopup();
                        askKitToSneakOut();
                    });
                    
                    addAction(actions, 'Sneak alone to forest', () => {
                        sneakOutOfCamp('forest');
                        closePopup();
                    });
                    // Show all clans EXCEPT your current clan
                    const allClans = ['thunder', 'shadow', 'river', 'wind'];
                    for (const clanKey of allClans) {
                        if (clanKey !== cat.clan) {
                            addAction(actions, `Sneak to ${CLANS[clanKey].name}`, () => {
                                sneakOutOfCamp(clanKey);
                                closePopup();
                            });
                        }
                    }
                }
                addAction(actions, 'Go back', closePopup);
            } else {
                desc.textContent = 'Leave camp to hunt and gather herbs.';
                addAction(actions, 'Go to forest', () => {
                    GameState.currentLocation = 'forest';
                    GameState.playerX = 225;
                    GameState.playerY = 200;
                    renderGameWorld();
                    showMessage('You left the camp to explore the forest!');
                    closePopup();
                });
                // Warriors can also visit other clans
                addAction(actions, 'Visit another clan', () => {
                    closePopup();
                    showClanVisitOptions();
                });
            }
            break;
    }
    
    popup.classList.remove('hidden');
}

function addAction(container, text, callback) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.addEventListener('click', callback);
    container.appendChild(btn);
}

function closePopup() {
    document.getElementById('location-popup').classList.add('hidden');
}

function closeInventory() {
    document.getElementById('inventory-popup').classList.add('hidden');
}

function showInventory() {
    const popup = document.getElementById('inventory-popup');
    const list = document.getElementById('herb-list');
    
    if (GameState.herbs.length === 0) {
        list.innerHTML = '<p class="no-herbs">No herbs collected yet. Find them in the forest!</p>';
    } else {
        list.innerHTML = GameState.herbs.map(h => {
            const herb = HERBS[h];
            return `<div class="herb-item">${herb.name}</div>`;
        }).join('');
    }
    
    document.getElementById('herb-count').textContent = GameState.herbs.length;
    popup.classList.remove('hidden');
}

// Kit sneaking out of camp!
function sneakOutOfCamp(destination) {
    const cat = GameState.catData;
    
    showMessage('You sneak past the camp entrance... your heart is racing!');
    
    setTimeout(() => {
        // Chance of getting caught!
        if (Math.random() < 0.3) {
            // Caught!
            const catchers = ['Sandstorm', 'Brambleclaw', 'Dustpelt', 'Ferncloud'];
            const catcher = catchers[Math.floor(Math.random() * catchers.length)];
            showMessage(`${catcher} spots you! "Where do you think you're going, little one?"`);
            setTimeout(() => {
                showMessage('You are carried back to the nursery...');
            }, 2500);
            return;
        }
        
        // Made it out!
        showMessage('You made it out! The forest stretches before you...');
        
        setTimeout(() => {
            if (destination === 'forest') {
                GameState.currentLocation = 'forest';
                GameState.playerX = 225;
                GameState.playerY = 200;
                renderGameWorld();
                showMessage('The forest is big and scary for a little kit! Be careful!');
            } else {
                // Going to another clan!
                visitOtherClan(destination);
            }
        }, 2500);
    }, 2500);
}

// Visit another clan's territory
function visitOtherClan(clanKey) {
    const cat = GameState.catData;
    const clanNames = {
        'shadow': 'ShadowClan',
        'river': 'RiverClan',
        'wind': 'WindClan',
        'thunder': 'ThunderClan'
    };
    const clanName = clanNames[clanKey] || 'the other clan';
    
    showMessage(`You sneak through the forest toward ${clanName} territory...`);
    
    setTimeout(() => {
        // Different outcomes
        const outcome = Math.random();
        
        if (outcome < 0.3) {
            // Get caught by a patrol and sent back
            showMessage(`A ${clanName} patrol spots you! "What are you doing here, little kit?"`);
            setTimeout(() => {
                showMessage(`They escort you back to the border. "Go home where you belong!"`);
                setTimeout(() => {
                    showMessage('You run back to your camp...');
                    GameState.playerX = 200;
                    GameState.playerY = 200;
                    renderGameWorld();
                }, 2500);
            }, 2500);
        } else if (outcome < 0.6) {
            // Meet a friendly cat
            showMessage(`A ${clanName} cat finds you. "Hello little one, are you lost?"`);
            setTimeout(() => {
                showMessage('They are kind and show you around a bit before sending you home.');
                cat.experience += 10;
                setTimeout(() => {
                    showMessage('What an adventure! You head back to camp.');
                    GameState.playerX = 200;
                    GameState.playerY = 200;
                    renderGameWorld();
                }, 2500);
            }, 2500);
        } else if (outcome < 0.85) {
            // You get to explore!
            showMessage(`You sneak into ${clanName}'s camp and hide in the bushes!`);
            setTimeout(() => {
                showMessage('You see their warriors, their leader on the high rock... This is exciting!');
                cat.experience += 15;
                setTimeout(() => {
                    showMessage('Before anyone notices, you sneak back home. What an adventure!');
                    GameState.playerX = 200;
                    GameState.playerY = 200;
                    renderGameWorld();
                }, 3000);
            }, 2500);
        } else {
            // You can stay for a while! (Temporary visit)
            showMessage(`You made it to ${clanName}'s camp! You hide and watch...`);
            setTimeout(() => {
                // Temporarily change to that clan's camp view
                const oldClan = cat.clan;
                GameState.selectedClan = clanKey;
                GameState.playerX = 380;
                GameState.playerY = 350;
                renderGameWorld();
                showMessage(`You are exploring ${clanName}! Don't get caught! Click Exit to go home.`);
                
                // Set a flag so they can go back
                GameState.visitingClan = true;
                GameState.homeClan = oldClan;
            }, 2500);
        }
    }, 2500);
}

// Show clan visit options for warriors
function showClanVisitOptions() {
    const cat = GameState.catData;
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    title.textContent = 'Visit Another Clan';
    desc.textContent = 'Where would you like to go? (Diplomatic visit)';
    actions.innerHTML = '';
    
    const clans = ['thunder', 'shadow', 'river', 'wind'];
    for (const clan of clans) {
        if (clan !== cat.clan) {
            addAction(actions, `Visit ${CLANS[clan].name}`, () => {
                closePopup();
                diplomaticVisit(clan);
            });
        }
    }
    addAction(actions, 'Cancel', closePopup);
    
    popup.classList.remove('hidden');
}

// Ask another kit to sneak out with you!
function askKitToSneakOut() {
    const kits = ['Molekit', 'Cherrykit', 'Lilykit', 'Seedkit', 'Honeykit'];
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    title.textContent = 'Ask a Friend!';
    desc.textContent = 'Which kit do you want to ask to sneak out with you?';
    actions.innerHTML = '';
    
    for (const kitName of kits) {
        addAction(actions, kitName, () => {
            closePopup();
            
            // Random chance they say yes or no
            const saysYes = Math.random() > 0.3; // 70% chance they say yes
            
            if (saysYes) {
                const yesResponses = [
                    `${kitName}: "Yes! Let's go on an adventure!"`,
                    `${kitName}: "Okay! This is so exciting!"`,
                    `${kitName}: "An adventure? Count me in!"`,
                    `${kitName}: "Let's do it! But we have to be careful!"`
                ];
                showSpeechBubble(kitName, yesResponses[Math.floor(Math.random() * yesResponses.length)].split(': "')[1].replace('"', ''));
                showMessage(yesResponses[Math.floor(Math.random() * yesResponses.length)]);
                
                // Store that a friend is coming
                GameState.sneakingWithFriend = kitName;
                
                setTimeout(() => {
                    sneakOutWithFriend(kitName);
                }, 2000);
            } else {
                const noResponses = [
                    `${kitName}: "No way! We'll get in trouble!"`,
                    `${kitName}: "I'm scared... What if there are foxes?"`,
                    `${kitName}: "My mom would be so mad! I can't..."`,
                    `${kitName}: "Maybe another time... I'm too tired."`
                ];
                showSpeechBubble(kitName, noResponses[Math.floor(Math.random() * noResponses.length)].split(': "')[1].replace('"', ''));
                showMessage(noResponses[Math.floor(Math.random() * noResponses.length)]);
            }
        });
    }
    
    addAction(actions, 'Never mind', closePopup);
    popup.classList.remove('hidden');
}

// Sneak out with a friend!
function sneakOutWithFriend(friendName) {
    const cat = GameState.catData;
    
    showMessage(`You and ${friendName} sneak toward the exit together...`);
    
    setTimeout(() => {
        // Higher chance of getting caught with a friend (they might make noise!)
        if (Math.random() < 0.4) {
            const catchers = ['Sandstorm', 'Ferncloud', 'Dustpelt'];
            const catcher = catchers[Math.floor(Math.random() * catchers.length)];
            showMessage(`${catcher} spots you! "Where do you two think you're going?!"`);
            showSpeechBubble(friendName, 'Uh oh!');
            setTimeout(() => {
                showMessage('You are both carried back to the nursery...');
                GameState.sneakingWithFriend = null;
            }, 2000);
            return;
        }
        
        // Made it out together!
        showMessage(`You and ${friendName} made it out! The forest awaits!`);
        showSpeechBubble(friendName, 'We did it!');
        
        setTimeout(() => {
            GameState.currentLocation = 'forest';
            GameState.playerX = 225;
            GameState.playerY = 200;
            renderGameWorld();
            
            // Friend provides some protection/company
            showMessage(`${friendName} stays close to you. "This is scary but fun!"`);
            
            // With a friend, you might get warned about danger
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    showSpeechBubble(friendName, 'Did you hear that?!');
                    showMessage(`${friendName} looks nervous. "Maybe we should go back soon..."`);
                }, 5000);
            }
        }, 2000);
    }, 2000);
}

// Diplomatic visit for warriors
function diplomaticVisit(clanKey) {
    const clanName = CLANS[clanKey].name;
    const cat = GameState.catData;
    
    showMessage(`You travel to ${clanName} for a diplomatic visit...`);
    
    setTimeout(() => {
        showMessage(`The ${clanName} cats greet you at the border.`);
        setTimeout(() => {
            // Temporarily show that clan's camp
            const oldClan = cat.clan;
            GameState.selectedClan = clanKey;
            GameState.playerX = 380;
            GameState.playerY = 350;
            renderGameWorld();
            showMessage(`Welcome to ${clanName}! Click Exit to return home.`);
            
            GameState.visitingClan = true;
            GameState.homeClan = oldClan;
            cat.experience += 10;
        }, 2500);
    }, 2000);
}

// Update time indicator
function updateTimeIndicator() {
    const indicator = document.getElementById('time-indicator');
    if (indicator) {
        indicator.textContent = GameState.isNight ? 'Night' : 'Day';
        indicator.style.background = GameState.isNight ? 'rgba(0, 0, 50, 0.8)' : 'rgba(0, 0, 0, 0.7)';
    }
}

function restInDen() {
    const cat = GameState.catData;
    
    // Can only sleep at night
    if (!GameState.isNight) {
        showMessage('It is daytime! You can only sleep at night.');
        return;
    }
    
    cat.health = Math.min(100, cat.health + 25);
    cat.age += 1;
    checkRankUp();
    showMessage('You had a good rest! (+1 moon old)');
    updateGameUI();
    saveGameData();
}

function eatFromPile() {
    const cat = GameState.catData;
    
    // Track meals for everyone
    GameState.mealsToday++;
    
    // Check meal limit for warriors and apprentices
    if (cat.rank === 'Warrior' || cat.rank === 'Apprentice' || cat.rank === 'Deputy') {
        if (GameState.mealsToday > 3) {
            showMessage('You have already eaten 3 times today. Wait until tomorrow.');
            GameState.mealsToday = 3; // Cap it
            return;
        }
    }
    
    cat.hunger = Math.min(100, cat.hunger + 35);
    
    // Leaders can eat whenever - no limit message
    if (cat.rank === 'Leader') {
        showMessage('Yummy! As leader, you may eat whenever you wish!');
    } else if (cat.rank === 'Kit' || cat.rank === 'Elder' || cat.rank === 'Queen') {
        showMessage('Yummy! That was delicious!');
    } else {
        showMessage(`Yummy! That was delicious! (Meals: ${GameState.mealsToday}/3)`);
    }
    
    updateGameUI();
    saveGameData();
    checkMealsForNight();
}

function collectHerb(herbType, index) {
    const herb = HERBS[herbType];
    GameState.herbs.push(herbType);
    document.getElementById('herb-count').textContent = GameState.herbs.length;
    showMessage(`You found ${herb.name}!`);
}

function huntPrey() {
    const cat = GameState.catData;
    
    // Kits and elders can't hunt
    if (cat.rank === 'Kit') {
        showMessage("You're too young to hunt! The warriors will bring you food.");
        return;
    }
    
    if (Math.random() > 0.3) {
        cat.hunger = Math.min(100, cat.hunger + 30);
        cat.experience += 10;
        showMessage('You caught a mouse! Yummy!');
    } else {
        showMessage('The mouse got away...');
    }
    
    updateGameUI();
    saveGameData();
}

// Hunting mini-game!
let huntingGameActive = false;
let mousePosition = { x: 200, y: 200 };
let mouseInterval = null;
let huntingTimeout = null;

function startHuntingGame() {
    const cat = GameState.catData;
    
    // Kits can't hunt!
    if (cat.rank === 'Kit') {
        showMessage("You're too young to hunt! Go back to camp!");
        return;
    }
    
    if (cat.rank === 'Elder') {
        showMessage("Your hunting days are over. Rest your old bones!");
        return;
    }
    
    huntingGameActive = true;
    mousePosition = { x: 200 + Math.random() * 200, y: 150 + Math.random() * 200 };
    
    showMessage('A mouse! Quick, click on it to catch it!');
    
    renderHuntingGame();
    
    // Mouse moves around
    mouseInterval = setInterval(() => {
        if (huntingGameActive) {
            // Mouse moves to random position
            mousePosition.x = 100 + Math.random() * 400;
            mousePosition.y = 100 + Math.random() * 300;
            renderHuntingGame();
        }
    }, 800); // Mouse moves every 0.8 seconds
    
    // Time limit - 8 seconds to catch
    huntingTimeout = setTimeout(() => {
        if (huntingGameActive) {
            endHuntingGame(false);
        }
    }, 8000);
}

function renderHuntingGame() {
    const gameWorld = document.getElementById('game-world');
    
    gameWorld.innerHTML = `
        <svg id="hunting-svg" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
            <defs>
                <radialGradient id="huntGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#2a4a2a"/>
                    <stop offset="100%" stop-color="#1a2a1a"/>
                </radialGradient>
            </defs>
            
            <!-- Hunting ground -->
            <rect x="0" y="0" width="600" height="500" fill="url(#huntGlow)"/>
            
            <!-- Grass texture -->
            <ellipse cx="150" cy="400" rx="80" ry="30" fill="#2a5a2a" opacity="0.5"/>
            <ellipse cx="400" cy="350" rx="100" ry="40" fill="#2a5a2a" opacity="0.4"/>
            <ellipse cx="300" cy="450" rx="120" ry="35" fill="#2a5a2a" opacity="0.5"/>
            
            <!-- Leaves and debris -->
            <circle cx="100" cy="200" r="3" fill="#8B4513" opacity="0.6"/>
            <circle cx="450" cy="280" r="4" fill="#CD853F" opacity="0.5"/>
            <circle cx="250" cy="150" r="3" fill="#A0522D" opacity="0.6"/>
            
            <!-- THE MOUSE! Click it! -->
            <g id="hunt-mouse" class="clickable" style="cursor: pointer;">
                <ellipse cx="${mousePosition.x}" cy="${mousePosition.y}" rx="18" ry="12" fill="#8B7355"/>
                <circle cx="${mousePosition.x - 10}" cy="${mousePosition.y - 4}" r="4" fill="#7a6a5a"/>
                <circle cx="${mousePosition.x - 13}" cy="${mousePosition.y - 5}" r="2" fill="#1a1a1a"/>
                <ellipse cx="${mousePosition.x + 15}" cy="${mousePosition.y}" rx="8" ry="3" fill="#9a8a7a"/>
                <circle cx="${mousePosition.x - 6}" cy="${mousePosition.y - 8}" r="5" fill="#8B7355"/>
                <circle cx="${mousePosition.x - 3}" cy="${mousePosition.y - 8}" r="5" fill="#8B7355"/>
            </g>
            
            <!-- Instructions -->
            <text x="300" y="50" text-anchor="middle" fill="#ffd700" font-size="20" font-weight="bold" style="text-shadow: 2px 2px 4px black;">CLICK THE MOUSE!</text>
            <text x="300" y="480" text-anchor="middle" fill="#aaa" font-size="14">Hurry! It's getting away!</text>
            
            <!-- Cancel button -->
            <g id="cancel-hunt" class="clickable" style="cursor: pointer;">
                <rect x="20" y="20" width="80" height="30" rx="5" fill="#6a4a4a" stroke="#8a6a6a" stroke-width="2"/>
                <text x="60" y="40" text-anchor="middle" fill="white" font-size="12">Give up</text>
            </g>
        </svg>
    `;
    
    // Add click handler for mouse
    document.getElementById('hunt-mouse')?.addEventListener('click', () => {
        endHuntingGame(true);
    });
    
    // Add cancel handler
    document.getElementById('cancel-hunt')?.addEventListener('click', () => {
        endHuntingGame(false);
    });
}

function endHuntingGame(caught) {
    huntingGameActive = false;
    if (mouseInterval) clearInterval(mouseInterval);
    if (huntingTimeout) clearTimeout(huntingTimeout);
    
    const cat = GameState.catData;
    
    if (caught) {
        cat.hunger = Math.min(100, cat.hunger + 35);
        cat.experience += 15;
        showMessage('Great catch! You caught the mouse!');
    } else {
        showMessage('The mouse escaped into its hole...');
    }
    
    updateGameUI();
    saveGameData();
    
    // Return to forest
    GameState.currentLocation = 'forest';
    renderGameWorld();
}

// Forest events - dangers and patrols!
function checkForestEvents() {
    const cat = GameState.catData;
    
    // If with a warrior, they protect you!
    if (GameState.withWarrior) {
        // Warrior keeps you safe - no danger events
        // Small chance warrior points something out
        if (Math.random() < 0.02) {
            const observations = [
                `${GameState.withWarrior}: "See those tracks? A rabbit passed by here."`,
                `${GameState.withWarrior}: "Listen... can you hear the birds?"`,
                `${GameState.withWarrior}: "Smell that? The wind is changing."`,
                `${GameState.withWarrior}: "This is where we hunt for mice."`
            ];
            showMessage(observations[Math.floor(Math.random() * observations.length)]);
        }
        return; // No danger when with a warrior!
    }
    
    // Kits in forest ALONE - warriors might find them!
    if (cat.rank === 'Kit' && !GameState.isHiding) {
        // 20% chance per render a warrior finds you
        if (Math.random() < 0.2) {
            setTimeout(() => warriorFindsKit(), 2000);
        }
    }
    
    // Random danger encounters (fox or dog)
    if (Math.random() < 0.05) { // 5% chance
        setTimeout(() => randomDangerEncounter(), 3000);
    }
}

function warriorFindsKit() {
    const cat = GameState.catData;
    if (cat.rank !== 'Kit' || GameState.currentLocation !== 'forest') return;
    if (GameState.isHiding) {
        showMessage('You stay hidden as a patrol passes by...');
        return;
    }
    
    const warriors = ['Dustpelt', 'Sandstorm', 'Cloudtail', 'Thornclaw', 'Brackenfur'];
    const warrior = warriors[Math.floor(Math.random() * warriors.length)];
    
    showSpeechBubble(warrior, 'What are you doing out here?!');
    
    setTimeout(() => {
        showMessage(`${warrior} found you! "Kits shouldn't be in the forest alone!"`);
        setTimeout(() => {
            showMessage(`${warrior} carries you back to camp by your scruff!`);
            GameState.currentLocation = 'camp';
            GameState.playerX = 200;
            GameState.playerY = 280;
            renderGameWorld();
            
            setTimeout(() => {
                showMessage('You\'re back in the nursery. The queens look worried!');
            }, 1500);
        }, 2000);
    }, 1500);
}

function randomDangerEncounter() {
    if (GameState.currentLocation !== 'forest') return;
    
    const dangers = ['fox', 'dog', 'badger'];
    const danger = dangers[Math.floor(Math.random() * dangers.length)];
    
    encounterDanger(danger);
}

function encounterDanger(dangerType) {
    const cat = GameState.catData;
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    const dangerInfo = {
        fox: { name: 'Fox', damage: 40, color: '#cc6633' },
        dog: { name: 'Dog', damage: 50, color: '#8B4513' },
        badger: { name: 'Badger', damage: 45, color: '#333333' }
    };
    
    const info = dangerInfo[dangerType] || dangerInfo.fox;
    
    // If with a warrior, they protect you and carry you back!
    if (GameState.withWarrior) {
        const warrior = GameState.withWarrior;
        showMessage(`A ${info.name.toLowerCase()} appears!`);
        
        setTimeout(() => {
            showSpeechBubble(warrior, 'Get behind me!');
            showMessage(`${warrior} jumps in front of you to protect you!`);
            
            setTimeout(() => {
                showMessage(`${warrior} hisses and slashes at the ${info.name.toLowerCase()}!`);
                
                setTimeout(() => {
                    // Warrior always wins or scares it off
                    if (Math.random() < 0.7) {
                        showMessage(`${warrior} chases the ${info.name.toLowerCase()} away!`);
                    } else {
                        showMessage(`The ${info.name.toLowerCase()} runs off, scared of ${warrior}!`);
                    }
                    
                    setTimeout(() => {
                        showSpeechBubble(warrior, 'Are you okay? We need to get back to camp!');
                        showMessage(`${warrior} quickly picks you up by your scruff.`);
                        
                        setTimeout(() => {
                            showMessage(`${warrior} races back to camp, keeping you safe.`);
                            
                            setTimeout(() => {
                                GameState.currentLocation = 'camp';
                                GameState.playerX = 90;
                                GameState.playerY = 300;
                                GameState.withWarrior = null;
                                renderGameWorld();
                                
                                showMessage(`You're safe in the nursery! ${warrior} tells everyone what happened.`);
                                showSpeechBubble(warrior, 'That was close! Stay in camp from now on.');
                                
                                cat.experience += 5;
                                updateGameUI();
                                saveGameData();
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 1500);
        return;
    }
    
    // If sneaking with a kit friend, they scream and a warrior might hear!
    if (GameState.sneakingWithFriend && cat.rank === 'Kit') {
        const friend = GameState.sneakingWithFriend;
        showMessage(`A ${info.name.toLowerCase()} appears!`);
        
        setTimeout(() => {
            showSpeechBubble(friend, 'HELP! A ' + info.name.toLowerCase() + '!');
            showMessage(`${friend} screams for help!`);
            
            setTimeout(() => {
                // 60% chance a warrior hears and saves you
                if (Math.random() < 0.6) {
                    const warriors = ['Sandstorm', 'Graystripe', 'Dustpelt', 'Cloudtail', 'Brackenfur'];
                    const savior = warriors[Math.floor(Math.random() * warriors.length)];
                    
                    showMessage(`${savior} comes running from the camp!`);
                    
                    setTimeout(() => {
                        showSpeechBubble(savior, 'Get away from those kits!');
                        showMessage(`${savior} attacks the ${info.name.toLowerCase()}!`);
                        
                        setTimeout(() => {
                            showMessage(`${savior} chases the ${info.name.toLowerCase()} away!`);
                            
                            setTimeout(() => {
                                showSpeechBubble(savior, 'What were you two THINKING?!');
                                showMessage(`${savior} picks you both up and carries you back to camp.`);
                                
                                setTimeout(() => {
                                    GameState.currentLocation = 'camp';
                                    GameState.playerX = 90;
                                    GameState.playerY = 300;
                                    GameState.sneakingWithFriend = null;
                                    renderGameWorld();
                                    
                                    showMessage(`You're in big trouble... but at least you're safe!`);
                                    updateGameUI();
                                    saveGameData();
                                }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                } else {
                    // No one hears - kits are in danger!
                    showMessage(`No one hears ${friend}'s cries...`);
                    
                    setTimeout(() => {
                        showMessage(`The ${info.name.toLowerCase()} gets closer... You and ${friend} are too small!`);
                        setTimeout(() => {
                            catDeath(`caught by a ${info.name.toLowerCase()} with ${friend}`);
                        }, 2000);
                    }, 2000);
                }
            }, 2000);
        }, 1500);
        return;
    }
    
    // Kits die instantly to foxes and dogs - they're too small to survive!
    if (cat.rank === 'Kit' && (dangerType === 'fox' || dangerType === 'dog')) {
        showMessage(`A ${info.name.toLowerCase()} appears! You're too small to escape!`);
        setTimeout(() => {
            showMessage(`The ${info.name.toLowerCase()} catches you... You were too little to survive alone in the forest.`);
            setTimeout(() => {
                catDeath(`caught by a ${info.name.toLowerCase()} in the forest`);
            }, 2500);
        }, 2000);
        return;
    }
    
    title.textContent = `DANGER! A ${info.name}!`;
    desc.textContent = `A ${info.name.toLowerCase()} is blocking your path! What do you do?`;
    actions.innerHTML = '';
    
    addAction(actions, 'RUN!', () => {
        closePopup();
        const escapeChance = cat.rank === 'Kit' ? 0.4 : 0.7; // Kits are slower
        
        if (Math.random() < escapeChance) {
            showMessage(`You run as fast as you can! The ${info.name.toLowerCase()} doesn't catch you!`);
        } else {
            cat.health -= Math.floor(info.damage * 0.5);
            showMessage(`The ${info.name.toLowerCase()} scratches you as you escape! (-${Math.floor(info.damage * 0.5)} health)`);
            if (cat.health <= 0) {
                catDeath(`killed by a ${info.name.toLowerCase()}`);
                return;
            }
        }
        updateGameUI();
        saveGameData();
    });
    
    if (cat.rank !== 'Kit' && cat.rank !== 'Elder') {
        addAction(actions, 'Fight!', () => {
            closePopup();
            const fightChance = 0.4 + (cat.experience / 500); // Better odds with experience
            
            if (Math.random() < fightChance) {
                cat.experience += 30;
                showMessage(`You fought off the ${info.name.toLowerCase()}! You're a brave warrior!`);
            } else {
                cat.health -= info.damage;
                showMessage(`The ${info.name.toLowerCase()} overpowers you! (-${info.damage} health)`);
                if (cat.health <= 0) {
                    catDeath(`killed by a ${info.name.toLowerCase()}`);
                    return;
                }
            }
            updateGameUI();
            saveGameData();
        });
    }
    
    addAction(actions, 'Hide!', () => {
        closePopup();
        GameState.isHiding = true;
        renderGameWorld();
        
        if (Math.random() < 0.8) { // 80% chance hiding works
            showMessage(`You hide in the bushes... The ${info.name.toLowerCase()} sniffs around and leaves.`);
        } else {
            cat.health -= Math.floor(info.damage * 0.3);
            showMessage(`The ${info.name.toLowerCase()} finds you! It scratches you before running off.`);
            if (cat.health <= 0) {
                catDeath(`killed by a ${info.name.toLowerCase()}`);
                return;
            }
        }
        
        setTimeout(() => {
            GameState.isHiding = false;
            renderGameWorld();
        }, 2000);
        
        updateGameUI();
        saveGameData();
    });
    
    popup.classList.remove('hidden');
}

function catDeath(cause) {
    const cat = GameState.catData;
    
    // Leaders have 9 lives!
    if (cat.rank === 'Leader' && cat.lives > 1) {
        cat.lives--;
        cat.health = 100;
        showMessage(`You lost a life! You have ${cat.lives} ${cat.lives === 1 ? 'life' : 'lives'} remaining.`);
        setTimeout(() => {
            showMessage('StarClan grants you strength. You wake up, alive again!');
            updateGameUI();
            saveGameData();
            renderGameWorld();
        }, 2500);
        return;
    }
    
    // Final death
    cat.health = 100;
    cat.rank = 'StarClan';
    goToStarClan();
}

function giveHerbsToMedicineCat() {
    if (GameState.herbs.length === 0) return;
    
    const herbCount = GameState.herbs.length;
    GameState.herbs = [];
    document.getElementById('herb-count').textContent = '0';
    
    const cat = GameState.catData;
    cat.experience += herbCount * 5;
    
    showMessage(`🌿 The medicine cat thanks you for the ${herbCount} herbs!`);
    saveGameData();
}

function askForHealing() {
    const cat = GameState.catData;
    const healAmount = 20;
    
    cat.health = Math.min(100, cat.health + healAmount);
    showMessage(`💊 The medicine cat healed you! (+${healAmount} health)`);
    updateGameUI();
    saveGameData();
}

// Game loop
let gameLoopInterval;
let dayNightInterval;

// Day/Night cycle constants
const DAY_LENGTH_MS = 20 * 60 * 1000; // 20 minutes per day

let npcAnimationInterval = null;

function startGameLoop() {
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (dayNightInterval) clearInterval(dayNightInterval);
    if (npcAnimationInterval) clearInterval(npcAnimationInterval);
    
    // Initialize day start time if not set
    if (!GameState.dayStartTime) {
        GameState.dayStartTime = Date.now();
        GameState.mealsToday = 0;
        GameState.isNight = false;
    }
    
    // Day/night cycle check every 10 seconds
    dayNightInterval = setInterval(() => {
        checkDayNightCycle();
    }, 10000);
    
    // NPC animation - update positions and re-render every 100ms
    npcAnimationInterval = setInterval(() => {
        if (GameState.currentScreen !== 'game') return;
        if (GameState.currentLocation !== 'camp') return;
        updateNPCPositions();
        renderGameWorld();
    }, 100);
    
    gameLoopInterval = setInterval(() => {
        if (GameState.catData.inStarClan) return;
        if (GameState.isNight) return; // No actions during night
        
        const cat = GameState.catData;
        
        // Decrease hunger and thirst over time
        cat.hunger = Math.max(0, cat.hunger - 0.5);
        cat.thirst = Math.max(0, cat.thirst - 0.7);
        
        // Kits and elders get fed automatically by the clan - but ONLY in camp!
        // In the forest, you're on your own!
        if ((cat.rank === 'Kit' || cat.rank === 'Elder') && GameState.currentLocation === 'camp') {
            // Auto-feed when hungry
            if (cat.hunger < 30) {
                cat.hunger = Math.min(100, cat.hunger + 25);
                showMessage('A warrior brought you some fresh-kill!');
            }
            // Auto-water when thirsty
            if (cat.thirst < 30) {
                cat.thirst = Math.min(100, cat.thirst + 20);
                showMessage('A warrior brought you water in moss!');
            }
        }
        
        // If very thirsty, a cat brings you water in moss - only in camp!
        if (cat.thirst < 20 && cat.rank !== 'Kit' && cat.rank !== 'Elder' && GameState.currentLocation === 'camp') {
            cat.thirst = Math.min(100, cat.thirst + 25);
            showMessage('A clanmate noticed you were thirsty and brought water in moss!');
        }
        
        // If sick (low health), cats come to help - only in camp!
        if (cat.health < 40 && GameState.currentLocation === 'camp') {
            // Medicine cat or helper brings food and water
            if (cat.hunger < 50) {
                cat.hunger = Math.min(100, cat.hunger + 20);
                showMessage('A kind clanmate brought you fresh-kill while you rest.');
            }
            if (cat.thirst < 50) {
                cat.thirst = Math.min(100, cat.thirst + 20);
                showMessage('The medicine cat brought you water soaked in moss.');
            }
        }
        
        // In the forest, kits are in danger if not hiding!
        if (GameState.currentLocation === 'forest' && cat.rank === 'Kit') {
            showMessage('The forest is dangerous for kits! Go back to camp!');
        }
        
        // If hungry or thirsty, decrease health
        if (cat.hunger <= 0 || cat.thirst <= 0) {
            cat.health = Math.max(0, cat.health - 1);
        }
        
        // Check for death
        if (cat.health <= 0) {
            goToStarClan();
            return;
        }
        
        // Save herbs to cat data
        cat.herbs = GameState.herbs;
        
        // Check for enemy raid
        checkForRaid();
        
        // Random NPC chatter
        triggerRandomNPCChat();
        
        updateGameUI();
        saveGameData();
    }, 1000);
}

// Check day/night cycle
function checkDayNightCycle() {
    const elapsed = Date.now() - GameState.dayStartTime;
    
    if (elapsed >= DAY_LENGTH_MS && !GameState.isNight) {
        // Night time!
        startNight();
    }
}

// Check if eaten 3 and drunk 5 = night time!
function checkMealsForNight() {
    if (GameState.isNight) return;
    
    if (GameState.mealsToday >= 3 && GameState.drinksToday >= 5) {
        showMessage('You have eaten and drunk enough for the day. Night is falling...');
        setTimeout(() => {
            startNight();
        }, 2000);
    }
}

function startNight() {
    GameState.isNight = true;
    const cat = GameState.catData;
    
    // Check if it's a gathering night (random chance, but not for kits)
    const isGathering = Math.random() > 0.5 && cat.rank !== 'Kit';
    GameState.isGatheringNight = isGathering;
    
    if (isGathering) {
        showMessage('Tonight is a Gathering! All cats except kits go to Fourtrees to meet the other clans.');
        setTimeout(() => {
            showGatheringScreen();
        }, 3000);
    } else {
        showMessage('Night has fallen. All cats go to sleep...');
        setTimeout(() => {
            endNight();
        }, 5000);
    }
}

function showGatheringScreen() {
    const cat = GameState.catData;
    showMessage('At the Gathering, the leaders share news from each clan. You meet cats from other clans!');
    cat.experience += 15;
    
    setTimeout(() => {
        showMessage('The Gathering is over. The clans return to their camps.');
        setTimeout(() => {
            endNight();
        }, 3000);
    }, 5000);
}

function endNight() {
    GameState.isNight = false;
    GameState.dayStartTime = Date.now();
    GameState.mealsToday = 0; // Reset meal count for new day
    GameState.drinksToday = 0; // Reset drink count for new day
    GameState.isGatheringNight = false;
    
    const cat = GameState.catData;
    // Heal a bit from sleeping
    cat.health = Math.min(100, cat.health + 10);
    cat.age += 1;
    checkRankUp();
    
    showMessage('Morning has come! A new day begins. (+1 moon)');
    renderGameWorld();
    updateGameUI();
    saveGameData();
}

// Perform an action
function performAction(action) {
    const cat = GameState.catData;
    let message = '';
    
    switch (action) {
        case 'hunt':
            if (Math.random() > 0.3) {
                cat.hunger = Math.min(100, cat.hunger + 30);
                cat.experience += 10;
                message = '🎯 You caught a mouse! Yummy!';
            } else {
                message = '🐭 The mouse got away...';
            }
            break;
            
        case 'drink':
            cat.thirst = Math.min(100, cat.thirst + 40);
            message = '💧 Refreshing water!';
            break;
            
        case 'patrol':
            if (Math.random() > 0.7) {
                // Enemy encounter
                cat.health = Math.max(0, cat.health - 15);
                cat.experience += 20;
                message = '⚔️ You fought off an intruder! (-15 health)';
            } else {
                cat.experience += 5;
                message = '👁️ Territory is safe!';
            }
            break;
            
        case 'rest':
            cat.health = Math.min(100, cat.health + 20);
            // Age up when resting
            cat.age += 1;
            checkRankUp();
            message = '😴 You feel rested! (+1 moon old)';
            break;
    }
    
    showMessage(message);
    updateGameUI();
    saveGameData();
}

// Check if cat should rank up
function checkRankUp() {
    const cat = GameState.catData;
    const clanName = CLANS[cat.clan]?.name || 'the clan';
    
    // Kit to Apprentice at 6 moons
    if (cat.rank === 'Kit' && cat.age >= 6) {
        cat.rank = 'Apprentice';
        cat.name = cat.firstName + 'paw';
        holdClanMeeting('apprentice', cat.name);
    }
    // Apprentice to Warrior with enough experience
    else if (cat.rank === 'Apprentice' && cat.experience >= 100) {
        const suffix = NAME_SUFFIXES.warrior[Math.floor(Math.random() * NAME_SUFFIXES.warrior.length)];
        cat.rank = 'Warrior';
        cat.name = cat.firstName + suffix;
        holdClanMeeting('warrior', cat.name);
    }
    // Warrior to Deputy (luck + experience)
    else if (cat.rank === 'Warrior' && cat.experience >= 200 && Math.random() > 0.95) {
        cat.rank = 'Deputy';
        cat.isDeputy = true;
        holdClanMeeting('deputy', cat.name);
    }
    // Deputy to Leader (luck)
    else if (cat.rank === 'Deputy' && Math.random() > 0.98) {
        cat.rank = 'Leader';
        cat.isLeader = true;
        cat.name = cat.firstName + 'star';
        holdClanMeeting('leader', cat.name);
    }
    
    saveGameData();
}

// Hold a clan meeting for ceremonies
function holdClanMeeting(ceremonyType, catName) {
    const cat = GameState.catData;
    const clanName = CLANS[cat.clan]?.name || 'the clan';
    
    // Leader calls from High Rock
    showMessage('Firestar calls from the High Rock: "Let all cats old enough to catch their own prey gather!"');
    
    setTimeout(() => {
        switch (ceremonyType) {
            case 'apprentice':
                showMessage(`"${catName}, you have reached six moons. From this day forward, you will be known as ${catName}!"`);
                setTimeout(() => {
                    showMessage(`The clan chants: "${catName}! ${catName}!"`);
                }, 3000);
                break;
            case 'warrior':
                showMessage(`"I, Firestar, leader of ${clanName}, call upon StarClan to look down on this apprentice..."`);
                setTimeout(() => {
                    showMessage(`"${catName}, do you promise to uphold the warrior code?" You nod solemnly.`);
                    setTimeout(() => {
                        showMessage(`"Then by the powers of StarClan, I give you your warrior name: ${catName}!"`);
                        setTimeout(() => {
                            showMessage(`The clan chants: "${catName}! ${catName}!" You are now a warrior!`);
                        }, 3000);
                    }, 3000);
                }, 3000);
                break;
            case 'deputy':
                showMessage(`"The time has come to appoint a new deputy. I say these words before StarClan..."`);
                setTimeout(() => {
                    showMessage(`"${catName} will be the new deputy of ${clanName}!"`);
                    setTimeout(() => {
                        showMessage(`The clan chants: "${catName}! ${catName}!" You are now deputy!`);
                    }, 3000);
                }, 3000);
                break;
            case 'leader':
                showMessage(`You travel to the Moonstone to receive your nine lives from StarClan...`);
                setTimeout(() => {
                    showMessage(`StarClan grants you nine lives. You are now ${catName}, leader of ${clanName}!`);
                    setTimeout(() => {
                        showMessage(`The clan chants: "${catName}! ${catName}!" You are the leader!`);
                    }, 3000);
                }, 3000);
                break;
            case 'elder':
                showMessage(`"${catName} has served the clan well. It is time to join the elders."`);
                setTimeout(() => {
                    showMessage(`The clan thanks you for your service. You are now an elder.`);
                }, 3000);
                break;
            case 'medicine':
                showMessage(`"${catName} has been chosen to walk the path of a medicine cat."`);
                setTimeout(() => {
                    showMessage(`You will heal and guide your clanmates. You are now a medicine cat!`);
                }, 3000);
                break;
        }
    }, 3000);
    
    updateGameUI();
    renderGameWorld();
}

// Emotion/Action functions
function setEmotion(emotion) {
    GameState.currentEmotion = emotion;
    GameState.isSitting = false;
    GameState.isSleeping = false;
    
    // Update button states
    document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
    if (emotion === 'happy') {
        document.getElementById('emote-happy').classList.add('active');
        showMessage('You purr happily!');
    } else if (emotion === 'mad') {
        document.getElementById('emote-mad').classList.add('active');
        showMessage('You hiss angrily! Your fur stands on end!');
    }
    
    renderGameWorld();
    
    // Reset emotion after a bit
    setTimeout(() => {
        if (GameState.currentEmotion === emotion) {
            GameState.currentEmotion = 'normal';
            document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
            renderGameWorld();
        }
    }, 5000);
}

function toggleSit() {
    GameState.isSitting = !GameState.isSitting;
    GameState.isSleeping = false;
    GameState.currentEmotion = 'normal';
    
    document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
    if (GameState.isSitting) {
        document.getElementById('emote-sit').classList.add('active');
        showMessage('You sit down and wrap your tail around your paws.');
    } else {
        showMessage('You stand up, ready to move.');
    }
    renderGameWorld();
}

function toggleRest() {
    GameState.isSleeping = !GameState.isSleeping;
    GameState.isSitting = false;
    GameState.currentEmotion = 'normal';
    
    document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
    if (GameState.isSleeping) {
        document.getElementById('emote-sleep').classList.add('active');
        showMessage('You curl up for a rest... (+5 health)');
        // Small health boost from resting - NO aging!
        const cat = GameState.catData;
        cat.health = Math.min(100, cat.health + 5);
        updateGameUI();
        saveGameData();
    } else {
        showMessage('You wake up and stretch, feeling refreshed!');
    }
    renderGameWorld();
}

function doPurr() {
    GameState.currentEmotion = 'happy';
    showSpeechBubble('player', '*purrrrrr*');
    showMessage('You purr happily! Your clanmates smile.');
    
    document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('emote-purr').classList.add('active');
    
    renderGameWorld();
    
    // NPCs might respond
    setTimeout(() => {
        if (Math.random() > 0.5) {
            const responses = [
                { cat: 'Sandstorm', text: '*purrs back*' },
                { cat: 'Leafpool', text: 'How sweet!' },
                { cat: 'Cloudtail', text: '*purrs*' },
                { cat: 'Ferncloud', text: 'Aww!' }
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            showSpeechBubble(response.cat, response.text);
        }
    }, 1500);
    
    setTimeout(() => {
        GameState.currentEmotion = 'normal';
        document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
        renderGameWorld();
    }, 4000);
}

function doHiss() {
    GameState.currentEmotion = 'mad';
    showSpeechBubble('player', '*HISSSSS!*');
    showMessage('You hiss! Your fur stands on end!');
    
    document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('emote-hiss').classList.add('active');
    
    renderGameWorld();
    
    // NPCs react to hissing
    setTimeout(() => {
        const responses = [
            { cat: 'Brambleclaw', text: 'What\'s wrong?!' },
            { cat: 'Dustpelt', text: 'Easy there!' },
            { cat: 'Squirrelpaw', text: 'Yikes!' },
            { cat: 'Cloudtail', text: 'Whoa!' },
            { cat: 'Sandstorm', text: 'Calm down!' }
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        showSpeechBubble(response.cat, response.text);
    }, 1000);
    
    setTimeout(() => {
        GameState.currentEmotion = 'normal';
        document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
        renderGameWorld();
    }, 4000);
}

function doAttack() {
    const cat = GameState.catData;
    
    // Kits can't attack!
    if (cat.rank === 'Kit') {
        showMessage('You\'re too small to attack!');
        return;
    }
    
    // Show attack menu
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    title.textContent = 'Attack!';
    desc.textContent = 'Who do you want to attack?';
    actions.innerHTML = '';
    
    if (GameState.currentLocation === 'forest') {
        addAction(actions, 'Attack Prey', () => {
            closePopup();
            startHuntingGame();
        });
        
        addAction(actions, 'Practice Fighting', () => {
            closePopup();
            practiceFighting();
        });
    } else {
        // In camp
        addAction(actions, 'Practice with a Warrior', () => {
            closePopup();
            practiceFighting();
        });
        
        addAction(actions, 'Defend the Camp', () => {
            closePopup();
            if (Math.random() < 0.3) {
                showMessage('You patrol the camp entrance, ready to defend!');
                setTimeout(() => {
                    showMessage('A strange cat approaches! You chase it away!');
                    cat.experience += 15;
                    updateGameUI();
                    saveGameData();
                }, 3000);
            } else {
                showMessage('You patrol the camp entrance. All is quiet.');
                cat.experience += 5;
                updateGameUI();
                saveGameData();
            }
        });
    }
    
    addAction(actions, 'Cancel', closePopup);
    popup.classList.remove('hidden');
}

function practiceFighting() {
    const cat = GameState.catData;
    const trainers = ['Sandstorm', 'Dustpelt', 'Cloudtail', 'Brackenfur', 'Thornclaw'];
    const trainer = trainers[Math.floor(Math.random() * trainers.length)];
    
    showMessage(`You practice battle moves with ${trainer}!`);
    showSpeechBubble(trainer, 'Good form! Keep your claws sheathed!');
    
    setTimeout(() => {
        const moves = [
            'You practice the belly rake!',
            'You learn to duck and roll!',
            'You practice the front paw blow!',
            'You work on your balance!',
            'You practice pinning your opponent!'
        ];
        showMessage(moves[Math.floor(Math.random() * moves.length)]);
        
        setTimeout(() => {
            showSpeechBubble(trainer, 'Well done!');
            cat.experience += 10;
            updateGameUI();
            saveGameData();
        }, 2000);
    }, 2000);
}

function doSad() {
    GameState.currentEmotion = 'sad';
    GameState.isSitting = false;
    GameState.isSleeping = false;
    GameState.isHiding = false;
    
    showSpeechBubble('player', '*sniffles*');
    showMessage('You feel sad... your ears droop and your tail hangs low.');
    
    document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('emote-sad').classList.add('active');
    
    renderGameWorld();
    
    // NPCs might try to comfort you
    setTimeout(() => {
        if (Math.random() > 0.3) {
            const responses = [
                { cat: 'Sandstorm', text: 'What\'s wrong, little one?' },
                { cat: 'Ferncloud', text: 'Are you okay?' },
                { cat: 'Leafpool', text: 'Come here, let me comfort you.' },
                { cat: 'Molekit', text: 'Don\'t be sad! Wanna play?' },
                { cat: 'Cherrykit', text: 'I\'ll be your friend!' }
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            showSpeechBubble(response.cat, response.text);
        }
    }, 2000);
    
    setTimeout(() => {
        GameState.currentEmotion = 'normal';
        document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
        renderGameWorld();
    }, 6000);
}

function toggleHide() {
    GameState.isHiding = !GameState.isHiding;
    GameState.isSitting = false;
    GameState.isSleeping = false;
    GameState.currentEmotion = 'normal';
    
    document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
    
    if (GameState.isHiding) {
        document.getElementById('emote-hide').classList.add('active');
        showMessage('You hide! No one can see you now...');
        showSpeechBubble('player', '*hides*');
    } else {
        showMessage('You come out of hiding!');
    }
    renderGameWorld();
}

function doMeow() {
    showSpeechBubble('player', 'Meow!');
    
    // Random clanmate responds with speech bubble
    const responses = [
        { cat: 'Brambleclaw', text: 'Hello there!' },
        { cat: 'Sandstorm', text: '*purrs*' },
        { cat: 'Firestar', text: 'Greetings, young one.' },
        { cat: 'Leafpool', text: 'StarClan bless you!' },
        { cat: 'Cloudtail', text: 'Meow!' },
        { cat: 'Squirrelpaw', text: 'Hi! Wanna play?' }
    ];
    
    setTimeout(() => {
        const response = responses[Math.floor(Math.random() * responses.length)];
        showSpeechBubble(response.cat, response.text);
    }, 1500);
}

// Speech Bubble System
let activeSpeechBubbles = [];

function openSpeechPopup() {
    const cat = GameState.catData;
    const popup = document.getElementById('speech-popup');
    const buttonsContainer = popup.querySelector('.speech-quick-buttons');
    
    // Update buttons based on rank
    if (cat && cat.rank === 'Leader') {
        buttonsContainer.innerHTML = `
            <button class="quick-speech-btn" data-text="Let all cats old enough to catch their own prey gather!">Call Meeting</button>
            <button class="quick-speech-btn leader-patrol" data-text="patrol">Send Patrol</button>
            <button class="quick-speech-btn leader-steal" data-text="steal">Steal a Kit</button>
            <button class="quick-speech-btn" data-text="You have done well.">Praise</button>
            <button class="quick-speech-btn" data-text="We must be vigilant.">Warn Clan</button>
            <button class="quick-speech-btn" data-text="Hello!">Hello!</button>
        `;
        
        // Add handlers for leader buttons
        buttonsContainer.querySelector('.leader-patrol')?.addEventListener('click', (e) => {
            e.preventDefault();
            closeSpeechPopup();
            showPatrolMenu();
        });
        
        buttonsContainer.querySelector('.leader-steal')?.addEventListener('click', (e) => {
            e.preventDefault();
            closeSpeechPopup();
            showStealKitMenu();
        });
    } else if (cat && cat.rank === 'Kit') {
        buttonsContainer.innerHTML = `
            <button class="quick-speech-btn" data-text="Hello!">Hello!</button>
            <button class="quick-speech-btn" data-text="Let's play!">Let's play!</button>
            <button class="quick-speech-btn" data-text="I'm hungry">I'm hungry</button>
            <button class="quick-speech-btn" data-text="Can I go out with you?">Can I go out?</button>
            <button class="quick-speech-btn" data-text="Good job!">Good job!</button>
        `;
    } else {
        buttonsContainer.innerHTML = `
            <button class="quick-speech-btn" data-text="Hello!">Hello!</button>
            <button class="quick-speech-btn" data-text="Follow me!">Follow me!</button>
            <button class="quick-speech-btn" data-text="Watch out!">Watch out!</button>
            <button class="quick-speech-btn" data-text="Good job!">Good job!</button>
            <button class="quick-speech-btn" data-text="Let's hunt together!">Hunt together</button>
        `;
    }
    
    // Re-add click handlers for quick speech buttons
    buttonsContainer.querySelectorAll('.quick-speech-btn:not(.leader-patrol):not(.leader-steal)').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('speech-input').value = btn.dataset.text;
            sayPlayerSpeech();
        });
    });
    
    popup.classList.remove('hidden');
    document.getElementById('speech-input').value = '';
    document.getElementById('speech-input').focus();
}

function closeSpeechPopup() {
    document.getElementById('speech-popup').classList.add('hidden');
}

// Leader calls a clan meeting!
function leaderCallMeeting() {
    const cat = GameState.catData;
    showMessage(`${cat.name} calls from the High Rock: "Let all cats old enough to catch their own prey gather!"`);
    
    setTimeout(() => {
        showMessage('The clan gathers below the High Rock, looking up at their leader...');
        
        setTimeout(() => {
            const popup = document.getElementById('location-popup');
            const title = document.getElementById('location-title');
            const desc = document.getElementById('location-desc');
            const actions = document.getElementById('location-actions');
            
            title.textContent = 'Clan Meeting';
            desc.textContent = 'Your clan has gathered. What would you like to announce?';
            actions.innerHTML = '';
            
            addAction(actions, 'Make an Announcement', () => {
                closePopup();
                showMessage(`${cat.name}: "I have called you here to share important news!"`);
                setTimeout(() => {
                    showMessage('The clan listens attentively.');
                }, 2000);
            });
            
            addAction(actions, 'Assign Patrols', () => {
                closePopup();
                showPatrolMenu();
            });
            
            addAction(actions, 'Dismiss the Meeting', () => {
                closePopup();
                showMessage(`${cat.name}: "That is all. You are dismissed."`);
            });
            
            popup.classList.remove('hidden');
        }, 2000);
    }, 2000);
}

// Leader sends a patrol
function showPatrolMenu() {
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    title.textContent = 'Send a Patrol';
    desc.textContent = 'Choose a warrior to lead the patrol:';
    actions.innerHTML = '';
    
    const patrolLeaders = ['Sandstorm', 'Graystripe', 'Dustpelt', 'Brackenfur', 'Cloudtail'];
    const patrolMembers = ['Brambleclaw', 'Spiderleg', 'Thornclaw', 'Brightheart', 'Ferncloud'];
    
    patrolLeaders.forEach(leader => {
        addAction(actions, leader, () => {
            closePopup();
            // Pick 2 random patrol members
            const shuffled = patrolMembers.sort(() => 0.5 - Math.random());
            const member1 = shuffled[0];
            const member2 = shuffled[1];
            
            const cat = GameState.catData;
            showMessage(`${cat.name}: "${leader}, you lead a patrol with ${member1} and ${member2}!"`);
            showSpeechBubble(leader, 'Yes, ' + cat.name + '!');
            
            setTimeout(() => {
                showMessage(`${leader}, ${member1}, and ${member2} head out of camp...`);
                
                // They return after some time with prey
                setTimeout(() => {
                    showMessage(`${leader}'s patrol has returned!`);
                    setTimeout(() => {
                        const prey = ['mouse', 'vole', 'rabbit', 'squirrel', 'thrush'];
                        const caught = prey[Math.floor(Math.random() * prey.length)];
                        showSpeechBubble(leader, 'We caught a ' + caught + '!');
                        showMessage(`The patrol caught a ${caught} for the fresh-kill pile!`);
                    }, 1500);
                }, 10000); // 10 seconds
            }, 2000);
        });
    });
    
    addAction(actions, 'Cancel', closePopup);
    popup.classList.remove('hidden');
}

// Leader orders a cat to steal a kit
function showStealKitMenu() {
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    title.textContent = 'Steal a Kit';
    desc.textContent = 'Choose a warrior to send:';
    actions.innerHTML = '';
    
    const warriors = ['Brightheart', 'Sandstorm', 'Dustpelt', 'Cloudtail', 'Thornclaw'];
    const clans = ['ShadowClan', 'RiverClan', 'WindClan'];
    
    warriors.forEach(warrior => {
        addAction(actions, warrior, () => {
            closePopup();
            const targetClan = clans[Math.floor(Math.random() * clans.length)];
            const cat = GameState.catData;
            
            showMessage(`${cat.name}: "${warrior}, go steal a kit from ${targetClan}!"`);
            showSpeechBubble(warrior, 'I will do my best!');
            
            setTimeout(() => {
                showMessage(`${warrior} sneaks toward ${targetClan} territory...`);
                
                setTimeout(() => {
                    // 60% chance of success
                    if (Math.random() < 0.6) {
                        const kitNames = ['Fernkit', 'Oakkit', 'Willowkit', 'Stonekit', 'Dawnkit'];
                        const stolenKit = kitNames[Math.floor(Math.random() * kitNames.length)];
                        
                        showMessage(`${warrior} returns with a kit!`);
                        setTimeout(() => {
                            showSpeechBubble(warrior, 'I got ' + stolenKit + '!');
                            showMessage(`${stolenKit} from ${targetClan} has been brought to your clan!`);
                        }, 1500);
                    } else {
                        showMessage(`${warrior} returns empty-pawed.`);
                        setTimeout(() => {
                            showSpeechBubble(warrior, 'They saw me coming...');
                            showMessage(`${targetClan} was too well guarded.`);
                        }, 1500);
                    }
                }, 8000); // 8 seconds
            }, 2000);
        });
    });
    
    addAction(actions, 'Cancel', closePopup);
    popup.classList.remove('hidden');
}

function sayPlayerSpeech() {
    const input = document.getElementById('speech-input');
    const text = input.value.trim();
    const cat = GameState.catData;
    
    if (text) {
        showSpeechBubble('player', text);
        
        // Special kit actions!
        if (cat && cat.rank === 'Kit') {
            const lowerText = text.toLowerCase();
            
            // "Let's play!" opens games menu
            if (lowerText.includes("let's play") || lowerText.includes("lets play") || lowerText.includes("wanna play")) {
                closeSpeechPopup();
                setTimeout(() => {
                    showKitGamesMenu();
                }, 1000);
                return;
            }
            
            // "I'm hungry" makes a cat bring food
            if (lowerText.includes("hungry") || lowerText.includes("food")) {
                closeSpeechPopup();
                setTimeout(() => {
                    kitAskForFood();
                }, 1000);
                return;
            }
            
            // "Can I go out with you?" - ask a warrior to take you out
            if (lowerText.includes("go out") || lowerText.includes("take me out") || lowerText.includes("outside")) {
                closeSpeechPopup();
                setTimeout(() => {
                    askWarriorToTakeOut();
                }, 1000);
                return;
            }
        }
        
        // Leader special commands
        if (cat && cat.rank === 'Leader') {
            const lowerText = text.toLowerCase();
            
            // Call a clan meeting
            if (lowerText.includes("all cats") && lowerText.includes("gather")) {
                closeSpeechPopup();
                setTimeout(() => {
                    leaderCallMeeting();
                }, 1000);
                return;
            }
        }
        
        // NPCs might respond!
        if (Math.random() > 0.4) {
            setTimeout(() => {
                triggerNPCResponse(text);
            }, 2000);
        }
    }
    
    closeSpeechPopup();
}

// Kit games menu
function showKitGamesMenu() {
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('location-title');
    const desc = document.getElementById('location-desc');
    const actions = document.getElementById('location-actions');
    
    title.textContent = 'Pick a Game!';
    desc.textContent = 'What do you want to play?';
    actions.innerHTML = '';
    
    addAction(actions, 'Moss-ball', () => {
        closePopup();
        playKitGame('mossball');
    });
    addAction(actions, 'Chase', () => {
        closePopup();
        playKitGame('chase');
    });
    addAction(actions, 'Hide and Seek', () => {
        closePopup();
        playKitGame('hideseek');
    });
    addAction(actions, 'Play Fight', () => {
        closePopup();
        playKitGame('fight');
    });
    addAction(actions, 'Pounce Practice', () => {
        closePopup();
        playKitGame('pounce');
    });
    addAction(actions, 'Never mind', closePopup);
    
    popup.classList.remove('hidden');
}

// Kit game variables
let kitGameActive = false;
let kitGameInterval = null;
let kitGameTimeout = null;
let kitGameScore = 0;
let kitGamePlaymate = '';

function playKitGame(game) {
    const kits = ['Molekit', 'Cherrykit', 'Lilykit', 'Seedkit', 'Honeykit'];
    kitGamePlaymate = kits[Math.floor(Math.random() * kits.length)];
    kitGameActive = true;
    kitGameScore = 0;
    
    switch(game) {
        case 'mossball':
            startMossballGame();
            break;
        case 'chase':
            startChaseGame();
            break;
        case 'hideseek':
            startHideSeekGame();
            break;
        case 'fight':
            startPlayFightGame();
            break;
        case 'pounce':
            startPounceGame();
            break;
    }
}

// MOSS-BALL GAME - Click the ball to hit it back!
let mossballPosition = { x: 300, y: 200 };
let mossballVelocity = { x: 3, y: 2 };
let mossballHits = 0;
let mossballAnimationId = null;

function startMossballGame() {
    mossballHits = 0;
    mossballPosition = { x: 300, y: 200 };
    mossballVelocity = { x: 4, y: 3 };
    
    showMessage(`${kitGamePlaymate}: "Let's play moss-ball! Hit it 5 times to win!"`);
    
    // Create the game once
    const gameWorld = document.getElementById('game-world');
    gameWorld.innerHTML = `
        <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; touch-action: manipulation;">
            <defs>
                <radialGradient id="nurseryGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#4a4a3a"/>
                    <stop offset="100%" stop-color="#2a2a2a"/>
                </radialGradient>
            </defs>
            
            <rect x="0" y="0" width="600" height="400" fill="url(#nurseryGlow)"/>
            <text id="mossball-title" x="300" y="35" text-anchor="middle" fill="#ffd700" font-size="24" font-weight="bold">MOSS-BALL!</text>
            <text id="mossball-subtitle" x="300" y="60" text-anchor="middle" fill="#fff" font-size="16">Hit it 5 more times!</text>
            <text x="300" y="385" text-anchor="middle" fill="#aaa" font-size="16">Tap the moss-ball!</text>
            
            <!-- The moss-ball - bigger for mobile -->
            <g id="mossball" style="cursor: pointer;">
                <circle id="mossball-hitarea" cx="300" cy="200" r="45" fill="transparent"/>
                <circle id="mossball-main" cx="300" cy="200" r="35" fill="#5a8a3a"/>
                <circle id="mossball-spot1" cx="295" cy="195" r="10" fill="#4a7a2a"/>
                <circle id="mossball-spot2" cx="310" cy="205" r="8" fill="#6a9a4a"/>
                <circle id="mossball-spot3" cx="290" cy="210" r="7" fill="#3a6a1a"/>
            </g>
            
            <text id="mossball-score" x="50" y="60" fill="white" font-size="20" font-weight="bold">Hits: 0/5</text>
            
            <g id="quit-game" style="cursor: pointer;">
                <rect x="480" y="10" width="100" height="40" rx="8" fill="#6a4a4a" stroke="#8a6a6a" stroke-width="2"/>
                <text x="530" y="36" text-anchor="middle" fill="white" font-size="16">Quit</text>
            </g>
        </svg>
    `;
    
    // Add event listeners once
    const mossball = document.getElementById('mossball');
    const handleHit = (e) => {
        e.preventDefault();
        mossballHits++;
        document.getElementById('mossball-score').textContent = `Hits: ${mossballHits}/5`;
        document.getElementById('mossball-subtitle').textContent = `Hit it ${5 - mossballHits} more times!`;
        mossballVelocity.x = (Math.random() - 0.5) * 12;
        mossballVelocity.y = (Math.random() - 0.5) * 10;
        if (mossballHits >= 5) {
            endKitGame(true, 'mossball');
        }
    };
    mossball?.addEventListener('click', handleHit);
    mossball?.addEventListener('touchstart', handleHit, { passive: false });
    
    document.getElementById('quit-game')?.addEventListener('click', () => endKitGame(false, 'mossball'));
    document.getElementById('quit-game')?.addEventListener('touchstart', (e) => { e.preventDefault(); endKitGame(false, 'mossball'); });
    
    // Use requestAnimationFrame for smooth animation
    function animateMossball() {
        if (!kitGameActive) return;
        
        mossballPosition.x += mossballVelocity.x;
        mossballPosition.y += mossballVelocity.y;
        
        if (mossballPosition.x < 50 || mossballPosition.x > 550) mossballVelocity.x *= -1;
        if (mossballPosition.y < 80 || mossballPosition.y > 350) mossballVelocity.y *= -1;
        
        // Just update positions, don't recreate
        document.getElementById('mossball-hitarea')?.setAttribute('cx', mossballPosition.x);
        document.getElementById('mossball-main')?.setAttribute('cx', mossballPosition.x);
        document.getElementById('mossball-main')?.setAttribute('cy', mossballPosition.y);
        document.getElementById('mossball-hitarea')?.setAttribute('cy', mossballPosition.y);
        document.getElementById('mossball-spot1')?.setAttribute('cx', mossballPosition.x - 5);
        document.getElementById('mossball-spot1')?.setAttribute('cy', mossballPosition.y - 5);
        document.getElementById('mossball-spot2')?.setAttribute('cx', mossballPosition.x + 10);
        document.getElementById('mossball-spot2')?.setAttribute('cy', mossballPosition.y + 5);
        document.getElementById('mossball-spot3')?.setAttribute('cx', mossballPosition.x - 10);
        document.getElementById('mossball-spot3')?.setAttribute('cy', mossballPosition.y + 10);
        
        mossballAnimationId = requestAnimationFrame(animateMossball);
    }
    mossballAnimationId = requestAnimationFrame(animateMossball);
    
    // Time limit
    kitGameTimeout = setTimeout(() => {
        if (kitGameActive) endKitGame(mossballHits >= 5, 'mossball');
    }, 15000);
}

// CHASE GAME - Click the running kit to catch them!
let chasePosition = { x: 300, y: 200 };

function startChaseGame() {
    chasePosition = { x: 300, y: 200 };
    
    showMessage(`${kitGamePlaymate}: "You can't catch me!"`);
    
    const gameWorld = document.getElementById('game-world');
    gameWorld.innerHTML = `
        <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; touch-action: manipulation;">
            <rect x="0" y="0" width="600" height="400" fill="#3a4a3a"/>
            <text x="300" y="35" text-anchor="middle" fill="#ffd700" font-size="24" font-weight="bold">CHASE!</text>
            <text x="300" y="60" text-anchor="middle" fill="#fff" font-size="16">Tap ${kitGamePlaymate} to catch them!</text>
            
            <!-- The running kit - with big hit area -->
            <g id="running-kit" style="cursor: pointer;">
                <circle id="chase-hitarea" cx="300" cy="200" r="50" fill="transparent"/>
                <g id="chase-kit-body">
                    <ellipse cx="0" cy="0" rx="25" ry="15" fill="#c4a882"/>
                    <circle cx="-15" cy="-10" r="12" fill="#c4a882"/>
                    <polygon points="-22,-16 -17,-28 -12,-16" fill="#c4a882"/>
                    <polygon points="-10,-16 -5,-28 0,-16" fill="#c4a882"/>
                    <circle cx="-18" cy="-12" r="3" fill="#2ecc71"/>
                    <circle cx="-11" cy="-12" r="3" fill="#2ecc71"/>
                    <ellipse cx="30" cy="0" rx="12" ry="5" fill="#c4a882"/>
                </g>
                <text id="chase-name" x="300" y="260" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${kitGamePlaymate}</text>
            </g>
            
            <text x="300" y="385" text-anchor="middle" fill="#aaa" font-size="16">Quick! They're getting away!</text>
            
            <g id="quit-game" style="cursor: pointer;">
                <rect x="480" y="10" width="100" height="40" rx="8" fill="#6a4a4a"/>
                <text x="530" y="36" text-anchor="middle" fill="white" font-size="16">Quit</text>
            </g>
        </svg>
    `;
    
    const runningKit = document.getElementById('running-kit');
    const handleCatch = (e) => { e.preventDefault(); endKitGame(true, 'chase'); };
    runningKit?.addEventListener('click', handleCatch);
    runningKit?.addEventListener('touchstart', handleCatch, { passive: false });
    
    document.getElementById('quit-game')?.addEventListener('click', () => endKitGame(false, 'chase'));
    document.getElementById('quit-game')?.addEventListener('touchstart', (e) => { e.preventDefault(); endKitGame(false, 'chase'); });
    
    // Move the kit smoothly
    function moveKit() {
        chasePosition.x = 80 + Math.random() * 440;
        chasePosition.y = 100 + Math.random() * 220;
        
        document.getElementById('chase-hitarea')?.setAttribute('cx', chasePosition.x);
        document.getElementById('chase-hitarea')?.setAttribute('cy', chasePosition.y);
        document.getElementById('chase-kit-body')?.setAttribute('transform', `translate(${chasePosition.x}, ${chasePosition.y})`);
        document.getElementById('chase-name')?.setAttribute('x', chasePosition.x);
        document.getElementById('chase-name')?.setAttribute('y', chasePosition.y + 45);
    }
    
    moveKit();
    kitGameInterval = setInterval(() => {
        if (kitGameActive) moveKit();
    }, 800);
    
    kitGameTimeout = setTimeout(() => {
        if (kitGameActive) endKitGame(false, 'chase');
    }, 12000);
}

// HIDE AND SEEK - Pick a hiding spot!
let hideSpotChosen = -1;

function startHideSeekGame() {
    hideSpotChosen = -1;
    
    showMessage(`${kitGamePlaymate}: "I'll count to ten! Go hide!"`);
    
    const gameWorld = document.getElementById('game-world');
    gameWorld.innerHTML = `
        <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; touch-action: manipulation;">
            <rect x="0" y="0" width="600" height="400" fill="#2a3a2a"/>
            <text x="300" y="35" text-anchor="middle" fill="#ffd700" font-size="24" font-weight="bold">HIDE AND SEEK!</text>
            <text x="300" y="65" text-anchor="middle" fill="#fff" font-size="16">"1... 2... 3..." Pick a spot to hide!</text>
            
            <!-- Hiding spots - bigger for mobile -->
            <g id="spot-0" style="cursor: pointer;">
                <ellipse cx="120" cy="180" rx="70" ry="50" fill="#4a6a3a" stroke="#5a8a4a" stroke-width="3"/>
                <ellipse cx="100" cy="170" rx="20" ry="15" fill="#5a7a4a"/>
                <ellipse cx="140" cy="185" rx="25" ry="18" fill="#3a5a2a"/>
                <text x="120" y="250" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Bush</text>
            </g>
            
            <g id="spot-1" style="cursor: pointer;">
                <rect x="220" y="140" width="100" height="90" fill="#5a4a3a" rx="10" stroke="#7a6a5a" stroke-width="3"/>
                <rect x="255" y="170" width="30" height="60" fill="#2a1a0a" rx="5"/>
                <text x="270" y="250" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Nest</text>
            </g>
            
            <g id="spot-2" style="cursor: pointer;">
                <polygon points="450,220 490,120 530,220" fill="#6a5a4a" stroke="#8a7a6a" stroke-width="3"/>
                <ellipse cx="490" cy="180" rx="15" ry="10" fill="#5a4a3a"/>
                <text x="490" y="250" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Rocks</text>
            </g>
            
            <g id="spot-3" style="cursor: pointer;">
                <rect x="80" y="290" width="120" height="70" fill="#2a2a3a" rx="10" stroke="#4a4a5a" stroke-width="3"/>
                <rect x="90" y="300" width="100" height="50" fill="#1a1a2a" rx="5"/>
                <text x="140" y="380" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Shadow</text>
            </g>
            
            <g id="quit-game" style="cursor: pointer;">
                <rect x="480" y="10" width="100" height="40" rx="8" fill="#6a4a4a"/>
                <text x="530" y="36" text-anchor="middle" fill="white" font-size="16">Quit</text>
            </g>
        </svg>
    `;
    
    const spotNames = ['the bush', 'the nest', 'the rock pile', 'the shadow'];
    
    for (let i = 0; i < 4; i++) {
        const spot = document.getElementById(`spot-${i}`);
        const handleSpot = (e) => {
            e.preventDefault();
            hideSpotChosen = i;
            showMessage(`You hide in ${spotNames[i]}! "...8... 9... 10! Ready or not!"`);
            
            // Show waiting screen
            document.getElementById('game-world').innerHTML = `
                <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                    <rect x="0" y="0" width="600" height="400" fill="#1a2a1a"/>
                    <text x="300" y="180" text-anchor="middle" fill="#ffd700" font-size="28" font-weight="bold">Hiding...</text>
                    <text x="300" y="220" text-anchor="middle" fill="#aaa" font-size="18">${kitGamePlaymate} is looking for you!</text>
                </svg>
            `;
            
            setTimeout(() => {
                const seekerChoice = Math.floor(Math.random() * 4);
                const found = seekerChoice === hideSpotChosen;
                showMessage(`${kitGamePlaymate} looks in ${spotNames[seekerChoice]}...`);
                setTimeout(() => endKitGame(!found, 'hideseek'), 2000);
            }, 2500);
        };
        spot?.addEventListener('click', handleSpot);
        spot?.addEventListener('touchstart', handleSpot, { passive: false });
    }
    
    document.getElementById('quit-game')?.addEventListener('click', () => endKitGame(false, 'hideseek'));
    document.getElementById('quit-game')?.addEventListener('touchstart', (e) => { e.preventDefault(); endKitGame(false, 'hideseek'); });
}

// PLAY FIGHT - Click the action buttons when they appear!
let fightRound = 0;
let fightScore = 0;
let fightAction = '';

function startPlayFightGame() {
    fightRound = 0;
    fightScore = 0;
    
    showMessage(`${kitGamePlaymate}: "Let's play fight! Tap the right move!"`);
    
    setTimeout(() => {
        nextFightRound();
    }, 1500);
}

function nextFightRound() {
    fightRound++;
    if (fightRound > 5) {
        endKitGame(fightScore >= 3, 'fight');
        return;
    }
    
    const actions = ['POUNCE!', 'DODGE!', 'SWIPE!', 'ROLL!'];
    fightAction = actions[Math.floor(Math.random() * actions.length)];
    
    const gameWorld = document.getElementById('game-world');
    gameWorld.innerHTML = `
        <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; touch-action: manipulation;">
            <rect x="0" y="0" width="600" height="400" fill="#4a3a3a"/>
            <text x="300" y="35" text-anchor="middle" fill="#ffd700" font-size="22" font-weight="bold">PLAY FIGHT! Round ${fightRound}/5</text>
            <text x="300" y="60" text-anchor="middle" fill="#fff" font-size="18">Score: ${fightScore}/3 needed</text>
            
            <text x="300" y="130" text-anchor="middle" fill="#ff6666" font-size="48" font-weight="bold">${fightAction}</text>
            
            <!-- Action buttons - bigger, 2x2 grid for mobile -->
            <g id="action-pounce" style="cursor: pointer;">
                <rect x="40" y="170" width="260" height="80" rx="15" fill="${fightAction === 'POUNCE!' ? '#4a8a4a' : '#4a4a6a'}" stroke="${fightAction === 'POUNCE!' ? '#6aba6a' : '#6a6a8a'}" stroke-width="3"/>
                <text x="170" y="220" text-anchor="middle" fill="white" font-size="28" font-weight="bold">POUNCE!</text>
            </g>
            
            <g id="action-dodge" style="cursor: pointer;">
                <rect x="310" y="170" width="260" height="80" rx="15" fill="${fightAction === 'DODGE!' ? '#4a8a4a' : '#4a4a6a'}" stroke="${fightAction === 'DODGE!' ? '#6aba6a' : '#6a6a8a'}" stroke-width="3"/>
                <text x="440" y="220" text-anchor="middle" fill="white" font-size="28" font-weight="bold">DODGE!</text>
            </g>
            
            <g id="action-swipe" style="cursor: pointer;">
                <rect x="40" y="260" width="260" height="80" rx="15" fill="${fightAction === 'SWIPE!' ? '#4a8a4a' : '#4a4a6a'}" stroke="${fightAction === 'SWIPE!' ? '#6aba6a' : '#6a6a8a'}" stroke-width="3"/>
                <text x="170" y="310" text-anchor="middle" fill="white" font-size="28" font-weight="bold">SWIPE!</text>
            </g>
            
            <g id="action-roll" style="cursor: pointer;">
                <rect x="310" y="260" width="260" height="80" rx="15" fill="${fightAction === 'ROLL!' ? '#4a8a4a' : '#4a4a6a'}" stroke="${fightAction === 'ROLL!' ? '#6aba6a' : '#6a6a8a'}" stroke-width="3"/>
                <text x="440" y="310" text-anchor="middle" fill="white" font-size="28" font-weight="bold">ROLL!</text>
            </g>
            
            <text x="300" y="375" text-anchor="middle" fill="#aaa" font-size="16">Tap the matching move quickly!</text>
            
            <g id="quit-game" style="cursor: pointer;">
                <rect x="480" y="10" width="100" height="40" rx="8" fill="#6a4a4a"/>
                <text x="530" y="36" text-anchor="middle" fill="white" font-size="16">Quit</text>
            </g>
        </svg>
    `;
    
    const actionMap = { 'action-pounce': 'POUNCE!', 'action-dodge': 'DODGE!', 'action-swipe': 'SWIPE!', 'action-roll': 'ROLL!' };
    
    for (const [id, action] of Object.entries(actionMap)) {
        const el = document.getElementById(id);
        const handleAction = (e) => {
            e.preventDefault();
            if (kitGameTimeout) clearTimeout(kitGameTimeout);
            if (action === fightAction) {
                fightScore++;
                showMessage('Nice move!');
            } else {
                showMessage('Wrong move!');
            }
            setTimeout(() => nextFightRound(), 600);
        };
        el?.addEventListener('click', handleAction);
        el?.addEventListener('touchstart', handleAction, { passive: false });
    }
    
    document.getElementById('quit-game')?.addEventListener('click', () => endKitGame(false, 'fight'));
    document.getElementById('quit-game')?.addEventListener('touchstart', (e) => { e.preventDefault(); endKitGame(false, 'fight'); });
    
    // Time limit for each round
    kitGameTimeout = setTimeout(() => {
        showMessage('Too slow!');
        setTimeout(() => nextFightRound(), 600);
    }, 2500);
}

// POUNCE PRACTICE - Click the falling leaf!
let leafPosition = { x: 300, y: 50 };
let pouncesCaught = 0;
let pounceAnimationId = null;

function startPounceGame() {
    pouncesCaught = 0;
    leafPosition = { x: 100 + Math.random() * 400, y: 60 };
    
    showMessage(`${kitGamePlaymate}: "Catch 3 leaves to win!"`);
    
    const gameWorld = document.getElementById('game-world');
    gameWorld.innerHTML = `
        <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; touch-action: manipulation;">
            <rect x="0" y="0" width="600" height="400" fill="#2a4a3a"/>
            <text id="pounce-title" x="300" y="35" text-anchor="middle" fill="#ffd700" font-size="24" font-weight="bold">POUNCE!</text>
            <text id="pounce-subtitle" x="300" y="60" text-anchor="middle" fill="#fff" font-size="16">Catch 3 more leaves!</text>
            
            <!-- The falling leaf - bigger hit area -->
            <g id="falling-leaf" style="cursor: pointer;">
                <circle id="leaf-hitarea" cx="300" cy="200" r="50" fill="transparent"/>
                <ellipse id="leaf-body" cx="300" cy="200" rx="30" ry="18" fill="#CD853F"/>
                <ellipse id="leaf-vein" cx="300" cy="200" rx="20" ry="10" fill="#B8732E"/>
                <line id="leaf-stem" x1="300" y1="200" x2="300" y2="218" stroke="#8B4513" stroke-width="3"/>
            </g>
            
            <text id="pounce-score" x="50" y="60" fill="white" font-size="20" font-weight="bold">Caught: 0/3</text>
            
            <text x="300" y="385" text-anchor="middle" fill="#aaa" font-size="16">Tap the falling leaf!</text>
            
            <g id="quit-game" style="cursor: pointer;">
                <rect x="480" y="10" width="100" height="40" rx="8" fill="#6a4a4a"/>
                <text x="530" y="36" text-anchor="middle" fill="white" font-size="16">Quit</text>
            </g>
        </svg>
    `;
    
    const leaf = document.getElementById('falling-leaf');
    const handlePounce = (e) => {
        e.preventDefault();
        pouncesCaught++;
        document.getElementById('pounce-score').textContent = `Caught: ${pouncesCaught}/3`;
        document.getElementById('pounce-subtitle').textContent = `Catch ${3 - pouncesCaught} more leaves!`;
        leafPosition = { x: 100 + Math.random() * 400, y: 60 };
        if (pouncesCaught >= 3) {
            endKitGame(true, 'pounce');
        }
    };
    leaf?.addEventListener('click', handlePounce);
    leaf?.addEventListener('touchstart', handlePounce, { passive: false });
    
    document.getElementById('quit-game')?.addEventListener('click', () => endKitGame(false, 'pounce'));
    document.getElementById('quit-game')?.addEventListener('touchstart', (e) => { e.preventDefault(); endKitGame(false, 'pounce'); });
    
    // Smooth animation
    function animateLeaf() {
        if (!kitGameActive) return;
        
        leafPosition.y += 3;
        leafPosition.x += Math.sin(leafPosition.y / 25) * 2;
        
        if (leafPosition.y > 380) {
            leafPosition = { x: 100 + Math.random() * 400, y: 60 };
        }
        
        const rotation = leafPosition.y * 3;
        document.getElementById('leaf-hitarea')?.setAttribute('cx', leafPosition.x);
        document.getElementById('leaf-hitarea')?.setAttribute('cy', leafPosition.y);
        document.getElementById('leaf-body')?.setAttribute('cx', leafPosition.x);
        document.getElementById('leaf-body')?.setAttribute('cy', leafPosition.y);
        document.getElementById('leaf-body')?.setAttribute('transform', `rotate(${rotation}, ${leafPosition.x}, ${leafPosition.y})`);
        document.getElementById('leaf-vein')?.setAttribute('cx', leafPosition.x);
        document.getElementById('leaf-vein')?.setAttribute('cy', leafPosition.y);
        document.getElementById('leaf-vein')?.setAttribute('transform', `rotate(${rotation}, ${leafPosition.x}, ${leafPosition.y})`);
        document.getElementById('leaf-stem')?.setAttribute('x1', leafPosition.x);
        document.getElementById('leaf-stem')?.setAttribute('y1', leafPosition.y);
        document.getElementById('leaf-stem')?.setAttribute('x2', leafPosition.x);
        document.getElementById('leaf-stem')?.setAttribute('y2', leafPosition.y + 18);
        
        pounceAnimationId = requestAnimationFrame(animateLeaf);
    }
    pounceAnimationId = requestAnimationFrame(animateLeaf);
    
    kitGameTimeout = setTimeout(() => {
        if (kitGameActive) endKitGame(pouncesCaught >= 3, 'pounce');
    }, 20000);
}

// End any kit game
function endKitGame(won, gameType) {
    kitGameActive = false;
    if (kitGameInterval) clearInterval(kitGameInterval);
    if (kitGameTimeout) clearTimeout(kitGameTimeout);
    if (mossballAnimationId) cancelAnimationFrame(mossballAnimationId);
    if (pounceAnimationId) cancelAnimationFrame(pounceAnimationId);
    
    const cat = GameState.catData;
    
    const winMessages = {
        'mossball': `You won moss-ball against ${kitGamePlaymate}!`,
        'chase': `You caught ${kitGamePlaymate}! Tag, you're it!`,
        'hideseek': `${kitGamePlaymate} couldn't find you! Great hiding spot!`,
        'fight': `You beat ${kitGamePlaymate} in the play fight!`,
        'pounce': 'Amazing pouncing! You\'ll be a great hunter!'
    };
    
    const loseMessages = {
        'mossball': `${kitGamePlaymate} won this round. Good game!`,
        'chase': `${kitGamePlaymate} got away! They're too fast!`,
        'hideseek': `${kitGamePlaymate} found you! "Got you!"`,
        'fight': `${kitGamePlaymate} pinned you! "I win!"`,
        'pounce': 'The leaves were too tricky. Keep practicing!'
    };
    
    if (won) {
        showMessage(winMessages[gameType]);
        cat.experience += 8;
    } else {
        showMessage(loseMessages[gameType]);
        cat.experience += 3;
    }
    
    updateGameUI();
    saveGameData();
    
    // Return to camp
    setTimeout(() => {
        GameState.currentLocation = 'camp';
        GameState.playerX = 200;
        GameState.playerY = 280;
        renderGameWorld();
    }, 2000);
}

// Kit asks for food
function kitAskForFood() {
    const cat = GameState.catData;
    const helpers = ['Sandstorm', 'Ferncloud', 'Graystripe', 'Dustpelt'];
    const helper = helpers[Math.floor(Math.random() * helpers.length)];
    
    showSpeechBubble(helper, 'Are you hungry, little one? I\'ll get you something!');
    
    setTimeout(() => {
        showMessage(`${helper} goes to the fresh-kill pile...`);
        setTimeout(() => {
            showMessage(`${helper} comes back with a tasty mouse!`);
            showSpeechBubble(helper, 'Here you go! Eat up!');
            setTimeout(() => {
                cat.hunger = Math.min(100, cat.hunger + 40);
                showMessage('Yummy! That was delicious!');
                updateGameUI();
                saveGameData();
            }, 2000);
        }, 3000);
    }, 2000);
}

// Kit asks a warrior to take them outside
function askWarriorToTakeOut() {
    const cat = GameState.catData;
    const warriors = ['Sandstorm', 'Graystripe', 'Dustpelt', 'Cloudtail', 'Brackenfur', 'Thornclaw'];
    const warrior = warriors[Math.floor(Math.random() * warriors.length)];
    
    // 70% chance they say yes
    const saysYes = Math.random() < 0.7;
    
    if (saysYes) {
        const yesResponses = [
            `"Alright little one, you can come with me. But stay close!"`,
            `"Want to see the forest? Okay, but hold on tight!"`,
            `"I suppose a little trip won't hurt. Come on then!"`,
            `"You're curious, aren't you? Fine, I'll take you out."`
        ];
        
        showSpeechBubble(warrior, yesResponses[Math.floor(Math.random() * yesResponses.length)].replace(/"/g, ''));
        showMessage(`${warrior}: ${yesResponses[Math.floor(Math.random() * yesResponses.length)]}`);
        
        setTimeout(() => {
            showMessage(`${warrior} picks you up gently by your scruff...`);
            setTimeout(() => {
                showMessage(`${warrior} carries you through the camp entrance!`);
                setTimeout(() => {
                    // Take the kit to the forest!
                    GameState.currentLocation = 'forest';
                    GameState.playerX = 100;
                    GameState.playerY = 300;
                    GameState.withWarrior = warrior;
                    renderGameWorld();
                    
                    showMessage(`${warrior} sets you down in the forest. "Stay where I can see you!"`);
                    showSpeechBubble(warrior, 'Stay close to me!');
                    
                    // Warrior watches over you - no fox/dog danger!
                    setTimeout(() => {
                        showMessage(`${warrior} keeps a watchful eye on you as you explore.`);
                    }, 3000);
                    
                    // After some time, warrior takes you back
                    setTimeout(() => {
                        if (GameState.currentLocation === 'forest' && GameState.withWarrior === warrior) {
                            showSpeechBubble(warrior, 'Time to go back now.');
                            showMessage(`${warrior}: "That's enough adventure for today, little one."`);
                            
                            setTimeout(() => {
                                showMessage(`${warrior} picks you up and carries you back to camp.`);
                                setTimeout(() => {
                                    GameState.currentLocation = 'camp';
                                    GameState.playerX = 90;
                                    GameState.playerY = 300;
                                    GameState.withWarrior = null;
                                    renderGameWorld();
                                    showMessage('You\'re back in the nursery, safe and sound!');
                                    cat.experience += 10;
                                    updateGameUI();
                                    saveGameData();
                                }, 2000);
                            }, 2000);
                        }
                    }, 30000); // 30 seconds of forest time
                    
                }, 2000);
            }, 2000);
        }, 2000);
    } else {
        const noResponses = [
            `"Not now, little one. It's too dangerous out there."`,
            `"Maybe when you're older. The forest is no place for kits."`,
            `"I'm busy right now. Ask someone else."`,
            `"Your mother would never forgive me! Stay in camp."`
        ];
        
        showSpeechBubble(warrior, noResponses[Math.floor(Math.random() * noResponses.length)].replace(/"/g, ''));
        showMessage(`${warrior}: ${noResponses[Math.floor(Math.random() * noResponses.length)]}`);
    }
}

function showSpeechBubble(speaker, text) {
    // Remove old bubble for this speaker
    activeSpeechBubbles = activeSpeechBubbles.filter(b => b.speaker !== speaker);
    
    // Add new bubble
    const bubble = {
        speaker: speaker,
        text: text,
        startTime: Date.now()
    };
    activeSpeechBubbles.push(bubble);
    
    // Re-render to show bubbles
    renderGameWorld();
    
    // Remove bubble after 4 seconds
    setTimeout(() => {
        activeSpeechBubbles = activeSpeechBubbles.filter(b => b !== bubble);
        renderGameWorld();
    }, 4000);
}

function triggerNPCResponse(playerText) {
    const npcs = ['Brambleclaw', 'Sandstorm', 'Leafpool', 'Cloudtail', 'Squirrelpaw', 'Dustpelt'];
    const npc = npcs[Math.floor(Math.random() * npcs.length)];
    
    // Smart responses based on what player said
    let response = '';
    const lowerText = playerText.toLowerCase();
    
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
        response = ['Hello!', 'Hi there!', 'Greetings!', 'Hey!'][Math.floor(Math.random() * 4)];
    } else if (lowerText.includes('play')) {
        response = ['Sure!', 'Let\'s go!', 'Race you!', 'Sounds fun!'][Math.floor(Math.random() * 4)];
    } else if (lowerText.includes('hungry') || lowerText.includes('food')) {
        response = ['Check the fresh-kill pile!', 'I caught a mouse earlier!', 'Want to hunt together?'][Math.floor(Math.random() * 3)];
    } else if (lowerText.includes('watch out') || lowerText.includes('danger')) {
        response = ['What is it?!', 'Where?!', 'I\'m ready to fight!'][Math.floor(Math.random() * 3)];
    } else if (lowerText.includes('follow')) {
        response = ['Lead the way!', 'Right behind you!', 'Where are we going?'][Math.floor(Math.random() * 3)];
    } else if (lowerText.includes('good') || lowerText.includes('nice')) {
        response = ['Thanks!', '*purrs*', 'You too!'][Math.floor(Math.random() * 3)];
    } else {
        response = ['Interesting!', '*nods*', 'I see...', 'Hmm...', 'Oh!'][Math.floor(Math.random() * 5)];
    }
    
    showSpeechBubble(npc, response);
}

function renderSpeechBubbles() {
    let bubblesHTML = '';
    
    for (const bubble of activeSpeechBubbles) {
        let x, y;
        
        if (bubble.speaker === 'player') {
            x = GameState.playerX;
            y = GameState.playerY - 45;
        } else {
            // Find NPC position
            const npcPos = getNPCPosition(bubble.speaker);
            x = npcPos.x;
            y = npcPos.y - 30;
        }
        
        // Truncate long text
        const displayText = bubble.text.length > 25 ? bubble.text.substring(0, 22) + '...' : bubble.text;
        
        bubblesHTML += `
            <g class="speech-bubble" transform="translate(${x}, ${y})" style="pointer-events: none;">
                <!-- Bubble background -->
                <rect x="-50" y="-25" width="100" height="30" rx="10" fill="white" stroke="#333" stroke-width="1"/>
                <!-- Pointer -->
                <polygon points="-5,5 5,5 0,12" fill="white" stroke="#333" stroke-width="1"/>
                <line x1="-4" y1="5" x2="4" y2="5" stroke="white" stroke-width="2"/>
                <!-- Text -->
                <text x="0" y="-6" text-anchor="middle" fill="#333" font-size="9" font-weight="bold">${displayText}</text>
            </g>
        `;
    }
    
    return bubblesHTML;
}

function getNPCPosition(npcName) {
    const npcs = window.npcPositions;
    const lowerName = npcName.toLowerCase();
    
    // Check moving NPCs (adults and kits)
    const movingNpcs = ['dustpelt', 'cloudtail', 'brightheart', 'ferncloud', 
                        'molekit', 'cherrykit', 'lilykit', 'seedkit', 'honeykit'];
    
    for (const npc of movingNpcs) {
        if (lowerName === npc && npcs[npc]) {
            return { x: npcs[npc].x, y: npcs[npc].y };
        }
    }
    
    // Static NPC positions
    const staticPositions = {
        'Brambleclaw': { x: 85, y: 175 },
        'Squirrelpaw': { x: 355, y: 175 },
        'Leafpool': { x: 258, y: 105 },
        'Sandstorm': { x: 290, y: 245 },
        'Graystripe': { x: 160, y: 245 },
        'Firestar': { x: 228, y: 168 },
        'Spiderleg': { x: 150, y: 275 },
        'Whitewing': { x: 330, y: 95 }
    };
    
    return staticPositions[npcName] || { x: 200, y: 200 };
}

// Random NPC chatter
function triggerRandomNPCChat() {
    if (GameState.currentScreen !== 'game') return;
    if (GameState.currentLocation !== 'camp') return;
    if (GameState.isNight) return;
    if (Math.random() > 0.015) return; // 1.5% chance per second
    
    // 40% chance it's a kit talking!
    if (Math.random() < 0.4) {
        triggerKitChatter();
        return;
    }
    
    const npcs = ['Brambleclaw', 'Sandstorm', 'Leafpool', 'Cloudtail', 'Squirrelpaw', 'Dustpelt'];
    const npc = npcs[Math.floor(Math.random() * npcs.length)];
    
    const randomChat = [
        'Nice weather today!',
        'I smell prey...',
        'StarClan guide us.',
        '*yawns*',
        'The clan is strong!',
        'Want to train?',
        '*stretches*',
        'I had a strange dream...',
        'The forest is quiet.',
        'Time for patrol soon.',
        '*grooms fur*',
        'Any news?'
    ];
    
    const text = randomChat[Math.floor(Math.random() * randomChat.length)];
    showSpeechBubble(npc, text);
}

// Kit-specific chatter
function triggerKitChatter() {
    const kits = ['Molekit', 'Cherrykit', 'Lilykit', 'Seedkit', 'Honeykit'];
    const kit = kits[Math.floor(Math.random() * kits.length)];
    
    const kitChat = [
        'Let\'s play!',
        'Chase me!',
        'I wanna be a warrior!',
        '*pounces on leaf*',
        'Tag! You\'re it!',
        '*tumbles*',
        'I\'m gonna catch you!',
        'When can we go outside?',
        '*play fights*',
        'I\'m hungry!',
        'Catch me if you can!',
        '*bounces around*',
        'Wanna play moss-ball?',
        'I had a scary dream!',
        '*squeaks*',
        'Watch me hunt!',
        'I\'m a big warrior! Rawr!'
    ];
    
    const text = kitChat[Math.floor(Math.random() * kitChat.length)];
    showSpeechBubble(kit, text);
}

// Enemy Clan Raid System
function checkForRaid() {
    // Small chance of raid each game tick (only when in camp)
    if (GameState.currentLocation !== 'camp') return;
    if (GameState.isNight) return;
    if (Math.random() > 0.002) return; // 0.2% chance per second
    
    startRaid();
}

function startRaid() {
    const cat = GameState.catData;
    const enemyClans = ['ShadowClan', 'RiverClan', 'WindClan'].filter(c => 
        c !== CLANS[cat.clan]?.name
    );
    const enemyClan = enemyClans[Math.floor(Math.random() * enemyClans.length)];
    const enemyClanKey = enemyClan.toLowerCase().replace('clan', '');
    
    showMessage(`RAID! ${enemyClan} cats are attacking the camp!`);
    
    setTimeout(() => {
        // If player is a kit, they might try to steal you!
        if (cat.rank === 'Kit') {
            showMessage(`A ${enemyClan} warrior is trying to steal you!`);
            
            setTimeout(() => {
                // Clan fights back!
                const defenders = ['Brambleclaw', 'Sandstorm', 'Graystripe', 'Dustpelt', 'Firestar'];
                const defender = defenders[Math.floor(Math.random() * defenders.length)];
                
                const roll = Math.random();
                
                if (roll > 0.4) {
                    // Clan wins!
                    showMessage(`${defender} leaps to your defense! "Leave our kit alone!"`);
                    setTimeout(() => {
                        showMessage(`The clan drives ${enemyClan} away! You are safe!`);
                        cat.experience += 5;
                    }, 3000);
                } else if (roll > 0.15) {
                    // Close call!
                    showMessage(`${defender} fights fiercely! The enemy almost got you!`);
                    setTimeout(() => {
                        showMessage(`After a tough battle, ${enemyClan} retreats! That was close!`);
                        cat.health = Math.max(10, cat.health - 10);
                        cat.experience += 10;
                        updateGameUI();
                    }, 3000);
                } else {
                    // YOU GET STOLEN!
                    showMessage(`${defender} tries to help but... the ${enemyClan} warrior grabs you!`);
                    setTimeout(() => {
                        showMessage(`You are carried away to ${enemyClan}!`);
                        setTimeout(() => {
                            getStolenByClan(enemyClanKey, enemyClan);
                        }, 3000);
                    }, 3000);
                }
            }, 3000);
        } else {
            // Player can fight!
            showMessage('Your clanmates rush to defend the camp!');
            
            setTimeout(() => {
                // Fight!
                if (cat.rank === 'Apprentice' || cat.rank === 'Warrior' || cat.rank === 'Deputy' || cat.rank === 'Leader') {
                    const success = Math.random() > 0.4;
                    if (success) {
                        showMessage('You fight bravely! The enemy flees!');
                        cat.experience += 20;
                    } else {
                        showMessage('You fight hard but get scratched!');
                        cat.health = Math.max(10, cat.health - 15);
                        cat.experience += 15;
                    }
                } else {
                    showMessage('The warriors protect the camp. The enemy retreats!');
                    cat.experience += 5;
                }
                updateGameUI();
                saveGameData();
            }, 3000);
        }
    }, 2000);
}

// When you get stolen by another clan
function getStolenByClan(clanKey, clanName) {
    const cat = GameState.catData;
    const oldClan = CLANS[cat.clan]?.name || 'your clan';
    
    // Change your clan!
    cat.clan = clanKey;
    GameState.selectedClan = clanKey;
    
    showMessage(`You wake up in ${clanName}'s camp... This is your new home now.`);
    
    setTimeout(() => {
        showMessage(`The ${clanName} cats look at you. "You belong to us now, little one."`);
        setTimeout(() => {
            showMessage(`You miss ${oldClan}, but you must survive here...`);
            setTimeout(() => {
                showMessage(`Maybe one day you can escape back home!`);
                
                // Reset position to new camp
                GameState.playerX = 200;
                GameState.playerY = 200;
                GameState.currentLocation = 'camp';
                
                renderGameWorld();
                updateGameUI();
                saveGameData();
            }, 3000);
        }, 3000);
    }, 3000);
}

// Show a message
function showMessage(text) {
    const msgElement = document.getElementById('game-message');
    msgElement.textContent = text;
    msgElement.classList.add('show');
    
    setTimeout(() => {
        msgElement.classList.remove('show');
    }, 2500);
}

// Go to StarClan
function goToStarClan() {
    clearInterval(gameLoopInterval);
    GameState.catData.inStarClan = true;
    saveGameData();
    showScreen('starclan');
}

// Stay in StarClan - show a peaceful starry scene
function stayInStarClan() {
    const starclanScreen = document.getElementById('starclan-screen');
    
    starclanScreen.innerHTML = `
        <div class="starclan-bg"></div>
        <div class="starclan-view">
            <h2>StarClan</h2>
            <p class="starclan-message">You rest peacefully among your warrior ancestors...</p>
            <div class="starclan-stars-view">
                <svg viewBox="0 0 400 300" style="width: 100%; max-width: 400px;">
                    <!-- Starry sky -->
                    <rect x="0" y="0" width="400" height="300" fill="#1a0a2e"/>
                    <!-- Big stars -->
                    <circle cx="50" cy="50" r="3" fill="#ffd700" opacity="0.9"/>
                    <circle cx="150" cy="80" r="4" fill="#fff" opacity="0.8"/>
                    <circle cx="300" cy="40" r="3" fill="#e1bee7" opacity="0.9"/>
                    <circle cx="350" cy="120" r="2" fill="#fff" opacity="0.7"/>
                    <circle cx="80" cy="150" r="3" fill="#ffd700" opacity="0.8"/>
                    <circle cx="200" cy="100" r="5" fill="#fff" opacity="1"/>
                    <circle cx="250" cy="180" r="3" fill="#e1bee7" opacity="0.9"/>
                    <circle cx="100" cy="220" r="2" fill="#fff" opacity="0.7"/>
                    <circle cx="320" cy="250" r="4" fill="#ffd700" opacity="0.8"/>
                    <circle cx="180" cy="260" r="3" fill="#fff" opacity="0.9"/>
                    <!-- Small twinkling stars -->
                    <circle cx="30" cy="100" r="1" fill="#fff" opacity="0.5"/>
                    <circle cx="380" cy="80" r="1" fill="#fff" opacity="0.6"/>
                    <circle cx="220" cy="30" r="1" fill="#fff" opacity="0.5"/>
                    <circle cx="270" cy="280" r="1" fill="#fff" opacity="0.4"/>
                    <!-- Silverpelt (milky way) -->
                    <ellipse cx="200" cy="150" rx="180" ry="30" fill="url(#silverpelt)" opacity="0.3"/>
                    <defs>
                        <linearGradient id="silverpelt" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="transparent"/>
                            <stop offset="50%" stop-color="#e1bee7"/>
                            <stop offset="100%" stop-color="transparent"/>
                        </linearGradient>
                    </defs>
                    <!-- Your ancestor -->
                    <text x="200" y="290" text-anchor="middle" fill="#e1bee7" font-size="12">The stars of your ancestors watch over you...</text>
                </svg>
            </div>
            <button class="starclan-btn" id="back-to-starclan-menu">Go Back</button>
        </div>
    `;
    
    document.getElementById('back-to-starclan-menu')?.addEventListener('click', () => {
        showScreen('starclan');
        // Restore the original StarClan screen
        starclanScreen.innerHTML = `
            <div class="starclan-bg"></div>
            <h2>Welcome to StarClan</h2>
            <p class="starclan-message">You have joined your warrior ancestors among the stars.</p>
            <div class="starclan-options">
                <button class="starclan-btn" id="stay-starclan">Stay in StarClan</button>
                <button class="starclan-btn" id="visit-dreams">Visit a Cat's Dream</button>
                <button class="starclan-btn portal-btn" id="restart-portal">Portal to New Life</button>
            </div>
        `;
        // Re-add event listeners
        document.getElementById('stay-starclan')?.addEventListener('click', stayInStarClan);
        document.getElementById('visit-dreams')?.addEventListener('click', visitDreams);
        document.getElementById('restart-portal')?.addEventListener('click', restartGame);
    });
}

// Visit dreams - talk to a random living cat!
function visitDreams() {
    const livingCats = [
        { name: 'Firestar', role: 'leader' },
        { name: 'Sandstorm', role: 'warrior' },
        { name: 'Graystripe', role: 'warrior' },
        { name: 'Leafpool', role: 'medicine cat' },
        { name: 'Brambleclaw', role: 'deputy' },
        { name: 'Squirrelflight', role: 'warrior' },
        { name: 'Cinderpelt', role: 'medicine cat' },
        { name: 'Dustpelt', role: 'warrior' }
    ];
    
    const cat = livingCats[Math.floor(Math.random() * livingCats.length)];
    
    const starclanScreen = document.getElementById('starclan-screen');
    starclanScreen.innerHTML = `
        <div class="starclan-bg"></div>
        <div class="starclan-view">
            <h2>Visiting ${cat.name}'s Dream</h2>
            <p class="starclan-message">${cat.name} is sleeping... You appear in their dream as a starry spirit.</p>
            <div class="dream-chat">
                <p class="dream-cat-says">"${cat.name} looks up at you with wonder..."</p>
                <p class="dream-cat-says" style="color: #aaa; font-style: italic;">"A StarClan cat! Do you have a message for me?"</p>
            </div>
            <div class="dream-options">
                <button class="starclan-btn dream-choice" data-msg="warning">Give a Warning</button>
                <button class="starclan-btn dream-choice" data-msg="encouragement">Give Encouragement</button>
                <button class="starclan-btn dream-choice" data-msg="prophecy">Share a Prophecy</button>
                <button class="starclan-btn dream-choice" data-msg="blessing">Give a Blessing</button>
            </div>
            <button class="starclan-btn" id="leave-dream" style="margin-top: 20px;">Leave the Dream</button>
        </div>
    `;
    
    const responses = {
        warning: [
            `"Beware, ${cat.name}. Danger lurks in the shadows..."`,
            `"Dark times are coming. Stay alert, young ${cat.role}."`,
            `"Trust your instincts. Not all cats are as they seem..."`
        ],
        encouragement: [
            `"You are brave and strong, ${cat.name}. Your clan is proud of you!"`,
            `"Have faith in yourself. You will do great things!"`,
            `"StarClan watches over you always. Never give up!"`
        ],
        prophecy: [
            `"When fire meets water, a new path will open..."`,
            `"The moon will guide you when all seems lost..."`,
            `"Three will become one, and the clans will survive..."`
        ],
        blessing: [
            `"May StarClan light your path, ${cat.name}."`,
            `"I give you the blessing of courage and wisdom."`,
            `"Go in peace, knowing your ancestors watch over you."`
        ]
    };
    
    const catResponses = {
        warning: `${cat.name} nods solemnly. "I will be careful. Thank you for the warning..."`,
        encouragement: `${cat.name}'s eyes shine with hope. "Thank you! I won't let you down!"`,
        prophecy: `${cat.name} looks puzzled but determined. "I... I will remember your words..."`,
        blessing: `${cat.name} bows their head gratefully. "Thank you, ancestor. I am honored."`
    };
    
    document.querySelectorAll('.dream-choice').forEach(btn => {
        btn.addEventListener('click', () => {
            const msgType = btn.dataset.msg;
            const yourMessage = responses[msgType][Math.floor(Math.random() * responses[msgType].length)];
            const catResponse = catResponses[msgType];
            
            document.querySelector('.dream-chat').innerHTML = `
                <p class="dream-you-say" style="color: #ffd700; margin-bottom: 15px;">You say: ${yourMessage}</p>
                <p class="dream-cat-says" style="color: #e1bee7;">${catResponse}</p>
            `;
            document.querySelector('.dream-options').innerHTML = `
                <p style="color: #aaa; font-style: italic;">The dream begins to fade...</p>
            `;
        });
    });
    
    document.getElementById('leave-dream')?.addEventListener('click', () => {
        // Restore the original StarClan screen
        starclanScreen.innerHTML = `
            <div class="starclan-bg"></div>
            <h2>Welcome to StarClan</h2>
            <p class="starclan-message">You have joined your warrior ancestors among the stars.</p>
            <div class="starclan-options">
                <button class="starclan-btn" id="stay-starclan">Stay in StarClan</button>
                <button class="starclan-btn" id="visit-dreams">Visit a Cat's Dream</button>
                <button class="starclan-btn portal-btn" id="restart-portal">Portal to New Life</button>
            </div>
        `;
        // Re-add event listeners
        document.getElementById('stay-starclan')?.addEventListener('click', stayInStarClan);
        document.getElementById('visit-dreams')?.addEventListener('click', visitDreams);
        document.getElementById('restart-portal')?.addEventListener('click', restartGame);
    });
}

// Restart game
function restartGame() {
    // Clear current slot
    localStorage.removeItem(`warriorcats_save_${GameState.selectedSlot}`);
    GameState.catData = null;
    GameState.selectedSlot = null;
    showScreen('clan');
}
