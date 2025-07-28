import { Components } from 'react-markdown'

const reactMarkdownComponentConfig: Components = {
    h1: ({ children, ...props }) => (
        <h1 className="text-2xl font-bold mb-4 mt-6 text-white" {...props}>
            {children}
        </h1>
    ),
    h2: ({ children, ...props }) => (
        <h2 className="text-xl font-bold mb-3 mt-5 text-white" {...props}>
            {children}
        </h2>
    ),
    h3: ({ children, ...props }) => (
        <h3 className="text-lg font-bold mb-3 mt-4 text-white" {...props}>
            {children}
        </h3>
    ),
    ol: ({ children, ...props }) => (
        <ol className="list-decimal list-inside ml-6 text-white" {...props}>
            {children}
        </ol>
    ),
    ul: ({ children, ...props }) => (
        <ul className="list-disc list-inside ml-6 text-white" {...props}>
            {children}
        </ul>
    ),
    li: ({ children, ...props }) => (
        <li
            className="text-white leading-relaxed list-item list-outside"
            {...props}
        >
            <div className="inline">{children}</div>
        </li>
    ),
    p: ({ children, ...props }) => (
        <p
            className="text-white mb-4 whitespace-pre-wrap leading-relaxed"
            {...props}
        >
            {children}
        </p>
    ),
    // Mermaid
    code: ({ children, className, ...props }) => (
        <code className={`mermaid ${className}`} {...props}>
            {children}
        </code>
    ),

    table: ({ children, ...props }) => (
        <div className="overflow-x-auto w-full px-3 border-2 border-gray-500 rounded-lg">
            <table
                className="table-auto w-full border-collapse border border-gray-500 my-4"
                {...props}
            >
                {children}
            </table>
        </div>
    ),
    thead: ({ children, ...props }) => (
        <thead className="bg-gray-700 text-white" {...props}>
            {children}
        </thead>
    ),
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => (
        <tr className="border-b border-gray-500" {...props}>
            {children}
        </tr>
    ),
    th: ({ children, ...props }) => (
        <th className="px-4 py-2 font-bold border border-gray-500" {...props}>
            {children}
        </th>
    ),
    td: ({ children, ...props }) => (
        <td className="px-4 py-2 border border-gray-500" {...props}>
            {children}
        </td>
    ),
}

export default reactMarkdownComponentConfig
