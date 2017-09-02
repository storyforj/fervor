import { React } from 'fervor/lib';

import Template from '../components/Template';
import styles from './styles/about.scss';

export default () => (
  <Template title="[appname]">
    <article className={styles.article}>
      <p>
        You have successfully set-up your new Fervor App!!!
        Now you can start building!
      </p>
      <p>
        We are still working out our docs. In the meantime check out our <a href="https://github.com/fervorous/fervor-todo-mvc" rel="noopener noreferrer" target="_blank">example app</a>, and join our <a href="https://gitter.im/fervorous/fervor" rel="noopener noreferrer" target="_blank">gitter community</a> to find best practices. If you notices any issues or have any questions please file an issue on our <a href="https://github.com/fervorous/fervor" rel="noopener noreferrer" target="_blank">github page</a>.
      </p>
      <p>
        Links:
      </p>
      <ul>
        <li>
          <a href="https://gitter.im/fervorous/fervor" rel="noopener noreferrer" target="_blank">
            gitter.im/fervorous/fervor
          </a>
        </li>
        <li>
          <a href="https://github.com/fervorous/fervor" rel="noopener noreferrer" target="_blank">
            github.com/fervorous/fervor
          </a>
        </li>
        <li>
          <a href="https://github.com/fervorous/fervor-todo-mvc" rel="noopener noreferrer" target="_blank">
            github.com/fervorous/fervor-todo-mvc
          </a>
        </li>
      </ul>
    </article>
  </Template>
);
