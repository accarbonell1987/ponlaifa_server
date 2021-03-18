const { DateTime } = require('luxon');

exports.Now = () => DateTime.utc().toSQL({ includeOffset: false });
