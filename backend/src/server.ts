/**
 * Djordje Rakonjac
 * Datamap AG, Mar 18, 2021
 */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { uploadFile, getFileStream } = require('./s3')
import axios from 'axios';

import { Feature, FeatureCollection } from '@turf/helpers';
import { Application, NextFunction, Request, Response } from 'express';
import validator from 'validator';
import { getNetworkRoutes, subscribe, deleteEdge, classifyEdges, getClassifiedEdges, getAllUsersClassifiedEdges, getEdges, getNearestEdges, addRouteEdges, deleteRouteEdge, addPersona, addDataForMapDownloadStatistic, addDataForMapEmbedStatistic, getEdgesForVoting, getImagesForVoting, voteEdges, getAllUserVotes, updateRouteVisibility, addRouteImages, projectPointToEdge, getPersona } from './db';
import { Authentication } from './middlewares/authentication';
import { Private } from './middlewares/private';
import { ProfilerOrExpert } from './middlewares/profiler_or_expert';
import { Error } from './middlewares/error';
import { SecurityHeaders } from './middlewares/security_headers';
import { ClassifiedEdge, EmbedMapStatistic, VoteEdge, RouteImage } from '.';


const app: Application = express();
app.use(bodyParser.json({ limit: '100mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
  app.options('*', cors())
} else {
  const whitelist = [
    'https://velobserver.datamap.io',
    'https://velobserverplan.datamap.io',
    'https://velobserver.posmo.coop',
    'https://velobserver.ch',
    'https://www.velobserver.ch',
    'https://index.velobserver.ch',
  ]

  app.use(SecurityHeaders);
  app.use(cors({ origin: whitelist }));
  // enable pre-flight requests
  app.options('*', cors());
}

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send({
    message: 'Welcome to velobserver!'
  })
})

app.get('/v1/getNearestEdges', [Authentication], async (req: Request, res: Response, next: NextFunction) => {

  const lon: number = parseFloat(req.query.lon as string);
  const lat: number = parseFloat(req.query.lat as string);
  const alternatives: number = parseInt(req.query.alternatives as string);

  if (isNaN(lon) || isNaN(lat) || isNaN(alternatives)) {
    return res.status(422).send({ message: 'Wrong params.' });
  }

  const dbResult: Array<Feature> = await getNearestEdges([lon, lat], alternatives);
  const result: FeatureCollection = {
    type: 'FeatureCollection',
    features: dbResult
  }

  res.send(result);
})

app.get('/v1/getNetworkRoutes', [Authentication], async (req: Request, res: Response, next: NextFunction) => {
  const dbResult: Array<Feature> = await getNetworkRoutes();
  res.send(dbResult);
})

app.get('/v1/getClassifiedEdges', [Authentication, Private], async (req: Request, res: Response, next: NextFunction) => {

  const user_id: string = req.query.user_id as string;
  const dbResult: Array<Feature> = await getClassifiedEdges(user_id);
  const result: FeatureCollection = {
    type: 'FeatureCollection',
    features: dbResult
  }

  res.send(result);
})

app.get('/v1/getAllUsersClassifiedEdges', [Authentication], async (req: Request, res: Response, next: NextFunction) => {
  const dbResult: Array<Feature> = await getAllUsersClassifiedEdges();
  const result: FeatureCollection = {
    type: 'FeatureCollection',
    features: dbResult
  }

  res.send(result);
})

app.get('/v1/getEdges', [Authentication], async (req: Request, res: Response, next: NextFunction) => {
  const veloplan: boolean = req.query.veloplan ? true : false;
  const dbResult: Array<Feature> = await getEdges(veloplan);
  const result: FeatureCollection = {
    type: 'FeatureCollection',
    features: dbResult
  }

  res.send(result);
})

app.get('/v1/getEdgesForVoting', [Authentication], async (req: Request, res: Response, next: NextFunction) => {
  const dbResult: Array<Feature> = await getEdgesForVoting();
  const result: FeatureCollection = {
    type: 'FeatureCollection',
    features: dbResult
  }

  res.send(result);
})

app.get('/v1/getImagesForVoting', [Authentication], async (req: Request, res: Response, next: NextFunction) => {
  const dbResult: Array<Feature> = await getImagesForVoting();
  const result: FeatureCollection = {
    type: 'FeatureCollection',
    features: dbResult
  }

  res.send(result);
})

app.get('/v1/getAllUserVotes', [Authentication], async (req: Request, res: Response, next: NextFunction) => {
  const userId: string = req.query.user_id as string;
  const dbResult: Array<any> = await getAllUserVotes(userId);
  res.send(dbResult);
})

app.post('/v1/updateRouteVisibility', [Authentication, ProfilerOrExpert], async (req: Request, res: Response, next: NextFunction) => {
  const { route_id, value } = req.body;
  if (isNaN(route_id)) { res.status(422).send({ message: 'Wrong input.' }) }

  const dbResult: any = await updateRouteVisibility({ route_id, value });
  res.send({ data: dbResult });
})

