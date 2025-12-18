import './index.scss'
import { useDrawing } from '@/contexts/DrawingContext'

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
    const { drawingTool, setDrawingTool, setIsDrawingMode } = useDrawing()

    const handleToolClick = (tool: 'pencil' | 'pen' | 'marker' | 'brush') => {
        if (drawingTool === tool) {
            // 如果点击的是当前工具，则取消选择
            setDrawingTool(null)
            setIsDrawingMode(false)
        } else {
            // 选择新工具
            setDrawingTool(tool)
            setIsDrawingMode(true)
        }
    }

    return (
        <div className={`AnnotationToolbar ${className}`}>
            <i
                className='AnnotationToolbar_CloseButton iconfont icon-sidebarcebianlan'
                onClick={handleHiddenSiderBar}
            />
            <div className={`AnnotationToolbar_Content ${isHidden ? 'AnnotationToolbar_Content_Hidden' : ''}`}>
                {/* 画笔 */}
                <div className="AnnotationToolbar_ToolGroup">
                    <div className="AnnotationToolbar_ToolGroupHeader">
                        <i className={`ri-edit-line AnnotationToolbar_ToolGroupIcon`} />
                        <span className="AnnotationToolbar_ToolGroupTitle">画笔</span>
                        <div className='AnnotationToolbar_Border'></div>
                    </div>

                    <div className="AnnotationToolbar_ToolList">
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'pencil' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('pencil')}
                        >
                            <i className='ri-pencil-line'></i>
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'pen' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('pen')}
                        >
                            <i className='ri-pen-nib-line'></i>
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'marker' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('marker')}
                        >
                            <i className='ri-mark-pen-line'></i>
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'brush' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('brush')}
                        >
                            <i className='ri-brush-line'></i>
                        </div>
                    </div>
                </div>

                {/* 图形 */}
                <div className="AnnotationToolbar_ToolGroup">
                    <div className="AnnotationToolbar_ToolGroupHeader">
                        <i className="ri-shape-line AnnotationToolbar_ToolGroupIcon" />
                        <span className="AnnotationToolbar_ToolGroupTitle">图形</span>
                        <div className='AnnotationToolbar_Border'></div>
                    </div>

                    <div className="AnnotationToolbar_ToolList">
                        <div className="AnnotationToolbar_ToolItem">
                            <i className="ri-square-line" />
                        </div>
                        <div className="AnnotationToolbar_ToolItem">
                            <i className="ri-circle-line" />
                        </div>
                        <div className="AnnotationToolbar_ToolItem">
                            <i className="ri-triangle-line" />
                        </div>
                        <div className="AnnotationToolbar_ToolItem">
                            <i className="ri-subtract-line" />
                        </div>
                        <div className="AnnotationToolbar_ToolItem">
                            <i className="ri-arrow-right-line" />
                        </div>
                    </div>
                </div>

                {/* 橡皮 */}
                <div className="AnnotationToolbar_ToolGroup">
                    <div className="AnnotationToolbar_ToolGroupHeader">
                        <i className="ri-eraser-line AnnotationToolbar_ToolGroupIcon" />
                        <span className="AnnotationToolbar_ToolGroupTitle">橡皮</span>
                        <div className='AnnotationToolbar_Border'></div>
                    </div>

                    <div className="AnnotationToolbar_ToolList">
                        <div className="AnnotationToolbar_ToolItem AnnotationToolbar_ToolItem_XiangPi">
                            小
                        </div>
                        <div className="AnnotationToolbar_ToolItem AnnotationToolbar_ToolItem_XiangPi">
                            中
                        </div>
                        <div className="AnnotationToolbar_ToolItem AnnotationToolbar_ToolItem_XiangPi">
                            大
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}