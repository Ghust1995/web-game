import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import editorApp from './reducers';
import App from './components/App';

let store = createStore(editorApp);
//
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);


// import React from 'react';
// import {render} from 'react-dom';
// import ConstantsStore from './ConstantsStore.js';
// import _ from 'lodash';
//
// function getState() {
//   return {
//     constants: ConstantsStore.get(),
//   };
// }
//
//
// class App extends React.Component {
//   constructor () {
//     super();
//     this._onChange = this._onChange.bind(this);
//     this.state = getState();
//   }
//
//   render () {
//     var constantsList = _.map(this.state.constants, function(data) {
//       return <li>{data}</li>;
//     });
//
//     return (<div>
//       Hello World!
//       <ul>{constantsList}</ul>
//     </div>);
//   }
// }
//
// render(<App/>, document.getElementById('app'));
