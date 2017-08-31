'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Hello = require('./apps/Hello');

var _Hello2 = _interopRequireDefault(_Hello);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  '/': _Hello2.default
};