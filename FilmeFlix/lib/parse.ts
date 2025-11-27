const APP_ID = "ha8qd3C5W7jjbOdzktxvcYeH0sosRMgNDJX5N49e";
const JS_KEY = "1jVzP10vO724fUOj1kWbYVX2BVStENxiEcPwCRqi";
const BASE = "https://parseapi.back4app.com";

// Interface genérica do retorno do Parse
interface ParseResponse {
  results?: any[];
  objectId?: string;
  [key: string]: any;
}

// GET
export async function parseGet(path: string): Promise<ParseResponse> {
  const res = await fetch(`${BASE}/${path}`, {
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-JavaScript-Key": JS_KEY,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

// POST
export async function parsePost(path: string, body: any): Promise<ParseResponse> {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-JavaScript-Key": JS_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

// PUT
export async function parsePut(path: string, body: any): Promise<ParseResponse> {
  const res = await fetch(`${BASE}/${path}`, {
    method: "PUT",
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-JavaScript-Key": JS_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

// DELETE
export async function parseDelete(path: string): Promise<ParseResponse> {
  const res = await fetch(`${BASE}/${path}`, {
    method: "DELETE",
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-JavaScript-Key": JS_KEY,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
