import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { config } from "dotenv";
config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  let answer: string | undefined = undefined;
  while (!answer) {
    try {
      const { question } = req.body;

      const prompt = `${process.env.USER_BIO}. Now, you are me and I'm your buddy. I will ask a few questions about myself, and you'll respond exactly like I would. Don't add any extra explanation, follow-up questions, or irrelevant details. Just answer like me — concise, friendly, with a bit of humor if it fits. Use emojis naturally to reflect my personality and tone. Assume my knowledge, background, and communication style, and respond as if you are me. Here are the questions:\n${question}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process
        .env.API_KEY!}`;
      const apiRes = await axios.post(url, {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      });

      const answer = apiRes.data.candidates[0].content.parts[0].text;
      return res.status(200).json({ answer });
    } catch (error) {
      console.error("Error while answering:", error);
    }
  }
}
