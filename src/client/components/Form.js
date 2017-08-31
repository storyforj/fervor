import PropTypes from 'prop-types';
import React from 'react';

import formBuilder from './formBuilder';

export default class Form extends React.PureComponent {

  render() {
    const GeneratedForm = formBuilder(this.props.mutation);
    return (
      <GeneratedForm {...this.props} />
    );
  }
}

Form.propTypes = {
  mutation: PropTypes.object.isRequired,
};
