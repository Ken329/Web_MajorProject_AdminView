import React, { useState, useEffect, Fragment } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Ban, Pencil, PlusCircle, Trash } from 'heroicons-react';
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import "./scrollbar.css"

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);
    const [menu, setMenu] = useState([]);
    const [menuId, setMenuId] = useState([]);
    const [menuCategories, setMenuCategories] = useState([]);

    const [categoriesShown, setCategoriesShown] = useState([]);
    const [discountShown, setDiscountShown] = useState([]);
    const [availableShown, setAvailableShown] = useState([]);

    const [sideBar, setSideBar] = useState(false)
    const [sideBarTitle, setsideBarTitle] = useState("");
    const [sideBarImg,  setSideBarImg] = useState([false, "No image found"]);
    const [sideBarIndex, setSideBarIndex] = useState(0);

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
                    getMenuData(id);
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

    // getting data function
    function getMenuData(id){
        Axios.post("https://eatsy-0329.herokuapp.com/getRestaurantMenuById", {
            id: id
        })
        .then((res) => {
            const data = res.data.data;
            setMenu([]);
            setMenuId([]);
            setCategoriesShown([]);
            setDiscountShown([]);
            setAvailableShown([]);
            for(var i = 1; i < data.length; i+=2){
                setMenu(array => [...array, data[i + 1]]);
                setMenuId(array => [...array, data[i]]);
                setCategoriesShown(array => [...array, "yes"]);
                setDiscountShown(array => [...array, "yes"]);
                setAvailableShown(array => [...array, "yes"]);
            }
            menuCategoriesList(data);
            setLoading(false);
        })
    }

    // returning list function
    function menuCategoriesList(data){
        var list = [];
        for(var i = 1; i < data.length; i+=2){
            if(!list.includes(data[i + 1].food_categories)){
                list.push(data[i + 1].food_categories);
            }
        }
        setMenuCategories(list);
    }

    // filtering function
    function filteringCategories(categories, menu, shown){
        var list = [];
        if(categories === "all"){
            for(var i = 0; i < shown.length; i++){
                list.push("yes");
            }
            setCategoriesShown(list);
            return;
        }
        for(var i = 0; i < menu.length; i++){
            if(menu[i].food_categories !== categories){
                list[i] = "no";
            }else{
                list[i] = "yes";
            }
        }
        setCategoriesShown(list);
    }
    function filteringDiscount(discount, menu, shown){
        var list = [];
        if(discount === "all"){
            for(var i = 0; i < shown.length; i++){
                list.push("yes");
            }
            setDiscountShown(list);
            return;
        }
        for(var i = 0; i < menu.length; i++){
            if(menu[i].food_discount !== discount){
                list[i] = "no";
            }else{
                list[i] = "yes";
            }
        }
        setDiscountShown(list);
    }
    function filteringAvailable(available, menu, shown){
        var list = [];
        if(available === "all"){
            for(var i = 0; i < shown.length; i++){
                list.push("yes");
            }
            setAvailableShown(list);
            return;
        }
        for(var i = 0; i < menu.length; i++){
            if(menu[i].food_available !== available){
                list[i] = "no";
            }else{
                list[i] = "yes";
            }
        }
        setAvailableShown(list);
    }

    // updating function
    function updateMenuDiscount(menuId, discount){
        const id = cookies.get("user_id")
        Axios.put("https://eatsy-0329.herokuapp.com/updateMenuDiscount", {
            id: id,
            menuId: menuId,
            discount: discount
        })
        .then((res) => {
            if(res.data.success){
                toast.success(res.data.data, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
                getMenuData(id);
            }
        })
    }
    function updateMenuAvailable(menuId, available){
        const id = cookies.get("user_id")
        Axios.put("https://eatsy-0329.herokuapp.com/updateMenuAvailable", {
            id: id,
            menuId: menuId,
            available: available
        })
        .then((res) => {
            if(res.data.success){
                toast.success(res.data.data, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
                getMenuData(id);
            }
        })
    }

    // inserting function
    function insertingNewMenu(){
        var field = document.getElementsByClassName("new-field");
        var data = [];
        var check = true;
        for(var myField of field){
            if(myField.value === ""){
                check = false;
                break;
            }
            if(myField.value === "Create New..."){
                data.push(document.getElementById("new_categories").value);
            }else{
                data.push(myField.value);
            }
        }
        if(check){
            if(checkImageExists(data[0])){
                const id = cookies.get("user_id")
                var myData = {
                    food_image: data[0],
                    food_name: data[1],
                    food_price: data[2],
                    food_categories: data[3],
                    food_discount: data[4],
                    food_available: data[5]
                }
                Axios.post("https://eatsy-0329.herokuapp.com/insertNewMenu", {
                    id: id,
                    menu: myData
                })
                .then((res) => {
                    if(res.data.success){
                        setSideBar(false);
                        setSideBarImg([false, "No Image Found"])
                        toast.success(res.data.data, {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 3000
                        });
                        getMenuData(id)
                    }
                })
            }else{
                toast.error("Image url not working, please check", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            }
        }else{
            toast.error("Do not leave any field empty", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        }
    }

    // personal used function
    function checkIfImageExists(url) {
        const img = new Image();
    
        img.src = url;
        var list = [];
    
        if (img.complete) {
            list.push(true);
            list.push(url);
            setSideBarImg(list);
        } else {
            img.onload = () => {
                list.push(true);
                list.push(url);
                setSideBarImg(list);
            };
            
            img.onerror = () => {
                list.push(false);
                list.push("Wrong image url");
                setSideBarImg(list);
            };
        }
    }
    function checkImageExists(url) {
        const img = new Image();
        img.src = url;
    
        if (img.complete) {
            return true;
        } else {
            img.onload = () => {
                return true;
            };
            
            img.onerror = () => {
                return false;
            };
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
                        section={1}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
                        </div>
                    </header>
                    <main className="flex-col relative overflow-hidden">
                    <Transition.Root show={sideBar} as={Fragment}>
                        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={() => {
                            setSideBar(false);
                            setSideBarImg([false, "No Image Found"])
                        }}>
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
                                <div className="relative w-screen max-w-md">
                                    <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-500"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-500"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                    >
                                    <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                                        <button
                                        type="button"
                                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                        onClick={() => {
                                            setSideBar(false)
                                            setSideBarImg([false, "No image found"])
                                        }}
                                        >
                                        <span className="sr-only">Close panel</span>
                                        <XIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                    </Transition.Child>
                                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                    <div className="w-full py-3 bg-gray-200 rounded-b-2xl">
                                        <Dialog.Title className="text-lg font-medium text-gray-900 text-center">{sideBarTitle}</Dialog.Title>
                                    </div>
                                    <div className="pt-9 pb-3 relative flex-1 px-4 overflow-hidden overflow-y-auto no-scrollbar md:pt-6 sm:px-6 sm:pt-3">
                                        {
                                            sideBarTitle === "Create New menu" ?
                                            <>
                                            <p className="mx-auto w-10/12 py-2">Photo</p>
                                            <div className="flex justify-center items-center">
                                                {
                                                    sideBarImg[0] ? <img className="h-20 w-20 rounded-full mx-3" src={sideBarImg[1]}/>
                                                    : <div className="h-20 w-20 rounded-full mx-3 bg-gray-100 flex justify-center items-center">
                                                        <p className="w-11/12 h-auto text-center text-sm py-1">
                                                            {sideBarImg[1]}
                                                        </p>
                                                    </div>
                                                }
                                                <div className="mx-3 flex rounded-full shadow-sm">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-l-full bg-gray-200 text-gray-500 text-sm">
                                                        Image:
                                                    </span>
                                                    <input 
                                                    onChange={e => {
                                                        checkIfImageExists(e.target.value)
                                                    }}
                                                    className="rounded-r-full px-3 outline-none bg-gray-100 text-sm new-field" 
                                                    placeholder="http://"/>
                                                </div>
                                            </div>
                                            <div className="w-11/12 mx-auto">
                                                <p className="py-2 ml-6 mt-3">Name</p>
                                                <input 
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm new-field" 
                                                placeholder="Create food name"/>
                                                <p className="py-2 ml-6 mt-3">Price</p>
                                                <input 
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm new-field" 
                                                placeholder="Create food price"/>
                                                <p className="py-2 ml-6 mt-3">Categories</p>
                                                <select 
                                                onChange={e => {
                                                    if(e.target.value === "Create New..."){
                                                        document.getElementById("new_categories").style.display = "flex"
                                                    }else{
                                                        document.getElementById("new_categories").style.display = "none"
                                                    }
                                                }}
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm new-field" 
                                                defaultValue="">
                                                    <option value="" disabled={true}>Select one option below</option>
                                                    { 
                                                        menuCategories.map((data) => {
                                                            return <option key={"new_"+data} value={data}>{data}</option>
                                                        })
                                                    }
                                                    <option>Create New...</option>
                                                </select>
                                                <input 
                                                id="new_categories"
                                                className="w-full mt-2 rounded-full px-3 py-2 outline-none hidden 
                                                bg-gray-100 text-sm" 
                                                placeholder="Create new categories"/>
                                                <p className="py-2 ml-6 mt-3">Discount</p>
                                                <select 
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm new-field" 
                                                defaultValue="">
                                                    <option value="" disabled={true}>Select one option below</option>
                                                    <option value='yes'>Yes</option>
                                                    <option value='no'>No</option>
                                                </select>
                                                <p className="py-2 ml-6 mt-3">Available</p>
                                                <select 
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm new-field" 
                                                defaultValue="">
                                                    <option value="" disabled={true}>Select one option below</option>
                                                    <option value='yes'>Yes</option>
                                                    <option value='no'>No</option>
                                                </select>
                                                <div className="flex justify-end mt-6">
                                                    <button 
                                                    onClick={e => insertingNewMenu()}
                                                    className="w-auto px-3 py-2 bg-gray-100 rounded-full">
                                                        Create
                                                    </button>
                                                </div>
                                            </div>
                                            </>
                                            : <>
                                            <p className="mx-auto w-11/12 py-2">Food Image</p>
                                            <div className="flex justify-center items-center">
                                                {
                                                    sideBarImg[0] ? <img className="h-20 w-20 rounded-full mx-3" src={sideBarImg[1]}/>
                                                    : <div className="h-20 w-20 rounded-full mx-3 bg-gray-100 flex justify-center items-center">
                                                        <p className="w-full h-auto text-center text-sm py-1">
                                                            {sideBarImg[1]}
                                                        </p>
                                                    </div>
                                                }
                                                <div className="mx-3 flex rounded-full shadow-sm">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-l-full bg-gray-200 text-gray-500 text-sm">
                                                        Image:
                                                    </span>
                                                    <input 
                                                    onChange={e => {
                                                        checkIfImageExists(e.target.value)
                                                    }}
                                                    className="rounded-r-full px-3 outline-none bg-gray-100 text-sm update-field" 
                                                    placeholder="http://"
                                                    defaultValue={
                                                        menu.length !== 0
                                                        ? menu[sideBarIndex].food_image
                                                        : "" 
                                                    }/>
                                                </div>
                                            </div>
                                            <div className="w-11/12 mx-auto">
                                                <p className="py-2 ml-6 mt-3">Food Name</p>
                                                <input 
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm update-field" 
                                                placeholder="Update your food name"
                                                defaultValue={
                                                    menu.length !== 0
                                                    ? menu[sideBarIndex].food_name
                                                    : "" 
                                                }/>
                                                <p className="py-2 ml-6 mt-3">Food Price</p>
                                                <input 
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm update-field" 
                                                placeholder="Update your food price"
                                                defaultValue={
                                                    menu.length !== 0
                                                    ? menu[sideBarIndex].food_price
                                                    : "" 
                                                }/>
                                                <p className="py-2 ml-6 mt-3">Food Categories</p>
                                                <select 
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm update-field" 
                                                defaultValue={
                                                    menu.length !== 0
                                                    ? menu[sideBarIndex].food_categories
                                                    : "" 
                                                }>
                                                    <option value="" disabled={true}>Select one option below</option>
                                                    { 
                                                        menuCategories.map((data) => {
                                                            return <option key={"update_"+data} value={data}>{data}</option>
                                                        })
                                                    }
                                                    <option>Create New...</option>
                                                </select>
                                                <p className="py-2 ml-6 mt-3">Food Discount</p>
                                                <select 
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm update-field" 
                                                defaultValue={
                                                    menu.length !== 0
                                                    ? menu[sideBarIndex].food_discount
                                                    : "" 
                                                }>
                                                    <option value="" disabled={true}>Select one option below</option>
                                                    <option value='yes'>Yes</option>
                                                    <option value='no'>No</option>
                                                </select>
                                                <p className="py-2 ml-6 mt-3">Food Available</p>
                                                <select 
                                                className="w-full rounded-full px-3 py-2 outline-none bg-gray-100 text-sm update-field" 
                                                defaultValue={
                                                    menu.length !== 0
                                                    ? menu[sideBarIndex].food_available
                                                    : "" 
                                                }>
                                                    <option value="" disabled={true}>Select one option below</option>
                                                    <option value='yes'>Yes</option>
                                                    <option value='no'>No</option>
                                                </select>
                                                <div className="flex justify-end mt-6">
                                                    <button className="w-auto px-3 py-2 bg-gray-100 rounded-full">
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                            </>
                                        }
                                        </div>
                                    </div>
                                </div>
                                </Transition.Child>
                            </div>
                            </div>
                        </Dialog>
                        </Transition.Root>
                        <section className="w-4/5 mx-auto flex pt-5">
                            <button 
                            onClick={e => {
                                setSideBar(true)
                                setsideBarTitle("Create New menu")
                            }}
                            className="flex w-auto h-auto bg-white py-2 px-3 ml-4 rounded-full">
                                <PlusCircle className="w-6 h-6 mr-2"/>
                                Create
                            </button>
                            <div className="ml-4 flex rounded-full shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-full border border-r-0 border-white bg-gray-50 text-gray-500 text-sm">
                                    Categories:
                                </span>
                                <select 
                                onChange={e => {
                                    filteringCategories(e.target.value, menu, categoriesShown)
                                }}
                                className="rounded-r-full px-3 outline-none">
                                    <option value="all">All</option>
                                    { 
                                        menuCategories.map((data) => {
                                            return <option key={data} value={data}>{data}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="ml-4 flex rounded-full shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-full border border-r-0 border-white bg-gray-50 text-gray-500 text-sm">
                                    Discount:
                                </span>
                                <select 
                                onChange={e => {
                                    filteringDiscount(e.target.value, menu, discountShown)
                                }}
                                className="rounded-r-full px-3 outline-none">
                                    <option value="all">All</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            <div className="ml-4 flex rounded-full shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-full border border-r-0 border-white bg-gray-50 text-gray-500 text-sm">
                                    Available:
                                </span>
                                <select 
                                onChange={e => {
                                    filteringAvailable(e.target.value, menu, availableShown)
                                }}
                                className="rounded-r-full px-3 outline-none">
                                    <option value="all">All</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </section>
                        {
                            menu.length === 0 ?
                            <p className="text-lg text-gray-500 w-full text-center py-6">No menu has been found</p>
                            : 
                            <section className="w-4/5 mx-auto grid grid-cols-2 py-6 md:grid-cols-3 lg:grid-cols-4" >
                            {
                                menu.map((data, index) => {
                                    return categoriesShown[index] === "yes" &&
                                            discountShown[index] === "yes" &&
                                            availableShown[index] === "yes"?
                                    <div key={menuId[index]} className="h-auto relative bg-white flex-col rounded-xl mx-4 my-3">
                                    <div className="absolute w-full top-0 flex justify-end">
                                        <Pencil 
                                        onClick={e => {
                                            setSideBar(true)
                                            setsideBarTitle("Update Menu")
                                            setSideBarIndex(index)
                                            setSideBarImg([true, menu[index].food_image])
                                        }}
                                        className="w-5 h-5 my-2 mx-1 cursor-pointer text-gray-700 hover:text-gray-900"/>
                                        <Trash 
                                        className="w-5 h-5 my-2 mx-1 cursor-pointer text-gray-700 hover:text-gray-900"/>
                                    </div>
                                    <img className="w-28 h-28 mx-auto my-3 rounded-full" src={data.food_image}/>
                                    <p className="w-full text-center my-2 font-bold">{data.food_name}</p>
                                    <p className="w-full text-center my-2 text-gray-500">RM {data.food_price}</p>
                                    <p className="w-min text-center mx-auto my-2 px-2 py-1 rounded-xl bg-green-200 text-green-700 hover:text-green-900">
                                        {data.food_categories}
                                    </p>
                                    <div className="w-full mt-5 grid grid-cols-2">
                                        {
                                            data.food_discount === "no" ?
                                            <div 
                                                onClick={e => updateMenuDiscount(menuId[index], "yes")}
                                                className="flex bg-red-400 rounded-bl-xl justify-center cursor-pointer items-center py-3 border-t-2 border-r-2 border-gray-200">
                                                <Ban className="w-5 h-5 mx-1"/>
                                                Discount
                                            </div>
                                            : <div 
                                                onClick={e => updateMenuDiscount(menuId[index], "no")}
                                                className="flex bg-white rounded-bl-xl justify-center cursor-pointer items-center py-3 border-t-2 border-r-2 border-gray-200">
                                                Discount
                                            </div>
                                        }
                                        {
                                            data.food_available === "no" ?
                                            <div 
                                                onClick={e => updateMenuAvailable(menuId[index], "yes")}
                                                className="flex bg-red-400 rounded-br-xl justify-center cursor-pointer items-center py-3 border-t-2 border-gray-200">
                                                <Ban className="w-5 h-5 mx-1"/>
                                                Available
                                            </div>
                                            : <div 
                                                onClick={e => updateMenuAvailable(menuId[index], "no")}
                                                className="flex bg-white rounded-br-xl justify-center cursor-pointer items-center py-3 border-t-2 border-gray-200">
                                                Available
                                            </div>
                                        }
                                    </div>
                                </div>
                                : <div key={menuId[index]} style={{display: "none"}}></div>
                                })
                            }
                            </section>
                        }
                    </main>
                    </>
                )
            }
        </div>
    )
}

export default TracksPage
