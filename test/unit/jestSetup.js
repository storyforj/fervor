/* eslint-disable import/no-extraneous-dependencies, import/first */
import fetch from 'jest-fetch-mock';
import 'react-dom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.fetch = fetch;
