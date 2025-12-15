import './index.scss'

interface ActiveBoxProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const ActiveBox = ({ children, className = '', onClick }: ActiveBoxProps) => {
    return (
        <div
            className={`ActiceBox ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}