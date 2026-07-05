import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

interface MermaidDiagramProps {
    content: string
}

let mermaidInitialized = false

const MermaidDiagramComponent = ({ content }: MermaidDiagramProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        let cancelled = false

        import('mermaid').then(({ default: mermaid }) => {
            if (cancelled || !containerRef.current) return

            if (!mermaidInitialized) {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    securityLevel: 'strict',
                })
                mermaidInitialized = true
            }

            containerRef.current.innerHTML = ''

            mermaid
                .render(`mermaid-${Date.now()}`, content)
                .then(({ svg }) => {
                    if (containerRef.current) {
                        containerRef.current.innerHTML = svg
                    }
                })
                .catch(error => {
                    console.error('Mermaid rendering failed:', error)
                    if (containerRef.current) {
                        containerRef.current.innerHTML = `<pre>${content}</pre>`
                    }
                })
        })

        return () => {
            cancelled = true
        }
    }, [content])

    return <div ref={containerRef} className="mermaid my-4" />
}

const MermaidDiagram = dynamic<MermaidDiagramProps>(
    () => Promise.resolve(MermaidDiagramComponent),
    { ssr: false }
)

export default MermaidDiagram
