import { useEffect } from 'react';
import './index.scss';
import { MyButton } from '../MyButton';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    titleIcon?: React.ReactNode;
    children: React.ReactNode;
    buttonText?: string;
    loading?: boolean;
    buttonColor?: string;
    onButtonClick?: () => void;
    showButton?: boolean;
}

export const MyModal = ({
    isOpen,
    onClose,
    title = '标题',
    titleIcon,
    children,
    buttonText = '确定',
    loading = false,
    buttonColor = '#000000',
    onButtonClick,
    showButton = true
}: ModalProps) => {
    // 防止背景滚动
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // ESC 键关闭
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-container">
                {/* 头部 */}
                <div className="modal-header">
                    <div className="modal-title">
                        {titleIcon && <span className="modal-title-icon">{titleIcon}</span>}
                        <span>{title}</span>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                {/* 内容 */}
                <div className="modal-content">
                    {children}
                </div>

                {/* 底部按钮 */}
                {showButton && (
                    <div className="modal-footer">
                        <MyButton
                            onClick={handleButtonClick}
                            disabled={loading}
                            loading={loading}
                            backgroundColor={buttonColor}
                        >
                            {buttonText}
                        </MyButton>
                    </div>
                )}
            </div>
        </div>
    );
};