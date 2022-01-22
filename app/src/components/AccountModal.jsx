import {XIcon} from "@heroicons/react/outline";
import {Dialog, Transition} from "@headlessui/react";
import {Fragment, useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "../context/workspace-context";
import {Link, useLocation} from "react-router-dom";
import {useWallet} from "@solana/wallet-adapter-react";

function AccountModal() {
    const {connected} = useWallet()
    const {pathname} = useLocation()
    const {state} = useContext(WorkspaceContext)
    const [isOpen, setIsOpen] = useState(false)

    const closeModal = () => {
        setIsOpen(false)
    }

    const openModal = () => {
        setIsOpen(true)
    }

    useEffect(() => {
        if (!state.user && connected && pathname !== "/register"){
            openModal()
        } else {
            closeModal()
        }
    }, [connected, state.user])

    return <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={closeModal}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >

                <div
                    className=" mt-16 bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                    <div>
                        <div
                            className="flex justify-end w-full">
                            <XIcon onClick={closeModal} className="h-6 w-6 cursor-pointer text-gray-600"
                                   aria-hidden="true"/>
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                Create an account ?
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    If you want to have access to all the features and functionalities of our website
                                    please create an account.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                        <Link
                            onClick={closeModal}
                            to="/register"
                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>
            </Transition.Child>
        </Dialog>
    </Transition>
}

export default AccountModal