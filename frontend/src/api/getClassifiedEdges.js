import axios from 'axios';

export default async function getClassifiedEdges(user_id) {
  const data = await axios.get(`${process.env.REACT_APP_API}/v1/getClassifiedEdges?user_id=${user_id ? user_id : ''}`);
  return data;
}