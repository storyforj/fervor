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
      });
      this.props.onSubmit(e);
    }

    render() {
      const formProps = { ...this.props };
      delete formProps.children;
      delete formProps.mutate;
      delete formProps.mutation;
      delete formProps.refetchQueries;
      delete formProps.redirectTo;

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
    onSubmit: () => {},
    refetchQueries: [],
  };

  Form.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    onSubmit: PropTypes.func,
    redirectTo: PropTypes.string.isRequired,
    // mutate gets passed in from the graphql function, from apollo
    mutate: PropTypes.func,
    refetchQueries: PropTypes.array,
  };

  return graphql(mutation)(Form);
};
