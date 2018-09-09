import gql from 'graphql-tag';
import React from 'react';

import styles from './hello.scss';
import Form from '../../../../../../lib/client/components/Form';

export default () => {
  const query = gql`mutation IncrementCounter {
    incrementCounter @client {
      counter @client {
        value
      }
    }
  }`;
  return (
    <div className={styles.component}>
      <span>Hello World</span>
      <Form mutation={query}>
        <input type="text" defaultValue="test" />
      </Form>
    </div>
  );
};
