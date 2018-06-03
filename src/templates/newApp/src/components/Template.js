import { Meta, React, PropTypes } from 'fervor/lib';
import styles from './styles/template.scss';

const Template = ({ children, title }) => (
  <React.Fragment>
    <Meta>
      <title>{title}</title>
      <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />,
    </Meta>
    <div className={styles.demoapp}>
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />
      <header>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div>
        {children}
      </div>
    </div>
  </React.Fragment>
);

Template.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default Template;
