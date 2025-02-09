import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism'

function extractCode(code: string) {
    if (code.includes("```")) {
        const block = code.split("```")
        return block;
    }
}

function isCodeBlock(code: string) {
    if (code.includes("=") || code.includes(";") || code.includes("[") || code.includes("}") || code.includes("{") || code.includes("}") || code.includes("#") || code.includes("//")) {
        return true;
    }
}

function applyFormatting(text: string) {
    // Replace markdown bold (**bold**)
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    // Replace markdown italic (*italic*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Replace markdown links ([text](url))
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" style="color: blue;">$1</a>');
    return text;
}

// Function to handle new lines (convert `\n` to <br />)
function handleNewlines(content: string) {
    return content.split('\n').map((line, index) => (
        <span key={index}>
            {index > 0 && <br />} {/* Add <br /> between lines */}
            {line}
        </span>
    ));
}

const ChatItem = ({ content, role }: { content: string, role: "user" | "assistant" }) => {
    const auth = useAuth();
    const messageBlocks = extractCode(content);

    return (
        role === "assistant" ? (
            <Box sx={{ display: "flex", alignItems: "flex-start", p: 2, bgcolor: "#004d5612", my: 2, gap: 2, borderRadius: 2 }}>
                <Avatar sx={{ ml: 0 }}>
                    <img alt="assistant" src="openai.png" width="30" height="30" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    {!messageBlocks ? (
                        <Typography fontSize={"20px"} component="div">
                            {handleNewlines(applyFormatting(content))}
                        </Typography>
                    ) : (
                        messageBlocks.length && messageBlocks.map((block, index) => isCodeBlock(block) ? (
                            <SyntaxHighlighter key={index} style={coldarkCold} language='javascript'>{block}</SyntaxHighlighter>
                        ) : (
                            <Typography key={index} fontSize={"20px"} component="div">
                                {handleNewlines(applyFormatting(block))}
                            </Typography>
                        ))
                    )}
                </Box>
            </Box>
        ) : (
            <Box sx={{ display: "flex", alignItems: "flex-start", p: 2, bgcolor: "#004d56", gap: 2, borderRadius: 2 }}>
                <Avatar sx={{ ml: 0, bgcolor: "black", color: "white" }}>
                    {auth?.user?.name?.[0]}{auth?.user?.name?.split(" ")[1]?.[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography fontSize={"20px"} component="div">
                        {handleNewlines(applyFormatting(content))}
                    </Typography>
                </Box>
            </Box>
        )
    );
}

export default ChatItem;
