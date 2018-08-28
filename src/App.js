import React, {Component} from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp'

import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Button, Input, MenuItem, List, Hidden} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import MyFancyComponent from './app/MapComp';


const drawerWidth = 340

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: "100%",
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        display: "flex",
        justifyContent: "space-between",
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: 0,
        minWidth: 0, // So the Typography noWrap works
    },
    flex: {
        flexGrow: 1,
    },
    locationList: {
      overflowY: "scroll"
    },
    filterInput: {
        height: "100px",
        lineHeight: "2",
        marginTop: "20px"
    },
    locationForm: {
      color: "#000",
      background: "rgba(255,255,255, 0.3)",
      borderRadius: "10px",
      padding: "0 10px",
    },
    input: {
      color: "#eee"
    },
    toolbar: theme.mixins.toolbar,
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMarkerShown: true,
            mobileOpen: false,
            locations: [],
            query: "",
            isOpen: "",
        };

        this.onToggleOpen = this.onToggleOpen.bind(this);
        this.closeWindows = this.closeWindows.bind(this);
    }

    filterLocations(query) {
        this.setState({query});
    }

    searchLocations(query) {
        if (query !== "")
            fetch(`https://api.foursquare.com/v2/venues/explore?client_id=D3TYG0N52G2CCG15S0W1KVOSFTL13PFSBNTNSWYQWHEB03U1&client_secret=ZAUNBOXE2CKX0KJ1FT5XBF55ENZ4YA2WTDPZE2W2P3ZQBBT5&v=20180323&limit=1000&ll=32.1500,34.8839&query=${query}`)
            // https://api.tomtom.com/search/2/search/${query}.json?key=n9R000qQ4FM75YR9xfDlaiywPO8oSCm4&lat=32.1500&lon=34.8839&radius=3000
                .then((res) => res.json())
                .then((data) => {
                    console.log(data.response.groups[0].items);
                    this.setState({locations: data.response.groups[0].items})
                })
                .catch((err) => {
                        console.log(err);
                        this.setState({locations: []})
                    }
                );
        else this.setState({locations: []})
    }

    onToggleOpen = (id) => {
      this.setState({isOpen: id});
    };

    closeWindows = () => {
        this.setState({isOpen: ""});
    };

    componentDidMount() {
        this.searchLocations("sports");
    }

    handleDrawerToggle = () => {
      this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };


    render() {
      const {classes} = this.props;
      const {locations, query} = this.state;       

        let showingLocations;

        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i');
            showingLocations = locations.filter((location) => match.test(location.venue.name));
        } else {
            showingLocations = locations;
        }

        const drawer = (
          <List className={classes.locationList}>
              {showingLocations
                  .map((location) => (
                          <MenuItem key={location.venue.id}
                                    selected={this.state.isOpen[location.venue.id]}
                                    style={{whiteSpace: 'normal', textAlign: "center"}}>
                              <Button className={classes.flex}
                                      onClick={() => this.onToggleOpen(location.venue.id)}>
                                  <Typography variant="button">
                                      {location.venue.name}
                                  </Typography>
                              </Button>
                          </MenuItem>
                      )
                  )}
          </List>)

          const loadLocations = (
            <form className={classes.locationForm}
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.searchLocations(e.target.querySelector("#searchLocations").value)}}>
                <Typography variant="subheading" color="inherit">
                    <label>Load other locations:</label>
                </Typography>
                <Input className={classes.input} type="text" id="searchLocations" color="#fff"/>
                <Input type="submit" value="load"/>
            </form>
          )

        return (
            <div className={classes.root}>
                <AppBar position="absolute" className={classes.appBar}>
                    <Toolbar className={classes.appBar}>
                    <IconButton
                      color="inherit"
                      aria-label="Open drawer"
                      onClick={this.handleDrawerToggle}
                      className={classes.navIconHide}
                    >
                      <MenuIcon />
                    </IconButton>
                        <Typography variant="title" color="inherit" noWrap className={classes.flex}>
                            NetHood
                        </Typography>
                        <Hidden smDown>
                          {loadLocations}
                        </Hidden>
                    </Toolbar>
                </AppBar>
                <Hidden smDown>
                <Drawer variant="permanent"
                        classes={{paper: classes.drawerPaper, }}>
                        <div className={classes.toolbar}/>
                  <TextField
                    onChange={(value) => this.filterLocations(value.target.value)}
                    className={classes.filterInput}
                    placeholder="Filter Locations"/>
                    {drawer}
                </Drawer>
                </Hidden>
                <Hidden mdUp>
                <Drawer variant="temporary"
                        anchor={'left'}
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerToggle}
                        classes={{paper: classes.drawerPaper, }}
                        ModalProps={{
                          keepMounted: true, // Better open performance on mobile.
                        }}>
                  {loadLocations}
                  <TextField
                    onChange={(value) => this.filterLocations(value.target.value)}
                    className={classes.filterInput}
                    placeholder="Filter Locations"/>
                    {drawer}
                </Drawer>
                </Hidden>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <div style={{height: "100%", width: "100%"}}>
                    <MyFancyComponent
                        isMarkerShown={this.state.isMarkerShown}
                        markers={this.state.locations}
                        isOpen={this.state.isOpen}
                        onToggleOpen={this.onToggleOpen}
                        closeWindows={this.closeWindows}
                        filterQuery={this.state.query}/>
                    </div>
                </main>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);