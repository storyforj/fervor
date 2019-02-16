import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';

import gql from '../../../src/shared/gqltag';
import initStore from '../../../src/shared/store';
import Form, { FormTest } from '../../../src/client/components/Form';

const mockResult = {
  data: {
    incrementCounter: {
      counter: {
        value: 0,
        __typename: 'Counter',
      },
      __typename: 'IncrementCounterPayload',
    },
  },
};

describe('Form Component', () => {
  let component;
  let pushAction;

  beforeEach(() => {
    const mutation = gql`mutation IncrementCounter {
      incrementCounter @client {
        counter @client {
          value
        }
      }
    }`;

    const mock = {
      request: {
        query: mutation,
        variables: {
          meow: { test: { wow: 'hellow' } },
          oh: 'world',
          cheese: { hello: 'b' },
          redirectTo: '/',
          query: mutation.query,
        },
      },
      result: mockResult,
    };

    pushAction = jest.fn();

    component = mount((
      <MockedProvider mocks={[mock]}>
        <FormTest mutation={mutation} currentPathname="/" redirectTo="/otherPage" pushAction={pushAction}>
          <div>Hello World</div>
          <input name="meow[test][wow]" defaultValue="hello" />
          <input name="oh" defaultValue="world" />
          <input name="cheese[hello]" defaultValue="a" />
          <input name="cheese[hello]" defaultValue="b" />
        </FormTest>
      </MockedProvider>
    ));
  });

  it('renders a form', () => {
    expect(component.contains(<div>Hello World</div>)).toBeTruthy();
    expect(component.find('form').length).toBe(1);
  });

  describe('on submit', () => {
    it('redirects on form submit', async () => {
      const mutate = jest.fn(() => Promise.resolve({ data: {} }));
      const formInstance = component.find('Form').instance();
      // we need stub serializeForm since it is expecting to operate on some HTML
      formInstance.serializeForm = jest.fn(() => ({}));
      await formInstance.handleSubmit(
        { preventDefault: () => {}, },
        mutate,
      );

      expect(pushAction.mock.calls.length).toBe(1);
      expect(pushAction.mock.calls[0][0]).toBe('/otherPage');
    });
  });
});

describe('Form Component, when onSuccess is defined', () => {
  let successStub;
  let completeStub;
  let component;

  beforeEach(() => {
    const store = initStore({}, [], createMemoryHistory({ initialEntries: ['/'] }));

    const mutation = gql`mutation IncrementCounter {
      incrementCounter @client {
        counter @client {
          value
        }
      }
    }`;

    completeStub = new Promise((resolve) => {
      successStub = jest.fn(() => {
        resolve();
      });
    });

    const mock = {
      request: {
        query: mutation,
        variables: {
          meow: { test: { wow: 'hello' } },
          oh: 'world',
          cheese: { hello: ['a', 'b'] },
          redirectTo: '/',
          query: mutation.query,
        },
      },
      result: mockResult,
    };

    component = mount((
      <MockedProvider mocks={[mock]}>
        <Provider store={store}>
          <Form mutation={mutation} onSuccess={successStub}>
            <div>Hello World</div>
            <input name="meow[test][wow]" defaultValue="hello" />
            <input name="oh" defaultValue="world" />
            <input name="cheese[hello]" defaultValue="a" />
            <input name="cheese[hello]" defaultValue="b" />
          </Form>
        </Provider>
      </MockedProvider>
    ));
  });

  it('triggers the onSuccess hook', async () => {
    component.find('form').simulate('submit');
    await completeStub;
    expect(successStub.mock.calls.length).toEqual(1);
  });
});

describe('Form Component, when onFailure is specified', () => {
  let failureStub;
  let completeStub;
  let component;

  beforeEach(() => {
    const store = initStore({}, [], createMemoryHistory({ initialEntries: ['/'] }));

    const mutation = gql`mutation IncrementCounter {
      incrementCounter @client {
        counter @client {
          value
        }
      }
    }`;

    completeStub = new Promise((resolve) => {
      failureStub = jest.fn(() => {
        resolve();
      });
    });

    component = mount((
      <MockedProvider mocks={[]}>
        <Provider store={store}>
          <Form mutation={mutation} onFailure={failureStub}>
            <div>Hello World</div>
            <input name="oh" defaultValue="world" />
          </Form>
        </Provider>
      </MockedProvider>
    ));
  });

  it('triggers the onFailure hook', async () => {
    component.find('form').simulate('submit');
    await completeStub;
    expect(failureStub.mock.calls.length).toEqual(1);
  });
});
