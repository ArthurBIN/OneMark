import './index.scss'

interface ActiveBoxProps {
    children: React.ReactNode;
    className?: string;
}

export const ActiveBox = ({ children, className = '' }: ActiveBoxProps) => {
    return (
        <div className={`ActiceBox ${className}`}>
            {children}
        </div>
    )
}