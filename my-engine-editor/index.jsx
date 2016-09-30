import React from 'react';
import {render} from 'react-dom';
import constantsStore from './constantsStore.js';
import _ from 'lodash';

class App extends React.Component {
  constructor () {
    super();
    this.state = {
      Constants: constantsStore.Constants,
    };
  }

  render () {
    var constantsList = _.map(this.state.Constants, function(data) {
      return <li>{data}</li>;
    });

    return (<div>
      Hello World!
      <ul>{constantsList}</ul>
    </div>);
  }
}

render(<App/>, document.getElementById('app'));
