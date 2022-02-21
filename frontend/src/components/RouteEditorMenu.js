import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Badge from '@material-ui/core/Badge';
import BuildIcon from '@material-ui/icons/Build';
import Fade from '@material-ui/core/Fade';
import deleteRouteEdge from '../api/deleteRouteEdge';
import CircularIndeterminate from './CircularIndeterminate';
import localStorageService from '../services/localStorageService';
import getVeloplanEdges from '../api/getVeloplanEdges';
import getEdges from '../api/getEdges';
import { updateRouteVisibility } from '../api/';
import ImagesUploader from './ImagesUploader'


const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
    position: 'absolute',
    top: 60,
    zIndex: 4,
    left: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    border: '1px solid #ddd',
    height: 520,
    width: 300,
    margin: '16',
    visibility: 'hidden',

  },
  routeGroup: {
    margin: theme.spacing(1),
  },
  totalEdges: {
    margin: theme.spacing(1),
    fontSize: 11,
    color: '#888',
    position: 'relative',
  },
  edgeGroup: {
    display: 'flex',
    padding: '8px 22px 22px 22px',
    backgroundColor: 'rgb(243 243 243)',
    margin: 0,
    position: 'relative',
  },
  edgeName: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
    marginTop: 0,
    position: 'relative',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
    height: 35,
  },
  formStatusControl: {
    margin: 0,
    width: 120,
  },
  buttonGroup: {
    marginTop: 24,
    marginLeft: theme.spacing(1),
  },
  button: {
    width: 180,
  },
  existingMappings: {
    display: 'flex',
    fontSize: 12,
    color: '#444',
    height: 20,
    margin: '6px',
    position: 'relative',
  },


}));

