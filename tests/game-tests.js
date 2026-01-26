// ============= WARRIOR CATS GAME TEST SUITE =============
// Run with: node tests/game-tests.js

const {
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
    initializeNightsSlept,
    simulateSleepOneNight,
    simulateSleepNights,
    // Party system
    createPartyState,
    startParty,
    stopParty,
    toggleParty,
    validatePartyState,
    canStartParty
} = require('../js/game-logic.js');

// Simple test framework
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    testsRun++;
    try {
        fn();
        testsPassed++;
        console.log(`✅ ${name}`);
    } catch (error) {
        testsFailed++;
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
    }
}

function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
        throw new Error(`${message} Expected ${expected}, got ${actual}`);
    }
}

function assertTrue(value, message = '') {
    if (!value) {
        throw new Error(`${message} Expected true, got ${value}`);
    }
}

function assertFalse(value, message = '') {
    if (value) {
        throw new Error(`${message} Expected false, got ${value}`);
    }
}

// ============= SEASON TESTS =============
console.log('\n🌿 SEASON SYSTEM TESTS');

test('Age 0-2 should be newleaf (spring)', () => {
    assertEqual(calculateSeason(0), 'newleaf');
    assertEqual(calculateSeason(1), 'newleaf');
    assertEqual(calculateSeason(2), 'newleaf');
});

test('Age 3-5 should be greenleaf (summer)', () => {
    assertEqual(calculateSeason(3), 'greenleaf');
    assertEqual(calculateSeason(4), 'greenleaf');
    assertEqual(calculateSeason(5), 'greenleaf');
});

test('Age 6-8 should be leaf-fall (autumn)', () => {
    assertEqual(calculateSeason(6), 'leaf-fall');
    assertEqual(calculateSeason(7), 'leaf-fall');
    assertEqual(calculateSeason(8), 'leaf-fall');
});

test('Age 9-11 should be leaf-bare (winter)', () => {
    assertEqual(calculateSeason(9), 'leaf-bare');
    assertEqual(calculateSeason(10), 'leaf-bare');
    assertEqual(calculateSeason(11), 'leaf-bare');
});

test('Seasons should cycle after 12 moons', () => {
    assertEqual(calculateSeason(12), 'newleaf');
    assertEqual(calculateSeason(15), 'greenleaf');
    assertEqual(calculateSeason(18), 'leaf-fall');
    assertEqual(calculateSeason(21), 'leaf-bare');
});

// ============= PREY MULTIPLIER TESTS =============
console.log('\n🐭 PREY MULTIPLIER TESTS');

test('Greenleaf should have highest prey (1.5x)', () => {
    assertEqual(calculatePreyMultiplier('greenleaf'), 1.5);
});

test('Newleaf should have good prey (1.2x)', () => {
    assertEqual(calculatePreyMultiplier('newleaf'), 1.2);
});

test('Leaf-fall should have reduced prey (0.8x)', () => {
    assertEqual(calculatePreyMultiplier('leaf-fall'), 0.8);
});

test('Leaf-bare should have scarce prey (0.4x)', () => {
    assertEqual(calculatePreyMultiplier('leaf-bare'), 0.4);
});

// ============= WEATHER EFFECT TESTS =============
console.log('\n🌧️ WEATHER EFFECT TESTS');

test('Stormy weather should have 0.5 hunting penalty and 2 health drain', () => {
    const effect = calculateWeatherEffect('stormy');
    assertEqual(effect.huntingPenalty, 0.5);
    assertEqual(effect.healthDrain, 2);
});

test('Sunny weather should have no penalties', () => {
    const effect = calculateWeatherEffect('sunny');
    assertEqual(effect.huntingPenalty, 1.0);
    assertEqual(effect.healthDrain, 0);
});

test('Rainy weather should have 0.7 hunting penalty', () => {
    const effect = calculateWeatherEffect('rainy');
    assertEqual(effect.huntingPenalty, 0.7);
});

test('Snowy weather should have 0.6 hunting penalty', () => {
    const effect = calculateWeatherEffect('snowy');
    assertEqual(effect.huntingPenalty, 0.6);
});

// ============= HUNTING FOOD TESTS =============
console.log('\n🍖 HUNTING FOOD TESTS');

test('Greenleaf hunting should give 45 food', () => {
    assertEqual(calculateHuntingFood('greenleaf'), 45);
});

test('Leaf-bare hunting should give only 20 food', () => {
    assertEqual(calculateHuntingFood('leaf-bare'), 20);
});

test('Newleaf hunting should give 35 food', () => {
    assertEqual(calculateHuntingFood('newleaf'), 35);
});

