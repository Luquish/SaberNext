'use client';

import { NotifiLogo } from './NotifiLogo';

interface Props {
  body: React.ReactNode;
  switchGroup?: React.ReactNode;
}

export function SubscriptionCard({ body, switchGroup }: Props) {
    return (
        <div className="w-screen max-w-[312px]">
            <div className="w-full bg-white rounded-lg border dark:(bg-warmGray-850 border-warmGray-800)">
                <div className="flex flex-col items-stretch gap-2 py-2 px-4 border-b dark:border-warmGray-800">
                    <h2 className="text-white font-bold mb-2">Get Notifications</h2>
                    {body}
                </div>
                {switchGroup}
                <div className="flex items-center justify-start py-2 px-4 dark:border-warmGray-800">
                    <span className="text-xs">Powered by</span>
                    <NotifiLogo className="h-4 w-16 ml-1 pb-1" />
                    <span className="flex-grow"></span>
                    <span className="text-xs ml-1 hover:text-saber">
                        <a
                            href="https://notifi.network/faqs"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                        Learn more
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
}
