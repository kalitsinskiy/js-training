import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer | undefined;

export async function startInMemoryMongo(): Promise<string> {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongo.getUri();

  return mongo.getUri();
}

export async function stopInMemoryMongo(): Promise<void> {
  await mongo?.stop();
}
