import React, { Component } from "react";
 
import 'ol/ol.css';
import '../App/App.css';
import Switch from "react-switch";
import BootstrapNavbar from '../Layout/BootstrapNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
 
class Header extends Component {
    constructor() {
        super();
        this.state = { checked: false };
        this.handleChange = this.handleChange.bind(this);
      }
    
      handleChange(checked) {
        this.setState({ checked });
      }
    
      render() {
        return (
            
          <label>
              <BootstrapNavbar />

          </label>
        );
      }
}
 
export default Header;
 