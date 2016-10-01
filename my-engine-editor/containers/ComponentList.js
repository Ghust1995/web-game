import { connect } from 'react-redux';
import { editVariable } from '../actions';
import Components from '../components/Components';

const getComponents = (components) => {
      return components;
  };

const mapStateToProps = (state) => {
  return {
    components: getComponents(state.components)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onVariableEdit: (component, variable, value) => {
      dispatch(editVariable(component, variable, value));
    }
  };
};

const VariablesList = connect(
  mapStateToProps,
  mapDispatchToProps
)(Components);

export default VariablesList;
