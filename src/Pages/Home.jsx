/* Library Imports */
import React from "react";
import { Grid } from "semantic-ui-react";

/* Redux Imports */

/* Component Imports */
import Dragger from "../Components/Dragger";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Dragger />
        </Grid.Row>
      </Grid>
    );
  }
}

export default Home;
