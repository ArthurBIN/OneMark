import './index.scss'
import { useDrawing } from '@/contexts/DrawingContext'
import { ColorPicker, InputNumber, Slider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import type { InputNumberProps } from 'antd';
import { setColor, setLineWidth } from '@/store/modules/drawingSlice';

type DrawingTool =
    | 'pencil' | 'pen' | 'marker' | 'brush'
    | 'rectangle' | 'rectangle-fill'
    | 'circle' | 'circle-fill'
    | 'triangle' | 'triangle-fill'
    | 'line' | 'arrow'
    | 'eraser'
    | null

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
    const { drawingTool, setDrawingTool, setIsDrawingMode } = useDrawing();

    const dispatch = useDispatch<AppDispatch>();

    const { color, lineWidth } = useSelector((state: RootState) => state.drawing);

    const onChange: InputNumberProps['onChange'] = (newValue) => {
        dispatch(setLineWidth(newValue as number));
    };

    const handleToolClick = (tool: DrawingTool) => {
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
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'rectangle' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('rectangle')}
                        >
                            <i className="ri-square-line" />
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'rectangle-fill' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('rectangle-fill')}
                        >
                            <i className="ri-square-fill" />
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'circle' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('circle')}
                        >
                            <i className="ri-circle-line" />
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'circle-fill' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('circle-fill')}
                        >
                            <i className="ri-circle-fill" />
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'triangle' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('triangle')}
                        >
                            <i className="ri-triangle-line" />
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'triangle-fill' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('triangle-fill')}
                        >
                            <i className="ri-triangle-fill" />
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'line' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('line')}
                        >
                            <i className="ri-subtract-line" />
                        </div>
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'arrow' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('arrow')}
                        >
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
                        <div
                            className={`AnnotationToolbar_ToolItem ${drawingTool === 'eraser' ? 'AnnotationToolbar_ToolItem_Active' : ''}`}
                            onClick={() => handleToolClick('eraser')}
                        >
                            <i className="ri-eraser-fill" />
                        </div>
                    </div>
                </div>

                {/* 线条粗细 */}
                <div className="AnnotationToolbar_ToolGroup">
                    <div className="AnnotationToolbar_ToolGroupHeader">
                        <span className="AnnotationToolbar_ToolGroupTitle" style={{ marginLeft: 0 }}>线条粗细</span>
                        <div className='AnnotationToolbar_Border'></div>
                    </div>

                    <div className="AnnotationToolbar_Control">
                        <Slider
                            className='AnnotationToolbar_Control_Slider'
                            min={1}
                            max={20}
                            onChange={onChange}
                            value={typeof lineWidth === 'number' ? lineWidth : 1}
                        />
                        <InputNumber
                            className='AnnotationToolbar_Control_InputNumber'
                            min={1}
                            max={20}
                            value={lineWidth}
                            onChange={onChange}
                        />


                    </div>
                </div>

                {/* 颜色 */}
                <div className="AnnotationToolbar_ToolGroup">
                    <div className="AnnotationToolbar_ToolGroupHeader">
                        <span className="AnnotationToolbar_ToolGroupTitle" style={{ marginLeft: 0 }}>颜色</span>
                        <div className='AnnotationToolbar_Border'></div>
                    </div>
                    <div className="AnnotationToolbar_Control">
                        <ColorPicker
                            value={color}
                            size="large"
                            showText
                            onChange={(_, css: string) => {
                                dispatch(setColor(css))
                            }}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}