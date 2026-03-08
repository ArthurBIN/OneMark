// AnnotationHeader 组件
import { useParams } from 'react-router-dom';
import './index.scss';
import { DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Popover, Select, Spin, Tooltip, message } from 'antd';
import { MyModal } from '@/components/MyModal';
import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import {
    searchUsers,
    addCollaborator,
    getCollaborators,
    removeCollaborator,
    updateCollaboratorRole,
} from '@/lib/api/annotation';
import type { CollaboratorRole } from '@/types/collaborator';
import { supabase } from '@/utils/supabaseClient';

type headerParams = {
    title?: string
}

interface CollaboratorOption {
    label: string
    value: string
    email: string
    avatar: string | null
    avatar_bg_color: string
}


export const AnnotationHeader = ({
    title
}: headerParams) => {
    const params = useParams();
    const annotationId = params.id as string;

    const [addCollaboratorsModal, setAddCollaboratorsModal] = useState(false);
    const [addCollaboratorsModalLoading, setAddCollaboratorsModalLoading] = useState(false);

    // 搜索相关状态
    const [searchOptions, setSearchOptions] = useState<CollaboratorOption[]>([]);
    const [fetching, setFetching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<CollaboratorOption | null>(null);
    const [selectedRole, setSelectedRole] = useState<CollaboratorRole>('viewer');

    // 协作者列表刷新标志
    const [refreshCollaborators, setRefreshCollaborators] = useState(0);

    const [messageApi, contextHolder] = message.useMessage();

    const [userData, setUserData] = useState<any>(null)
    useEffect(() => {
        supabase.auth.getUser().then(res => setUserData(res.data.user))
    }, [])



    // 防抖搜索用户
    const debounceFetcher = useCallback(
        debounce(async (searchTerm: string) => {
            if (!searchTerm || searchTerm.length < 2) {
                setSearchOptions([]);
                return;
            }

            setFetching(true);
            try {
                const users = await searchUsers(searchTerm);
                const options: CollaboratorOption[] = users.map(user => ({
                    label: user.display_name || user.email,
                    disabled: user.id === userData?.id,
                    value: user.id,
                    email: user.email,
                    avatar: user.avatar_url,
                    avatar_bg_color: user.avatar_bg_color
                }));
                setSearchOptions(options);
            } catch (error) {
                messageApi.error('搜索用户失败');
            } finally {
                setFetching(false);
            }
        }, 500),
        [userData?.id]
    );

    // 添加协作者
    const handleAddCollaborators = async () => {
        if (!selectedUser) {
            messageApi.warning('请选择一个用户');
            return;
        }

        setAddCollaboratorsModalLoading(true);
        try {
            await addCollaborator(annotationId, selectedUser.value, selectedRole);
            messageApi.success('添加协作者成功');
            setAddCollaboratorsModal(false);
            setSelectedUser(null);
            setSelectedRole('viewer');
            setSearchOptions([]);
            // 刷新协作者列表
            setRefreshCollaborators(prev => prev + 1);
        } catch (error: any) {
            messageApi.error(error.message || '添加协作者失败');
        } finally {
            setAddCollaboratorsModalLoading(false);
        }
    };

    // 关闭模态框时重置状态
    const handleCloseModal = () => {
        setAddCollaboratorsModal(false);
        setSelectedUser(null);
        setSelectedRole('viewer');
        setSearchOptions([]);
    };

    return (
        <div className="AnnotationHeader">
            {contextHolder}
            <span className='logo'>一标</span>
            <Breadcrumb
                className='title'
                items={[
                    {
                        href: '/dashboard/annotations',
                        title: <HomeOutlined />,
                    },
                    {
                        title: (
                            <>
                                <span>{title}</span>
                            </>
                        ),
                    }
                ]}
            />
            <div className='buttonBox'>
                <Popover
                    placement="bottomRight"
                    trigger='click'
                    content={
                        <Collaborators
                            annotationId={annotationId}
                            handleOpenAddModal={() => setAddCollaboratorsModal(true)}
                            refreshKey={refreshCollaborators}
                        />
                    }>
                    <div className='buttonItem'>
                        <i className='iconfont icon-geren'></i>
                    </div>
                </Popover>

                <div className='buttonItem'>
                    <i className='iconfont icon-fenxiang'></i>
                </div>
            </div>

            {/* 添加协作者模态框 */}
            <MyModal
                isOpen={addCollaboratorsModal}
                onClose={handleCloseModal}
                title="添加协作者"
                titleIcon={<span>+</span>}
                buttonText="添加"
                loading={addCollaboratorsModalLoading}
                buttonColor="#F42F5C"
                onButtonClick={handleAddCollaborators}
            >
                <div style={{ padding: '20px 0' }}>
                    {/* 用户搜索 */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                            搜索用户
                        </label>
                        <Select
                            showSearch
                            value={selectedUser}
                            labelInValue
                            placeholder="输入邮箱或用户名搜索"
                            style={{ width: '100%' }}
                            filterOption={false}
                            onSearch={debounceFetcher}
                            onChange={(option) => setSelectedUser(option as CollaboratorOption)}
                            notFoundContent={fetching ? <Spin size="small" /> : '未找到用户'}
                            options={searchOptions}
                            optionRender={(option) => (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {option.data.avatar ? (
                                        <Avatar src={option.data.avatar} style={{ marginRight: 8 }} />
                                    ) : (
                                        <Avatar
                                            style={{
                                                backgroundColor: option.data.avatar_bg_color,
                                                marginRight: 8,
                                                color: '#fff'
                                            }}
                                        >
                                            {option.data.label?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    )}
                                    <div>
                                        <div>
                                            {option.label}
                                            {option.value === userData?.id && <span>（不可添加本人）</span>}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#999' }}>
                                            {option.data.email}
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    {/* 角色选择 */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                            权限角色
                        </label>
                        <Select
                            value={selectedRole}
                            onChange={setSelectedRole}
                            style={{ width: '100%' }}
                            options={[
                                {
                                    value: 'viewer',
                                    label: 'Viewer（仅查看）',
                                    description: '可以查看文档内容，但不能编辑'
                                },
                                {
                                    value: 'editor',
                                    label: 'Editor（可编辑）',
                                    description: '可以查看和编辑文档内容'
                                }
                            ]}
                            optionRender={(option) => (
                                <div>
                                    <div style={{ fontWeight: 500 }}>{option.label}</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>
                                        {option.data.description}
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </MyModal>
        </div>
    )
}

// 协作者列表组件
interface CollaboratorData {
    id: string
    user_id: string
    role: CollaboratorRole
    created_at: string
    user_profiles: {
        email: string
        display_name: string | null
        avatar_url: string | null
        avatar_bg_color: string
    }
}

const Collaborators = ({
    annotationId,
    handleOpenAddModal,
    refreshKey
}: {
    annotationId: string
    handleOpenAddModal: () => void
    refreshKey: number
}) => {
    const [collaborators, setCollaborators] = useState<CollaboratorData[]>([]);
    const [loading, setLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        fetchCollaborators();
    }, [annotationId, refreshKey]);

    const fetchCollaborators = async () => {
        setLoading(true);
        try {
            const data = await getCollaborators(annotationId);
            setCollaborators(data as any);
        } catch (error) {
            messageApi.error('获取协作者列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (collaboratorId: string) => {
        try {
            await removeCollaborator(collaboratorId);
            messageApi.success('移除协作者成功');
            fetchCollaborators();
        } catch (error) {
            messageApi.error('移除协作者失败');
        }
    };

    const handleToggleRole = async (collaboratorId: string, currentRole: CollaboratorRole) => {
        const newRole: CollaboratorRole = currentRole === 'editor' ? 'viewer' : 'editor';
        try {
            await updateCollaboratorRole(collaboratorId, newRole);
            messageApi.success('角色更新成功');
            fetchCollaborators();
        } catch (error) {
            messageApi.error('更新角色失败');
        }
    };

    return (
        <div className='Collaborators'>
            {contextHolder}
            <div className='Collaborators_Title'>
                协作者 ({collaborators.length})
                <Tooltip placement="top" title="邀请" color="black">
                    <button
                        className="Collaborators_Title_Plus"
                        onClick={handleOpenAddModal}
                    >
                        +
                    </button>
                </Tooltip>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin />
                </div>
            ) : (
                <div className='Collaborators_List'>
                    {collaborators.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                            暂无协作者
                        </div>
                    ) : (
                        collaborators.map(collab => (
                            <div key={collab.id} className='Collaborators_Item'>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    {collab.user_profiles.avatar_url ? (
                                        <Avatar src={collab.user_profiles.avatar_url} />
                                    ) : (
                                        <Avatar
                                            style={{
                                                backgroundColor: collab.user_profiles.avatar_bg_color,
                                                color: '#fff'
                                            }}
                                        >
                                            {(collab.user_profiles.display_name || collab.user_profiles.email)
                                                .charAt(0)
                                                .toUpperCase()}
                                        </Avatar>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>
                                            {collab.user_profiles.display_name || collab.user_profiles.email}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#999' }}>
                                            {collab.user_profiles.email}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Select
                                        value={collab.role}
                                        onChange={(role) => handleToggleRole(collab.id, collab.role)}
                                        style={{ width: 100 }}
                                        size="small"
                                        options={[
                                            { value: 'viewer', label: '可阅读' },
                                            { value: 'editor', label: '可编辑' }
                                        ]}
                                    />
                                    <Tooltip title="移除">
                                        <button
                                            onClick={() => handleRemove(collab.id)}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                color: '#ff4d4f',
                                                fontSize: 16
                                            }}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}