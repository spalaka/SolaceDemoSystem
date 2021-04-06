import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Header from '../Layout/Header';
import MapOL from '../Maps/OpenLayersMaps';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    backgroundColor: "#b5b5b5",
    margin: "10px"
  }
}));

function GridItem({ classes }) {
  return (
    // From 0 to 600px wide (smart-phones), I take up 12 columns, or the whole device width!
    // From 600-690px wide (tablets), I take up 6 out of 12 columns, so 2 columns fit the screen.
    // From 960px wide and above, I take up 25% of the device (3/12), so 4 columns fit the screen.
    <Grid item xs={12} sm={9} md={3}>
      <Paper className={classes.paper}>item</Paper>
    </Grid>
  );
}
export default function AutoGrid() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header/>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
        <Grid item xs={12} sm={9}>
          <MapOL/>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.paper}>xs=12 sm=6</Paper>
        </Grid>
        {/* <Grid item xs={6} sm={3}>
          <Paper className={classes.paper}>xs=6 sm=3</Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className={classes.paper}>xs=6 sm=3</Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className={classes.paper}>xs=6 sm=3</Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className={classes.paper}>xs=6 sm=3</Paper>
        </Grid> */}
      </Grid>
    </div>
  );
}