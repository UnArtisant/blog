import {lazy, Suspense, useMemo} from "react";
import {WalletProvider, ConnectionProvider} from '@solana/wallet-adapter-react';
import {PhantomWalletAdapter, SolflareWalletAdapter} from "@solana/wallet-adapter-wallets";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {clusterApiUrl} from "@solana/web3.js";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {WorkspaceProvider} from "./context/workspace-context";
import Layout from "./section/Layout";

const Home = lazy(() => import("./pages/Home"));
const NewArticle = lazy(() => import("./pages/NewArticle"));
const Articles = lazy(() => import("./pages/Article"));
const Profile = lazy(() => import("./pages/Profile"));
const Register = lazy(() => import("./pages/Register"));
const Error404 = lazy(() => import("./pages/error/404error"));

function App() {

    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        [network]
    );

    return (
        <Router>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WorkspaceProvider>
                        <Layout>
                            <Suspense fallback={"loading..."}>
                                <Switch>
                                    <Route exact path={"/article/new"} component={NewArticle}/>
                                    <Route exact path={"/profile"} component={Profile}/>
                                    <Route exact path={"/article/:publicKey"} component={Articles}/>
                                    <Route exact path={"/register"} component={Register}/>
                                    <Route exact path={"/"} component={Home}/>
                                    <Route exact path={"*"} component={Error404}/>
                                </Switch>
                            </Suspense>
                        </Layout>
                    </WorkspaceProvider>
                </WalletProvider>
            </ConnectionProvider>
        </Router>
    )
}

export default App
