import { Outlet, useLocation, useNavigate } from "react-router-dom";
import './index.scss'
import { FileTextOutlined, SettingOutlined } from "@ant-design/icons";
import { GlowCard } from "@/components/GlowCard";
import { useEffect, useState } from "react";
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from "@/hooks/useAuth";
import type { UserProfile } from "@/types/user";
import { Avatar, Skeleton } from "antd";


export const Dashboard = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const { getUserProfile } = useAuth();

    const [userData, setUserData] = useState<UserProfile | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const getUserInfo = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('未登录');

            const data = await getUserProfile(user.id);
            setUserData(data);
            setLoading(false);
        }

        getUserInfo();
    }, [])

    return (
        <div className="Dashbord">
            <aside>
                <div className="Logo">一标</div>
                <div className="divide"></div>
                <div className="btnBox">
                    <GlowCard
                        onClick={() => navigate('/dashboard/annotations')}
                        isShow={location.pathname !== '/dashboard/annotations'}
                        className={`btnItem ${location.pathname === '/dashboard/annotations' ? 'activeBtnItem' : 'noactiveBtnItem'}`}
                    >
                        <FileTextOutlined />
                        <span>项目</span>
                    </GlowCard>
                    <GlowCard
                        onClick={() => navigate('/dashboard/cooperation')}
                        isShow={location.pathname !== '/dashboard/cooperation'}
                        className={`btnItem ${location.pathname === '/dashboard/cooperation' ? 'activeBtnItem' : 'noactiveBtnItem'}`}
                    >
                        <FileTextOutlined />
                        <span>协作</span>
                    </GlowCard>
                    <GlowCard
                        onClick={() => navigate('/dashboard/settings')}
                        isShow={location.pathname !== '/dashboard/settings'}
                        className={`btnItem ${location.pathname === '/dashboard/settings' ? 'activeBtnItem' : 'noactiveBtnItem'}`}
                    >
                        <SettingOutlined />
                        <span>设置</span>
                    </GlowCard>
                </div>
                <div className="userBox">
                    {
                        loading ?
                            <>
                                <Skeleton.Avatar active shape='circle' style={{ marginRight: 10 }} />
                                <Skeleton.Button active shape='default' />
                            </> :
                            <>
                                <Avatar
                                    style={{
                                        backgroundColor: `${userData?.avatar_bg_color}`,
                                        color: '#fff',
                                        marginRight: 10,
                                        fontSize: 12
                                    }}>
                                    {userData?.display_name?.charAt(0)}
                                </Avatar>
                                <div className="userBox_Email">
                                    <span>{userData?.display_name}</span>
                                    <span>{userData?.email}</span>
                                </div>
                            </>
                    }
                </div>
            </aside>
            <main>
                <Outlet />
            </main>
        </div>
    );
};