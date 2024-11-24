import { UserRepository, User } from '../interfaces';
import { db } from '../mongodb';
import { ObjectId } from 'mongodb';

export class MongoDBUserRepository implements UserRepository {
  private get collection() {
    if (!db) {
      throw new Error('Database not initialized.');
    }
    return db.collection('users');
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.collection.findOne({ _id: new ObjectId(userId) });
    return user
      ? {
          id: user._id.toString(),
          username: user.username,
          password: user.password,
        }
      : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.collection.findOne({ username });
    return user
      ? {
          id: user._id.toString(),
          username: user.username,
          password: user.password,
        }
      : null;
  }

  async createUser(username: string, password: string): Promise<void> {
    await this.collection.insertOne({ username, password });
  }
}
