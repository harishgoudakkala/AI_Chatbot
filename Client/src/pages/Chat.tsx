import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import { IoMdSend } from 'react-icons/io'
import red from '@mui/material/colors/red'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ChatItem from '../components/chat/ChatItem'
import { deleteChats, getChats, sendChatReq } from '../helpers/api-communicator'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
// const chatMessages = [
//   {
//     "role": "assistant",
//     "content": "Hello! How can I assist you today?"
//   },
//   {
//     "role": "user",
//     "content": "Hi, I need help with something."
//   },
//   {
//     "role": "assistant",
//     "content": "Of course! What do you need help with?"
//   },
//   {
//     "role": "user",
//     "content": "I’m trying to figure out how to reset my password."
//   },
//   {
//     "role": "assistant",
//     "content": "No problem! I can guide you through the process. Which service are you trying to reset your password for?"
//   },
//   {
//     "role": "user",
//     "content": "It’s for my email account."
//   },
//   {
//     "role": "assistant",
//     "content": "Great! First, go to the login page of your email provider. Do you need a link to the login page?"
//   },
//   {
//     "role": "user",
//     "content": "Yes, that would be helpful."
//   },
//   {
//     "role": "assistant",
//     "content": "Sure! Here’s the link to the login page. Once there, click on ‘Forgot Password.’"
//   }
// ]
type Message = {
  role: "user" | "assistant",
  content: string
}

const Chat = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const inputref = useRef<HTMLInputElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const handleSubmit = async () => {
    const content = inputref.current?.value as string;
    if(inputref?.current) {
      inputref.current.value="";
    }
    const newMessage : Message= {role:"user", content};
    setChatMessages((prev)=> [...prev, newMessage])
    const chatData = await sendChatReq(content);
    setChatMessages((prev)=> [...prev, {role:"assistant", content:chatData?.chatResponse}]);
  }

  const handleDelete = async () => {
    try{
      toast.loading("Deleting...", {id:"deleteChats"});
      await deleteChats();
      setChatMessages([]);
      toast.success("Chat history deleted successfully", {id:"deleteChats"})
    }catch(err){
      console.log(err);
      toast.error("Failed to delete chat history", {id:"deleteChats"})
    }
  }

  useEffect(() => {
    if(!auth?.user) {
       navigate('/login');
    }
  },[auth])

  useLayoutEffect(() => {
    if(auth?.isLoggedIn && auth.user) {
      toast.loading("loading...", {id:"loadChats"})
      getChats().then((data) =>{
        setChatMessages([...data.chats]);
        toast.success("sucessfully loaded chats", {id:"loadChats"})
      }).catch((error) => {
        console.log(error);
        toast.error("Failed to load chats", {id:"loadChats"})
      })
    }
  },[auth])

  return (
   <Box sx={{display:"flex", flex:1, width:'100%', height:"100%", mt:3, gap:3}}>
      <Box sx={{display:{md:"flex", xs:"none", sm:"none"}, flex:0.2, flexDirection:"column" }}>
        <Box sx={{display:"flex", width:"100%", height:"60vh",bgcolor:"rgb(17,29,39)", borderRadius:5, flexDirection:"column", mx:3}}>
            <Avatar sx={{mx:"auto", my:"2", bgcolor:'white', color:'black', fontWeight:700}}>{ auth?.user?.name?.[0] }{auth?.user?.name?.split(" ")[1]?.[0]}</Avatar>
            <Typography sx={{mx:"auto", fontFamily:"work sans"}}> You are talking to a Chat bot</Typography>
            <Typography sx={{mx:"auto", fontFamily:"work sans", my:4, p:3}}> You can ask some questions related to Knowledge, Business, Advices, Education, Etc. But avoid sharing your personal information</Typography>
          <Button sx={{
            width:"200px",
            my:"auto",
            color:"white",
            fontWeight:700,
            borderRadius:3,
            mx:"auto",
            bgcolor:red[800],
            ":hover":{
              bgcolor:red.A200,
              cursor:"pointer"
            }
          }}
          onClick={handleDelete}
          > Clear Converstion</Button>
        </Box>
      </Box>
      <Box sx={{display:"flex", flex:{md:0.8, xs:1, sm:1}, flexDirection:"column", px:3 }}>
        <Typography sx={{textAlign:'center', fontSize:"40px" ,color:"white", mb:"2", mx:"auto"}}> Model - GPT 3.5 Turbo</Typography>
        <Box sx={{width:"100%",height:"60vh", borderRadius:"3", mx:"auto", display:"flex", flexDirection:"column", overflow:"scroll", overflowX:"hidden", overflowY:"auto",scrollBehavior:"smooth"}}>
         
         {chatMessages.map((chat, index) => (
          //@ts-ignore
           <ChatItem key={index} content={chat.content} role={chat.role} />
         ))}
        </Box>
        <div style={{width:"100%", padding:"20px", borderRadius:8, backgroundColor:"rgb(17,27,39)", display:"flex", margin:"auto"}}>
        <input ref={inputref} type='text' style={{width:"100%",backgroundColor:'transparent',padding:"10px", border:"none", outline:"none", color:"white", fontSize:"20px"}}/>
        <IconButton onClick={handleSubmit} sx ={{ml:"auto", color:"white",}}><IoMdSend/></IconButton>
        </div>
      </Box>
   </Box>
  )
}

export default Chat
