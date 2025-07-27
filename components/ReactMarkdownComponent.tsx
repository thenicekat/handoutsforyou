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
        <li className="text-white" {...props}>
            {children}
        </li>
    ),
}

export default reactMarkdownComponentConfig
