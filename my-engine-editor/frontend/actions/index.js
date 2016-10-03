// UI Actions
export const editVariable = (component, variable, value) => {
  return {
    type: 'EDIT_VARIABLE',
    component,
    variable,
    value,
  };
};


// Network Actions
export const addComponent = (name, component) => {
  return {
    type: 'ADD_COMPONENT',
    name,
    component,
  };
};

// export const fetchComponentsSuccess = (components) => {
//   return {
//     type: 'FETCH_COMPONENTS_SUCCESS',
//     components
//   };
// };
//
// export const fetchComponentsFailure = (error) => {
//   return {
//     type: 'FETCH_COMPONENTS_FAILURE',
//     error
//   };
// };
//
// export const fetchComponents = () => {
//   return {
//     type: 'FETCH_COMPONENTS',
//   };
// };
