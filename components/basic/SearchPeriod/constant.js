// 日期类型配置
export const DATE_TYPE = [{
    name: 'today',
    text: '今天',
    relative: 0 //1表示将来，0表示现在，-1表示过去
}, {
    name: 'yesterday',
    text: '昨天',
    relative: -1 //1表示将来，0表示现在，-1表示过去
}, {
    name: 'tomorrow',
    text: '明天',
    relative: 1 //1表示将来，0表示现在，-1表示过去
}, {
    name: 'lastWeek',
    text: '最近一周',
    relative: -1 //1表示将来，0表示现在，-1表示过去
}, {
    name: 'lastMonth',
    text: '最近一月',
    relative: -1 //1表示将来，0表示现在，-1表示过去
}, {
    name: 'customize',
    text: '自定义',
    relative: null //1表示将来，0表示现在，-1表示过去
}]

// 默认日期格式
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

// 默认可选类型
export const DEFAULT_OPTIONS = ['today', 'yesterday', 'tomorrow', 'lastWeek', 'lastMonth', 'customize'];

// 默认最大时间跨度
export const DEFAULT_MAX_INTERVAL = 35;

// 组件值
export const PARAMS_MAP = [
    'startDate',    //开始日期
    'endDate',      //结束日期
    'removeDate'    //去除日期
];
