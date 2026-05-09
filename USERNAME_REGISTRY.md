# Worldwide player usernames

The first time someone opens the game, they choose a **player username** (separate from their warrior cat name). You can make that name **globally unique** using Firebase Realtime Database.

## 1. Create a Realtime Database

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (free tier is enough).
2. **Build** → **Realtime Database** → **Create database** → start in **locked** mode, then replace rules with the snippet below.
3. Copy the database URL (looks like `https://xxxx-default-rtdb.firebaseio.com`).

## 2. Security rules

Use rules that allow **anyone to read** each name, but **only create** a key if it does not exist (so the second player cannot steal a name):

```json
{
  "rules": {
    "wc_usernames": {
      "$key": {
        ".read": true,
        ".write": "!data.exists()"
      }
    }
  }
}
```

Publish the rules.

## 3. Configure the game

Edit `js/username-config.js` and set:

```js
window.WC_USERNAME_DB_URL = 'https://YOUR-PROJECT-default-rtdb.firebaseio.com';
```

Reload the game. New players will only be able to claim a username if it is not already in `wc_usernames/`.

## Local-only mode

If `WC_USERNAME_DB_URL` is left empty, the game still asks for a username on first launch, but names are only checked against a list stored in **this browser** — not worldwide.

## CORS

Firebase Realtime Database allows browser `fetch` to read/write JSON endpoints without extra CORS setup for the default domain.
