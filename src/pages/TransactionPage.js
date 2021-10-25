import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Doughnut } from 'react-chartjs-2';

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);

    const [foodId, setFoodId] = useState([]);
    const [foodQuantity, setFoodQuantiity] = useState([]);

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
                    getAllFood(id);
                    setLoading(false);
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

    // getting food data
    function getAllFood(id){
        Axios.post("http://localhost:4000/getAllOrder", {
            id: id
        })
        .then((res) => {
            if(res.data.success){
                const data = res.data.data;
                for(var i = 0 ; i < data.length; i++){
                    var food = JSON.parse(data[i]).food;
                    setFoodId(array => [...array, food]);
                }
                
            }
        })
    }

    // inserting food data
    function filteringFoodData(data){
        var food = [];
        var quantity = [];
        for(var i = 0 ; i < data.length; i++){
            if(!food.includes(data.id)){
                food.push(data.id)
            }
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
                        section={5}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Transaction</h1>
                        </div>
                    </header>
                    <main className="flex-col relative w-4/5 mx-auto pb-6">
                        <h4 className='mx-5 py-6 font-bold text-gray-700'>Best Seller</h4>
                        <section className="flex w-full h-2/5">
                            <div className="flex-col w-1/6 relative mx-4">
                                <img className="w-full h-full rounded-xl" src="./img/background.jpg"/>
                                <div className="bg-white w-5/6 flex-col rounded-xl absolute bottom-3 left-4 px-2">
                                    <p>Chicken Chop</p>
                                    <p>Sold: 4</p>
                                </div>
                            </div>
                            <div className="flex-col w-1/6 relative mx-4">
                                <img className="w-full h-full rounded-xl" src="./img/background.jpg"/>
                                <div className="bg-white w-5/6 flex-col rounded-xl absolute bottom-3 left-4 px-2">
                                    <p>Chicken Chop</p>
                                    <p>Sold: 4</p>
                                </div>
                            </div>
                            <div className="flex-col w-1/6 relative mx-4">
                                <img className="w-full h-full rounded-xl" src="./img/background.jpg"/>
                                <div className="bg-white w-5/6 flex-col rounded-xl absolute bottom-3 left-4 px-2">
                                    <p>Chicken Chop</p>
                                    <p>Sold: 4</p>
                                </div>
                            </div>
                            <div className="flex-col w-1/6 relative mx-4">
                                <img className="w-full h-full rounded-xl" src="./img/background.jpg"/>
                                <div className="bg-white w-5/6 flex-col rounded-xl absolute bottom-3 left-4 px-2">
                                    <p>Chicken Chop</p>
                                    <p>Sold: 4</p>
                                </div>
                            </div>
                            <div className="flex-col w-1/6 relative mx-4">
                                <img className="w-full h-full rounded-xl" src="./img/background.jpg"/>
                                <div className="bg-white w-5/6 flex-col rounded-xl absolute bottom-3 left-4 px-2">
                                    <p>Chicken Chop</p>
                                    <p>Sold: 4</p>
                                </div>
                            </div>
                        </section>
                        <div className="w-full grid grid-cols-2">
                            <h4 className="ml-5 font-bold py-6 text-gray-700">Transaction</h4>
                            <h4 className="ml-5 font-bold py-6 text-gray-700">Statistics</h4>
                        </div>
                        <section className="w-full grid grid-cols-2">
                            <div className="align-middle inline-block min-w-full">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
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
                                                    Time
                                                </th>
                                                <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {/* <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    12/12/2021
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    12.99pm
                                                </td>   
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    RM 12.99
                                                </td>           
                                            </tr> */}
                                            {filteringFoodData(foodId)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="ml-4">
                                <Doughnut
                                    data={{
                                        labels: ['1', '2', '3', '4', '5'],
                                        datasets: [
                                            {
                                                data: [1, 3, 6, 8, 9],
                                                backgroundColor: [
                                                    'rgba(255, 99, 132, 0.2)',
                                                    'rgba(54, 162, 235, 0.2)',
                                                    'rgba(255, 206, 86, 0.2)',
                                                    'rgba(75, 192, 192, 0.2)',
                                                    'rgba(153, 102, 255, 0.2)',
                                                    'rgba(255, 159, 64, 0.2)'
                                                ],
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                              position: 'top',
                                            },
                                            title: {
                                              display: true,
                                              text: 'Chart.js Doughnut Chart'
                                            }
                                          }
                                    }}
                                />
                            </div>
                        </section>
                    </main>
                    </>
                )
            }
        </div>
    )
}

export default TracksPage
