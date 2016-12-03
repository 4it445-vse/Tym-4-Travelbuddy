'use strict';


module.exports = function(Request) {
  var moment = require('moment');

  Request.validateAsync('city', function cityValidator(errorCallback, doneCallback) {
    if (!this.city) {
      errorCallback('cityIsMandatory');
    } else if (this.city.length > 30) {
      errorCallback('cityTooLong');
    }

    doneCallback();
  }, {
    message: {
      cityIsMandatory: 'City is mandatory, so other buddies can find you.',
      cityTooLong: 'City name is too long. Maximum number of characters is 50.',
    },
  });

  Request.validateAsync('from', function fromValidator(errorCallback, doneCallback) {
    if (!this.from) {
      errorCallback('fromIsMandatory');
    } else
    if (!moment(this.from).isValid()) {
      errorCallback('fromIsMandatory');
      errorCallback('fromWrongFromat');
    }

    doneCallback();
  }, {
    message: {
      fromIsMandatory: 'We need to know, when are you planning the trip.',
      fromWrongFromat: 'Date is in wrong format.'
    },
  });

  Request.validateAsync('to', function toValidator(errorCallback, doneCallback) {
    if (!this.to) {
      errorCallback('toIsMandatory');
    } else
    if (!moment(this.to).isValid()) {
      errorCallback('toIsMandatory');
      errorCallback('toWrongFromat');
    } else
    if (!moment(this.to).isSameOrAfter(moment(this.from))) {
      errorCallback('toIsMandatory');
      errorCallback('toBiggerThanFrom');
    }

    doneCallback();
  }, {
    message: {
      toIsMandatory: 'When you are planning the trip?',
      toWrongFromat: 'Right format for date is YYYY-MM-DD.',
      toBiggerThanFrom: 'Date To can not be after date From.'
    },
  });

  Request.validateAsync('text', function textValidator(errorCallback, doneCallback) {
    if (!this.text) {
      errorCallback('textIsMandatory');
    }

    doneCallback();
  }, {
    message: {
      textIsMandatory: 'Tell something about you to future buddies!'
    },
  });

};
