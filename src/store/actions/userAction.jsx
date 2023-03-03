import TYPES from 'store/types';

export function saveUser(payload) {  
  localStorage.setItem('email', payload.email);
  localStorage.setItem('name', payload.name);
  return {
    type: TYPES.SAVE_USER,
    payload: payload,
  };
}
