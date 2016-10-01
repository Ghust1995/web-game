import React, { PropTypes } from 'react';
import _ from 'lodash';

import Variable from './Variable';

const Component = ({name, variables, onVariableEdit}) => (
  <div>
    <h4>{name}</h4>
    <ul>
      {_.map(variables, (v, k) =>
        <Variable
          key={k}
          name={k}
          value={v}
          onVariableEdit = {(value) => onVariableEdit(k, value)}
        />
      )}
    </ul>
  </div>
);

Component.propTypes = {
  name: PropTypes.string.isRequired,
  variables: PropTypes.object.isRequired,
  onVariableEdit: PropTypes.func.isRequired
};

export default Component;
