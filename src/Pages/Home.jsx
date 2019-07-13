/* Library Imports */
import React, { Component } from "react";
import { Grid } from "semantic-ui-react";

/* Redux Imports */

/* Component Imports */
import ImageSlider from "../Components/ImageSlider";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <ImageSlider />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
