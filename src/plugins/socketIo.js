import { io } from 'socket.io-client';
import config from '@/../config.json';

const socket = io(`http://${config.BACKEND_HOST}:${config.BACKEND_PORT}`, {
    withCredentials: true, // Ensures credentials are sent with the request
});

const socketPlugin = {
  install: (app) => {
    app.config.globalProperties.$socket = socket;
    app.provide('socket', socket);
  }
};

export default socketPlugin;
