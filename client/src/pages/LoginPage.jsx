import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'




/**
 * LoginPage Component
 *
 * This component renders the user authentication interface, allowing users to either
 * sign up for a new account or log in to an existing one. It features a two-step
 * signup process (first name/email/password, then bio) and handles form submissions.
 */
const LoginPage = () => {
  // State to manage whether the form is in "Sign Up" or "Login" mode

const [currState,setCurrState]  = useState("Sign Up")
 // State variables for form inputs
const [fullName,setFullName] = useState("")
const[email,setEmail] = useState("")
const[password,setPassword] = useState("")
const [bio,setBio] = useState("")
// State to control the two-step signup process:
  // true after submitting the first part of signup, false otherwise.
const[isDataSubmitted,setIsDataSubmitted] = useState(false);

const {login} = useContext(AuthContext)


  /**
   * Handles the form submission.
   *
   * For "Sign Up" mode:
   * - If it's the first step, it sets `isDataSubmitted` to true to show the bio field.
   * - If it's the second step, it proceeds with the signup API call.
   * For "Login" mode:
   * - It directly proceeds with the login API call.
   *
   * @param {Event} event - The form submission event.
   */

const SubmitHandler = (event)=>{
  event.preventDefault();

  if(currState === "Sign Up"  && !isDataSubmitted){
    setIsDataSubmitted(true)
    return; 
  }
  login(currState === "Sign Up" ? 'signup' : 'login' ,{fullName,email,password,bio
  })
}


  return (
    <div className="min-h-screen bg-cover bg-center  flex items-center
    justify-center gap-8  sm:justify-evenly  max-sm:flex-col backdrop-blur-2xl">

      {/*--left--*/}
      <img src={assets.logo_big} className="w-[min(30vw,250px)]" />

      {/*--right--*/}


      <form onSubmit={SubmitHandler} className="border-2  bg-white/8 text-white  border-gray-500 p-8 
      flex flex-col gap-8 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl  flex justify-between items-center">
          {currState}

          {isDataSubmitted &&<img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} className="w-5 cursor-pointer" alt=""/> }
          

        </h2>
        {currState === "Sign Up" && !isDataSubmitted &&(

        <input onChange={(e)=>setFullName(e.target.value)} value={fullName} type="text" className="p-2 border
         border-gray-500 rounded-md focus:outline-none" 
          placeholder="full Name" required/>
        )}
        {!isDataSubmitted && (
          <>
          <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Email address" required
           className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
           focus:ring-indigo-500"
          />

          <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Password" required
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
          focus:ring-indigo-500"/>


          </>
        )}
        {
          currState === "Sign Up" && isDataSubmitted &&(
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} 
            rows={4} className="p-2 border border-gray-500 rounded:md 
            focus:outline-none  focus:ring-2 focus:ring-indigo-500"
            placeholder="provide a short bio.." required>

            </textarea>
          )
        }
        <button type="submit" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600
        text-white rounded-md cursor-pointer">
          {currState == "Sign Up" ? "Create Account" : "Login Now"}

        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox"/>
          <p>Agree to term of use & privacy</p>

        </div>
        <div className="flex flex-col gap-2">
          {currState === "Sign Up" ? (
            <p className="text-sm text-gray-600">Already have an account?
             <span onClick={()=>{setCurrState("Login");setIsDataSubmitted(false) }} className="font-medium text-violet-500 cursor-pointer">
              Login Here</span></p>
          ):(
            <p className="text-sm text-gray-500">Create an account<span onClick={()=>{setCurrState("Sign Up")}} className="font-medium text-gray-500 cursor-pointer">Click here</span> </p>
          )}

        </div>

      </form>





    </div>
  )
}

export default LoginPage
