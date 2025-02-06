import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'DAdHr3nBFT@hR3QdRK!XwAgA*M!mBB7Qso2J^4dHAN0tAIZg7A';
const SALT_SIZE = 16;
const IV_SIZE = 16;
const ITERATION_COUNT = 65536;
const KEY_SIZE = 256;

export const encryptionInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  if (req.method === 'GET') {
    return next(handleGetRequest(req, next));
  } else if (req.method === 'POST') {
    return next(handlePostRequest(req, next));
  }
  return next(req);
};

const handleGetRequest = (req: HttpRequest<any>, next: HttpHandlerFn): HttpRequest<any> => {
  let newParams = new HttpParams();
  
  req.params.keys().forEach((key) => {
    const value = req.params.get(key);
    if (value) {
      newParams = newParams.set(key, encrypt(value));
    }
  });

  return req.clone({ params: newParams });
};

const handlePostRequest = (req: HttpRequest<any>, next: HttpHandlerFn): HttpRequest<any> => {
  if (req.body) {
    const encryptedBody = encrypt(JSON.stringify(req.body));
    return req.clone({ body: encryptedBody });
  }
  return req;
};

const encrypt = (data: string): string => {
  const salt = CryptoJS.lib.WordArray.random(SALT_SIZE);
  const iv = CryptoJS.lib.WordArray.random(IV_SIZE);

  const key = CryptoJS.PBKDF2(SECRET_KEY, salt, {
    keySize: KEY_SIZE / 32,
    iterations: ITERATION_COUNT
  });

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  const combinedData = CryptoJS.lib.WordArray.create()
    .concat(salt)
    .concat(iv)
    .concat(encrypted.ciphertext);

  return CryptoJS.enc.Base64.stringify(combinedData);
};

// export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//   const authService = inject(AuthServices);
//   const authToken = authService.getAuthToken();

//   const authReq = req.clone({
//     setHeaders: {
//       Authorization: `Bearer ${authToken}`
//     }
//   });
// console.log(authReq,'authReq');

//   return next(authReq);
// };