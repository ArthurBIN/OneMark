import './index.scss'
import type { AnnotationType, AnnotationPage } from '@/types/annotations'
import TextContent from './TextContent';
import FileContent from './FileContent';
import ImageContent from './ImageContent';

type params = {
    className?: string;
    type?: AnnotationType;
    pageData?: AnnotationPage[];
}

export const AnnotationContent = ({
    className = '',
    type,
    pageData = []
}: params) => {

    return (
        <div className={`AnnotationContent ${className}`}>
            {type === 'text' && <TextContent pageData={pageData} />}

            {type === 'file' && <FileContent />}

            {type === 'img' && <ImageContent />}
        </div>
    )
}