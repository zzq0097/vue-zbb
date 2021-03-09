import request from '../utils/request';

export const get = query => {
    return request({
        url: '/material',
        method: 'post',
        params: query
    });
};

export const save = data => {
    return request({
        url: '/material_save',
        method: 'post',
        data: data
    });
};

export const del = data => {
    return request({
        url: '/material_delete',
        method: 'post',
        data: data
    });
};