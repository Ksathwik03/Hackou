import React from 'react'
import '../assets/styles/navbar.css'
import logo from '../assets/img/logo1.svg'
import { useState } from 'react'
import { useEffect } from 'react';
export default function Navbar() {
     const [token, setToken] = useState('');
     const [username, setusername] = useState('')
     
     useEffect(() => {
         setToken(localStorage.getItem(`token`));
         setusername(localStorage.getItem(`username`))
     })
     const logout = ()=>{
        localStorage.removeItem(`token`);
        localStorage.removeItem('username')
        setToken(localStorage.getItem(`token`));
     }

    return (
        <>
            <div className="navbar">
                <div className="logo"><img src={logo} alt="" /><h1>Rebate</h1></div>
                <ul>
                    <li className="nav_items"><a href="#/"> Home</a></li>
                    {!(token)&&<li className="nav_items"><a href="#/login"> Log in</a></li>}
                    {!(token)&&<li className="nav_items"><a href="#/signup">Sign up</a> </li>}
                    {token&&<li className="nav_items"><a href={`#/${username}/dashboard`}>Dashboard</a> </li>}
                    {token&&<li className="nav_items"><a href="#/" onClick={logout}>Log out</a> </li>}
                    
                </ul>
            </div>
        </>
    )
}
