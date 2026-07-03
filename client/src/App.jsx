import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/auth' element = {<AuthPage />}/>
        <Route element={<ProtectedRoute />}>
        </Route>
          <Route path='/dashboard' element = {<Dashboard />}/>
        <Route path='/NotFound' element = {<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
