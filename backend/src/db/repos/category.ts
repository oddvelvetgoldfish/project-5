import { CategoryRepository, Category } from '../interfaces';
import { db } from '../mongodb';
import { ObjectId } from 'mongodb';

export class MongoDBCategoryRepository implements CategoryRepository {
  private get collection() {
    if (!db) {
      throw new Error('Database not initialized. Did you call initializeDB?');
    }
    return db.collection('categories');
  }

  // Fetch all categories
  async getAllCategories(): Promise<Category[]> {
    const categories = await this.collection.find().toArray();
    return categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
    }));
  }

  // Find a specific category by its ID
  async findCategoryById(categoryId: string): Promise<Category | null> {
    const category = await this.collection.findOne({
      _id: new ObjectId(categoryId),
    });
    return category
      ? { id: category._id.toString(), name: category.name }
      : null;
  }
}
