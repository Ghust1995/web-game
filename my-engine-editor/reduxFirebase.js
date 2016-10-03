import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import {addComponent} from './actions';

export default function(store) {
  firebase.initializeApp({
    apiKey: "AIzaSyAqHGwQN2J5BHniiZG0RtrFMHmQRDAKWCQ",
    authDomain: "multiplayer-2108d.firebaseapp.com",
    databaseURL: "https://multiplayer-2108d.firebaseio.com",
    storageBucket: "multiplayer-2108d.appspot.com",
  });

  firebase.database()
    .ref('hierarchy')
    .on('child_added',
        (component) => (store.dispatch(addComponent(component.key, component.val())))
      );
}
