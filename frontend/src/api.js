import axios, { CancelToken } from 'axios';

const api = axios.create({
  baseURL: 'api/',//TODO use .env property
});

export function getCancelTokenSource() {
  return CancelToken.source();
}

export default api;
