'use client'

import { FaLongArrowAltRight } from 'react-icons/fa'

import H1 from '@/components/saber/ui/typography/H1'
import H2 from '@/components/saber/ui/typography/H2'
import { Button } from '@/components/saber/ui/Button'
import { Block } from '@/components/saber/ui/Block'
import { Saber } from '@/components/saber/svg/saber'
import Address from '@/components/saber/shared/Address'
import { Input, InputType } from '@/components/saber/ui/Input'
import Table from '@/components/saber/ui/Table'

interface ShowcaseSectionProps {
    title: string
    children: React.ReactNode
}

function ShowcaseSection({ title, children }: ShowcaseSectionProps) {
    return (
        <div className="mb-8">
            <H2>{title}</H2>
            <div className="mt-4">{children}</div>
        </div>
    )
}

const SAMPLE_TABLE_DATA = [
    { rowLink: '', data: ['Column 1', 'Column 2', 'Column 3', ''] },
    {
        rowLink: '',
        data: [
            'Value 1',
            123.4,
            'Something',
            <Button key="view" size="small">View</Button>,
        ],
    },
    {
        rowLink: '',
        data: [
            'Value 1',
            123.4,
            'Something',
            <Button key="withdraw" type="danger" size="small">Withdraw</Button>,
        ],
    },
]

export default function ComponentsShowcase() {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <H1>Components Documentation</H1>
            <div className="mt-8 flex flex-col gap-8">
                {/* Logo Variants */}
                <ShowcaseSection title="Logo Variants">
                    <div className="flex gap-3">
                        <Saber />
                        <Saber className="text-saber-light" />
                        <Saber className="text-saber-dark" />
                    </div>
                </ShowcaseSection>

                {/* Typography */}
                <ShowcaseSection title="Typography">
                    <div className="flex flex-col gap-4">
                        <H1>This is a H1</H1>
                        <H2>This is a H2</H2>
                        <p>This is normal text</p>
                        <p className="text-secondary text-sm">This is secondary text</p>
                    </div>
                </ShowcaseSection>

                {/* Buttons */}
                <ShowcaseSection title="Buttons">
                    <div className="flex flex-col gap-3">
                        <Button>Primary button</Button>
                        <Button type="secondary">Secondary button</Button>
                        <Button size="small">Small button</Button>
                        <Button size="full">Full sized button</Button>
                    </div>
                </ShowcaseSection>

                {/* Blocks */}
                <ShowcaseSection title="Blocks">
                    <div className="flex flex-col gap-4">
                        <Block className="flex flex-col gap-3">
                            <H2>Standard Block</H2>
                            <p>It can contain any text</p>
                            <p className="text-secondary text-sm">Or secondary text</p>
                            <div className="flex gap-3">
                                <Button>And a button</Button>
                                <Button type="secondary">
                                    And a secondary
                                    <FaLongArrowAltRight />
                                </Button>
                            </div>
                        </Block>

                        <Block active className="flex flex-col gap-3">
                            <p>Blocks can also be in an active state</p>
                        </Block>

                        <Block className="flex flex-col gap-3" hover>
                            <p>Blocks can also have a hover effect</p>
                        </Block>
                    </div>
                </ShowcaseSection>

                {/* Address */}
                <ShowcaseSection title="Address Display">
                    <span>
                        Address (with preferred explorer setting):{' '}
                        <Address address="Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1" />
                    </span>
                </ShowcaseSection>

                {/* Inputs */}
                <ShowcaseSection title="Inputs">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p>Normal input</p>
                            <Input type={InputType.TEXT} placeholder="Enter something here" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p>Number input</p>
                            <Input type={InputType.NUMBER} placeholder="0.00" />
                        </div>
                    </div>
                </ShowcaseSection>

                {/* Table */}
                <ShowcaseSection title="Table">
                    <Block className="flex flex-col gap-5">
                        <p>Table in a block</p>
                        <Table data={SAMPLE_TABLE_DATA} />
                    </Block>
                </ShowcaseSection>
            </div>
        </div>
    )
}
