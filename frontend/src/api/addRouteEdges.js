import axios from 'axios';

export default async function addRouteEdges(mapping) {
  return (await axios.post(`${process.env.REACT_APP_API}/v1/addRouteEdges`, mapping));
}