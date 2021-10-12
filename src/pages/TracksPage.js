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
    const [userOrderId, setUserOrderId] = useState([]);
    const [userOrder, setUserOrder] = useState([]);

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
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    Axios.post("http://localhost:4000/getOrderWithIdNDate", {
                        id: id,
                        date: date
                    })
                    .then((res) => {
                        if(res.data.success){
                            setUserOrder([]);
                            const data = res.data.data;
                            for(var i = 0; i < data.length; i+=2){
                                setUserOrderId(array => [...array, data[i]])
                                setUserOrder(array => [...array, data[i+1]]);
                            }
                            setLoading(false);
                        }
                    })
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

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
                                className="bg-white py-2 px-3 rounded-lg m-2 cursor-pointer">
                                    Order
                            </div>
                            <div 
                                id="table-btn"
                                className="bg-white py-2 px-3 rounded-lg m-2 cursor-pointer">
                                    Table
                            </div>
                        </section>
                        <div className="flex flex-col">
                        <section className="w-11/12 mx-auto pb-5">
                            <div className="align-middle inline-block min-w-full">
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
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userOrderId[index]}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.order_type}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                        {filterOrderStatus(data.order_status)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.order_date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RM {data.order_amount}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                            View
                                                        </a>
                                                        </td>
                                                    </tr>
                                        })
                                    }
                                    {/* <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{"dsasad"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{"Take Away"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Pending
                                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{"11/12/2021"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{"RM 11.20"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                            View
                                        </a>
                                        </td>
                                    </tr> */}
                                    {/* {people.map((person) => (
                                    <tr key={person.email}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={person.image} alt="" />
                                            </div>
                                            <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{person.name}</div>
                                            <div className="text-sm text-gray-500">{person.email}</div>
                                            </div>
                                        </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{person.title}</div>
                                        <div className="text-sm text-gray-500">{person.department}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                        </a>
                                        </td>
                                    </tr>
                                    ))} */}
                                </tbody>
                                </table>
                            </div>
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
