# C1N Singapore Landing Page

This project is build on webpack. JS, fonts, and styles are inside `src` folder.
Under `dist` folder, only edit `index.html` and `images` if you want to add or remove images.

## Starting the project

```bash
npm run start
```

## Building the project

```bash
npm run build
```

## Deploying firebase functions

```bash
firebase deploy --only functions
```

## Deploying to production

```bash
npm run build
firebase deploy --only hosting
```