test('Leaf-fall hunting should give 30 food', () => {
    assertEqual(calculateHuntingFood('leaf-fall'), 30);
});

// ============= KIT TO APPRENTICE TESTS =============
console.log('\n🐱 KIT TO APPRENTICE PROGRESSION TESTS');

test('Kit with 0 nights slept should NOT become apprentice', () => {
    const kit = { rank: 'Kit', nightsSlept: 0 };
    assertFalse(shouldKitBecomeApprentice(kit));
});

test('Kit with 5 nights slept should NOT become apprentice', () => {
    const kit = { rank: 'Kit', nightsSlept: 5 };
    assertFalse(shouldKitBecomeApprentice(kit));
});

test('Kit with 6 nights slept SHOULD become apprentice', () => {
    const kit = { rank: 'Kit', nightsSlept: 6 };
    assertTrue(shouldKitBecomeApprentice(kit));
});

test('Kit with 10 nights slept SHOULD become apprentice', () => {
    const kit = { rank: 'Kit', nightsSlept: 10 };
    assertTrue(shouldKitBecomeApprentice(kit));
});

test('Apprentice should NOT trigger kit->apprentice check', () => {
    const apprentice = { rank: 'Apprentice', nightsSlept: 10 };
    assertFalse(shouldKitBecomeApprentice(apprentice));
});

test('Kit with undefined nightsSlept should NOT become apprentice', () => {
    const kit = { rank: 'Kit' };
    assertFalse(shouldKitBecomeApprentice(kit));
});

// ============= APPRENTICE TO WARRIOR TESTS =============
console.log('\n⚔️ APPRENTICE TO WARRIOR TESTS');

test('Apprentice with 50 XP should NOT become warrior', () => {
    const apprentice = { rank: 'Apprentice', experience: 50 };
    assertFalse(shouldApprenticeBecomeWarrior(apprentice));
});

test('Apprentice with 100 XP SHOULD become warrior', () => {
    const apprentice = { rank: 'Apprentice', experience: 100 };
    assertTrue(shouldApprenticeBecomeWarrior(apprentice));
});

test('Apprentice with 150 XP SHOULD become warrior', () => {
    const apprentice = { rank: 'Apprentice', experience: 150 };
    assertTrue(shouldApprenticeBecomeWarrior(apprentice));
});

// ============= STEALING OUTCOME TESTS =============
console.log('\n🏃 KIT STEALING OUTCOME TESTS');

test('Roll > 0.50 should result in defended (clan wins)', () => {
    assertEqual(calculateStealingOutcome(0.51), 'defended');
    assertEqual(calculateStealingOutcome(0.99), 'defended');
});

test('Roll 0.31-0.50 should result in close_call', () => {
    assertEqual(calculateStealingOutcome(0.31), 'close_call');
    assertEqual(calculateStealingOutcome(0.50), 'close_call');
});

test('Roll <= 0.30 should result in stolen (30% chance)', () => {
    assertEqual(calculateStealingOutcome(0.30), 'stolen');
    assertEqual(calculateStealingOutcome(0.15), 'stolen');
    assertEqual(calculateStealingOutcome(0.01), 'stolen');
});

// ============= DARK FOREST TESTS =============
console.log('\n👿 DARK FOREST TESTS');

test('Banished cat should go to Dark Forest', () => {
    const cat = { isBanished: true };
    assertTrue(shouldGoToDarkForest(cat));
});

test('Cat with 3+ evil acts should go to Dark Forest', () => {
    const cat = { evilActs: 3 };
    assertTrue(shouldGoToDarkForest(cat));
    const cat2 = { evilActs: 5 };
    assertTrue(shouldGoToDarkForest(cat2));
});

test('Murderer should go to Dark Forest', () => {
    const cat = { murderedCat: true };
    assertTrue(shouldGoToDarkForest(cat));
});

test('Good cat should NOT go to Dark Forest', () => {
    const cat = { evilActs: 0 };
    assertFalse(shouldGoToDarkForest(cat));
});

test('Cat with 2 evil acts should NOT go to Dark Forest', () => {
    const cat = { evilActs: 2 };
    assertFalse(shouldGoToDarkForest(cat));
});

// ============= HUNGER/THIRST TESTS =============
console.log('\n💧 HUNGER/THIRST DECREASE TESTS');

test('Hunger should decrease every 5 steps', () => {
    assertEqual(calculateHungerDecrease(5), 1);
    assertEqual(calculateHungerDecrease(10), 1);
    assertEqual(calculateHungerDecrease(15), 1);
});

