import React from 'react'

export default function CustomerFooter() {
    return (
        <footer className="grid grid-cols-1 bg-white p-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="flex justify-center py-2">
                <img 
                    className="w-6 h-6 cursor-pointer" 
                    src="../img/logo2.png"/>
                <p className="mx-1 font-semibold text-gray-500 cursor-pointer">© 2021 Eatsy</p>
            </div>
            <a
            href="mailto:ken037729@gamil.com" 
            className="text-center py-2 font-semibold text-gray-500">Email: ken_037729@hotmail.com</a>
            <a
            href="tel: +6012-7022260" 
            className="text-center py-2 font-semibold text-gray-500">Contact: +6012-7022260</a>
            <a
            href="https://github.com/Ken329" 
            className="text-center py-2 font-semibold text-gray-500">Github: Ken Liau</a>
        </footer>
    )
}
