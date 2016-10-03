import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import {addComponent} from './actions';

const editorRef = () => firebase.database().ref('hierarchy');

export function firebaseMiddleware(store) {
  return next => action => {
    const result = next(action);
    if(action.type === "EDIT_VARIABLE") {
      let components = store.getState().components;
      console.log(components);
      editorRef().set(components);
    }
    return result;
  };
}

export default function(store) {
  firebase.initializeApp({
    apiKey: "AIzaSyAqHGwQN2J5BHniiZG0RtrFMHmQRDAKWCQ",
    authDomain: "multiplayer-2108d.firebaseapp.com",
    databaseURL: "https://multiplayer-2108d.firebaseio.com",
    storageBucket: "multiplayer-2108d.appspot.com",
  });

  editorRef().on('child_added',
        (component) => (store.dispatch(addComponent(component.key, component.val())))
      );
}
