import axios from 'axios';

const API = 'http://localhost:5000/api/common-expenses';

export const runAutoInsert = async () => {
  return axios.post(`${API}/run-autoinsert`, null, {
    headers: {
      'x-api-key': import.meta.env.VITE_ADMIN_API_KEY,
    },
  });
};
