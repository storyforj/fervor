import * as security from './utils/security';
import expireOldJWTs from './middleware/expireOldJWTs';
import performQuery from './graphql/performQuery';
import logger from '../shared/utils/logger';

module.exports = {
  security,
  middleware: {
    expireOldJWTs,
  },
  performQuery,
  logger,
};
