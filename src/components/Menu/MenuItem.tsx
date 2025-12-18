import './MenuItem.scss'

import { Tooltip } from "antd";

export default function MenuItem({
    icon, title, action, isActive = null,
}: { icon?: string, title?: string, action?: () => void, isActive?: (() => boolean) | null }) {

    return (
        <>
            <Tooltip placement="top" title={title} color={'black'}>
                <button
                    className={`menu-item ${isActive && isActive() ? ' is-active' : ''}`}
                    onClick={action}
                >
                    <i className={`ri-${icon} remix`} />
                </button>
            </Tooltip>

        </>
    )
}
