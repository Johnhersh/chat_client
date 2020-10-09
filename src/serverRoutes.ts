import axios from "axios";
import * as t from "io-ts";
// import { isRight } from 'fp-ts/lib/Either';
import { isRight } from 'fp-ts/lib/Either';
// import { pipe } from 'fp-ts/lib/pipeable'
import { PathReporter } from 'io-ts/lib/PathReporter';

const apiUrl = process.env.REACT_APP_SERVER_LOCATION;
// export type dbMessage = { id: number; chat_message: string; from_user: string; time: string };

const dbMessageValidType = t.interface({
  id: t.number,
  chat_message: t.string,
  from_user: t.string,
  time: t.string
})
export type dbMessage = t.TypeOf<typeof dbMessageValidType>;

const loginValidatedType = t.boolean;
type loginResult = t.TypeOf<typeof loginValidatedType>;

export async function getMessageLog() {
  const response = await axios.get(`${apiUrl}/getMessageLog`);

  return response.data;
}

export async function logIn(newUserName: string): Promise<loginResult> {
  const response = await axios.post(`${apiUrl}/login`, { newUser: newUserName });
  const result = loginValidatedType.decode(response.data);

  if (isRight(result)) {
    return Promise.resolve(response.data);
  } else {
      console.log(PathReporter.report(result));
      return Promise.reject(response.data);
    }

  // return response.data;
}

export async function getActiveUsers() {
  const response = await axios.get(`${apiUrl}/getActiveUsersList`);

  return response.data;
}
