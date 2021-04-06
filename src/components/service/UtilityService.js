import React, { Component } from "react";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import OpenLayersMaps from '../Maps/OpenLayersMaps';

class UtilityService extends Component{

    mapPoints = [];

    constructor(){
        super();
        this.portid = "";
        this.portname = "";
        this.porttype = "";
        this.lat = "";
        this.long = "";
        this.country = "";
        this.moment_status = "";
        this.congestion = "";
        this.container_count = "";
        this.shipments_count = "";
        this.orgin_port = "";
        this.dest_port = "";
        this.Arriving_Hours = "";
        // this.mapPoints = this.props.mapGlbPoints;
        console.log(this.mapPoints);

    }

    pushToMapStore(dataString){
        var oceanData = dataString.toString().split(" ")[1].split("/");
        console.log(oceanData)
        //Ported/portname/porttype/lat/long/country/moment_status/congestion/container_count/shipments_count/orgin_port/dest_port/Arriving_Hours
        this.portid = oceanData[1];
        this.portname = oceanData[2];
        this.porttype = oceanData[3];
        this.lat = parseInt(oceanData[4]);
        this.long = parseInt(oceanData[5]);
        this.country = oceanData[6];
        this.moment_status = oceanData[7];
        this.congestion = oceanData[8];
        this.container_count = oceanData[9];
        this.shipments_count = oceanData[10];
        this.orgin_port = oceanData[11];
        this.dest_port = oceanData[12];
        this.Arriving_Hours = oceanData[13];
        var mapLocalPoints = [this.lat,this.long];
        this.mapPoints.push(mapLocalPoints);

        
    }

    // iconFeature = new Feature({
    //     geometry: new Point(fromLonLat(location.location)),
    //     name: location.name
    //   });

    render() {
        this.updateMap(); // Update map on render?
        return (
          <div id="map" style={{ width: "100%", height: "300px" }}>
           <OpenLayersMaps store = {this.mapPoints} />
            {/* <button onClick={e => this.userAction()}>setState on click</button> */}
          </div>
        );
      }

}

// ReactDOM.render(
//     // passing props
//     <UtilityService store = {mapGlbPoints} />,
//     document.getElementById("root")
// );

export default UtilityService;