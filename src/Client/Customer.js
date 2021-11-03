import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { ClimbingBoxLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CurrencyDollar, ShoppingBag, Speakerphone } from 'heroicons-react';

function Customer() {
    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);
    const [menu, setMenu] = useState([]);
    const [menuId, setMenuId] = useState([]);
    const [menuCategories, setMenuCategories] = useState([]);

    const [success, setSuccess] = useState(true);
    
    useEffect( () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('res_id');
        
        if(id !== undefined && id !== "" && id !== null){
            Axios.post("https://eatsy-0329.herokuapp.com/getRestaurantMenuById", {
                id: id
            })
            .then( (res) => {
                if(res.data.data.success){
                    var data = res.data.data.data;
                    for(var i = 1; i < data.length; i+=2){
                        setMenu(array => [...array, data[i + 1]])
                        setMenuId(array => [...array, data[i]])
                    }
                    filteringCategories(data)
                    setLoading(false);
                }else{
                    setSuccess(false);
                    setLoading(false);
                }
            })
        }else{
            setSuccess(false);
            setLoading(false);
        }
    }, [] ) 

    useEffect( () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('res_id');
        
        if(id !== undefined && id !== "" && id !== null){
            Axios.post("https://eatsy-0329.herokuapp.com/getRestaurantById", {
                id: id
            })
            .then( (res) => {
                if(res.data.success){
                    var data = res.data.data;
                    setUserDetail(data);
                    setLoading(false);
                }else{
                    setSuccess(false);
                    setLoading(false);
                }
            })
        }else{
            setSuccess(false);
            setLoading(false);
        }
    }, [] ) 

    function filteringCategories(data){
        var myData = [];
        for(var i = 1; i < data.length; i+=2){
            if(!myData.includes(data[i + 1].food_categories)){
                myData.push(data[i + 1].food_categories);
            }
        }
        myData = myData.sort();
        setMenuCategories(myData);
    }

    function insertingMenuFunction(data, categories){
        var list = [];
        for(var i = 0; i < data.length; i++){
            if(data[i].food_categories === categories){
                list.push(<div key={menuId[i]} className="group relative">
                <div className="w-full h-72 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 md:h-80 lg:aspect-none">
                    <img
                    src={data[i].food_image}
                    alt={data[i].food_name}
                    className={
                        data[i].food_available === "no"
                        ? "w-full h-full object-center object-cover filter blur-md lg:w-full lg:h-full"
                        : "w-full h-full object-center object-cover lg:w-full lg:h-full"
                    }
                    />
                    {
                        data[i].food_available === "no"
                        ? <div className="absolute top-0 w-full h-full flex justify-center items-center">
                            <p className="font-bold text-gray-600">Not Available</p>
                        </div>
                        : <></>
                    }
                    {
                        data[i].food_discount === "yes"
                        ? <div className="absolute top-0 right-0 bg-red-500 flex justify-center m-2 p-1 rounded-lg text-white">
                            <Speakerphone className="w-5 h-5 text-white"/>
                            RM 2 OFF
                        </div>
                        : <></>
                    }
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                    <h3 className="text-sm text-gray-700">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {data[i].food_name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{data[i].food_categories}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{data[i].food_price}</p>
                </div>
                </div>)
            }
        }
        return list;
    }

    return (
        <div className="min-h-screen w-full">
            <ToastContainer />
            {
                loading ? (
                    <div className="h-screen w-full bg-gray-200 flex justify-center items-center">
                        <ClimbingBoxLoader size="30" color={"#1A1B1B"}/>
                    </div>
                ) : (
                    <>
                    {
                        ! success
                        ? <div className="flex-col w-full min-h-screen p-10">
                            <h1 className="text-red-500 font-bold text-center py-4 text-lg">404 Page Not Found</h1>
                            <h1 className="text-red-500 font-bold text-center py-4 text-lg">Please contect the restaurant to
                            to fix this issue, sorry for the error.</h1>
                        </div>
                        : <main className="flex-col relative w-full bg-gray-100 overflow-hidden overflow-y-auto">
                            <div className="w-full flex-col">
                                <img className="w-full h-60 object-cover" src={userDetail.image}/>
                                <div className="max-w-7xl mx-auto py-2 px-4 relative sm:px-6 lg:px-8">
                                    <div className="my-2 flex">
                                        <h2 className="font-bold text-gray-700 text-2xl">
                                            {userDetail.name}. {userDetail.cuisine} Cuisine
                                        </h2>
                                    </div>
                                    <div className="my-2 flex">
                                        <CurrencyDollar className={
                                            userDetail.range > 0
                                            ? "w-5 h-5 text-yellow-500"
                                            : "w-5 h-5"
                                        }/>
                                        <CurrencyDollar className={
                                            userDetail.range > 1
                                            ? "w-5 h-5 text-yellow-500"
                                            : "w-5 h-5"
                                        }/>
                                        <CurrencyDollar className={
                                            userDetail.range > 2
                                            ? "w-5 h-5 text-yellow-500"
                                            : "w-5 h-5"
                                        }/>
                                        <CurrencyDollar className={
                                            userDetail.range > 3
                                            ? "w-5 h-5 text-yellow-500"
                                            : "w-5 h-5"
                                        }/>
                                        <h4 className="ml-2 font-bold text-gray-600">
                                            {
                                                menuCategories.map((data) => {
                                                    return " . " + data
                                                })
                                            }
                                        </h4>
                                    </div>
                                </div>
                                <div className="absolute top-5 right-5 p-2 rounded-full bg-white sm:top-10 sm:right-10">
                                    <ShoppingBag className="w-9 h-9 cursor-pointer text-blue-900 sm:w-12 sm:h-12"/>
                                    <span className="bg-blue-300 text-blue-700 z-10 absolute top-1 right-2 px-2 rounded-full">0</span>
                                </div>
                            </div>
                            <div>
                            <div className="bg-white">
                                <div className="max-w-2xl mx-auto pb-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                                    {
                                        menuCategories.map((data) => {
                                            return <div key={data}>
                                            <h2 className="text-2xl font-extrabold tracking-tight pt-6 text-gray-900">{data}</h2>
                                            <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
                                                {insertingMenuFunction(menu, data)}
                                            </div>
                                            </div>
                                        })
                                    }
                                </div>
                                </div>
                            </div>
                        </main>
                    }
                    </>
                )
            }
        </div>
    )
}

export default Customer
