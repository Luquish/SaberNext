interface Props {
  label: string;
  children?: React.ReactNode;
}

function CardItem({ label, children }: Props) {
    return (
        <div tw="px-7 py-4 border-b border-warmGray-800">
            <span tw="text-warmGray-400 text-sm">{label}</span>
            <div tw="text-xl text-white mt-0.5">{children}</div>
        </div>
    );
}

export { CardItem };
