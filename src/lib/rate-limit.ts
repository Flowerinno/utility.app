type RateLimitEntry = {
	count: number;
	resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

/**
 * Simple in-memory IP rate limiter for API proxy routes.
 * Resets on server cold start — sufficient for a personal public utility app.
 */
export function checkRateLimit(
	key: string,
	{ limit = 30, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { allowed: boolean; retryAfterSec?: number } {
	const now = Date.now();
	const entry = store.get(key);

	if (!entry || now >= entry.resetAt) {
		store.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true };
	}

	if (entry.count >= limit) {
		return {
			allowed: false,
			retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
		};
	}

	entry.count += 1;
	return { allowed: true };
}

export function getClientIp(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0]?.trim() || "unknown";
	}
	return request.headers.get("x-real-ip") || "unknown";
}
