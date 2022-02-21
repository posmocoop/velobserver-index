import mapboxgl from "mapbox-gl";
import React, { useState } from 'react'
import MapGL, { MapContext, Popup, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl'
import { useAppContext } from '../components/UserContext';
import 'mapbox-gl/dist/mapbox-gl.css'
import RouteEditorMenu from './RouteEditorMenu';
import MainMenu from "./MainMenu";
import classifyEdges from '../api/classifyEdges';
import addRouteEdges from '../api/addRouteEdges';
import localStorageService from "../services/localStorageService";
import DesktopMenu from '../components/DesktopMenu'

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const TOKEN = "pk.eyJ1IjoiZGpyYSIsImEiOiJjamZmZ2RzamYyM2JyMzNwYWc1aThzdmloIn0.tuEuIrtp3DK0ALX2J1clEw"

const navControlStyle = {
  right: 10,
  top: 80
};

function SwitchLayer() {
  const { map } = React.useContext(MapContext);

  if(typeof map.moveLayer === 'function') {
    map.moveLayer('veloplan-layer', 'feature-selected-layer');
    map.moveLayer('veloplan-layer', 'network-layer');
    map.moveLayer('pin-connections-layer', 'images-pins-origin-layer');
    map.moveLayer('pin-connections-layer', 'images-pins-layer');
  }

  const [mapLayer, setMapLayer] = React.useState('light-v10');

  const handleMapLayerChange = () => {
    if (map) {
      if (mapLayer === 'light-v10') {
        setMapLayer('satellite-v9');
        map.setStyle('mapbox://styles/mapbox/satellite-v9');
      } else {
        setMapLayer('light-v10');
        map.setStyle('mapbox://styles/djra/ckx90pkh58k5d15p5066x6x7r');
      }
    }
  }

  return (
    <div style={{ position: 'absolute', border: '2px solid #fff', borderRadius: 4, zIndex: 5, left: 10, bottom: 25, width: 80, height: 60 }} onClick={() => handleMapLayerChange()}>
      <div style={{ position: 'relative' }}>
        <img alt="switch satellite / map view" src={mapLayer === 'light-v10' ? "assets/satellite.png" : 'assets/map.png'} width={80} height={60} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, color: mapLayer === 'light-v10' ? '#fff' : '#777', fontSize: 14, }}>{mapLayer === 'light-v10' ? 'Satellite' : 'Map'}</div>
      </div>
    </div>
  )
}


