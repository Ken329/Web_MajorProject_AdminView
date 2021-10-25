import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusCircle, ViewBoards } from 'heroicons-react';

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);
    const [userOrder, setUserOrder] = useState([]);
    const [userTable, setUserTable] = useState([]);

    const [trackingBtn, setTrackingBtn] = useState("Order");
    const [tableBtn, setTableBtn] = useState(false);

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
                    getOrderData(id);
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 


    // getting data
    function getOrderData(id){
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
                getTableData(id);
                setLoading(false);
            }
        })
    }
    function getTableData(id){
        Axios.post("https://eatsy-0329.herokuapp.com/getTableWithIdNDate", {
            id: id
        })
        .then((res) => {
            if(res.data.success){
                const data = res.data.data;
                setUserTable([]);
                for(var i = 0; i < data.length; i++){
                    setUserTable(array => [...array, data[i]]);
                }
            }
        })
    }

    // getting input data function
    function newTableInsert(e){
        var input = document.getElementsByClassName("table-input");
        var data = [];
        for(var myInput of input){
            data.push(myInput.value);
        }
        
        const id = cookies.get("user_id");
        var tableId = uniqueId();
        Axios.post("https://eatsy-0329.herokuapp.com/insertNewTable", {
            id: id,
            tableId: tableId,
            name: data[0],
            phone: data[1],
            pax: data[2],
            status: data[3],
            date: data[4]
        })
        .then((res) => {
            getTableData(id);
            setTableBtn(false);
            for(var myInput of input){
                myInput.value = "";
            }
            toast.success(res.data.data, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        })
    }
    
    // update data
    function updateOrderStatus(e, orderId){
        const id = cookies.get("user_id");
        var status = e.target.value;
        
        Axios.put("https://eatsy-0329.herokuapp.com/updateOrderStatus", {
            id: id, 
            orderId: orderId,
            status: status
        })
        .then((res) => {
            if(res.data.success){
                getOrderData(id)
                toast.success(res.data.data, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            }
        })
    }
    function updateTableStatus(e, index){
        const id = cookies.get("user_id");
        const status = e.target.value;
        
        Axios.put("https://eatsy-0329.herokuapp.com/updateTableStatus", {
            id: id,
            tableId: userTable[index].id,
            status: status,
        })
        .then((res) => {
            getTableData(id);
            toast.success(res.data.data, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        })
    }

    // personal used function
    function uniqueId () {
        var idStrLen = 20;
        var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
        idStr += (new Date()).getTime().toString(36) + "_";
        do {
            idStr += (Math.floor((Math.random() * 35))).toString(36);
        } while (idStr.length < idStrLen);
    
        return (idStr);
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
                        <h1 className="text-3xl font-bold text-gray-900">Tracking {trackingBtn}</h1>
                        </div>
                    </header>
                    <main className="flex-col relative overflow-hidden">
                        <section className="w-4/5 h-auto flex mx-auto py-5">
                            <div 
                                id="order-btn"
                                onClick={ e => {
                                    setTrackingBtn("Order")
                                }}
                                className={
                                    trackingBtn === "Order" ? "bg-gray-200 py-2 px-3 rounded-lg m-2 cursor-pointer"
                                    : "bg-white py-2 px-3 rounded-lg m-2 cursor-pointer"
                                }
                                >
                                    Order
                            </div>
                            <div 
                                id="table-btn"
                                onClick={ e => {
                                    setTrackingBtn("Table")
                                }}
                                className={
                                    trackingBtn === "Table" ? "bg-gray-200 py-2 px-3 rounded-lg m-2 cursor-pointer"
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
                                    trackingBtn === "Order" ?
                                    userOrder.length <= 0 ? (
                                        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex justify-center items-center">
                                            <a
                                            href="/Dashboard"
                                            className="border-4 border-dashed border-gray-200 rounded-lg p-10 cursor-pointer hover:text-gray-900">
                                                <PlusCircle className="mx-auto my-2 text-gray-700"/>
                                                <p className="text-gray-700">Create new order from here</p>
                                            </a>
                                        </div>
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
                                                                        <select 
                                                                            onChange={e => {
                                                                                updateOrderStatus(e, data.order_id)
                                                                            }}
                                                                            className={
                                                                                data.order_status === "pending" 
                                                                                ? "px-2 py-1 bg-yellow-100 text-yellow-800 shadow-lg rounded-xl border-0 outline-none focus:border-gray-50"
                                                                                : data.order_status === "approve" ?
                                                                                "px-2 py-1 bg-pink-100 text-pink-800 shadow-lg rounded-xl border-0 outline-none focus:border-gray-50"
                                                                                : data.order_status === "prepare" ?
                                                                                "px-2 py-1 bg-indigo-100 text-indigo-800 shadow-lg rounded-xl border-0 outline-none focus:border-gray-50"
                                                                                : data.order_status === "almost" ?
                                                                                "px-2 py-1 bg-purple-100 text-purple-800 shadow-lg rounded-xl border-0 outline-none focus:border-gray-50"
                                                                                : "px-2 py-1 bg-green-100 text-green-800 shadow-lg rounded-xl border-0 outline-none focus:border-gray-50"
                                                                            }
                                                                            defaultValue={data.order_status}>
                                                                                <option value="pending">Pending</option>
                                                                                <option value="approve">Approved</option>
                                                                                <option value="prepare">Prepare</option>
                                                                                <option value="almost">Almost</option>
                                                                                <option value="done">Done</option>
                                                                        </select>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(data.order_date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RM {data.order_amount}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                        <a href={"/TrackingOrder?uid="+data.order_id} className="text-gray-600 hover:text-gray-900">
                                                                            <ViewBoards className="w-5 h-5"/>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                    })
                                                }
                                            </tbody>
                                            </table>
                                        </div>
                                    )
                                    : userTable.length <= 0 ? (
                                        <p className="w-full text-center text-gray-700 font-bold">No Tracking Table</p>
                                    ) : (
                                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                            <p 
                                                onClick={e => {
                                                    tableBtn ? setTableBtn(false) : setTableBtn(true)
                                                }}
                                                className="py-2 m-2 w-1/12 text-center cursor-pointer bg-white rounded-md">
                                                New
                                            </p>
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
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Date and Time
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Update</span>
                                                </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {
                                                    tableBtn ? <tr>
                                                        <td className="pr-6 pl-2 py-4">
                                                            <input 
                                                                className="px-2 py-1 bg-white shadow-lg rounded-xl border-0 
                                                                outline-none w-40 focus:border-gray-50 table-input" 
                                                                placeholder="Customer name"/>
                                                        </td>
                                                        <td className="pr-6 pl-2 py-4">
                                                            <input 
                                                                className="px-2 py-1 bg-white shadow-lg rounded-xl border-0 
                                                                outline-none w-40 focus:border-gray-50 table-input" 
                                                                placeholder="Phone number"/>
                                                        </td>
                                                        <td className="pr-6 pl-2 py-4">
                                                            <select 
                                                                className="px-2 py-1 bg-white shadow-lg rounded-xl border-0 outline-none 
                                                                focus:border-gray-50 table-input">
                                                                    <option value="2">2</option>
                                                                    <option value="3">3</option>
                                                                    <option value="4">4</option>
                                                                    <option value="5">5</option>
                                                                    <option value="6">6</option>
                                                                    <option value="7">7</option>
                                                                    <option value="8">8</option>
                                                                    <option value="9">9</option>
                                                            </select>   
                                                        </td>
                                                        <td className="pr-6 pl-2 py-4">
                                                            <select 
                                                                className="px-2 py-1 bg-white shadow-lg rounded-xl border-0 outline-none 
                                                                focus:border-gray-50 table-input">
                                                                    <option value="pending">Pending</option>
                                                                    <option value="approved">Approved</option>
                                                                    <option value="decline">Decline</option>
                                                            </select>
                                                        </td>
                                                        <td className="pr-6 pl-2 py-4">
                                                            <input 
                                                                className="px-2 py-1 w-60 bg-white shadow-lg rounded-xl border-0 outline-none 
                                                                focus:border-gray-50 table-input" 
                                                                type="datetime-local"/>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <p 
                                                                onClick={e => newTableInsert(e)}
                                                                className="text-indigo-600 cursor-pointer hover:text-indigo-900">
                                                                Insert
                                                            </p>
                                                        </td>
                                                    </tr> : <></>
                                                }
                                                {
                                                    userTable.map( (data, index) => {
                                                        return <tr key={index}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.name}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.phone}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.pax}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <select 
                                                                            onChange={e => updateTableStatus(e, index)}
                                                                            className={
                                                                                data.status === "pending" 
                                                                                ? "px-2 py-1 bg-yellow-100 text-yellow-800 shadow-lg rounded-xl border-0 outline-none focus:border-gray-50"
                                                                                : data.status === "approved" ?
                                                                                "px-2 py-1 bg-pink-100 text-pink-800 shadow-lg rounded-xl border-0 outline-none focus:border-gray-50"
                                                                                : "px-2 py-1 bg-red-100 text-red-800 shadow-lg rounded-xl border-0 outline-none focus:border-gray-50"
                                                                            }
                                                                            defaultValue={data.status}>
                                                                                <option value="pending">Pending</option>
                                                                                <option value="approved">Approved</option>
                                                                                <option value="decline">Decline</option>
                                                                        </select>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {
                                                                            new Date(data.date.seconds * 1000).toLocaleDateString() + " " +
                                                                            new Date(data.date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                                                        }
                                                                    </td>
                                                                    <td></td>
                                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                        <p 
                                                                            onClick={e => updateTableStatus(e, index)}
                                                                            className="text-indigo-600 cursor-pointer hover:text-indigo-900">
                                                                            Update
                                                                        </p>
                                                                    </td> */}
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
