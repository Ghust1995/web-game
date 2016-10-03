import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';

import editorReducer from './reducers';
import App from './components/App';
import connectGame, {gameMiddleware} from './gameMiddleware';

let store = createStore(
  editorReducer,
  applyMiddleware(
    gameMiddleware
  )
);
connectGame(store);

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