app.post('/v1/addRouteEdges', [Authentication, ProfilerOrExpert], async (req: Request, res: Response, next: NextFunction) => {

  if (!Array.isArray(req.body)) { return res.status(422).send({ message: 'Wrong input.' }) }

  const dbResult: any = await addRouteEdges(req.body);
  const result: FeatureCollection = {
    type: 'FeatureCollection',
    features: dbResult
  }
  res.send(result);
})

app.post('/v1/classifyEdges', [Authentication, Private], async (req: Request, res: Response, next: NextFunction) => {

  const { properties, features } = req.body;
  if (!properties) { res.status(422).send({ message: 'Missing params.' }) }

  const { user_id, safety, conflict, attractiveness } = properties;
  if (!validator.isUUID(user_id) || isNaN(safety) || isNaN(conflict) || isNaN(attractiveness) || !features.length) { return res.status(422).send({ message: 'Wrong input.' }) }

  try {
    const ipToGeo = await axios.get(`http://api.ipstack.com/${req.headers['x-forwarded-for'] || req.socket.remoteAddress || null}?access_key=${process.env.IPSTACK_API_KEY}`);
    const { city, latitude, longitude, country_code, country_name, region_code, region_name, zip } = ipToGeo.data;
    const toClassify: ClassifiedEdge[] = features.map((feature: Feature) => {
      return {
        user_id,
        network_ogc_fid: feature.properties && feature.properties.ogc_fid,
        safety,
        conflict,
        attractiveness,
        city,
        country_code,
        country_name,
        region_code,
        region_name,
        lat: latitude,
        lon: longitude,
        postcode: zip,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
      } as ClassifiedEdge;
    })

    await classifyEdges(toClassify);

    res.send({ message: 'OK' });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ message: 'Something went wrong.' })
  }
})

app.post('/v1/voteEdges', [Authentication, Private], async (req: Request, res: Response, next: NextFunction) => {

  const { properties, features } = req.body;
  if (!properties) { res.status(422).send({ message: 'Missing params.' }) }

  const { user_id, updating_field, updating_value } = properties;
  const isUpdatingFieldValid = updating_field === 'safety' || updating_field === 'conflict' || updating_field === 'attractiveness' || updating_field === 'global_vote'
  if (!validator.isUUID(user_id) || isNaN(updating_value) || !features.length || !isUpdatingFieldValid) { return res.status(422).send({ message: 'Wrong input.' }) }

  try {
    const ipToGeo = await axios.get(`http://api.ipstack.com/${req.headers['x-forwarded-for'] || req.socket.remoteAddress || null}?access_key=${process.env.IPSTACK_API_KEY}`);
    const { city, latitude, longitude, country_code, country_name, region_code, region_name, zip } = ipToGeo.data;
    const toClassify: VoteEdge[] = features.map((feature: Feature) => {
      return {
        user_id,
        image_id: feature.properties?.image_id,
        network_ogc_fid: feature.properties && feature.properties.ogc_fid,
        updating_field,
        updating_value,
        city,
        country_code,
        country_name,
        region_code,
        region_name,
        lat: latitude,
        lon: longitude,
        postcode: zip,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
      } as VoteEdge;
    })

    await voteEdges(toClassify);

    res.send({ message: 'OK' });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ message: 'Something went wrong.' })
  }
})

app.post('/v1/addRouteImages', [Authentication, ProfilerOrExpert], async (req: Request, res: Response, next: NextFunction) => {
  // check if the all data is good
  if (!req.body?.length) {
    res.status(422).send({ message: 'Missing params.' })
  }

  req.body.map((singleImage: any) => {
    const { routeId, file, fileName } = singleImage
    if (!routeId || !file || !fileName) { res.status(422).send({ message: 'Missing params.' }) }
  })

  try {
    const imagesForAdding: RouteImage[] = await Promise.all(req.body.map(async (singleImage: any) => {
      const { routeId, file, fileName, exifDatetime, exifLat, exifLong } = singleImage

      const buf = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64')

      let street_name = ''
      let street_number = ''
      let neighborhood = ''
      let city = ''
      let geoid = '75601120261'
      let country_code = ''

      if (exifLat && exifLong) {
        const geoData = await axios.get(`https://api.datamap.io/api/posmo/nominatim/reverse/${exifLat}/${exifLong}`);
        street_name = geoData?.data?.data?.street
        city = geoData?.data?.data?.city
        country_code = geoData?.data?.data?.country_code?.toUpperCase()
      }

      const fileExtension = /(?:\.([^.]+))?$/.exec(fileName)![1]
      const uniqueFileName = 'zurich/' + fileName + '-' + uuidv4() + '.' + fileExtension

      const awsResponse = await uploadFile(buf, uniqueFileName)
      const imageURL = awsResponse?.Location

      const { network_ogc_fid, projected_lat, projected_lon } = await projectPointToEdge(exifLong, exifLat, routeId);

      return {
        pin_lat: projected_lat,
        pin_lon: projected_lon,
        network_ogc_fid,
        image_name: uniqueFileName,
        image_url: imageURL,
        fk_route_id: routeId,
        exif_datetime: exifDatetime,
        exif_lat: exifLat,
        exif_lon: exifLong,
        street_name,
        street_number,
        neighborhood,
        city,
        geoid,
        country_code,
      } as RouteImage;
    }))

    await addRouteImages(imagesForAdding);

    res.send({ message: 'OK' });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ message: 'Something went wrong.' })
  }
})

