const requestPromise = require('request-promise');
const logger = require('../logger');

function flattenDataWithOther(sourceObj, destObj, fieldName, otherFieldName) {
  const source = sourceObj[fieldName];
  let array;
  if (Array.isArray(source)) {
    array = source
  } else {
    array = [source];
  }
  if (otherFieldName !== undefined) {
    if (sourceObj[otherFieldName] !== undefined) {
      array.push(sourceObj[otherFieldName]);
    }
  }
  destObj[fieldName] = array.join('\n');
}

function addRowToSheet(data, formsURL) {
  /*
    Will post to google forms
  */
  return requestPromise.get({ uri: formsURL, qs: data, resolveWithFullResponse: true, json: true })
  .then(resp => {
    if (resp.body.result === 'error') {
      logger.info('error found');
      // An error in the user form?
      logger.error('Request OK but error returned - something wrong with the form?');
      logger.error('Data: %j', data);
      return Promise.reject(resp.body)
    }
    logger.info('Google forms submission was successful.');
    return Promise.resolve();
  })
  .catch(err => {
    return Promise.reject(err);
  });
}

module.exports = { addRowToSheet, flattenDataWithOther };
