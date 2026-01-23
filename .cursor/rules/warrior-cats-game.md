# Warrior Cats Game - Project Rules

## Project Overview
This is an HTML5 Warrior Cats-style game designed for children (ages 8+). The game runs entirely on static GitHub Pages with no backend.

## Target Audience
- Primary user: 8-year-old child prompting for features
- Help understand what kind of game she wants to make
- Keep gameplay simple and fun for small children

## Technical Requirements
- **HTML5 game** - No backend, all client-side
- **Responsive design** - Works on phone and desktop
- **Static hosting** - GitHub Pages via GitHub Actions
- **Autosave** - Uses localStorage for save slots

## Game Structure

### Screens
1. **Home Screen** - Warrior cats art, "Press any button to start", clan selection
2. **Save Slots** - 3 save slots to choose from
3. **Name Creation** - User picks first name, random suffix added (Storm, Tail, Step, Stripe, Fur, etc.)
4. **Main Game** - Survival gameplay with health, hunger, thirst bars
5. **StarClan** - Afterlife area with portal to restart, can visit cat dreams

### Progression System
1. **Kit** (0-6 moons old)
2. **Apprentice** (6+ moons) - Name suffix becomes "paw"
3. **Warrior** (play well to advance)
4. **Deputy** (play well + deputy dies by luck)
5. **Leader** (play well + leader dies by luck)
6. **StarClan** (after death) - Can restart or stay

### Clans
- ThunderClan
- RiverClan
- WindClan
- ShadowClan

### Core Gameplay
- Defend territory from intruders
- Hunt for your clan
- Survive with health, hunger, thirst bars
- Style like "Cat Tales Wild Woods Story" but with dens instead of houses

## Visual Style
- Warrior Cats book cover art style
- SVG illustrations for cats
- Each clan has its own look/environment

## Asset Handling
- When user uploads photos, either save them directly or recreate as SVGs
- Use warrior cats style (from books, not TV show)

## Git Workflow
- Commit and push changes after each significant update
- All pushes to main auto-deploy to GitHub Pages

## Remember
- Keep it simple for 8-year-olds
- Make it fun and engaging
- Help the child understand and build what they want
- Be patient and encouraging with young prompters
