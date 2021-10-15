import { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
import Header from '../components/Header'
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { PlusCircle } from 'heroicons-react';
import { ClimbingBoxLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

function AdminPage() {
    let history = useHistory();

    // loading 
    const [loading, setLoading] = useState(true);

    // user detail and menu detail
    const [userDetail, setUserDetail] = useState([]);
    const [userMenu, setUserMenu] = useState([]);
    const [menuId, setMenuId] = useState([]);
    const [menuCategories, setMenuCategories] = useState([]);

    // order detail
    const [pendingOrder, setPendingOrder] = useState([]);
    const [prepareOrder, setPrepareOrder] = useState([]);
    const [doneOrder, setDoneOrder] = useState([]);

    // table detail
    const [pendingTable, setPendingTable] = useState([]);
    const [approvedTable, setApprovedTable] = useState([]);

    // cart
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0.00);
    const [method, setmethod] = useState("");
    
    useEffect( () => {
        const interval = setInterval(() => {
            const id = cookies.get("user_id");

            Axios.post("https://eatsy-0329.herokuapp.com/getOrderWithIdNDate", {
                id: id
            })
            .then( (res) => {
                if(res.data.success){
                    const data = res.data.data;
                    var pendingCount = 0;
                    for(var i = 0; i < data.length; i++){
                        if(data[i].order_status === "pending"){
                            pendingCount++;
                        }
                    }
                    if(parseInt(document.getElementById("order_pending").innerHTML) !== 0 && 
                    pendingCount > parseInt(document.getElementById("order_pending").innerHTML)){
                        var lastestOrder =  pendingCount - parseInt(document.getElementById("order_pending").innerHTML);
                        toast.info(lastestOrder + " new Order has been made by your customer", {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 3000
                        });
                    }
                    setPendingOrder([]);
                    setPrepareOrder([]);
                    setDoneOrder([]);
                    for(var i = 0; i < data.length; i++){
                        if(data[i].order_status === "pending"){
                            setPendingOrder(array => [...array, data[i]]);
                        }else if(data[i].order_status === "prepare"){
                            setPrepareOrder(array => [...array, data[i]]);
                        }else if(data[i].order_status === "done"){
                            setDoneOrder(array => [...array, data[i]]);
                        }
                    }
                }
            })

            Axios.post("https://eatsy-0329.herokuapp.com/getTableWithIdNDate", {
                id: id
            })
            .then((res) => {
                if(res.data.success){
                    const data = res.data.data;
                    console.log(data)
                    var pendingCount = 0;
                    for(var i = 0; i < data.length; i++){
                        if(data[i].status === "pending"){
                            pendingCount++;
                        }
                    }
                    if(parseInt(document.getElementById("table_pending").innerHTML) !== 0 && 
                    pendingCount > parseInt(document.getElementById("table_pending").innerHTML)){
                        var lastestOrder =  pendingCount - parseInt(document.getElementById("table_pending").innerHTML);
                        toast.info(lastestOrder + " new table has been book by your customer", {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 3000
                        });
                    }
                    setPendingTable([]);
                    setApprovedTable([]);
                    for(var i = 0; i < data.length; i++){
                        if(data[i].status === "pending"){
                            setPendingTable(array => [...array, data[i]]);
                        }else if(data[i].status === "approved"){
                            setApprovedTable(array => [...array, data[i]]);
                        }
                    }
                }
            })
        }, 3000);

        return () => clearInterval(interval);
    }, [] )

    function insertCategories(data) {
        var myData = [];
        var list = [];
        list.push(<span 
            key={'All'} 
            onClick={e => getCategoriesClicked("All")}
            data-categories={"All"}
            className="m-2 px-4 py-2 bg-gray-300 rounded-3xl cursor-pointer z-10 categories-btn">
            {"All"}
        </span>);
        for(var i = 0; i < data.length; i++){
            if(!myData.includes(data[i])){
                myData.push(data[i]);
                list.push(<span 
                        key={data[i]} 
                        onClick={e => getCategoriesClicked(e.target.dataset.categories)}
                        data-categories={data[i]}
                        className="m-2 px-4 py-2 bg-white rounded-3xl cursor-pointer z-10 categories-btn">
                        {data[i]}
                    </span>);
            }
        }
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
        var allCon = document.getElementsByClassName("bg-white h-72 flex-col rounded-lg relative m-5");
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
                name: arr[index].name
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
            name: detail.food_name
        }
        setCart(array => [...array, data]);
        calculateTotalPrice(price, "plus");
    }
    function alteringCart(index, action){
        let arr = [...cart];
        if(action === "minus"){
            arr[index] = {
                id: arr[index].id,
                price: (parseFloat(arr[index].singlePrice) * (parseInt(arr[index].quantity) - 1)).toFixed(2),
                singlePrice: arr[index].singlePrice,
                quantity: parseInt(arr[index].quantity) - 1,
                image: arr[index].image,
                name: arr[index].name
            }
            if(arr[index].quantity <= 0){
                arr.splice(index, 1); 
            }
            calculateTotalPrice(arr[index].singlePrice, "minus")
            setCart(arr);
        }else{
            arr[index] = {
                id: arr[index].id,
                price: (parseFloat(arr[index].singlePrice) * (parseInt(arr[index].quantity) + 1)).toFixed(2),
                singlePrice: arr[index].singlePrice,
                quantity: parseInt(arr[index].quantity) + 1,
                image: arr[index].image,
                name: arr[index].name
            }
            calculateTotalPrice(arr[index].singlePrice, "plus")
            setCart(arr);
        }
    }
    function proceedToCheckout(e){
        if(cart.length < 1){
            toast.warn("Add minimum one item into your cart !", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
            return;
        }
        if(method === ""){
            toast.warn("Select one method above before you proceed to checkout !", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
            return;
        }
        if(method === "take-away"){
            var newCart = updateNewCart(cart);
            const id = cookies.get("user_id");
            var newTotal = (parseFloat(total) + (parseFloat(total) * 0.06)).toFixed(2);
            Axios.post('https://eatsy-0329.herokuapp.com/restaurantTakeAway', {
                id: id,
                orderId: uniqueId(),
                food: JSON.stringify({food: newCart}),
                amount: newTotal.toString(),
                type: "take away",
                status: "pending",
            })
            .then((res) => {
                toast.success(res.data.data, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
                setCart([]);
                setTotal(0.00);
                setmethod("");
            })
        }else{
            var tableNo = document.getElementById("table_no").value;
            if(tableNo === ""){
                toast.warn("Please fill up your table no section", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
                return;
            }
            var newCart = updateNewCart(cart);
            const id = cookies.get("user_id");
            var newTotal = (parseFloat(total) + (parseFloat(total) * 0.06)).toFixed(2);
            Axios.post('https://eatsy-0329.herokuapp.com/restaurantDineIn', {
                id: id,
                orderId: uniqueId(),
                food: JSON.stringify({food: newCart}),
                amount: newTotal.toString(),
                tableNo: tableNo.toString(),
                type: "take away",
                status: "pending",
            })
            .then((res) => {
                toast.success(res.data.data, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
                setCart([]);
                setTotal(0.00);
                setmethod("");
                document.getElementById("table_no").value = "";
                document.getElementById("div-table").style.display = "none";
            })
        }
    }
    
    // calculating total price 
    function calculateTotalPrice(price, action){
        if(action === 'minus'){
            setTotal((parseFloat(total) - parseFloat(price)).toFixed(2))
            return;
        }
        setTotal((parseFloat(total) + parseFloat(price)).toFixed(2))
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
    function uniqueId () {
        var idStrLen = 32;
        var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
        idStr += (new Date()).getTime().toString(36) + "_";
        do {
            idStr += (Math.floor((Math.random() * 35))).toString(36);
        } while (idStr.length < idStrLen);
    
        return (idStr);
    }

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
                        getCategoriesClicked("All");
                    })
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
                        section={0}
                    />
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        </div>
                    </header>
                    <main className="flex relative overflow-hidden">
                        <div className="absolute left-1/3 flex">
                            <div className="cursor-pointer flex-col shadow-lg ml-3 px-3 
                            py-2 rounded-b-lg relative -top-14 hover:top-0 z-20 bg-gray-100">
                                <h5 className="w-full text-center">Track Order</h5>
                                <div className="flex">
                                    <div className="mx-2 flex-col">
                                        <p id="order_pending" className="w-full text-center">{pendingOrder.length}</p>
                                        <p>Pending</p>
                                    </div>
                                    <div className="flex-col mx-2">
                                        <p className="w-full text-center">{prepareOrder.length}</p>
                                        <p>Working</p>
                                    </div>
                                    <div className="flex-col mx-2">
                                        <p className="w-full text-center">{doneOrder.length}</p>
                                        <p>Done</p>
                                    </div>
                                </div>
                            </div>
                            <div className="cursor-pointer flex-col shadow-lg ml-3 px-3 
                            py-2 rounded-b-lg relative -top-14 hover:top-0 z-20 bg-gray-100">
                                <h5 className="w-full text-center">Book Table</h5>
                                <div className="flex">
                                    <div className="mx-2 flex-col">
                                        <p id="table_pending" className="w-full text-center">{pendingTable.length}</p>
                                        <p>Pending</p>
                                    </div>
                                    <div className="flex-col mx-2">
                                        <p className="w-full text-center">{approvedTable.length}</p>
                                        <p>Approved</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-6xl w-3/4 flex-col py-6 sm:px-6 lg:px-8">
                            <div className="w-full py-4 flex flex-wrap">
                                {  insertCategories(menuCategories) }
                            </div>
                            <div className="w-full grid grid-cols-2 py-6 md:grid-cols-3 lg:grid-cols-4">
                                {
                                    userMenu.map((data, index) => {
                                        return <div 
                                                key={data.item_name}
                                                className={"bg-white h-72 flex-col rounded-lg relative m-5 categories_"+data.food_categories}>
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
                            </div>
                        </div>
                        <div className="bg-white w-1/4 h-full m-3 rounded-md">
                            <div className="w-full flex justify-center items-center">
                                <button 
                                    onClick={e => {
                                        setmethod("take-away")
                                    }}
                                    className="bg-gray-100 px-4 py-2 rounded-lg m-2 hover:bg-gray-200 focus:bg-gray-300 checkout-btn">
                                        Take Away
                                </button>
                                <button 
                                    onClick={e => {
                                        document.getElementById("div-table").style.display = "flex";
                                        setmethod("dine-in")
                                    }}
                                    className="bg-gray-100 px-4 py-2 rounded-lg m-2 hover:bg-gray-200 focus:bg-gray-300 checkout-btn">
                                        Dine In
                                </button>
                            </div>
                            <div id="div-table" className="w-full hidden justify-center py-1">
                                <input 
                                    id="table_no"
                                    className="w-4/5 h-auto border-gray-400 border-2 px-2 py-1 rounded-md" 
                                    placeholder="Table No"/>
                            </div>
                            <div className="flex-col p-3 justify-center">
                                {
                                    cart.length === 0 ? (
                                        <p className="w-full text-center my-3">Empty Cart</p>
                                    ) : (
                                        cart.map((data, index) => {
                                            return <div key={data.name} className="flex my-2 items-center">
                                                        <img className="rounded-full w-12 h-12" src={data.image}/>
                                                        <div className="flex-col w-4/5">
                                                            <p className="text-center my-2">{data.name}</p>
                                                            <div className="grid grid-cols-1 my-2 lg:grid-cols-2 ">
                                                                <div className="flex justify-center items-center">
                                                                    <MinusCircleIcon 
                                                                        onClick={e => alteringCart(index,  "minus")}
                                                                        className="w-5 h-5 mx-2 cursor-pointer"/>
                                                                    <p>{data.quantity}</p>
                                                                    <PlusCircleIcon 
                                                                        onClick={e => alteringCart(index,  "plus")}
                                                                        className="w-5 h-5 mx-2 cursor-pointer"/>
                                                                </div>
                                                                <p className="text-center">RM {data.price}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                        })
                                    )
                                }
                                <div className="w-full flex-col">
                                    <p className="text-right px-2">Total: RM{total}</p>
                                    <p className="text-right px-2">SST 6%: RM{(parseFloat(total) * 0.06).toFixed(2)}</p>
                                    <p className="text-right px-2">Total + SST: RM{(parseFloat(total) + (parseFloat(total) * 0.06)).toFixed(2)}</p>
                                    <button 
                                        onClick={e => proceedToCheckout(e)}
                                        className="w-full py-3 mt-3 cursor-pointer rounded-lg bg-gray-700 text-white hover:bg-gray-800">
                                            Proceeed to checkout
                                    </button>
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
