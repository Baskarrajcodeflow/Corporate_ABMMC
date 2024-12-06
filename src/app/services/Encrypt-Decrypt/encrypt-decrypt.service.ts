import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptService {
  private static SECRET_KEY = 'DAdHr3nBFT@hR3QdRK!XwAgA*M!mBB7Qso2J^4dHAN0tAIZg7A';
  private static ITERATION_COUNT = 65536;
  private static KEY_SIZE = 256;
  private static IV_SIZE = 16;
  private static SALT_SIZE = 16;

  /**
   * Helper method to convert a string to an ArrayBuffer
   */
  private static strToArrayBuffer(str: string): ArrayBuffer {
    return new TextEncoder().encode(str).buffer;
  }

  /**
   * Helper method to convert ArrayBuffer to Base64
   */
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Helper method to convert Base64 to ArrayBuffer
   */
  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Generates a random byte array of a given size
   */
  private static getRandomBytes(size: number): Uint8Array {
    const randomBytes = new Uint8Array(size);
    window.crypto.getRandomValues(randomBytes);
    return randomBytes;
  }

  /**
   * Derives a cryptographic key using PBKDF2
   */
  private async deriveKey(salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      EncryptService.strToArrayBuffer(EncryptService.SECRET_KEY),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: EncryptService.ITERATION_COUNT,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-CBC', length: EncryptService.KEY_SIZE },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts a string
   */
  public async encrypt(strToEncrypt: string | any): Promise<string> {
    const salt = EncryptService.getRandomBytes(EncryptService.SALT_SIZE);
    const iv = EncryptService.getRandomBytes(EncryptService.IV_SIZE);

    const secretKey = await this.deriveKey(salt);

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: iv },
      secretKey,
      EncryptService.strToArrayBuffer(strToEncrypt)
    );

    const combinedBytes = new Uint8Array(
      salt.byteLength + iv.byteLength + encryptedData.byteLength
    );
    combinedBytes.set(salt, 0);
    combinedBytes.set(iv, salt.byteLength);
    combinedBytes.set(new Uint8Array(encryptedData), salt.byteLength + iv.byteLength);

    return EncryptService.arrayBufferToBase64(combinedBytes.buffer);
  }

  /**
   * Decrypts a string
   */
  public async decrypt(strToDecrypt: string): Promise<string> {
    const combinedBytes = new Uint8Array(EncryptService.base64ToArrayBuffer(strToDecrypt));
    const salt = combinedBytes.slice(0, EncryptService.SALT_SIZE);
    const iv = combinedBytes.slice(EncryptService.SALT_SIZE, EncryptService.SALT_SIZE + EncryptService.IV_SIZE);
    const encryptedBytes = combinedBytes.slice(EncryptService.SALT_SIZE + EncryptService.IV_SIZE);

    const secretKey = await this.deriveKey(salt);

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv },
      secretKey,
      encryptedBytes
    );

    return new TextDecoder().decode(decryptedData);
  }
}
