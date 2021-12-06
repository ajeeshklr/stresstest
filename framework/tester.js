
/** 
 * @author Ajeesh B Nair
 * @copyright Ajeesh B Nair
 * @description This module takes care of executing the load test. This is called from loader
 * 
 */

// Guy who really perform some load testing. This is the module which perform all heavy lifting.
const autocannon = require('autocannon')

var cannon = {};

/**
 * Internal framework method, initended to be used by the framework.
 * @param {JSON} config 
 * @param {Function} responseCallback 
 */
var execute = async function (config, responseCallback) {

    var p = new Promise(function (resolve, reject) {
        var instance = autocannon(config, benchMarkFinished);
        if (responseCallback) {
            instance.on('response', responseCallback);
        }

        function benchMarkFinished(err, result) {

            console.log("url : ", result.url);
            console.log("Requests - ", result.requests);
            console.log('Throughput-', result.throughput);
            console.log("duration - ", result.duration);
            console.log("connections - ", result.connections);
            console.log("'1xx' - ", result['1xx']);
            console.log("'2xx' - ", result['2xx']);
            console.log("'3xx' - ", result['3xx']);
            console.log("'4xx' - ", result['4xx']);
            console.log("'5xx' - ", result['5xx']);
            resolve({
                err: err,
                res: result
            });
        }

        instance.on('error', function (err) {
            reject(err);
        });
    });

    return p;

};

cannon.instance = autocannon;

cannon.execute = execute;
module.exports = cannon;