import React, { useEffect } from 'react'
import { LockClosedIcon } from '@heroicons/react/solid'
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

function Login() {
  let history = useHistory();

  useEffect( () => {
    if(cookies.get("user_id") !== undefined){
      history.push("/admin");
    }
  }, [] )
  // get login button click
  function getLoginClick(e){
    var email = document.getElementById("login").elements["email"].value;
    var password = document.getElementById("login").elements["password"].value;

    if(isNull(email)&&isNull(password)){
      if(validateEmail(email)){
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
                  cookies.set("user_id", data.id, {path: "/"});
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="../img/logo2.png"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="SignUp" className="font-medium text-indigo-600 hover:text-indigo-500">
              Create You Own Account now
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" id="login" method="POST">
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
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              onClick={e => getLoginClick(e)}
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
      </div>
    </div>
  )
}
export default Login