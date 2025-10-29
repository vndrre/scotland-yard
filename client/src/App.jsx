import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import HomePage from './pages/HomePage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={ <Login /> } />
          
          <Route path='/register' element={ <Register /> } />
          
          <Route path='/home' element={ <HomePage /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App