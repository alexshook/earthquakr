// Generated by CoffeeScript 1.9.3
(function() {
  var Earthquake, EarthquakeView, Earthquakes, EarthquakesView, app, region,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  $().ready(function() {
    var earthquakesUrl;
    earthquakesUrl = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
    return $.getJSON(earthquakesUrl, function(data) {
      var earthquakesData, theEarthquakes;
      earthquakesData = data["features"];
      theEarthquakes = _.map(earthquakesData, function(earthquake) {
        var savedEarthquake;
        savedEarthquake = new Earthquake;
        return savedEarthquake.set({
          mag: earthquake["properties"]["mag"],
          place: earthquake["properties"]["place"],
          time: earthquake["properties"]["time"],
          title: earthquake["properties"]["title"],
          url: earthquake["properties"]["url"],
          coordinates: earthquake["geometry"]["coordinates"]
        });
      });
      return window.earthquakes = new Earthquakes(theEarthquakes);
    }).done(function() {
      return app.start({
        earthquakes: earthquakes
      });
    });
  });

  app = new Mn.Application();

  app.on('start', function() {
    var earthquakesView;
    earthquakesView = new EarthquakesView({
      collection: earthquakes
    });
    app.mainRegion.show(earthquakesView);
    console.log('started');
    console.log(earthquakes);
    return Backbone.history.start();
  });

  region = new Backbone.Marionette.Region({
    el: '#content'
  });

  app.addRegions({
    mainRegion: '#content'
  });

  Earthquake = (function(superClass) {
    extend(Earthquake, superClass);

    function Earthquake() {
      return Earthquake.__super__.constructor.apply(this, arguments);
    }

    return Earthquake;

  })(Backbone.Model);

  Earthquakes = (function(superClass) {
    extend(Earthquakes, superClass);

    function Earthquakes() {
      return Earthquakes.__super__.constructor.apply(this, arguments);
    }

    Earthquakes.prototype.model = Earthquake;

    return Earthquakes;

  })(Backbone.Collection);

  EarthquakeView = (function(superClass) {
    extend(EarthquakeView, superClass);

    function EarthquakeView() {
      return EarthquakeView.__super__.constructor.apply(this, arguments);
    }

    EarthquakeView.prototype.tagName = "tr";

    EarthquakeView.prototype.template = "#earthquake-row-template";

    return EarthquakeView;

  })(Marionette.ItemView);

  EarthquakesView = (function(superClass) {
    extend(EarthquakesView, superClass);

    function EarthquakesView() {
      return EarthquakesView.__super__.constructor.apply(this, arguments);
    }

    EarthquakesView.prototype.tagName = "table";

    EarthquakesView.prototype.className = "u-full-width table-header";

    EarthquakesView.prototype.childView = EarthquakeView;

    EarthquakesView.prototype.childViewContainer = "tbody";

    EarthquakesView.prototype.template = "#earthquakes-table-template";

    return EarthquakesView;

  })(Marionette.CompositeView);

}).call(this);
