import { Document, React, PropTypes } from 'fervor/lib';
import styles from './styles/template.scss';

const Template = ({ children, title }) => (
  <Document title={title}>
    <div className={styles.demoapp}>
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />
      <header>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div>
        {children}
      </div>
    </div>
  </Document>
);

Template.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default Template;
