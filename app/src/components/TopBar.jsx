import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import {Link, useLocation} from "react-router-dom";
import {classNames} from "../utils/tailwind-ui";
import {useWallet} from "@solana/wallet-adapter-react";
import {WalletModalProvider, WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import {navigation, navigationConnected} from "../data/topbar";
import {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "../context/workspace-context";

export default function TopBar({className}) {
    const {pathname} = useLocation()
    const {connected} = useWallet()
    const {state} = useContext(WorkspaceContext)
    const [links, setLinks] = useState(navigation)

    useEffect(() => {
        connected && !state.user ? setLinks(navigationConnected) : setLinks(navigation)
    }, [connected])

    return (
        <Disclosure as="nav" className={`${className === "sticky" ? "fixed" : ""} w-full bg-white shadow`}>
            {({ open }) => (
                <>
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex justify-between h-16">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex-shrink-0 flex items-center">
                                    <img
                                        className="block  h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                        alt="Workflow"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    {links.map((item,k) => (
                                        <Link
                                            key={k}
                                            to={item.href}
                                            className={`${item.href === pathname ? "border-indigo-500 text-gray-900" : "text-gray-900"}  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}

                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <div className="hidden md:block">
                                    <WalletModalProvider >
                                        <WalletMultiButton></WalletMultiButton>
                                    </WalletModalProvider>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="pt-2 pb-4 space-y-1">
                            {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                            {links.map((item,k) => (
                                        <Link
                                            key={k}
                                            to={item.href}
                                            className={classNames(item.href === pathname ? "bg-indigo-50 border-indigo-500 text-indigo-700": "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700", " block pl-3 pr-4 py-2 border-l-4 text-base font-medium")}
                                        >
                                            {item.name}
                                        </Link>
                            ))}
                            <div className="my-4 ml-3">
                                <WalletModalProvider >
                                    <WalletMultiButton></WalletMultiButton>
                                </WalletModalProvider>
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}