# Velobserver


### Requirements

The Velobserver API uses external services:

- https://ipstack.com/ - we use ip stack to map ip adress to locations of users. This way we want to make sure that the rating from outside of the city or the country will have less weight then the rating from somebody who rates roads near his ISP and/or GPS location.

- We use an external authentification server based on JWT. Here we assume you have your own auth server responsible for the generation of JWTs. 
Here is a tutorial of how one would go about building such auth server: https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/

- We use AWS s3 to store the images to be rated. See: https://aws.amazon.com/s3/

- We also use the imgix service for rendering the images in different resolutions and sizes. 


### Generation of road geometries ("edges")

In the network directory you can find a python notebook that will help you generate desired geometries for your city. (see: updated_graph_generation.ipynb). After you export the geometry data as gpkg or as shapefile, you'll need a tool to convert it to sql. We recommend to use QGIS. (see: https://www.qgis.org/en/site/)

An alternative to QGIS is to use CLI tools from gdal.org, for example the ogrinfo tool. (see: https://gdal.org/programs/ogrinfo.html)

### Setup of ENV variables

```
NODE_ENV=staging
JWT_TOKEN_SECRET=
PORT=8135
IPSTACK_API_KEY=
DATABASE_URL=postgres://datamap:@localhost:8134/velobserver
AWS_BUCKET_NAME="bikeindex"
AWS_BUCKET_REGION="us-east-1"
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
```

### Preparation of the Database

#### Install the needed extenstions

RUN `CREATE EXTENSION postgis;`

#### Add DB tables

```
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS zurich_all_2km_outside_border_ogc_fid_seq;

-- Table Definition
CREATE TABLE "public"."network" (
    "ogc_fid" int4 NOT NULL DEFAULT nextval('zurich_all_2km_outside_border_ogc_fid_seq'::regclass),
    "the_geom" geometry,
    "from" int8,
    "to" int8,
    "osmid" varchar,
    "oneway" bool,
    "lanes" varchar,
    "ref" varchar,
    "highway" varchar,
    "maxspeed" varchar,
    "length" float8,
    "bridge" varchar,
    "name" varchar,
    "service" varchar,
    "tunnel" varchar,
    "access" varchar,
    "junction" varchar,
    "width" varchar,
    "area" varchar,
    "est_width" varchar,
    PRIMARY KEY ("ogc_fid")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS network_classification_id_seq;

-- Table Definition
CREATE TABLE "public"."network_classification" (
    "id" int4 NOT NULL DEFAULT nextval('network_classification_id_seq'::regclass),
    "network_ogc_fid" int4,
    "user_id" uuid,
    "width" float8,
    "created_at" timestamp,
    "updated_at" timestamp,
    "deleted_at" timestamp,
    "safety" numeric,
    "conflict" numeric,
    "attractiveness" numeric,
    "ip" varchar,
    "city" varchar,
    "country_code" varchar,
    "country_name" varchar,
    "lat" float8,
    "lon" float8,
    "region_code" varchar,
    "region_name" varchar,
    "postcode" varchar,
    "global_vote" float8,
    "fk_network_route_edges_images_id" int4,
    CONSTRAINT "network_classification_network_route_edges_images_id_fkey" FOREIGN KEY ("fk_network_route_edges_images_id") REFERENCES "public"."network_route_edges_images"("id"),
    CONSTRAINT "network_classification_network_ogc_fid_fkey" FOREIGN KEY ("network_ogc_fid") REFERENCES "public"."network"("ogc_fid"),
    PRIMARY KEY ("id")
);

-- Column Comment
COMMENT ON COLUMN "public"."network_classification"."safety" IS 'float: 0 - 11, with step 0.1';
COMMENT ON COLUMN "public"."network_classification"."conflict" IS 'float: 0 - 11, with step 0.1';
COMMENT ON COLUMN "public"."network_classification"."attractiveness" IS 'float: 0 - 11, with step 0.1';
COMMENT ON COLUMN "public"."network_classification"."ip" IS 'ip address';
COMMENT ON COLUMN "public"."network_classification"."country_code" IS '2-letter country code associated with the IP';

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS network_route_edges_id_seq;

-- Table Definition
CREATE TABLE "public"."network_route_edges" (
    "id" int4 NOT NULL DEFAULT nextval('network_route_edges_id_seq'::regclass),
    "network_routes_id" int4 NOT NULL,
    "network_ogc_fid" int4 NOT NULL,
    "status" int4,
    "created_at" timestamp DEFAULT now(),
    "type" int4,
    PRIMARY KEY ("id")
);

-- Column Comment
COMMENT ON COLUMN "public"."network_route_edges"."status" IS '1 - concept, 2 - planned, 3 - under construction, 4 - finished';
COMMENT ON COLUMN "public"."network_route_edges"."type" IS '1 - Basisnetz / Base Network, 2 - Hauptnetz / Main Network, 3 - Vorzugsrouten (50km) / Preferential Bike Routes (the ones we have voted on)';

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS network_route_edges_images_seq;

-- Table Definition
CREATE TABLE "public"."network_route_edges_images" (
    "id" int4 NOT NULL DEFAULT nextval('network_route_edges_images_seq'::regclass),
    "network_ogc_fid" int4,
    "image_name" varchar,
    "image_url" varchar,
    "created_at" timestamp,
    "updated_at" timestamp,
    "deleted_at" timestamp,
    "fk_route_id" int4,
    "exif_datetime" timestamp,
    "exif_lat" float8,
    "exif_lon" float8,
    "pin_lat" float8,
    "pin_lon" float8,
    "street_name" varchar,
    "street_number" varchar,
    "neighborhood" varchar,
    "city" varchar,
    "geoid" varchar,
    "country_code" varchar,
    "priority" int2 DEFAULT '0'::smallint,
    CONSTRAINT "network_route_edges_images_route_id_fkey" FOREIGN KEY ("fk_route_id") REFERENCES "public"."network_routes"("id"),
    CONSTRAINT "network_route_edges_images_network_ogc_fid_fkey" FOREIGN KEY ("network_ogc_fid") REFERENCES "public"."network"("ogc_fid"),
    PRIMARY KEY ("id")
);

-- Column Comment
COMMENT ON COLUMN "public"."network_route_edges_images"."priority" IS 'images with higher numbers have more priority';

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS network_routes_seq;

-- Table Definition
CREATE TABLE "public"."network_routes" (
    "id" int4 NOT NULL DEFAULT nextval('network_routes_seq'::regclass),
    "name" varchar,
    "default" int2 NOT NULL DEFAULT '1'::smallint,
    "visible" int2 NOT NULL DEFAULT '1'::smallint,
    "direction" varchar,
    PRIMARY KEY ("id")
);

-- Column Comment
COMMENT ON COLUMN "public"."network_routes"."default" IS '(1 for default, 0 otherwise)';
COMMENT ON COLUMN "public"."network_routes"."visible" IS '(1 or 0) (= visible for users)';
COMMENT ON COLUMN "public"."network_routes"."direction" IS '(I for inbound, O for outbound)';


-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS personas_id_seq;

-- Table Definition
CREATE TABLE "public"."personas" (
    "id" int4 NOT NULL DEFAULT nextval('personas_id_seq'::regclass),
    "user_id" uuid,
    "topic" varchar,
    "key" varchar,
    "value" float4,
    "created_at" timestamptz DEFAULT '2021-10-10 14:36:56.716757+00'::timestamp with time zone,
    "updated_at" timestamptz,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS id_seq;

-- Table Definition
CREATE TABLE "public"."subscriptions" (
    "id" int4 NOT NULL DEFAULT nextval('id_seq'::regclass),
    "type" varchar DEFAULT 'velo'::character varying,
    "email" varchar NOT NULL,
    "created_at" timestamp,
    "updated_at" timestamp,
    PRIMARY KEY ("id")
);
```

#### Db function to handle geometry retrival pgsql

```

CREATE OR REPLACE
FUNCTION public.network_nearest_edges(lon FLOAT8, lat FLOAT8, alternatives INT)
RETURNS TABLE (ogc_fid BIGINT, the_geom geometry, geojson TEXT, velo INT, veloweg INT, fuss INT, name VARCHAR)
AS $$
SELECT ogc_fid, the_geom, st_asgeojson(the_geom) geojson, velo, veloweg, fuss, name
FROM network
ORDER BY the_geom <-> (SELECT ST_SetSRID(ST_Point(lon, lat), 4326) )
LIMIT $3;

$$
LANGUAGE 'sql'
STABLE
STRICT
PARALLEL SAFE;
```

Test function: `select * from public.network_nearest_edges(8.501331, 47.378491, 3);`


#### Color scheme (preliminary) for state attribute

concept: #FFFFFF,
planned: #F8F7F5,
under construction: #CECBC8
finished: #2D2047

#### Starting API / DB

Both services are containerized see docker-compose.yml file. 

To start both API and DB run:
```
docker-compose up -d
```

This will install and run the required docker containers.

By default your API will be running on 8135 and DB on 8134 port.

#### API routes

```
GET /v1/getNearestEdges
GET /v1/getNetworkRoutes
GET /v1/getClassifiedEdges
GET /v1/getAllUsersClassifiedEdges
GET /v1/getEdges
GET /v1/getEdgesForVoting
GET /v1/getImagesForVoting
GET /v1/getAllUserVotes
GET /v1/getPersona
POST /v1/updateRouteVisibility
POST /v1/addRouteEdges
POST /v1/classifyEdges
POST /v1/voteEdges
POST /v1/addRouteImages
POST /v1/deleteRouteEdge
POST /v1/subscribe
POST /v1/addPersona
POST /v1/addDownloadMapStatistic
POST /v1/addEmbedMapStatistic
```
