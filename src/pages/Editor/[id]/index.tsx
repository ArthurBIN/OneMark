import { useParams } from 'react-router-dom';
import './index.scss'
import { AnnotationHeader } from './AnnotationHeader';
import { AnnotationToolbar } from './AnnotationToolbar';
import { AnnotationContent } from './AnnotationContent';
import { AnnotationSidebar } from './AnnotationSidebar';
import { useEffect, useState } from 'react';
import type { AnnotationDetail } from '@/types/annotations';
import { getAnnotation } from '@/lib/api/annotation';

export const Editor = () => {
    const params = useParams();

    const [loading, setLoading] = useState(false);

    // 所有数据
    const [annotationPageData, setAnnotationPageData] = useState<AnnotationDetail>();

    // 控制左侧工具栏显示
    const [isSiderBar, setIsSiderBar] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (params.id) {
                try {
                    setLoading(true);
                    const Data = await getAnnotation(params.id);
                    setAnnotationPageData(Data);
                } catch {

                } finally {
                    setLoading(false);
                }
            }
        }
        fetchData()
    }, [params.id])

    const handleHiddenSiderBar = () => {
        setIsSiderBar(!isSiderBar);
    }

    if (loading) return (
        <div>加载中...</div>
    )

    return (
        <div className="Editor">

            {/* 顶部栏 */}
            <AnnotationHeader
                title={annotationPageData?.title}
            />

            <div className='Main'>
                {/* 工具栏 */}
                <AnnotationToolbar
                    className={`${isSiderBar ? 'toolbar_hidden' : 'toolbar'}`}
                    isHidden={isSiderBar}
                    handleHiddenSiderBar={handleHiddenSiderBar}
                />

                {/* 内容栏 */}
                <AnnotationContent
                    className='content'
                    pageData={annotationPageData?.pages}
                    type={annotationPageData?.type}
                />

                {/* 侧边栏 */}
                <AnnotationSidebar
                    className='sidebar'
                />
            </div>
        </div>
    );
}