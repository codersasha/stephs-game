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
        eyeColorName: 'green'
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
    isGatheringNight: false,
    // Emotion/pose
    currentEmotion: 'normal',
    isSitting: false,
    isSleeping: false
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
    { name: 'Spiderpaw', rank: 'Apprentice', furColor: '#2F2F2F', pattern: 'solid' }
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
    shadow: { name: 'ShadowClan', color: '#673ab7' }
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
    document.getElementById('emote-mad').addEventListener('click', () => setEmotion('mad'));
    document.getElementById('emote-purr').addEventListener('click', () => doPurr());
    document.getElementById('emote-hiss').addEventListener('click', () => doHiss());
    document.getElementById('emote-sit').addEventListener('click', () => toggleSit());
    document.getElementById('emote-sleep').addEventListener('click', () => toggleRest());
    document.getElementById('emote-meow').addEventListener('click', () => doMeow());
    document.getElementById('emote-talk').addEventListener('click', () => openSpeechPopup());
    
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
    
    // Create new cat data with customization
    GameState.catData = {
        firstName: formattedName,
        name: formattedName + 'kit',
        clan: GameState.selectedClan,
        rank: 'Kit',
        age: 0,
        health: 100,
        hunger: 100,
        thirst: 100,
        experience: 0,
        isDeputy: false,
        isLeader: false,
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
    
    // Initialize player position in camp
    GameState.playerX = 225;
    GameState.playerY = 250;
    GameState.currentLocation = 'camp';
    GameState.herbs = GameState.catData.herbs || [];
    
    // Set clan-specific background
    const gameWorld = document.getElementById('game-world');
    gameWorld.className = 'game-world ' + GameState.selectedClan;
    
    // Render the game world
    renderGameWorld();
    
    // Update herb count display
    document.getElementById('herb-count').textContent = GameState.herbs.length;
    
    // Start game loop
    startGameLoop();
}

// Update the game UI
function updateGameUI() {
    const cat = GameState.catData;
    
    document.getElementById('cat-name-display').textContent = cat.name;
    document.getElementById('cat-rank').textContent = cat.rank;
    document.getElementById('cat-age').textContent = `${cat.age} moons`;
    
    document.getElementById('health-fill').style.width = `${cat.health}%`;
    document.getElementById('hunger-fill').style.width = `${cat.hunger}%`;
    document.getElementById('thirst-fill').style.width = `${cat.thirst}%`;
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
    const darkerFur = adjustColor(furColor, -25);
    const lighterFur = adjustColor(furColor, 15);
    
    return `
        <g class="npc-cat" transform="translate(${x}, ${y}) scale(${scale})">
            <!-- Shadow -->
            <ellipse cx="0" cy="12" rx="14" ry="4" fill="rgba(0,0,0,0.25)"/>
            
            <!-- Tail -->
            <path d="M-12 2 Q-20 -2 -18 -12" stroke="${furColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
            
            <!-- Body -->
            <ellipse cx="0" cy="2" rx="14" ry="9" fill="${darkerFur}"/>
            <ellipse cx="0" cy="1" rx="12" ry="7" fill="${furColor}"/>
            <ellipse cx="0" cy="-1" rx="8" ry="4" fill="${lighterFur}" opacity="0.25"/>
            
            <!-- Legs -->
            <rect x="-10" y="6" width="4" height="8" rx="2" fill="${darkerFur}"/>
            <rect x="6" y="6" width="4" height="8" rx="2" fill="${furColor}"/>
            
            <!-- Head -->
            <circle cx="12" cy="-4" r="9" fill="${furColor}"/>
            <circle cx="12" cy="-5" r="7" fill="${lighterFur}" opacity="0.2"/>
            
            <!-- Ears -->
            <polygon points="5,-9 6,-17 11,-11" fill="${furColor}"/>
            <polygon points="6,-10 7,-15 10,-11" fill="#e8b4b8" opacity="0.7"/>
            <polygon points="17,-11 22,-17 19,-9" fill="${furColor}"/>
            <polygon points="18,-10 20,-15 18,-10" fill="#e8b4b8" opacity="0.7"/>
            
            <!-- Eyes -->
            <ellipse cx="9" cy="-5" rx="2.5" ry="3" fill="white"/>
            <ellipse cx="15" cy="-5" rx="2.5" ry="3" fill="white"/>
            <ellipse cx="9" cy="-5" rx="1.5" ry="2.5" fill="${eyeColor}"/>
            <ellipse cx="15" cy="-5" rx="1.5" ry="2.5" fill="${eyeColor}"/>
            <ellipse cx="9" cy="-5" rx="0.8" ry="2" fill="#1a1a2e"/>
            <ellipse cx="15" cy="-5" rx="0.8" ry="2" fill="#1a1a2e"/>
            <circle cx="8" cy="-6.5" r="0.6" fill="white" opacity="0.8"/>
            <circle cx="14" cy="-6.5" r="0.6" fill="white" opacity="0.8"/>
            
            <!-- Nose -->
            <ellipse cx="12" cy="-1" rx="1.5" ry="1" fill="#e8a0a8"/>
            
            <!-- Name -->
            <text x="3" y="24" text-anchor="middle" fill="#e8e0d0" font-size="7" style="text-shadow: 1px 1px 1px rgba(0,0,0,0.8)">${name}</text>
        </g>
    `;
}

