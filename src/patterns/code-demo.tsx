"use client";
import { CodeBlock } from "./code-block";

// =====================================================
// CODE DEMO
// A tabbed CodeBlock preset showing the same OpenAI-compatible request in
// Python / Node.js / cURL — the quick-start block a landing page puts next to
// its hero.
//
// The snippets are built in, but every host-specific value in them is a prop.
// They used to be hardcoded to one gateway's URL, which meant the only app that
// could honestly render this component was the one it was extracted from.
// =====================================================

export interface CodeDemoProps {
    /** The OpenAI-compatible base URL the snippets point at. */
    baseUrl?: string;
    /** Model id used in the example request. */
    model?: string;
    /** Placeholder shown where the reader's key goes. */
    apiKeyPlaceholder?: string;
    /** Message body sent in the example request. */
    prompt?: string;
    /** Tab labels. Defaults are language names, but they stay overridable. */
    labels?: { python?: string; javascript?: string; curl?: string };
    className?: string;
}

/** Build the three snippets against the host's gateway. */
function snippets(baseUrl: string, model: string, apiKey: string, prompt: string) {
    // Escaped for the shell heredoc in the cURL sample, and for the JS/Python
    // string literals — a prompt with a quote in it would otherwise break the
    // snippet it is printed into.
    const j = (s: string) => JSON.stringify(s);
    const sq = (s: string) => `'${s.replace(/'/g, "\\'")}'`;

    return {
        python: `import openai

client = openai.OpenAI(
    base_url=${j(baseUrl)},
    api_key=${j(apiKey)}
)

response = client.chat.completions.create(
    model=${j(model)},
    messages=[{"role": "user", "content": ${j(prompt)}}]
)

print(response.choices[0].message.content)`,

        javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: ${sq(baseUrl)},
  apiKey: ${sq(apiKey)}
});

const response = await client.chat.completions.create({
  model: ${sq(model)},
  messages: [{ role: 'user', content: ${sq(prompt)} }]
});

console.log(response.choices[0].message.content);`,

        curl: `curl ${baseUrl}/chat/completions \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": ${j(model)},
    "messages": [{"role": "user", "content": ${j(prompt)}}]
  }'`,
    };
}

export function CodeDemo({
    baseUrl = "https://api.example.com/v1",
    model = "deepseek-r1",
    apiKeyPlaceholder = "your_api_key",
    prompt = "Hello!",
    labels,
    className,
}: CodeDemoProps = {}) {
    const code = snippets(baseUrl, model, apiKeyPlaceholder, prompt);

    const tabs = [
        { id: "python", label: labels?.python ?? "Python", code: code.python, language: "python" },
        { id: "javascript", label: labels?.javascript ?? "Node.js", code: code.javascript, language: "javascript" },
        { id: "curl", label: labels?.curl ?? "cURL", code: code.curl, language: "bash" },
    ];

    return (
        <div className={className ?? "w-full max-w-2xl mx-auto"}>
            <CodeBlock code={code.python} tabs={tabs} />
        </div>
    );
}
