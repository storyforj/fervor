import React from 'react';
import { Helmet as Meta } from 'react-helmet';
import styles from './hello.scss';

import './simple.css';

export default () => (
  <React.Fragment>
    <Meta>
      <title>Testing</title>
    </Meta>
    <div className={styles.component}>Hello World</div>
  </React.Fragment>
);
