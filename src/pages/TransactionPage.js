import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { HashLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Doughnut } from 'react-chartjs-2';
import './scrollbar.css'
import Footer from '../components/Footer';

const cookies = new Cookies();

function TransactionPage() {
    let history = useHistory();

    const [bestSellingLoading, setBestSellingLoading] = useState(true);
    const [transactionLoading, setTransactionLoading] = useState(true);
    const [statisticLoading, setStatisticLoading] = useState(true);

    const [userDetail, setUserDetail] = useState([]);

    const [allOrder, setAllOrder] = useState([]);

    const [foodData, setFoodData] = useState([]);
    const [foodQuantity, setFoodQuantity] = useState([]);

    const [foodCuisine, setFoodCuisine] = useState([]);
    const [cuisineQuantity, setCuisineQuantity] = useState([]);

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
        Axios.post('https://eatsy-0329.herokuapp.com/getFoodWithId', {
            id: id,
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
            for(var i = foodData.length - 1; i >= 0; i--){
                if(result.length < 9){
                    for(var j = 0; j < foodData[i].data.length; j++){
                        result.push(foodData[i].data[j]);
                    }
                }
            }
            setAllOrder(result);
            setTransactionLoading(false);
        })
    }

    // insert sold cuisine
    function insertSoldCuisine(id, data, quantity){
        Axios.post('https://eatsy-0329.herokuapp.com/getFoodWithId', {
            id: id,
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
            setStatisticLoading(false);
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
            <div className="min-h-screen w-full">
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
                                            return <div key={index} className="flex-col w-1/6 relative mx-4 overflow-hidden">
                                                        <img className="w-full h-36 rounded-xl" src={data.food_image}/>
                                                        <div className="bg-white w-full flex-col rounded-xl absolute bottom-0 transform 
                                                        translate-y-1/2 ease-in-out duration-700 hover:translate-y-0">
                                                            <p className="text-center text-xs lg:text-sm">Sold: {foodQuantity[index]}</p>
                                                            <input
                                                            disabled={true} 
                                                            className="w-full px-1 text-center text-xs pb-1 bg-white lg:text-sm" 
                                                            defaultValue={data.food_name}/>
                                                        </div>
                                                    </div>
                                            })
                                    }
                                </section>
                            }
                        </>
                    }
                    <div className="w-full grid grid-cols-2">
                        <h4 className="font-bold py-6 text-gray-700 text-center">Transaction</h4>
                        <h4 className="font-bold py-6 text-gray-700 text-center">Statistics</h4>
                    </div>
                    <section className="w-full grid grid-cols-2">
                        {
                            transactionLoading
                            ? <div className="w-full flex justify-center items-center py-3">
                                <HashLoader size="30" color={"#1A1B1B"}/>
                            </div>
                            : <>
                                {
                                allOrder.length === 0
                                ? <h4 className="text-gray-700 w-full text-center font-bold py-3 text-sm">No Transaction Record so far</h4>
                                : <div className="align-middle inline-block min-w-full">
                                    <div className="shadow overflow-hidden overflow-y-auto border-b border-gray-200 max-h-64 md:max-h-96 no-scrollbar lg:max-h-screen sm:rounded-lg">
                                        <p className="px-5 py-1 font-semibold text-gray-600">Past 10 Days</p>
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
                                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 md:text-sm lg:text-base">
                                                                    {new Date(data.order_date.seconds * 1000).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 md:text-sm lg:text-base">
                                                                    {new Date(data.order_date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                                                </td>   
                                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 md:text-sm lg:text-base">
                                                                    {'RM ' + data.order_amount}
                                                                </td>           
                                                            </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }
                            </>
                        }
                        {
                            statisticLoading
                            ? <div className="w-full flex justify-center items-center py-3">
                                <HashLoader size="30" color={"#1A1B1B"}/>
                            </div>
                            : <>
                                {
                                    foodCuisine.length === 0
                                    ? <h4 className="text-gray-700 w-full text-center font-bold py-3 text-sm">No Cuisine Record so far</h4>
                                    : <div className="ml-4">
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
                                }
                            </>
                        }
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default TransactionPage
