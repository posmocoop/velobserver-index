import axios from 'axios';
import localStorageService from '../services/localStorageService';

export default async function getPersona() {
    const data = await axios.get(`${process.env.REACT_APP_API}/v1/getPersona?user_id=${localStorageService.getUser().user_id}`);
    return data;
  }