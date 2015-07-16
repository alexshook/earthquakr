console.log 'loaded bro'

# creating Marionette App
app = new Mn.Application();

app.on 'start', ->
 Backbone.history.start()
 console.log 'started'

app.start()

region = new Backbone.Marionette.Region
  el: '#content'

app.addRegions
  content: '#content'

$.getJSON "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", (data) ->
  console.log data['features']
