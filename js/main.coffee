$().ready ->
  earthquakesUrl = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
  $.getJSON earthquakesUrl, (data) ->
    earthquakesData = data["features"]
    theEarthquakes = _.map earthquakesData, (earthquake) ->
      savedEarthquake = new Earthquake
      savedEarthquake.set
        mag:          earthquake["properties"]["mag"]
        place:        earthquake["properties"]["place"]
        time:         earthquake["properties"]["time"]
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
  console.log 'started'
  console.log(earthquakes)
  Backbone.history.start()


# regions
region = new Backbone.Marionette.Region
  el: '#content'

app.addRegions
  mainRegion: '#content'


# create model to temporarily store data
class Earthquake extends Backbone.Model


# collection
class Earthquakes extends Backbone.Collection
  model: Earthquake


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
