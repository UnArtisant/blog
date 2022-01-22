import {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "../context/workspace-context";
import {Program, Provider} from "@project-serum/anchor";
import idl from "../../../target/idl/blog.json"
import {Article} from "../utils/struct/Article";
import {authorFilter} from "../utils/filter/user";
import {User} from "../utils/struct/User";
import ReactMarkdown from "react-markdown";
import ArticleCard from "../components/ArticleCard";

function Home () {

    const [posts, setPosts] = useState([])
    const [loading,setLoading] = useState(false)
    const {wallet, connection, programID, state} = useContext(WorkspaceContext)

    const provider = new Provider(connection, wallet, {
        preflightCommitment: state.preflightCommitment,
        commitment: state.commitment
    })
    const program = new Program(idl, programID, provider)

    const handlePost = async () => {
        setLoading(true)
        const fetchPosts = await program.account.post.all()
        setPosts(await Promise.all(fetchPosts.map(async item => {
            const article = new Article(item.publicKey, item.account)
            const user = await program.account.user.all([authorFilter(article.author.toBase58())])
            return {article, user : new User(user[0].publicKey, user[0].account)}
        })))
        setLoading(false)
    }

    useEffect(() => {
        handlePost()
    },[])

    return <div className="h-screen ">
        {loading && "loading..."}
        <div className="max-w-3xl mx-auto mt-6 pt-10 grid gap-16 py-12">
        {!loading && posts.length ? posts.map((post,k) => (
                <ArticleCard post={post} key={k} />
            )) : "aucun post"
        }
        </div>
    </div>
}

export default Home