test('Hunger should NOT decrease on other steps', () => {
    assertEqual(calculateHungerDecrease(1), 0);
    assertEqual(calculateHungerDecrease(3), 0);
    assertEqual(calculateHungerDecrease(7), 0);
});

test('Thirst should decrease every 3 steps', () => {
    assertEqual(calculateThirstDecrease(3), 1);
    assertEqual(calculateThirstDecrease(6), 1);
    assertEqual(calculateThirstDecrease(9), 1);
});

test('Thirst should NOT decrease on other steps', () => {
    assertEqual(calculateThirstDecrease(1), 0);
    assertEqual(calculateThirstDecrease(2), 0);
    assertEqual(calculateThirstDecrease(4), 0);
});

// ============= SHADOWCLAN DEATH TESTS =============
console.log('\n💀 SHADOWCLAN DEATH TESTS');

test('ShadowClan with roll < 0.10 should kill kit', () => {
    assertTrue(shouldShadowClanKillKit('shadow', 0.05));
    assertTrue(shouldShadowClanKillKit('shadow', 0.09));
});

test('ShadowClan with roll >= 0.10 should NOT kill kit', () => {
    assertFalse(shouldShadowClanKillKit('shadow', 0.10));
    assertFalse(shouldShadowClanKillKit('shadow', 0.50));
});

test('Other clans should never kill kit', () => {
    assertFalse(shouldShadowClanKillKit('thunder', 0.01));
    assertFalse(shouldShadowClanKillKit('river', 0.01));
    assertFalse(shouldShadowClanKillKit('wind', 0.01));
});

// ============= CAT DATA VALIDATION TESTS =============
console.log('\n✅ CAT DATA VALIDATION TESTS');

test('Valid cat data should pass validation', () => {
    const cat = { name: 'Stormkit', rank: 'Kit', age: 0, health: 100, hunger: 100, thirst: 100 };
    const result = validateCatData(cat);
    assertTrue(result.valid);
    assertEqual(result.missingFields.length, 0);
});

test('Cat missing name should fail validation', () => {
    const cat = { rank: 'Kit', age: 0, health: 100, hunger: 100, thirst: 100 };
    const result = validateCatData(cat);
    assertFalse(result.valid);
    assertTrue(result.missingFields.includes('name'));
});

test('Cat missing multiple fields should list all missing', () => {
    const cat = { name: 'Stormkit' };
    const result = validateCatData(cat);
    assertFalse(result.valid);
    assertTrue(result.missingFields.length >= 4);
});

// ============= NIGHTS SLEPT INITIALIZATION TESTS =============
console.log('\n😴 NIGHTS SLEPT INITIALIZATION TESTS');

test('Kit without nightsSlept should get age as nightsSlept', () => {
    const kit = { rank: 'Kit', age: 3 };
    assertEqual(initializeNightsSlept(kit), 3);
});

test('Non-kit without nightsSlept should get 6', () => {
    const warrior = { rank: 'Warrior', age: 20 };
    assertEqual(initializeNightsSlept(warrior), 6);
});

test('Cat with existing nightsSlept should keep it', () => {
    const kit = { rank: 'Kit', age: 5, nightsSlept: 2 };
    assertEqual(initializeNightsSlept(kit), 2);
});

// ============= AGING SIMULATION TESTS =============
console.log('\n🌙 AGING SIMULATION TESTS (THE MOST IMPORTANT!)');

test('New kit (age 0) sleeping 1 night should become age 1', () => {
    const kit = { rank: 'Kit', age: 0, nightsSlept: 0 };
    const result = simulateSleepOneNight(kit);
    assertEqual(result.age, 1, 'Age should be 1 after 1 sleep');
    assertEqual(result.nightsSlept, 1, 'nightsSlept should be 1 after 1 sleep');
});

test('New kit (age 0) sleeping 1 night should NOT become age 13!', () => {
    const kit = { rank: 'Kit', age: 0, nightsSlept: 0 };
    const result = simulateSleepOneNight(kit);
    assertTrue(result.age < 10, `Age should NOT jump to ${result.age}! Should be 1.`);
});

test('New kit sleeping 6 nights should become apprentice at age 6', () => {
    const kit = { rank: 'Kit', age: 0, nightsSlept: 0 };
    const result = simulateSleepNights(kit, 6);
    assertEqual(result.age, 6, 'Age should be 6 after 6 sleeps');
    assertEqual(result.nightsSlept, 6, 'nightsSlept should be 6');
    assertEqual(result.rank, 'Apprentice', 'Should become Apprentice at 6 nights');
});

