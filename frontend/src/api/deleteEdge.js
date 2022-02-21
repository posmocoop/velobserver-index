import axios from 'axios';

export default async function deleteEdge(classifiedEdge) {
  return await axios.post(`${process.env.REACT_APP_API}/v1/deleteEdge`, classifiedEdge);
}