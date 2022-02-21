import axios from 'axios';
import { Component } from 'react';
import jwt_decode from "jwt-decode";
import localStorageService from '../services/localStorageService';

axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('user')) {
      const jwt = JSON.parse(localStorage.getItem('user')).jwt;
      config.headers['Authorization'] = jwt;
    }

    return config;
  },
  error => {
    return Promise.reject(error)
  });

axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && error.response.message_id === 31 && !originalRequest._retry) {
      const user = JSON.parse(localStorage.getItem('user'));
      originalRequest._retry = true;
      const ID_URL = process.env.REACT_APP_ID.split('?')[0];
      try {
        const response = await axios.post(`${ID_URL}api/auth/refresh-token`, {}, {
          headers: { Authorization: user.jwt }
        });
        const { data } = response.data;
        axios.defaults.headers.common['Authorization'] = data.token;
        const token = jwt_decode(data.token);
        localStorage.setItem('user', JSON.stringify({
          user_id: token.sub,
          role: token.role,
          exp: token.exp,
          jwt: data.token,
        }));
        return await axios(originalRequest);
      } catch (err) {
        window.location.href = '/login';
      }
    } else if(error.response.status === 401) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  });

export default function Authentication(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      const user = localStorageService.getUser();
      if (!user) {
        window.location.href = '/login';
      } else {
        try {
          if (user.exp < new Date().getTime()) {
            window.location.href = '/login'
          }

        } catch (err) {
          window.location.href = '/login'
        }
      }

    }


    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}