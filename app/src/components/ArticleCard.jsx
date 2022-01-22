import ReactMarkdown from "react-markdown";
import {Link} from "react-router-dom";

function ArticleCard ({post}) {
    return <div>
        <p className="text-sm text-gray-500">
            <time dateTime={post.article.created_at_display}>{post.article.created_at_display}</time>
        </p>
        <a href="#" className="mt-2 block">
            <p className="text-xl font-semibold text-gray-900">{post.user.pseudo}</p>
                <ReactMarkdown className="mt-3 text-base text-gray-500" children={`${post.article.content.slice(0, 200)} ${post.article.content.length > 200 ? "..." : ""}`}/>
        </a>
        <div className="mt-3">
            <Link to={`/article/${post.article.publicKey.toBase58()}`} className="text-base font-semibold text-indigo-600 hover:text-indigo-500">
                Read article
            </Link>
        </div>
    </div>
}

export default ArticleCard