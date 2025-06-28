import OpenAI from "openai";

// Prevent usage on the client
if (typeof window !== "undefined") {
    throw new Error("OpenAI API can only be used server-side. Do not import aiService in client components.");
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is missing. Please set it in your .env.local file.");
}

const openai = new OpenAI({ apiKey });

type RunSimpleAgentOptions = {
    systemPrompt: string;
    userPrompt: string;
    model?: string; // opsiyonel, default gpt-3.5-turbo
    temperature?: number;
};

export const runSimpleAgent = async ({ systemPrompt, userPrompt, model = "gpt-4o-mini", temperature = 0 }: RunSimpleAgentOptions) => {
    const completion = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature,
    });
    return completion.choices[0]?.message?.content;
};

// Örnek kullanım:
// (async () => {
//   const output = await runSimpleAgent({ prompt: "Merhaba, bana sabit bir cevap ver." });
//   console.log(output);
// })();

