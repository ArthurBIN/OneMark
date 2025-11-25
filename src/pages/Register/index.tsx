import './index.scss'
import loginImage from '@/assets/img/login.jpg'
import { Button, Input, Form, message } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { FormProps } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

type FieldType = {
    email: string;
    password: string;
    confirmPassword: string;
};

export const Register = () => {

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const { signUpWithPassword } = useAuth();

    const [loading, setLoading] = useState(false)

    const toLogin = () => {
        navigate('/auth/login')
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setLoading(true)
            await signUpWithPassword(values.email, values.password);
            navigate('/auth/login', {
                state: {
                    registerSuccess: true,
                    message: '注册成功!请查看邮箱进行验证'
                }
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '注册失败';
            messageApi.error(`注册失败: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

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
                        <h2>创建账户</h2>
                        <p>
                            已有账号？
                            <Button
                                color="default"
                                variant="link"
                                style={{ padding: 0 }}
                                onClick={toLogin}
                            >
                                现在登录
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
                        rules={[
                            ({ required: true, message: '请输入您的密码' }),
                            ({
                                validator(_, value) {
                                    if (value && value.length < 6) {
                                        return Promise.reject(new Error('密码必须大于6位数'));
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <div className='Login_Form_Item'>
                            <p>密码</p>
                            <Input type='password' />
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次密码输入不一致'));
                                },
                            }),
                        ]}
                    >
                        <div className='Login_Form_Item'>
                            <p>再次输入密码</p>
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
                            注册
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