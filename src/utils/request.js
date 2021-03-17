import axios from 'axios';
import qs from 'qs';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'https://nu50abw.hn3.mofasuidao.cn/donation/index.php/admin/index',
    // baseURL: 'http://localhost/donation/index.php/admin/index',
    withCredentials: true,
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        if (config.method  === 'post') {
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
