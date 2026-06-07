# Final NTHU

A Cocos Creator 2.4.8 game project built around an NTHU campus adventure. The player explores a map, interacts with characters and doors, and completes several themed mini-games. Firebase is used for account authentication, score storage, and leaderboards.

## What I built

- Email/password registration and login with Firebase Authentication
- A campus exploration scene with character movement, camera following, NPCs, doors, and scene transitions
- Multiple mini-games, including a flag quiz, nuclear target shooting, PE challenges, maze gameplay, and a CS-themed battle
- Score persistence and per-game leaderboards backed by Firebase Realtime Database
- Audio, pause/resume controls, result screens, and return-to-map positioning
- A Firebase Hosting build configuration

## Technology

- Cocos Creator 2.4.8
- TypeScript
- Firebase Authentication, Realtime Database, and Hosting

## Run locally

1. Install Cocos Creator 2.4.8.
2. Clone this repository and open the project folder in Cocos Creator.
3. Install the JavaScript dependency with `npm install`.
4. Configure the Firebase project used by the game.
5. Open the login or main scene and run Preview.

## Project structure

- `assets/Script` - gameplay, UI, authentication, mini-game, and leaderboard scripts
- `assets/Scene` - Cocos Creator scenes
- `assets/resources` - runtime resources such as video
- `public` - web build used for Firebase Hosting
- `firebase.json` and `database.rules.json` - Firebase deployment configuration
