import { useReducer } from "react";

const localStorageService = (() => {

  const getUser = () => { return JSON.parse(localStorage.getItem('user')); }

  return {
    isAdmin: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if(user && (user.role === 'POSMO_TECHNICAL' || user.role === 'POSMO_DATAPROFILER')) {
        return true;
      }
      return false;
    },
    getUser: () => {
      return JSON.parse(localStorage.getItem('user'));
    },
    setUser: (data) => {
      const adjustedData = {
        user_id: data.id,
        role: data.role,
        jwt: data.jwt,
        email: data.email,
      }
      localStorage.setItem('user', JSON.stringify(adjustedData));
    },
    removeUser: () => {
      localStorage.removeItem('user');
    },
    getUserPretestPanel: () => {
      if(!getUser())
        return;
      
      return JSON.parse(localStorage.getItem(`${getUser().user_id}_pretest_panel`));
    },
    setUserPretestPanel: (data) => {
      if(getUser()) {
        localStorage.setItem(`${getUser().user_id}_pretest_panel`, JSON.stringify(data));
      }
    }
  }
} ) ();

export default localStorageService;