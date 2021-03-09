import request from '../utils/request';

export const login = query => {
    return request({
        url: '/login',
        method: 'post',
        params: query
    });
};

export const register = data => {
    return request({
        url: '/register',
        method: 'post',
        data: data
    });
};


