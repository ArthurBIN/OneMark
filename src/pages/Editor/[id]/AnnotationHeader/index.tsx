import { useParams } from 'react-router-dom';
import './index.scss';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Popover, Tooltip } from 'antd';

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
                <Popover placement="bottomRight" content={Collaborators}>
                    <div className='buttonItem'>
                        <i className='iconfont icon-geren'></i>
                    </div>
                </Popover>

                <div className='buttonItem'>
                    <i className='iconfont icon-fenxiang'></i>
                </div>
            </div>

        </div>
    )
}

const Collaborators = () => {

    return (
        <div className='Collaborators'>
            <div className='Collaborators_Title'>
                协作者
                <Tooltip placement="top" title="邀请" color="black">
                    <button
                        className="Collaborators_Title_Plus"
                    >
                        <PlusOutlined />
                    </button>
                </Tooltip>
            </div>
        </div>
    )
}