import axios from 'axios';

export default async function deleteRouteEdge(route_id, ogc_fid) {
  return (await axios.post(`${process.env.REACT_APP_API}/v1/deleteRouteEdge`, { route_id, ogc_fid }));
}