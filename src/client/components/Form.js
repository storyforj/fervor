import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import formBuilder from './formBuilder';

class Form extends React.PureComponent {
  render() {
    const GeneratedForm = formBuilder(this.props.mutation);

    const redirectTo = this.props.redirectTo || this.props.currentPathname;
    const redirectOnClient = (
      !this.props.onSuccess && // there is no success function (which overrides behavior)
      this.props.currentPathname !== redirectTo // and we are not currently on the redirect page
    );
    const generatedFormProps = { ...this.props };
    delete generatedFormProps.mutation;
    delete generatedFormProps.currentPathname;
    delete generatedFormProps.dispatch;

    return (
      <GeneratedForm
        {...generatedFormProps}
        redirectTo={redirectTo}
        redirectOnClient={redirectOnClient}
      />
    );
  }
}

Form.defaultProps = {
  onSuccess: null,
  redirectTo: null,
};

Form.propTypes = {
  currentPathname: PropTypes.string.isRequired,
  mutation: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  redirectTo: PropTypes.string,
};

export default connect(
  (state) => ({
    currentPathname: state.router.location.pathname || '/',
  }),
  (dispatch) => ({
    pushAction: (pathname) => dispatch(push(pathname)),
  }),
)(Form);
