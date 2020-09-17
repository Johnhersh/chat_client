import axios from "axios";

const apiUrl = "http://localhost:3001";
export type dbMessage = { id: number; chat_message: string; from_user: string; time: string };

export async function getMessageLog() {
  const response = await axios.get(`${apiUrl}/getMessageLog`);

  return response.data;
}

export async function logIn(newUserName: string) {
  const response = await axios.post(`${apiUrl}/login`, { newUser: newUserName });

  return response.data;
}
