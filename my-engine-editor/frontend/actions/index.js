export const editVariable = (component, variable, value) => {
  return {
    type: 'EDIT_VARIABLE',
    component,
    variable,
    value,
  };
};

export const addComponent = (name, component) => {
  return {
    type: 'ADD_COMPONENT',
    name,
    component,
  };
};
