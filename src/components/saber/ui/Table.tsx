'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { Block } from './Block'
import { ConditionalWrapper } from './ConditionalWrapper'

interface TableRow {
    data: ReactNode[]
    rowLink?: string
}

interface TableProps {
    data: TableRow[]
    blockView?: boolean
    className?: string
}

export function Table({ 
    data,
    blockView = false,
    className = '',
}: TableProps) {
    const header = data[0]?.data

    if (!header) return null

    const rows = data.slice(1)

    const TableRow = ({ row, index }: { row: TableRow, index: number }) => (
        <ConditionalWrapper
            condition={!!row.rowLink}
            wrapper={(children) => (
                <Link href={row.rowLink || ''}>
                    {children}
                </Link>
            )}
        >
            {blockView ? (
                <Block 
                    className="grid grid-cols-2 gap-1 text-sm mb-5 lg:mb-0 h-full" 
                    hover
                >
                    {row.data.map((item, j) =>
                        header[j] ? (
                            <div key={`${index}-${j}`} className="contents">
                                <div className="font-bold">{header[j]}</div>
                                <div className="flex justify-end text-gray-300">
                                    {item}
                                </div>
                            </div>
                        ) : (
                            <div key={`${index}-${j}`} className="col-span-2">
                                {item}
                            </div>
                        )
                    )}
                </Block>
            ) : (
                <div className="flex hover:bg-saber-dark/20 transition-colors py-3 items-center rounded-lg px-3">
                    {row.data.map((item, j) => (
                        <div className="flex-1" key={`${index}-${j}`}>
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </ConditionalWrapper>
    )

    return (
        <div className={className}>
            {/* Vista móvil */}
            <div
                className={clsx(
                    !blockView && 'lg:hidden',
                    blockView && 'md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5'
                )}
            >
                {rows.map((row, i) => (
                    <TableRow 
                        key={`mobile-row-${i}`}
                        row={row} 
                        index={i} 
                    />
                ))}
            </div>

            {/* Vista desktop */}
            {!blockView && (
                <div className="hidden lg:block rounded-lg overflow-hidden">
                    <div className="grid gap-3 w-full">
                        <div className="flex bg-black py-3 px-5 rounded-lg">
                            {header.map((headerItem, i) => (
                                <div 
                                    className="font-bold pr-5 flex-1" 
                                    key={`header-${i}`}
                                >
                                    {headerItem}
                                </div>
                            ))}
                        </div>

                        {rows.map((row, i) => (
                            <TableRow 
                                key={`desktop-row-${i}`}
                                row={row} 
                                index={i} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Table
