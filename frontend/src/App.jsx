import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'

// Pages
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import {Loader} from 'lucide-react';
import {useThemeStore} from './store/useThemeStore';

const App = () => {
  const {checkAuth, authUser, isCheckingAuth} = useAuthStore();
  const {theme, setTheme} = useThemeStore();

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  );

  return (
   <div data-theme={theme}>
    <Navbar/>

    <Routes>
      <Route path='/' element={authUser? <HomePage/> : <Navigate to='/login'/>}/>
      <Route path='/signup' element={!authUser? <SignUpPage/> : <Navigate to='/'/>}/>
      <Route path='/login' element={!authUser? <LoginPage/> : <Navigate to='/'/>}/>
      <Route path='/settings' element={<SettingsPage/>}/>
      <Route path='/profile' element={authUser? <ProfilePage/> : <Navigate to='/login'/>}/>
    </Routes>

    <Toaster/>
   </div> 
  )
}

export default App