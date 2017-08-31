/* eslint-disable import/no-extraneous-dependencies, import/first */
import fetch from 'jest-fetch-mock';
import 'react-dom';
import { configure } from 'enzyme';
import Adapter from './helpers/react16adapter';

configure({ adapter: new Adapter() });

global.fetch = fetch;
