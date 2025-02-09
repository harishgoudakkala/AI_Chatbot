import { Box, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import Typing from '../components/typer/Typing'

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"))
  return (
    <Box width={"100%"} height={"100%"} flex={'flex'} mx={"auto"} >
      <Box sx={{width:'100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 'auto'}}>
      <Box><Typing/></Box>
      <Box sx={{width:"100%", display:"flex", flexDirection:{md:"row", xs:"column", sm:"column"}, gap:5, my:10}}>
        <img src='robot.png' alt= "robot" style={{width:"300px", margin:"auto"}}/>
        <img src='gemini.png' alt= "gemini" style={{width:"150px", margin:"auto"}}/>

      </Box>
      <Box sx={{display:"flex", width:"100%", mx:"auto"}}>
        <img src='chat.png' alt= "chat" style={{display:"flex", width: isBelowMd?"80%":"60%" , margin:"auto", boxShadow:"-5px -5px 105px #64f3d5", marginTop:"20", marginBottom:"20", borderRadius:"20"}}/>
        
      </Box>
      </Box>
    </Box>
  )
}

export default Home