export default function RouteEditorMenu(props) {
  const classes = useStyles();

  const [routeId, setRouteId] = React.useState(6);
  const [statusId, setStatusId] = React.useState(4);
  const [typeId, setTypeId] = React.useState(3);
  const [routeMenuOpened, setRouteMenuOpened] = React.useState(false);
  const [mapping, setMapping] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [routes, setRoutes] = React.useState([]);
  const [routes_visibility, setRouteVisible] = React.useState(() => {

    const visibility = {};
    props.data.features.forEach(f => {
      visibility[f.properties.route_id] = f.properties.route_visible === 1 ? true : false;
    })

    return visibility;
  });

  React.useEffect(() => {
    if (!props.veloCityData.features.length && localStorageService.isAdmin()) {
      getVeloplanEdges()
        .then(data => data.data)
        .then(data => {
          data.features.forEach(d => {
            d.properties.line_width = 12;
            d.properties.color = '#91C483';
          })

          props.setVeloCityData(data);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [props.veloCityData])

  React.useEffect(() => {

    if (!props.allEdgesLoaded && localStorageService.isAdmin()) {
      getEdges()
        .then(data => data.data)
        .then(data => {
          data.features.forEach(d => {
            d.properties.line_width = d.properties.route_id ? 4 : 2;
            d.properties.color = d.properties.route_id ? '#B3ACBD' : '#e1e1e1';
          })
          data.features.sort((a, b) => { return a.properties.status - b.properties.status });

          props.setData(data);
          props.setAllEdgesLoaded(true);
        });
    }
  }, [props.allEdgesLoaded])

  const getStatus = (statusId) => {
    switch (statusId) {

      case 1:
        return 'Konzept';
      case 2:
        return 'Planung';
      case 3:
        return 'Im Bau';
      case 4:
        return 'Fertig';
      default:
        return 'Fertig';
    }
  }

  const setRouteVisibility = async (route_id, value) => {
    await updateRouteVisibility({ route_id, value });
    const newData = { type: 'FeatureCollection', features: [] };
    newData.features = props.data.features.map(feature => {
      if (feature.properties.route_id === route_id) {
        feature.properties.route_visible = value ? 1 : 0;
      }

      return feature;
    })

    props.setData(newData);
  }

  const handleDeleteRouteEdge = (route_id, ogc_fid, newValue) => {

    if (!newValue) {
      deleteRouteEdge(route_id, ogc_fid)
        .then(data => data.data)
        .then(() => {
          props.onDelete(route_id, ogc_fid);
          setMapping(mapping.filter(m => { return m.ogc_fid !== ogc_fid }))
        })
        .catch(err => {
          // can't remove.
        })
    } else {
      setMapping(mapping.filter(m => { return m.ogc_fid !== ogc_fid }))
    }
  }

  const getRoute = (routeId) => {
    const found = routes.find(route => {
      return route.id === routeId;
    });

    return found ? found.id : 1;
  }

  React.useEffect(() => {
    const featuresWithCurrentRouteId = props.data.features.filter(feature => { return feature.properties.route_id === routeId });
    const featuresToAddToState = [];
    featuresWithCurrentRouteId.forEach(feature => {
      if (!mapping.find(m => { return feature.properties.ogc_fid === m.ogc_fid })) {
        featuresToAddToState.push(feature);
      }
    })
    setMapping([...mapping, ...featuresToAddToState.map(feature => { return feature.properties })]);
    setLoader(false);
  }, [props.data]);

  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/v1/getNetworkRoutes`)
      .then(data => data.data)
      .then(data => {
        setRoutes(data);
      })
      .catch(err => {
        setRoutes([]);
      })

  }, []);

  React.useEffect(() => {
    if (routeMenuOpened && props.selectedFeatures) {

      let newMapping = mapping.filter(m => {
        return !m.newValue || (m.newValue === true && props.selectedFeatures.find(feature => {
          return feature.properties.ogc_fid === m.ogc_fid;
        }))
      })

      let newFeaturesProperties = props.selectedFeatures.map(feature => {
        return { ...feature.properties, status: statusId, route_id: routeId, type: typeId, created_at: new Date().getTime(), newValue: true }
      });

      newFeaturesProperties = newFeaturesProperties.filter(feature => {
        return !newMapping.find(m => { return m.ogc_fid === feature.ogc_fid });
      })

      setMapping([...newMapping, ...newFeaturesProperties]);
    }

  }, [props.selectedFeatures])

  const listSelectedEdges = () => {
    return mapping.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    }).map(edge => {
      return <div key={edge.ogc_fid} className={classes.existingMappings} style={{ color: !edge.newValue ? '#222' : '#777' }}>
        <div style={{ width: 2, backgroundColor: edge.route_id ? '#2D2047' : 'green' }}></div>
        <div style={{ marginLeft: 4, }}>{edge.ogc_fid}</div>
        <div style={{ marginLeft: 4, }}>{edge.name} →</div>
        <div style={{ marginLeft: 4, }}><span style={{ color: !edge.newValue ? '#222' : '#777' }}>{getStatus(edge.status)}</span></div>
        <div style={{ position: 'absolute', right: -10, top: -12 }}><IconButton onClick={() => { handleDeleteRouteEdge(routeId, edge.ogc_fid, edge.newValue) }}><DeleteIcon style={{ fontSize: 16, }} /></IconButton></div>
      </div>
    })
  }

  return (
    <div>
      {localStorageService.getUser() && (localStorageService.getUser().role === 'POSMO_DATAPROFILER' || localStorageService.getUser().role === 'POSMO_TECHNICAL') ? <div style={{ zIndex: 5, position: 'absolute', right: 6, bottom: 100 }}><IconButton onClick={e => { props.setRouteMenuOpened(!routeMenuOpened); setRouteMenuOpened(!routeMenuOpened) }} style={{ backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 1px 6px 2px #e0e0e0', }} size="medium"><BuildIcon style={{ fontSize: 28 }} /></IconButton></div> : ''}
      {
        !props.allEdgesLoaded && !props.veloCityData.features.length && routeMenuOpened ? <CircularIndeterminate style={{ zIndex: 1001 }} /> : <Fade in={routeMenuOpened}>
          <div className={classes.root} style={{ visibility: routeMenuOpened ? 'visible' : 'hidden', height: 'auto', minHeight: '480px', zIndex: '10' }}>
            <div className={classes.routeGroup}>
              <div style={{ fontSize: 14, color: '#777' }}>Routes</div>
              <FormControl variant="filled" className={classes.formControl}>
                <Select
                  style={{ width: 270, height: 30, }}
                  variant="outlined"
                  labelId="route-label"
                  id="route-select"
                  value={routeId}
                  onChange={e => { setRouteId(e.target.value); props.setRouteId(e.target.value); setMapping(props.data.features.filter(feature => { return feature.properties.route_id === e.target.value }).map(feature => feature.properties)) }}
                >
                  {
                    routes && routes.sort((a, b) => { return b.default - a.default; }).map(route => { return <MenuItem key={route.id} value={route.id}>{route.name}{routes_visibility[route.id] ? <span style={{ fontSize: 10, position: 'absolute', right: 78, color: 'green' }}>visible</span> : ''}{route.default ? <span style={{ color: '#bbb', fontSize: 10, position: 'absolute', right: 36, }}>default</span> : ''}</MenuItem> })
                  }
                </Select>
              </FormControl>
              <div className={classes.totalEdges}>
                <div>Commited edges <span style={{ marginLeft: 4, color: '#444' }}>{mapping.filter(m => { return !m.newValue; }).length}</span></div>
                <div style={{ position: 'absolute', right: 0, bottom: 0, }}>Route length <span style={{ marginLeft: 4, color: '#444' }}>
                  {
                    mapping.filter(m => { return !m.newValue && m.route_id === routeId }).reduce((acc, curr) => { return acc += curr.length_km; }, 0).toFixed(2)
                  }
                  km
                </span>
                  <span style={{ color: 'green', marginLeft: 4, }}>
                    {
                      '+' + mapping.filter(m => { return m.newValue && m.route_id === routeId }).reduce((acc, curr) => { return acc += curr.length_km; }, 0).toFixed(2)
                    }
                  </span>
                </div>
              </div>
            </div>
            <Divider />
            <div>
              {/* <FormControlLabel
              style={{ color: '#444', margin: 12, }}
              control={<Checkbox color="primary" checked={autoAddEdges} onChange={(e) => { setAutoAddEdges(e.target.checked)}} name="automatically_add_edges" />}
              label="Add edges on selection"
            /> */}
            </div>
            <Divider />
            <div style={{ height: 190, overflow: 'auto' }}>
              {loader ? <CircularIndeterminate /> : ''}
              {listSelectedEdges()}
            </div>
            <Divider />
            <div className={classes.edgeGroup}>
              {/* <div style={{ position: 'absolute', right: 0, top: -7 }}>
              <IconButton aria-label="add" onClick={() => {
                if(!mapping.find(m => { return m.ogc_fid === props.selectedFeature.properties.ogc_fid })) {
                  setMapping([{...props.selectedFeature.properties, status: statusId, route_id: routeId, created_at: new Date().getTime(), newValue: true }, ...mapping]);
                }
              }}>
                <AddIcon style={{ fontSize: 18, }} />
              </IconButton>
          </div> */}
              {/* <div className={classes.edgeName}>
            <div style={{ width: 140, fontSize: 12, color: '#777', }}>{props.selectedFeature && props.selectedFeature.properties.name ? `${props.selectedFeature.properties.ogc_fid} | ${props.selectedFeature.properties.name}` : '' } →</div>
          </div> */}
              <div>
                {/* <div style={{ paddingLeft: 8, fontSize: 12, color: '#777', marginBottom: 12, }}>{getRoute(routeId)}</div> */}
                <FormControl variant="filled" className={classes.formStatusControl}>
                  <Select
                    variant="outlined"
                    style={{ height: 25, }}
                    labelId="type-label"
                    id="type-select"
                    value={typeId}
                    onChange={e => setTypeId(e.target.value)}
                  >
                    {/* <MenuItem value={0}>Alternative</MenuItem> */}
                    <MenuItem value={1}>Basisnetz</MenuItem>
                    <MenuItem value={2}>Hauptnetz</MenuItem>
                    <MenuItem value={3}>Vorzugsrouten</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="filled" className={classes.formStatusControl}>
                  <Select
                    variant="outlined"
                    style={{ height: 25, marginLeft: 16, }}
                    labelId="status-label"
                    id="status-select"
                    value={statusId}
                    onChange={e => setStatusId(e.target.value)}
                  >
                    {/* <MenuItem value={0}>Alternative</MenuItem> */}
                    <MenuItem value={1}>Konzept</MenuItem>
                    <MenuItem value={2}>Plannung</MenuItem>
                    <MenuItem value={3}>Im Bau</MenuItem>
                    <MenuItem value={4}>Fertig</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <Divider />
            <div>
              <FormControlLabel
                style={{ color: '#444', margin: 12, }}
                control={<Checkbox color="primary" checked={routes_visibility[routeId] || false} onChange={(e) => { setRouteVisibility(routeId, e.target.checked); setRouteVisible({ ...routes_visibility, [routeId]: e.target.checked }) }} name="route_visible" />}
                label="Route Visible"
              />
            </div>
            <Divider />
            <div className={classes.buttonGroup}>
              <Badge anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }} badgeContent={mapping.filter(m => { return m.newValue; }).length} color="secondary">
                <Button
                  style={{ width: 280 }}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={mapping.filter(m => { return m.newValue; }).length ? false : true}
                  onClick={() => { setLoader(true); props.onCommit(mapping.filter(m => { return m.newValue; })); setMapping([]); }}
                >
                  Commit Changes
                </Button>
              </Badge>
              <ImagesUploader routeId={routeId} />
            </div>

          </div>
        </Fade>
      }

    </div>
  );
}