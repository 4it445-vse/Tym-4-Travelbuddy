'use strict';


module.exports = function(Request) {
  var moment = require('moment');

  Request.validateAsync('city', function cityValidator(errorCallback, doneCallback) {
    if (!this.city) {
      errorCallback('cityIsMandatory');
    } else if (this.city.length > 70) {
      errorCallback('cityTooLong');
    }

    doneCallback();
  }, {
    message: {
      cityIsMandatory: 'Město je povinné pole, to abychom Vás mohli najít.',
      cityTooLong: 'Název města je příliš dlouhý. Maximální počet znaků je 70.',
    },
  });

  Request.validateAsync('from', function fromValidator(errorCallback, doneCallback) {
    if (!this.from) {
      errorCallback('fromIsMandatory');
    } else if (!moment(this.from).isValid()) {
      errorCallback('fromIsMandatory');
      errorCallback('fromWrongFromat');
    }

    doneCallback();
  }, {
    message: {
      fromIsMandatory: 'Potřebujeme vědět, od kdy plánujete cestu.',
      fromWrongFromat: 'Datum je ve špatném formátu.'
    },
  });

  Request.validateAsync('to', function toValidator(errorCallback, doneCallback) {
    if (!this.to) {
      errorCallback('toIsMandatory');
    } else if (!moment(this.to).isValid()) {
      errorCallback('toIsMandatory');
      errorCallback('toWrongFromat');
    }

    doneCallback();
  }, {
    message: {
      toIsMandatory: 'Potřebujeme vědět, do kdy plánujete cestu.',
      toWrongFromat: 'Datum je bohužel ve špatném formátu.'
    },
  });

  Request.validateAsync('text', function textValidator(errorCallback, doneCallback) {
    if (!this.text) {
      errorCallback('textIsMandatory');
    }

    doneCallback();
  }, {
    message: {
      textIsMandatory: 'Řekněte něco o sobě potencionálním buddíkům!'
    },
  });

};
