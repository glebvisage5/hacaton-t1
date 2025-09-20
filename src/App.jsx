import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Profile from './profile'
import Authentification from './Authentification'
import Registration from './Registration'

export default function App(){
  return (
    <>
      <Routes>
        <Route path="/" element={<><Header /><Profile /></>} />
        <Route path="/auth" element={<Authentification />} />
        <Route path="/registration" element={<Registration />}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
