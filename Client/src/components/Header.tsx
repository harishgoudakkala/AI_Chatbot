import React from 'react'
import { AppBar } from '@mui/material'
import {Toolbar} from '@mui/material'
import Logo from "./shared/Logo"
import { useAuth } from '../context/AuthContext'
import NavigationLink from './NavigationLink'

const Header = () => {
  const auth = useAuth()
  return (
    <AppBar sx={{bgcolor:"transparent", position: "static", boxShadow: "none" }}>
        <Toolbar>
          <Logo/>
          <div>
            {auth?.isLoggedIn? (
              <>
                <NavigationLink bg="#00fffc" to="/chat" text="Go To Chat" textcolor='black'/>
                <NavigationLink bg="#51538f" to="/" text="Logout" textcolor='black' onClick={auth.logout}/>
              </>
            ):(
              <>
              <NavigationLink bg="#00fffc" to="/login" text="Login" textcolor='black'/>
              <NavigationLink bg="#51538f" to="/signUp" text="Sign up" textcolor='black'/>
              </>
              
            )}
          </div>
        </Toolbar>
    </AppBar>
  )
}

export default Header
