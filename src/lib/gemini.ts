import type { RewriteTone } from "@/lib/schemas";

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

const toneDescriptions: Record<RewriteTone, string> = {
  casual: "natural and casual",
  formal: "polite and formal",
};

function buildPrompt(content: string, tone: RewriteTone) {
  return [
    "You are an expert English writing editor.",
    `Rewrite the following English sentence into a ${toneDescriptions[tone]} version.`,
    "Keep the original meaning, fix grammar if needed, and return only one rewritten English sentence.",
    "Do not include explanations, labels, markdown, quotation marks, or Japanese.",
    "",
    `Original sentence: ${content}`,
  ].join("\n");
}

/** モデルが付けがちなコードブロックや引用符を取り除く。 */
function cleanUp(text: string) {
  return text
    .trim()
    .replace(/^```[a-zA-Z]*\s*/, "")
    .replace(/\s*```$/, "")
    .replace(/^["']([\s\S]*)["']$/, "$1")
    .trim();
}

export async function rewriteSentence(content: string, tone: RewriteTone) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const model = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: buildPrompt(content, tone) }] },
        ],
        generationConfig: {
          temperature: 0.7,
          // 思考型モデルは思考にもトークンを使うため、上限が小さいと文章が途中で切れる。
          maxOutputTokens: 4096,
        },
      }),
    },
  );

  if (!response.ok) {
    console.error(
      "Gemini rewrite failed",
      response.status,
      await response.text(),
    );
    throw new Error("Gemini request failed");
  }

  const data: GeminiResponse = await response.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const suggestion = cleanUp(parts.map((part) => part.text ?? "").join(""));

  if (!suggestion) {
    throw new Error("Gemini returned no suggestion");
  }

  return suggestion;
}
