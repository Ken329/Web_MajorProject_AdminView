import React, { useState, useEffect, Fragment } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, Transition } from '@headlessui/react'
import Qrcode from 'qrcode.react';
import { XIcon } from '@heroicons/react/outline'
import { PlusCircle, Printer } from 'heroicons-react';
import printJS from 'print-js';

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userId, setUserId] = useState("");
    const [userDetail, setUserDetail] = useState([]);

    const [generateId, setGenerateId] = useState([]);
    const [generateData, setGenerateData] = useState([]);

    const [sideBar, setSideBar] = useState(false);
    const [sideBarTitle, setsideBarTitle] = useState("");
    const [sideBarIndex, setSideBarIndex] = useState(0);

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
                    setUserId(id);
                    getGeneratedData(id);
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

    // getting data function
    function getGeneratedData(id){
        Axios.post("https://eatsy-0329.herokuapp.com/getAllGenerateData", {
            id: id
        })
        .then((res) => {
            if(res.data.success){
                const data = res.data.data;
                setGenerateData([]);
                setGenerateId([]);
                for(var i = 0; i < data.length; i+=2){
                    setGenerateId(array => [...array, data[i]]);
                    setGenerateData(array => [...array, data[i + 1]]);
                }
                setLoading(false);
            }
        })
    }

    // inserting data function
    function insertTableData(){
        const id = cookies.get("eatsy_id");
        var input = document.getElementsByClassName("new-table");
        var data = [];
        var check = true;
        for(var myInput of input){
            if(myInput.value === ""){
                check = false;
                break;
            }
            data.push(myInput.value);
        }
        if(check){
            const myData = {
                table_no: data[0],
                description: data[1]
            }
            Axios.post("https://eatsy-0329.herokuapp.com/insertGenerateData", {
                id: id,
                tableDetail: myData
            })
            .then((res) => {
                if(res.data.success){
                    toast.success(res.data.data, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000
                    });
                    setSideBar(false);
                    setsideBarTitle("")
                    getGeneratedData(id);
                }
            })
        }else{
            toast.error("Do not leave any field empty", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        }
    }

    // update data function
    function updateTableFunction(generateId){
        const id = cookies.get("eatsy_id");
        var input = document.getElementsByClassName("update-table");
        var data = [];
        var check = true;
        for(var myInput of input){
            if(myInput.value === ""){
                check = false;
                break;
            }
            data.push(myInput.value);
        }
        var index = generateData.findIndex(x => 
            x.table_no === data[0] && 
            x.description === data[1]
        );
        if(index !== -1){
            toast.info("No changes has been made", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
            setSideBar(false);
        }
        if(check){
            const myData = {
                table_no: data[0],
                description: data[1]
            }
            Axios.put("https://eatsy-0329.herokuapp.com/updateGenerateData", {
                id: id,
                tableId: generateId,
                tableDetail: myData
            })
            .then((res) => {
                if(res.data.success){
                    toast.success(res.data.data, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000
                    });
                    setSideBar(false);
                    setsideBarTitle("")
                    setSideBarIndex(0);
                    getGeneratedData(id);
                }
            })
        }else{
            toast.error("Do not leave any field empty", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        }
    }

    // delete generate function
    function deleteGenerateFunction(generateId){
        const id = cookies.get("eatsy_id");;
        Axios.post("https://eatsy-0329.herokuapp.com/deleteGenerateData", {
            id: id,
            tableId: generateId
        })
        .then((res) => {
            if(res.data.success){
                toast.success(res.data.data, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
                setSideBarIndex(0);
                getGeneratedData(id);
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
                        section={2}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">QR Code</h1>
                        </div>
                    </header>
                    <main className="flex-col relative overflow-hidden pb-5">
                    <Transition.Root show={sideBar} as={Fragment}>
                        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={() => {
                            setSideBar(false)
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
                                    <div className="pt-9 pb-3 relative flex-1 px-4 md:pt-6 sm:px-6 sm:pt-3">
                                        {
                                            sideBarTitle === "Create New Table" ? 
                                            <div className="px-5 flex-col">
                                                <p className="px-3 mt-2">Table No: </p>
                                                <input className="w-full rounded-xl bg-gray-200 px-3 py-1 my-2 outline-none new-table" 
                                                placeholder="New table no"/>
                                                <p className="px-3 mt-2">Description: </p>
                                                <textarea className="w-full rounded-xl bg-gray-200 px-3 py-2 my-2 outline-none new-table" 
                                                placeholder="New table description"/>
                                                <div className="flex justify-end mt-6">
                                                    <button 
                                                    onClick={e => insertTableData()}
                                                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-3xl hover:bg-gray-300 hover:text-gray-900">
                                                        Create
                                                    </button>
                                                </div>
                                            </div>
                                            : <div className="px-5 flex-col">
                                                <p className="px-3 mt-2">Table No: </p>
                                                <input className="w-full rounded-xl bg-gray-200 px-3 py-1 my-2 outline-none update-table" 
                                                placeholder="Update table no"
                                                defaultValue={
                                                    generateData.length !== 0 
                                                    ? generateData[sideBarIndex].table_no
                                                    : ""
                                                }/>
                                                <p className="px-3 mt-2">Description: </p>
                                                <textarea className="w-full rounded-xl bg-gray-200 px-3 py-2 my-2 outline-none update-table" 
                                                placeholder="Update table description"
                                                defaultValue={
                                                    generateData.length !== 0 
                                                    ? generateData[sideBarIndex].description
                                                    : ""
                                                }/>
                                                <div className="flex justify-end mt-6">
                                                    <button 
                                                    onClick={e => updateTableFunction(generateId[sideBarIndex])}
                                                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-3xl hover:bg-gray-300 hover:text-gray-900">
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                </div>
                                </Transition.Child>
                            </div>
                            </div>
                        </Dialog>
                        </Transition.Root>
                        <div className="flex w-4/5 mx-auto pt-5">
                            <button 
                            onClick={e => {
                                setSideBar(true)
                                setsideBarTitle("Create New Table")
                            }}
                            className="bg-white px-3 py-2 rounded-full flex mx-3">
                                <PlusCircle className="w-6 h-6 mr-2"/>
                                Create
                            </button>
                            <button
                            onClick={e => {
                                printJS({
                                    printable: 'all_qr',
                                    type: 'html',
                                    targetStyles: ['*']
                                })
                            }}
                            className="bg-white px-3 py-2 rounded-full flex mx-3">
                                <Printer className="w-6 h-6 mr-2"/>
                                Print
                            </button>
                        </div>
                        <div id="all_qr" className="flex-col w-4/5 mx-auto">
                            <h3 className="w-full py-4 px-6 mx-auto font-bold">Restaurant</h3>
                            <section className="w-full mx-auto grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                <div 
                                id="qr"
                                className="bg-white h-auto rounded-2xl m-3 relative">
                                    <div className="w-full h-auto text-sm pt-2 font-semibold rounded-t-2xl flex justify-center items-center">
                                        <img className="w-10 h-10 rounded-full m-1" src={userDetail.user_image}/>
                                        <h4 className="m-1 font-serif">{userDetail.user_restaurant}</h4>
                                    </div>
                                    <div 
                                        onClick={e => {
                                            printJS({
                                                printable: 'qr',
                                                type: 'html',
                                                targetStyles: ['*']
                                            })
                                        }}
                                        className="p-1 rounded-full bg-gray-100 absolute top-1 right-1 cursor-pointer hover:bg-gray-200 print-logo">
                                            <Printer className="w-5 h-5"/>
                                        </div>
                                    <Qrcode 
                                        className="w-4/5 mx-auto mt-6"
                                        value={"https://ken329.github.io/Web_MajorProject_CustomerView/menu.html?restaurantID="+userId}
                                    />
                                    <div className="w-full flex justify-center items-center py-4 font-semibold">Scan here to get menu</div>
                                </div>
                            </section>
                            <h3 className="w-full py-4 px-6 mx-auto font-bold">Table</h3>
                            {
                                generateData.length === 0
                                ? <h3 className="w-full text-center text-gray-700 font-bold">No generated table found</h3>
                                : <section className="w-full mx-auto grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                    {
                                        generateData.map((data, index) => {
                                            return <div 
                                            key={index} 
                                            id={"qr_"+generateId[index]} 
                                            className="bg-white h-auto rounded-2xl m-3 pb-5 relative overflow-hidden">
                                            <div className="w-full h-auto text-sm pt-2 font-semibold rounded-t-2xl flex justify-center items-center">
                                                <img className="w-10 h-10 rounded-full m-1" src={userDetail.user_image}/>
                                                <h4 className="m-1 font-serif">{userDetail.user_restaurant}</h4>
                                            </div>
                                            <div 
                                            onClick={e => {
                                                printJS({
                                                    printable: 'qr_'+generateId[index],
                                                    type: 'html',
                                                    targetStyles: ['*']
                                                })
                                            }}
                                            className="p-1 rounded-full bg-gray-100 absolute top-1 right-1 cursor-pointer hover:bg-gray-200 print-logo">
                                                <Printer className="w-5 h-5"/>
                                            </div>
                                            <Qrcode 
                                                className="w-4/5 mx-auto mt-6"
                                                value={"https://ken329.github.io/Web_MajorProject_CustomerView/menu.html?restaurantID="+userId+"&table_no="+data.table_no}
                                            />
                                            <div className="w-full flex justify-center items-center px-2 py-4 font-semibold">{data.description}</div>
                                            <div className="absolute rounded-lg left-0 right-0 bottom-0 bg-gray-200 transform translate-y-2/3 
                                            ease-in-out duration-700 hover:translate-y-0">
                                                <p className="w-10/12 mx-auto mb-2 text-center text-gray-700">Table No : {data.table_no}</p>
                                                <div className="w-full flex">
                                                    <button 
                                                    onClick={e => {
                                                        setSideBar(true)
                                                        setsideBarTitle("Updating Table")
                                                        setSideBarIndex(index)
                                                    }}
                                                    className="w-1/2 text-center rounded-2xl py-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
                                                        Edit
                                                    </button>
                                                    <button 
                                                    onClick={e => deleteGenerateFunction(generateId[index])}
                                                    className="w-1/2 text-center rounded-2xl py-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        })
                                    }
                                </section>
                            }
                        </div>
                    </main>
                    </>
                )
            }
        </div>
    )
}

export default TracksPage
