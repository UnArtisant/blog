import {createContext, useCallback, useEffect, useReducer, useState} from "react";

import {useAnchorWallet, useWallet} from "@solana/wallet-adapter-react";
import {Connection, PublicKey} from "@solana/web3.js";
import {Provider, Program} from '@project-serum/anchor'
import idl from '../../../target/idl/blog.json'
import {authorFilter} from "../utils/filter/user";
import {User} from "../utils/struct/User";

const initialState = {
    user: null,
    preflightCommitment : 'processed',
    commitment : 'processed',
    connection : null
};

export const WorkspaceContext = createContext({})

function WorkspaceReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}

export function WorkspaceProvider({children}) {

    const [state, dispatch] = useReducer(WorkspaceReducer, initialState);

    const wallet = useAnchorWallet()
    const {publicKey, connected} = useWallet()

    const [connection] = useState(new Connection('http://127.0.0.1:8899', state.commitment))
    const [programID] = useState(new PublicKey(idl.metadata.address))


    function login(userData) {
        dispatch({
            type: 'LOGIN',
            payload: userData
        });
        localStorage.setItem('user', JSON.stringify(userData));
    }

    function logout() {
        localStorage.removeItem('user');
        dispatch({type: 'LOGOUT'});
    }

    async function handleUser() {
        const provider = new Provider(connection, wallet)
        const program = new Program(idl, programID, provider)
        if (connected) {
            const user = await program.account.user.all([authorFilter(publicKey.toBase58())])
            if (user[0]) {
                login(new User(user[0].publicKey, user[0].account))
            }
        } else {
            logout()
        }
    }


    useEffect(() => {
        handleUser()
    }, [connected])


    const value = {
        wallet,
        connection,
        programID,
        state,
        logout,
        login
    }

    return <WorkspaceContext.Provider value={value}>
        {children}
    </WorkspaceContext.Provider>
}