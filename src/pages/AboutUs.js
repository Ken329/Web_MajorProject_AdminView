import React from 'react'
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/outline'
import Footer from '../components/Footer';

const features = [
  {
    name: 'Increase Revenue More Than 20%',
    description: [
      {
        word: 'Increased Table Turnover',
        icon: CheckCircleIcon,
      },
      {
        word: 'Increased Ticket Size',
        icon: CheckCircleIcon,
      },
      {
        word: 'Increased Tip Amounts',
        icon: CheckCircleIcon,
      },
    ]
  },
  {
    name: 'Decrease Operational Costs by 30%',
    description: [
      {
        word: 'Eliminate Human Errors',
        icon: CheckCircleIcon,
      },
      {
        word: 'Increased Labor Productivity',
        icon: CheckCircleIcon,
      },
      {
        word: 'Low Maintenance',
        icon: CheckCircleIcon,
      },
    ]
  },
  {
    name: 'Gain More Control Over Your Business',
    description: [
      {
        word: 'Real-Time Data',
        icon: CheckCircleIcon,
      },
      {
        word: 'Data Analytics for Smarter Decisions',
        icon: CheckCircleIcon,
      },
      {
        word: 'Update with One Click',
        icon: CheckCircleIcon,
      },
    ]
  },
  {
    name: 'Lowest Commision Rate',
    description: [
      {
        word: 'Our rate is the most competitive in the market',
        icon: InformationCircleIcon,
      },
    ]
  },
  {
    name: 'Own Your Customers',
    description: [
      {
        word: 'You own the data, utilizing a comprehensive CRM program',
        icon: InformationCircleIcon,
      },
    ]
  },
  {
    name: 'Simple & Proven Plug & Play Solutions',
    description: [
      {
        word: 'Increase average customer spend while reducing operation cost',
        icon: InformationCircleIcon,
      },
    ]
  },
]

export default function AboutUs() {
  return (
    <>
        <div className=" min-h-screen py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">About us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Get to know us more from here
            </p>
            </div>
            <div className="mt-10 space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                {
                  features.map((data) => {
                    return <div className="shadow-xl rounded-lg p-3">
                              <h3 >{data.name}</h3>
                              {
                                data.description.map((description) => {
                                  return<div className="flex mt-5">
                                          <description.icon className="h-6 w-6 mx-2" aria-hidden="true" />
                                          <p className="mx-2">{description.word}</p>
                                      </div>
                                })
                              }
                          </div>
                  })
                }
            </div>
        </div>
        </div>
        <Footer />
    </>
  )
}
