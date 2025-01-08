'use client'

import { useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { useLocalStorage } from 'usehooks-ts'

import { Button } from '@/components/tribeca/Button'
import { Modal } from '@/components/tribeca/Modal'

interface Props {
    className?: string
}

export function SettingsModal({ className }: Props) {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [priorityFee, setPriorityFee] = useLocalStorage('priorityFee', 0)

    return (
        <>
            <Modal
                className='p-0'
                isOpen={showModal}
                onDismiss={() => {
                    setShowModal(false)
                }}
            >
                <div className='border-b border-b-warmGray-800 text-white font-bold text-base text-center py-4'>
                    Priority fee
                </div>
                <div className='p-8 flex items-center justify-center gap-5'>
                    <Button
                        variant={priorityFee === 0 ? 'primary' : 'outline'}
                        onClick={() => setPriorityFee(0)}
                    >
                        None
                    </Button>
                    <Button
                        variant={priorityFee === 0.0001 ? 'primary' : 'outline'}
                        onClick={() => setPriorityFee(0.0001)}
                    >
                        0.0001 SOL
                    </Button>
                    <Button
                        variant={priorityFee === 0.001 ? 'primary' : 'outline'}
                        onClick={() => setPriorityFee(0.001)}
                    >
                        0.001 SOL
                    </Button>
                    <Button
                        variant={priorityFee === 0.01 ? 'primary' : 'outline'}
                        onClick={() => setPriorityFee(0.01)}
                    >
                        0.01 SOL
                    </Button>
                </div>
            </Modal>
            <div className={className}>
                <button
                    className='relative z-20 md:z-auto flex items-center hover:text-white transition-colors'
                    onClick={() => {
                        setShowModal(true)
                    }}
                >
                    <FaGear />
                </button>
            </div>
        </>
    )
}