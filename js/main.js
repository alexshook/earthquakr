// Generated by CoffeeScript 1.9.3
var Earthquake, EarthquakeView, Earthquakes, EarthquakesView, MenuView, app,
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
        time: new Date(earthquake["properties"]["time"]),
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
  var earthquakesView, menuView;
  earthquakesView = new EarthquakesView({
    collection: earthquakes
  });
  app.mainRegion.show(earthquakesView);
  menuView = new MenuView;
  app.menuRegion.show(menuView);
  return Backbone.history.start();
});

app.addRegions({
  menuRegion: '#menu',
  mainRegion: '#content'
});

MenuView = (function(superClass) {
  extend(MenuView, superClass);

  function MenuView() {
    return MenuView.__super__.constructor.apply(this, arguments);
  }

  MenuView.prototype.template = "#menu-template";

  MenuView.prototype.events = {
    "click #highest-first": function() {
      return earthquakes.orderBy("magHighest");
    },
    "click #lowest-first": function() {
      return earthquakes.orderBy("magLowest");
    },
    "click #most-recent": function() {
      return earthquakes.orderBy("timeMostRecent");
    },
    "click #least-recent": function() {
      return -earthquakes.orderBy("timeLeastRecent");
    }
  };

  return MenuView;

})(Marionette.LayoutView);

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

  Earthquakes.prototype.orderKey = "mag";

  Earthquakes.prototype.comparator = function(earthquake) {
    if (this.orderKey === "magHighest") {
      return -earthquake.get("mag");
    } else if (this.orderKey === "magLowest") {
      return earthquake.get("mag");
    } else if (this.orderKey === "timeMostRecent") {
      return -earthquake.get("time");
    } else if (this.orderKey === "timeLeastRecent") {
      return earthquake.get("time");
    }
  };

  Earthquakes.prototype.orderBy = function(columnName) {
    this.orderKey = columnName;
    return this.sort();
  };

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
