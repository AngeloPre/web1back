import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (request, reply) => {
    // Validate request body
    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(request.body);

    try {
      // Fetch transactions from the Prisma database
      const transactions = await prisma.transacao.findMany({
        select: {
          id: true,
          value: true,
          name: true,
          category: true,
          type: true,
        },
      });

      // Convert transactions to a formatted string
      const dataString = transactions
        .map((transaction) => `Name: ${transaction.name}, Value: ${transaction.value}, Type: ${transaction.type}`)
        .join("\n");

      // Replace {dados} in the prompt with the transaction data
      const promptMessage = prompt.replace("{dados}", dataString);

      // Generate AI response using OpenAI's streaming API
      const responseStream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: promptMessage }
        ],
        stream: true, // Enable streaming
      });

      // Set up response headers for streaming
      reply.raw.setHeader("Content-Type", "text/plain");
      reply.raw.setHeader("Transfer-Encoding", "chunked");
      reply.raw.setHeader("Access-Control-Allow-Origin", "*");
      reply.raw.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

      // Stream the AI response to the client
      reply.raw.writeHead(200);

      for await (const chunk of responseStream) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          reply.raw.write(content); // Write each chunk to the response
        }
      }

      reply.raw.end(); // End the response stream
    } catch (error) {
      console.error("Error generating AI completion:", error);
      reply.status(500).send({ error: "An error occurred while processing your request." });
    }
  });
}
