import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai"; // Updated import

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { message } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or "text-davinci-003"
            messages: [{ role: "user", content: message }],
            max_tokens: 150,
        });

        // Ensure choices and message exist before accessing them
        const reply = completion?.choices?.[0]?.message?.content?.trim();

        if (reply) {
            res.status(200).json({ reply });
        } else {
            res.status(500).json({ error: "No valid reply from GPT model." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to generate response." });
    }
}
