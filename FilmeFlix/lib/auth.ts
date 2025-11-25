import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚠️ MANTENHA SUAS CHAVES AQUI
const APP_ID = "tgmoXRZm7PM2WHAdMuIFMT1tG2nxMibXqJxhyB5j";
const REST_KEY = "mAcYVexyu2Y7vj1mI758Zp6IUkQoYOYumPcd0Akk";
const SERVER_URL = "https://parseapi.back4app.com";

// -----------------------------------------------------------
// 1. FUNÇÕES AUXILIARES DE SESSÃO
// -----------------------------------------------------------

// Auxiliar para obter o token de sessão armazenado
async function getSessionToken(): Promise<string | null> {
    const stored = await AsyncStorage.getItem("sessionUser");
    if (stored) {
        const data = JSON.parse(stored);
        // O token é essencial e vem no retorno do login/cadastro
        return data.sessionToken || null;
    }
    return null;
}

export async function logout() {
    // Tenta deslogar no servidor Parse (não é estritamente necessário, mas é boa prática)
    try {
        await parseRequest("/logout", "POST");
    } catch (e) {
        // Ignora erros no logout. O objetivo principal é limpar o local.
    }
    // Remove o token de sessão localmente
    await AsyncStorage.removeItem("sessionUser");
}

// -----------------------------------------------------------
// 2. MODIFICAÇÃO ESSENCIAL NA REQUISIÇÃO
// -----------------------------------------------------------

// 🛠️ parseRequest agora inclui o cabeçalho X-Parse-Session-Token
async function parseRequest(endpoint: string, method = "GET", body?: any) {
    const sessionToken = await getSessionToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Parse-Application-Id": APP_ID,
        "X-Parse-REST-API-Key": REST_KEY,
    };
    
    // 🔑 ESSENCIAL: Adiciona o token para requisições autenticadas (como /users/me)
    if (sessionToken) {
        headers["X-Parse-Session-Token"] = sessionToken;
    }

    const res = await fetch(`${SERVER_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();
    
    // ✅ DEBUG: Loga o erro exato da API em caso de falha
    if (!res.ok) {
        console.error("Parse API Error:", json); 
        throw new Error(json.error || "Erro de comunicação com o servidor");
    }
    
    return json;
}

// -----------------------------------------------------------
// 3. FLUXOS DE AUTENTICAÇÃO
// -----------------------------------------------------------

export async function login(username: string, password: string) {
    // 💡 O Parse usa a query string com 'username' e 'password' para login.
    const data = await parseRequest(
        `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    );
    // Salva o objeto de sessão completo (inclui o sessionToken)
    await AsyncStorage.setItem("sessionUser", JSON.stringify(data));
    return data;
}

export async function register(username: string, password: string) {
    // 💡 O Parse usa o método POST com o corpo JSON para cadastro.
    const data = await parseRequest("/users", "POST", { username, password });
    // Salva o objeto de sessão completo retornado após o cadastro
    await AsyncStorage.setItem("sessionUser", JSON.stringify(data));
    return data;
}

// 🛠️ MODIFICADO: getCurrentUser agora valida a sessão no servidor Parse
export async function getCurrentUser() {
    const stored = await AsyncStorage.getItem("sessionUser");
    if (!stored) return null;

    try {
        // A requisição para /users/me usa o token de sessão 
        // (adicionado em parseRequest) para verificar se o token é válido.
        const validatedUser = await parseRequest("/users/me", "GET");
        
        // Se a requisição foi bem-sucedida, o usuário está logado
        return validatedUser; 
    } catch (e) {
        // ❌ Se houver erro 401 ou 404, o token é inválido/expirado.
        console.warn("Sessão inválida ou expirada. Limpando sessão local.");
        await logout(); 
        return null;
    }
}