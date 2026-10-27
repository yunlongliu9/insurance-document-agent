
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { documentRoutes } from "./routes/documentRoutes.js";

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
    await app.register(multipart, {
        limits: {
            files: 1,
            fileSize: 10 * 1024 * 1024,
        },
     });

    await app.register(documentRoutes);
  await app.listen({
    port: 3001,
    host: "127.0.0.1",
  });
}

main().catch((error) => {
  app.log.error(error);
  process.exitCode = 1;
});