// Main file which gets executed when npm start is used.
// Initializes each Loadtesting framework code and then loads all testcases for execution.


var loader = require("./framework/loader");

async function execute() {
    await loader.init();
   var result =  await loader.run();
   console.log("Total tests - ", result.s + result.f , " Successfull - ", result.s , " Failed - ", result.f);

}

execute();