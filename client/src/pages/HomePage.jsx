import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'


/**
 * HomePage Component
 *
 * This component serves as the main layout for the chat application.
 * It orchestrates the display of the SideBar, ChatContainer, and RightSidebar
 * based on the current state of the chat, specifically whether a user is selected.
 */


const HomePage = () => {
  // Destructure 'selectedUser' from ChatContext to control dynamic layout.
  // The 'selectedUser' state determines which columns are visible in the grid.

  const{selectedUser} = useContext(ChatContext)
  return (
    <div className="w-full h-screen sm:px-[5%] sm:py-[1%]">
        <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl
            overflow-hidden h-[100%] grid grid-cols-1 relative 
             ${ selectedUser ? 
            'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}
             `}>
            <SideBar/>
            <ChatContainer />
            <RightSidebar/>
        </div>
    
    </div>
  )
}

export default HomePage
