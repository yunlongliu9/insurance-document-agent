
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const status = (error as { status?: number }).status;

      // 只重试临时性 API 错误
      if (
        ![429, 500, 502, 503, 504].includes(status ?? 0) ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      // Exponential Backoff: 1s → 2s → 4s ...
      const delay = 1000 * 2 ** (attempt - 1);

      console.warn(
        `API error ${status}. Retry ${attempt}/${maxAttempts - 1} in ${delay}ms`
      );

      await new Promise<void>((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }

  throw new Error("Retry attempts exhausted");
}