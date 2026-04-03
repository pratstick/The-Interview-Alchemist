import React from 'react'
import { LuCopy, LuCheck, LuCode } from 'react-icons/lu'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import { useTheme } from '../../../context/ThemeContext'

SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('sql', sql)

const AIResponsePreview = ({ content }) => {
    const { theme } = useTheme()
    if (!content) return null
    return (
        <div className="space-y-3 text-[15px] leading-relaxed">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ inline, className, children }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1] : ''

                        // inline is true for backtick spans; block code always has a language class
                        if (inline || !match) {
                            return (
                                <code className="px-1.5 py-0.5 bg-orange-50 dark:bg-gray-700 text-orange-700 dark:text-orange-300 rounded text-[13px] font-mono border border-orange-100 dark:border-gray-600">
                                    {children}
                                </code>
                            )
                        }

                        return (
                            <CodeBlock
                                code={String(children).replace(/\n$/, '')}
                                language={language}
                                isDark={theme === 'dark'}
                            />
                        )
                    },

                    p({ children }) {
                        return (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {children}
                            </p>
                        )
                    },
                    strong({ children }) {
                        return (
                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                {children}
                            </strong>
                        )
                    },
                    em({ children }) {
                        return (
                            <em className="italic text-gray-600 dark:text-gray-400">
                                {children}
                            </em>
                        )
                    },
                    ul({ children }) {
                        return (
                            <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                                {children}
                            </ul>
                        )
                    },
                    ol({ children }) {
                        return (
                            <ol className="list-decimal list-outside pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                                {children}
                            </ol>
                        )
                    },
                    li({ children }) {
                        return (
                            <li className="leading-relaxed">
                                {children}
                            </li>
                        )
                    },
                    blockquote({ children }) {
                        return (
                            <blockquote className="border-l-4 border-orange-400 dark:border-orange-500 pl-4 italic text-gray-600 dark:text-gray-400 bg-orange-50/50 dark:bg-orange-900/10 py-2 rounded-r-lg">
                                {children}
                            </blockquote>
                        )
                    },
                    h1({ children }) {
                        return (
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-1 pb-1 border-b border-gray-200 dark:border-gray-700">
                                {children}
                            </h1>
                        )
                    },
                    h2({ children }) {
                        return (
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-1">
                                {children}
                            </h2>
                        )
                    },
                    h3({ children }) {
                        return (
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-2 mb-1">
                                {children}
                            </h3>
                        )
                    },
                    h4({ children }) {
                        return (
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-2 mb-0.5 uppercase tracking-wide">
                                {children}
                            </h4>
                        )
                    },
                    a({ children, href }) {
                        return (
                            <a
                                href={href}
                                className="text-orange-500 dark:text-orange-400 underline underline-offset-2 hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {children}
                            </a>
                        )
                    },
                    table({ children }) {
                        return (
                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 my-2">
                                <table className="min-w-full text-sm">
                                    {children}
                                </table>
                            </div>
                        )
                    },
                    thead({ children }) {
                        return (
                            <thead className="bg-gray-100 dark:bg-gray-700/80">
                                {children}
                            </thead>
                        )
                    },
                    tbody({ children }) {
                        return (
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {children}
                            </tbody>
                        )
                    },
                    tr({ children }) {
                        return (
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                {children}
                            </tr>
                        )
                    },
                    th({ children }) {
                        return (
                            <th className="text-left px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wide">
                                {children}
                            </th>
                        )
                    },
                    td({ children }) {
                        return (
                            <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">
                                {children}
                            </td>
                        )
                    },
                    hr() {
                        return <hr className="border-gray-200 dark:border-gray-700 my-3" />
                    },
                    img({ src, alt }) {
                        return (
                            <img
                                src={src}
                                alt={alt}
                                className="max-w-full h-auto rounded-lg shadow-sm"
                            />
                        )
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}

function CodeBlock({ code, language, isDark }) {
    const [copied, setCopied] = React.useState(false)
    const copyCode = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 my-2">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <LuCode size={14} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {language || 'code'}
                    </span>
                </div>
                <button
                    onClick={copyCode}
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <>
                            <LuCheck size={13} className="text-green-500" />
                            <span className="text-green-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <LuCopy size={13} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={isDark ? oneDark : oneLight}
                customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    padding: '16px',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    backgroundColor: isDark ? '#1e2433' : '#f8f9fa',
                }}
                showLineNumbers
                lineNumberStyle={{ color: isDark ? '#4a5568' : '#cbd5e0', minWidth: '2.5em' }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    )
}

export default AIResponsePreview