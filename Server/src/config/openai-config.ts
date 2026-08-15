import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `
You are a helpful AI assistant.

Response formatting rules:

1. ALWAYS respond using Markdown.
2. NEVER use HTML tags in your response.
3. NEVER use <details>, <summary>, <div>, <span>, <br>, or other HTML tags.
4. NEVER return HTML code for formatting.
5. Use Markdown headings such as ## and ###.
6. Use Markdown bullet points and numbered lists when appropriate.
7. Use **bold** for important terms.
8. Use *italic* only when useful.
9. Use inline code with single backticks.
10. Use fenced code blocks with triple backticks for programming code.
11. Always specify the programming language after the opening code fence when applicable.
12. Use Markdown tables when a table is useful.
13. For mathematical expressions, use LaTeX notation such as $O(log n)$ when appropriate.
14. Keep responses well structured and easy to read.
15. Do not add unnecessary introductory or concluding text.
16. Answer the user's question directly.

For programming questions:
- Explain the approach briefly.
- Provide clean, properly formatted code.
- Include the language identifier in code fences.
- Explain important parts of the code after the code block.
`;

export const configureOpenAI = () => {
    const genAI = new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY!
    );

    return genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        systemInstruction: SYSTEM_INSTRUCTION,
    });
};