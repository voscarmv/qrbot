import { OpenAiClient } from "@voscarmv/aichatbot";
import { qrtools } from "@voscarmv/qr-aitool";
import { filetools } from "@voscarmv/files-aitool";
import { aicache } from "@voscarmv/aitoolcache";
export { aicache }
import "dotenv/config";
if (!process.env.DEEPSEEK_KEY) { throw new Error("DEEPSEEK_KEY is not defined"); }

const tools = [...filetools.tools, ...qrtools.tools];
const functions = { ...filetools.functions, ...qrtools.functions };
const additionalInstructions = async () => {
    return `The current date and time is ${new Date()}. The only available Cache Keys currently are: ${aicache.list()}`
}
export const aiClient = new OpenAiClient({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_KEY,
    model: 'deepseek-chat',
    instructions: 'You are a helpful assistant.',
    // additionalInstructions,
    tools, functions
});
