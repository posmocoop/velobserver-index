/**
 * Djordje Rakonjac
 * Datamap AG, Mar 19, 2021
 */
require('dotenv').config();
const parse = require('pg-connection-string').parse;
const groupBy = require('lodash.groupby');
const config = parse(process.env.DATABASE_URL);
import { Sequelize } from 'sequelize-typescript';
import { Options, QueryTypes } from 'sequelize';
import { Feature } from '@turf/helpers';
import { ClassifiedEdge, Persona, EmbedMapStatistic, VoteEdge, RouteImage } from '..';


const dbConf: Options = {
  username: config.user,
  password: config.password,
  database: config.database,
  host: config.host,
  port: config.port,
  dialect: 'postgres',
}

const sequelize = new Sequelize(dbConf);

const Queries = {
  PROJECT_POINT_TO_EDGE: (lon: number, lat: number, network_ogc_fid: number) => {
    return `
      select st_asgeojson( st_closestpoint( ( select the_geom from network where ogc_fid=${sequelize.escape(network_ogc_fid)} ) , ST_SetSRID(st_makepoint(${sequelize.escape(lon)},${sequelize.escape(lat)}), 4326)) )  geojson
    `
  },
  GET_CLOSEST_EDGE: (lon: number, lat: number, routeId: number) => {
    return `
      SELECT
        the_geom,
        st_asgeojson(the_geom) geojson,
        dist,
        network_ogc_fid
      FROM
          (SELECT
              n.the_geom,
              ST_Distance(n.the_geom, ST_SetSRID(st_makepoint(${sequelize.escape(lon)},${sequelize.escape(lat)}), 4326), false
          ) AS dist,
          network_ogc_fid
          FROM
              network n join network_route_edges nre on n.ogc_fid = nre.network_ogc_fid
              join network_routes nr on nre.network_routes_id = nr.id where nr.id = ${sequelize.escape(routeId)}) AS edges_with_distances
      ORDER BY
          dist
      LIMIT 1 
    `
  },
  ADD_ROUTE_EDGES: (m: any) => {
    return `
      INSERT INTO network_route_edges(network_routes_id, network_ogc_fid, status, type, created_at) VALUES(${sequelize.escape(m.route_id)}, ${sequelize.escape(m.ogc_fid)}, ${sequelize.escape(m.status)}, ${sequelize.escape(m.type)},'${new Date(m.created_at).toISOString()}')
    `
  },
  NETWORK_ROUTES: () => {
    return `
      SELECT * FROM network_routes;
    `
  },
  NETWORK_NEAREST_EDGES: (lonLat: number[], alternatives: number): string => {
    return `
       SELECT * from network_nearest_edges(${sequelize.escape(lonLat[0])}, ${sequelize.escape(lonLat[1])}, ${sequelize.escape(alternatives) || 1});
     `
  },
  NETWORK_EDGES: (veloplan?: boolean): string => {
    // return `SELECT st_asgeojson(the_geom) geojson, st_length(the_geom, true) length_m, * from network`
    return `
    SELECT st_asgeojson(the_geom) geojson, st_length(the_geom, true) length_m, n.ogc_fid ogc_fid, n.name, nr."name" route_name, nr."visible" route_visible, nr."default" route_default, nr."direction" route_direction, nre.network_routes_id route_id, nre.created_at created_at, nre."status" "status"  from network n ${veloplan ? '' : 'left'} join network_route_edges nre on n.ogc_fid = nre.network_ogc_fid ${veloplan ? '' : 'left'} join network_routes nr on nre.network_routes_id = nr.id;`
  },
  NETWORK_USER_CLASSIFIED_EDGES: (user_id: string): string => {
    return `SELECT st_asgeojson(the_geom) geojson, st_length(the_geom, true) length_m, * FROM network JOIN network_classification ON network.ogc_fid = network_classification.network_ogc_fid and network_classification.user_id = '${sequelize.escape(user_id)}' order by created_at desc`
  },
  NETWORK_ALL_USERS_CLASSIFIED_EDGES: (): string => {
    return 'SELECT st_asgeojson(the_geom) geojson, st_length(the_geom, true) length_m, * FROM network JOIN network_classification ON network.ogc_fid = network_classification.network_ogc_fid left join network_route_edges_images img on img.id = network_classification.fk_network_route_edges_images_id order by network_classification.created_at desc'
  },
  CLASSIFY_EDGES: (classifiedEdges: ClassifiedEdge[]) => {

    const insert = [];
    for (let i = 0; i < classifiedEdges.length; i++) {
      const classifiedEdge = classifiedEdges[i];
      insert.push(`(DEFAULT, ${sequelize.escape(classifiedEdge.network_ogc_fid)}, '${sequelize.escape(classifiedEdge.user_id)}', ${sequelize.escape(classifiedEdge.safety)}, ${sequelize.escape(classifiedEdge.conflict)}, ${sequelize.escape(classifiedEdge.attractiveness)}, '${classifiedEdge.city}', '${classifiedEdge.country_code}', '${classifiedEdge.country_name}', ${classifiedEdge.lat}, ${classifiedEdge.lon}, '${classifiedEdge.region_code}', '${classifiedEdge.region_name}', '${classifiedEdge.postcode}', '${classifiedEdge.ip}', NOW() )`)
    }

    return `
      INSERT INTO
      network_classification(id, network_ogc_fid, user_id, safety, conflict, attractiveness, city, country_code, country_name, lat, lon, region_code, region_name, postcode, ip, created_at)
      values ${insert.join(',')}
    `
  },
  DELETE_EDGE: (classifiedEdge: ClassifiedEdge) => {
    return `
      DELETE FROM network_classification WHERE id = ${sequelize.escape(classifiedEdge.id || '')} and user_id= '${sequelize.escape(classifiedEdge.user_id)}'
     `
  },
  DELETE_ROUTE_EDGE: (routeEdge: any) => {
    return `
      DELETE FROM network_route_edges WHERE network_routes_id = ${routeEdge.route_id} AND network_ogc_fid = ${routeEdge.ogc_fid}
     `
  },
  UPDATE_ROUTE_VISIBILITY: (data: { route_id: number, value: boolean }) => {
    const { route_id, value } = data;
    return `
        UPDATE network_routes SET visible = ${!!value ? 1 : 0} WHERE id = ${sequelize.escape(route_id)};
      `;
  },
  SUBSCRIBE: (subscription: { type: string; email: string; }): string => {
    return `
      INSERT INTO subscriptions(type, email, created_at, updated_at) VALUES('${subscription.type}', '${sequelize.escape(subscription.email)}', NOW(), NOW())
     `
  },
  GET_PERSONA: (user_id: string): string => {
    return `
        SELECT * from personas where user_id = '${sequelize.escape(user_id)}' 
      `
  },
  ADD_PERSONA: (persona: Persona): string => {
    const user_id = persona.user.id;

    const data: any = persona;
    delete data.user;

    const insert = [];
    for (let topic in data) {

      let values = data[topic];

      for (let key in values) {
        insert.push(`('${sequelize.escape(user_id)}', '${sequelize.escape(topic)}', '${sequelize.escape(key)}', ${values[key] === false ? 0 : values[key] === true ? 1 : sequelize.escape(values[key])})`)
      }
    }
    return `
       INSERT INTO personas(user_id, topic, key, value) VALUES ${insert.join(',')}
    `
  },
  ADD_DATA_FOR_MAP_DOWNLOAD_STATISTIC: (statistic: { pageSize: string, pageOrientation: string, format: string, dpi: number }): string => {
    return `
     INSERT INTO statistics_map_download(page_size, page_orientation, format, dpi, created_at, updated_at) VALUES('${sequelize.escape(statistic.pageSize)}', '${sequelize.escape(statistic.pageOrientation)}', '${sequelize.escape(statistic.format)}', ${sequelize.escape(statistic.dpi)}, NOW(), NOW())
    `
  },
  ADD_DATA_FOR_MAP_ENBED_STATISTIC: (embedMapStatistic: EmbedMapStatistic) => {
    return `
        INSERT INTO
        statistics_map_embed(created_at, updated_at, country_code, country_name, city, region_code, region_name, lat, lon, postcode, ip_address)
        SELECT NOW(), NOW(), '${embedMapStatistic.country_code}', '${embedMapStatistic.country_name}', '${embedMapStatistic.city}', '${embedMapStatistic.region_code}', '${embedMapStatistic.region_name}', ${embedMapStatistic.lat}, ${embedMapStatistic.lon}, '${embedMapStatistic.postcode}', '${embedMapStatistic.ip_address}'
        WHERE NOT EXISTS (SELECT 1 FROM statistics_map_embed WHERE ip_address='${embedMapStatistic.ip_address}')
      `
  },
  NETWORK_EDGES_FOR_VOTING: (): string => {
    return `
      SELECT st_asgeojson(the_geom) geojson, st_length(the_geom, true) length_m, n.ogc_fid ogc_fid, n.name, nr."name" route_name, nre.network_routes_id route_id, nre.created_at created_at, nre."status" "status", img.id as image_id, img.image_name as image_name, img.image_url, img.exif_datetime, img.street_name, img.city, img.country_code  from network n join network_route_edges nre on n.ogc_fid = nre.network_ogc_fid join network_routes nr on nre.network_routes_id = nr.id left join network_route_edges_images img on img.network_ogc_fid = n.ogc_fid;`
  },
  IMAGES_FOR_VOTING: (): string => {
    return `
      SELECT st_asgeojson(the_geom) geojson, st_length(the_geom, true) length_m, n.ogc_fid ogc_fid, n.name, img.created_at, img.id as image_id, img.image_name as image_name, img.image_url, img.exif_datetime, img.street_name, img.city, img.country_code, img.priority, img.exif_lat, img.exif_lon, img.pin_lat, img.pin_lon, img.fk_route_id as route_id from network n join network_route_edges_images img on img.network_ogc_fid = n.ogc_fid;`
  },
  VOTE_EDGES: (votedEdges: VoteEdge[]) => {
    const insert = [];
    for (let i = 0; i < votedEdges.length; i++) {
      const votedEdge = votedEdges[i];
      insert.push(`(${sequelize.escape(votedEdge.network_ogc_fid)}, '${sequelize.escape(votedEdge.user_id)}', ${sequelize.escape(votedEdge.updating_value)}, '${votedEdge.city}', '${votedEdge.country_code}', '${votedEdge.country_name}', ${votedEdge.lat}, ${votedEdge.lon}, '${votedEdge.region_code}', '${votedEdge.region_name}', '${votedEdge.postcode}', '${votedEdge.ip}', NOW(), ${votedEdge.image_id} )`)
    }

    return `
        INSERT INTO
        network_classification(network_ogc_fid, user_id, ${sequelize.escape(votedEdges[0].updating_field)}, city, country_code, country_name, lat, lon, region_code, region_name, postcode, ip, created_at, fk_network_route_edges_images_id)
        values ${insert.join(',')}
      `
  },
  ADD_ROUTE_IMAGES: (routeImages: RouteImage[]) => {
    const insert = [];
    for (let i = 0; i < routeImages.length; i++) {
      const routeImage = routeImages[i];
      insert.push(`(${routeImage.network_ogc_fid}, '${routeImage.image_name}', ${routeImage.image_url ? `'${routeImage.image_url}'` : null}, NOW(), NOW(), ${routeImage.fk_route_id}, ${routeImage.exif_datetime ? `'${routeImage.exif_datetime}'` : null}, ${routeImage.exif_lat || null}, ${routeImage.exif_lon || null}, ${routeImage.pin_lat || null}, ${routeImage.pin_lon || null}, ${routeImage.street_name ? `'${routeImage.street_name}'` : null}, ${routeImage.street_number ? `'${routeImage.street_number}'` : null}, ${routeImage.neighborhood ? `'${routeImage.neighborhood}'` : null}, ${routeImage.city ? `'${routeImage.city}'` : null}, ${routeImage.geoid ? `'${routeImage.geoid}'` : null}, ${routeImage.country_code ? `'${routeImage.country_code}'` : null} )`)
    }

    return `
        INSERT INTO
        network_route_edges_images(network_ogc_fid, image_name, image_url, created_at, updated_at, fk_route_id, exif_datetime, exif_lat, exif_lon, pin_lat, pin_lon, street_name, street_number, neighborhood, city, geoid, country_code)
        values ${insert.join(',')}
      `
  },
  GET_ALL_USER_VOTES: (userId: string): string => {
    return `
      SELECT nc.id, nc.network_ogc_fid, user_id, nc.created_at, nc.updated_at, safety, conflict, attractiveness, global_vote, fk_network_route_edges_images_id as image_id, ni.image_url, ni.image_name from network_classification nc LEFT JOIN network_route_edges_images ni ON fk_network_route_edges_images_id = ni.id where user_id = '${sequelize.escape(userId)}';`
  },
}

