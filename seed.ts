import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedData = {
  products: [
    { name: 'Pure Honey', name_en: 'Pure Honey', price: 500, category: 'Food', image: '', rating: 5, createdAt: serverTimestamp() },
    { name: 'Organic Turmeric', name_en: 'Organic Turmeric', price: 200, category: 'Spice', image: '', rating: 4, createdAt: serverTimestamp() },
  ],
  categories: [
    { name: 'Food', type: 'product', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { name: 'Spice', type: 'product', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
  ],
  blogs: [
    { title: 'Benefits of Honey', content: 'Honey is great for health...', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
  ]
};

async function seedDatabase() {
  console.log("Seeding database...");
  for (const [collectionName, items] of Object.entries(seedData)) {
    const colRef = collection(db, collectionName);
    for (const item of items) {
      await addDoc(colRef, item);
      console.log(`Added to ${collectionName}`);
    }
  }
  console.log("Seeding finished.");
  process.exit(0);
}

seedDatabase().catch(console.error);
