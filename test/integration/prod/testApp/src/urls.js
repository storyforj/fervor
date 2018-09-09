import Counter from './apps/Counter';
import Hello from './apps/Hello';
import Hello2 from './apps/Hello2';
import Test from './apps/Test';

export default {
  '/': Hello,
  '/counter': Counter,
  '/hello2': Hello2,
  '/test': Test,
};
