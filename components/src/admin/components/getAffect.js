import axios from "axios";
import React, { Component } from "react";
import url from "../../url";

axios.defaults.withCredentials = true;

class GetAffect extends Component {
  constructor(props) {
    super(props);
    this.state = { done: false };
  }

  componentDidMount() {
    axios
      .post(url + "admin/solve-courses", {
        withCredentials: true,
        headers: { Authorization: "Bearer " + this.state.token }
      })
      .then(
        res => {
          this.setState({ done: true });
          console.log("Course allocation finished");
        },
        err => {
          console.log("Something wrong occured");
          this.setState({ done: false });
        }
      );
  }

  render() {
    return <div>{this.state.done ? "affectation faite" : "affectation en cours..."}</div>;
  }
}

export default GetAffect;
