import axios from "axios";
import * as t from "io-ts";
import { isRight } from "fp-ts/lib/Either";
import { PathReporter } from "io-ts/lib/PathReporter";

const apiUrl = process.env.REACT_APP_SERVER_LOCATION;
// export type dbMessage = { id: number; chat_message: string; from_user: string; time: string };

const dbMessageValidType = t.interface({
  id: t.number,
  chat_message: t.string,
  from_user: t.string,
  time: t.string,
});
export type dbMessage = t.TypeOf<typeof dbMessageValidType>;

const loginValidatedType = t.boolean;
type loginResult = t.TypeOf<typeof loginValidatedType>;

const activeUsersListType = t.array(t.string);
type activeUserList = t.TypeOf<typeof activeUsersListType>;

export async function getMessageLog() {
  const response = await axios.get(`${apiUrl}/getMessageLog`);

  return response.data;
}

export async function logIn(newUserName: string): Promise<loginResult> {
  const response = await axios.post(`${apiUrl}/login`, { newUser: newUserName });
  const validatedResult = loginValidatedType.decode(response.data);

  if (isRight(validatedResult)) {
    return Promise.resolve(response.data);
  } else {
    console.log(PathReporter.report(validatedResult));
    return Promise.reject(response.data);
  }
}

export async function getActiveUsers(): Promise<activeUserList> {
  const response = await axios.get(`${apiUrl}/getActiveUsersList`);
  const validatedResult = activeUsersListType.decode(response.data);

  if (isRight(validatedResult)) {
    return Promise.resolve(response.data);
  } else {
    console.log(PathReporter.report(validatedResult));
    return Promise.reject(response.data);
  }
}
