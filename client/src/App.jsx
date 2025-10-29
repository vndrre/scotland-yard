import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import HomePage from './pages/HomePage'
import Lobby from './pages/Lobby'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={ <Login /> } />
          
          <Route path='/register' element={ <Register /> } />
          
          <Route path='/home' element={ <HomePage /> } />

          <Route path='/lobby' element={ <Lobby /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App