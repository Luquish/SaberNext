'use client';

import type { ProgramInfo } from '@/hooks/tribeca/useAuthorityPrograms';
import { useProgramLabel } from '@/hooks/tribeca/useProgramMeta';
import { AddressLink } from '@/components/tribeca/AddressLink';
import { SlotLink } from '@/components/tribeca/SlotLink';

interface Props {
  program: ProgramInfo;
  actions?: React.ReactNode;
}

export function ProgramCard({ program, actions }: Props) {
    const label = useProgramLabel(program.programID);
    return (
        <div className="text-sm flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800">
            <div className="flex flex-grow w-2/3">
                <div className="flex-basis[236px] flex flex-col gap-1">
                    <span className="font-medium text-white">{label}</span>
                    <div className="text-xs flex gap-1 text-secondary">
                        <span>ID:</span>
                        <AddressLink address={program.programID} showCopy />
                    </div>
                </div>
                <div className="invisible lg:flex lg:ml-12 lg:visible items-center gap-1 text-secondary">
                    <span>Deployed At:</span>
                    <span>
                        <SlotLink slot={program.lastDeploySlot} />
                    </span>
                </div>
            </div>
            <div>{actions}</div>
        </div>
    );
}
