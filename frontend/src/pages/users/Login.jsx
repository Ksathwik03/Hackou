import React, { useState } from "react";
import "../assets/styles/login.css";
import loginImg from "../assets/img/login-img.svg";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../Api/api";
import {useHistory} from 'react-router-dom'

function Admin() {
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')
  // const styleBtn = (e)=>{
  //   e.preventDefault()
  //     setTimeout(()=>{
  //     document.querySelector('#btn').classList.add('clickBtn')
  //     }, 0);
  //     setTimeout(()=>{
  //         document.querySelector('#btn').classList.remove('clickBtn')
  //     }, 200);
  // }
  const history = useHistory()
  const Login = async(e) => {
    e.preventDefault()
    // setTimeout(()=>{
    //   document.querySelector('#btn').classList.add('clickBtn')
    //   }, 0);
    //   setTimeout(()=>{
    //       document.querySelector('#btn').classList.remove('clickBtn')
    //   }, 200);
    const body = {
      username: username,
      password: password
    }
    await axios.post(`${api}login`, body)
    .then((res) => {
      if(res.status === 200){
        toast("Successfull logged in")
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("username", username)
        localStorage.setItem("id", res.data._id)
        history.push(`/${username}/dashboard`)
      }
      else{
        toast("some error occured")
      }
    })
  }
  return (
    <>
      <div className="parent-box">
        <div className="admin-box">
          <div className="page-img box-item">
            <img src={loginImg} alt="" />
          </div>
          <div className="login-page box-item">
              <div className="login-header">
                  <div className="login-page-icon">

                  </div>
              </div>
              <p className="login-text">SIGN IN</p> <span className="Inner-text">Sign in to continue</span>
            <form action={Login} className="login-form">

              <div className="email  login-page-div">
                <input type="Text" name="username" id="" 
                onChange = {(e) => setusername(e.target.value)}
                placeholder="Username"/>
              <i className="fa fa-user"></i>
              </div>
              <div className="pass login-page-div">
                <input type="password" name="Password" id=""
                onChange = {(e) => setpassword(e.target.value)}
                placeholder="Password" />
                <i className="fa fa-lock"></i>
              </div>
              <button className="Login" onClick={Login} id="btn">Log in</button>
            </form>
             <p className="login-footer">Don’t have an account?<a href="#/signUp">Sign up</a> </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Admin;
