import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import formBuilder from './formBuilder';

class Form extends React.PureComponent {
  render() {
    const GeneratedForm = formBuilder(this.props.mutation);

    const redirectTo = this.props.redirectTo || this.props.location.pathname || '/';
    const generatedFormProps = { ...this.props };
    delete generatedFormProps.mutation;
    delete generatedFormProps.location;
    delete generatedFormProps.dispatch;

    return (
      <GeneratedForm {...generatedFormProps} redirectTo={redirectTo} />
    );
  }
}

Form.defaultProps = {
  redirectTo: null,
};

Form.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  mutation: PropTypes.object.isRequired,
  redirectTo: PropTypes.string,
};

export default connect((state) => ({
  location: state.location,
}))(Form);
