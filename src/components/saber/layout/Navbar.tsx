'use client'

import { useCallback, useRef } from 'react'
import { BaseWalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import Link from 'next/link'
import { ImCross } from 'react-icons/im'
import { SiGitbook } from 'react-icons/si'
import { FaCog, FaDiscord, FaExternalLinkAlt } from 'react-icons/fa'
import { FaMedium, FaXTwitter } from 'react-icons/fa6'
import { useMutation } from '@tanstack/react-query'
import { Token, WRAPPED_SOL } from '@saberhq/token-utils'
import clsx from 'clsx'
import { SABER_IOU_MINT } from '@saberhq/saber-periphery'

import I18n from '@/i18n'
import { Saber } from '@/components/saber/svg/saber'
import { Button } from '@/components/saber/ui/Button'
import { Block } from '@/components/saber/ui/Block'
import { UniversalPopover, type PopoverRef } from '@/components/saber/modals/UniversalPopover'
import { ModalHeader } from '@/components/saber/modals/ModalHeader'
import { SettingModal } from '@/components/saber/modals/SettingModal'
import { useUserATA } from '@/hooks/saber/user/useUserATA'
import useNetwork from '@/hooks/saber/useNetwork'
import { useUnwrap } from '@/hooks/saber/user/useUnwrap'
import { useRedeemSbr } from '@/hooks/saber/user/useRedeemSbr'

interface NavLinkProps {
    href: string
    external?: boolean
    children: React.ReactNode
}

function NavLink({ href, external, children }: NavLinkProps) {
    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                <Button type="secondary" className="flex items-center gap-2 h-10">
                    {children}
                </Button>
            </a>
        )
    }
    return (
        <Link href={href}>
            <Button type="secondary" className="flex items-center gap-2 h-10">
                {children}
            </Button>
        </Link>
    )
}

function WrappedSolBlock() {
    const { network } = useNetwork()
    const { data: ata, refetch } = useUserATA(WRAPPED_SOL[network], true)
    const { unwrap } = useUnwrap()
    
    const { mutate: execUnwrap, isPending } = useMutation({
        mutationKey: ['unwrap'],
        mutationFn: async () => {
            await unwrap()
            refetch()
        },
    })

    if ((ata?.balance.asNumber ?? 0) <= 0) return null

    return (
        <Block active className="flex gap-1 items-center">
            You have {ata!.balance.asNumber} wrapped SOL in your wallet.
            <Button 
                size="small" 
                disabled={isPending}
                onClick={() => execUnwrap()}
            >
                {isPending ? 'Unwrapping...' : 'Unwrap'}
            </Button>
        </Block>
    )
}

function IOUSBRBlock() {
    const { redeem } = useRedeemSbr()
    const { data: iou, refetch } = useUserATA(
        new Token({
            address: SABER_IOU_MINT.toString(),
            decimals: 6,
            symbol: 'IOU',
            name: 'IOU',
            chainId: 101,
        })
    )

    const { mutate: execRedeem, isPending } = useMutation({
        mutationKey: ['redeem'],
        mutationFn: async () => {
            await redeem()
            refetch()
        },
    })

    if ((iou?.balance.asNumber ?? 0) <= 0) return null

    return (
        <Block active className="flex gap-1 items-center">
            You have {iou!.balance.asNumber} IOU SBR in your wallet. You can redeem it here.
            <Button 
                size="small" 
                disabled={isPending}
                onClick={() => execRedeem()}
            >
                {isPending ? 'Redeeming...' : 'Redeem'}
            </Button>
        </Block>
    )
}

function DisconnectButton() {
    const { publicKey } = useWallet()
    
    const formatAddress = (address: string) => 
        `${address.substring(0, 3)}...${address.substring(address.length - 3)}`
    
    return (
        <div className="flex items-center gap-2">
            <ImCross className="w-3 h-3" />
            <BaseWalletDisconnectButton 
                labels={{
                    disconnecting: 'Disconnecting ...',
                    'has-wallet': publicKey ? formatAddress(publicKey.toString()) : '',
                    'no-wallet': 'Disconnect Wallet',
                }} 
            />
        </div>
    )
}

function Navbar() {
    const { publicKey } = useWallet()
    const settingRef = useRef<PopoverRef>(null)

    const handleModelClose = useCallback(() => {
        settingRef.current?.close()
    }, [])

    const handleOpenModel = useCallback(() => {
        settingRef.current?.open()
    }, [])

    return (
        <>
            <UniversalPopover ref={settingRef} onClose={handleModelClose}>
                <div
                    className={clsx(
                        'bg-saber-modelBg max-w-2xl w-full m-2 sm:m-2 md:m-2',
                        'bg-darkblue border border-gray-600 p-5 shadow-3xl rounded-xl',
                        'z-[1000] transition-opacity'
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ModalHeader handleClose={handleModelClose} title={I18n.SettingPopupTitle} />
                    <SettingModal />
                </div>
            </UniversalPopover>

            <nav className="w-full flex flex-col lg:flex-row gap-1">
                {/* Logo Section */}
                <div className="flex items-center gap-3 font-bold mb-3 lg:mb-0">
                    <Link href="/" className="flex-grow">
                        <div className="flex items-center gap-3">
                            <Saber className="text-saber-light" />
                            Saber
                        </div>
                    </Link>

                    {/* Mobile Wallet & Settings */}
                    <div className="flex items-center gap-2 lg:hidden">
                        {publicKey ? <DisconnectButton /> : <WalletMultiButton />}
                        <Button
                            type="secondary"
                            className="flex items-center gap-2 h-10 text-xl"
                            onClick={handleOpenModel}
                        >
                            <FaCog />
                        </Button>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-grow flex-wrap flex justify-center gap-3">
                    <NavLink href="/">Pools</NavLink>
                    <NavLink href="https://tribeca.so/gov/sbr/" external>
                        Vote <FaExternalLinkAlt />
                    </NavLink>
                    <NavLink href="https://vota.fi/" external>
                        Bribes <FaExternalLinkAlt />
                    </NavLink>
                    <NavLink href="https://doc.saberdao.io/" external>
                        <SiGitbook />
                    </NavLink>
                    <NavLink href="https://blog.saberdao.io/" external>
                        <FaMedium />
                    </NavLink>
                    <NavLink href="https://twitter.com/thesaberdao" external>
                        <FaXTwitter />
                    </NavLink>
                    <NavLink href="https://discord.com/invite/cmVUgRXS53" external>
                        <FaDiscord />
                    </NavLink>
                </div>

                {/* Desktop Wallet & Settings */}
                <div className="hidden lg:flex items-center gap-2">
                    {publicKey ? <DisconnectButton /> : <WalletMultiButton />}
                    <Button
                        type="secondary"
                        className="flex items-center gap-2 h-10 text-xl"
                        onClick={handleOpenModel}
                    >
                        <FaCog />
                    </Button>
                </div>
            </nav>

            <WrappedSolBlock />
            <IOUSBRBlock />
        </>
    )
}

export default Navbar
