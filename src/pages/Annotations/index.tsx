import { ActiveBox } from "@/components/ActiveBox";
import { GlowCard } from "@/components/GlowCard";
import { useEffect, useRef, useState } from "react";
import './index.scss'
import addImg from '@/assets/img/add.png'
import { MyModal } from "@/components/MyModal";
import { MyInput } from "@/components/MyInput";
import { message, Radio, Switch } from 'antd';
import type { RadioChangeEvent } from 'antd'
import { createTextAnnotationWithPage, deleteAnnotation, getMyAnnotations } from "@/lib/api/annotation";
import type { Annotation } from "@/types/annotations";
import { formatRelativeTime } from '@/utils/formatTime';
import { LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import SimpleTextEditor from "@/components/SimpleTextEditor";

type AnnotationType = 'text' | 'file' | 'img';

export const Annotations = () => {
    useEffect(() => {
        document.title = "项目 - 一标";
    }, []);

    const navigate = useNavigate();

    // 加载项目内容
    const [isLoading, setIsLoading] = useState(true);

    const [messageApi, contextHolder] = message.useMessage();

    // 项目列表
    const [myAnnotation, setMyAnnotation] = useState<Annotation[]>([]);

    // 控制新建项目弹窗显示
    const [isAddModal, setIsAddModal] = useState(false);

    // 新增项目按钮loading
    const [addLoading, setAddLoading] = useState(false);

    // 删除项目按钮loading
    const [delLoading, setDelLoading] = useState(false);

    // 新增项目标题
    const [titleText, setTitleText] = useState('');

    // 控制删除项目弹窗显示
    const [isDelModal, setIsDelModal] = useState(false)

    // 删除项目id
    const [delAnnotationId, setDelAnnotationId] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    // 项目类型
    const [annotationType, setAnnotationType] = useState<AnnotationType>('text');

    // 项目是否公开
    const [isPublic, setIsPublic] = useState(true);

    // 新建文本项目modal
    const [addTextModal, setAddTextModal] = useState(false);

    // 文本项目内容
    const [textContent, setTextContent] = useState('')

    // 获取项目
    const fetchMyAnnotation = async () => {
        try {
            setIsLoading(true);
            const res = await getMyAnnotations();
            setMyAnnotation(res as Annotation[]);
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: `获取项目失败: ${error}`,
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMyAnnotation();
    }, []);

    useEffect(() => {
        if (isAddModal) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isAddModal]);

    // 新建项目
    const handleCreateTextAnnotation = async () => {
        if (textContent === null || textContent === '') {
            messageApi.open({
                type: 'warning',
                content: `文本内容不能为空`,
            });
            return;
        }

        try {
            setAddLoading(true);

            const params = {
                title: titleText,
                is_public: isPublic,
                text_content: textContent,
                thumbnail: textContent
            }

            await createTextAnnotationWithPage(params);

            messageApi.open({
                type: 'success',
                content: '创建成功!',
            });

            setTitleText('');
            setTextContent('');
            setAnnotationType('text');
            setAddTextModal(false);
            fetchMyAnnotation();
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: `创建项目失败: ${error}`,
            });
        } finally {
            setAddLoading(false);
        }
    }

    // 删除项目
    const handleDelAnnotation = async () => {
        try {
            setDelLoading(true);
            await deleteAnnotation(delAnnotationId);
            messageApi.open({
                type: 'success',
                content: `删除项目成功！`,
            });
            setMyAnnotation(prev => prev.filter(r => r.id !== delAnnotationId));
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: `删除项目失败: ${error}`,
            });
        } finally {
            setDelLoading(false);
            setDelAnnotationId('');
            setIsDelModal(false);
        }
    }


    const onChange = (e: RadioChangeEvent) => {
        setAnnotationType(e.target.value);
    };

    return (
        <div className="Annotation">
            {contextHolder}
            <ActiveBox>
                <h1>项目</h1>
            </ActiveBox>

            {isLoading ? (
                <ActiveBox className="ContentBoxLoading">
                    <LoadingOutlined />
                </ActiveBox>) : (
                <div className="ContentBox">
                    <GlowCard
                        className="ContentBoxItem ContentBoxItem1"
                        onClick={() => {
                            setIsAddModal(true);
                            inputRef.current?.focus();
                        }}
                    >
                        <img src={addImg} alt="" />
                        <div className="ContentBoxItem1_text">
                            <p>新建项目</p>
                            <p>开始随心所欲的标记</p>
                        </div>
                    </GlowCard>

                    {myAnnotation.map((item, index) => (
                        <AnnotationItem
                            key={item.id}
                            item={item}
                            index={index}
                            onClick={() => {
                                navigate(`/editor/${item.id}`);
                            }}
                            onDelete={() => {
                                setIsDelModal(true);
                                setDelAnnotationId(item.id);
                            }}
                        />
                    ))}
                </div>
            )}


            {/* 删除项目 */}
            <MyModal
                isOpen={isDelModal}
                onClose={() => { setIsDelModal(false); setDelAnnotationId('') }}
                title="删除项目"
                titleIcon={<DeleteOutlined />}
                buttonText="删除"
                loading={delLoading}
                buttonColor="#F42F5C"
                onButtonClick={handleDelAnnotation}
            >
                确认删除此项目？
            </MyModal>

            {/* 新增项目弹窗 */}
            <MyModal
                isOpen={isAddModal}
                onClose={() => {
                    setIsAddModal(false);
                    // setTitleText('');
                    // setAnnotationType('text');
                }}
                title="新建项目"
                titleIcon={<span>+</span>}
                buttonText="下一步"
                onButtonClick={() => {
                    if (titleText === '') {
                        messageApi.open({
                            type: 'warning',
                            content: `标题不能为空`,
                        });
                        return;
                    }
                    setIsAddModal(false);
                    if (annotationType === 'text') {
                        setAddTextModal(true);
                    }
                }}
            >
                <p>标题</p>
                <MyInput
                    ref={inputRef}
                    value={titleText}
                    className="titleInput"
                    onChange={(e) => setTitleText(e.target.value)}
                />
                <p style={{ marginTop: '10px' }}>类型</p>
                <Radio.Group
                    onChange={onChange}
                    value={annotationType}
                    style={{ marginTop: '10px' }}
                    options={[
                        { value: 'text', label: '文本' },
                        { value: 'file', label: '文件' },
                        { value: 'img', label: '图片' },
                    ]}
                />
                <p style={{ marginTop: '30px' }}>隐私</p>
                <Switch
                    checked={isPublic}
                    onChange={setIsPublic}
                    checkedChildren="公开"
                    unCheckedChildren="私密"
                    defaultChecked
                    style={{ marginTop: '10px' }}
                />
            </MyModal>

            {/* 新增文本弹窗 */}
            <MyModal
                isOpen={addTextModal}
                onClose={() => {
                    setTitleText('');
                    setAnnotationType('text');
                    setAddTextModal(false);
                }}
                title="上传文本内容"
                buttonText="新建"
                loading={addLoading}
                onButtonClick={handleCreateTextAnnotation}
            >
                <SimpleTextEditor value={textContent} onChange={setTextContent} />
            </MyModal>
        </div>
    )
}

const AnnotationItem = ({ item, index, onDelete, onClick }: any) => {

    return (
        <GlowCard
            className="ContentBoxItem"
            onClick={onClick}
            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
        >
            <div
                className="ContentBoxItem_Content"
                dangerouslySetInnerHTML={{ __html: item.thumbnail || '暂无内容' }}
            />
            <div className="ContentBoxItem_text">
                <div className="ContentBoxItem_text_title">
                    {item.title}
                    <div
                        className="ContentBoxItem_Modify_DelButton"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <i><DeleteOutlined /></i>
                    </div>
                </div>
                <div className="ContentBoxItem_text_time">
                    最后更新:{formatRelativeTime(item.updated_at)}
                    <div
                        className="AnnotationTypeTag"
                        style={{
                            backgroundColor: item.type === 'text' ? '#108ee9' : (item.type === 'file' ? '#87d068' : '#2db7f5')
                        }}
                    ></div>
                </div>
            </div>
        </GlowCard>
    );
};