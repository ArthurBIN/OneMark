

type params = {
    className?: string;
}

export const AnnotationSidebar = ({
    className = '',
}: params) => {

    return (
        <div className={`AnnotationSidebar ${className}`}>
            侧边栏
        </div>
    )
}