$().ready ->
  earthquakesUrl = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
  $.getJSON earthquakesUrl, (data) ->
    earthquakesData = data["features"]
    theEarthquakes = _.map earthquakesData, (earthquake) ->
      savedEarthquake = new Earthquake
      savedEarthquake.set
        mag:          earthquake["properties"]["mag"]
        place:        earthquake["properties"]["place"]
        time:         new Date earthquake["properties"]["time"]
        title:        earthquake["properties"]["title"]
        url:          earthquake["properties"]["url"]
        coordinates:  earthquake["geometry"]["coordinates"]
    window.earthquakes = new Earthquakes theEarthquakes
  .done ->
    app.start
      earthquakes: earthquakes


# creating Marionette App
app = new Mn.Application();

app.on 'start', ->
  earthquakesView = new EarthquakesView
    collection: earthquakes
  app.mainRegion.show(earthquakesView)

  menuView = new MenuView
  app.menuRegion.show(menuView)

  mapView = new MapView
  app.mapRegion.show(mapView)

  mapView.startMap(mapView.mapOptions)
  mapView.addMarkers(earthquakes)

  Backbone.history.start()


# regions
app.addRegions
  menuRegion: '#menu'
  mainRegion: '#content'
  mapRegion: '#map'


# render menu options
class MenuView extends Marionette.LayoutView
  template: "#menu-template",
  events:
    "click #highest-first": () -> earthquakes.orderBy "magHighest"
    "click #lowest-first": () -> earthquakes.orderBy "magLowest"
    "click #most-recent": () -> earthquakes.orderBy "timeMostRecent"
    "click #least-recent": () -> earthquakes.orderBy "timeLeastRecent"


# view for displaying google map
class MapView extends Marionette.LayoutView
  template: "#map-canvas-template",
  tagName: 'div',
  className: 'map-section',
  mapOptions:
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    center:
      lat: -10.4436
      lng: 165.1715
  startMap: (mapOptions) ->
    window.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)
  addMarkers: ->
    _.map earthquakes['models'], (earthquake) ->
      latLng = new google.maps.LatLng(earthquake['attributes']['coordinates'][1], earthquake['attributes']['coordinates'][0])
      marker = new google.maps.Marker
        position: latLng,
      marker.setMap(map)


# create model to temporarily store data
class Earthquake extends Backbone.Model


# collection
class Earthquakes extends Backbone.Collection
  model: Earthquake,
  orderKey: "mag",
  comparator: (earthquake) ->
    if @orderKey == "magHighest"
      -earthquake.get "mag"
    else if @orderKey == "magLowest"
      earthquake.get "mag"
    else if @orderKey == "timeMostRecent"
      - earthquake.get "time"
    else if @orderKey == "timeLeastRecent"
      earthquake.get "time"
  orderBy: (columnName) ->
    @orderKey = columnName
    @sort()


# views
# display one earthquake
class EarthquakeView extends Marionette.ItemView
  tagName: "tr",
  template: "#earthquake-row-template"


# display lots of earthquakes
class EarthquakesView extends Marionette.CompositeView
  tagName: "table",
  className: "u-full-width table-header",
  childView: EarthquakeView,
  childViewContainer: "tbody",
  template: "#earthquakes-table-template"
