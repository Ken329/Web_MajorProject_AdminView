import { Mail, Phone } from 'heroicons-react'
import React from 'react'

export default function CustomerFooter() {
    return (
        <footer className="grid grid-cols-5 bg-white p-3">
            <div className="flex justify-center py-2 col-span-2">
                <img 
                    className="w-6 h-6 cursor-pointer" 
                    src="../img/logo2.png"/>
                <p className="mx-1 font-semibold text-gray-500 cursor-pointer">© 2021 Eatsy</p>
            </div>
            <a
            href="mailto:ken037729@gamil.com" 
            className="flex justify-center items-center py-2 font-semibold text-gray-500 hover:text-gray-700"><Mail className="w-4 h-4 md:w-5 md:h-5 lg:w-7 lg:h-7"/></a>
            <a
            href="tel: +6012-7022260" 
            className="flex justify-center items-center py-2 font-semibold text-gray-500 hover:text-gray-700"><Phone className="w-4 h-4 md:w-5 md:h-5 lg:w-7 lg:h-7"/></a>
            <a
            href="https://github.com/Ken329" 
            className="flex justify-center items-center py-2 font-semibold text-gray-500 hover:text-gray-700"><img className="w-4 h-4 md:w-5 md:h-5 lg:w-7 lg:h-7" src="../img/github.png"/></a>
        </footer>
    )
}
