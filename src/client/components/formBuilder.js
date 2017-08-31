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

    handleSubmit(e) {
      e.preventDefault();
      this.props.mutate({
        variables: formToObj.toObj(new FormData(e.target)),
        refetchQueries: this.props.refetchQueries,
      });
      this.onSubmit(e);
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
          <input type="hidden" name="query" defaultValue={mutation} />
        </form>
      );
    }
  }

  // get everything after the host name, at minimum a "/"
  Form.defaultProps = {
    redirectTo: document.location.href.split(document.location.host)[1],
    refetchQueries: [],
  };

  Form.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    redirectTo: PropTypes.string,
    // mutate gets passed in from the graphql function, from apollo
    mutate: PropTypes.func.isRequired,
    refetchQueries: PropTypes.array,
  };

  return graphql(mutation)(Form);
};
