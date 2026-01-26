// ============= GAME LOGIC MODULE =============
// Pure functions that can be tested independently of DOM

// Season calculation based on cat age
function calculateSeason(age) {
    const SEASONS = ['newleaf', 'greenleaf', 'leaf-fall', 'leaf-bare'];
    const seasonIndex = Math.floor(age / 3) % 4;
    return SEASONS[seasonIndex];
}

// Get prey multiplier based on season
function calculatePreyMultiplier(season) {
    switch (season) {
        case 'greenleaf': return 1.5; // Lots of prey in summer
        case 'newleaf': return 1.2; // Good prey in spring
        case 'leaf-fall': return 0.8; // Less prey in autumn
        case 'leaf-bare': return 0.4; // Very little prey in winter
        default: return 1.0;
    }
}

// Get weather effect on activities
function calculateWeatherEffect(weather) {
    switch (weather) {
        case 'stormy': return { huntingPenalty: 0.5, healthDrain: 2 };
        case 'rainy': return { huntingPenalty: 0.7, healthDrain: 1 };
        case 'snowy': return { huntingPenalty: 0.6, healthDrain: 1 };
        case 'cloudy': return { huntingPenalty: 0.9, healthDrain: 0 };
        case 'sunny': return { huntingPenalty: 1.0, healthDrain: 0 };
        default: return { huntingPenalty: 1.0, healthDrain: 0 };
    }
}

// Calculate food amount from hunting based on season
function calculateHuntingFood(season) {
    const foodAmount = {
        'greenleaf': 45, // Fat prey in summer!
        'newleaf': 35,
        'leaf-fall': 30,
        'leaf-bare': 20 // Skinny prey in winter...
    };
    return foodAmount[season] || 35;
}

// Check if kit should become apprentice
function shouldKitBecomeApprentice(cat) {
    return cat.rank === 'Kit' && (cat.nightsSlept || 0) >= 6;
}

// Check if apprentice should become warrior
function shouldApprenticeBecomeWarrior(cat) {
    return cat.rank === 'Apprentice' && cat.experience >= 100;
}

// Calculate stealing chance outcomes
// Returns: 'defended' (50%), 'close_call' (20%), or 'stolen' (30%)
function calculateStealingOutcome(roll) {
    if (roll > 0.50) return 'defended';
    if (roll > 0.30) return 'close_call';
    return 'stolen';
}

// Check if cat should go to Dark Forest (evil)
function shouldGoToDarkForest(cat) {
    const isBanished = cat.isBanished === true;
    const hasManyEvilActs = (cat.evilActs || 0) >= 3;
    const isMurderer = cat.murderedCat === true;
    return isBanished || hasManyEvilActs || isMurderer;
}

// Calculate hunger decrease per steps
function calculateHungerDecrease(stepsToday) {
    // Decrease hunger every 5 steps
    return stepsToday % 5 === 0 ? 1 : 0;
}

// Calculate thirst decrease per steps
function calculateThirstDecrease(stepsToday) {
    // Decrease thirst every 3 steps
    return stepsToday % 3 === 0 ? 1 : 0;
}

// Calculate if ShadowClan kills stolen kit (10% chance)
function shouldShadowClanKillKit(clanKey, roll) {
    return clanKey === 'shadow' && roll < 0.10;
}

// Validate cat data has required fields
function validateCatData(cat) {
    const requiredFields = ['name', 'rank', 'age', 'health', 'hunger', 'thirst'];
    const missing = requiredFields.filter(field => cat[field] === undefined);
    return {
        valid: missing.length === 0,
        missingFields: missing
    };
}

// Initialize nightsSlept for new cat or old save
function initializeNightsSlept(cat) {
    if (cat.nightsSlept === undefined) {
        if (cat.rank === 'Kit') {
            return cat.age || 0;
        } else {
            return 6; // Non-kits don't need this tracking
        }
    }
    return cat.nightsSlept;
}

// Export for testing (works in both Node.js and browser)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateSeason,
        calculatePreyMultiplier,
        calculateWeatherEffect,
        calculateHuntingFood,
        shouldKitBecomeApprentice,
        shouldApprenticeBecomeWarrior,
        calculateStealingOutcome,
        shouldGoToDarkForest,
        calculateHungerDecrease,
        calculateThirstDecrease,
        shouldShadowClanKillKit,
        validateCatData,
        initializeNightsSlept
    };
}
