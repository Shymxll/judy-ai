import OpenAI from "openai";

// Sabit bir prompt ile OpenAI'dan yanıt dönen basit fonksiyon
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

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

