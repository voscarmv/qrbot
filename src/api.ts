import 'dotenv/config';
import { FunctionMessageStore } from '@voscarmv/aichatbot';
import axios from 'axios';

if (!process.env.MESSAGESTORE_URL) {
    throw new Error("MESSAGESTORE_URL is not defined");
}
const url = process.env.MESSAGESTORE_URL;

async function readUserMessages(user_id: string): Promise<string[]> {
    return (await axios.get<string[]>(`${url}/messages/${user_id}`)).data;
}

async function unqueueUserMessages(user_id: string): Promise<string[]> {
    return (await axios.put<string[]>(`${url}/messages/${user_id}/unqueue`)).data;
}

async function insertMessages(user_id: string, queued: boolean, msgs: string[]): Promise<string[]> {
    return (await axios.post<string[]>( `${url}/messages`, {user_id, queued, msgs})).data;
}

async function queuedMessages(user_id: string): Promise<string[]> {
    return (await axios.get<string[]>(`${url}/messages/${user_id}/queued`)).data;
}

export const messageStore = new FunctionMessageStore({
    readUserMessages,
    unqueueUserMessages,
    insertMessages,
    queuedMessages
});