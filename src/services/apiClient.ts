const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:3001';

async function request(path: string, options: RequestInit = {}) {
	const res = await fetch(`${API_BASE}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {})
		},
		...options,
	});
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(text || `Request failed: ${res.status}`);
	}
	const contentType = res.headers.get('content-type') || '';
	if (contentType.includes('application/json')) return res.json();
	return res.text();
}

export const api = {
	get: (path: string) => request(path),
	post: (path: string, body?: any) => request(path, { method: 'POST', body: JSON.stringify(body || {}) }),
	put: (path: string, body?: any) => request(path, { method: 'PUT', body: JSON.stringify(body || {}) }),
	delete: (path: string) => request(path, { method: 'DELETE' }),
};

