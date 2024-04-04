import axios from 'axios';
import config from '@/../config.json';

const baseUrlAxios = `http://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

const axiosPlugin = {
    install: (app) => {
        app.config.globalProperties.axios = axios;
        axios.defaults.baseURL = baseUrlAxios;
    }
};

export default axiosPlugin;
