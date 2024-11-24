// db/mongodb.ts
import { MongoClient, Db } from 'mongodb';

const MONGO_URI =
  'mongodb+srv://admin:AEXoQLmD8LNRp1LY@cluster0.ro4hp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export let db: Db;

export const initializeDB = async () => {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db('techtalk'); // Use 'techtalk' database
  console.log('Connected to MongoDB');

  await seedCategories();
};

const seedCategories = async () => {
  const categoriesCollection = db.collection('categories');

  const initialCategories = [
    { name: 'JavaScript' },
    { name: 'React' },
    { name: 'Node.js' },
  ];

  const existingCategories = await categoriesCollection.countDocuments();
  if (existingCategories === 0) {
    await categoriesCollection.insertMany(initialCategories);
    console.log(
      'Categories seeded:',
      initialCategories.map((c) => c.name)
    );
  } else {
    console.log('Categories already exist, skipping seeding.');
  }
};
