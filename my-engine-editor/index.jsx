import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import editorApp from './reducers';
import App from './components/App';
import startFirebase from './reduxFirebase';

let store = createStore(editorApp);
startFirebase(store);

function renderInContainer(container) {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById(container)
  );
}

renderInContainer('app');

export default renderInContainer;
