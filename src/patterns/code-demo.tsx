"use client";
import { CodeBlock } from "./code-block";

const codeSnippets = {
    python: `import openai

client = openai.OpenAI(
    base_url="https://api.example.com/v1",
    api_key="your_api_key"
)

response = client.chat.completions.create(
    model="deepseek-r1",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)`,

    javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.example.com/v1',
  apiKey: 'your_api_key'
});

const response = await client.chat.completions.create({
  model: 'deepseek-r1',
  messages: [{ role: 'user', content: 'Hello!' }]
});

console.log(response.choices[0].message.content);`,

    curl: `curl https://api.example.com/v1/chat/completions \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-r1",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
};

export function CodeDemo() {
    const tabs = [
        { id: 'python', label: 'Python', code: codeSnippets.python, language: 'python' },
        { id: 'javascript', label: 'Node.js', code: codeSnippets.javascript, language: 'javascript' },
        { id: 'curl', label: 'cURL', code: codeSnippets.curl, language: 'bash' },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto">
            <CodeBlock
                code={codeSnippets.python}
                tabs={tabs}
            />
        </div>
    );
}
