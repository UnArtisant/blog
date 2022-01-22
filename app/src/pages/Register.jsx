import RegisterForm from "../section/RegisterForm";
import {useWallet} from "@solana/wallet-adapter-react";
import {useContext, useEffect} from "react";
import {WorkspaceContext} from "../context/workspace-context";
import {useHistory} from "react-router-dom";


function Register() {

    const {connected} = useWallet()
    const {user} = useContext(WorkspaceContext)

    const history = useHistory()

    useEffect(() => {
        if(user || !connected) {
            history.push("/")
        }
    }, [connected, user])

    return <div className="min-h-full bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register to your wallet</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <RegisterForm />
            </div>
        </div>
    </div>
}

export default Register