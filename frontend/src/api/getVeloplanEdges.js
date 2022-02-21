import axios from 'axios';

export default async function getVeloplanEdges() {
  const data = await axios.get(`./map/zurich_vorzugsrouten_2021-10-18.geojson`);
  return data;
}