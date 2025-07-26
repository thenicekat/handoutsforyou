import { Components } from 'react-markdown'

const reactMarkdownComponentConfig: Components = {
    h1: ({ children }) => (
        <h1 className="text-2xl font-bold mb-4 mt-6 text-white">{children}</h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-xl font-bold mb-3 mt-5 text-white">{children}</h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-lg font-bold mb-3 mt-4 text-white">{children}</h3>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal list-inside text-white">{children}</ol>
    ),
    ul: ({ children }) => (
        <ul className="list-disc list-inside text-white">{children}</ul>
    ),
}

export default reactMarkdownComponentConfig
