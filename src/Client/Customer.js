import React, { useState, useEffect, Fragment } from 'react'
import Axios from 'axios'
import { ClimbingBoxLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CurrencyDollar, MinusCircle, PlusCircle, ShoppingBag, Speakerphone } from 'heroicons-react';
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon, XIcon } from '@heroicons/react/outline'
import '../pages/scrollbar.css'

const products = [
  {
    id: 1,
    name: 'Throwback Hip Bag',
    href: '#',
    color: 'Salmon',
    price: '$90.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    price: '$32.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    price: '$32.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    price: '$32.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    price: '$32.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
]

function Customer() {
    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);
    const [menu, setMenu] = useState([]);

    const [success, setSuccess] = useState(true);

    const [open, setOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    
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

    // calculate total price
    function calculateTotalPrice(price, action){
        if(action === 'minus'){
            setTotal((parseFloat(total) - parseFloat(price)).toFixed(2))
            return;
        }
        setTotal((parseFloat(total) + parseFloat(price)).toFixed(2))
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
                                        <div className="flex w-full justify-center items-center py-3 border-b border-gray-200">
                                            <p className="text-xs md:text-sm lg:text-base">
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
                                            <p className="text-xs md:text-sm lg:text-base">
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
                                            <p className="text-xs md:text-sm lg:text-base">
                                                Payment
                                            </p>
                                        </div>
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
                                                    ? <p>Empty</p>
                                                    : <div className="flow-root">
                                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                    {cart.map((product) => (
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
                                                                <p className="ml-4">RM {product.price}</p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500">{product.categories}</p>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                            <div className="flex">
                                                                <MinusCircle 
                                                                className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900"/>
                                                                <p className="border-2 border-gray-700 px-2 mx-2 rounded-md">
                                                                    {product.quantity}
                                                                </p>
                                                                <PlusCircle 
                                                                className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900"/>
                                                            </div>
                                                            <div className="flex">
                                                                <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                <TrashIcon 
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
                                            <p>$262.00</p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                            <div className="mt-6">
                                            <a
                                                href="#"
                                                className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Checkout
                                            </a>
                                            </div>
                                            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                            <p>
                                                or{' '}
                                                <button
                                                type="button"
                                                className="text-indigo-600 font-medium hover:text-indigo-500"
                                                onClick={() => setOpen(false)}
                                                >
                                                Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                                </button>
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </Transition.Child>
                                </div>
                                </div>
                            </Dialog>
                            </Transition.Root>
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
                                                menu.map((data) => {
                                                    return " . " + data.categories
                                                })
                                            }
                                        </h4>
                                    </div>
                                </div>
                                <div className="absolute top-5 right-5 p-2 rounded-full bg-white sm:top-10 sm:right-10">
                                    <ShoppingBag 
                                    onClick={e => {
                                        setOpen(true)
                                    }}
                                    className="w-9 h-9 cursor-pointer text-blue-900 sm:w-12 sm:h-12"/>
                                    <span className="bg-blue-300 text-blue-700 absolute top-1 right-2 px-2 rounded-full">{cart.length}</span>
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
                                                                <p className="text-sm font-medium text-gray-900">RM {data.detail.food_price}</p>
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
                    }
                    </>
                )
            }
        </div>
    )
}

export default Customer
