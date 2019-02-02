import PropTypes from 'prop-types';
import React from 'react';

class Bundle extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    componentLoader: PropTypes.func.isRequired,
    StatusComponents: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      Component: null,
      loaderError: null,
    };
  }

  componentWillMount() {
    this.props.componentLoader().then((...args) => {
      const module = args[0];
      if (!module) {
        return Promise.reject(new Error('Component Failed to Load', args));
      }
      this.setState({
        Component: module.default ? module.default : module,
      });

      return null;
    }).catch((e) => {
      this.setState({
        Component: this.props.StatusComponents.e500.default || this.props.StatusComponents.e500,
        loaderError: e,
      });
    });
  }

  render() {
    return this.state.Component ? this.props.children(this.state.Component, this.state.loaderError) : null;
  }
}

export default Bundle;
