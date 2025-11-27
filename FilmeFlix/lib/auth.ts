import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "./store";

const APP_ID = "ha8qd3C5W7jjbOdzktxvcYeH0sosRMgNDJX5N49e";
const JS_KEY = "1jVzP10vO724fUOj1kWbYVX2BVStENxiEcPwCRqi";
const SERVER_URL = "https://parseapi.back4app.com";

async function parseRequest(endpoint: string, method = "GET", body?: any) {
  const stored = await AsyncStorage.getItem("sessionUser");
  let sessionToken = null;
  if (stored) {
    const user = JSON.parse(stored);
    sessionToken = user.sessionToken;
  }

  const headers: any = {
    "Content-Type": "application/json",
    "X-Parse-Application-Id": APP_ID,
    "X-Parse-JavaScript-Key": JS_KEY,
  };
  if (sessionToken) headers["X-Parse-Session-Token"] = sessionToken;

  const res = await fetch(`${SERVER_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erro Parse API");

  return json;
}

export async function login(username: string, password: string) {
  const data = await parseRequest(
    `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );

  await AsyncStorage.setItem("sessionUser", JSON.stringify(data));
  useStore.getState().setUser(data);

  return data;
}

export async function register(username: string, password: string) {
  const data = await parseRequest("/users", "POST", { username, password });
  await AsyncStorage.setItem("sessionUser", JSON.stringify(data));
  useStore.getState().setUser(data);

  return data;
}

export async function getCurrentUser() {
  const stored = await AsyncStorage.getItem("sessionUser");
  if (!stored) return null;

  try {
    const user = await parseRequest("/users/me");
    useStore.getState().setUser(user);
    return user;
  } catch {
    await AsyncStorage.removeItem("sessionUser");
    useStore.getState().setUser(null);
    return null;
  }
}

export async function logout() {
  await AsyncStorage.removeItem("sessionUser");
  useStore.getState().logout();
}
