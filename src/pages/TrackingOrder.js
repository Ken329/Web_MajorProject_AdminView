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
    const [orderId, setOrderId] = useState("");
    const [orderDetail, setOrderDetail] = useState([]);
    const [orderMenu, setOrderMenu] = useState([]);
    const [orderMenuDetail, setOrderMenuDetail] = useState([]);

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
                    const queryString = window.location.search;
                    const urlParams = new URLSearchParams(queryString);
                    const orderId = urlParams.get('uid');
                    setOrderId(orderId);
                    getOrderData(id, orderId)
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

    function getOrderData(id, orderId){
        Axios.post("https://eatsy-0329.herokuapp.com/trackOrderWithOrderId", {
            id: id,
            orderId: orderId
        })
        .then((res) => {
            if(res.data.success){
                const data = res.data.data[0]
                setOrderDetail(data);
                getOrderFood(data.order_food);
                setLoading(false);
            }
        })
    }
    function getOrderFood(food){
        const id = cookies.get("user_id")

        const myFood = JSON.parse(food);
        const foodList = myFood.food;
        var foodListId = [];
    
        for(var i = 0; i < foodList.length; i++){
            setOrderMenuDetail(array => [...array, foodList[i]]);
            foodListId.push(foodList[i].id)
        }
        
        Axios.post("https://eatsy-0329.herokuapp.com/trackingFoodWithId", {
            restaurantId: id,
            foodId: foodListId
        })
        .then((res) => {
            const myFood = res.data.data;
            for(var i = 0; i < myFood.length; i++){
                setOrderMenu(array => [...array, myFood[i]])
            }
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
                        credit={userDetail.user_credit}
                        section={3}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Tracking Order: {orderId}</h1>
                        </div>
                    </header>
                    <main className="w-4/5 mx-auto my-5 flex">
                        <section className="flex-col w-6/12">
                            {
                                orderMenu.map((data, index) => {
                                    return <div key={index} className="w-full h-28 flex rounded-lg bg-white my-3">
                                                <img className="h-full w-3/12 rounded-l-lg" src={data.food_image}/>
                                                <div className="flex-col w-9/12">
                                                    <h5 className="w-full h-2/4 text-center pt-2">{data.food_name}</h5>
                                                    <div className="flex pl-3 w-full">
                                                        <p className="w-6/12 text-center">Quantity: {orderMenuDetail[index].quantity}</p>
                                                        <p className="w-6/12 text-center">RM {orderMenuDetail[index].price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                })
                            }
                        </section>
                        <section className="flex-col w-6/12 pl-10 text-gray-700">
                            <p className="my-2">Customer: {orderDetail.order_customer === undefined ? "-" : orderDetail.order_customer}</p>
                            <p className="my-2">Email: {orderDetail.order_email === undefined ? "-" : orderDetail.order_email}</p>
                            <p className="my-2">Phone Number: {orderDetail.order_phone === undefined ? "-" : orderDetail.order_phone}</p>
                            <p className="my-2">Paying Method: {orderDetail.order_method === undefined ? "-" : orderDetail.order_method}</p>
                            <p className="my-2">Having Type: {orderDetail.order_type}</p>
                            <p className="my-2">Total Amount: RM{orderDetail.order_amount}</p>
                            <p className="my-2">Status: {orderDetail.order_status}</p>
                        </section>
                    </main>
                    </>
                )
            }
        </div>
    )
}

export default TracksPage
