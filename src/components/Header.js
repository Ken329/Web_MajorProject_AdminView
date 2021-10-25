import Cookies from 'universal-cookie';
import { Fragment, Component } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

const cookies = new Cookies();

const navigation = [
    { name: 'Dashboard', href: '/Dashboard', current: false },
    { name: 'Menu', href: '/MenuPage', current: false },
    { name: 'QR Code', href: '/QrPage', current: false },
    { name: 'Tracking', href: '/Tracking', current: false },
    { name: 'History', href: '/History', current: false },
    { name: 'Transaction', href: '/Transaction', current: false },
]
const userNavigation = [
    { name: 'Your Profile', href: '/Profile' },
    { name: 'User Credit', href: '#' },
    { name: 'Sign Out', href: '#' },
]
  
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function getUserIcon(gender){
    switch(gender){
        case "Mr.":
            return <img className="h-10 w-10 rounded-full" src="../img/gender-man.png" alt="" />;
        case "Ms.":
            return <img className="h-10 w-10 rounded-full" src="../img/gender-women.png" alt="" />;
        default:
            return <img className="h-10 w-10 rounded-full" src="../img/gender-other.png" alt="" />;
    }
}

function updateSection(section){
    if(section >= 0){
        navigation[section].current = true;
    }
}

function signOut(e){
    cookies.remove("user_id", {path: "/"});
    window.location.reload();
}

class Header extends Component{
    componentDidMount(){
        updateSection(this.props.section)
    }
    render(){
        return (
            <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
            <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                    <a href="/Dashboard" className="flex-shrink-0">
                        <img
                        className="h-8 w-8"
                        src="../img/logo2.png"
                        alt="Workflow"
                        />
                    </a>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                            <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                                item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                            >
                            {item.name}
                            </a>
                        ))}
                        </div>
                    </div>
                    </div>
                    <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                        <button
                        type="button"
                        className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="ml-3 relative">
                        <div>
                            <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            {getUserIcon(this.props.gender)}
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="origin-top-right absolute right-0 z-20 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                {({ active }) => (
                                    item.name === "Sign Out"
                                    ? <a
                                        href={item.href}
                                        onClick={e => signOut(e)}
                                        className={classNames(
                                            active ? 'bg-gray-100' : '',
                                            'block px-4 py-2 text-sm text-gray-700'
                                        )}
                                        >
                                        {item.name}
                                    </a>
                                    : <a
                                        href={item.href}
                                        className={classNames(
                                            active ? 'bg-gray-100' : '',
                                            'block px-4 py-2 text-sm text-gray-700'
                                        )}
                                        >
                                        {item.name}
                                    </a>
                                )}
                                </Menu.Item>
                            ))}
                            </Menu.Items>
                        </Transition>
                        </Menu>
                    </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </Disclosure.Button>
                    </div>
                </div>
                </div>

                <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navigation.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block px-3 py-2 rounded-md text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                    >
                        {item.name}
                    </a>
                    ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                        {this.props.icon}
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">{this.props.last_name} {this.props.first_name}</div>
                    </div>
                    <button
                        type="button"
                        className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                    {userNavigation.map((item) => (
                        item.name === "Sign Out"
                        ?<a
                            onClick={e => signOut()}
                            key={item.name}
                            href={item.href}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                            {item.name}
                        </a>
                        :<a
                            key={item.name}
                            href={item.href}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                            {item.name}
                        </a>
                    ))}
                    </div>
                </div>
                </Disclosure.Panel>
            </>
            )}
        </Disclosure>
        )
    }
}
export default Header
        