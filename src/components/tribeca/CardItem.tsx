
interface Props {
  label: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

function CardItem({ label, children, className }: Props) {
    return (
        <div className={`px-7 py-4 border-b border-warmGray-800 ${className || ''}`}>
            <span className="text-warmGray-400 text-sm">{label}</span>
            <div className="text-xl text-white mt-0.5">{children}</div>
        </div>
    );
}

export { CardItem };
