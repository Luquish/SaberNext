'use client'

import { Helmet } from 'react-helmet'

import { APP_CONFIG } from '@/config/tribeca'

interface Props {
    title: string
    description?: string
    pageTitle?: string
}

/**
 * Common helmet component for consistent meta tags across pages
 */
function CommonHelmet({
    title,
    pageTitle = `${title} | ${APP_CONFIG.name}`,
    description,
}: Props) {
    return (
        <Helmet>
            <title>{pageTitle}</title>

            {description && (
                <>
                    <meta name="description" content={description} />
                    <meta name="og:description" content={description} />
                    <meta name="twitter:description" content={description} />
                </>
            )}

            <meta name="og:title" content={title} />
            <meta name="twitter:title" content={title} />
        </Helmet>
    )
}

export { CommonHelmet }