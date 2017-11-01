import PropTypes from 'prop-types';
import React from 'react';

class Bundle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      module: null,
    };
  }

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({
      module: null,
    });
    props.load((module) => {
      this.setState({
        // handle both es imports and cjs
        module: module.default ? module.default : module,
      });
    });
  }

  render() {
    if (this.props.initialPath === location.pathname) {
      return this.props.children(this.props.startingComponent);
    }
    return this.state.module ? this.props.children(this.state.module) : null;
  }
}

Bundle.propTypes = {
  children: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
  initialPath: PropTypes.string.isRequired,
  startingComponent: PropTypes.func.isRequired,
};

export default Bundle;
