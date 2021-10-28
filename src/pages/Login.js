import React, { useEffect, useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/solid'
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowCircleLeft } from 'heroicons-react';
import Footer from '../components/Footer';

const cookies = new Cookies();

function Login() {
  let history = useHistory();

  const [userAction, setUserAction] = useState("login");

  useEffect( () => {
    if(cookies.get("eatsy_id") !== undefined){
      history.push("/Dashboard");
    }
  }, [] )

  // get login button click
  function getLoginClick(){
    var email = document.getElementById("login").elements["email"].value;
    var password = document.getElementById("login").elements["password"].value;

    if(isNull(email)&&isNull(password)){
      if(validateEmail(email)){
        var check = document.getElementById("remember-me").checked;
        const allow = new Promise(resolve => Axios.post('https://eatsy-0329.herokuapp.com/login', {
                        email: email,
                        password: password
                      })
                      .then((res) => {
                        resolve(res.data.data)
                      }))
        toast.promise(
          allow,
          {
            pending: {
              render(){
                return "I'm loading"
              },
              icon: false,
            },
            success: {
              render({data}){
                if(data.success){
                  if(check){
                    const current = new Date();
                    const nextYear = new Date();
                    nextYear.setFullYear(current.getFullYear() + 1);
                    cookies.set("eatsy_id", data.id, {path: "/", expires: nextYear});
                  }else{
                    cookies.set("eatsy_id", data.id, {path: "/"});
                  }
                  setTimeout( () => {
                    history.push(`/Dashboard`);
                  }, 2000)
                  return `${data.message}`
                }else{
                  return `Wrong Email or Password`
                }
              },
              icon: "🟢",
            },
          }
        )
      }
    }
  }

  // reset passwod button click
  function resetButtonClick(){
    var email = document.getElementById("reset").elements["email"].value;
    if(isNull(email)){
      if(validateEmail(email)){
        Axios.post('https://eatsy-0329.herokuapp.com/resetPassword', {
          email: email
        })
        .then((res) => {
          if(res.data.data.success){
            toast.success(res.data.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000
            });
            document.getElementById("email-address-reset").value = ""
          }
        })
      }
    }
  }

  // personal used 
  function isNull(data){
    if(data === ""){
      toast.warn("Do not leave the field empty", {
        autoClose: 3000
      })
      return false
    }
    return true;
  }
  function validateEmail(mail){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
      return (true);
    }
    toast.warn("You have entered an invalid email address!", {
      autoClose: 3000
    })
    return (false);
  }
  return (
    <div className="min-h-screen w-full">
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="../img/logo2.png"
            alt="Workflow"
          />
          {
            userAction === "login"
            ? <><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <a href="SignUp" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Create You Own Account now
                </a>
              </p></>
            : <><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2></>
          }
          
        </div>
        {
          userAction === "login"
          ? <form className="mt-8 space-y-6" id="login" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onKeyDown={e => {
                    if(e.key === "Enter"){
                      getLoginClick()
                    }
                  }}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onKeyDown={e => {
                    if(e.key === "Enter"){
                      getLoginClick()
                    }
                  }}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <p 
                onClick={e => {
                  setUserAction("reset")
                }}
                className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  Forgot your password?
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={e => getLoginClick()}
                type="button"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Sign in
              </button>
            </div>
          </form>
          : <form className="mt-8 space-y-6" id="reset" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="text-gray-700 text-md flex items-center">
              <ArrowCircleLeft 
              onClick={e => {
                setUserAction("login")
              }}
              className="w-5 h-5 mx-2 cursor-pointer"/>
              <p onClick={e => {setUserAction("login")}} className="cursor-pointer">Back to Login</p>
            </div>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address-reset"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onKeyDown={e => {
                    if(e.key === "Enter"){
                      resetButtonClick()
                    }
                  }}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <button
                onClick={e => resetButtonClick()}
                type="button"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Reset Password
              </button>
            </div>
          </form>
        }
      </div>
    </div>
    <Footer />
    </div>
  )
}
export default Login