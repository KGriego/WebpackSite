/* Library Imports */
import React from "react";
import { Grid } from "semantic-ui-react";

/* Redux Imports */

/* Component Imports */
import Dragger from "../Components/Dragger";

function Home() {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Dragger />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Home;
