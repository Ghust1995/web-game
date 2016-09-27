# [Web Game](https://guscg.com)

Engine and sample JavaScript networking game with THREE.js and Firebase


### Setup

Make sure to have both firebase and webpack installed globally
```sh
# Install firebase tools and webpack globally if not yet already
npm install -g firebase-tools webpack
```

The engine runs with a configuration as the example given is js/engine-config-example
```js
module.exports =
{
  INIT_SPECS: {
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 600,
    SHOW_STATS: true, // If you want to show the FPS on the top of the screen
    CONTAINER_ID: "WebGLContainer" // The id of the html element containing the game
  },
  FIREBASE: {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    storageBucket: "<BUCKET>.appspot.com",
  },
};
```

To run the app run:
```sh
# Install firebase tools and webpack globally if not yet already
npm run dev-server
```
