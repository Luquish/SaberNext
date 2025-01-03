import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useForm } from 'react-hook-form'

import { Button } from '../ui/Button'
import { Input, InputType } from '../ui/Input'

// Constants
const PRIORITY_FEE_OPTIONS = [
    { value: 0, label: 'None' },
    { value: 0.0001, label: '0.0001 SOL' },
    { value: 0.001, label: '0.001 SOL' },
    { value: 0.01, label: '0.01 SOL' },
] as const

interface RPCFormData {
    rpc: string
}

function RPCForm() {
    const [storedRpc, setStoredRpc] = useLocalStorage('rpc', '')
    const { register, watch, setValue } = useForm<RPCFormData>({
        defaultValues: {
            rpc: storedRpc,
        },
    })

    const rpc = watch('rpc')

    useEffect(() => {
        setStoredRpc(rpc?.startsWith('https://') ? rpc : '')
    }, [rpc, setStoredRpc])

    const handleResetRPC = () => setValue('rpc', '')

    return (
        <div className="flex gap-2 mt-4">
            <Button
                type={!rpc ? 'primary' : 'secondary'}
                onClick={handleResetRPC}
            >
                Triton
            </Button>
            <Input 
                type={InputType.TEXT} 
                register={register('rpc')} 
                placeholder="Custom RPC endpoint..."
            />
        </div>
    )
}

interface SettingModalProps {
    className?: string
}

export function SettingModal({ className }: SettingModalProps) {
    const [priorityFee, setPriorityFee] = useLocalStorage('priorityFee', 0.0001)

    return (
        <div className={className}>
            <section className="mt-3">
                <h2 className="font-bold mb-4">Priority fee</h2>
                <div className="flex flex-wrap gap-2">
                    {PRIORITY_FEE_OPTIONS.map(({ value, label }) => (
                        <Button
                            key={value}
                            type={priorityFee === value ? 'primary' : 'secondary'}
                            onClick={() => setPriorityFee(value)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </section>

            <section className="mt-3">
                <h2 className="font-bold mb-4">RPC endpoint</h2>
                <RPCForm />
            </section>
        </div>
    )
}
