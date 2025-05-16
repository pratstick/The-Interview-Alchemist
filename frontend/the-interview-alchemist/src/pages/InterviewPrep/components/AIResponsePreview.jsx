import React from 'react'
import { LuCopy, LuCheck, LuCode } from 'react-icons/lu'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const AIResponsePreview = ({ content }) => {
    if (!content) return null
    return (
        <div className="rounded-lg bg-white/80 shadow-sm p-4">
            <div className="space-y-3">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ inline, className, children }) {
                            const match = /language-(\w+)/.exec(className || '')
                            const language = match ? match[1] : ''
                            const isInline = !className && !inline

                            return isInline ? (
                                <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">
                                    {children}
                                </code>
                            ) : (
                                <CodeBlock
                                    code={String(children).replace(/\n$/, '')}
                                    language={language}
                                />
                            )
                        },

                        p({ children }) {
                            return (
                                <p className="text-base text-neutral-800 leading-relaxed">
                                    {children}
                                </p>
                            )
                        },
                        strong({ children }) {
                            return (
                                <strong className="font-semibold text-neutral-900">
                                    {children}
                                </strong>
                            )
                        },
                        em({ children }) {
                            return (
                                <em className="italic text-neutral-700">
                                    {children}
                                </em>
                            )
                        },
                        ul({ children }) {
                            return (
                                <ul className="list-disc pl-6 text-base text-neutral-800 space-y-1">
                                    {children}
                                </ul>
                            )
                        },
                        ol({ children }) {
                            return (
                                <ol className="list-decimal pl-6 text-base text-neutral-800 space-y-1">
                                    {children}
                                </ol>
                            )
                        },
                        li({ children }) {
                            return (
                                <li className="text-base text-neutral-800">
                                    {children}
                                </li>
                            )
                        },
                        blockquote({ children }) {
                            return (
                                <blockquote className="border-l-4 border-primary-300 pl-4 italic text-neutral-700 bg-primary-50/40 py-1">
                                    {children}
                                </blockquote>
                            )
                        },
                        h1({ children }) {
                            return (
                                <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                                    {children}
                                </h1>
                            )
                        },
                        h2({ children }) {
                            return (
                                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                                    {children}
                                </h2>
                            )
                        },
                        h3({ children }) {
                            return (
                                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                                    {children}
                                </h3>
                            )
                        },
                        h4({ children }) {
                            return (
                                <h4 className="text-base font-semibold text-neutral-900 mb-1">
                                    {children}
                                </h4>
                            )
                        },
                        a({ children, href }) {
                            return (
                                <a
                                    href={href}
                                    className="text-primary-600 underline hover:text-primary-700 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {children}
                                </a>
                            )
                        },
                        table({ children }) {
                            return (
                                <div className="overflow-x-auto rounded border border-neutral-200 my-2">
                                    <table className="min-w-full bg-white">
                                        {children}
                                    </table>
                                </div>
                            )
                        },
                        thead({ children }) {
                            return (
                                <thead className="bg-neutral-100">
                                    {children}
                                </thead>
                            )
                        },
                        tbody({ children }) {
                            return (
                                <tbody className="bg-white">
                                    {children}
                                </tbody>
                            )
                        },
                        tr({ children }) {
                            return (
                                <tr className="border-b border-neutral-200">
                                    {children}
                                </tr>
                            )
                        },
                        th({ children }) {
                            return (
                                <th className="text-left px-4 py-2 font-semibold text-neutral-900 bg-neutral-50">
                                    {children}
                                </th>
                            )
                        },
                        td({ children }) {
                            return (
                                <td className="px-4 py-2 text-base text-neutral-800">
                                    {children}
                                </td>
                            )
                        },
                        hr() {
                            return <hr className="border-neutral-200 my-4" />
                        },
                        img({ src, alt }) {
                            return (
                                <img
                                    src={src}
                                    alt={alt}
                                    className="max-w-full h-auto rounded shadow"
                                />
                            )
                        },
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    )
}

function CodeBlock({ code, language }) {
    const [copied, setCopied] = React.useState(false)
    const copyCode = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    };

    return (
        <div className="relative">
            <div className="flex items-center mb-2">
                <LuCode size={16} className="" />
                <span className="text-sm text-gray-500 ml-1">{language || 'Code'}</span>
                <button onClick={copyCode} className="ml-auto flex items-center" aria-label='Copy code'>
                    {copied ? (
                        <LuCheck size={16} className="text-green-500" />
                    ) : (
                        <LuCopy size={16} className="text-gray-500" />
                    )}
                    {copied && (
                        <span className="text-xs text-gray-500 ml-1">Copied!</span>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={oneLight}
                customStyle={{
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '8px',
                    backgroundColor: '#f9f9f9',
                }}
                showLineNumbers
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
 
export default AIResponsePreview