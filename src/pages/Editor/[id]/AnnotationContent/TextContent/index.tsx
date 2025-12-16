import type { AnnotationPage } from '@/types/annotations';
import './index.scss'
import TextEditor from '@/components/TextEditor';
import { useState } from 'react';

type TextContentProps = {
    pageData?: AnnotationPage[];
}

export default function TextContent({
    pageData = []
}: TextContentProps) {

    const [textContent, setTextContent] = useState(pageData?.[0].text_content)

    return (
        <div className="TextContent">
            <TextEditor value={textContent} onChange={setTextContent} />
        </div>
    )
}