/**
 * @author Ajeesh B Nair
 * @copyright Ajeesh B Nair
 * @description Loader for reading configurations and loading test cases. Fascilitates execution of test cases using standard interfaces
 *
 */

// Load all LoadTests from the files and consolidate.
var fs = require('fs');
require("./runner"); // Initialzie runner only once


var config;
var loader = {};

function readAppConfigs() {
    //  read configurations
    var rawData = fs.readFileSync('./app.json');
    config = JSON.parse(rawData);
}

readAppConfigs();

function loadTestCases(fileName) {
    require(fileName);
}

// Initialize all and return promse.
loader.init = function () {
    var p = new Promise(function (resolve, reject) {
        // Read test cases from the files loaded.
        for (var i in config.files) {
            loadTestCases(config.files[i]);
        }
        resolve();

    });
    return p;
}

async function forEachAsync(array, callback) {
    for (var i = 0; i < array.length; i++) {
        await callback(array[i], i, array);
    }
}

async function executeTest(x) {

    var success = 0,
        failure = 0;
    if (!x.exclude) {

        const tester = require("./tester");
        console.log("Executing test ", x.desc);
        // Use autocannon configuration and execute async.

        try {
            // Print test case value just for the timebeing.
            var cfg = x.fn(); // Usually this will be the configuration / input for autocannon.
            var count = 0;

            function responseCallback(client, statusCode, returnBytes, responseTime) {
                if (cfg.reset) {
                    if (cfg.getHeader && typeof (cfg.getHeader) == "function") {
                        var header = cfg.getHeader();
                        if (!!header) {
                            client.setHeaders(header);
                        }
                    }

                    if (cfg.getBody && typeof (cfg.getBody) == "function") {
                        var body = cfg.getBody();
                        if (!!body) {
                            client.setBody(body);
                        }
                    }


                    count++;
                }
            }

            if (!cfg.timeout) {
                cfg.timeout = config.timeout;
            }
            if(!cfg.method){
                cfg.method = config.method;
            }
            

            await tester.execute(cfg, cfg.reset ? responseCallback : null);
            success++;

            if (cfg.reset) {
                console.log("Total time response is called for setting custome headers and details. ", count);
            }
        } catch (ex) {
            console.log(ex);
            failure++;
        }
    }

    return {
        s: success,
        f: failure
    };

}

var performLoadTest = async function (explain) {

    var p = new Promise(async function (resolve, reject) {

        // retrieve tester
        var success = 0,
            failure = 0;
        console.log("Executing explain ", explain.desc);
        await forEachAsync(explain.lt, async function (x, index, array) {

            var res = await executeTest(x);
            success += res.s;
            failure += res.f;
        });

        var result = {
            s: success,
            f: failure
        };
        resolve(result);

        return result;
    });
    return p;

}

loader.run = async function () {

    // Use each describe and execute each test cases one by one.
    var success = 0,
        failure = 0;

    try {

        await forEachAsync(global.explain.explains, async explain => {
            if (!explain.exclude) {

                var results = await performLoadTest(explain);
                success += results.s;
                failure += results.f;
            }
        });

        // Execute all global tests
        await forEachAsync(global.lt.tests, async function (x, index, array) {
            var res = await executeTest(x);
            success += res.s;
            failure += res.f;
        });

    } catch (e) {
        console.error(e);
    }
    return {
        s: success,
        f: failure
    };
}

module.exports = loader;