app.post('/v1/deleteRouteEdge', [Authentication, ProfilerOrExpert], async (req: Request, res: Response, next: NextFunction) => {
  const { route_id, ogc_fid } = req.body;
  if (isNaN(route_id) || isNaN(ogc_fid)) { res.status(422).send({ message: 'Wrong Input' }) }

  const dbResult: any = await deleteRouteEdge({ route_id, ogc_fid });
  res.send({ message: 'OK' });
})

app.post('/v1/deleteEdge', [Authentication, Private], async (req: Request, res: Response, next: NextFunction) => {
  const id: number = parseInt(req.body.properties.id);

  if (isNaN(id)) { return res.status(422).send({ message: 'Wrong input.' }) }

  const dbResult: any = await deleteEdge(req.body.properties);

  res.send({ message: 'OK' });
})

app.post('/v1/subscribe', [], async (req: Request, res: Response, next: NextFunction) => {
  const { type, email } = req.body;

  if (!type || !email) { return res.status(422).send({ message: 'Missing params.' }) }
  if (!validator.isEmail(email)) { return res.status(422).send({ message: 'Email wrong format' }) }

  try {
    const dbResult = await subscribe({ type: validator.escape(type), email });
    return res.send({ ...dbResult, inserted: true });
  } catch (err) {
    return res.status(422).send({ message: 'Something went wrong.' });
  }
})

app.get('/v1/getPersona', [Authentication], async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(422).send({ message: 'Missing params.' });
  }

  const persona = await getPersona(user_id as string);
  return res.send({ message: 'OK', data: persona });
})

app.post('/v1/addPersona', [Authentication], async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body;

  if (!user && user.id) {
    return res.status(422).send({ message: 'Missing params.' });
  }

  try {
    const dbResult = await addPersona(req.body);

    try {
      await subscribe({ type: 'pretest_panel', email: user.email })
    } catch (err) {
      // if we can't subscribe user, just print error.
      console.log(err);
    }

    return res.send({ ...dbResult, inserted: true });
  } catch (err) {
    return res.status(422).send({ message: 'Something went wrong.' });
  }
})

app.post('/v1/addDownloadMapStatistic', [cors()], async (req: Request, res: Response, next: NextFunction) => {
  const { pageSize, pageOrientation, format, dpi } = req.body;

  if (!pageSize || !pageOrientation || !format || !dpi) { return res.status(422).send({ message: 'Missing params.' }) }

  try {
    const dbResult = await addDataForMapDownloadStatistic({ pageSize: validator.escape(pageSize), pageOrientation: validator.escape(pageOrientation), format: validator.escape(format), dpi: parseInt(validator.escape('' + dpi)) });
    return res.send({ ...dbResult, inserted: true });
  } catch (err) {
    console.log('err', err)
    return res.status(422).send({ message: 'Something went wrong.' });
  }
})

app.post('/v1/addEmbedMapStatistic', [cors()], async (req: Request, res: Response, next: NextFunction) => {

  const { ipAddress } = req.body;
  if (!ipAddress) {
    res.status(422).send({ message: 'Missing params.' })
  }

  try {
    const ipToGeo = await axios.get(`http://api.ipstack.com/${ipAddress}?access_key=${process.env.IPSTACK_API_KEY}`);
    const { city, latitude, longitude, country_code, country_name, region_code, region_name, zip } = ipToGeo.data;
    const embedMapStatistic: EmbedMapStatistic = {
      country_code,
      country_name,
      city,
      region_code,
      region_name,
      lat: latitude,
      lon: longitude,
      postcode: zip,
      ip_address: ipAddress,
    }

    await addDataForMapEmbedStatistic(embedMapStatistic);

    res.send({ message: 'OK' });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ message: 'Something went wrong.' })
  }
})

app.use(Error);

app.listen(process.env.PORT || 8135, () => {
  console.log(`NODE_ENV set to: ${process.env.NODE_ENV}`);
  console.log(`velobserver listening on port ${process.env.PORT || 7835}`);
})