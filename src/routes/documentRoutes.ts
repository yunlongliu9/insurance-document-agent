
import type { FastifyInstance } from "fastify";
import { extractDocument } from "../agents/documentAgent.js";
import { classifyError } from "../errors/classifyError.js";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export async function documentRoutes(app: FastifyInstance) {
  app.post("/api/documents/extract", async (request, reply) => {
    const file = await request.file();

    if (!file) {
      return reply.code(400).send({
        error: "No file uploaded",
      });
    }

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "application/pdf",
    ]);

    if (!allowedTypes.has(file.mimetype)) {
      return reply.code(415).send({
        error: "Unsupported file type",
      });
    }

    const directory = await mkdtemp(
      join(tmpdir(), "insurance-document-")
    );

    try {
      const extension =
        file.mimetype === "application/pdf"
          ? ".pdf"
          : file.mimetype === "image/png"
            ? ".png"
            : ".jpeg";

      const filePath = join(directory, `document${extension}`);

      await writeFile(filePath, await file.toBuffer());

      const result = await extractDocument(filePath);

      return reply.send(result);
    } catch (error) {
      const classified = classifyError(error);

      request.log.error(error);

      return reply.code(500).send({
        code: classified.code,
        message: classified.message,
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}