import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cash, Trash } from 'heroicons-react';

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);

    const [allOrder, setAllOrder] = useState([]);
    
    useEffect( () => {
        const id = cookies.get("eatsy_id");
        
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
                    insertAllOrder(id);
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

    // insert all order record
    function insertAllOrder(id){
        Axios.post('https://eatsy-0329.herokuapp.com/getAllOrder', {
            id: id,
        })
        .then((res) => {
            var foodData = res.data.data;
            setAllOrder([]);
            for(var i = foodData.length - 1; i >= 0; i--){
                setAllOrder(array => [...array, foodData[i]])
            }
            setLoading(false);
        })
    }

    // delelte order record
    function deleteOrderRecord(orderId){
        const id = cookies.get("eatsy_id");;
        
        Axios.post("https://eatsy-0329.herokuapp.com/deleteOrderData", {
            id: id,
            orderId: orderId
        })
        .then((res) => {
            toast.success(res.data.data, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
            insertAllOrder(id);
        })
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
                        <h1 className="text-3xl font-bold text-gray-900">Eatsy Coin</h1>
                        </div>
                    </header>
                    <main className="flex-col relative w-4/5 mx-auto pb-5 mt-5 overflow-hidden overflow-y-auto">
                        <div className="align-middle inline-block min-w-full">
                            <div className="shadow overflow-hidden border-b border-gray-300 sm:rounded-lg">
                                <div className="flex items-center py-2 px-3 text-sm font-bold md:text-base lg:text-lg">
                                    Total Balance: 
                                    <Cash className="w-4 h-4 ml-1"/>
                                    {userDetail.user_credit}
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Date
                                            </th>
                                            <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Time
                                            </th>
                                            <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Type
                                            </th>
                                            <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Amount
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Delete</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    {
                                        allOrder.map((data) => {
                                            return <tbody 
                                                    key={data.date}
                                                    className="bg-white divide-y divide-gray-200">
                                                        <tr>
                                                            <td colSpan="5" className="py-3 px-8 font-semibold  bg-gray-50">
                                                                {new Date(data.date* 1000).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                        {
                                                            data.data.map((data) => {
                                                                return <tr key={data.order_id}>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {new Date(data.order_date.seconds * 1000).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {new Date(data.order_date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {"Cash In"}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    RM {data.order_amount}
                                                                </td>
                                                                <td 
                                                                className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <Trash 
                                                                    onClick={e => deleteOrderRecord(data.order_id)}
                                                                    className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-900"/>
                                                                </td>       
                                                            </tr>
                                                            })
                                                        }
                                                </tbody>
                                            })
                                        }
                                </table>
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
