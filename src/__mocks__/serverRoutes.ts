export async function getMessageLog() {
  return Promise.resolve();
}

export async function logIn(newUserName: string) {
  console.log("In mocked server routes");
  if (newUserName === "nameAvailable") return Promise.resolve(true);
  if (newUserName === "nameUnAvailable") return Promise.resolve(false);

  return Promise.resolve(false);
}

export async function getActiveUsers() {
  return Promise.resolve();
}
