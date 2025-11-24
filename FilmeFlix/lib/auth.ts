import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_ID = "tgmoXRZm7PM2WHAdMuIFMT1tG2nxMibXqJxhyB5j";
const REST_KEY = "mAcYVexyu2Y7vj1mI758Zp6IUkQoYOYumPcd0Akk";
const SERVER_URL = "https://parseapi.back4app.com";

async function parseRequest(endpoint: string, method = "GET", body?: any) {
  const res = await fetch(`${SERVER_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-REST-API-Key": REST_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Erro de comunicação com o servidor");
  }

  return json;
}

export async function login(username: string, password: string) {
  const data = await parseRequest(
    `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );

  await AsyncStorage.setItem("sessionUser", JSON.stringify(data));

  return data;
}

export async function register(username: string, password: string) {
  const data = await parseRequest("/users", "POST", {
    username,
    password,
  });

  await AsyncStorage.setItem("sessionUser", JSON.stringify(data));

  return data;
}

export async function logout() {
  await AsyncStorage.removeItem("sessionUser");
}

export async function getCurrentUser() {
  const stored = await AsyncStorage.getItem("sessionUser");
  return stored ? JSON.parse(stored) : null;
}
