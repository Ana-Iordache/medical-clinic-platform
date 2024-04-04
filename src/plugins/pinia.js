import { createPinia } from 'pinia';

// Create a Pinia instance
const pinia = createPinia();

const piniaPlugin = {
  install: (app) => {
    app.use(pinia);
  }
};

export default piniaPlugin;
