import React from 'react'
import { BellIcon, CashIcon, ChartBarIcon, ChartPieIcon, CurrencyDollarIcon, GlobeIcon, QrcodeIcon, SearchCircleIcon } from '@heroicons/react/outline'
import Footer from '../components/Footer';

const features = [
  {
    name: 'Own online food ordering website',
    description:
      'User are given a personal website which allow customers to order from it, while at the same time user have the full accessibility on the look and feel on the website.',
    icon: GlobeIcon,
  },
  {
    name: 'Access everything through QR Code',
    description:
      'User are provides with various type of QR Code which can handle multiple types of situation and different kind of customers such as dine in, take away or pay at counter.',
    icon: QrcodeIcon,
  },
  {
    name: 'Managing the orders',
    description:
      'User are able to update the status for the specific order, while at the same time customers also able to check the updated status on thier order.',
    icon: SearchCircleIcon,
  },
  {
    name: 'Statistics of your daily sales',
    description:
      "Our dashboard provides your daily and monthly sales, also your top seller.",
    icon: ChartPieIcon,
  },
  {
    name: 'Virtual wallet',
    description:
      "All of the online payment are handle with our virtual wallet, while user also able to track their wallet balance in their own dashbard.",
    icon: CurrencyDollarIcon,
  },
]

export default function Features() {
  return (
    <>
        <div className="min-h-screen py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Enhance the way to interact with customers
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Work more effiecency and smarter with Eatsy food ordering system
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
