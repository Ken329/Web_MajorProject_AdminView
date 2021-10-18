import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Ban } from 'heroicons-react';

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);
    

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
                    setLoading(false);
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

    

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
                        last_name={"Ken"} 
                        first_name={"Liau"} 
                        gender={userDetail.user_gender}
                        section={1}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
                        </div>
                    </header>
                    <main className="flex-col relative overflow-hidden">
                        <section className="w-4/5 mx-auto grid grid-cols-2 py-6 md:grid-cols-3 lg:grid-cols-4" >
                            <div className="h-auto bg-white flex-col rounded-xl mx-4 my-3">
                                <img className="w-28 h-28 mx-auto my-3 rounded-full" src="../img/background.jpg"/>
                                <p className="w-full text-center my-2 font-bold">Chicken chop</p>
                                <p className="w-full text-center my-2 text-gray-500">RM 12.99</p>
                                <p className="w-min text-center mx-auto my-2 px-2 py-1 rounded-xl bg-green-200 text-green-700 hover:text-green-900">Chicken</p>
                                <div className="w-full mt-5 grid grid-cols-2">
                                    <div className="flex bg-red-400 rounded-bl-xl justify-center cursor-pointer items-center py-3 border-t-2 border-r-2 border-gray-200">
                                        <Ban className="w-5 h-5 mx-1"/>
                                        Discount
                                    </div>
                                    <div className="flex bg-white rounded-br-xl justify-center cursor-pointer items-center py-3 border-t-2 border-gray-200">
                                        Available
                                    </div>
                                </div>
                            </div>
                            <div className="h-auto bg-white flex-col rounded-xl mx-4 my-3">
                                <img className="w-28 h-28 mx-auto my-3 rounded-full" src="../img/background.jpg"/>
                                <p className="w-full text-center my-2 font-bold">Chicken chop</p>
                                <p className="w-full text-center my-2 text-gray-500">RM 12.99</p>
                                <p className="w-min text-center mx-auto my-2 px-2 py-1 rounded-xl bg-green-200 text-green-700 hover:text-green-900">Chicken</p>
                                <div className="w-full mt-5 grid grid-cols-2">
                                    <div className="flex bg-red-400 rounded-bl-xl justify-center cursor-pointer items-center py-3 border-t-2 border-r-2 border-gray-200">
                                        <Ban className="w-5 h-5 mx-1"/>
                                        Discount
                                    </div>
                                    <div className="flex bg-white rounded-br-xl justify-center cursor-pointer items-center py-3 border-t-2 border-gray-200">
                                        Available
                                    </div>
                                </div>
                            </div>
                            <div className="h-auto bg-white flex-col rounded-xl mx-4 my-3">
                                <img className="w-28 h-28 mx-auto my-3 rounded-full" src="../img/background.jpg"/>
                                <p className="w-full text-center my-2 font-bold">Chicken chop</p>
                                <p className="w-full text-center my-2 text-gray-500">RM 12.99</p>
                                <p className="w-min text-center mx-auto my-2 px-2 py-1 rounded-xl bg-green-200 text-green-700 hover:text-green-900">Chicken</p>
                                <div className="w-full mt-5 grid grid-cols-2">
                                    <div className="flex bg-red-400 rounded-bl-xl justify-center cursor-pointer items-center py-3 border-t-2 border-r-2 border-gray-200">
                                        <Ban className="w-5 h-5 mx-1"/>
                                        Discount
                                    </div>
                                    <div className="flex bg-white rounded-br-xl justify-center cursor-pointer items-center py-3 border-t-2 border-gray-200">
                                        Available
                                    </div>
                                </div>
                            </div>
                            <div className="h-auto bg-white flex-col rounded-xl mx-4 my-3">
                                <img className="w-28 h-28 mx-auto my-3 rounded-full" src="../img/background.jpg"/>
                                <p className="w-full text-center my-2 font-bold">Chicken chop</p>
                                <p className="w-full text-center my-2 text-gray-500">RM 12.99</p>
                                <p className="w-min text-center mx-auto my-2 px-2 py-1 rounded-xl bg-green-200 text-green-700 hover:text-green-900">Chicken</p>
                                <div className="w-full mt-5 grid grid-cols-2">
                                    <div className="flex bg-red-400 rounded-bl-xl justify-center cursor-pointer items-center py-3 border-t-2 border-r-2 border-gray-200">
                                        <Ban className="w-5 h-5 mx-1"/>
                                        Discount
                                    </div>
                                    <div className="flex bg-white rounded-br-xl justify-center cursor-pointer items-center py-3 border-t-2 border-gray-200">
                                        Available
                                    </div>
                                </div>
                            </div>
                            <div className="h-auto bg-white flex-col rounded-xl mx-4 my-3">
                                <img className="w-28 h-28 mx-auto my-3 rounded-full" src="../img/background.jpg"/>
                                <p className="w-full text-center my-2 font-bold">Chicken chop</p>
                                <p className="w-full text-center my-2 text-gray-500">RM 12.99</p>
                                <p className="w-min text-center mx-auto my-2 px-2 py-1 rounded-xl bg-green-200 text-green-700 hover:text-green-900">Chicken</p>
                                <div className="w-full mt-5 grid grid-cols-2">
                                    <div className="flex bg-red-400 rounded-bl-xl justify-center cursor-pointer items-center py-3 border-t-2 border-r-2 border-gray-200">
                                        <Ban className="w-5 h-5 mx-1"/>
                                        Discount
                                    </div>
                                    <div className="flex bg-white rounded-br-xl justify-center cursor-pointer items-center py-3 border-t-2 border-gray-200">
                                        Available
                                    </div>
                                </div>
                            </div>
                            <div className="h-auto bg-white flex-col rounded-xl mx-4 my-3">
                                <img className="w-28 h-28 mx-auto my-3 rounded-full" src="../img/background.jpg"/>
                                <p className="w-full text-center my-2 font-bold">Chicken chop</p>
                                <p className="w-full text-center my-2 text-gray-500">RM 12.99</p>
                                <p className="w-min text-center mx-auto my-2 px-2 py-1 rounded-xl bg-green-200 text-green-700 hover:text-green-900">Chicken</p>
                                <div className="w-full mt-5 grid grid-cols-2">
                                    <div className="flex bg-red-400 rounded-bl-xl justify-center cursor-pointer items-center py-3 border-t-2 border-r-2 border-gray-200">
                                        <Ban className="w-5 h-5 mx-1"/>
                                        Discount
                                    </div>
                                    <div className="flex bg-white rounded-br-xl justify-center cursor-pointer items-center py-3 border-t-2 border-gray-200">
                                        Available
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                    </>
                )
            }
        </div>
    )
}

export default TracksPage
