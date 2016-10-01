import _ from 'lodash';

const initialState = {
  Bullet: {
    speed: 100,
    initialTime: 0,
    name: "Hello",
  },
  Player: {
    speed: 100,
    health: 50,
  }
};

const component = (state = {}, action) => {
  switch (action.type) {
    case 'EDIT_VARIABLE':
      _.set(state, action.variable, action.value);
      return state;
    default:
      return state;
  }
};

const components = (state = initialState, action) => {
  switch (action.type) {
    case 'EDIT_VARIABLE':
      _.set(state, action.component, component(state[action.component], action));
      return state;
    default:
      return state;
  }
};

export default components;
