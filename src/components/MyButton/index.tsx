import type { CSSProperties } from 'react';
import { GlowCard } from '@/components/GlowCard';
import { LoadingOutlined } from '@ant-design/icons';
import './index.scss';

type ButtonSize = 'small' | 'medium' | 'large';

interface MyButtonProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    size?: ButtonSize;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    backgroundColor?: string;
    textColor?: string;
    glowColor?: string;
    glowSize?: number;
    loading?: boolean;
}

export const MyButton = ({
    children,
    icon,
    size = 'medium',
    onClick,
    disabled = false,
    className = '',
    style = {},
    backgroundColor = '#000000',
    textColor = '#ffffff',
    glowColor = '255, 255, 255',
    glowSize = 150,
    loading = false
}: MyButtonProps) => {
    const handleClick = () => {
        if (!disabled && onClick) {
            onClick();
        }
    };

    return (
        <GlowCard
            className={`my-button my-button--${size} ${disabled ? 'my-button--disabled' : ''} ${className}`}
            style={{
                backgroundColor,
                color: textColor,
                ...style
            }}
            glowColor={glowColor}
            glowSize={glowSize}
            glowIntensity={0.4}
            isShow={!disabled}
            onClick={handleClick}
        >
            {icon && <span className="my-button__icon">{icon}</span>}
            {loading && <span className="my-button__icon">
                <LoadingOutlined />
            </span>}
            <span className="my-button__text">{children}</span>
        </GlowCard>
    );
};