import { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { PlusCircle } from 'heroicons-react';
import { ClimbingBoxLoader } from 'react-spinners';

function getUserIcon(gender){
    switch(gender){
        case "Mr.":
            return <img className="h-10 w-10 rounded-full" src="../img/gender-man.png" alt="" />;
        case "Ms.":
            return <img className="h-10 w-10 rounded-full" src="../img/gender-women.png" alt="" />;
        default:
            return <img className="h-10 w-10 rounded-full" src="../img/gender-other.png" alt="" />;
    }
}

function AdminPage() {
    let history = useHistory();

    // loading 
    const [loading, setLoading] = useState(true);

    // user detail and menu detail
    const [userDetail, setUserDetail] = useState([]);
    const [userMenu, setUserMenu] = useState([]);
    const [menuId, setMenuId] = useState([]);
    const [menuCategories, setMenuCategories] = useState([]);

    // cart
    const [cart, setCart] = useState([]);
    
    // useEffect( () => {
    //     const interval = setInterval(() => {
    //         const queryString = window.location.search;
    //         const urlParams = new URLSearchParams(queryString);
    //         const id = urlParams.get("uid");

    //         Axios.post("http://localhost:4000/getOrder", {
    //             uid: id
    //         })
    //         .then( (res) => {
    //             console.log(res.data)
    //         })
    //     }, 3000);

    //     return () => clearInterval(interval);
    // }, [] )

    function insertCategories(data) {
        var myData = [];
        var list = [];
        list.push(<span 
            key={'All'} 
            onClick={e => getCategoriesClicked("All")}
            data-categories={"All"}
            className="m-2 px-4 py-2 bg-gray-300 rounded-3xl cursor-pointer categories-btn">
            {"All"}
        </span>);
        for(var i = 0; i < data.length; i++){
            if(!myData.includes(data[i])){
                myData.push(data[i]);
                list.push(<span 
                        key={data[i]} 
                        onClick={e => getCategoriesClicked(e.target.dataset.categories)}
                        data-categories={data[i]}
                        className="m-2 px-4 py-2 bg-white rounded-3xl cursor-pointer categories-btn">
                        {data[i]}
                    </span>);
            }
        }
        getCategoriesClicked("All");
        return list;
    }

    // clicking function
    function getCategoriesClicked(categories){
        var btn = document.getElementsByClassName("categories-btn");
        for(var myBtn of btn){
            if(myBtn.dataset.categories === categories){
                myBtn.style.backgroundColor = "#BBBDBB";
            }else{
                myBtn.style.backgroundColor = "#fff";
            }
        }
        var allCon = document.getElementsByClassName("bg-white h-auto flex-col rounded-lg relative m-5");
        if(categories === "All"){
            for(var myCon of allCon){
                myCon.style.display = "flex"
            }
        }else{
            for(var myCon of allCon){
                myCon.style.display = "none"
            }
            var con = document.getElementsByClassName("categories_"+categories);
            for(var myCon of con){
                myCon.style.display = "flex";
            }
        }
    }
    function addToCart(id, detail){
        var data = {};
        var price = detail.food_price;
        if(detail.food_discount === "yes"){
            var newPrice = parseFloat(detail.food_price) - 2;
            price = newPrice.toFixed(2);
        }
        data = {
            id: id,
            quantity: 1,
            price: price,
            singlePrice: price,
            image: detail.food_image,
            name: detail.food_name
        }
        var index = cart.findIndex(x => x.id === id);
        if(index >= 0){
            let arr = [...cart];
            arr[index] = {
                id: arr[index].id,
                price: (parseFloat(arr[index].singlePrice) * (parseInt(arr[index].quantity) + 1)).toFixed(2),
                quantity: parseInt(arr[index].quantity) + 1,
                image: arr[index].image,
                name: arr[index].name
            }
            setCart(arr);
            return;
        }
        setCart(array => [...array, data]);
        
    }
    
    useEffect( () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get("uid");
        
        Axios.post("https://eatsy-0329.herokuapp.com/getUser", {
            uid: id
        })
        .then( (res) => {
            if(!res.data.success){
                alert("Something wrong with your site, try login again");
                history.push('/Login');
            }else{
                setUserDetail(res.data.data[0]);
                Axios.post("https://eatsy-0329.herokuapp.com/getRestaurantMenuById", {
                    id: id
                })
                .then( (res) => {
                    const data = res.data.data;
                    for(var i = 1; i < data.length; i+=2){
                        setUserMenu(array => [...array, data[i + 1]])
                        setMenuId(array => [...array, data[i]])
                        setMenuCategories(array => [...array, data[i + 1].food_categories])
                    }
                    setLoading(false);
                })
            }
        })
    }, [] ) 
    return (
        <div className="min-h-screen w-full bg-gray-100">
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
                        icon={getUserIcon(userDetail.user_gender)}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        </div>
                    </header>
                    <main className="flex">
                        <div className="max-w-6xl w-3/4 flex-col py-6 sm:px-6 lg:px-8">
                            <div className="w-full py-4 flex flex-wrap">
                                {  insertCategories(menuCategories) }
                            </div>
                            <div className="w-full grid grid-cols-2 py-6 md:grid-cols-3 lg:grid-cols-4">
                                {
                                    userMenu.map((data, index) => {
                                        return <div 
                                                key={data.item_name}
                                                className={"bg-white h-auto flex-col rounded-lg relative m-5 categories_"+data.food_categories}>
                                                    <img className="w-full h-3/5 rounded-t-lg" src={data.food_image} />
                                                    <p className="m-2">{data.food_name}</p>
                                                    <p className="m-2">RM {data.food_price}</p>
                                                    <PlusCircle 
                                                        onClick={e => addToCart(menuId[index], data)}
                                                        className="w-6 h-6 cursor-pointer absolute bottom-2 right-2"/>
                                                    {
                                                        data.food_discount == "yes" ? (
                                                            <div className="bg-red-600 w-auto absolute top-2 right-2 rounded-lg px-2 opacity-80">
                                                                - $2 Off
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )
                                                    }
                                                    {
                                                        data.food_available === "no" ? (
                                                            <div className="w-full h-full absolute top-0 opacity-50 bg-gray-100 z-10 rounded-lg flex justify-center items-center">
                                                                <p className="opacity-100">Not Available</p>
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )
                                                    }
                                                </div>
                                    })
                                }
                                {/* <div 
                                    className={"bg-white h-auto flex-col rounded-lg relative m-5"}>
                                        <img className="w-full h-3/5 rounded-t-lg" src='../img/background.jpg' />
                                        <p className="m-2">Chicken Chop</p>
                                        <p className="m-2">RM 12.00</p>
                                        <div className="bg-red-600 w-auto absolute top-2 right-2 rounded-lg px-2 opacity-80">
                                            - $2 Off
                                        </div>
                                        <div className="w-full h-full absolute opacity-50 bg-gray-100 z-10 flex justify-center items-center">
                                            Not Available
                                        </div>
                                        <PlusCircle className="w-6 h-6 cursor-pointer absolute bottom-2 right-2"/>
                                </div> */}
                            </div>
                        </div>
                        <div className="bg-white w-1/4 h-full m-3 rounded-md">
                            <div className="w-full flex justify-center items-center">
                                <button className="bg-gray-100 px-4 py-2 rounded-lg m-2 hover:bg-gray-200 focus:bg-gray-300">Take Away</button>
                                <button className="bg-gray-100 px-4 py-2 rounded-lg m-2 hover:bg-gray-200 focus:bg-gray-300">Dine In</button>
                            </div>
                            <div className="flex-col p-3 justify-center">
                                {
                                    cart.length === 0 ? (
                                        <p className="w-full text-center my-3">Empty Cart</p>
                                    ) : (
                                        cart.map((data) => {
                                            return <div key={data.name} className="flex my-2 items-center">
                                                        <img className="rounded-full w-12 h-12" src={data.image}/>
                                                        <div className="flex-col w-4/5">
                                                            <p className="text-center my-2">{data.name}</p>
                                                            <div className="grid grid-cols-1 my-2 lg:grid-cols-2 ">
                                                                <div className="flex justify-center items-center">
                                                                    <PlusCircleIcon className="w-5 h-5 mx-2 cursor-pointer"/>
                                                                    <p>{data.quantity}</p>
                                                                    <MinusCircleIcon className="w-5 h-5 mx-2 cursor-pointer"/>
                                                                </div>
                                                                <p className="text-center">RM {data.price}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                        })
                                    )
                                }
                                
                                {/* <div className="flex my-2 items-center">
                                    <img className="rounded-full w-12 h-12" src="../img/background.jpg"/>
                                    <div className="flex-col w-full">
                                        <p className="text-center my-2">Chicken Chop</p>
                                        <div className="grid grid-cols-1 my-2 lg:grid-cols-2 ">
                                            <div className="flex justify-center items-center">
                                                <PlusCircleIcon className="w-5 h-5 mx-2 cursor-pointer"/>
                                                <p>0</p>
                                                <MinusCircleIcon className="w-5 h-5 mx-2 cursor-pointer"/>
                                            </div>
                                            <p className="text-center">RM 12.00</p>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="w-full flex-col">
                                    <p className="text-right px-2">Total: </p>
                                    <p className="text-right px-2">SST: </p>
                                    <p className="text-right px-2">Total + SST: </p>
                                    <button className="w-full py-3 mt-3 cursor-pointer rounded-lg bg-gray-700 text-white hover:bg-gray-800">Proceeed to checkout</button>
                                </div>
                            </div>
                        </div>
                    </main>
                    </>
                )
            }
        </div>
    )
    
}
export default AdminPage
