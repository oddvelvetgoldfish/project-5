import { QuestionRepository, Question } from '../interfaces';
import { db } from '../mongodb';
import { ObjectId } from 'mongodb';

export class MongoDBQuestionRepository implements QuestionRepository {
  private get collection() {
    if (!db) {
      throw new Error('Database not initialized. Did you call initializeDB?');
    }
    return db.collection('questions');
  }

  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    const questions = await this.collection
      .find({ categoryId: new ObjectId(categoryId) })
      .sort({ createdAt: -1 })
      .toArray();

    return questions.map((question) => ({
      id: question._id.toString(),
      content: question.content,
      userId: question.userId.toString(),
      categoryId: question.categoryId.toString(),
      createdAt: question.createdAt,
    }));
  }

  async createQuestion(
    content: string,
    userId: string,
    categoryId: string,
    createdAt: string
  ): Promise<void> {
    await this.collection.insertOne({
      content,
      userId: new ObjectId(userId),
      categoryId: new ObjectId(categoryId),
      createdAt,
    });
  }

  async getQuestionDetails(questionId: string): Promise<Question | null> {
    const question = await this.collection.findOne({
      _id: new ObjectId(questionId),
    });
    return question
      ? {
          id: question._id.toString(),
          content: question.content,
          userId: question.userId.toString(),
          categoryId: question.categoryId.toString(),
          createdAt: question.createdAt,
        }
      : null;
  }
}