// Render the leader sitting on High Rock
function renderLeaderOnHighRock() {
    const leader = CLAN_CATS.find(c => c.rank === 'Leader');
    if (!leader) return '';
    
    const furColor = leader.furColor;
    const darkerFur = adjustColor(furColor, -25);
    const lighterFur = adjustColor(furColor, 15);
    
    return `
        <g id="leader-cat" transform="translate(218, 168)">
            <!-- Leader sitting proudly on high rock -->
            <!-- Shadow on rock -->
            <ellipse cx="8" cy="18" rx="12" ry="4" fill="rgba(0,0,0,0.3)"/>
            
            <!-- Tail curled around -->
            <path d="M-8 8 Q-15 5 -12 -5 Q-8 -10 -3 -8" stroke="${furColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
            
            <!-- Body (sitting pose) -->
            <ellipse cx="5" cy="10" rx="12" ry="10" fill="${darkerFur}"/>
            <ellipse cx="5" cy="8" rx="10" ry="8" fill="${furColor}"/>
            <ellipse cx="5" cy="5" rx="6" ry="5" fill="${lighterFur}" opacity="0.2"/>
            
            <!-- Front paws -->
            <ellipse cx="-2" cy="16" rx="4" ry="3" fill="${furColor}"/>
            <ellipse cx="8" cy="16" rx="4" ry="3" fill="${furColor}"/>
            
            <!-- Head (looking out over camp) -->
            <circle cx="12" cy="-2" r="10" fill="${furColor}"/>
            <circle cx="12" cy="-4" r="8" fill="${lighterFur}" opacity="0.15"/>
            
            <!-- Ears -->
            <polygon points="4,-8 4,-18 11,-10" fill="${furColor}"/>
            <polygon points="5,-9 5,-15 10,-10" fill="#e8b4b8" opacity="0.6"/>
            <polygon points="18,-10 24,-18 21,-8" fill="${furColor}"/>
            <polygon points="19,-9 22,-15 20,-9" fill="#e8b4b8" opacity="0.6"/>
            
            <!-- Eyes (wise leader eyes) -->
            <ellipse cx="8" cy="-3" rx="3" ry="3.5" fill="white"/>
            <ellipse cx="16" cy="-3" rx="3" ry="3.5" fill="white"/>
            <ellipse cx="8" cy="-3" rx="2" ry="3" fill="#27ae60"/>
            <ellipse cx="16" cy="-3" rx="2" ry="3" fill="#27ae60"/>
            <ellipse cx="8" cy="-3" rx="1" ry="2.5" fill="#1a1a2e"/>
            <ellipse cx="16" cy="-3" rx="1" ry="2.5" fill="#1a1a2e"/>
            <circle cx="7" cy="-5" r="0.8" fill="white" opacity="0.9"/>
            <circle cx="15" cy="-5" r="0.8" fill="white" opacity="0.9"/>
            
            <!-- Nose -->
            <ellipse cx="12" cy="2" rx="2" ry="1.5" fill="#e8a0a8"/>
            
            <!-- Whiskers -->
            <g stroke="#d0d0d0" stroke-width="0.4" opacity="0.6">
                <line x1="5" y1="1" x2="-4" y2="-1"/>
                <line x1="5" y1="3" x2="-4" y2="3"/>
                <line x1="19" y1="1" x2="28" y2="-1"/>
                <line x1="19" y1="3" x2="28" y2="3"/>
            </g>
            
            <!-- Leader name label -->
            <text x="10" y="30" text-anchor="middle" fill="#ffd700" font-size="8" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.9)">${leader.name}</text>
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
            // Pick new random target within camp bounds
            npc.targetX = 60 + Math.random() * 320;
            npc.targetY = 100 + Math.random() * 200;
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
    
    return npcHTML;
}

// Render the forest (outside camp) for hunting/herb gathering
function renderForest() {
    const gameWorld = document.getElementById('game-world');
    const clan = GameState.selectedClan;
    
    // Generate random herbs and prey positions
    const herbSpots = [
        { x: 80, y: 100, herb: 'cobweb' },
        { x: 350, y: 150, herb: 'catmint' },
        { x: 150, y: 280, herb: 'marigold' },
        { x: 300, y: 320, herb: 'dock' },
        { x: 50, y: 220, herb: 'juniper' },
        { x: 380, y: 280, herb: 'poppy' }
    ];
    
    let worldHTML = `
        <svg id="forest-svg" viewBox="0 0 450 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
            <!-- Forest ground -->
            <rect x="0" y="0" width="450" height="400" fill="#1a3a2a"/>
            
            <!-- Trees scattered around -->
            <polygon points="40,350 55,200 70,350" fill="#2d5016"/>
            <polygon points="100,380 120,250 140,380" fill="#1e4d2b"/>
            <polygon points="350,350 370,180 390,350" fill="#2d5016"/>
            <polygon points="280,380 300,220 320,380" fill="#1e4d2b"/>
            <polygon points="180,300 200,150 220,300" fill="#2d5016"/>
            <polygon points="400,300 415,180 430,300" fill="#1e4d2b"/>
            
            <!-- Herb spots -->
    `;
    
    herbSpots.forEach((spot, i) => {
        const herb = HERBS[spot.herb];
        worldHTML += `
            <g class="herb-spot" data-herb="${spot.herb}" data-index="${i}">
                <circle cx="${spot.x}" cy="${spot.y}" r="20" fill="#2a4a2a" stroke="#4a6a4a" stroke-width="2"/>
                <text x="${spot.x}" y="${spot.y + 5}" text-anchor="middle" font-size="10" fill="#8a8">${herb.name}</text>
            </g>
        `;
    });
    
    // Prey spot
    worldHTML += `
        <g class="prey-spot" data-action="hunt">
            <circle cx="225" cy="200" r="25" fill="#4a3a2a" stroke="#6a5a4a" stroke-width="2"/>
            <ellipse cx="225" cy="200" rx="8" ry="5" fill="#8B7355"/>
            <circle cx="220" cy="198" r="2" fill="#1a1a1a"/>
            <text x="225" y="230" text-anchor="middle" fill="white" font-size="10">Prey</text>
        </g>
    `;
    
    // Camp entrance
    worldHTML += `
        <g class="camp-den" data-location="camp">
            <rect x="5" y="170" width="40" height="60" fill="#4a3a2a" rx="5"/>
            <polygon points="25,175 15,200 35,200" fill="#3a5a3a"/>
            <text x="25" y="225" text-anchor="middle" fill="white" font-size="8">Camp</text>
        </g>
    `;
    
    // Add player cat
    worldHTML += renderPlayerCat();
    
    // Add speech bubbles
    worldHTML += renderSpeechBubbles();
    
    worldHTML += `</svg>`;
    
    gameWorld.innerHTML = worldHTML;
    
    // Add click handlers
    document.querySelectorAll('.herb-spot').forEach(spot => {
        spot.addEventListener('click', () => collectHerb(spot.dataset.herb, spot.dataset.index));
    });
    
    document.querySelector('.prey-spot')?.addEventListener('click', huntPrey);
    
    document.querySelectorAll('.camp-den').forEach(den => {
        den.addEventListener('click', () => {
            if (den.dataset.location === 'camp') {
                GameState.currentLocation = 'camp';
                GameState.playerX = 225;
                GameState.playerY = 250;
                renderGameWorld();
                showMessage('🏕️ You returned to camp!');
            }
        });
    });
}

// Render player cat at current position
function renderPlayerCat() {
    const cat = GameState.catData;
    const furColor = cat.furColor || '#8d6e63';
    const eyeColor = cat.eyeColor || '#2ecc71';
    const pattern = cat.pattern || 'solid';
    const darkerFur = adjustColor(furColor, -30);
    const lighterFur = adjustColor(furColor, 20);
    const patternColor = adjustColor(furColor, -50);
    
    // Scale based on rank - kits are tiny!
    let scale = 1.0;
    if (cat.rank === 'Kit') {
        scale = 0.35; // Kits are very small and cute!
    } else if (cat.rank === 'Apprentice') {
        scale = 0.7; // Apprentices are smaller
    } else if (cat.rank === 'Elder') {
        scale = 0.9; // Elders are slightly smaller
    }
    
    let catPatternMarkings = '';
    if (pattern === 'tabby') {
        catPatternMarkings = `
            <path d="M-10 -6 Q-7 0 -10 6" stroke="${patternColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M-3 -8 Q0 0 -3 8" stroke="${patternColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M5 -6 Q8 0 5 6" stroke="${patternColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
        `;
    } else if (pattern === 'spotted') {
        catPatternMarkings = `
            <circle cx="-8" cy="-2" r="3" fill="${patternColor}"/>
            <circle cx="0" cy="3" r="2.5" fill="${patternColor}"/>
            <circle cx="6" cy="-3" r="2" fill="${patternColor}"/>
            <circle cx="-3" cy="-5" r="2" fill="${patternColor}"/>
        `;
    } else if (pattern === 'patched') {
        catPatternMarkings = `
            <ellipse cx="-5" cy="-2" rx="8" ry="6" fill="${patternColor}"/>
            <ellipse cx="8" cy="2" rx="5" ry="4" fill="${patternColor}" opacity="0.8"/>
        `;
    }
    
    const x = GameState.playerX;
    const y = GameState.playerY;
    
    // Get current emotion and pose
    const emotion = GameState.currentEmotion || 'normal';
    const isSitting = GameState.isSitting;
    const isSleeping = GameState.isSleeping;
    
    // Emotion-based eye and mouth variations
    let eyeStyle = '';
    let mouthStyle = '';
    let extraEffects = '';
    
    if (emotion === 'happy') {
        // Happy - curved eyes (^_^)
        eyeStyle = `
            <path d="M12,-10 Q15,-6 18,-10" stroke="${eyeColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M22,-10 Q25,-6 28,-10" stroke="${eyeColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
        `;
        mouthStyle = `
            <path d="M16,-2 Q20,2 24,-2" stroke="#e8a0a8" stroke-width="2" fill="none" stroke-linecap="round"/>
        `;
        // Little hearts
        extraEffects = `
            <text x="35" y="-20" fill="#ff6b6b" font-size="12">*</text>
        `;
    } else if (emotion === 'mad') {
        // Mad - angry eyebrows, sharp eyes
        eyeStyle = `
            <ellipse cx="15" cy="-9" rx="4" ry="4" fill="white"/>
            <ellipse cx="25" cy="-9" rx="4" ry="4" fill="white"/>
            <ellipse cx="15" cy="-9" rx="3" ry="3.5" fill="${eyeColor}"/>
            <ellipse cx="25" cy="-9" rx="3" ry="3.5" fill="${eyeColor}"/>
            <ellipse cx="15" cy="-9" rx="2" ry="2.5" fill="#1a1a2e"/>
            <ellipse cx="25" cy="-9" rx="2" ry="2.5" fill="#1a1a2e"/>
            <!-- Angry eyebrows -->
            <line x1="11" y1="-15" x2="18" y2="-13" stroke="${darkerFur}" stroke-width="3" stroke-linecap="round"/>
            <line x1="29" y1="-15" x2="22" y2="-13" stroke="${darkerFur}" stroke-width="3" stroke-linecap="round"/>
        `;
        mouthStyle = `
            <path d="M16,-1 L20,-3 L24,-1" stroke="#e8a0a8" stroke-width="2" fill="none" stroke-linecap="round"/>
        `;
        // Angry marks
        extraEffects = `
            <text x="35" y="-18" fill="#ff4444" font-size="10" font-weight="bold">#</text>
        `;
    } else if (isSleeping) {
        // Sleeping - closed eyes
        eyeStyle = `
            <path d="M12,-10 Q15,-8 18,-10" stroke="#1a1a2e" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M22,-10 Q25,-8 28,-10" stroke="#1a1a2e" stroke-width="2" fill="none" stroke-linecap="round"/>
        `;
        mouthStyle = `
            <ellipse cx="20" cy="-3" rx="2" ry="1.5" fill="#e8a0a8"/>
        `;
        // Zzz
        extraEffects = `
            <text x="32" y="-20" fill="#aaa" font-size="10" font-weight="bold">z</text>
            <text x="38" y="-26" fill="#888" font-size="8" font-weight="bold">z</text>
            <text x="43" y="-30" fill="#666" font-size="6" font-weight="bold">z</text>
        `;
    } else {
        // Normal eyes
        eyeStyle = `
            <ellipse cx="15" cy="-10" rx="4" ry="4.5" fill="white"/>
            <ellipse cx="25" cy="-10" rx="4" ry="4.5" fill="white"/>
            <ellipse cx="15" cy="-10" rx="3" ry="4" fill="${eyeColor}"/>
            <ellipse cx="25" cy="-10" rx="3" ry="4" fill="${eyeColor}"/>
            <ellipse cx="15" cy="-10" rx="1.5" ry="3" fill="#1a1a2e"/>
            <ellipse cx="25" cy="-10" rx="1.5" ry="3" fill="#1a1a2e"/>
            <circle cx="13.5" cy="-12" r="1" fill="white" opacity="0.9"/>
            <circle cx="23.5" cy="-12" r="1" fill="white" opacity="0.9"/>
        `;
        mouthStyle = `
            <ellipse cx="20" cy="-4" rx="5" ry="3" fill="${lighterFur}" opacity="0.5"/>
            <path d="M18,-3 L20,-1 L22,-3" fill="#e8a0a8"/>
            <ellipse cx="20" cy="-3" rx="2.5" ry="2" fill="#e8a0a8"/>
        `;
    }
    
    // Different pose based on sitting/sleeping
    let bodyPose = '';
    let tailPose = '';
    let legsPose = '';
    
    if (isSitting || isSleeping) {
        // Sitting/sleeping pose - curled up
        tailPose = `
            <path d="M-15 8 Q-25 15 -20 20 Q-10 22 0 18" stroke="${darkerFur}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M-14 7 Q-23 14 -18 18 Q-8 20 0 16" stroke="${furColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
        `;
        legsPose = `
            <!-- Tucked paws -->
            <ellipse cx="-8" cy="12" rx="6" ry="4" fill="${furColor}"/>
            <ellipse cx="8" cy="12" rx="6" ry="4" fill="${furColor}"/>
        `;
        bodyPose = `
            <ellipse cx="0" cy="4" rx="18" ry="12" fill="${darkerFur}"/>
            <ellipse cx="0" cy="2" rx="16" ry="10" fill="${furColor}"/>
            <ellipse cx="0" cy="0" rx="12" ry="7" fill="${lighterFur}" opacity="0.3"/>
            ${catPatternMarkings}
        `;
    } else {
        // Standing pose
        tailPose = `
            <path d="M-18 2 Q-32 -5 -30 -22 Q-28 -28 -24 -26" stroke="${darkerFur}" stroke-width="7" fill="none" stroke-linecap="round"/>
            <path d="M-17 1 Q-30 -5 -28 -21 Q-26 -26 -23 -25" stroke="${furColor}" stroke-width="5" fill="none" stroke-linecap="round"/>
        `;
        legsPose = `
            <!-- Back legs with paws -->
            <rect x="-16" y="6" width="6" height="14" rx="3" fill="${darkerFur}"/>
            <ellipse cx="-13" cy="20" rx="4" ry="3" fill="${darkerFur}"/>
            <rect x="-8" y="6" width="6" height="14" rx="3" fill="${furColor}"/>
            <ellipse cx="-5" cy="20" rx="4" ry="3" fill="${furColor}"/>
            
            <!-- Front legs with paws -->
            <rect x="6" y="6" width="6" height="14" rx="3" fill="${darkerFur}"/>
            <ellipse cx="9" cy="20" rx="4" ry="3" fill="${darkerFur}"/>
            <rect x="13" y="6" width="6" height="14" rx="3" fill="${furColor}"/>
            <ellipse cx="16" cy="20" rx="4" ry="3" fill="${furColor}"/>
        `;
        bodyPose = `
            <ellipse cx="0" cy="0" rx="20" ry="14" fill="${darkerFur}"/>
            <ellipse cx="0" cy="-1" rx="18" ry="12" fill="${furColor}"/>
            <ellipse cx="0" cy="-3" rx="14" ry="8" fill="${lighterFur}" opacity="0.3"/>
            ${catPatternMarkings}
            
            <!-- Chest fluff -->
            <ellipse cx="10" cy="2" rx="6" ry="5" fill="${lighterFur}" opacity="0.4"/>
        `;
    }
    
    return `
        <!-- Player cat with improved graphics -->
        <g id="player-cat" transform="translate(${x}, ${y}) scale(${scale})" filter="url(#softShadow)">
            <!-- Ground shadow -->
            <ellipse cx="0" cy="22" rx="22" ry="6" fill="rgba(0,0,0,0.35)"/>
            
            <!-- Tail -->
            ${tailPose}
            
            <!-- Legs -->
            ${legsPose}
            
            <!-- Body -->
            ${bodyPose}
            
            <!-- Head -->
            <circle cx="20" cy="-8" r="14" fill="${darkerFur}"/>
            <circle cx="20" cy="-9" r="13" fill="${furColor}"/>
            <circle cx="20" cy="-11" r="10" fill="${lighterFur}" opacity="0.2"/>
            
            <!-- Ears with detail -->
            <polygon points="9,-16 10,-30 19,-20" fill="${furColor}"/>
            <polygon points="10,-17 11,-27 18,-20" fill="${darkerFur}" opacity="0.3"/>
            <polygon points="11,-18 12,-25 17,-20" fill="#e8b4b8"/>
            
            <polygon points="27,-20 34,-30 32,-16" fill="${furColor}"/>
            <polygon points="28,-19 33,-27 31,-17" fill="${darkerFur}" opacity="0.3"/>
            <polygon points="29,-18 32,-25 30,-18" fill="#e8b4b8"/>
            
            <!-- Eyes (emotion-based) -->
            ${eyeStyle}
            
            <!-- Mouth (emotion-based) -->
            ${mouthStyle}
            
            <!-- Extra effects -->
            ${extraEffects}
            
            <!-- Whiskers -->
            <g stroke="#d0d0d0" stroke-width="0.5" opacity="0.7">
                <line x1="10" y1="-4" x2="-2" y2="-6"/>
                <line x1="10" y1="-2" x2="-2" y2="-2"/>
                <line x1="10" y1="0" x2="-2" y2="2"/>
                <line x1="30" y1="-4" x2="42" y2="-6"/>
                <line x1="30" y1="-2" x2="42" y2="-2"/>
                <line x1="30" y1="0" x2="42" y2="2"/>
            </g>
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
            desc.textContent = 'Fresh water for drinking.';
            addAction(actions, 'Drink', () => {
                cat.thirst = Math.min(100, cat.thirst + 40);
                showMessage('Refreshing water!');
                updateGameUI();
                saveGameData();
                closePopup();
            });
            break;
            
        case 'exit':
            title.textContent = 'Camp Exit';
            // Kits cannot leave camp!
            if (cat.rank === 'Kit') {
                desc.textContent = 'You are too young to leave camp! Stay in the nursery where it is safe.';
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
    
    // Check meal limit for warriors and apprentices
    if (cat.rank === 'Warrior' || cat.rank === 'Apprentice' || cat.rank === 'Deputy') {
        if (GameState.mealsToday >= 3) {
            showMessage('You have already eaten 3 times today. Wait until tomorrow.');
            return;
        }
        GameState.mealsToday++;
    }
    
    cat.hunger = Math.min(100, cat.hunger + 35);
    showMessage('Yummy! That was delicious!');
    updateGameUI();
    saveGameData();
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
        
        // Kits and elders get fed automatically by the clan!
        if (cat.rank === 'Kit' || cat.rank === 'Elder') {
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
        
        // If very thirsty, a cat brings you water in moss
        if (cat.thirst < 20 && cat.rank !== 'Kit' && cat.rank !== 'Elder') {
            cat.thirst = Math.min(100, cat.thirst + 25);
            showMessage('A clanmate noticed you were thirsty and brought water in moss!');
        }
        
        // If sick (low health), cats come to help
        if (cat.health < 40) {
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
    document.getElementById('speech-popup').classList.remove('hidden');
    document.getElementById('speech-input').value = '';
    document.getElementById('speech-input').focus();
}

function closeSpeechPopup() {
    document.getElementById('speech-popup').classList.add('hidden');
}

function sayPlayerSpeech() {
    const input = document.getElementById('speech-input');
    const text = input.value.trim();
    
    if (text) {
        showSpeechBubble('player', text);
        
        // NPCs might respond!
        if (Math.random() > 0.4) {
            setTimeout(() => {
                triggerNPCResponse(text);
            }, 2000);
        }
    }
    
    closeSpeechPopup();
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
            <g class="speech-bubble" transform="translate(${x}, ${y})">
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
    
    // Check moving NPCs
    if (npcName.toLowerCase() === 'dustpelt' && npcs.dustpelt) {
        return { x: npcs.dustpelt.x, y: npcs.dustpelt.y };
    }
    if (npcName.toLowerCase() === 'cloudtail' && npcs.cloudtail) {
        return { x: npcs.cloudtail.x, y: npcs.cloudtail.y };
    }
    if (npcName.toLowerCase() === 'brightheart' && npcs.brightheart) {
        return { x: npcs.brightheart.x, y: npcs.brightheart.y };
    }
    if (npcName.toLowerCase() === 'ferncloud' && npcs.ferncloud) {
        return { x: npcs.ferncloud.x, y: npcs.ferncloud.y };
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
    if (Math.random() > 0.01) return; // 1% chance per second
    
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
    
    showMessage(`RAID! ${enemyClan} cats are attacking the camp!`);
    
    setTimeout(() => {
        // If player is a kit, they might try to steal you!
        if (cat.rank === 'Kit') {
            showMessage(`A ${enemyClan} warrior is trying to steal you!`);
            
            setTimeout(() => {
                // Clan fights back!
                const defenders = ['Brambleclaw', 'Sandstorm', 'Graystripe', 'Dustpelt', 'Firestar'];
                const defender = defenders[Math.floor(Math.random() * defenders.length)];
                
                if (Math.random() > 0.3) {
                    // Clan wins!
                    showMessage(`${defender} leaps to your defense! "Leave our kit alone!"`);
                    setTimeout(() => {
                        showMessage(`The clan drives ${enemyClan} away! You are safe!`);
                        cat.experience += 5;
                    }, 3000);
                } else {
                    // Close call!
                    showMessage(`${defender} fights fiercely! The enemy almost got you!`);
                    setTimeout(() => {
                        showMessage(`After a tough battle, ${enemyClan} retreats! That was close!`);
                        cat.health = Math.max(10, cat.health - 10);
                        cat.experience += 10;
                        updateGameUI();
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

// Stay in StarClan
function stayInStarClan() {
    showMessage('✨ You rest among the stars...');
}

// Visit dreams
function visitDreams() {
    showMessage('🌙 You visit a young cat\'s dream and give them guidance...');
}

// Restart game
function restartGame() {
    // Clear current slot
    localStorage.removeItem(`warriorcats_save_${GameState.selectedSlot}`);
    GameState.catData = null;
    GameState.selectedSlot = null;
    showScreen('clan');
}
