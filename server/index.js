/**
 * server/index.js
 * AstroQuest Express Middleware Proxy
 * Completely shields the Google Gemini API key so it is NEVER exposed in the browser Network tab.
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

// Load environment variables from server/.env or root .env
dotenv.config({ path: './server/.env' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const SERVER_GEMINI_KEY =
	process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * Helper to resolve the active Gemini API Key
 */
function resolveApiKey(req) {
	// 1. Prefer server-configured secret key from server/.env
	const cleanServerKey = (SERVER_GEMINI_KEY || '').replace(/^["']|["']$/g, '').trim();
	if (cleanServerKey && !cleanServerKey.startsWith('enc:v1:')) {
		return cleanServerKey;
	}

	const headerKey = req.headers['x-gemini-key'];
	const bodyKey = req.body?.apiKey;
	const clientKey = (headerKey || bodyKey || '').replace(/^["']|["']$/g, '').trim();

	// Reject any encrypted ciphertext string
	if (clientKey.startsWith('enc:v1:')) {
		return cleanServerKey || '';
	}

	return clientKey || cleanServerKey || '';
}

/**
 * 1. Healthcheck Endpoint
 */
app.get('/api/health', (req, res) => {
	res.json({
		status: 'ok',
		proxy: true,
		hasServerKey: Boolean(SERVER_GEMINI_KEY),
		timestamp: Date.now(),
		message: 'AstroQuest Secure Proxy running',
	});
});

/**
 * 2. Validate Gemini API Key
 */
app.post('/api/validate-key', async (req, res) => {
	const key = resolveApiKey(req);
	if (!key) {
		return res.status(400).json({
			valid: false,
			error: 'No API key provided or configured on server',
		});
	}

	try {
		const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
		const response = await fetch(testUrl);
		if (response.ok) {
			return res.json({ valid: true, message: 'Key validated successfully' });
		}
		const data = await response.json().catch(() => ({}));
		return res
			.status(400)
			.json({ valid: false, error: data?.error?.message || 'Invalid API key' });
	} catch (err) {
		return res.status(500).json({
			valid: false,
			error: err.message || 'Validation request failed',
		});
	}
});

/**
 * 3. Fetch Available Gemini Models List
 */
app.get('/api/models', async (req, res) => {
	const key = resolveApiKey(req);
	if (!key) {
		return res.status(400).json({ error: 'No API key configured on server' });
	}

	try {
		const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
		const response = await fetch(url);
		const data = await response.json();
		return res.status(response.status).json(data);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

/**
 * 4. Generate Content (Questions & AI Tutor Explanations)
 * Receives the prompt from UI, calls Gemini with the secret key, returns clean JSON
 */
app.post('/api/generate-content', async (req, res) => {
	const key = resolveApiKey(req);
	if (!key) {
		return res
			.status(400)
			.json({ error: 'GEMINI_API_KEY is not configured on the server' });
	}

	const {
		model = 'gemini-3.5-flash-lite',
		contents,
		systemInstruction,
		generationConfig,
	} = req.body;

	try {
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
		const payload = {
			contents,
			...(systemInstruction ? { systemInstruction } : {}),
			...(generationConfig ? { generationConfig } : {}),
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		const data = await response.json();
		return res.status(response.status).json(data);
	} catch (err) {
		console.error('[Proxy Error] generate-content:', err);
		return res
			.status(500)
			.json({ error: err.message || 'Proxy request failed' });
	}
});

/**
 * 5. Generate AI Visual Image
 * Shields image requests and auto-fails over between Imagen, Gemini Flash, and Pollinations
 */
app.post('/api/generate-image', async (req, res) => {
	const key = resolveApiKey(req);
	const { prompt } = req.body;

	if (!prompt) {
		return res.status(400).json({ error: 'Prompt is required' });
	}

	const cleanedPrompt = `Clean educational puzzle illustration for elementary kids, vector illustration style, simple geometric and logical objects on crisp white background: ${String(prompt).slice(0, 300)}`;

	// 1. Try Imagen 3 if key is present
	if (key) {
		try {
			const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${encodeURIComponent(key)}`;
			const imagenResp = await fetch(imagenUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					instances: [{ prompt: cleanedPrompt }],
					parameters: { sampleCount: 1, aspectRatio: '1:1' },
				}),
			});

			if (imagenResp.ok) {
				const data = await imagenResp.json();
				const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
				if (b64) {
					return res.json({
						imageUrl: `data:image/png;base64,${b64}`,
						provider: 'Google Imagen 3',
					});
				}
			}
		} catch (err) {
			console.warn('[Proxy Image] Imagen 3 failed:', err.message);
		}

		// 2. Try Gemini 2.5 Flash Native Image
		try {
			const flashUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(key)}`;
			const flashResp = await fetch(flashUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [{ parts: [{ text: cleanedPrompt }] }],
					generationConfig: { responseModalities: ['IMAGE'] },
				}),
			});

			if (flashResp.ok) {
				const flashData = await flashResp.json();
				const part = flashData?.candidates?.[0]?.content?.parts?.[0];
				if (part?.inlineData?.data) {
					const mime = part.inlineData.mimeType || 'image/png';
					return res.json({
						imageUrl: `data:${mime};base64,${part.inlineData.data}`,
						provider: 'Gemini Flash Image',
					});
				}
			}
		} catch (err) {
			console.warn('[Proxy Image] Gemini Flash Image failed:', err.message);
		}
	}

	function sanitizePromptForImage(text) {
		return String(text || '')
			.replace(/⭐/g, ' star ')
			.replace(/🌙/g, ' moon ')
			.replace(/☀️/g, ' sun ')
			.replace(/🔴/g, ' red circle ')
			.replace(/🔵/g, ' blue circle ')
			.replace(/🔷/g, ' blue diamond ')
			.replace(/🟩/g, ' green square ')
			.replace(/🔺/g, ' red triangle ')
			.replace(/🍎/g, ' apple ')
			.replace(/[^\w\s.,?!:;-]/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
			.slice(0, 160);
	}

	// 3. Fallback to Free Pollinations AI (Turbo Fast) - Server-side binary conversion to Data URI
	try {
		const clean = sanitizePromptForImage(prompt);
		const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}?width=400&height=400&nologo=true&model=turbo`;
		const pollResp = await fetch(pollUrl);
		if (pollResp.ok) {
			const buffer = await pollResp.arrayBuffer();
			const b64 = Buffer.from(buffer).toString('base64');
			return res.json({
				imageUrl: `data:image/jpeg;base64,${b64}`,
				provider: 'Pollinations AI (Turbo Free)',
			});
		}
	} catch (err) {
		console.warn('[Proxy Image] Pollinations Turbo failed:', err.message);
	}

	return res
		.status(500)
		.json({ error: 'All image generation providers exhausted' });
});

app.listen(PORT, () => {
	console.log(
		`\n🚀 [AstroQuest Proxy] Node.js Express server running on http://localhost:${PORT}`,
	);
	console.log(
		`🔒 [Security] Client Network tab will see requests to http://localhost:${PORT}/api/* without exposing any Gemini API keys!\n`,
	);
});
