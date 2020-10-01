import { dbMessage } from "../serverRoutes";

export async function getMessageLog() {
  const message1: dbMessage = {
    id: 1,
    chat_message: "Test message 1",
    from_user: "admin1",
    time: "now",
  };
  const message2: dbMessage = {
    id: 2,
    chat_message: "Test message 2",
    from_user: "admin2",
    time: "now",
  };
  return Promise.resolve([message1, message2]);
}

export async function logIn(newUserName: string) {
  if (newUserName === "nameAvailable") return Promise.resolve(true);
  if (newUserName === "nameUnAvailable") return Promise.resolve(false);

  return Promise.resolve(false);
}

export async function getActiveUsers() {
  return Promise.resolve();
}
