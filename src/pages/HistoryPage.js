import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Trash, ViewBoards } from 'heroicons-react';

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);
    const [userOrder, setUserOrder] = useState([]);
    const [userTable, setUserTable] = useState([]);

    const [historyBtn, setHistoryBtn] = useState("Order");

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
                    getOrderData(id);
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

    // getting data function
    function getOrderData(id){
        Axios.post('https://eatsy-0329.herokuapp.com/getOrderWithId', {
            id: id
        })
        .then((res) => {
            if(res.data.success){
                setUserOrder([])
                const data = res.data.data;
                for(var i = 0; i < data.length; i++){
                    setUserOrder(array => [...array, data[i]])
                }
                setLoading(false);
                getTabledata(id);
            }
        })
    }
    function getTabledata(id){
        Axios.post('https://eatsy-0329.herokuapp.com/getTableWithId', {
            id: id
        })
        .then((res) => {
            if(res.data.success){
                setUserTable([]);
                const data = res.data.data;
                for(var i = 0; i < data.length; i++){
                    setUserTable(array => [...array, data[i]])
                }
            }
        })
    }

    // delete data function
    function deleteOrderData(e, orderId){
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
            getOrderData(id);
        })
    }
    function deleteTableData(e, tableId){
        const id = cookies.get("eatsy_id");;

        Axios.post("https://eatsy-0329.herokuapp.com/deleteTableData", {
            id: id,
            tableId: tableId
        })
        .then((res) => {
            toast.success(res.data.data, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
            getOrderData(id);
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
                        last_name={"Ken"} 
                        first_name={"Liau"} 
                        gender={userDetail.user_gender}
                        section={4}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">{historyBtn} History</h1>
                        </div>
                    </header>
                    <main className="flex-col relative overflow-hidden">
                        <section className="flex w-4/5 py-4 mx-auto">
                            <button 
                                onClick={e => {
                                    setHistoryBtn("Order")
                                }}
                                className={
                                historyBtn === "Order" ? "m-2 px-3 py-2 rounded-lg bg-gray-200"
                                : "m-2 px-3 py-2 rounded-lg bg-white"
                            }>Order</button>
                            <button 
                                onClick={e => {
                                    setHistoryBtn("Table")
                                }}
                                className={
                                historyBtn === "Table" ? "m-2 px-3 py-2 rounded-lg bg-gray-200"
                                : "m-2 px-3 py-2 rounded-lg bg-white"
                            }>Table</button>
                        </section>
                        <div className="flex flex-col">
                        <section className="w-11/12 mx-auto pb-5">
                            <div className="align-middle inline-block min-w-full">
                                {
                                    historyBtn === "Order" ?
                                    userOrder.length === 0 ? (
                                        <p className="w-full text-center text-gray-500 font-bold">No Order History</p>
                                    ) : (
                                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
                                                    <span className="sr-only">View</span>
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Delete</span>
                                                </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {
                                                    userOrder.map( (data, index) => {
                                                        return <tr key={index}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(data.order_date.seconds * 1000).toLocaleDateString()}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(data.order_date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.order_type}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RM {data.order_amount}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                        <a href={"/TrackingOrder?uid="+data.order_id} className="text-gray-600 hover:text-gray-900">
                                                                            <ViewBoards className="w-5 h-5"/>
                                                                        </a>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900">
                                                                        <Trash 
                                                                            onClick={e => deleteOrderData(e, data.order_id)}
                                                                            className="w-5 h-5"/>
                                                                    </td>
                                                                </tr>
                                                    })
                                                }
                                            </tbody>
                                            </table>
                                        </div>
                                    ) 
                                    : userTable.length === 0 ? (
                                        <p className="w-full text-center text-gray-500 font-bold">No Table History</p>
                                    ) : (
                                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Phone Number
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Pax
                                                </th>
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
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Delete</span>
                                                </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                            {
                                                    userTable.map( (data, index) => {
                                                        return <tr key={index}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.name}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.phone}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.pax}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(data.date.seconds * 1000).toLocaleDateString()}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(data.date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900">
                                                                        <Trash 
                                                                            onClick={e => deleteTableData(e, data.id)}
                                                                            className="w-5 h-5"/>
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
