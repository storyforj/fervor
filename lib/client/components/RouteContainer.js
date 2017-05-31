import PropTypes from 'prop-types';
import React from 'react';
import QueryLookupRenderer from 'relay-query-lookup-renderer';

export default class RouteContainer extends React.Component {
    renderComponent({ props }) {
        const Comp = this.props.Component;
        return <Comp {...props} />;
    }

    render() {
        if (!this.props.rootQuery) { return this.renderComponent({ props: {} }); }
        return (<QueryLookupRenderer
            lookup
            environment={this.context.environment}
            query={this.props.rootQuery}
            variables={this.props.variables}
            render={this.renderComponent.bind(this)}
        />);
    }
}
RouteContainer.defaultProps = {
    rootQuery: false,
};
RouteContainer.propTypes = {
    Component: PropTypes.func.isRequired,
    rootQuery: PropTypes.func,
    variables: PropTypes.object.isRequired,
};
RouteContainer.contextTypes = {
    environment: PropTypes.object.isRequired,
};
