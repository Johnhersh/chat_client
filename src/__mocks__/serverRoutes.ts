export async function getMessageLog() {
  return Promise.resolve();
}

export async function logIn(newUserName: string) {
  if (newUserName === "nameAvailable") return Promise.resolve(true);
  if (newUserName === "nameUnAvailable") return Promise.resolve(false);

  return Promise.resolve(false);
}

export async function getActiveUsers() {
  return Promise.resolve();
}
