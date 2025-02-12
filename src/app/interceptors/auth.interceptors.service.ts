import { HttpInterceptorFn } from '@angular/common/http';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'DAdHr3nBFT@hR3QdRK!XwAgA*M!mBB7Qso2J^4dHAN0tAIZg7A';
const SALT_SIZE = 16;
const IV_SIZE = 16;
const ITERATION_COUNT = 65536;
const KEY_SIZE = 256;
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const BASE32_MASK = 31;
const BASE32_SHIFT = 5;
const PADDING_CHAR = '=';

// Interceptor
export const encryptionInterceptor: HttpInterceptorFn = (req, next) => {

  getUrlDomain(req.url);
  const token = getJwtToken();
  const kuttyChatan = token ? getKuttyChatanFromToken(token) : null;
  const encryptedUrl =
   (req.body instanceof FormData) || !kuttyChatan || kuttyChatan === '-10000000000' ? req.url : getUrlDomain(req.url) + encrypt(getRemain(req.url), kuttyChatan);

      
  //  !kuttyChatan || kuttyChatan === '-1'

  //  || !(req.body instanceof FormData)
  return next(
    req.method === 'POST'
      ? handlePostRequest(req, encryptedUrl, token)
      : handleGetRequest(req, encryptedUrl, token)
  );
};

// Request Handlers
const handleGetRequest = (
  req: HttpRequest<any>,
  url: string,
  token: string
): HttpRequest<any> =>
  req.clone({
    url,
    params: new HttpParams(),
    headers: setHeaders(req.headers, token),
  });
const handlePostRequest = (
  req: HttpRequest<any>,
  url: string,
  token: string
): HttpRequest<any> =>
  req.clone({
    url,
    body:
      req.body instanceof FormData
        ? req.body
        : encrypt(JSON.stringify(req.body), SECRET_KEY),
    headers: req.body instanceof FormData ? setHeadersForm(req.headers, token) : setHeaders(req.headers, token),
  });
const getUrlDomain = (url: string): string =>
  url.split('/').slice(0, 4).join('/') + '/';


const getRemain = (url: string): string => url.split('/').slice(4).join('/');

// Helper Functions
const setHeaders = (headers: HttpRequest<any>['headers'], token: string) =>
  headers
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'text/plain')
    .set('encryption', 'true');
  const setHeadersForm = (headers: HttpRequest<any>['headers'], token: string) =>
      headers
        .set('Authorization', `Bearer ${token}`)
        .set('encryption', 'true');
const getKuttyChatanFromToken = (token: string): string | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]))?.kuttyChatan || null;
  } catch (error) {
    console.error('Failed to extract kuttyChatan from JWT token:', error);
    return null;
  }
};

// Function to encrypt data
// Function to encrypt data
const encrypt = (data: string, sec: string): string => {
  const salt = CryptoJS.lib.WordArray.random(SALT_SIZE);
  const iv = CryptoJS.lib.WordArray.random(IV_SIZE);

  const key = CryptoJS.PBKDF2(sec, salt, {
    keySize: KEY_SIZE / 32,
    iterations: ITERATION_COUNT,
  });

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  const combinedData = CryptoJS.lib.WordArray.create()
    .concat(salt)
    .concat(iv)
    .concat(encrypted.ciphertext);

  // Use Base32 encoding instead of Base64
  return toBase32(combinedData);
};

// Decrypt function to test with the encrypted data
const fromBase32 = (base32Str: string): CryptoJS.lib.WordArray => {
  base32Str = base32Str.replace(/=+$/, ''); // Remove padding
  let bits = 0;
  let value = 0;
  let index = 0;
  const words: number[] = [];

  // Process each character
  for (let i = 0; i < base32Str.length; i++) {
    const char = base32Str[i];
    const charValue = BASE32_ALPHABET.indexOf(char);
    if (charValue === -1) continue;

    value = (value << BASE32_SHIFT) | charValue;
    bits += BASE32_SHIFT;

    if (bits >= 32) {
      words[index++] = value >>> (bits - 32);
      bits -= 32;
      value &= (1 << bits) - 1;
    }
  }

  // Handle remaining bits
  if (bits > 0) {
    words[index++] = value << (32 - bits);
  }

  return CryptoJS.lib.WordArray.create(words);
};

const decrypt = (encryptedData: string): string => {
  try {
    const combinedData = fromBase32(encryptedData);

    const salt = CryptoJS.lib.WordArray.create(
      combinedData.words.slice(0, SALT_SIZE / 4)
    );
    const iv = CryptoJS.lib.WordArray.create(
      combinedData.words.slice(SALT_SIZE / 4, (SALT_SIZE + IV_SIZE) / 4)
    );
    const ciphertext = CryptoJS.lib.WordArray.create(
      combinedData.words.slice((SALT_SIZE + IV_SIZE) / 4)
    );

    const key = CryptoJS.PBKDF2(SECRET_KEY, salt, {
      keySize: KEY_SIZE / 32,
      iterations: ITERATION_COUNT,
    });

    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    return CryptoJS.enc.Utf8.stringify(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return 'Decryption Error';
  }
};
// Base32 encoding function
const toBase32 = (wordArray: CryptoJS.lib.WordArray): string => {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  let base32Str = '';

  let bits = 0;
  let value = 0;

  // Process each byte
  for (let i = 0; i < sigBytes; i++) {
    const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= BASE32_SHIFT) {
      bits -= BASE32_SHIFT;
      base32Str += BASE32_ALPHABET[(value >>> bits) & BASE32_MASK];
    }
  }

  // Handle remaining bits
  if (bits > 0) {
    base32Str +=
      BASE32_ALPHABET[(value << (BASE32_SHIFT - bits)) & BASE32_MASK];
  }

  // Add padding
  while (base32Str.length % 8 !== 0) {
    base32Str += PADDING_CHAR;
  }

  return base32Str;
};
function getJwtToken(): any {
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem('JWT_TOKEN');
  }
}
