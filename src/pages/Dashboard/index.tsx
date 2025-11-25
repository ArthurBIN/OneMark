import { Outlet, useLocation, useNavigate } from "react-router-dom";
import './index.scss'
import { FileTextOutlined, SettingOutlined } from "@ant-design/icons";



export const Dashboard = () => {

    const location = useLocation();

    const navigate = useNavigate();

    return (
        <div className="Dashbord">
            <aside>
                <div className="Logo">简历积木</div>
                <div className="divide"></div>
                <div className="btnBox">
                    <div
                        onClick={() => navigate('/dashboard/resumes')}
                        className={`btnItem ${location.pathname === '/dashboard/resumes' ? 'activeBtnItem' : 'noactiveBtnItem'}`}
                    >
                        <FileTextOutlined />
                        <span>简历</span>
                    </div>
                    <div
                        onClick={() => navigate('/dashboard/settings')}
                        className={`btnItem ${location.pathname === '/dashboard/settings' ? 'activeBtnItem' : 'noactiveBtnItem'}`}
                    >
                        <SettingOutlined />
                        <span>设置</span>
                    </div>
                </div>
            </aside>
            <main>
                <Outlet />
            </main>
        </div>
    );
};