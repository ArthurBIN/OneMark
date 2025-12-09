import { Outlet, useLocation, useNavigate } from "react-router-dom";
import './index.scss'
import { FileTextOutlined, SettingOutlined } from "@ant-design/icons";
import { GlowCard } from "@/components/GlowCard";


export const Dashboard = () => {

    const location = useLocation();

    const navigate = useNavigate();

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
                        onClick={() => navigate('/dashboard/settings')}
                        isShow={location.pathname !== '/dashboard/settings'}
                        className={`btnItem ${location.pathname === '/dashboard/settings' ? 'activeBtnItem' : 'noactiveBtnItem'}`}
                    >
                        <SettingOutlined />
                        <span>设置</span>
                    </GlowCard>
                </div>
            </aside>
            <main>
                <Outlet />
            </main>
        </div>
    );
};