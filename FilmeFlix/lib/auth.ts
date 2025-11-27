import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_ID = "ha8qd3C5W7jjbOdzktxvcYeH0sosRMgNDJX5N49e";
const JS_KEY = "1jVzP10vO724fUOj1kWbYVX2BVStENxiEcPwCRqi"; // JavaScript Key
const SERVER_URL = "https://parseapi.back4app.com";

// -----------------------------------------------------------
// 1. FUNÇÕES AUXILIARES DE SESSÃO
// -----------------------------------------------------------
async function getSessionToken(): Promise<string | null> {
  const stored = await AsyncStorage.getItem("sessionUser");
  if (stored) {
    const data = JSON.parse(stored);
    return data.sessionToken || null;
  }
  return null;
}

export async function logout() {
  try {
    await parseRequest("/logout", "POST");
  } catch (e) {
    /* ignora */
  }
  await AsyncStorage.removeItem("sessionUser");
}

// -----------------------------------------------------------
// 2. REQUISIÇÃO PADRÃO PARA A API PARSE
// -----------------------------------------------------------
async function parseRequest(endpoint: string, method = "GET", body?: any) {
  const sessionToken = await getSessionToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Parse-Application-Id": APP_ID,
    "X-Parse-JavaScript-Key": JS_KEY,   // << CORREÇÃO AQUI
  };

  if (sessionToken) {
    headers["X-Parse-Session-Token"] = sessionToken;
  }

  const res = await fetch(`${SERVER_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("Parse API Error:", json);
    throw new Error(json.error || "Erro de comunicação com o servidor");
  }

  return json;
}

// -----------------------------------------------------------
// 3. LOGIN / CADASTRO / USUÁRIO ATUAL
// -----------------------------------------------------------
export async function login(username: string, password: string) {
  const data = await parseRequest(
    `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );

  await AsyncStorage.setItem("sessionUser", JSON.stringify(data));
  return data;
}

export async function register(username: string, password: string) {
  const data = await parseRequest("/users", "POST", { username, password });

  await AsyncStorage.setItem("sessionUser", JSON.stringify(data));

  return data;
}

export async function getCurrentUser() {
  const stored = await AsyncStorage.getItem("sessionUser");
  if (!stored) return null;

  try {
    const validatedUser = await parseRequest("/users/me", "GET");
    return validatedUser;
  } catch (e) {
    console.warn("Sessão inválida ou expirada. Limpando sessão local.");
    await logout();
    return null;
  }
}
