import request from '../utils/request';

export const login = data => {
    return request({
        url: '/login_verification',
        method: 'post',
        data: data
    });
};

export const register = data => {
    return request({
        url: '/register',
        method: 'post',
        data: data
    });
};

export const verify = data => {
    return request({
        url: '/ver',
        method: 'get',
        responseType: 'blob',
        params: data
    });
};


