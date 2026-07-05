import classNames from 'classnames'
import { memo, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
    items: string[]
    value: string
    onChange(val: string): void
    name: string
}

const MAX_RESULTS = 50

const Autocomplete = (props: Props) => {
    const { items, value, onChange, name } = props

    const ref = useRef<HTMLDivElement>(null)

    const [open, setOpen] = useState(false)
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), 150)
        return () => clearTimeout(timer)
    }, [value])

    const filteredItems = useMemo(() => {
        const query = debouncedValue.toLowerCase()
        if (!query) return items.slice(0, MAX_RESULTS)
        return items
            .filter(item => item.toLowerCase().includes(query))
            .slice(0, MAX_RESULTS)
    }, [items, debouncedValue])

    return (
        <div
            className={classNames({
                'dropdown w-full': true,
                'dropdown-open w-full': open,
            })}
            ref={ref}
        >
            <input
                type="text"
                className="input input-secondary w-full"
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder={`Search by ${name}...`}
                tabIndex={0}
            />

            <div className="dropdown-content bg-base-200 z-50 top-14 max-h-96 overflow-auto flex-col rounded-md">
                <ul
                    className="menu menu-compact w-full"
                    style={{ width: ref.current?.clientWidth }}
                >
                    {filteredItems.map(item => {
                        return (
                            <li
                                key={item}
                                onClick={() => {
                                    onChange(item)
                                    setOpen(false)
                                }}
                                className="border-b border-b-base-content/10 w-full"
                            >
                                <button type="button" className="uppercase">
                                    {item}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default memo(Autocomplete)
