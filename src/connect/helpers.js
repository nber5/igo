'use strict';

var moment      = require('moment');
var dust        = require('dustjs-linkedin');
var dustHelpers = require('dustjs-helpers');
var i18next     = require('i18next');

module.exports = function(req, res, next) {

  res.locals.lang    = req.locale;
  res.locals.session = req.session;

  //
  res.locals.t = function(chunk, context, bodies, params) {
    var key         = dust.helpers.tap(params.key, chunk, context);
    var translation = req.t(key, params);
    return chunk.write(translation);
  };

  next();
};

// translate
dust.helpers.t = function(chunk, context, bodies, params) {
  var key         = dust.helpers.tap(params.key, chunk, context);
  var translation = i18next.t(key, params);
  return chunk.write(translation);
};

// date formatting
dust.helpers.dateformat = function(chunk, context, bodies, params) {
  var val = dust.helpers.tap(params.date, chunk, context);
  if (!val) return chunk;

  if (params.lang) {
    var locale = dust.helpers.tap(params.lang, chunk, context);
    moment.locale(locale);
  }

  var m = moment(val);
  if (m !== null && m.isValid()) {
    if (params.format === 'calendar') {
      chunk.write(m.calendar());
    } else {
      chunk.write(m.format(params.format || 'YYYY-MM-DD HH:mm:ss'));
    }
  }
  return chunk;
};


// load custom helpers
try {
  var helpers = require(process.cwd() + '/app/helpers');
  helpers.init(dust);
} catch(err) {
  // ignore
}
