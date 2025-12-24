import { ActiveBox } from '@/components/ActiveBox';
import './index.scss'
import { MyButton } from '@/components/MyButton';
import { useState } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { MyModal } from '@/components/MyModal';
import { useAuth } from '@/hooks/useAuth';

export const Settings = () => {

    const [isOutLogin, setIsOutLogin] = useState(false);
    const [outLoginLoading, setOutLoginLoading] = useState(false);

    const { signOut } = useAuth();

    return (
        <div className='Settings'>
            <ActiveBox>
                <h1>设置</h1>
                <MyButton
                    backgroundColor='#F42F5C'
                    style={{ marginTop: 25, width: 200 }}
                    onClick={() => setIsOutLogin(true)}
                >
                    退出登录
                </MyButton>
            </ActiveBox>


            {/* 推出登录 */}
            <MyModal
                isOpen={isOutLogin}
                onClose={() => { setIsOutLogin(false); }}
                title="退出登录"
                titleIcon={<LogoutOutlined />}
                buttonText="确定"
                loading={outLoginLoading}
                buttonColor="#F42F5C"
                onButtonClick={signOut}
            >
                确认退出登录？
            </MyModal>

        </div>
    );
};
