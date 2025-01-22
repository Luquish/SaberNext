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
            disabled={isActive}
            className={clsx(
                'relative z-10 text-slate-200 rounded-lg py-2 px-3 transition-all duration-200',
                isActive 
                    ? 'bg-saber cursor-default' // Color saber cuando está activo y cursor default
                    : 'bg-[#0B1221] hover:bg-slate-700 cursor-pointer', // Cursor pointer solo cuando no está activo
                'border border-[#1F2937]',
                'shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
                !isActive && 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)]' // Efecto hover solo cuando no está activo
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

    return (
        <div 
            className={clsx(
                'flex items-center text-lg gap-1 rounded-lg overflow-hidden', // Agregado gap entre botones
                'text-slate-200',
                className
            )}
            role="group"
            aria-label="View switching controls"
        >
            <ViewButton
                isActive={poolsView === PoolsView.LIST}
                onClick={() => setPoolsView(PoolsView.LIST)}
                icon={<FaList />}
                label="List view"
            />
            <ViewButton
                isActive={poolsView === PoolsView.GRID}
                onClick={() => setPoolsView(PoolsView.GRID)}
                icon={<BsGridFill />}
                label="Grid view"
            />
        </div>
    )
}

export default PoolSwitch
