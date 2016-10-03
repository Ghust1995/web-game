import _ from 'lodash';

const initialState = {
};

const component = (state = {}, action) => {
  switch (action.type) {
    case 'EDIT_VARIABLE':
      return _.assignIn({}, state, {
        [action.variable]: action.value
      });
    default:
      return state;
  }
};

const components = (state = initialState, action) => {
  switch (action.type) {
    case 'EDIT_VARIABLE':
      return _.assignIn({}, state, {
        [action.component]: component(state[action.component], action)
      });
    case 'ADD_COMPONENT':
      return _.assignIn({}, state, {
        [action.name]: action.component
      });
    default:
      return state;
  }
};

export default components;
