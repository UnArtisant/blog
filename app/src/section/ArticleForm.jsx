import {Tab} from '@headlessui/react'
import {classNames} from "../utils/tailwind-ui";
import {useForm} from "react-hook-form";
import ReactMarkdown from 'react-markdown'
import {yupResolver} from "@hookform/resolvers/yup";
import {articleSchema} from "../utils/schema/article";
import {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "../context/workspace-context";
import {Program, Provider, web3} from "@project-serum/anchor";
import idl from "../../../target/idl/blog.json"
import {toast} from "react-hot-toast";

function ArticleForm() {

    const [loading, setLoading] = useState(false)
    const {wallet, connection, programID, state} = useContext(WorkspaceContext)

    const provider = new Provider(connection, wallet, {
        preflightCommitment: state.preflightCommitment,
        commitment: state.commitment
    })
    const program = new Program(idl, programID, provider)

    const {handleSubmit, watch, register, formState: {errors}} = useForm({
        mode: "onBlur",
        resolver: yupResolver(articleSchema)
    })

    const onSubmit = async (data, e) => {
        setLoading(true)
        const post = web3.Keypair.generate();
        try {
            await program.rpc.publishPost(data.article, {
                accounts: {
                    post: post.publicKey,
                    author: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId
                },
                signers: [post],
            });
        } catch (error) {
            console.log(error)
        }
        //reset form
        e.target.reset();
        toast.success('Article succesfully posted')
        setLoading(false)
    }


    return <form onSubmit={handleSubmit(onSubmit)} className="mx-6 md:mx-0 max-w-3xl w-full">
        <Tab.Group>
            {({selectedIndex}) => (
                <>
                    <Tab.List className="flex items-center">
                        <Tab
                            className={({selected}) =>
                                classNames(
                                    selected
                                        ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                                        : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                                    'px-3 py-1.5 border border-transparent text-sm font-medium rounded-md'
                                )
                            }
                        >
                            Write
                        </Tab>
                        <Tab
                            className={({selected}) =>
                                classNames(
                                    selected
                                        ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                                        : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                                    'ml-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md'
                                )
                            }
                        >
                            Preview
                        </Tab>

                    </Tab.List>
                    <Tab.Panels className="mt-2">
                        <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                            <label htmlFor="article" className="sr-only">
                                Comment
                            </label>
                            <div>
                  <textarea
                      {...register("article")}
                      rows={15}
                      name="article"
                      id="comment"
                      className={`${!!errors?.article ? "border border-red-500" : ""} shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md`}
                      placeholder="Add your comment..."
                      defaultValue={''}
                  />
                                {!!errors?.article && <p className="text-red-500">{errors?.article.message}</p>}
                            </div>
                        </Tab.Panel>
                        <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                            <div className="border-b">
                                {!watch("article")?.length &&
                                    <div className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 text-gray-800">
                                        Preview content will render here.
                                    </div>}
                                <div className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 text-gray-800">
                                    <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
                                        <ReactMarkdown children={watch("article")}/>
                                    </div>
                                </div>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </>
            )}
        </Tab.Group>
        <div className="flex justify-end">
            <p className="text-gray-400 text-sm mr-1 py-1">{!watch("article") ? 930 : 930 - watch("article").length} words
                left</p>
        </div>
        <div className="mt-1 flex justify-end">
            <button
                disabled={loading}
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Post
            </button>
        </div>
    </form>
}

export default ArticleForm