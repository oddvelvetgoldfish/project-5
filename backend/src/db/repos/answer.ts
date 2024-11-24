import { AnswerRepository, Answer } from '../interfaces';
import { db } from '../mongodb';
import { ObjectId } from 'mongodb';

export class MongoDBAnswerRepository implements AnswerRepository {
  private get collection() {
    if (!db) {
      throw new Error('Database not initialized. Did you call initializeDB?');
    }
    return db.collection('answers');
  }

  async createAnswer(
    content: string,
    userId: string,
    questionId: string,
    createdAt: string
  ): Promise<void> {
    await this.collection.insertOne({
      content,
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
      createdAt,
    });
  }

  async getAnswersByQuestion(questionId: string): Promise<Answer[]> {
    const answers = await this.collection
      .find({ questionId: new ObjectId(questionId) })
      .sort({ createdAt: -1 })
      .toArray();

    return answers.map((answer) => ({
      id: answer._id.toString(),
      content: answer.content,
      userId: answer.userId.toString(),
      questionId: answer.questionId.toString(),
      createdAt: answer.createdAt,
    }));
  }
}
