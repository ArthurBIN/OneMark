import './index.scss'

type params = {
    className?: string;
    handleHiddenSiderBar: () => void;
    isHidden: boolean;
}

export const AnnotationToolbar = ({
    className = '',
    handleHiddenSiderBar,
    isHidden = false,
}: params) => {

    return (
        <div className={`AnnotationToolbar ${className}`}>
            <i
                className='siderBarButton iconfont icon-sidebarcebianlan'
                onClick={handleHiddenSiderBar}
            />
            <div className={`Content ${isHidden ? 'Content--hidden' : ''}`}>
                <div>
                    你好年号i单号i是多少i
                </div>
            </div>
        </div>
    )
}