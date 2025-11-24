const APP_ID = "ZRaPhbDGJ3m9yA78aqtVGshARrISzBic1YovWuPM";
const REST_KEY = "mAcYVexyu2Y7vj1mI758Zp6IUkQoYOYumPcd0Akk";

const BASE = "https://parseapi.back4app.com";

export async function parseGet(path: string) {
  const res = await fetch(`${BASE}/${path}`, {
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-REST-API-Key": REST_KEY,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

export async function parsePost(path: string, body: any) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-REST-API-Key": REST_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function parsePut(path: string, body: any) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "PUT",
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-REST-API-Key": REST_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json();
}
