import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import chaiJsx from 'chai-jsx';
import { jsdom } from 'jsdom';

// 加入支持JSX和Enzyme的断言库
chai.use(chaiEnzyme());
chai.use(chaiJsx);

// 创建enzyme中的渲染相关方法依赖的dom环境
global.document = jsdom('<!doctype html><html><head><script></script></head><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
require('matchmedia-polyfill');
