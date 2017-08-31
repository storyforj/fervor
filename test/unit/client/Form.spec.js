import gql from 'graphql-tag';
import React from 'react';
import {
    ApolloClient,
    ApolloProvider,
    createNetworkInterface,
} from 'react-apollo';
import { mount } from 'enzyme';
import initStore from '../../../src/shared/store';
import Form from '../../../src/client/components/Form';

describe('Form Component', () => {
  it('renders a form', async () => {
    const webClient = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: '/graphql',
      }),
    });
    const store = initStore({ location: { pathname: '/' }, session: {} });

    const mutation = gql`query {
      __schema {
        types {
          name
          description
        }
      }
    }`;

    const component = mount(
      <ApolloProvider client={webClient} store={store}>
        <Form mutation={mutation}>
          <div>Hello World</div>
        </Form>
      </ApolloProvider>,
    );
    expect(component.contains(<div>Hello World</div>)).toBeTruthy();
    expect(component.find('form').length).toBe(1);
  });
});
