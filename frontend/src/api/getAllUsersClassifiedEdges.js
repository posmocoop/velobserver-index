import axios from 'axios';

export default async function getAllUsersClassifiedEdges() {
  const data = await axios.get(`${process.env.REACT_APP_API}/v1/getAllUsersClassifiedEdges`);
  return data;
}