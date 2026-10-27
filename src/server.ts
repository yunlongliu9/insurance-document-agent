
import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
    service: "insurance-document-agent",
  };
});

async function main() {
  await app.listen({
    port: 3000,
    host: "127.0.0.1",
  });
}

main().catch((error) => {
  app.log.error(error);
  process.exitCode = 1;
});