'use client'

import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { ContentLoader } from '../ContentLoader'
import { EmptyState } from '../EmptyState'
import type { Props as TableCardBodyProps } from './TableCardBody'
import { TableCardBody } from './TableCardBody'

export interface RowProps<T> {
    item: T
    index: number
    isLast: boolean
}

export interface TableCardProps<T> extends Omit<TableCardBodyProps, 'children'> {
    rowLoader?: ReactNode
    items?: readonly T[]
    generateKey: (item: T) => string
    emptyStateMessage?: string
    Row?: (props: RowProps<T>) => ReactNode
    children?: ReactNode
}

const defaultRowLoader = (
    <tr>
        <td>
            <ContentLoader />
        </td>
    </tr>
)

/**
 * A table component that handles loading states, empty states, and row rendering
 * @template T - The type of items to be rendered in the table
 */
function TableCard<T>({
    items,
    rowLoader = defaultRowLoader,
    generateKey,
    emptyStateMessage = 'There are no rows in this list.',
    children,
    Row,
    ...props
}: TableCardProps<T>) {
    return (
        <TableCardBody {...props}>
            {items === undefined ? (
                // Loading state
                Array(3)
                    .fill(null)
                    .map((_, i) => (
                        <Fragment key={i}>{rowLoader}</Fragment>
                    ))
            ) : items.length === 0 ? (
                // Empty state
                <tr>
                    <td colSpan={100}>
                        <EmptyState 
                            className="w-full" 
                            title={emptyStateMessage} 
                        />
                    </td>
                </tr>
            ) : Row ? (
                // Row renderer
                items.map((item, i) => (
                    <Row
                        key={generateKey(item)}
                        item={item}
                        index={i}
                        isLast={i === items.length - 1}
                    />
                ))
            ) : (
                // Custom children
                children
            )}
        </TableCardBody>
    )
}

export { TableCard }