import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { ClimbingBoxLoader, GridLoader, HashLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Doughnut } from 'react-chartjs-2';

const cookies = new Cookies();

function TracksPage() {
    let history = useHistory();

    const [bestSellingLoading, setBestSellingLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);

    const [allOrder, setAllOrder] = useState([]);

    const [foodData, setFoodData] = useState([]);
    const [foodQuantity, setFoodQuantity] = useState([]);

    const [foodCuisine, setFoodCuisine] = useState([]);
    const [cuisineQuantity, setCuisineQuantity] = useState([]);

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
                }
            })
        }else{
            history.push("/");
        }
    }, [] ) 

    // getting food data
    function getAllFood(id){
        Axios.post("https://eatsy-0329.herokuapp.com/getAllFilteringOrder", {
            id: id
        })
        .then((res) => {
            if(res.data.success){
                const data = res.data.data;
                var sortedData = sortingArrayObj(data);
                var foodIdList = [];
                var allFoodId = [];
                var allFoodQuantity = [];
                var count = 0;
                for(var i = sortedData.length - 1; i >= 0; i--){
                    if(count < 5){
                        foodIdList.push(sortedData[i].id);
                        setFoodQuantity(array => [...array, sortedData[i].quantity])
                    }
                    count++; 
                    allFoodQuantity.push(sortedData[i].quantity);
                    allFoodId.push(sortedData[i].id);
                }
                insertBestSelling(id, foodIdList);
                insertSoldCuisine(id, allFoodId, allFoodQuantity);
                insertAllOrder(id);
            }
        })
    }

    // insert best selling food
    function insertBestSelling(id, data){
        Axios.post('https://eatsy-0329.herokuapp.com/trackingFoodWithId', {
            restaurantId: id,
            foodId: data
        })
        .then((res) => {
            var foodData = res.data.data;
            for(var i = 0; i < foodData.length; i++){
                setFoodData(array => [...array, foodData[i]]);
            }
            setBestSellingLoading(false);
        })
    }

    // insert all order record
    function insertAllOrder(id){
        Axios.post('https://eatsy-0329.herokuapp.com/getAllOrder', {
            id: id,
        })
        .then((res) => {
            var foodData = res.data.data;
            var result = [];
            for(var i = 0; i < foodData.length; i++){
                if(result.length < 10){
                    for(var j = 0; j < foodData[i].data.length; j++){
                        result.push(foodData[i].data[j]);
                    }
                }
            }
            setAllOrder(result);
        })
    }

    // insert sold cuisine
    function insertSoldCuisine(id, data, quantity){
        Axios.post('https://eatsy-0329.herokuapp.com/trackingFoodWithId', {
            restaurantId: id,
            foodId: data
        })
        .then((res) => {
            var foodData = res.data.data;
            var insertedData = [];
            var insertQuantity = [];
            for(var i = 0; i < foodData.length; i++){
                var index = insertedData.findIndex(e => e === foodData[i].food_categories);
                if(index < 0){
                    insertedData.push(foodData[i].food_categories);
                    insertQuantity.push(quantity[i])
                }else{
                    insertQuantity[index] += quantity[i];
                }
            }
            setFoodCuisine(insertedData);
            setCuisineQuantity(insertQuantity);
        })
    }

    // sorting function
    function sortingArrayObj(data){
        data.sort(function (a, b) {
            return a.quantity - b.quantity;
        });
        return data;
    }

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <ToastContainer />
                <Header 
                    last_name={"Ken"} 
                    first_name={"Liau"} 
                    gender={userDetail.user_gender}
                    credit={userDetail.user_credit}
                    section={5}
                />
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Transaction</h1>
                    </div>
                </header>
                <main className="flex-col relative w-4/5 mx-auto pb-6">
                    <h4 className='mx-5 py-6 font-bold text-gray-700'>Top 5 Best Seller</h4>
                    {
                        bestSellingLoading 
                        ? <div className="w-full flex justify-center items-center py-3">
                            <HashLoader size="30" color={"#1A1B1B"}/>
                        </div>
                        : <>
                            {
                                foodData.length === 0 
                                ? <h4 className="text-gray-700 w-full text-center font-bold py-3 text-sm">No Order has been made</h4>
                                : <section className="flex w-full h-2/5">
                                    {
                                        foodData.map((data, index) => {
                                            return <div key={index} className="flex-col w-1/6 relative mx-4">
                                                        <img className="w-full h-36 rounded-xl" src={data.food_image}/>
                                                        <div className="bg-white w-5/6 flex-col rounded-xl absolute bottom-3 left-4 px-2">
                                                            <p>{data.food_name}</p>
                                                            <p>Sold: {foodQuantity[index]}</p>
                                                        </div>
                                                    </div>
                                            })
                                    }
                                    {/* <div className="flex-col w-1/6 relative mx-4">
                                        <img className="w-full h-full rounded-xl" src="./img/background.jpg"/>
                                        <div className="bg-white w-5/6 flex-col rounded-xl absolute bottom-3 left-4 px-2">
                                            <p>Chicken Chop</p>
                                            <p>Sold: 4</p>
                                        </div>
                                    </div> */}    
                                </section>
                            }
                        </>
                    }
                    <div className="w-full grid grid-cols-2">
                        <h4 className="ml-5 font-bold py-6 text-gray-700 text-center">Transaction</h4>
                        <h4 className="ml-5 font-bold py-6 text-gray-700 text-center">Statistics</h4>
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
                                        {
                                            allOrder.map((data) => {
                                                return <tr key={data.order_id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(data.order_date.seconds * 1000).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(data.order_date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                                        </td>   
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {'RM ' + data.order_amount}
                                                        </td>           
                                                    </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="ml-4">
                            <Doughnut
                                data={{
                                    labels: foodCuisine,
                                    datasets: [
                                        {
                                            data: cuisineQuantity,
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
                                            text: 'Best cuisine in '+userDetail.user_restaurant
                                        }
                                    }
                                }}
                            />
                        </div>
                    </section>
                </main>
        </div>
    )
}

export default TracksPage
