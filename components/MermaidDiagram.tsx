import mermaid from 'mermaid'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

interface MermaidDiagramProps {
    content: string
}

const MermaidDiagramComponent = ({ content }: MermaidDiagramProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                securityLevel: 'strict',
            })

            // Clear previous content
            containerRef.current.innerHTML = ''

            // Render new diagram
            mermaid
                .render(`mermaid-${Date.now()}`, content)
                .then(({ svg }) => {
                    if (containerRef.current) {
                        containerRef.current.innerHTML = svg
                    }
                })
                .catch((error) => {
                    console.error('Mermaid rendering failed:', error)
                    if (containerRef.current) {
                        containerRef.current.innerHTML = `<pre>${content}</pre>`
                    }
                })
        }
    }, [content])

    return <div ref={containerRef} className="mermaid my-4" />
}

// Create a dynamic version of the component that only renders on client-side
const MermaidDiagram = dynamic<MermaidDiagramProps>(
    () => Promise.resolve(MermaidDiagramComponent),
    { ssr: false }
)

export default MermaidDiagram
