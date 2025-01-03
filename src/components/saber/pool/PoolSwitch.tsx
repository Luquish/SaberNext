'use client'

import clsx from 'clsx'
import { BsGridFill } from 'react-icons/bs'
import { FaList } from 'react-icons/fa'
import { useLocalStorage } from 'usehooks-ts'

export enum PoolsView {
    GRID = 'GRID',
    LIST = 'LIST'
}

interface ViewButtonProps {
    isActive: boolean
    onClick: () => void
    icon: JSX.Element
    label: string
}

function ViewButton({ isActive, onClick, icon, label }: ViewButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={clsx(
                'py-2 px-2 transition-colors',
                isActive 
                    ? 'bg-gradient-to-r from-saber-dark to-saber-light' 
                    : 'bg-slate-800 hover:bg-slate-700'
            )}
            aria-label={label}
            aria-pressed={isActive}
        >
            {icon}
        </button>
    )
}

interface PoolSwitchProps {
    className?: string
}

export function PoolSwitch({ className }: PoolSwitchProps) {
    const [poolsView, setPoolsView] = useLocalStorage<PoolsView>(
        'poolsView',
        PoolsView.LIST
    )

    const toggle = () => {
        setPoolsView(
            poolsView === PoolsView.LIST ? PoolsView.GRID : PoolsView.LIST
        )
    }

    return (
        <div 
            className={clsx(
                'flex items-center text-lg rounded-lg overflow-hidden',
                'text-slate-200',
                className
            )}
            role="group"
            aria-label="View switching controls"
        >
            <ViewButton
                isActive={poolsView === PoolsView.LIST}
                onClick={toggle}
                icon={<FaList />}
                label="List view"
            />
            <ViewButton
                isActive={poolsView === PoolsView.GRID}
                onClick={toggle}
                icon={<BsGridFill />}
                label="Grid view"
            />
        </div>
    )
}

export default PoolSwitch
