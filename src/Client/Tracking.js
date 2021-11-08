import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { ClimbingBoxLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomerFooter from '../components/CustomerFooter';

function TracksOrder() {
    const [loading, setLoading] = useState(true);

    const [orderDetail, setOrderDetail] = useState([]);
    const [orderMenu, setOrderMenu] = useState([]);
    const [orderMenuDetail, setOrderMenuDetail] = useState([]);

    const [success, setSuccess] = useState(false);

    useEffect( () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const orderId = urlParams.get('order_id');
        const id = urlParams.get('res_id');
        
        if(id !== undefined && id !== "" && id !== null && orderId !== undefined && orderId !== "" && orderId !== null){
            Axios.post("https://eatsy-0329.herokuapp.com/trackOrderWithOrderId", {
                id: id,
                orderId: orderId
            })
            .then( (res) => {
                if(res.data.data.length !== 0){
                    const data = res.data.data[0]
                    setOrderDetail(data);
                    getOrderFood(data.order_food, id);
                    setSuccess(true);
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

    // useEffect( () => {
    //     const interval = setInterval(() => {
    //         const queryString = window.location.search;
    //         const urlParams = new URLSearchParams(queryString);
    //         const orderId = urlParams.get('order_id');
    //         const id = urlParams.get('res_id');
            
    //         if(id !== undefined && id !== "" && id !== null && orderId !== undefined && orderId !== "" && orderId !== null){
    //             Axios.post("https://eatsy-0329.herokuapp.com/trackOrderWithOrderId", {
    //                 id: id,
    //                 orderId: orderId
    //             })
    //             .then( (res) => {
    //                 if(res.data.data.length !== 0){
    //                     const data = res.data.data[0];
    //                     setOrderDetail(data);
    //                     setSuccess(true)
    //                 }else{
    //                     setSuccess(false);
    //                     setLoading(false);
    //                 }
    //             })
    //         }else{
    //             setSuccess(false);
    //             setLoading(false);
    //         }
    //     }, 3000);

    //     return () => clearInterval(interval);
    // }, [] )

    function getOrderFood(food, id){
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
            setLoading(false);
        })
    }

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <ToastContainer />
            <div className="min-h-screen w-full">
            {
                loading ? (
                    <div className="h-screen w-full bg-gray-200 flex justify-center items-center">
                        <ClimbingBoxLoader size="30" color={"#1A1B1B"}/>
                    </div>
                ) : (
                    <>
                    {
                        success
                        ? <> 
                        <main className="w-full mx-auto relative min-h-screen md:w-4/5">
                            <section className="w-full py-5 flex flex-col items-center border-b-2 border-gray-300">
                                <div className="w-full flex items-center justify-center">
                                    <img className="w-20 h-20 mx-2 md:w-25 md:h-25 md:mx-3 lg:w-30 lg:h-30 lg:mx-5" src="../img/logo2.png"/>
                                    <div>
                                        <p className="my-2 mx-3 text-xs md:text-sm lg:text-base">Customer Name: {orderDetail.order_customer}</p>
                                        <p className="my-2 mx-3 text-xs md:text-sm lg:text-base">Customer Email: {orderDetail.order_email}</p>
                                        <p className="my-2 mx-3 text-xs md:text-sm lg:text-base">Customer Phone: {orderDetail.order_phone}</p>
                                        <p className="my-2 mx-3 text-xs md:text-sm lg:text-base">Having Option: {orderDetail.order_type}</p>
                                        <p className="my-2 mx-3 text-xs md:text-sm lg:text-base">Total Amount: RM{orderDetail.order_amount}</p>
                                    </div>
                                </div>
                                <div className="w-full px-5 mt-4 mb-2 flex justify-end text-xs md:mb-3 lg:mb-4">
                                    Ordered by: 
                                    {" " + new Date(orderDetail.order_date.seconds * 1000).toLocaleDateString() + " " +
                                    new Date(orderDetail.order_date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                </div>
                                <div className="w-full flex h-2 px-4 rounded-t-lg md:px-0">
                                    {
                                        orderDetail.order_status === "pending"
                                        ? <>
                                            <div className="w-1/5 bg-blue-300 rounded-l-lg"></div>
                                            <div className="w-4/5 bg-gray-300 rounded-r-lg"></div>
                                        </>
                                        : orderDetail.order_status === "approved"
                                        ? <>
                                            <div className="w-2/5 bg-blue-300 rounded-l-lg"></div>
                                            <div className="w-3/5 bg-gray-300 rounded-r-lg"></div>
                                        </>
                                        : orderDetail.order_status === "prepare"
                                        ? <>
                                            <div className="w-3/5 bg-blue-300 rounded-l-lg"></div>
                                            <div className="w-2/5 bg-gray-300 rounded-r-lg"></div>
                                        </>
                                        : orderDetail.order_status === "almost"
                                        ? <>
                                            <div className="w-4/5 bg-blue-300 rounded-l-lg"></div>
                                            <div className="w-1/5 bg-gray-300 rounded-r-lg"></div>
                                        </>
                                        : <>
                                            <div className="w-full bg-blue-300 rounded-l-lg"></div>
                                            <div className="w-0 bg-gray-300 rounded-r-lg"></div>
                                        </>
                                    }
                                </div>
                                <div className="w-full grid grid-cols-5 px-4 md:px-0">
                                    <p className={
                                        orderDetail.order_status === "pending"
                                        ? "my-2 text-center font-bold text-blue-600 text-xs md:text-sm lg:text-base"
                                        : "my-2 text-center text-xs md:text-sm lg:text-base"
                                    }>Pending</p>
                                    <p className={
                                        orderDetail.order_status === "approved"
                                        ? "my-2 text-center font-bold text-blue-600 text-xs md:text-sm lg:text-base"
                                        : "my-2 text-center text-xs md:text-sm lg:text-base"
                                    }>Approved</p>
                                    <p className={
                                        orderDetail.order_status === "prepare"
                                        ? "my-2 text-center font-bold text-blue-600 text-xs md:text-sm lg:text-base"
                                        : "my-2 text-center text-xs md:text-sm lg:text-base"
                                    }>Preparing</p>
                                    <p className={
                                        orderDetail.order_status === "almost"
                                        ? "my-2 text-center font-bold text-blue-600 text-xs md:text-sm lg:text-base"
                                        : "my-2 text-center text-xs md:text-sm lg:text-base"
                                    }>Almost</p>
                                    <p className={
                                        orderDetail.order_status === "done"
                                        ? "my-2 text-center font-bold text-blue-600 text-xs md:text-sm lg:text-base"
                                        : "my-2 text-center text-xs md:text-sm lg:text-base"
                                    }>Done</p>
                                </div>
                            </section>
                            <section className="w-full grid grid-cols-1 md:grid-cols-2">
                                {
                                    orderMenu.map((data, index) => {
                                        return <div 
                                                key={orderMenuDetail[index].id}
                                                className="flex mx-5 my-3 bg-white rounded-md p-2 items-center">
                                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                                    <img
                                                    src={data.food_image}
                                                    alt={data.food_name}
                                                    className="w-full h-full object-center object-cover"
                                                    />
                                                </div>
                                                <div className="mx-4 flex-1 flex flex-col">
                                                    <div className="flex justify-between text-xs md:text-sm lg:text-base font-medium text-gray-900">
                                                        <h3>{data.food_name}</h3>
                                                        <p className="ml-4">RM{orderMenuDetail[index].price}</p>
                                                    </div>
                                                    <p className="mt-1 text-xs md:text-sm text-gray-500">{data.food_categories}</p>
                                                    <p className="mt-1 text-xs md:text-sm text-gray-500">Qty {orderMenuDetail[index].quantity}</p>       
                                                </div>
                                            </div>
                                    })
                                }
                            </section>
                        </main>
                        <CustomerFooter />
                        </>
                        : <div className="flex-col w-full min-h-screen p-10">
                            <h1 className="text-red-500 font-bold text-center py-4 text-lg">404 Page Not Found</h1>
                            <h1 className="text-red-500 font-bold text-center py-4 text-lg">Please contect the restaurant to
                            to fix this issue, sorry for the error.</h1>
                        </div>
                    }
                        
                    </>
                )
            }
            </div>
        </div>
    )
}

export default TracksOrder