test('Kit sleeping 5 nights should still be a kit', () => {
    const kit = { rank: 'Kit', age: 0, nightsSlept: 0 };
    const result = simulateSleepNights(kit, 5);
    assertEqual(result.age, 5, 'Age should be 5 after 5 sleeps');
    assertEqual(result.nightsSlept, 5, 'nightsSlept should be 5');
    assertEqual(result.rank, 'Kit', 'Should still be a Kit at 5 nights');
});

test('Age should increment by exactly 1 each night, not more', () => {
    const kit = { rank: 'Kit', age: 0, nightsSlept: 0 };
    
    // Sleep 1 night
    let result = simulateSleepOneNight(kit);
    assertEqual(result.age, 1, 'After 1 night: age should be 1');
    
    // Sleep another night
    result = simulateSleepOneNight({ ...kit, age: result.age, nightsSlept: result.nightsSlept });
    assertEqual(result.age, 2, 'After 2 nights: age should be 2');
    
    // Sleep another night
    result = simulateSleepOneNight({ ...kit, age: result.age, nightsSlept: result.nightsSlept });
    assertEqual(result.age, 3, 'After 3 nights: age should be 3');
});

// ============= PARTY SYSTEM TESTS =============
console.log('\n🎉 PARTY SYSTEM TESTS');

test('Party can start without tapping moon first', () => {
    assertTrue(canStartParty(), 'Party should be able to start from anywhere');
});

test('New party state should be inactive', () => {
    const state = createPartyState();
    assertFalse(state.isActive, 'New party state should not be active');
    assertFalse(state.musicPlaying, 'Music should not be playing');
    assertFalse(state.hasDiscoLights, 'Disco lights should not be on');
    assertFalse(state.hasDancingCats, 'Dancing cats should not be showing');
    assertFalse(state.hasPartyText, 'Party text should not be showing');
});

test('Starting party should activate all party elements', () => {
    const state = createPartyState();
    const newState = startParty(state);
    
    assertTrue(newState.isActive, 'Party should be active');
    assertTrue(newState.musicPlaying, 'Music should be playing');
    assertTrue(newState.hasDiscoLights, 'Disco lights should be on');
    assertTrue(newState.hasDancingCats, 'Dancing cats should be showing');
    assertTrue(newState.hasPartyText, 'Party text should be showing');
});

test('Stopping party should deactivate all party elements', () => {
    const activeState = startParty(createPartyState());
    const stoppedState = stopParty(activeState);
    
    assertFalse(stoppedState.isActive, 'Party should not be active');
    assertFalse(stoppedState.musicPlaying, 'Music should not be playing');
    assertFalse(stoppedState.hasDiscoLights, 'Disco lights should be off');
    assertFalse(stoppedState.hasDancingCats, 'Dancing cats should not be showing');
    assertFalse(stoppedState.hasPartyText, 'Party text should not be showing');
});

test('Toggle party should start party when inactive', () => {
    const state = createPartyState();
    const newState = toggleParty(state);
    
    assertTrue(newState.isActive, 'Toggling inactive party should activate it');
});

test('Toggle party should stop party when active', () => {
    const activeState = startParty(createPartyState());
    const newState = toggleParty(activeState);
    
    assertFalse(newState.isActive, 'Toggling active party should deactivate it');
});

test('Party state should be valid when active (all elements on)', () => {
    const state = startParty(createPartyState());
    assertTrue(validatePartyState(state), 'Active party with all elements should be valid');
});

test('Party state should be valid when inactive (all elements off)', () => {
    const state = createPartyState();
    assertTrue(validatePartyState(state), 'Inactive party with no elements should be valid');
});

test('Party state should be invalid if active but missing elements', () => {
    const badState = {
        isActive: true,
        musicPlaying: true,
        hasDiscoLights: false,  // Missing!
        hasDancingCats: true,
        hasPartyText: true
    };
    assertFalse(validatePartyState(badState), 'Active party missing disco lights should be invalid');
});

test('Double toggle should return to original state', () => {
    const state = createPartyState();
    const toggled1 = toggleParty(state);
    const toggled2 = toggleParty(toggled1);
    
    assertEqual(toggled2.isActive, state.isActive, 'Double toggle should return to original active state');
});

// ============= SUMMARY =============
console.log('\n' + '='.repeat(50));
console.log(`📊 TEST RESULTS: ${testsPassed}/${testsRun} passed`);
if (testsFailed > 0) {
    console.log(`❌ ${testsFailed} tests FAILED`);
    process.exit(1);
} else {
    console.log('✅ All tests PASSED!');
    process.exit(0);
}
