let redisClient = null;

class ResponseCachingService {
  static setClient(client) {
    redisClient = client;
  }

  static async cache(key, ttlSecs, fetchFn) {
    if (!redisClient) {
      return fetchFn();
    }
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (_) {}

    const data = await fetchFn();

    try {
      await redisClient.setEx(key, ttlSecs, JSON.stringify(data));
    } catch (_) {}

    return data;
  }

  static async invalidate(key) {
    if (!redisClient) return;
    try {
      await redisClient.del(key);
    } catch (_) {}
  }
}

module.exports = ResponseCachingService;
