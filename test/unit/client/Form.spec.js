import gql from 'graphql-tag';
import React from 'react';
import {
    ApolloClient,
    ApolloProvider,
    createNetworkInterface,
} from 'react-apollo';
import { mount } from 'enzyme';
import Form from '../../../src/client/components/Form';

describe('Form Component', () => {
  it('renders a form', async () => {
    const webClient = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: '/graphql',
      }),
    });

    const mutation = gql`query {
      __schema {
        types {
          name
          description
        }
      }
    }`;

    const component = mount(
      <ApolloProvider client={webClient}>
        <Form mutation={mutation}>
          <div>Hello World</div>
        </Form>
      </ApolloProvider>,
    );
    expect(component.contains(<div>Hello World</div>)).toBeTruthy();
    expect(component.contains(<form method="POST" action="/form-post" />)).toBeTruthy();
  });
});
