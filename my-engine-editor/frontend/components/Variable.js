import React, { PropTypes } from 'react';

const Variable = ({name, value, onVariableEdit}) => (
  <li>
      <span>{name}:</span>
      <input type="text" defaultValue={value} onChange={(e) => onVariableEdit(e.target.value)}></input>
  </li>
);

Variable.propTypes = {
  onVariableEdit: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired
};

export default Variable;
