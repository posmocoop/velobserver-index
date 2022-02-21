import axios from 'axios';

export default async function getEdges(veloplan) {
  const data = await axios.get(`${process.env.REACT_APP_API}/v1/getEdges${veloplan ? '?veloplan=true' : ''}`);
  return data;
}