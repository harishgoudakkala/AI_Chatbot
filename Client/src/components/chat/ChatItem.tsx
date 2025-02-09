import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { useAuth } from '../../context/AuthContext'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism'

function extractCode (code: string) {
    if (code.includes("```")) {
        const block = code.split("```")
        return block;
    }
}

function isCodeBlock (code: string){
    if(code.includes("=") || code.includes(";") || code.includes("[") || code.includes("}") || code.includes("{") || code.includes("}") || code.includes("#") || code.includes("//")) {
        return true;
    }
}

const ChatItem = ({ content, role }: { content: string, role: "user" | "assistant" }) => {
    const auth = useAuth();
    const messageBlocks = extractCode(content);
    
  return (
    role == "assistant"?
    <Box sx={{display:"flex", p:2, bgcolor:"#004d5612", my:2, gap:"2"}}>
        <Avatar sx= {{ml:"0"}}>
            <img alt="assistant" src="openai.png" width="30" height="30" />
        </Avatar>
        <Box>
           {!messageBlocks &&  <Typography fontSize={"20px"}>{content}</Typography>}
           {messageBlocks && messageBlocks.length && messageBlocks.map((block) => isCodeBlock(block)?  <SyntaxHighlighter style={coldarkCold} language='javascript'>{block}</SyntaxHighlighter> :<Typography fontSize={"20px"}>{block}</Typography>)}
        </Box>
    </Box>
    :<Box sx={{display:"flex", p:2, bgcolor:"#004d56", gap:"2"}}>
    <Avatar sx= {{ml:"0", bgcolor:"black", color:"white"}}>
        {auth?.user?.name?.[0] }{auth?.user?.name?.split(" ")[1]?.[0]}
    </Avatar>
    <Box>
        <Typography fontSize={"20px"}>{content}</Typography>
    </Box>
</Box>
  )
}

export default ChatItem
