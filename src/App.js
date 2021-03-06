import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import './App.css';
import getVenues from './api/api';
import Header from './components/Header';
import Search from './containers/Search';
import Locations from './containers/Locations';
import GoogleMap from './containers/GoogleMap';
import Footer from './components/Footer';
import { Main, Wrapper } from './styles/appStyles';

/**s
 * @description React class component - inits maps, gets venues,
 */
export default class App extends Component {
  state = {
    venue: '',
    venues: [],
    map: {},
    markers: [],
    listItems: [],
    hasMap: false
  };

  /**
   * @description Update state with retrieved venues.
   * If error, init map with stored venues and log error.
   */
  componentDidMount() {
    if (this.state.venues.length === 0) {
      getVenues()
        .then(res => {
          if (!res) return;
          localStorage.setItem('venues', JSON.stringify(res));
          this.setState(
            {
              venues: res.data.response.groups[0].items,
              listItems: res.data.response.groups[0].items
            },
            this.initMap
          );
        })
        .catch(() => {
          const storedVenues = JSON.parse(localStorage.getItem('venues'));
          this.setState({
            venues: storedVenues.data.response.groups[0].items,
            listItems: storedVenues.data.response.groups[0].items
          });
          console.log('Failed to connect to FourSquare API');
        });
    }
  }

  /**
   * @description Init Google Map and populate with venue markers.
   * Create info window and set event listener to add location-specific content.
   * Re-render with updated markers each time function is invoked.
   * * Use Google Places Library to retrieve additional location data
   */
  initMap = (venues = this.state.venues) => {
    if (!window.google) {
      console.log('Failed to connect to Google Maps API');
      return;
    }

    const mapCenter = { lat: 36.162177, lng: -86.849023 };

    var map = new window.google.maps.Map(
      window.document.getElementById('map'),
      {
        center: mapCenter,
        zoom: 20
      }
    );

    this.setState(state => (state.markers.length = 0));

    const infoWindow = new window.google.maps.InfoWindow();

    var bounds = new window.google.maps.LatLngBounds();

    const markers = [];

    venues.forEach(ven => {
      const { name, location } = ven.venue;
      const latLng = { lat: location.lat, lng: location.lng };

      var marker = new window.google.maps.Marker({
        position: latLng,
        map: map,
        animation: window.google.maps.Animation.DROP
      });

      bounds.extend(latLng);

      const getVenueDetails = results => {
        if (!results) return;

        const { rating, opening_hours = '', formatted_address } = results[0];
        const content = `<div class="info-window" role="dialog" aria-labelledby="dialog-title">
                          <h3 id="dialog-title" class="m-md">${name}</h3>
                          <p>${location.address || formatted_address}</p>
                          <div class="info-window__content">
                            <p class="m-md info-window__rating"><span class="text--bold">Rating:</span> ${rating}</p>
                            <p class="m-md text--bold ${
                              opening_hours.open_now === true
                                ? 'color--success'
                                : 'color--warn'
                            }">${
          opening_hours.open_now === true ? 'Open' : 'Closed'
        }<p>
                          </div>
                        </div>`;

        marker.addListener('click', () => {
          const animateMarker = marker => {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 750);
          };

          infoWindow.open(map, marker, animateMarker(marker));
          infoWindow.setContent(content);
        });
      };

      const request = {
        query: name,
        fields: ['rating', 'opening_hours', 'formatted_address'],
        locationBias: {
          lat: location.lat,
          lng: location.lng
        }
      };

      const service = new window.google.maps.places.PlacesService(map);
      service.findPlaceFromQuery(request, getVenueDetails);

      markers.push([marker, name]);
    });

    this.setState({ markers });

    map.fitBounds(bounds);
    this.setState({ hasMap: true });
  };

  /**
   * @description Test if venue has been passed
   * and call initMap with new venues.
   * @param {string} searchedVenue - filtered venues.
   */
  updateMarkers(searchedVenue) {
    if (searchedVenue) {
      this.initMap(searchedVenue);
    }
  }

  /**
   * @description Show info window of corresponding marker.
   * @param { string } venueName - name of clicked venue.
   */
  showMarkerInfo = venueName => {
    const filteredMarker = this.state.markers.filter(marker => {
      return marker[1].toLowerCase() === venueName.toLowerCase();
    });

    if (filteredMarker.length === 0) return;

    window.google.maps.event.trigger(filteredMarker[0][0], 'click');
  };

  /**
   * @description Update state with filtered venues
   * and call updateMarkers func with venues.
   * @param { string } venue - name of searched venue.
   */
  getLocation = venue => {
    if (!venue) {
      this.initMap();
      this.setState({ venue, listItems: this.state.venues });
      return;
    }

    const searchedVenue = this.state.venues.filter(ven =>
      ven.venue.name.toLowerCase().includes(venue.toString().toLowerCase())
    );

    this.setState({ venue, listItems: searchedVenue });
    this.updateMarkers(searchedVenue);
  };

  /**
   * @description Render app.
   * Wrap component in ThemeProvider, so app has access to theme styles
   */
  render() {
    const { venue, listItems } = this.state;
    return (
      <>
        <ThemeProvider theme={theme}>
          <Wrapper>
            <Header />
            <Main>
              <div className="row-1">
                <Search getLocation={this.getLocation} />
                <Locations
                  showMarkerInfo={this.showMarkerInfo}
                  venue={venue}
                  listItems={listItems}
                />
              </div>
              <div className="row-2">
                <GoogleMap
                  hasMap={this.state.hasMap}
                  initMap={this.initMap}
                  venues={this.state.venues}
                />
              </div>
              <Footer />
            </Main>
          </Wrapper>
        </ThemeProvider>
      </>
    );
  }
}
