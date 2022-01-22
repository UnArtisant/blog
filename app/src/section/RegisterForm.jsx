import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {registerSchema} from "../utils/schema/register";
import {Program, Provider, web3} from '@project-serum/anchor'
import {useContext} from "react";
import {WorkspaceContext} from "../context/workspace-context";
import idl from "../../../target/idl/blog.json"
import {User} from "../utils/struct/User";

function RegisterForm() {

    const {wallet, connection, programID, state} = useContext(WorkspaceContext)

    const provider = new Provider(connection, wallet, {
        preflightCommitment: state.preflightCommitment,
        commitment: state.commitment
    })
    const program = new Program(idl, programID, provider)

    const {register, handleSubmit} = useForm({
        mode: "onBlur",
        resolver: yupResolver(registerSchema)
    });
    const onSubmit = async (data) => {
        const {bio, pseudo} = data
        const user = web3.Keypair.generate();

        try {
            await program.rpc.initializeUser(bio, pseudo, {
                accounts: {
                    user: user.publicKey,
                    author: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId
                },
                signers: [user],
            });
        } catch (error) {
            console.log(error)
        }

        const account = await program.account.user.fetch(user.publicKey)
        state.login(new User(account.publicKey, account.account))
    };
    return <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" action="#" method="POST">
        <div>
            <label htmlFor="pseudo" className="block text-sm font-medium text-gray-700">
                *Pseudo
            </label>
            <div className="mt-1">
                <input
                    {...register("pseudo")}
                    id="pseudo"
                    placeholder="John Doe"
                    name="pseudo"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </div>

        <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Add a small description
            </label>
            <div className="mt-1">
                          <textarea
                              placeholder="Hey, please provide a short and dynamic description."
                              rows={4}
                              {...register("bio")}
                              name="comment"
                              id="bio"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              defaultValue={''}
                          />
            </div>
        </div>

        <div>
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Register me
            </button>
        </div>
    </form>
}

export default RegisterForm