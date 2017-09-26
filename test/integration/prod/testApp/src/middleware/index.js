import pizza from './pizza';

export default ({ app }) => {
  app.use(pizza());
};
