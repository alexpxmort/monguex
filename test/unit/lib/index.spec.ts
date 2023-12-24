import { expect, sinon } from '@test/helper';
import mongoose from 'mongoose';
import { monguex } from 'src';

describe('Monguex', () => {
  let connectStub: sinon.SinonStub<
    [uri: string, options?: mongoose.ConnectOptions | undefined],
    Promise<typeof mongoose>
  >;
  let disconnectStub: sinon.SinonStub<any>;
  let schemaStub: sinon.SinonStub<any>;
  let modelStub: sinon.SinonStub<any>;

  before(() => {
    const fakeSchema = {
      add: sinon.stub().returnsThis() // Retorna o próprio objeto fakeSchema
    };

    const TestModel = mongoose.model('TestModel', {});

    connectStub = sinon.stub(mongoose, 'connect');
    disconnectStub = sinon.stub(mongoose, 'disconnect');

    schemaStub = sinon.stub(mongoose, 'Schema').returns(fakeSchema);
    modelStub = sinon.stub(mongoose, 'model').returns(TestModel);
  });

  after(() => {
    connectStub.restore();
    disconnectStub.restore();

    schemaStub.restore();
    modelStub.restore();
  });
  describe('connect', () => {
    it('should connect to mongo database', async () => {
      await monguex.connect('DB_URL');

      expect(monguex.isConnected()).to.be.true;
      expect(connectStub.calledOnce).to.be.true;
      expect(connectStub.calledWith('DB_URL')).to.be.true;
    });
  });

  describe('disconnect', () => {
    it('should disconnect from the  database', async () => {
      await monguex.disconnect();

      expect(monguex.isConnected()).to.be.false;
      expect(disconnectStub.calledOnce).to.be.true;
    });
  });

  describe('createSchema', () => {
    it('should create new schema', async () => {
      const userProps = {
        name: String,
        email: String
      };

      await monguex.createSchema('User', userProps, { timestamps: true });

      expect(schemaStub.calledOnce).to.be.true;
      expect(modelStub.calledOnce).to.be.true;
    });
  });

  describe('save', () => {
    it('should save data in the mongoose model', async () => {
      const userProps = {
        name: String,
        email: String
      };

      const userModel = await monguex.createSchema('User', userProps, { timestamps: true });

      const result = await monguex.save(userModel, {
        name: 'John doe',
        email: 'doe@test.com'
      });

      expect(result).to.be.true;
    });
  });

  describe('findFirst', () => {
    it('should find a document accoding a condition provided', async () => {
      const cond = {
        email: 'doe@test.com'
      };
      const expectedResult = {
        email: cond.email,
        name: 'John doe',
        _id: 'id'
      };
      const userModel = {
        findOne: sinon.stub().returns({
          exec: sinon.stub().resolves(expectedResult)
        })
      };

      const result = await monguex.findFirst(cond, userModel);
      expect(result).to.deep.equal(expectedResult);
      expect(userModel.findOne.calledOnce).to.be.true;
      expect(userModel.findOne.calledWithExactly(cond)).to.be.true;
    });
  });
});
