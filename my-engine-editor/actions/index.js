export const editVariable = (component, variable, value) => {
  return {
    type: 'EDIT_VARIABLE',
    component,
    variable,
    value,
  };
};
