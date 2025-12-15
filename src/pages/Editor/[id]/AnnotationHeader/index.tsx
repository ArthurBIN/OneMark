import { useParams } from 'react-router-dom';
import './index.scss';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

type headerParams = {
    title?: string
}

export const AnnotationHeader = ({
    title
}: headerParams) => {
    const params = useParams();

    return (
        <div className="AnnotationHeader">
            <span className='logo'>一标</span>
            <Breadcrumb
                className='title'
                items={[
                    {
                        href: '',
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
                <div className='buttonItem'>
                    <i className='iconfont icon-geren'></i>
                </div>
                <div className='buttonItem'>
                    <i className='iconfont icon-fenxiang'></i>
                </div>
            </div>

        </div>
    )
}