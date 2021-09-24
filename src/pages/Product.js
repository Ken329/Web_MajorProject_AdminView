import React from 'react'
import { BellIcon, CashIcon, CurrencyDollarIcon, QrcodeIcon } from '@heroicons/react/outline'
import Footer from '../components/Footer';

const features = [
  {
    name: 'Daily income system',
    description:
      'User are able to see daily income by the end of the day including paying online and cash.',
    icon: CashIcon,
  },
  {
    name: 'Scanning QR code system',
    description:
      'User are given a QR Code which consist a personal restaurant website with own menu by scanning it.',
    icon: QrcodeIcon,
  },
  {
    name: 'Eatsy wallet',
    description:
      'All of the online payment will be inserted into user eatsy wallet which can be view at the admin dashboard.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Order notification',
    description:
      "When there's a new order, user should be recieving a notification of a new order. User have the full control over the status of the order.",
    icon: BellIcon,
  },
]

export default function Product() {
  return (
    <>
        <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Product</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                A better way for your customers to order
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                A system that allow you to manage your restaurant virtaully and more effiecency 
            </p>
            </div>

            <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => (
                <div key={feature.name} className="relative">
                    <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
                ))}
            </dl>
            </div>
        </div>
        </div>
        <Footer />
    </>
  )
}