export const getNearestEdges = async (lonLat: number[], alternatives: number) => {
  try {
    const q: Array<any> = await sequelize.query(Queries.NETWORK_NEAREST_EDGES(lonLat, alternatives), { type: QueryTypes.SELECT });
    return q.map((select: any) => { return { type: 'Feature', geometry: JSON.parse(select.geojson), properties: { ogc_fid: select.ogc_fid, name: select.name, velo: select.velo, veloweg: select.veloweg, fuss: select.fuss } } as Feature });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const getNetworkRoutes = async () => {
  try {
    const q: Array<any> = await sequelize.query(Queries.NETWORK_ROUTES(), { type: QueryTypes.SELECT });
    return q;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const getEdges = async (veloplan?: boolean) => {
  try {
    const q: Array<any> = await sequelize.query(Queries.NETWORK_EDGES(veloplan), { type: QueryTypes.SELECT });
    return q.map((select: any) => { return { type: 'Feature', geometry: JSON.parse(select.geojson), properties: { ogc_fid: select.ogc_fid, length_m: select.length_m, length_km: select.length_m / 1000.0, name: select.name, route_name: select.route_name, route_visible: select.route_visible, route_default: select.route_default, route_direction: select.route_direction, status: select.status, type: select.type, created_at: select.created_at, route_id: select.route_id } } as Feature });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const updateRouteVisibility = async (data: { route_id: number, value: boolean }) => {
  try {
    const q: Array<any> = await sequelize.query(Queries.UPDATE_ROUTE_VISIBILITY(data), { type: QueryTypes.UPDATE });
    return 1;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

export const addRouteEdges = async (mapping: any) => {
  try {
    for (let i = 0; i < mapping.length; i++) {
      await sequelize.query(Queries.ADD_ROUTE_EDGES(mapping[i]));
    }
    const q: Array<any> = await sequelize.query(Queries.NETWORK_EDGES(), { type: QueryTypes.SELECT });
    return q.map((select: any) => { return { type: 'Feature', geometry: JSON.parse(select.geojson), properties: { ogc_fid: select.ogc_fid, length_m: select.length_m, length_km: select.length_m / 1000.0, name: select.name, route_name: select.route_name, status: select.status, type: select.type, created_at: select.created_at, route_id: select.route_id } } as Feature });
  } catch (err) {
    const q: Array<any> = await sequelize.query(Queries.NETWORK_EDGES(), { type: QueryTypes.SELECT });
    return q.map((select: any) => { return { type: 'Feature', geometry: JSON.parse(select.geojson), properties: { ogc_fid: select.ogc_fid, length_m: select.length_m, length_km: select.length_m / 1000.0, name: select.name, route_name: select.route_name, status: select.status, type: select.type, created_at: select.created_at, route_id: select.route_id } } as Feature });
  }
}

export const getClassifiedEdges = async (user_id: string) => {
  try {
    const q: Array<any> = await sequelize.query(Queries.NETWORK_USER_CLASSIFIED_EDGES(user_id), { type: QueryTypes.SELECT });

    const ogc_fids: any = {}
    const features: Array<Feature> = [];
    q.forEach((select: any) => {
      if (!ogc_fids[select.ogc_fid]) {
        features.push(
          { type: 'Feature', geometry: JSON.parse(select.geojson), properties: { id: select.id, ogc_fid: select.network_ogc_fid, user_id: select.user_id, width: select.width, safety: parseFloat(select.safety), conflict: parseFloat(select.conflict), attractiveness: parseFloat(select.attractiveness) } } as Feature
        )
        ogc_fids[select.ogc_fid] = true;
      }
    });

    return features;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const getAllUsersClassifiedEdges = async () => {
  try {
    const q: Array<any> = await sequelize.query(Queries.NETWORK_ALL_USERS_CLASSIFIED_EDGES(), { type: QueryTypes.SELECT });

    const user_answers: any = {}   // key is ogcFid, value is object where key is user id and value is user latest answer
    const features: Array<Feature> = [];
    q.forEach((select: any) => {
      const newFeature = {
        type: 'Feature',
        geometry: JSON.parse(select.geojson),
        properties: {
          id: select.id,
          ogc_fid: select.ogc_fid,
          user_id: select.user_id,
          width: select.width,
          safety: select.safety ? parseFloat(select.safety) : null,
          safety_created_at: select.created_at,
          conflict: select.conflict ? parseFloat(select.conflict) : null,
          conflict_created_at: select.created_at,
          attractiveness: select.attractiveness ? parseFloat(select.attractiveness) : null,
          attractiveness_created_at: select.created_at,
          global_vote: select.global_vote ? parseFloat(select.global_vote) : null,
          global_vote_created_at: select.created_at,
          image_url: select.image_url,
        }
      } as Feature

      if (select.image_url) {
        return
      }

      if (!user_answers[select.ogc_fid]) {
        // new edge
        user_answers[select.ogc_fid] = {
          [select.user_id]: newFeature,
        }
      } else {
        // existing edge
        const currentOgcFid = user_answers[select.ogc_fid]
        if (!currentOgcFid[select.user_id]) {
          // new user
          currentOgcFid[select.user_id] = newFeature
        } else {
          const userData = currentOgcFid[select.user_id]
          // existing user - save only lastly voted data
          const savedSafety = userData.properties.safety
          const savedSafetyDate = userData.properties.safety_created_at
          const isCurrentSafetyAfterSaved = select.created_at > savedSafetyDate

          if (select.safety && (!savedSafety || isCurrentSafetyAfterSaved)) {
            userData.properties.safety = parseFloat(select.safety)
            userData.properties.safety_created_at = select.created_at
          }

          const savedConflict = userData.properties.conflict
          const savedConflictDate = userData.properties.conflict_created_at
          const isCurrentConflictAfterSaved = select.created_at > savedConflictDate

          if (select.conflict && (!savedConflict || isCurrentConflictAfterSaved)) {
            userData.properties.conflict = parseFloat(select.conflict)
            userData.properties.conflict_created_at = select.created_at
          }

          const savedAttractiveness = userData.properties.attractiveness
          const savedAttractivenessDate = userData.properties.attractiveness_created_at
          const isCurrentAttractivenessAfterSaved = select.created_at > savedAttractivenessDate

          if (select.attractiveness && (!savedAttractiveness || isCurrentAttractivenessAfterSaved)) {
            userData.properties.attractiveness = parseFloat(select.attractiveness)
            userData.properties.attractiveness_created_at = select.created_at
          }

          const savedGlobalVote = userData.properties.global_vote
          const savedGlobalVoteDate = userData.properties.global_vote_created_at
          const isCurrentGlobalVoteAfterSaved = select.created_at > savedGlobalVoteDate

          if (select.global_vote && (!savedGlobalVote || isCurrentGlobalVoteAfterSaved)) {
            userData.properties.global_vote = parseFloat(select.global_vote)
            userData.properties.global_vote_created_at = select.created_at
          }
        }
      }
    });

    // get average votes of all users
    for (const ogcFid in user_answers) {
      const currentOgcFidData = user_answers[ogcFid]

      let geometry = null
      let id = null
      let width = null
      let safetySum = null
      let safetyCount = 0
      let conflictSum = null
      let conflictCount = 0
      let attractivenessSum = null
      let attractivenessCount = 0
      let globalVoteSum = null
      let globalVoteCount = 0

      for (const userId in currentOgcFidData) {
        const userData = currentOgcFidData[userId]
        if (!geometry) {
          geometry = userData.geometry
          id = userData.properties.id
          width = userData.properties.width
        }

        if (userData.properties.safety) {
          safetySum = (safetySum || 0) + userData.properties.safety
          safetyCount++
        }

        if (userData.properties.conflict) {
          conflictSum = (conflictSum || 0) + userData.properties.conflict
          conflictCount++
        }

        if (userData.properties.attractiveness) {
          attractivenessSum = (attractivenessSum || 0) + userData.properties.attractiveness
          attractivenessCount++
        }

        if (userData.properties.global_vote) {
          globalVoteSum = (globalVoteSum || 0) + userData.properties.global_vote
          globalVoteCount++
        }
      }

      const safety = safetySum ? safetySum / safetyCount : null
      const conflict = conflictSum ? conflictSum / conflictCount : null
      const attractiveness = attractivenessSum ? attractivenessSum / attractivenessCount : null
      const globalVote = globalVoteSum ? globalVoteSum / globalVoteCount : null

      if (globalVote) {
        // show only global votes
        features.push({
          type: 'Feature',
          geometry: geometry,
          properties: {
            id: id,
            ogc_fid: +ogcFid,
            width: width,
            safety: safety,
            conflict: conflict,
            attractiveness: attractiveness,
            globalVote: globalVote,
          }
        } as Feature)
      }
    }

    return features;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const classifyEdges = async (classifiedEdges: ClassifiedEdge[]) => {
  try {
    const q: any = await sequelize.query(Queries.CLASSIFY_EDGES(classifiedEdges), { type: QueryTypes.INSERT });
    console.log(q);
    return q;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const deleteEdge = async (classifiedEdge: ClassifiedEdge) => {
  try {
    const q: any = await sequelize.query(Queries.DELETE_EDGE(classifiedEdge), { type: QueryTypes.DELETE });
    console.log(q);
    return q;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const deleteRouteEdge = async (routeEdge: any) => {
  try {
    const q: any = await sequelize.query(Queries.DELETE_ROUTE_EDGE(routeEdge), { type: QueryTypes.DELETE });
    console.log(q);
    return q;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const subscribe = async (subscription: { type: string; email: string; }) => {
  try {
    const q: any = await sequelize.query(Queries.SUBSCRIBE(subscription), { type: QueryTypes.INSERT });
    return subscription;
  } catch (err) {
    throw new Error('subscription error');
  }
}

export const addDataForMapDownloadStatistic = async (statistic: { pageSize: string, pageOrientation: string, format: string, dpi: number }) => {
  try {
    const q: any = await sequelize.query(Queries.ADD_DATA_FOR_MAP_DOWNLOAD_STATISTIC(statistic), { type: QueryTypes.INSERT });
    return statistic;
  } catch (err) {
    console.log('err', err)
    throw new Error('statistic error');
  }
}


export const addDataForMapEmbedStatistic = async (embedMapStatistic: EmbedMapStatistic) => {
  try {
    const q: any = await sequelize.query(Queries.ADD_DATA_FOR_MAP_ENBED_STATISTIC(embedMapStatistic), { type: QueryTypes.INSERT });
    console.log(q);
    return q;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const getPersona = async (user_id: string) => {
  try {
    const q: any = await sequelize.query(Queries.GET_PERSONA(user_id), { type: QueryTypes.SELECT });
    return q.map((select: any) => { return { user_id: select.user_id, topic: select.topic, key: select.key, value: select.value, created_at: select.created_at } });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const addPersona = async (persona: Persona) => {
  try {
    const q: any = await sequelize.query(Queries.ADD_PERSONA(persona), { type: QueryTypes.INSERT });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const getEdgesForVoting = async () => {
  try {
    const q: Array<any> = await sequelize.query(Queries.NETWORK_EDGES_FOR_VOTING(), { type: QueryTypes.SELECT });
    return q.map((select: any) => { return { type: 'Feature', geometry: JSON.parse(select.geojson), properties: { ogc_fid: select.ogc_fid, length_m: select.length_m, length_km: select.length_m / 1000.0, name: select.name, route_name: select.route_name, status: select.status, type: select.type, created_at: select.created_at, route_id: select.route_id, image_url: select.image_url, image_id: select.image_id, image_name: select.image_name, exif_datetime: select.exif_datetime, street_name: select.street_name, city: select.city, country_code: select.country_code } } as Feature });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const getImagesForVoting = async () => {
  try {
    const q: Array<any> = await sequelize.query(Queries.IMAGES_FOR_VOTING(), { type: QueryTypes.SELECT });
    return q.map((select: any) => { return { type: 'Feature', geometry: JSON.parse(select.geojson), properties: { ogc_fid: select.ogc_fid, length_m: select.length_m, length_km: select.length_m / 1000.0, created_at: select.created_at, route_id: select.route_id, image_url: select.image_url, image_id: select.image_id, image_name: select.image_name, exif_datetime: select.exif_datetime, street_name: select.street_name, city: select.city, country_code: select.country_code, priority: select.priority, exif_lat: select.exif_lat, exif_lon: select.exif_lon, pin_lat: select.pin_lat, pin_lon: select.pin_lon } } as Feature });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const voteEdges = async (votedEdges: VoteEdge[]) => {
  try {
    const q: any = await sequelize.query(Queries.VOTE_EDGES(votedEdges), { type: QueryTypes.INSERT });
    console.log(q);
    return q;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const addRouteImages = async (routeImages: RouteImage[]) => {
  try {
    const q: any = await sequelize.query(Queries.ADD_ROUTE_IMAGES(routeImages), { type: QueryTypes.INSERT });
    console.log(q);
    return q;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const getAllUserVotes = async (userId: string) => {
  try {
    const q: Array<any> = await sequelize.query(Queries.GET_ALL_USER_VOTES(userId), { type: QueryTypes.SELECT });
    return q
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const projectPointToEdge = async (lon: number, lat: number, routeId: number) => {
  try {
    const q: Array<any> = await sequelize.query(Queries.GET_CLOSEST_EDGE(lon, lat, routeId), { type: QueryTypes.SELECT });
    if (!q[0]) { return {}; }

    const { network_ogc_fid } = q[0];
    const projection: Array<any> = await sequelize.query(Queries.PROJECT_POINT_TO_EDGE(lon, lat, network_ogc_fid), { type: QueryTypes.SELECT });
    const geojson = JSON.parse(projection[0].geojson);

    return {
      network_ogc_fid,
      lon,
      lat,
      routeId,
      projected_lon: geojson.coordinates[0],
      projected_lat: geojson.coordinates[1],
    }
  } catch (err) {
    console.log(err)
    return {};
  }
}
