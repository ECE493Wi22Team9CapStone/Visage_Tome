export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';
export const BACKEND_URL = process.env.BACKEND_URL ? process.env.BACKEND_URL : 'http://localhost:8000';