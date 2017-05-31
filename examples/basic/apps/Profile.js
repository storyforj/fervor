import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'react-relay';
import RouteContainer from '../../../lib/client/components/RouteContainer';

const Profile = (props) => (<div>Hello {props.person.firstName}</div>);
Profile.propTypes = {
    person: PropTypes.shape({
        nodeId: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
    }).isRequired,
};

export const profileQuery = graphql`
    query ProfileQuery($nodeId: ID!) {
        person(nodeId: $nodeId) {
            nodeId
            firstName
            lastName
        }
    }
`;

export const getProfileVariables = (match) => ({ nodeId: match.params.id });

export const ProfileApp = (props) => (
    <RouteContainer
        Component={Profile}
        rootQuery={profileQuery}
        variables={getProfileVariables(props.match)}
    />
);
ProfileApp.defaultProps = {
    match: {
        params: { id: '' },
    },
};
ProfileApp.propTypes = {
    match: PropTypes.object.isRequired,
};
