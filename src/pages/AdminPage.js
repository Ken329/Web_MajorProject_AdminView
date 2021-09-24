/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'

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
    const [userDetail, setuserDetail] = useState([]);

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
                setuserDetail(res.data.data[0]);
            }
        })
    }, [] )

    return (
        <div>
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
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Replace with your content */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
                </div>
                {/* /End replace */}
                </div>
            </main>
    </div>
  )
}
export default AdminPage
