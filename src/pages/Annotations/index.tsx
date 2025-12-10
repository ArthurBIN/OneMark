import { ActiveBox } from "@/components/ActiveBox";
import { GlowCard } from "@/components/GlowCard";
import { useEffect, useRef, useState } from "react";
import './index.scss'
import addImg from '@/assets/img/add.png'
import { Modal } from "@/components/Modal";
import { MyInput } from "@/components/MyInput";
import { message, Radio, ConfigProvider } from 'antd';
import type { RadioChangeEvent } from 'antd'
import { createAnnotation, deleteAnnotation, getMyAnnotations } from "@/lib/api/annotation";
import type { Annotation } from "@/types/annotations";
import { formatRelativeTime } from '@/utils/formatTime';
import { LoadingOutlined, FolderOpenOutlined, DeleteOutlined } from '@ant-design/icons';
import { MyButton } from "@/components/MyButton";
import { useNavigate } from "react-router-dom";

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
    const handleCreateAnnotation = async () => {
        if (!titleText.trim()) {
            messageApi.open({
                type: 'error',
                content: '请输入标题！',
            });
            inputRef.current?.focus();
            return;
        }
        try {
            setAddLoading(true);
            await createAnnotation(titleText, annotationType);
            messageApi.open({
                type: 'success',
                content: '创建成功！',
            });
            fetchMyAnnotation();
            setAddLoading(false);
            setTitleText('');
            setAnnotationType('text');
            setIsAddModal(false);
        } catch (error) {
            setAddLoading(false);
            messageApi.open({
                type: 'error',
                content: `创建项目失败: ${error}`,
            });
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
                        <GlowCard
                            key={item.id}
                            className="ContentBoxItem"
                            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                        >
                            <div className="ContentBoxItem1_text">
                                <p>{item.title}</p>
                                <p>
                                    最后更新：{formatRelativeTime(item.updated_at)}
                                    <div
                                        className="AnnotationTypeTag"
                                        style={{
                                            backgroundColor: item.type === 'text' ? '#108ee9' : (item.type === 'file' ? '#87d068' : '#2db7f5')
                                        }}
                                    ></div>
                                </p>
                            </div>
                            <div className="ContentBoxItem_Modify">
                                <MyButton
                                    size="small"
                                    onClick={() => {
                                        navigate(`/editor/${item.id}`, {
                                            state: { title: item.title }
                                        })
                                    }}
                                    icon={<FolderOpenOutlined />}
                                >
                                    打开
                                </MyButton>
                                <MyButton
                                    size="small"
                                    onClick={() => {
                                        setIsDelModal(true);
                                        setDelAnnotationId(item.id)
                                    }}
                                    icon={<DeleteOutlined />}
                                    backgroundColor="#F42F5C"
                                >
                                    删除
                                </MyButton>
                            </div>
                        </GlowCard>
                    ))}
                </div>
            )}


            <Modal
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
            </Modal>

            {/* 新增项目弹窗 */}
            <Modal
                isOpen={isAddModal}
                onClose={() => {
                    setIsAddModal(false);
                    setTitleText('');
                    setAnnotationType('text');
                }}
                title="新建项目"
                titleIcon={<span>+</span>}
                buttonText="新建"
                loading={addLoading}
                onButtonClick={handleCreateAnnotation}
            >
                <p>标题</p>
                <MyInput
                    ref={inputRef}
                    value={titleText}
                    className="titleInput"
                    onChange={(e) => setTitleText(e.target.value)}
                />
                <p style={{ marginTop: '10px' }}>类型</p>
                <ConfigProvider
                    theme={{
                        components: {
                            Radio: {
                                colorPrimary: '#000000',
                            },
                        },
                    }}
                >
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
                </ConfigProvider>
            </Modal>
        </div>
    )
}