import axios from 'axios';

export default async function classifyEdges(classifiedEdges) {
  return (await axios.post(`${process.env.REACT_APP_API}/v1/classifyEdges`, classifiedEdges));
}