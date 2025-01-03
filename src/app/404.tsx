'use client'

import Link from 'next/link'
import { FaHome } from 'react-icons/fa'

import H1 from '@/components/saber/ui/typography/H1'
import { Button } from '@/components/saber/ui/Button'
import { Block } from '@/components/saber/ui/Block'

/**
 * 404 Not Found page component
 */
function NotFound() {
    return (
        <Block className="max-w-2xl mx-auto text-center py-12">
            <div className="flex flex-col items-center gap-6">
                <H1>404: Page Not Found</H1>
                
                <p className="text-gray-400 text-lg">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>

                <Link href="/">
                    <Button 
                        type="secondary"
                        className="flex items-center gap-2"
                    >
                        <FaHome />
                        Return to Home
                    </Button>
                </Link>
            </div>
        </Block>
    )
}

export default NotFound