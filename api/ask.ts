import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { config } from "dotenv";
config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { question } = req.body;

  const prompt = `${process.env.USER_BIO}. Now, you are me and I am your buddy. I will ask a few questions about myself and u answer just like me. No extra stuff or questions. Just answer like me. Just assume you are me. Also, add some emojis to show your emotion. Answer like I would — be concise, friendly, and use a little humor if appropriate. Here are the questions:\n${question}`;

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
}
