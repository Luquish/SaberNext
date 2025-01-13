'use client'

import React from 'react';

import { ContentLoader } from '@/components/tribeca/ContentLoader';

export function ProgramPlaceholder() {
    return (
        <div className="flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800 cursor-pointer hover:border-l-primary">
            <div>
                <div className="h-5 flex items-center">
                    <ContentLoader className="h-3 rounded" />
                </div>
                <PlaceholderSubtitle />
            </div>
        </div>
    );
}

function PlaceholderSubtitle() {
    return (
        <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
                <ContentLoader className="h-2 w-4" />
                <span>&middot;</span>
                <ContentLoader className="h-2 w-20" />
            </div>
        </div>
    );
}
