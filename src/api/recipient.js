import request from '../utils/request';

export const get = query => {
    return request({
        url: '/recipient',
        method: 'post',
        params: query
    });
};

export const save = data => {
    return request({
        url: '/recipient_save',
        method: 'post',
        data: data
    });
};

export const del = data => {
    return request({
        url: '/recipient_delete',
        method: 'post',
        data: data
    });
};

