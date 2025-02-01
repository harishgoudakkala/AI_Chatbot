import './App.css'
import Header from './components/Header.js'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home.js'
import Login from './pages/Login.js'
import Signup from './pages/Signup.js'
import Chat from './pages/Chat.js'
import Notfound from './pages/Notfound.js'

function App() {

  return (
    <main>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path="*" element={<Notfound/>}/>
      </Routes>
    </main>
  )
}

export default App
