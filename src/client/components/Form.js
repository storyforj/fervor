import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Mutation } from 'react-apollo';
import formToObj from 'form-data-to-object';

import interpolate from '../../shared/utils/interpolate';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  serializeForm(form) {
    const inputs = form.querySelectorAll('input, select, checkbox, textarea');
    const result = {};

    inputs.forEach((input) => {
      const key = input.name;
      const value = input.value;
      if (result[key]) {
        if (result[key] instanceof Array) {
          result[key].push(value);
        } else {
          result[key] = [result[key]];
          result[key].push(value);
        }
      } else {
        result[key] = value;
      }
    });
    return result;
  }

  handleSubmit(e, mutate) {
    e.preventDefault();

    const redirectTo = this.props.redirectTo || this.props.currentPathname;
    const redirectOnClient = (
      !this.props.onSuccess && // there is no success function (which overrides behavior)
      this.props.currentPathname !== redirectTo // and we are not currently on the redirect page
    );

    const mutationPromise = mutate({
      variables: formToObj.toObj(
        this.serializeForm(e.target),
      ),
      refetchQueries: this.props.refetchQueries,
    })
      .then((res) => {
        if (redirectOnClient) {
          const redirectPath = interpolate(redirectTo, res.data);
          this.props.pushAction(redirectPath);
        }

        if (this.props.onSuccess) {
          this.props.onSuccess(res);
        }
      })
      .catch((res) => {
        this.props.onFailure(res);
      });
    this.props.onSubmit(e);

    return mutationPromise;
  }

  render() {
    const redirectTo = this.props.redirectTo || this.props.currentPathname;

    return (
      <Mutation mutation={this.props.mutation}>
        {(mutate) => {
          const formProps = { ...this.props };
          delete formProps.children;
          delete formProps.currentPathname;
          delete formProps.dispatch;
          delete formProps.mutation;
          delete formProps.onFailure;
          delete formProps.onSuccess;
          delete formProps.pushAction;
          delete formProps.redirectTo;
          delete formProps.refetchQueries;

          return (
            <form method="POST" action="/form-post" {...formProps} onSubmit={(e) => this.handleSubmit(e, mutate)}>
              {this.props.children}
              <input type="hidden" name="redirectTo" defaultValue={redirectTo} />
              <input type="hidden" name="query" defaultValue={this.props.mutation.query} />
            </form>
          );
        }}
      </Mutation>
    );
  }
}

Form.defaultProps = {
  onSuccess: null,
  onFailure: () => {},
  onSubmit: () => {},
  redirectTo: null,
  refetchQueries: [],
};

Form.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  currentPathname: PropTypes.string.isRequired,
  mutation: PropTypes.object.isRequired,
  onFailure: PropTypes.func,
  onSuccess: PropTypes.func,
  onSubmit: PropTypes.func,
  pushAction: PropTypes.func.isRequired,
  redirectTo: PropTypes.string,
  // mutate gets passed in from the graphql function, from apollo
  refetchQueries: PropTypes.array,
};

export const FormTest = Form;

export default connect(
  (state) => ({
    currentPathname: state.router.location.pathname || '/',
  }),
  (dispatch) => ({
    pushAction: (pathname) => dispatch(push(pathname)),
  }),
)(Form);
