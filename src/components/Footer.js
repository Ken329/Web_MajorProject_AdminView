import React from 'react'
import { useHistory } from 'react-router-dom';

function Footer() {
    let history = useHistory();
    function homePage(e){
        history.push("/");
    }
    return (
        <footer className="flex justify-center items-center fixed bottom-0 w-full bg-gray-50">
            <a 
                href="Product" 
                className="
                    cursor-pointer 
                    font-medium 
                    text-gray-500 
                    hover:text-gray-900 
                    my-4 
                    mx-3
                    text-xs
                    md:text-base
                    lg:mx-10
                    sm:mx-12">
            Products</a>
            <a 
                href="Features" 
                className="
                    cursor-pointer 
                    font-medium 
                    text-gray-500 
                    hover:text-gray-900 
                    my-4 
                    mx-3
                    text-xs
                    md:text-base
                    lg:mx-10
                    sm:mx-12">
            Features</a>
            <img 
                onClick={e => homePage(e)} 
                className="w-8 h-8 my-4 mx-10 cursor-pointer" 
                src="../img/logo2.png"/>
            <a 
                href="AboutUs" 
                className="
                    cursor-pointer 
                    font-medium 
                    text-gray-500 
                    hover:text-gray-900 
                    my-4 
                    mx-3
                    text-xs
                    md:text-base
                    lg:mx-10
                    sm:mx-12">
            About Us</a>
            <a 
                href="SignUp" 
                className="
                    cursor-pointer 
                    font-medium 
                    text-gray-500 
                    hover:text-gray-900 
                    my-4 
                    mx-3
                    text-xs
                    md:text-base
                    lg:mx-10
                    sm:mx-12">
            Sign Up Now</a>
        </footer>
    )
}

export default Footer
