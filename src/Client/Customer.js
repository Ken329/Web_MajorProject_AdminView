import React, { useState, useEffect, Fragment } from 'react'
import Axios from 'axios'
import { ClimbingBoxLoader, PulseLoader, RingLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cash, CreditCard, CubeTransparent, CurrencyDollar, MinusCircle, PlusCircle, ShoppingBag, Speakerphone, Table } from 'heroicons-react';
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon, XIcon } from '@heroicons/react/outline'
import '../pages/scrollbar.css'
import CustomerFooter from '../components/CustomerFooter';
import { useHistory } from 'react-router-dom';

function Customer() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);
    const [menu, setMenu] = useState([]);

    const [success, setSuccess] = useState(true);

    const [open, setOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const [cartAction, setCartAction] = useState("cart");
    const [cartType, setCartType] = useState("");

    const [restaurantId, setRestaurantId] = useState('');
    const [restaurantTable, setRestaurantTable] = useState("");
    
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
                    setRestaurantId(id);
                    if(urlParams.get('table_no') !== null){
                        setRestaurantTable(urlParams.get('table_no'));
                    }
                    var data = res.data.data.data;
                    filteringCategories(data);
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
            var index = myData.findIndex(e => e.categories === data[i + 1].food_categories);
            if(index >= 0){
                var arr = myData[index].data
                arr.push({
                    id: data[i],
                    detail: data[i + 1]
                })
                myData[index].data = arr;
            }else{
                var arr = [];
                arr.push({
                    id: data[i],
                    detail: data[i + 1]
                })
                myData.push({
                    categories: data[i + 1].food_categories,
                    data: arr
                })
            }
        }
        myData = myData.sort((a, b) => a.categories < b.categories ? -1 : (a.categories > b.categories ? 1 : 0));
        setMenu(myData);
    }
    // addd to cart function
    function addToCart(id, detail){
        var data = {};
        var price = detail.food_price;

        // when item exist in cart
        var index = cart.findIndex(x => x.id === id);
        if(index >= 0){
            let arr = [...cart];
            arr[index] = {
                id: arr[index].id,
                price: (parseFloat(arr[index].singlePrice) * (parseInt(arr[index].quantity) + 1)).toFixed(2),
                singlePrice: arr[index].singlePrice,
                quantity: parseInt(arr[index].quantity) + 1,
                image: arr[index].image,
                name: arr[index].name,
                categories: arr[index].categories
            }
            setCart(arr);
            calculateTotalPrice(arr[index].singlePrice, "plus");
            return;
        }
        
        // when item has discount code
        if(detail.food_discount === "yes"){
            var newPrice = parseFloat(detail.food_price) - 2;
            price = newPrice.toFixed(2);
        }
        // when item doesnt exist in cart
        data = {
            id: id,
            quantity: 1,
            price: price,
            singlePrice: price,
            image: detail.food_image,
            name: detail.food_name,
            categories: detail.food_categories
        }
        setCart(array => [...array, data]);
        calculateTotalPrice(price, "plus");
    }
    // altering quantity of cart
    function alteringCart(index, action){
        let arr = [...cart];
        if(action === "minus"){
            arr[index] = {
                id: arr[index].id,
                price: (parseFloat(arr[index].singlePrice) * (parseInt(arr[index].quantity) - 1)).toFixed(2),
                singlePrice: arr[index].singlePrice,
                quantity: parseInt(arr[index].quantity) - 1,
                image: arr[index].image,
                name: arr[index].name,
                categories: arr[index].categories
            }
            if(arr.length !== 0){
                calculateTotalPrice(arr[index].singlePrice, "minus")
            }
            if(arr[index].quantity <= 0){
                arr.splice(index, 1); 
            }
            setCart(arr);
        }else{
            arr[index] = {
                id: arr[index].id,
                price: (parseFloat(arr[index].singlePrice) * (parseInt(arr[index].quantity) + 1)).toFixed(2),
                singlePrice: arr[index].singlePrice,
                quantity: parseInt(arr[index].quantity) + 1,
                image: arr[index].image,
                name: arr[index].name,
                categories: arr[index].categories
            }
            calculateTotalPrice(arr[index].singlePrice, "plus")
            setCart(arr);
        }
    }
    // deleting food from cart
    function deletingCart(index){
        let arr = [...cart];
        if(arr.length !== 0){
            calculateTotalPrice(arr[index].price, "minus")
        }
        arr.splice(index, 1); 
        setCart(arr);
    }
    // calculate total price
    function calculateTotalPrice(price, action){
        if(action === 'minus'){
            setTotal((parseFloat(total) - parseFloat(price)).toFixed(2))
            return;
        }
        setTotal((parseFloat(total) + parseFloat(price)).toFixed(2))
    }
    // proceed to checkout function
    function proceedToCheckout(type){
        var name = document.getElementById("information").elements['name'].value;
        var email = document.getElementById("information").elements['email'].value;
        var phone = document.getElementById("information").elements['phone'].value;
        var method = document.getElementById("information").elements['payment'].value;
        
        if(infoValidation(name) && infoValidation(email) && infoValidation(phone) && infoValidation(method)){
            if(emailValidation(email)){
                if(phoneNumberValidation(phone)){
                    if(type === "dine in"){
                        var table = document.getElementById("information").elements['table'].value;
                        if(infoValidation(table)){
                            var food = updateNewCart(cart);
                            var newTotal = (parseFloat(total) + (parseFloat(total) * 0.06)).toFixed(2);
                            var orderId = uniqueId(32);
                            setCartAction("payment");
                            Axios.post('https://eatsy-0329.herokuapp.com/dineInFromRestaurant', {
                                id: restaurantId,
                                orderId: orderId,
                                food: JSON.stringify({food: food}),
                                amount: newTotal.toString(),
                                customer: name,
                                phone: phone,
                                email: email,
                                type: "dine in",
                                status: "pending",
                                method: method,
                                table_no: table
                            })
                            .then((res) => {
                                setTimeout(() => {
                                    history.push(`/Client/Tracking?res_id=${restaurantId}&order_id=${orderId}`)
                                }, 3000)
                                toast.success(res.data.data, {
                                    position: toast.POSITION.TOP_RIGHT,
                                    autoClose: 3000
                                })
                            })
                        }
                    }else{
                        var food = updateNewCart(cart);
                        var newTotal = ((parseFloat(total) + (parseFloat(total) * 0.06)) + 2).toFixed(2);
                        var orderId = uniqueId(32);
                        setCartAction("payment");
                        Axios.post('https://eatsy-0329.herokuapp.com/takeAwayFromRestaurant', {
                            id: restaurantId,
                            orderId: orderId,
                            food: JSON.stringify({food: food}),
                            amount: newTotal.toString(),
                            customer: name,
                            phone: phone,
                            email: email,
                            type: "take away",
                            status: "pending",
                            method: method,
                        })
                        .then((res) => {
                            setTimeout(() => {
                                history.push(`/Client/Tracking?res_id=${restaurantId}&order_id=${orderId}`)
                            }, 3000)
                            toast.success(res.data.data, {
                                position: toast.POSITION.TOP_RIGHT,
                                autoClose: 3000
                            })
                        })
                    }
                }
            }
        }
    }
    function bookTable(){
        var name = document.getElementById("table").elements['name'].value;
        var email = document.getElementById("table").elements['email'].value;
        var phone = document.getElementById("table").elements['phone'].value;
        var pax = document.getElementById("table").elements['pax'].value;
        var date = document.getElementById("table").elements['date'].value;

        if(infoValidation(name) && infoValidation(email) && infoValidation(phone) && infoValidation(pax) && infoValidation(date)){
            if(emailValidation(email)){
                if(phoneNumberValidation(phone)){
                    var tableId = uniqueId(20);
                    Axios.post("https://eatsy-0329.herokuapp.com/insertNewTable", {
                        id: restaurantId,
                        tableId: tableId,
                        name: name,
                        phone: phone,
                        pax: pax,
                        status: "pending",
                        date: date,
                        email: email
                    })
                    .then((res) => {
                        setTimeout(() => {
                            setOpen(false)
                        }, 3000)
                        toast.success(res.data.data, {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 3000
                        })
                    })
                }
            }
        }
    }

    // validation
    function infoValidation(info){
        if(info !== ""){
            return true
        }
        toast.error("Fill up all the needed information!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });
        return false;
    }
    function emailValidation(mail) 
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        {
            return true;
        }
        toast.error("You have entered an invalid email address!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });
        return false;
    }
    function phoneNumberValidation(phone){
        if(/^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/.test(phone)){
            return true;
        }
        toast.error("You have entered an invalid phone number!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });
        return false;
    }

    // personal used function
    function updateNewCart(cart){
        var newCart = [];
        for(var i = 0; i < cart.length; i++){
            var data = {
                id: cart[i].id,
                quantity: cart[i].quantity,
                price: cart[i].price
            }
            newCart.push(data);
        }
        return newCart;
    }
    function uniqueId (idStrLen) {
        var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
        idStr += (new Date()).getTime().toString(36) + "_";
        do {
            idStr += (Math.floor((Math.random() * 35))).toString(36);
        } while (idStr.length < idStrLen);
    
        return (idStr);
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
                        : <> 
                        <main className="flex-col relative w-full min-h-screen bg-gray-100 overflow-hidden overflow-y-auto">
                            <Transition.Root show={open} as={Fragment}>
                            <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
                                <div className="absolute inset-0 overflow-hidden">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-500"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-500"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                </Transition.Child>
                                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                                    <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                    >
                                    <div className="w-screen max-w-md">
                                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                        {
                                            cartAction !== "table"
                                            ? <div className="flex w-full justify-center items-center py-3 border-b border-gray-200">
                                                <p className={
                                                    cartAction === "cart"
                                                    ? "text-xs text-indigo-700 md:text-sm lg:text-base"
                                                    : "text-xs cursor-pointer md:text-sm lg:text-base"
                                                }>
                                                    Cart
                                                </p>
                                                <svg xmlns="http://www.w3.org/2000/svg" 
                                                className="h-5 w-5 mx-2 md:mx-3" 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor">
                                                    <path 
                                                    fillRule="evenodd" 
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                                                    clipRule="evenodd" />
                                                </svg>
                                                <p className={
                                                    cartAction === "info"
                                                    ? "text-xs text-indigo-700 md:text-sm lg:text-base"
                                                    : "text-xs cursor-pointer md:text-sm lg:text-base"
                                                }>
                                                    Personal Information
                                                </p>
                                                <svg xmlns="http://www.w3.org/2000/svg" 
                                                className="h-5 w-5 mx-2 md:mx-3" 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor">
                                                    <path 
                                                    fillRule="evenodd" 
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                                                    clipRule="evenodd" />
                                                </svg>
                                                <p className={
                                                    cartAction === "payment"
                                                    ? "text-xs text-indigo-700 md:text-sm lg:text-base"
                                                    : "text-xs cursor-pointer md:text-sm lg:text-base"
                                                }>
                                                    Payment
                                                </p>
                                            </div>
                                            : <></>
                                        }
                                        {
                                            cartAction === "cart"
                                            ? <>
                                            <div className="flex-1 py-6 overflow-y-auto px-4 no-scrollbar sm:px-6">
                                                <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                                                <div className="ml-3 h-7 flex items-center">
                                                    <button
                                                    type="button"
                                                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                    onClick={() => setOpen(false)}
                                                    >
                                                    <span className="sr-only">Close panel</span>
                                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                                </div>
                                                <div className="mt-8">
                                                    {
                                                        cart.length === 0
                                                        ? <div 
                                                        onClick={e => {
                                                            setOpen(false)
                                                        }}
                                                        className="w-3/5 h-28 mx-auto px-2 border-4 border-dashed border-gray-200 font-bold text-gray-600 rounded-lg flex justify-center items-center text-center cursor-pointer hover:text-gray-900 hover:border-gray-400">
                                                            Start addding food by clicking here
                                                        </div>
                                                        : <div className="flow-root">
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                        {cart.map((product, index) => (
                                                            <li key={product.id} className="py-6 flex">
                                                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                                                <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-center object-cover"
                                                                />
                                                            </div>
                                                            <div className="ml-4 flex-1 flex flex-col">
                                                                <div>
                                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                                    <h3>{product.name}</h3>
                                                                    <p className="ml-4">RM{product.price}</p>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-500">{product.categories}</p>
                                                                </div>
                                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                                <div className="flex pt-2">
                                                                    <MinusCircle 
                                                                    onClick={e => alteringCart(index,  "minus")}
                                                                    className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900"/>
                                                                    <p className="border-2 border-gray-700 px-2 mx-2 rounded-md">
                                                                        {product.quantity}
                                                                    </p>
                                                                    <PlusCircle 
                                                                    onClick={e => alteringCart(index,  "plus")}
                                                                    className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900"/>
                                                                </div>
                                                                <div className="flex">
                                                                    <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                    <TrashIcon 
                                                                    onClick={e => deletingCart(index)}
                                                                    className="w-6 h-6 text-gray-700 hover:text-gray-900"/>
                                                                    </button>
                                                                </div>
                                                                </div>
                                                            </div>
                                                            </li>
                                                        ))}
                                                        </ul>
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Subtotal</p>
                                                <p>RM{total}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">Taxes calculated at checkout.</p>
                                                <div className="mt-6">
                                                <button
                                                onClick={e => {
                                                    if(cart.length > 0){
                                                        setCartAction("info")
                                                    }else{
                                                        toast.info("Insert minimum one food before checking out", {
                                                            position: toast.POSITION.TOP_RIGHT,
                                                            autoClose: 3000
                                                        });
                                                    }
                                                }}
                                                    className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    Checkout
                                                </button>
                                                </div>
                                                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                                <div className="flex">
                                                    or{' '}
                                                    <button
                                                    type="button"
                                                    className="text-indigo-600 font-medium flex mx-1 hover:text-indigo-500"
                                                    onClick={() => setOpen(false)}
                                                    >
                                                    Continue Shopping
                                                    </button>
                                                </div>
                                                </div>
                                            </div>
                                            </>
                                            : cartAction === "info"
                                            ? <>
                                                <div className="flex-1 py-6 overflow-y-auto px-4 no-scrollbar sm:px-6">
                                                <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Customer Detail</Dialog.Title>
                                                <div className="ml-3 h-7 flex items-center">
                                                    <button
                                                    type="button"
                                                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                    onClick={() => setOpen(false)}
                                                    >
                                                    <span className="sr-only">Close panel</span>
                                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                                </div>
                                                <form className="mt-8" id="information">
                                                    <div className="w-full mx-auto px-3 pb-3 border-b-2 border-gray-400">
                                                        <h3 className="w-full py-3 font-bold text-gray-700">Personal information</h3>
                                                        <label className="text-gray-700 mx-1">Name</label>
                                                        <input 
                                                        type="text"
                                                        name="name"
                                                        autoComplete="name"
                                                        className="w-full border-2 border-gray-400 my-1 rounded-md outline-none px-2"/>
                                                        <label className="text-gray-700 mx-1">Email</label>
                                                        <input 
                                                        type="email"
                                                        name="email"
                                                        autoComplete="email"
                                                        className="w-full border-2 border-gray-400 my-1 rounded-md outline-none px-2"/>
                                                        <label className="text-gray-700 mx-1">Phone Number</label>
                                                        <input 
                                                        type="text"
                                                        name="phone"
                                                        autoComplete="phone"
                                                        className="w-full border-2 border-gray-400 my-1 rounded-md outline-none px-2"/>
                                                    </div>
                                                    <div className="w-full mx-auto px-3 pb-3 border-b-2 border-gray-400">
                                                        <h3 className="w-full py-3 font-bold text-gray-700">Dining options</h3>
                                                        <div className="grid grid-cols-2 pb-2">
                                                            <label className="border-2 p-2 border-gray-400 mx-1 relative flex flex-col rounded-md">
                                                                <input 
                                                                onChange={e => {
                                                                    setCartType('dine in')
                                                                }}
                                                                name="type"
                                                                type="radio" 
                                                                className="form-radio absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3" />
                                                                <span className="mt-1 text-xs font-bold md:text-sm">Having Here</span>
                                                                <span className="mt-1 text-xs text-gray-600 md:text-sm">Preparation tooks 20-30 minutes</span>
                                                            </label>
                                                            <label className="border-2 p-2 border-gray-400 mx-1 relative flex flex-col rounded-md">
                                                                <input 
                                                                onChange={e => {
                                                                    setCartType('take away');
                                                                }}
                                                                name="type"
                                                                type="radio" 
                                                                className="form-radio absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3" />
                                                                <span className="mt-1 text-xs font-bold md:text-sm">Take Away</span>
                                                                <span className="mt-1 text-xs text-gray-600 md:text-sm">Extra RM2 will be charged</span>
                                                            </label>
                                                        </div>
                                                        <div className={
                                                            cartType === "dine in"
                                                            ? "visible"
                                                            : "hidden"
                                                        }>
                                                            <label className="text-gray-700 mx-1">Table No</label>
                                                            <input 
                                                            type="text"
                                                            name="table"
                                                            autoComplete="no"
                                                            defaultValue={
                                                                restaurantTable !== ""
                                                                ? restaurantTable
                                                                : ""
                                                            }
                                                            className="w-full border-2 border-gray-400 my-1 rounded-md outline-none px-2"/>
                                                        </div>
                                                    </div>
                                                    <div className="w-full mx-auto px-3 pb-3">
                                                        <h3 className="w-full py-3 font-bold text-gray-700">Payment method</h3>
                                                        <div className="grid grid-cols-2">
                                                            <label className="border-2 p-2 border-gray-400 mx-1 relative flex justify-center items-center rounded-md">
                                                                <input type="radio" className="form-radio absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3" name="payment" value="Credit Card" />
                                                                <CreditCard className="mx-1 w-5 h-5 sm:w-6 sm:h-6" />
                                                                <span className="mx-1 text-xs text-gray-600 md:text-sm">Credit Card</span>
                                                            </label>
                                                            <label className="border-2 p-2 border-gray-400 mx-1 relative flex justify-center items-center rounded-md">
                                                                <input type="radio" className="form-radio absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3" name="payment" value="PayPal" />
                                                                <Cash className="mx-1 w-5 h-5 sm:w-6 sm:h-6" />
                                                                <span className="mx-1 text-xs text-gray-600 md:text-sm">PayPal</span>
                                                            </label>
                                                            <label className="border-2 p-2 border-gray-400 mx-1 mt-2 relative flex justify-center items-center rounded-md">
                                                                <input type="radio" className="form-radio absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3" name="payment" value="E-Transfer" />
                                                                <CubeTransparent className="mx-1 w-5 h-5 sm:w-6 sm:h-6" />
                                                                <span className="mx-1 text-xs text-gray-600 md:text-sm">E-Transfer</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Subtotal</p>
                                                <p>RM{total}</p>
                                                </div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Taxes 6%</p>
                                                <p>RM{(parseFloat(total) * 0.06).toFixed(2)}</p>
                                                </div>
                                                {
                                                    cartType === "take away"
                                                    ? <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <p>Container Fees</p>
                                                        <p>RM2.00</p>
                                                    </div>
                                                    : <></>
                                                }
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Total</p>
                                                {
                                                    cartType === "take away"
                                                    ? <p>RM{((parseFloat(total) + (parseFloat(total) * 0.06)) + 2).toFixed(2)}</p>
                                                    : <p>RM{(parseFloat(total) + (parseFloat(total) * 0.06)).toFixed(2)}</p>
                                                }
                                                </div>
                                                <div className="mt-6">
                                                <button
                                                    onClick={e => {
                                                        proceedToCheckout(cartType)
                                                    }}
                                                    className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    Proceed To Checkout
                                                </button>
                                                </div>
                                                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                                <div className="flex">
                                                    or{' '}
                                                    <button
                                                    onClick={e => {
                                                        setCartAction("cart")
                                                    }}
                                                    type="button"
                                                    className="text-indigo-600 font-medium flex mx-1 hover:text-indigo-500"
                                                    >
                                                    Back To Cart
                                                    </button>
                                                </div>
                                                </div>
                                            </div>
                                            </>
                                            : cartAction === "table"
                                            ? <>
                                                <div className="flex-1 py-6 overflow-y-auto px-4 no-scrollbar sm:px-6">
                                                <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Book your table</Dialog.Title>
                                                <div className="ml-3 h-7 flex items-center">
                                                    <button
                                                    type="button"
                                                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                    onClick={() => setOpen(false)}
                                                    >
                                                    <span className="sr-only">Close panel</span>
                                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                                </div>
                                                <form className="mt-8" id="table">
                                                    <div className="w-full mx-auto px-3 pb-3">
                                                        <h3 className="w-full py-3 font-bold text-gray-700">Personal information</h3>
                                                        <label className="text-gray-700 mx-1">Name</label>
                                                        <input 
                                                        type="text"
                                                        name="name"
                                                        autoComplete="name"
                                                        className="w-full border-2 border-gray-400 my-2 rounded-md outline-none px-2"/>
                                                        <label className="text-gray-700 mx-1">Email</label>
                                                        <input 
                                                        type="email"
                                                        name="email"
                                                        autoComplete="email"
                                                        className="w-full border-2 border-gray-400 my-2 rounded-md outline-none px-2"/>
                                                        <label className="text-gray-700 mx-1">Phone Number</label>
                                                        <input 
                                                        type="text"
                                                        name="phone"
                                                        autoComplete="phone"
                                                        className="w-full border-2 border-gray-400 my-2 rounded-md outline-none px-2"/>
                                                        <label className="text-gray-700 mx-1">Number of Pax</label>
                                                        <select
                                                        type="text"
                                                        name="pax"
                                                        autoComplete="pax"
                                                        defaultValue=""
                                                        className="w-full border-2 border-gray-600 my-2 rounded-md outline-none px-2">
                                                            <option value="" disabled={true}>Select one option below</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                        <label className="text-gray-700 mx-1">Date and Time</label>
                                                        <input 
                                                        type="text"
                                                        name="date"
                                                        autoComplete="date"
                                                        type="datetime-local"
                                                        className="w-full border-2 border-gray-600 my-2 rounded-md outline-none px-2"/>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                                <div className="mt-6">
                                                <button
                                                    onClick={e => {
                                                        bookTable()
                                                    }}
                                                    className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    Book Table
                                                </button>
                                                </div>
                                                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                                <div className="flex">
                                                    or{' '}
                                                    <button
                                                    onClick={e => {
                                                        setOpen(false)
                                                    }}
                                                    type="button"
                                                    className="text-indigo-600 font-medium flex mx-1 hover:text-indigo-500"
                                                    >
                                                    Continue Shopping
                                                    </button>
                                                </div>
                                                </div>
                                            </div>
                                            </>
                                            : <>
                                            <div className="flex-1 py-6 overflow-y-auto px-4 no-scrollbar sm:px-6">
                                                <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Payment</Dialog.Title>
                                                </div>
                                                <div className="w-full flex flex-col justify-center items-center mt-20">
                                                    <RingLoader size="40px" color={"#4B0082"}/>
                                                    <div className="font-bold my-5 flex justify-center items-center">
                                                        Payment Processing
                                                    </div>
                                                </div>
                                            </div>
                                            </>
                                        }
                                        </div>
                                    </div>
                                    </Transition.Child>
                                </div>
                                </div>
                            </Dialog>
                            </Transition.Root>
                            <div className="w-full flex-col relative">
                                <img className="w-full h-60 object-cover" src={userDetail.image}/>
                                {
                                    cart.length > 0
                                    ? <div className={
                                        open ? "hidden" :"fixed z-10 top-5 right-5 p-2 rounded-full bg-white animate-bounce sm:top-10 sm:right-10"
                                    }>
                                        <svg 
                                        onClick={e => {
                                            setOpen(true);
                                            setCartAction("cart");
                                        }}
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="w-9 h-9 cursor-pointer text-blue-900 sm:w-12 sm:h-12" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor">
                                            <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="bg-blue-300 text-blue-700 text-xs absolute top-1 right-2 px-1 rounded-full lg:text-sm lg:px-2">{cart.length}</span>
                                    </div>
                                    : <></>
                                }
                                <div className="top-5 absolute left-5 p-2 rounded-full bg-white sm:top-10 sm:left-10">
                                    <Table 
                                    onClick={e => {
                                        setOpen(true);
                                        setCartAction("table");
                                    }}
                                    className="w-9 h-9 cursor-pointer text-blue-900 sm:w-12 sm:h-12"/>
                                </div>
                                <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
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
                                                menu.map((data) => {
                                                    return " . " + data.categories
                                                })
                                            }
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white">
                                <div className="max-w-2xl mx-auto pb-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                                    {
                                        menu.map((data) => {
                                            return <div key={data.categories}>
                                                <h2 className="text-2xl font-extrabold tracking-tight pt-6 text-gray-900">{data.categories}</h2>
                                                <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
                                                    {
                                                        data.data.map((data) => {
                                                            return <div key={data.id} className="group relative">
                                                            <div className="w-full h-72 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 md:h-80 lg:aspect-none">
                                                                <img
                                                                src={data.detail.food_image}
                                                                alt={data.detail.food_name}
                                                                className={
                                                                    data.detail.food_available === "no"
                                                                    ? "w-full h-full object-center object-cover filter blur-md lg:w-full lg:h-full"
                                                                    : "w-full h-full object-center object-cover lg:w-full lg:h-full"
                                                                }
                                                                />
                                                                {
                                                                    data.detail.food_available === "no"
                                                                    ? <div className="absolute top-0 w-full h-full flex justify-center items-center">
                                                                        <p className="font-bold text-gray-600">Not Available</p>
                                                                    </div>
                                                                    : <></>
                                                                }
                                                                {
                                                                    data.detail.food_discount === "yes"
                                                                    ? <div className="absolute top-0 left-0 bg-red-500 flex justify-center items-center m-2 p-1 rounded-lg">
                                                                        <Speakerphone className="w-3 h-3 text-white md:w-5 md:h-5"/>
                                                                        <p className="text-xs text-white md:text-sm lg:text-base">RM 2 OFF</p>
                                                                    </div>
                                                                    : <></>
                                                                }
                                                            </div>
                                                            <div className="mt-4 flex justify-between">
                                                                <div>
                                                                <h3 className="text-sm text-gray-700">
                                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                                    {data.detail.food_name}
                                                                </h3>
                                                                <p className="mt-1 text-sm text-gray-500">{data.detail.food_categories}</p>
                                                                </div>
                                                                <p className="text-sm font-medium text-gray-900">RM{data.detail.food_price}</p>
                                                            </div>
                                                            {
                                                                data.detail.food_available === "yes"
                                                                ? <div className="right-2 top-2 absolute p-1 bg-blue-300 rounded-full">
                                                                    <ShoppingBag 
                                                                    onClick={e => addToCart(data.id, data.detail)}
                                                                    className="w-4 h-4 text-blue-800 cursor-pointer md:w-6 md:h-6 lg:w-8 lg:h-8"/>
                                                                </div>
                                                                : <></>
                                                            }
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            })
                                    }
                                </div>
                            </div>
                        </main>
                        <CustomerFooter />
                        </>
                    }
                    </>
                )
            }
        </div>
    )
}

export default Customer
