import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'react-apollo';
import formToObj from 'form-data-to-object';

export default (mutation) => {
  class Form extends React.PureComponent {

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

    handleSubmit(e) {
      e.preventDefault();
      this.props.mutate({
        variables: formToObj.toObj(
          this.serializeForm(e.target),
        ),
        refetchQueries: this.props.refetchQueries,
      })
      .then((res) => {
        if (this.props.redirectOnClient) {
          const data = res.data; // eslint-disable-line
          // This eval is fairly safe, it is always data the server "sanitizes"
          const redirectPath = eval('`' + this.props.redirectTo + '`'); // eslint-disable-line
          this.props.pushAction(redirectPath);
        }

        this.props.onSuccess(res);
      })
      .catch((res) => {
        this.props.onFailure(res);
      });
      this.props.onSubmit(e);
    }

    render() {
      const formProps = { ...this.props };
      delete formProps.children;
      delete formProps.mutate;
      delete formProps.mutation;
      delete formProps.onFailure;
      delete formProps.onSuccess;
      delete formProps.pushAction;
      delete formProps.refetchQueries;
      delete formProps.redirectTo;
      delete formProps.redirectOnClient;

      return (
        <form method="POST" action="/form-post" {...formProps} onSubmit={this.handleSubmit}>
          {this.props.children}
          <input type="hidden" name="redirectTo" defaultValue={this.props.redirectTo} />
          <input type="hidden" name="query" defaultValue={mutation.query} />
        </form>
      );
    }
  }

  // get everything after the host name, at minimum a "/"
  Form.defaultProps = {
    mutate: () => {},
    onFailure: () => {},
    onSubmit: () => {},
    onSuccess: () => {},
    refetchQueries: [],
  };

  Form.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    onFailure: PropTypes.func,
    onSubmit: PropTypes.func,
    onSuccess: PropTypes.func,
    pushAction: PropTypes.func.isRequired,
    redirectTo: PropTypes.string.isRequired,
    redirectOnClient: PropTypes.bool.isRequired,
    // mutate gets passed in from the graphql function, from apollo
    mutate: PropTypes.func,
    refetchQueries: PropTypes.array,
  };

  return graphql(mutation)(Form);
};
