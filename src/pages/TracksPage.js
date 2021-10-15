import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);
    const [userOrder, setUserOrder] = useState([]);
    const [userTable, setUserTable] = useState([]);

    const [trackingBtn, setTrackingBtn] = useState([]);

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
                    Axios.post("https://eatsy-0329.herokuapp.com/getOrderWithIdNDate", {
                        id: id,
                    })
                    .then((res) => {
                        if(res.data.success){
                            setUserOrder([]);
                            const data = res.data.data;
                            for(var i = 0; i < data.length; i++){
                                setUserOrder(array => [...array, data[i]]);
                            }
                            setTrackingBtn("order");
                            setLoading(false);
                        }
                    })
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 


    // getting data
    function getTableData(id){

    }

    // personal used function
    function filterOrderStatus(status){
        switch(status){
            case "pending":
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {status}
                        </span>
            case "approve":
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                            {status}
                        </span>
            case "prepare":
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {status}
                        </span>
            case "almost":
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {status}
                        </span>
            default:
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {status}
                        </span>
        }
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
                        last_name={"Ken"} 
                        first_name={"Liau"} 
                        gender={userDetail.user_gender}
                        section={3}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Tracking</h1>
                        </div>
                    </header>
                    <main className="flex-col relative overflow-hidden">
                        <section className="w-4/5 h-auto flex mx-auto py-5">
                            <div 
                                id="order-btn"
                                onClick={ e => {
                                    setTrackingBtn("order")
                                }}
                                className={
                                    trackingBtn === "order" ? "bg-gray-200 py-2 px-3 rounded-lg m-2 cursor-pointer"
                                    : "bg-white py-2 px-3 rounded-lg m-2 cursor-pointer"
                                }
                                >
                                    Order
                            </div>
                            <div 
                                id="table-btn"
                                onClick={ e => {
                                    setTrackingBtn("table")
                                }}
                                className={
                                    trackingBtn === "table" ? "bg-gray-200 py-2 px-3 rounded-lg m-2 cursor-pointer"
                                    : "bg-white py-2 px-3 rounded-lg m-2 cursor-pointer"
                                }
                                >
                                    Table
                            </div>
                        </section>
                        <div className="flex flex-col">
                        <section className="w-11/12 mx-auto pb-5">
                            <div className="align-middle inline-block min-w-full">
                                {
                                    trackingBtn === "order" ?
                                    userOrder.length <= 0 ? (
                                        <p className="w-full text-center text-gray-500 font-bold">No Tracking order</p>
                                    ) : (
                                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    ID
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
                                                    Status
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
                                                    Amount
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {
                                                    userOrder.map( (data, index) => {
                                                        return <tr key={index}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.order_id}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.order_type}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                    {filterOrderStatus(data.order_status)}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(data.order_date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RM {data.order_amount}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <a href={"/Tracking/TrackingOrder?uid="+data.order_id} className="text-indigo-600 hover:text-indigo-900">
                                                                        View
                                                                    </a>
                                                                    </td>
                                                                </tr>
                                                    })
                                                }
                                            </tbody>
                                            </table>
                                        </div>
                                    )
                                    : userOrder.length <= 0 ? (
                                        <p className="w-full text-center text-gray-500 font-bold">No Tracking order</p>
                                    ) : (
                                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    ID
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
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Date
                                                </th>
                                                {/* <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Amount
                                                </th> */}
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {
                                                    userOrder.map( (data, index) => {
                                                        return <tr key={index}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.order_id}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.order_type}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                    {filterOrderStatus(data.order_status)}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(data.order_date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RM {data.order_amount}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <a href={"/Tracking/TrackingOrder?uid="+data.order_id} className="text-indigo-600 hover:text-indigo-900">
                                                                        View
                                                                    </a>
                                                                    </td>
                                                                </tr>
                                                    })
                                                }
                                            </tbody>
                                            </table>
                                        </div>
                                    )
                                }
                            </div>
                        </section>
                        </div>
                    </main>
                    </>
                )
            }
        </div>
    )
}

export default TracksPage
