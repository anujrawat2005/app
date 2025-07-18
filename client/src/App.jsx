import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext';

const App = () => {
  // Destructure 'authUser' from AuthContext to determine if a user is currently logged in.
  // This state is crucial for controlling route access.
  const { authUser } = useContext(AuthContext)
  return (
    // Main application container with a background image applied via Tailwind CSS.
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      {/* Toaster component to display transient notifications (e.g., success, error messages) */}
      <Toaster/>
      {/* Routes component acts as the parent container for all individual Route definitions. */}
      <Routes>
         {/*
          Route for the Home Page ('/'):
          - If 'authUser' exists (user is logged in), renders the HomePage.
          - If 'authUser' does not exist, redirects (navigates) the user to the '/login' page.
        */}
        <Route path='/' element={ authUser ?  <HomePage/>: <Navigate to ="/login" />}/>
         {/*
          Route for the Login Page ('/login'):
          - If 'authUser' does NOT exist (user is not logged in), renders the LoginPage.
          - If 'authUser' exists, redirects the user to the root path ('/') (preventing logged-in users from seeing the login page).
        */}
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/" />}/>
        {/*
          Route for the Profile Page ('/profile'):
          - If 'authUser' exists, renders the ProfilePage.
          - If 'authUser' does not exist, redirects the user to the '/login' page.
        */}
        <Route path='/profile' element={ authUser ?  <ProfilePage/>: <Navigate to ="/login" />}/>
      </Routes>
      
    </div>
  )
}

export default App;
