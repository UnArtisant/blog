import ReactMarkdown from "react-markdown";
import ArticleLayout from "../section/ArticleLayout";
import {useHistory, useParams} from "react-router-dom"
import {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "../context/workspace-context";
import {Program, Provider} from "@project-serum/anchor";
import idl from "../../../target/idl/blog.json";
import {PublicKey} from "@solana/web3.js";

function Article() {
    const {publicKey} = useParams()
    const history = useHistory()
    const [article, setArticle] = useState(null)
    const [loading,setLoading] = useState(false)

    const {wallet, connection, programID, state} = useContext(WorkspaceContext)

    const provider = new Provider(connection, wallet, {
        preflightCommitment: state.preflightCommitment,
        commitment: state.commitment
    })
    const program = new Program(idl, programID, provider)

    const fetchArticle = async () => {
      setLoading(true)
      try {
          setArticle(await program.account.post.fetch(new PublicKey(publicKey)))
      } catch (e) {
          history.push("/error")
      }
      setLoading(false)
    }

    useEffect(() => {
      fetchArticle()
    }, [publicKey])

    return <ArticleLayout>
        {loading && "loading..." }
        {!loading && article ? <ReactMarkdown children={article.content} /> : "Aucun article"}
    </ArticleLayout>
}

export default Article