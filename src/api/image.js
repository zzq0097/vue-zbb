import request from '../utils/request';

export const img = query => {
    return request({
        url: '/img',
        method: 'get',
        params: query
    });
};
