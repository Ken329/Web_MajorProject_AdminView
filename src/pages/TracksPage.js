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
                    setLoading(false);
                    // Axios.post("https://eatsy-0329.herokuapp.com/getRestaurantMenuById", {
                    //     id: id
                    // })
                    // .then( (res) => {
                    //     const data = res.data.data;
                    //     for(var i = 1; i < data.length; i+=2){
                    //         setUserMenu(array => [...array, data[i + 1]])
                    //         setMenuId(array => [...array, data[i]])
                    //         setMenuCategories(array => [...array, data[i + 1].food_categories])
                    //     }
                    //     setLoading(false);
                    //     getCategoriesClicked("All");
                    // })
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 
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
                        <h1 className="text-3xl font-bold text-gray-900">Tracking Section</h1>
                        </div>
                    </header>
                    <main className="flex relative overflow-hidden">
                        
                    </main>
                    </>
                )
            }
        </div>
    )
}

export default TracksPage
