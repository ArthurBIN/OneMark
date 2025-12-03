import './index.scss'
import loginImage from '@/assets/img/login.jpg'
import { Button, Input, Form, message } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import type { FormProps } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

type FieldType = {
  email: string;
  password: string;
};

export const Login = () => {

  const [loading, setLoading] = useState(false)

  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { signInWithPassword } = useAuth();

  useEffect(() => {
    const state = location.state as { registerSuccess?: boolean; message?: string };

    if (state?.registerSuccess) {
      // 显示成功消息
      messageApi.success(state.message || '注册成功!');

      // 清除 location state,避免刷新页面时重复显示
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, messageApi]);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      setLoading(true)
      await signInWithPassword(values.email, values.password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      messageApi.error(`登录失败: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const toRegister = () => {
    navigate('/auth/register')
  }

  return (
    <div className="Login_Page">
      {contextHolder}
      <div className="Login_Form">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item>
            <h2>登录您的账号</h2>
            <p>
              还没有账户？
              <Button
                color="default"
                variant="link"
                style={{ padding: 0 }}
                onClick={toRegister}
              >
                立即创建
                <div className="Login_Form_Icon">
                  <SwapRightOutlined />
                </div>
              </Button>
            </p>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入您的电子邮件' }]}
          >
            <div className='Login_Form_Item'>
              <p>电子邮件</p>
              <Input placeholder="m@example.com" />
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入您的密码' }]}
          >
            <div className='Login_Form_Item'>
              <p>密码</p>
              <Input type='password' />
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              color="default"
              variant="solid"
              className='Login_Form_Commit'
              htmlType="submit"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

      </div>
      <div className="Login_Image">
        <img src={loginImage} alt="Login" />
      </div>
    </div>
  )
};