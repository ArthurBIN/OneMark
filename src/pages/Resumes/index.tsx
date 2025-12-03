import { ActiveBox } from "@/components/ActiveBox";
import { GlowCard } from "@/components/GlowCard";
import { useEffect, useRef, useState } from "react";
import './index.scss'
import addImg from '@/assets/img/add.png'
import { Modal } from "@/components/Modal";
import { MyInput } from "@/components/MyInput";
import { message } from 'antd';
import { createEmptyResume, getMyResumes } from "@/lib/api/resumes";
import type { Resume } from "@/types/resumes";
import { formatRelativeTime } from '@/utils/formatTime';
import { LoadingOutlined } from '@ant-design/icons';

export const Resumes = () => {
    useEffect(() => {
        document.title = "简历 - 简历积木";
    }, []);

    const [isLoading, setIsLoading] = useState(true);

    const [messageApi, contextHolder] = message.useMessage();

    const [myResumes, setMyResumes] = useState<Resume[]>([]);

    const [isAddModal, setIsAddModal] = useState(false);

    const [addLoading, setAddLoading] = useState(false);

    const [titleText, setTitleText] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    const fetchMyResumes = async () => {
        try {
            setIsLoading(true);
            const res = await getMyResumes();
            setMyResumes(res as Resume[]);
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: `获取简历失败: ${error}`,
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMyResumes();
    }, []);

    useEffect(() => {
        if (isAddModal) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isAddModal]);

    const handleCreateResume = async () => {
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
            await createEmptyResume(titleText);
            messageApi.open({
                type: 'success',
                content: '创建成功！',
            });
            fetchMyResumes();
            setAddLoading(false);
            setTitleText('');
            setIsAddModal(false);
        } catch (error) {
            setAddLoading(false);
            messageApi.open({
                type: 'error',
                content: `创建简历失败: ${error}`,
            });
        }
    }

    return (
        <div className="Resumes">
            {contextHolder}
            <ActiveBox>
                <h1>简历</h1>
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
                            <p>新建简历</p>
                            <p>像搭积木一样搭建自己的简历</p>
                        </div>
                    </GlowCard>

                    {myResumes.map((item, index) => (
                        <GlowCard
                            key={item.id}
                            className="ContentBoxItem"
                            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                        >
                            <div className="ContentBoxItem1_text">
                                <p className="title">{item.title}</p>
                                <p className="time">
                                    最后更新：{formatRelativeTime(item.updated_at)}
                                </p>
                            </div>
                        </GlowCard>
                    ))}
                </div>
            )}


            <Modal
                isOpen={isAddModal}
                onClose={() => { setIsAddModal(false); setTitleText('') }}
                title="新建简历"
                titleIcon={<span>+</span>}
                buttonText="新建"
                loading={addLoading}
                onButtonClick={handleCreateResume}
            >
                <p>标题</p>
                <MyInput
                    ref={inputRef}
                    value={titleText}
                    className="titleInput"
                    onChange={(e) => setTitleText(e.target.value)}
                />
            </Modal>
        </div>
    )
}