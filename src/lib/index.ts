import mongoose from 'mongoose';
const isConnectedSymbol = Symbol.for('isConnected');
const urlReconnectSymbol = Symbol.for('urlReconnectSymbol');

const monguex = {
  [isConnectedSymbol]: false,
  [urlReconnectSymbol]: '',
  connect: async (url: string) => {
    try {
      await mongoose.connect(url);
      console.log('Connected to MongoDB');
      monguex[isConnectedSymbol] = true;
      monguex[urlReconnectSymbol] = url;
    } catch (error: any) {
      console.error('Error connecting to MongoDB:', error.message);
      throw error;
    }
  },
  disconnect: async () => {
    if (monguex[isConnectedSymbol]) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
      monguex[isConnectedSymbol] = false;
    }
  },
  // Método para verificar o estado da conexão
  isConnected() {
    return this[isConnectedSymbol];
  },
  createSchema: (modelName: string, props: any, otherProps?: any) => {
    const schema = new mongoose.Schema({}, { ...otherProps });

    // Adiciona as propriedades ao esquema
    for (const prop in props) {
      schema.add({ [prop]: props[prop] });
    }

    // Cria o modelo com o nome fornecido e o esquema construído
    const model = mongoose.model(modelName, schema);

    return model;
  },
  save: async (model: any, data: any) => {
    if (!monguex.isConnected()) {
      await monguex.connect(monguex[urlReconnectSymbol]);
    }
    const newModel = new model({
      ...data
    });

    try {
      await newModel.save();
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await monguex.disconnect();
    }
  },
  findFirst: async (cond: any, model: any) => {
    if (!monguex.isConnected()) {
      await monguex.connect(monguex[urlReconnectSymbol]);
    }
    try {
      return await model
        .findOne({
          ...cond
        })
        .exec();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await monguex.disconnect();
    }
  },
  update: async (id: string, fieldsToUpdate: any, model: any) => {
    if (!monguex.isConnected()) {
      await monguex.connect(monguex[urlReconnectSymbol]);
    }
    try {
      return await model
        .updateOne(
          { _id: id },
          {
            $set: { ...fieldsToUpdate }
          }
        )
        .exec();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await monguex.disconnect();
    }
  },
  updateMany: async (cond: any, fieldsToUpdate: any, model: any) => {
    if (!monguex.isConnected()) {
      await monguex.connect(monguex[urlReconnectSymbol]);
    }
    try {
      return await model
        .updateMany(
          { ...cond },
          {
            $set: { ...fieldsToUpdate }
          }
        )
        .exec();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await monguex.disconnect();
    }
  },
  delete: async (id: string, model: any) => {
    if (!monguex.isConnected()) {
      await monguex.connect(monguex[urlReconnectSymbol]);
    }
    try {
      return await model.deleteOne({ _id: id }).exec();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await monguex.disconnect();
    }
  },
  deleteMany: async (cond: any, model: any) => {
    if (!monguex.isConnected()) {
      await monguex.connect(monguex[urlReconnectSymbol]);
    }
    try {
      return await model.deleteMany({ ...cond }).exec();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await monguex.disconnect();
    }
  },
  transaction: async (): Promise<{
    abort: () => void;
    commit: () => void;
  }> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    return {
      abort: () => session.abortTransaction(),
      commit: () => session.commitTransaction()
    } as any;
  }
};
export { monguex };
