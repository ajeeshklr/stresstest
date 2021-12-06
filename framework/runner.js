/** 
 * @author Ajeesh B Nair
 * @copyright Ajeesh B Nair
 * @description Runner which provides interfaces for writing load test cases.
 * 
 */

// Runner for performing testing 
// Runner will be invoked for each test cases in the load test and performed accordingly.

var runner = {};
var explains = [];
var tests = [];
var globalTests = [];
var testCount = 0;
var explainCount = 0;

/**
 * Explains a group of load test scenarios. This provides grouping to test cases and can be used to effectively all test cases.
 * @param {String} description A unique description to identify the group of test cases.
 * @param {Function} callback Body for the explain where all related test cases are available.
 * @param {Boolean} exclude True to exclude this explain from executing , false otherwise. Marking this true will exclude all test cases under the particular explain.
 * 
 */
function explain(description, callback, exclude) {
    var exp = {
        desc: description,
        lt: [],
        exclude: exclude
    };

    tests = [];
    callback(); // Execute the explain code and fetch all tests.
    exp.lt = tests.slice(0);
    tests = []; // reset the array after the counter is reached.

    // Remove the test cases from 
    exp.lt.forEach(function (value, index, arr) {
        var ind = globalTests.indexOf(value);
        if (ind >= 0) {
            globalTests.splice(ind, 1);
        }
    });

    explains.push(exp);
    explainCount++;
}

/**
 * Load test scenario to execute. This can be part of an explain or can be a standalone test case.
 * @param {String} description  A valid description for the test case to uniquely identify the testcase from other test cases.
 * @param {Function} fn Body of the load test case. Once invoked by the framework, this will return a configuration for the "autocannon" load runner framework.
 * @param {Boolean} exclude True to exclude this test case from running, ignore this filed or provide false otherwise.
 */
function lt(description, fn, exclude) {
    var test = {
        desc: description,
        fn: fn,
        exclude: exclude
    };
    tests.push(test);
    globalTests.push(test);

    testCount++;
}

global.explain = explain;
global.lt = lt;

global.explain.explains = explains;
global.lt.tests = globalTests; // All tests.
