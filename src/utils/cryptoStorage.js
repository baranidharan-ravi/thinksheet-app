/**
 * cryptoStorage.js
 * High-security client-side encryption module using the browser's native Web Crypto API (AES-GCM 256-bit).
 * Encrypts sensitive keys (e.g. Google Gemini API Key) before storing in localStorage,
 * preventing plain-text exposure in DevTools Application tab.
 */

const ENCRYPTION_PREFIX = 'enc:v1:';
const APP_SALT = new Uint8Array([
	0x61, 0x73, 0x74, 0x72, 0x6f, 0x71, 0x75, 0x65, 0x73, 0x74, 0x2d, 0x63,
	0x6f, 0x73, 0x6d, 0x69,
]); // "astroquest-cosmi"

// Cached derived CryptoKey
let cachedCryptoKey = null;

/**
 * Derive an AES-GCM 256-bit CryptoKey using PBKDF2
 */
async function getDerivedKey() {
	if (cachedCryptoKey) return cachedCryptoKey;

	if (
		typeof window === 'undefined' ||
		!window.crypto ||
		!window.crypto.subtle
	) {
		return null;
	}

	try {
		// Base seed derived from origin and application scope
		const basePassphrase = `${window.location?.hostname || 'astroquest'}-app-secure-vault`;
		const enc = new TextEncoder();
		const keyMaterial = await window.crypto.subtle.importKey(
			'raw',
			enc.encode(basePassphrase),
			{ name: 'PBKDF2' },
			false,
			['deriveKey'],
		);

		cachedCryptoKey = await window.crypto.subtle.deriveKey(
			{
				name: 'PBKDF2',
				salt: APP_SALT,
				iterations: 100000,
				hash: 'SHA-256',
			},
			keyMaterial,
			{ name: 'AES-GCM', length: 256 },
			false,
			['encrypt', 'decrypt'],
		);

		return cachedCryptoKey;
	} catch (err) {
		console.warn('WebCrypto key derivation fallback:', err);
		return null;
	}
}

/**
 * Encrypt a plaintext string to an encrypted ciphertext payload
 * Format: "enc:v1:<iv_hex>:<ciphertext_hex>"
 */
export async function encryptValue(plainText) {
	if (!plainText || typeof plainText !== 'string') return '';

	try {
		const key = await getDerivedKey();
		if (!key) {
			// Fallback base64 obfuscation if WebCrypto subtle is unsupported
			return `${ENCRYPTION_PREFIX}b64:${btoa(encodeURIComponent(plainText))}`;
		}

		const enc = new TextEncoder();
		const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
		const cipherBuffer = await window.crypto.subtle.encrypt(
			{ name: 'AES-GCM', iv },
			key,
			enc.encode(plainText),
		);

		const ivHex = Array.from(iv)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
		const cipherHex = Array.from(new Uint8Array(cipherBuffer))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');

		return `${ENCRYPTION_PREFIX}${ivHex}:${cipherHex}`;
	} catch (err) {
		console.warn('Encryption error, saving obfuscated fallback:', err);
		return `${ENCRYPTION_PREFIX}b64:${btoa(encodeURIComponent(plainText))}`;
	}
}

/**
 * Decrypt a ciphertext payload back to plaintext
 */
export async function decryptValue(encryptedValue) {
	if (!encryptedValue || typeof encryptedValue !== 'string') return '';

	// If value is not encrypted, it's legacy plaintext
	if (!encryptedValue.startsWith(ENCRYPTION_PREFIX)) {
		return encryptedValue;
	}

	const payload = encryptedValue.slice(ENCRYPTION_PREFIX.length);

	// Fallback base64 decode
	if (payload.startsWith('b64:')) {
		try {
			return decodeURIComponent(atob(payload.slice(4)));
		} catch (_) {
			return '';
		}
	}

	try {
		const parts = payload.split(':');
		if (parts.length !== 2) return '';

		const [ivHex, cipherHex] = parts;
		const iv = new Uint8Array(
			ivHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
		);
		const cipherBuffer = new Uint8Array(
			cipherHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
		);

		const key = await getDerivedKey();
		if (!key) return '';

		const decryptedBuffer = await window.crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv },
			key,
			cipherBuffer,
		);

		const dec = new TextDecoder();
		return dec.decode(decryptedBuffer);
	} catch (err) {
		console.warn('Decryption failed, key might be invalid or from another origin:', err);
		return '';
	}
}

/**
 * Synchronous read with automatic decryption and legacy migration
 */
export function getSecureStorageItem(storageKey) {
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return '';

		// If it's already encrypted with base64 or AES
		if (raw.startsWith(ENCRYPTION_PREFIX)) {
			// For instantaneous synchronous initialization, if base64:
			if (raw.startsWith(`${ENCRYPTION_PREFIX}b64:`)) {
				try {
					return decodeURIComponent(atob(raw.slice(`${ENCRYPTION_PREFIX}b64:`.length)));
				} catch (_) {}
			}
			return raw;
		}

		// Legacy plaintext: migrate automatically to encrypted storage
		encryptValue(raw).then((enc) => {
			if (enc) {
				try {
					localStorage.setItem(storageKey, enc);
				} catch (_) {}
			}
		});

		return raw;
	} catch (_) {
		return '';
	}
}

/**
 * Save an item with AES encryption into localStorage
 */
export async function setSecureStorageItem(storageKey, value) {
	if (!value) {
		localStorage.removeItem(storageKey);
		return;
	}

	try {
		const encrypted = await encryptValue(String(value));
		localStorage.setItem(storageKey, encrypted);
	} catch (err) {
		console.warn('Failed to set secure storage item:', err);
		// Obfuscation fallback
		localStorage.setItem(
			storageKey,
			`${ENCRYPTION_PREFIX}b64:${btoa(encodeURIComponent(String(value)))}`,
		);
	}
}