const Map = (props) => {
  const ctx = useAppContext();
  const [viewport, setViewPort] = useState({
    latitude: 47.3769,
    longitude: 8.5417,
    zoom: 12,
    minZoom: 9,
  })

  const [popup, setPopup] = React.useState(null)
  const [geoLocateControlStyle, setGeoLocateStyle] = useState({
    right: 6,
    top: 20,
    position: 'fixed',
  });

  const handleOnCommit = (mapping) => {
    addRouteEdges(mapping)
      .then(data => data.data)
      .then(data => {
        props.updateData(data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const getClassificationColor = classification => {
    let votes = 0
    let votesNumber = 0

    if (classification.safety && classification.attractiveness && classification.conflict) {
      const detailedVoting = (classification.safety + classification.attractiveness + classification.conflict) / 3
      votes += detailedVoting
      votesNumber++
    }

    // only calculate real values
    if (classification.globalVote) {
      votes += classification.globalVote
      votesNumber++
    }

    const value = votes / votesNumber;

    if (votesNumber === 0) {
      return '#B3ACBD';
    }

    if (value < 1.5) {
      return '#ec6d6e';
    } else if (value >= 1.5 && value < 2.5) {
      return '#f3b442';
    } else if (value >= 2.5 && value < 3.5) {
      return '#96b63c';
    } else if (value >= 3.5) {
      return '#59864e';
    }
  }

  const handleClassify = (classification) => {
    classifyEdges({
      type: 'FeatureCollection',
      features: selectedFeatures.features,
      properties: {
        user_id: localStorageService.getUser()?.user_id,
        ...classification
      }
    })
      .then(data => data)
      .then(() => {
        // in user classification view only thing that changed are edges sent to be reclassified.
        const newClassifiedFeaturesIds = [];
        const newClassifiedFeatures = selectedFeatures.features.map(feature => {
          feature.properties.color = getClassificationColor(classification);
          newClassifiedFeaturesIds.push(feature.properties.ogc_fid);
          return feature;
        })

        // filter old classifications
        const filteredClassifiedFeatures = classifiedFeatures.features.filter(feature => {
          return !newClassifiedFeaturesIds.includes(feature.properties.ogc_fid)
        })

        setClassifiedFeatures({
          type: 'FeatureCollection',
          features: [...filteredClassifiedFeatures, ...newClassifiedFeatures]
        });

        setTimeout(() => {
          setSelectedFeatures({
            type: 'FeatureCollection',
            features: [],
          })
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleClassificationChange = classification => {
    const classificationColor = getClassificationColor(classification);

    const features = selectedFeatures.features.map(feature => {
      return { ...feature, properties: { ...feature.properties, color: classificationColor } }
    })

    setSelectedFeatures({
      type: 'FeatureCollection',
      features,
    });
  }

  const [selectedFeatures, setSelectedFeatures] = useState({ type: 'FeatureCollection', properties: {}, features: [] });
  const [classifiedFeatures, setClassifiedFeatures] = useState({
    type: 'FeatureCollection', properties: {},
    features: (() => {
      return props.classifiedData.features.map(f => {
        f.properties.color = getClassificationColor(f.properties);
        return f;
      })
    })()
  });
  const [routeMenuOpened, setRouteMenuOpened] = useState(false);
  const [activeMenu, setActiveMenu] = useState({ title: 'classify' })
  const [veloData, setVeloData] = React.useState();
  const [allEdgesLoaded, setAllEdgesLoaded] = React.useState();
  const [veloCityData, setVeloCityData] = React.useState({
    type: 'FeatureCollection',
    features: [],
  });
  const [selectedRouteData, setSelectedRouteData] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  const setRouteId = (routeId) => {
    setSelectedRouteData({
      type: 'FeatureCollection',
      features: props.data.features.filter(feature => { return feature.properties.route_id === routeId })
    })
  }

  React.useEffect(() => {
    const features = props.data.features.filter(f => { return f.properties.route_id && f.properties.route_visible === 1; })
    setVeloData({
      type: 'FeatureCollection',
      features,
    })
  }, [props.data]);


  const [imagesPinsFeatures, setImagesPinsFeatures] = React.useState({
    type: 'FeatureCollection',
    features: props.images.features.map(feature => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [feature.properties.pin_lon, feature.properties.pin_lat]
        },
        properties: {...feature.properties}
      }
    }),
  });

  const [imagesPinsOriginFeatures ,setImagesPinsOriginFeatures] = React.useState({
    type: 'FeatureCollection',
    features: props.images.features.map(feature => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [feature.properties.exif_lon, feature.properties.exif_lat]
        },
        properties: {...feature.properties}
      }
    }),
  })

  const [pinConnectionsFeatures, setPinConnectionsFeatures] = React.useState({
    type: 'FeatureCollection',
    features: props.images.features.map(feature => {
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [ feature.properties.exif_lon, feature.properties.exif_lat ],
            [ feature.properties.pin_lon, feature.properties.pin_lat]
          ]
        },
        properties: {...feature.properties}
      }
    }),
  })

  const _onViewportChange = viewport => setViewPort({ ...viewport })

  const veloplanLayer = {
    id: 'veloplan-layer',
    type: 'line',
    source: 'veloplan',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': ['get', 'line_width'],
      'line-opacity': 0.6,
    }
  };

  const selectedRouteLayer = {
    id: 'selectedRoute-layer',
    type: 'line',
    source: 'selectedRoute',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#000',
      'line-width': 4,
      'line-opacity': 1,
    }
  };

  const networkLayer = {
    id: 'network-layer',
    type: 'line',
    source: 'network',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': ['get', 'line_width']
    }
  };

  const featureSelectedLayer = {
    id: 'feature-selected-layer',
    type: 'line',
    source: 'feature-selected',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-gap-width': 0,
      'line-width': 4,
    }
  };

  const featureSelectedLayerBorder = {
    id: 'feature-selected-layer-border',
    type: 'line',
    source: 'feature-selected',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#fff',
      'line-gap-width': 0,
      'line-width': 8,
    }
  };

  const classifiedFeaturesLayer = {
    id: 'classified-features-layer',
    type: 'line',
    source: 'classified-features',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 4
    }
  };

  const imagesPinsLayer = {
    id: 'images-pins-layer',
    type: 'circle',
    source: 'images-pins',
    layout: {},
    paint: {
      'circle-radius': {
        'base': 1.95,
        'stops': [
          [12, 2],
          [22, 180]
        ]
      },
      'circle-color': '#219F94',
      'circle-opacity': 1,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff',
    }
  }

  const pinConnectionsLayer = {
    id: 'pin-connections-layer',
    type: 'line',
    source: 'pin-connections',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#223b53',
      'line-width': 2
    }
  }

  const imagesOriginPinsLayer = {
    id: 'images-pins-origin-layer',
    type: 'circle',
    source: 'images-pins-origin',
    layout: {},
    paint: {
      'circle-radius': {
        'base': 2.95,
        'stops': [
          [12, 2],
          [22, 180]
        ]
      },
      'circle-color': '#e55e5e',
      'circle-opacity': 1,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff',
    }
  }

  // sensitivity of layer tap/pan
  const eventRecognizerOptions = {
    pan: { threshold: 35 },
    tap: { threshold: 25 },
  }

  return (
    <div>
      <RouteEditorMenu setRouteId={routeId => setRouteId(routeId)} setData={data => props.setData(data)} allEdgesLoaded={allEdgesLoaded} setAllEdgesLoaded={value => setAllEdgesLoaded(value)} veloCityData={veloCityData} setVeloCityData={data => setVeloCityData(data)} setRouteMenuOpened={(routeMenuOpened) => setRouteMenuOpened(routeMenuOpened)} onDelete={(route_id, ogc_fid) => props.onRouteEdgeDelete(route_id, ogc_fid)} data={props.data} onCommit={(mapping) => { handleOnCommit(mapping) }} selectedFeatures={selectedFeatures.features} />
      <MapContext.Provider>
        {!routeMenuOpened ? <MainMenu onClassify={classification => handleClassify(classification)} setGeoLocateStyle={setGeoLocateStyle} onClassificationChange={classification => { handleClassificationChange(classification) }} active={activeMenu} data={selectedFeatures} /> : ''}
        <MapGL
          {...viewport}
          mapboxApiAccessToken={TOKEN}
          // style = {{ position: 'absolute', width: '100%', top: 0, bottom: 0 }}
          width="100vw" height="100vh"
          mapStyle="mapbox://styles/djra/ckx90pkh58k5d15p5066x6x7r"
          //mapbox://styles/mapbox/satellite-v9
          onViewportChange={_onViewportChange}
          eventRecognizerOptions={eventRecognizerOptions}
          clickRadius={15}
          touchZoom={true}
          scrollZoom={true}
          interactiveLayerIds={['network-layer', 'images-pins-layer', 'images-pins-origin-layer']}
          onHover={evt => {
            if (routeMenuOpened && evt.features[0]) {
              setPopup({
                lat: evt.lngLat[1],
                lon: evt.lngLat[0],
                ogc_fid: evt.features[0].properties.ogc_fid,
                image_name: ctx.generateImageURL({ imageName: evt.features[0].properties.image_name }, 120),
              })
            }
          }}
          onClick={(evt) => {
            if (!routeMenuOpened) return;
            // bring velo = 1 edges to front.
            console.log('evt', evt)

            // evt.features.sort((f0 , f1) => { return f1.properties.velo - f0.properties.velo  });

            if (evt.features[0]) {

              // some types problem. (fix this in a better way.)
              evt.features[0].properties.route_name = evt.features[0].properties.route_name === 'null' ? null : evt.features[0].properties.route_name;
              evt.features[0].properties.route_id = evt.features[0].properties.route_id === 'null' ? null : evt.features[0].properties.route_id;
              evt.features[0].properties.status = evt.features[0].properties.status === 'null' ? null : evt.features[0].properties.status;
              evt.features[0].properties.created_at = evt.features[0].properties.created_at === 'null' ? null : evt.features[0].properties.created_at;
              evt.features[0].properties.status = evt.features[0].properties.status === 'null' ? null : evt.features[0].properties.status;

              if (!selectedFeatures.features.find((feature) => {
                return feature.properties.ogc_fid === evt.features[0].properties.ogc_fid;
              })) {
                setSelectedFeatures({
                  type: 'FeatureCollection',
                  properties: {}, features: [...selectedFeatures.features, {
                    type: 'Feature',
                    properties: { ...evt.features[0].properties, color: '#5FABE3' },
                    geometry: evt.features[0].geometry,
                  }]
                });
              } else {
                // remove feature from the list, unclick
                const filteredFeatures = selectedFeatures.features.filter(feature => {
                  feature.properties.color = '#5FABE3';
                  return feature.properties.ogc_fid !== evt.features[0].properties.ogc_fid;
                })

                setSelectedFeatures({
                  type: 'FeatureCollection',
                  properties: {}, features: [...filteredFeatures]
                });
              }
            }
          }}
        >
          {routeMenuOpened && popup ? <Popup
            latitude={popup.lat}
            longitude={popup.lon}
            closeButton={false}
            anchor="bottom"
            offsetTop={-25}
          >
            <div style={{ fontSize: 10, color: '#888' }}>ogc_fid {popup.ogc_fid}</div>
            <div style={{ marginTop: 12, }}>{ popup.image_name ? <img src={popup.image_name} /> : ''}</div>
          </Popup> : ''
          }
          {/* <NavigationControl style={navControlStyle} /> */}
          <GeolocateControl
            style={routeMenuOpened ? { right: 6, top: 20, position: 'fixed' } : geoLocateControlStyle}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          />
          <Source id="veloplan" type="geojson" data={veloCityData}>
            {routeMenuOpened ? <Layer {...veloplanLayer} /> : ''}
          </Source>
          <Source id="selectedRoute" type="geojson" data={selectedRouteData}>
            {routeMenuOpened ? <Layer {...selectedRouteLayer} /> : ''}
          </Source>
          <Source id="network" type="geojson" data={
            !routeMenuOpened ? veloData : props.data
          }>
            <Layer {...networkLayer} />
          </Source>
          <Source id="classified-features-layer" type="geojson" data={classifiedFeatures}>
            {routeMenuOpened ? '' : <Layer {...classifiedFeaturesLayer} />}
          </Source>
          <Source id="feature-selected" type="geojson" data={selectedFeatures}>
            <Layer {...featureSelectedLayerBorder} />
            <Layer {...featureSelectedLayer} />
          </Source>
          <Source id="images-pins" type="geojson" data={routeMenuOpened ? imagesPinsFeatures : { type: 'FeatureCollection', features: []}}>
            <Layer {...imagesPinsLayer} />
          </Source>
          <Source id="images-pins-origin" type="geojson" data={routeMenuOpened ? imagesPinsOriginFeatures : { type: 'FeatureCollection', features: []}}>
            <Layer {...imagesOriginPinsLayer} />
          </Source>
          <Source id="pin-connections" type="geojson" data={routeMenuOpened ? pinConnectionsFeatures : { type: 'FeatureCollection', features: []}}>
            <Layer {...pinConnectionsLayer} />
          </Source>
        </MapGL>
        {routeMenuOpened ? <SwitchLayer /> : ''}
      </MapContext.Provider>
      <DesktopMenu />
      {/* <div style={{ width: '100%', zIndex: 5, position: 'absolute', bottom: 0}}>
      <LinearProgressWithLabel value={(classifiedFeatures.features.length / props.data.features.filter(d => { return d.properties.velo === 1 }).length) * 100} />
    </div> */}
    </div>
  )
}

export default Map;