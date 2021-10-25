import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LockClosed, LockOpen } from 'heroicons-react';

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);

    const [inputUsage, setInputUsage] = useState([false, false, false, false, false, false, false, false, false, false, false])
    
    useEffect( () => {
        const id = cookies.get("user_id")
        
        if(id !== undefined){
            Axios.post("https://eatsy-0329.herokuapp.com/getUser", {
                uid: id
            })
            .then( (res) => {
                if(!res.data.success){
                    toast.error("Something wrong with your site, try login again", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000
                    });
                    history.push('/Login');
                }else{
                    setUserDetail(res.data.data[0]);
                    console.log(res.data.data[0])
                    setLoading(false);
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

    function unlockInput(index){
        setInputUsage(datas=>({
            ...datas,
            [index]: true
        }))
    }
    function lockInput(index){
        setInputUsage(datas=>({
            ...datas,
            [index]: false
        }))
    }

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <ToastContainer />
            {
                loading ? (
                    <div className="h-screen w-full bg-gray-200 flex justify-center items-center">
                        <ClimbingBoxLoader size="30" color={"#1A1B1B"}/>
                    </div>
                ) : (
                    <>
                    <Header 
                        last_name={userDetail.user_last_name} 
                        first_name={userDetail.user_last_name} 
                        gender={userDetail.user_gender}
                        section={-1}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Personal Information</h1>
                        </div>
                    </header>
                    <main className="flex-col relative w-4/5 mx-auto pb-5 mt-5 overflow-hidden overflow-y-auto">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">My Personal Information</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">First name</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_first_name}
                                        disabled={
                                            inputUsage[0]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[0]
                                            ? "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[0]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(0)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(0);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_last_name}
                                        disabled={
                                            inputUsage[1]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[1]
                                            ? "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[1]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(1)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(1);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_gender}
                                        disabled={
                                            inputUsage[2]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[2]
                                            ? "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[2]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(2)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(2);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Adress</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_address}
                                        disabled={
                                            inputUsage[3]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[3]
                                            ? "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[3]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(3)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(3);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">City</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_city}
                                        disabled={
                                            inputUsage[4]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[4]
                                            ? "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[4]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(4)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(4);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">State</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_state}
                                        disabled={
                                            inputUsage[5]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[5]
                                            ? "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[5]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(5)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(5);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_postal_code}
                                        disabled={
                                            inputUsage[6]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[6]
                                            ? "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[6]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(6)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(6);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Restaurant Name</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_restaurant}
                                        disabled={
                                            inputUsage[7]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[7]
                                            ? "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[7]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(7)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(7);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Restaurant Image</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_image}
                                        disabled={
                                            inputUsage[8]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[8]
                                            ? "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[8]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(8)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(8);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Restaurant Cuisine</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_cuisine}
                                        disabled={
                                            inputUsage[9]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[9]
                                            ? "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[9]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(9)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(9);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Restarant Price Range</dt>
                                    <div
                                    className="text-sm flex items-center text-gray-900 sm:col-span-2">
                                        <input 
                                        defaultValue={userDetail.user_price_range}
                                        disabled={
                                            inputUsage[10]
                                            ? false
                                            :true
                                        }
                                        className={
                                            inputUsage[10]
                                            ? "w-11/12 bg-white px-2 py-1 rounded-lg outline-none"
                                            : "w-11/12 bg-gray-50 px-2 py-1 rounded-lg outline-none"
                                        }/>
                                        {
                                            inputUsage[10]
                                            ? <LockClosed 
                                            onClick={e => {
                                                lockInput(10)
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                            : <LockOpen 
                                            onClick={e => {
                                                unlockInput(10);
                                            }}
                                            className="w-5 h-5 ml-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                        }
                                    </div>
                                </div>
                                <div className="px-4 py-5 flex justify-end sm:px-6">
                                    <button className="px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">Update</button>
                                </div>
                                </dl>
                            </div>
                        </div>
                    </main>
                    </>
                )
            }
        </div>
    )
}

export default TracksPage
