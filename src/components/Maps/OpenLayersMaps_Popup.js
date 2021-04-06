import React, { Component } from "react";
 
import 'ol/ol.css';
import Feature from 'ol/Feature';
import OlMap from 'ol/Map';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import OlView from 'ol/View';
import {Icon, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import Overlay from 'ol/Overlay';
import {toStringHDMS} from 'ol/coordinate';
import {toLonLat} from 'ol/proj';
 

var features = [];
    var locations = [
        {
            name: 'Charminar',
            location: [78.4747, 17.3616]
        },
        {
            name: 'Taj Mahal',
            location: [78.0421, 27.1751]
        },
        {
            name: 'Mysore Palace',
            location: [76.6552, 12.3052]
        },
    ];
 
    locations.forEach((location) => {
        var iconFeature = new Feature({
            geometry: new Point(fromLonLat(location.location)),
            name: location.name
          });
        features.push(iconFeature);
    });


    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    
 
class PublicMap extends Component {
  constructor(props) {
    super(props);
 
    this.state = { center: [0, 0], zoom: 1 };
 
    var vectorSource = new VectorSource({
      features: features
    });
 
    this.olmap = new OlMap({
      target: null,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
          style: new Style({
            image: new Icon({
              anchor: [0.5, 0.9],
              scale: [0.10, 0.15],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              // src: 'https://openlayers.org/en/latest/examples/data/icon.png'
              src: 'icon.png'
            })
          })
        })
      ],
      overlays: [overlay],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });

    this.olmap.on('singleclick', function (evt) {
      var coordinate = evt.coordinate;
      var hdms = toStringHDMS(toLonLat(coordinate));
    
      content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
      overlay.setPosition(coordinate);
    });

  }
 
  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }
 
  componentDidMount() {
    this.olmap.setTarget("map");
 
    // Listen to map changes
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
  }
 
  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }
 
  userAction() {
    this.setState({ center: [546000, 6868000], zoom: 5 });
  }
 
  render() {
    this.updateMap(); // Update map on render?
    return (
      <div id="map" style={{ width: "100%", height: "300px" }}>
        <button onClick={e => this.userAction()}>setState on click</button>
        <div id="popup" class="ol-popup">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
      </div>
    );
  }
}
 
export default PublicMap;
 