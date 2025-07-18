import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';




/**
 * ProfilePage Component
 *
 * This component allows authenticated users to view and update their profile information,
 * including their full name, bio, and profile picture.
 */
const ProfilePage = () => {
  // Destructure 'authUser' (current authenticated user data) and 'updateProfile'
  // (function to update user profile) from AuthContext.

  const {authUser, updateProfile} = useContext(AuthContext)
  // State to hold the currently selected image file for upload.
  const [selectedImage,setSelectedImage] = useState(null)
  const navigate = useNavigate();
  const[name,setName] = useState(authUser.fullName)
  const [bio,setBio] = useState(authUser.bio)



  /**
   * Handles the form submission for updating the profile.
   *
   * If a new image is selected:
   * Reads the image file as a Data URL (base64) and then calls `updateProfile`
   * with the new image, name, and bio.
   * If no new image is selected:
   * Calls `updateProfile` only with the updated name and bio.
   *
   * After updating, it navigates the user back to the home page.
   * @param {Event} e - The form submission event.
   */


  const handleSubmit = async(e)=>{
    e.preventDefault();
    // Case 1: No new image selected, update only name and bio
    if(!selectedImage){
      await updateProfile({fullName:name,bio});
      navigate('/');
      return;
    }
     // Case 2: New image selected, read and convert to base64
    const reader=  new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload  = async()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name,bio});
      navigate('/');
    }
   
  }


  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center
    justify-center">
      
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600
        flex items-center justify-between max-sm:flex-col-reverse rounded-lg">


        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className=" text-lg">
            Profile Details
          </h3>
          <label htmlFor="avatar"  className="flex items-center gap-3 cursor-pointer">
            <input onChange={(e)=>setSelectedImage(e.target.files[0])}
             type="file" id= "avatar" accept=".png, .jpg , .jpeg" hidden />

            <img src={selectedImage ? URL.createObjectURL(selectedImage):assets.avatar_icon}
             className={`w-12 h-12 ${ selectedImage && "rounded-full"}`} alt=''/>
            Upload profile Image
          </label>
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)}  required placeholder="Your Name" className="p-2 border border-gray-500 rounded-md 
          focus:outline-none focus:ring-2 focus-ring-violet-500"    />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
            placeholder="write profile bio" required className="p-2 border border-gray-500 
            rounded-md focus:outline-none focus:ring-2
            focus:ring-violet-500" rows={4}></textarea>

            <button type="Submit" className="bg-gradient-to-r from-purple-400 to-violet-500
            text-white p-2 rounded-full text-lg cursor-pointer">Save</button>

        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}  `} 
        src={ authUser ?. profilePic||  assets.logo_icon} alt=''/>
      </div>
    </div>
  )
}

export default ProfilePage
