import React from 'react'
import { useHistory } from 'react-router-dom';
import './footerResponsive.css'

function Footer() {
    let history = useHistory();
    function homePage(e){
        history.push("/");
    }
    return (
        <footer className="w-full grid py-6 mt-3 relative sm:grid-cols-2 lg:grid-cols-5 bg-gray-50">
            <a 
                href="Product" 
                className="
                    cursor-pointer 
                    text-center
                    font-medium 
                    text-gray-500 
                    hover:text-gray-900 
                    text-xs
                    md:text-base
                    py-3 lg:py-0">
            Products</a>
            <a 
                href="Features" 
                className="
                    cursor-pointer 
                    font-medium 
                    text-center
                    text-gray-500 
                    hover:text-gray-900 
                    text-xs
                    md:text-base
                    py-3 lg:py-0">
            Features</a>
            <div 
            onClick={e => homePage(e)} 
            className="copy-right">
                <img 
                    className="w-6 h-6 cursor-pointer" 
                    src="../img/logo2.png"/>
                <p className="mx-1 font-semibold text-gray-500 cursor-pointer">© 2021 Eatsy</p>
            </div>
            <a 
                href="AboutUs" 
                className="
                    cursor-pointer 
                    font-medium 
                    text-center
                    text-gray-500 
                    hover:text-gray-900
                    text-xs
                    md:text-base
                    py-3 lg:py-0">
            About Us</a>
            <a 
                href="SignUp" 
                className="
                    cursor-pointer 
                    font-medium 
                    text-center
                    text-gray-500 
                    hover:text-gray-900 
                    text-xs
                    md:text-base
                    py-3 lg:py-0">
            Sign Up Now</a>
        </footer>
    )
}

export default Footer
