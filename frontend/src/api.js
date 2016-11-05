import axios, { CancelToken } from 'axios';

const api = axios.create({
  baseURL: 'http://dev.backend.team04.vse.handson.pro/api/',//TODO use .env property
});

export function getCancelTokenSource() {
  return CancelToken.source();
}

export default api;
