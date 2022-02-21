import React, { Component } from "react";
import withAuth from "../../components/Authentication";
import PretestPanel from "../PretestPanel";
import BikeIndex from "../BikeIndex";
import jwt_decode from "jwt-decode";
import localStorageService from "../../services/localStorageService";
import './style.css'
const qs = require("query-string");

const BikeIndexWithAuth = withAuth(BikeIndex);

class MainPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <BikeIndexWithAuth />
  }
}

export default MainPage;
