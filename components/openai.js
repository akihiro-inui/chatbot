import { Configuration, OpenAIApi } from 'openai';
import { CHATGPT_API_TOKEN } from "@env";


export const initializeOpenAI = async () => {
  try {
    const configuration = new Configuration({
      apiKey: `${CHATGPT_API_TOKEN}`,
    });
    const openai = new OpenAIApi(configuration);
    // console.log("Initializing OpenAPI connection");
    return openai;
  } catch (error) {
    // console.log('Error initializing OpenAI:', error);
    return null;
  }
};
