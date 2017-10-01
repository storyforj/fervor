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
  let mutateStub;
  let component;

  beforeEach(() => {
    const webClient = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: '/graphql',
      }),
    });
    const store = initStore({});

    const mutation = gql`query {
      __schema {
        types {
          name
          description
        }
      }
    }`;

    mutateStub = jest.fn();

    component = mount(
      <ApolloProvider client={webClient} store={store}>
        <Form mutation={mutation} mutate={mutateStub}>
          <div>Hello World</div>
          <input name="meow[test][wow]" defaultValue="hello" />
          <input name="oh" defaultValue="world" />
          <input name="cheese[hello]" defaultValue="a" />
          <input name="cheese[hello]" defaultValue="b" />
        </Form>
      </ApolloProvider>,
    );
  });

  it('renders a form', () => {
    expect(component.contains(<div>Hello World</div>)).toBeTruthy();
    expect(component.find('form').length).toBe(1);
  });

  describe('on submit', () => {
    beforeEach(() => {
      try {
        component.find('form').simulate('submit');
      } catch (e) {
        // remove try catch, once enzyme 3 is released
      }
    });

    it('serializes the form and submits the mutation', async () => {
      expect(mutateStub.mock.calls.length).toEqual(1);
      const formData = mutateStub.mock.calls[0][0].variables;
      expect(formData.meow.test.wow).toEqual('hello');
      expect(formData.oh).toEqual('world');
      expect(formData.cheese.hello[0]).toEqual('a');
      expect(formData.cheese.hello[1]).toEqual('b');
    });
  });
});

describe('Form Component, when onSuccess is defined', () => {
  let mutateStub;
  let successStub;
  let completeStub;
  let component;

  beforeEach(() => {
    const webClient = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: '/graphql',
      }),
    });
    const store = initStore({});

    const mutation = gql`query {
      __schema {
        types {
          name
          description
        }
      }
    }`;

    mutateStub = jest.fn(() => new Promise((resolve) => resolve()));
    completeStub = new Promise((resolve) => {
      successStub = jest.fn(() => {
        resolve();
      });
    });

    component = mount(
      <ApolloProvider client={webClient} store={store}>
        <Form mutation={mutation} mutate={mutateStub} onSuccess={successStub}>
          <div>Hello World</div>
          <input name="oh" defaultValue="world" />
        </Form>
      </ApolloProvider>,
    );
  });

  it('triggers the onSuccess hook', async () => {
    try {
      component.find('form').simulate('submit');
    } catch (e) {
      // remove try catch, once enzyme 3 is released
    }
    await completeStub;
    expect(successStub.mock.calls.length).toEqual(1);
  });
});

describe('Form Component, when onFailure is specified', () => {
  let mutateStub;
  let failureStub;
  let completeStub;
  let component;

  beforeEach(() => {
    const webClient = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: '/graphql',
      }),
    });
    const store = initStore({});

    const mutation = gql`query {
      __schema {
        types {
          name
          description
        }
      }
    }`;

    mutateStub = jest.fn(() => new Promise((resolve) => resolve()));
    completeStub = new Promise((resolve) => {
      failureStub = jest.fn(() => {
        resolve();
      });
    });

    component = mount(
      <ApolloProvider client={webClient} store={store}>
        <Form mutation={mutation} mutate={mutateStub} onFailure={failureStub}>
          <div>Hello World</div>
          <input name="oh" defaultValue="world" />
        </Form>
      </ApolloProvider>,
    );
  });

  it('triggers the onFailure hook', async () => {
    try {
      component.find('form').simulate('submit');
    } catch (e) {
      // remove try catch, once enzyme 3 is released
    }
    await completeStub;
    expect(failureStub.mock.calls.length).toEqual(1);
  });
});
