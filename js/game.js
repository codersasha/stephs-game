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
    }
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

    // Game action buttons
    document.getElementById('hunt-btn').addEventListener('click', () => performAction('hunt'));
    document.getElementById('drink-btn').addEventListener('click', () => performAction('drink'));
    document.getElementById('patrol-btn').addEventListener('click', () => performAction('patrol'));
    document.getElementById('rest-btn').addEventListener('click', () => performAction('rest'));

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
        const slotElement = document.querySelector(`.save-slot[data-slot="${i}"] .slot-info`);
        
        if (saveData && saveData.clan === GameState.selectedClan) {
            slotElement.textContent = `${saveData.name} - ${saveData.rank} (${saveData.age} moons)`;
        } else if (saveData) {
            slotElement.textContent = `${saveData.name} (${CLANS[saveData.clan].name})`;
        } else {
            slotElement.textContent = 'Empty - New Game';
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
    
    if (saveData && saveData.clan === GameState.selectedClan) {
        // Load existing game
        GameState.catData = saveData;
        startGameplay();
    } else {
        // New game - go to name screen
        initNameScreen();
        showScreen('name');
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
    
    if (pattern === 'tabby') {
        patternMarkings = `
            <path d="M35 25 Q40 35 35 45" stroke="${patternColor}" stroke-width="3" fill="none"/>
            <path d="M50 20 Q55 35 50 50" stroke="${patternColor}" stroke-width="3" fill="none"/>
            <path d="M65 25 Q60 35 65 45" stroke="${patternColor}" stroke-width="3" fill="none"/>
        `;
    } else if (pattern === 'spotted') {
        patternMarkings = `
            <circle cx="35" cy="32" r="4" fill="${patternColor}"/>
            <circle cx="55" cy="28" r="5" fill="${patternColor}"/>
            <circle cx="48" cy="42" r="4" fill="${patternColor}"/>
            <circle cx="65" cy="38" r="3" fill="${patternColor}"/>
        `;
    } else if (pattern === 'patched') {
        patternMarkings = `
            <ellipse cx="40" cy="35" rx="12" ry="10" fill="${patternColor}"/>
            <ellipse cx="62" cy="40" rx="8" ry="7" fill="${patternColor}"/>
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
    
    // Set clan-specific background
    const gameWorld = document.getElementById('game-world');
    gameWorld.className = 'game-world ' + GameState.selectedClan;
    
    // Render the game world
    renderGameWorld();
    
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

// Render the game world
function renderGameWorld() {
    const gameWorld = document.getElementById('game-world');
    const clan = GameState.selectedClan;
    
    // Create a simple den scene based on clan
    let worldHTML = `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
    `;
    
    // Add clan-specific elements
    if (clan === 'thunder') {
        worldHTML += `
            <!-- Forest trees -->
            <rect x="0" y="200" width="400" height="100" fill="#1a3a2e"/>
            <polygon points="50,200 70,80 90,200" fill="#2d5016"/>
            <polygon points="120,200 150,60 180,200" fill="#1e4d2b"/>
            <polygon points="250,200 280,50 310,200" fill="#2d5016"/>
            <polygon points="340,200 360,90 380,200" fill="#1e4d2b"/>
            <!-- Den (bramble thicket) -->
            <ellipse cx="200" cy="220" rx="60" ry="30" fill="#4a3728"/>
            <ellipse cx="200" cy="210" rx="55" ry="25" fill="#5d4037"/>
            <text x="200" y="220" text-anchor="middle" fill="#8d6e63" font-size="12">🏕️ Warriors Den</text>
        `;
    } else if (clan === 'river') {
        worldHTML += `
            <!-- River -->
            <rect x="0" y="200" width="400" height="100" fill="#0d47a1"/>
            <path d="M0 220 Q100 200 200 220 T400 220" stroke="#1976d2" stroke-width="5" fill="none"/>
            <path d="M0 240 Q100 260 200 240 T400 240" stroke="#1976d2" stroke-width="5" fill="none"/>
            <!-- Reeds -->
            <line x1="50" y1="200" x2="50" y2="150" stroke="#558b2f" stroke-width="3"/>
            <line x1="55" y1="200" x2="60" y2="140" stroke="#558b2f" stroke-width="3"/>
            <line x1="350" y1="200" x2="350" y2="160" stroke="#558b2f" stroke-width="3"/>
            <!-- Den (reed bed) -->
            <ellipse cx="200" cy="180" rx="50" ry="25" fill="#33691e"/>
            <text x="200" y="185" text-anchor="middle" fill="#81c784" font-size="12">🏕️ River Den</text>
        `;
    } else if (clan === 'wind') {
        worldHTML += `
            <!-- Moor/hills -->
            <rect x="0" y="200" width="400" height="100" fill="#5d4e37"/>
            <ellipse cx="100" cy="220" rx="80" ry="40" fill="#6b5b45"/>
            <ellipse cx="300" cy="230" rx="100" ry="50" fill="#6b5b45"/>
            <!-- Wind lines -->
            <path d="M20 100 Q60 95 100 100" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none"/>
            <path d="M150 80 Q200 75 250 80" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none"/>
            <!-- Den (rabbit burrow) -->
            <circle cx="200" cy="210" r="30" fill="#3e2723"/>
            <text x="200" y="215" text-anchor="middle" fill="#a1887f" font-size="12">🏕️ Moor Den</text>
        `;
    } else if (clan === 'shadow') {
        worldHTML += `
            <!-- Dark pine forest -->
            <rect x="0" y="200" width="400" height="100" fill="#1a1a2e"/>
            <polygon points="30,200 45,100 60,200" fill="#1b5e20"/>
            <polygon points="80,200 100,70 120,200" fill="#0d3d12"/>
            <polygon points="280,200 300,60 320,200" fill="#1b5e20"/>
            <polygon points="350,200 365,90 380,200" fill="#0d3d12"/>
            <!-- Fog -->
            <ellipse cx="200" cy="180" rx="150" ry="20" fill="rgba(100,100,100,0.3)"/>
            <!-- Den (dark hollow) -->
            <ellipse cx="200" cy="220" rx="50" ry="30" fill="#0d0d1a"/>
            <text x="200" y="225" text-anchor="middle" fill="#7e57c2" font-size="12">🏕️ Shadow Den</text>
        `;
    }
    
    // Add player cat with customization
    const cat = GameState.catData;
    const furColor = cat.furColor || '#8d6e63';
    const eyeColor = cat.eyeColor || '#2ecc71';
    const pattern = cat.pattern || 'solid';
    const darkerFur = adjustColor(furColor, -30);
    const patternColor = adjustColor(furColor, -50);
    
    let catPatternMarkings = '';
    if (pattern === 'tabby') {
        catPatternMarkings = `
            <path d="M12 10 Q15 15 12 20" stroke="${patternColor}" stroke-width="2" fill="none"/>
            <path d="M20 8 Q23 15 20 22" stroke="${patternColor}" stroke-width="2" fill="none"/>
            <path d="M28 10 Q25 15 28 20" stroke="${patternColor}" stroke-width="2" fill="none"/>
        `;
    } else if (pattern === 'spotted') {
        catPatternMarkings = `
            <circle cx="12" cy="14" r="2" fill="${patternColor}"/>
            <circle cx="22" cy="12" r="2.5" fill="${patternColor}"/>
            <circle cx="18" cy="18" r="2" fill="${patternColor}"/>
        `;
    } else if (pattern === 'patched') {
        catPatternMarkings = `
            <ellipse cx="15" cy="14" rx="6" ry="5" fill="${patternColor}"/>
            <ellipse cx="26" cy="16" rx="4" ry="4" fill="${patternColor}"/>
        `;
    }
    
    worldHTML += `
        <!-- Player cat -->
        <g id="player-cat" transform="translate(180, 230)">
            <!-- Tail -->
            <path d="M2 20 Q-10 10 -8 -5" stroke="${furColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
            
            <!-- Back legs -->
            <rect x="5" y="22" width="6" height="14" rx="2" fill="${darkerFur}"/>
            <rect x="14" y="22" width="6" height="14" rx="2" fill="${furColor}"/>
            
            <!-- Front legs -->
            <rect x="30" y="22" width="6" height="14" rx="2" fill="${darkerFur}"/>
            <rect x="38" y="22" width="6" height="14" rx="2" fill="${furColor}"/>
            
            <!-- Paws -->
            <ellipse cx="8" cy="36" rx="4" ry="3" fill="${darkerFur}"/>
            <ellipse cx="17" cy="36" rx="4" ry="3" fill="${furColor}"/>
            <ellipse cx="33" cy="36" rx="4" ry="3" fill="${darkerFur}"/>
            <ellipse cx="41" cy="36" rx="4" ry="3" fill="${furColor}"/>
            
            <!-- Body -->
            <ellipse cx="22" cy="15" rx="20" ry="14" fill="${darkerFur}"/>
            <ellipse cx="22" cy="15" rx="18" ry="12" fill="${furColor}"/>
            ${catPatternMarkings}
            
            <!-- Head -->
            <circle cx="42" cy="6" r="12" fill="${furColor}"/>
            
            <!-- Ears -->
            <polygon points="33,0 35,-8 42,-2" fill="${furColor}"/>
            <polygon points="49,-2 56,-8 52,0" fill="${furColor}"/>
            <polygon points="35,-1 36,-6 40,-2" fill="#ffb6c1"/>
            <polygon points="50,-2 53,-6 51,-1" fill="#ffb6c1"/>
            
            <!-- Eyes -->
            <ellipse cx="37" cy="5" rx="3" ry="3.5" fill="white"/>
            <ellipse cx="47" cy="5" rx="3" ry="3.5" fill="white"/>
            <ellipse cx="37" cy="5" rx="2" ry="3" fill="${eyeColor}"/>
            <ellipse cx="47" cy="5" rx="2" ry="3" fill="${eyeColor}"/>
            <ellipse cx="37" cy="5" rx="1" ry="2.5" fill="#1a1a2e"/>
            <ellipse cx="47" cy="5" rx="1" ry="2.5" fill="#1a1a2e"/>
            
            <!-- Nose -->
            <ellipse cx="42" cy="11" rx="2.5" ry="2" fill="#ffb6c1"/>
            
            <!-- Whiskers -->
            <line x1="32" y1="10" x2="22" y2="8" stroke="#888" stroke-width="0.5"/>
            <line x1="32" y1="12" x2="22" y2="14" stroke="#888" stroke-width="0.5"/>
            <line x1="52" y1="10" x2="62" y2="8" stroke="#888" stroke-width="0.5"/>
            <line x1="52" y1="12" x2="62" y2="14" stroke="#888" stroke-width="0.5"/>
        </g>
    `;
    
    worldHTML += `</svg>`;
    gameWorld.innerHTML = worldHTML;
}

// Game loop
let gameLoopInterval;

function startGameLoop() {
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    
    gameLoopInterval = setInterval(() => {
        if (GameState.catData.inStarClan) return;
        
        // Decrease hunger and thirst over time
        GameState.catData.hunger = Math.max(0, GameState.catData.hunger - 0.5);
        GameState.catData.thirst = Math.max(0, GameState.catData.thirst - 0.7);
        
        // If hungry or thirsty, decrease health
        if (GameState.catData.hunger <= 0 || GameState.catData.thirst <= 0) {
            GameState.catData.health = Math.max(0, GameState.catData.health - 1);
        }
        
        // Check for death
        if (GameState.catData.health <= 0) {
            goToStarClan();
            return;
        }
        
        // Age up (1 moon = ~30 seconds for demo purposes)
        // In real game, this would be slower
        
        updateGameUI();
        saveGameData();
    }, 1000);
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
    
    // Kit to Apprentice at 6 moons
    if (cat.rank === 'Kit' && cat.age >= 6) {
        cat.rank = 'Apprentice';
        cat.name = cat.firstName + 'paw';
        showMessage('🎉 You are now an Apprentice! Your name is ' + cat.name);
    }
    // Apprentice to Warrior with enough experience
    else if (cat.rank === 'Apprentice' && cat.experience >= 100) {
        const suffix = NAME_SUFFIXES.warrior[Math.floor(Math.random() * NAME_SUFFIXES.warrior.length)];
        cat.rank = 'Warrior';
        cat.name = cat.firstName + suffix;
        showMessage('🎉 You are now a Warrior! Your name is ' + cat.name);
    }
    // Warrior to Deputy (luck + experience)
    else if (cat.rank === 'Warrior' && cat.experience >= 200 && Math.random() > 0.95) {
        cat.rank = 'Deputy';
        cat.isDeputy = true;
        showMessage('🎉 The deputy has retired! You are now Deputy!');
    }
    // Deputy to Leader (luck)
    else if (cat.rank === 'Deputy' && Math.random() > 0.98) {
        cat.rank = 'Leader';
        cat.isLeader = true;
        cat.name = cat.firstName + 'star';
        showMessage('🎉 You are now Leader! Your name is ' + cat.name + '!');
    }
    
    saveGameData();
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
