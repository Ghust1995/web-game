import React, { PropTypes } from 'react';
import _ from 'lodash';

import Component from './Component';

const Components = ({components, onVariableEdit}) => (
  <div>
    <h1>Components</h1>
    <ul>
      {_.map(components, (v, k) =>
        <Component
          key={k}
          name={k}
          variables={v}
          onVariableEdit = {(variable, value) => onVariableEdit(k, variable, value)}
        />
      )}
    </ul>
  </div>
);

Components.propTypes = {
  components: PropTypes.object.isRequired,
  onVariableEdit: PropTypes.func.isRequired
};

export default Components;
