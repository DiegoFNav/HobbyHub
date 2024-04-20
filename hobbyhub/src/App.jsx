import React from 'react';
import './App.css';
import { Link, Outlet } from 'react-router-dom'

function App() {

  return (
    <> 
    <div className='main_container'>
      <div className='nav_bar'>
        <div className='left'>
          <img className='logo' src="logo.png" alt="" />
        </div>
        <div className='right'>
          <h2><Link to="/home">Home</Link></h2>
          <h2><Link to="/create">Create Post</Link></h2>
        </div>
      </div>
      <div className='page_container'>
        <Outlet />
      </div>
    </div>
    </>
    
  )
}

export default App
