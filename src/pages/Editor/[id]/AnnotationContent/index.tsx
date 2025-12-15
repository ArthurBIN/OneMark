

type params = {
    className?: string;
}

export const AnnotationContent = ({
    className = '',
}: params) => {

    return (
        <div className={`AnnotationContent ${className}`}>
            工具栏
        </div>
    )
}