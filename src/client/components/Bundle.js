import PropTypes from 'prop-types';
import React from 'react';

class Bundle extends React.PureComponent {
  static defaultProps = {
    path: null,
  };
  static propTypes = {
    children: PropTypes.func.isRequired,
    componentLoader: PropTypes.func.isRequired,
    StatusComponents: PropTypes.object.isRequired,
    componentCache: PropTypes.object.isRequired,
    path: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      Component: this.props.componentCache[this.props.path] || null,
      loaded: !!this.props.componentCache[this.props.path],
      loaderError: null,
    };
  }

  componentWillMount() {
    if (this.state.Component) { return; }

    this.setState({ loaded: false });

    window.setTimeout(() => {
      if (!this.state.loaded) {
        this.setState({
          Component: this.props.StatusComponents.loading.default || this.props.StatusComponents.loading,
        });
      }
    }, 200);
    this.props.componentLoader().then((...args) => {
      const module = args[0];
      if (!module) {
        return Promise.reject(new Error('Component Failed to Load', args));
      }
      this.props.componentCache[this.props.path] = module.default ? module.default : module;
      this.setState({
        Component: module.default ? module.default : module,
        loaded: true,
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
