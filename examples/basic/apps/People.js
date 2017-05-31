import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'react-relay';
import RouteContainer from '../../../lib/client/components/RouteContainer';

const People = (props) => (
    <ul>
        { props.allPeople.nodes.map((person) => (
            <li key={person.nodeId}>
                <a href={`/profile/${person.nodeId}`}>
                    { `${person.firstName} ${person.lastName}` }
                </a>
            </li>
        ))}
    </ul>
);
People.propTypes = {
    allPeople: PropTypes.object.isRequired,
};

export const peopleQuery = graphql`
    query PeopleQuery {
        allPeople {
            nodes {
                nodeId
                firstName
                lastName
            }
        }
    }
`;

export const PeopleApp = () => (
    <RouteContainer
        Component={People}
        rootQuery={peopleQuery}
        variables={{}}
    />
);
