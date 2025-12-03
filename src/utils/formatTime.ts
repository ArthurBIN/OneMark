import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

// 自定义更自然的中文表达
export const formatRelativeTime = (date: string | Date): string => {
    const now = dayjs();
    const target = dayjs(date);
    const diffInSeconds = now.diff(target, 'second');

    if (diffInSeconds < 30) return '刚刚';
    if (diffInSeconds < 90) return '1分钟前';

    const diffInMinutes = now.diff(target, 'minute');
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;

    const diffInHours = now.diff(target, 'hour');
    if (diffInHours < 24) return `${diffInHours}小时前`;

    const diffInDays = now.diff(target, 'day');
    if (diffInDays < 7) return `${diffInDays}天前`;

    return target.format('YYYY年M月D日');
};