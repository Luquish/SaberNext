'use client'

import { QuarrySDKProvider } from '@rockooor/react-quarry';

interface Props {
  children?: React.ReactNode;
}

export const QuarryInterfaceProvider: React.FC<Props> = ({
    children,
}: Props) => {
    return <QuarrySDKProvider initialState={{}}>{children}</QuarrySDKProvider>;
};
