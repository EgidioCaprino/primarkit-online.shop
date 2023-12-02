#!/usr/bin/env node

const { backOff } = require("exponential-backoff");

const random = (length = 8) => {
  // Declare all characters
  let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  // Pick characers randomly
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

const log = (...messages) => {
  console.log(`[${new Date().toISOString()}]`, ...messages);
};

(async () => {
  while (true) {
    await backOff(
      async () => {
        const response = await fetch("https://primarkit-online.shop/homeapi/account/register", {
          "credentials": "include",
          "headers": {
            "User-Agent": "Mozilla/5.0 (Linux; Android 14; Z832 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.159/160 Mobile Safari/537.36",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.7,it;q=0.3",
            "Content-Type": "application/json;charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
          },
          "referrer": "https://primarkit-online.shop/account/register",
          "body": JSON.stringify({ "first_name": random(), "last_name": random(), "email": `${random()}@${random}.com`, "password": random(), "is_sub": 1 }),
          "method": "POST",
          "mode": "cors"
        });
        if (!response.ok) {
          throw new Error();
        }
        log('Response status:', response.status);
      },
      { numOfAttempts: Number.MAX_SAFE_INTEGER },
    );
  }
})();
