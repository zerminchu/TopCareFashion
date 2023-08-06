import axios from "axios";
import { Component } from "react";

class DataDisplay extends Component {
  state = {
    detail: [],
  };

  componentDidMount() {
    axios
      .get("http://localhost:8000/user/")
      .then((res) => {
        this.setState({
          detail: res.data,
        });
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }

  render() {
    return (
      <div>
        <header> Data </header>
        <hr />
        {this.state.detail.map((output, id) => (
          <div key={id}>
            <div>
              <h2>{output.userType}</h2>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default DataDisplay;
