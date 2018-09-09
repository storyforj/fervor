import Counter from './apps/Counter';
import Hello from './apps/Hello';
import Test from './apps/Test';

export default {
  '/': Hello,
  '/counter': Counter,
  '/test': Test,
};
