import axios from 'axios';
import { MONGODB_URL, MONGODB_API_KEY, DATABASE_NAME, COLLECTION_NAME, CLUSTER_NAME } from "@env";


export const saveConversationToDB = async (userId, message, sender, count) => {
  try {
    // TODO: Remove
    // console.log('Saving conversation to MongoDB...')
    const timestamp = new Date().toISOString();
    const payload = {
      collection: COLLECTION_NAME,
      database: DATABASE_NAME,
      dataSource: CLUSTER_NAME,
      document: {
        "userId": userId,
        "content": message,
        "role": sender,
        "timestamp": timestamp
      }
    };

    await axios.post(
      `${MONGODB_URL}/insertOne`,
        payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': MONGODB_API_KEY,
        },
      }
    );
  } catch (error) {
    console.error('Error saving conversation to MongoDB:', error);
  }
};
