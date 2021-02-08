import request from '../utils/request';

export const get = query => {
    return request({
        url: '/user',
        method: 'post',
        params: query
    });
};

export const save = data => {
    return request({
        url: '/user_save',
        method: 'post',
        data: data
    });
};

export const del = data => {
    return request({
        url: '/user_delete',
        method: 'post',
        data: data
    });
};

