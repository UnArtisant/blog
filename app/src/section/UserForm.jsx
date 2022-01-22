import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {registerSchema} from "../utils/schema/register";
import {useContext} from "react";
import {WorkspaceContext} from "../context/workspace-context";
import {Program, Provider} from "@project-serum/anchor";
import idl from "../../../target/idl/blog.json"
import {authorFilter} from "../utils/filter/user";
import {User} from "../utils/struct/User";

function UserForm () {

    const {wallet, connection, programID, state, login} = useContext(WorkspaceContext)

    const provider = new Provider(connection, wallet, {
        preflightCommitment: state.preflightCommitment,
        commitment: state.commitment
    })
    const program = new Program(idl, programID, provider)

    const {register, handleSubmit} = useForm({
        mode: "onBlur",
        resolver: yupResolver(registerSchema),
        defaultValues : {
            bio : state.user.bio,
            pseudo : state.user.pseudo
        }
    });

    const onSubmit = async ({bio, pseudo}) => {
        const user = await program.account.user.all([authorFilter(wallet.publicKey.toBase58())])
        await program.rpc.userInformation(bio, pseudo, {
            accounts: {
                user: user[0].publicKey,
                author: wallet.publicKey,
            }
        });
        const account = await program.account.user.fetch(user[0].publicKey)
        login(new User(user[0].publicKey, account))
    }

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
                              name="bio"
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
                Update
            </button>
        </div>
    </form>
}

export default UserForm