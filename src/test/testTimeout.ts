import { withTimeout, TimeoutError } from "../utils/timeout";

async function main() {
  try {
    await withTimeout(async (signal) => {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 5000);

        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new Error("Aborted"));
        }, { once: true });
      });
    }, 1000);
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.log("Timeout test passed!");
      return;
    }

    throw error;
  }

  throw new Error("Expected timeout did not occur");
}

main().catch(console.error);