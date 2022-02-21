import React, { Component } from 'react';
import Map from '../components/Map';
import CircularIndeterminate from '../components/CircularIndeterminate';
import getEdges from '../api/getEdges';
import getAllUsersClassifiedEdges from '../api/getAllUsersClassifiedEdges';
import localStorageService from '../services/localStorageService';
import withAuth from '../components/Authentication';
import PretestPanel from '../pages/PretestPanel';
import { getImagesForVoting } from '../api';
import getPersona from '../api/getPresona';

class BikeIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    const userPresets = localStorageService.getUserPretestPanel();
    if(!userPresets && localStorageService.getUser()) {
      // figure out if user has done survey but logging in via different browser
      getPersona()
        .then(data => data.data)
        .then(persona => {
          const { data } = persona;
          if(data.length) {
            const dict = {};
            data.forEach(d => {
              if(!dict[d.topic]) {
                dict[d.topic] = {};
              }

              dict[d.topic] = { ...dict[d.topic], [d.key] : d.value }
            })
            localStorageService.setUserPretestPanel(dict);
          }
        })
        .catch(err => {
          console.log(err);
        })

    }
  }

  componentDidMount() {
    const veloplanEdgesOnly = true;
    getEdges(veloplanEdgesOnly)
    .then(data => data.data)
    .then(data => {
      data.features.forEach(d => { 
        d.properties.line_width = d.properties.route_id ? 4 : 2;
        d.properties.color = d.properties.route_id ? '#B3ACBD'  : '#e7e7e7';
      })
      data.features = data.features.filter(d => { return d.properties.route_visible === 1 });
      data.features.sort((a, b) => { return a.properties.status - b.properties.status });
      this.setState({ data });
    });

    if(localStorageService.isAdmin()) {
      getImagesForVoting()
        .then(data => data.data)
        .then(data => {
          this.setState({ images: data })
        })
    }

    getAllUsersClassifiedEdges()
      .then(data => data.data)
      .then(data => {
        this.setState({ classifiedData: data });
      })
  }

  handleUpdateData(data) {
    data.features.forEach(d => { 
      d.properties.line_width = d.properties.route_id ? 4 : 2;
      d.properties.color = d.properties.route_id ? '#B3ACBD'  : '#e7e7e7';
    })
    data.features.sort((a, b) => { return a.properties.status - b.properties.status });

    this.setState({ data });
  }

  handleRouteEdgeDelete(route_id, ogc_fid) {
    if(this.state.data) {
      const exists = this.state.data.features.find(feature => { return feature.properties.route_id === route_id && feature.properties.ogc_fid === ogc_fid });
      if(exists) {
        exists.properties.route_id = null;
      }

      this.setState({ data: this.state.data });
    }
  }

  render() {
    const userPresets = localStorageService.getUserPretestPanel()

    if (!userPresets) {
      return (
        <div className="App" style={{ backgroundColor: "#f8f7f5" }}>
          <PretestPanel />
        </div>
      );      
    }

    if(!this.state.data || !this.state.classifiedData) {
      return <CircularIndeterminate />
    }

    return (
      <div className="App">
        <Map onRouteEdgeDelete={(route_id, ogc_fid) => this.handleRouteEdgeDelete(route_id, ogc_fid)} updateData={(data) => { this.handleUpdateData(data); }} classifiedData={this.state.classifiedData} data={this.state.data} setData={data => this.setState({data}) } images={this.state.images} />
      </div>
    );
  }
}

export default withAuth(BikeIndex);