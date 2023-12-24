import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

process.env.NODE_ENV = 'test';

chai.use(sinonChai);
const { expect } = chai;

export { expect, sinon };
