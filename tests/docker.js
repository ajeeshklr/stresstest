/**
 * @author Ajeesh B Nair
 * @copyright Ajeesh B Nair
 * @description Sample test cases which demonstrate the use of this load testing framework.
 */
var fs = require('fs');

explain("Sample docker test",()=> {
    lt("load ", () => {
        var cfg = {
      //      url: `http://192.168.0.1/index.htm`,
            url: `http://localhost/tutorial/`,
            connections: 2000, // How many simultaneous connection to the host(concurrent users)
            //duration: 60,  // Total duration this test needs to execute.
            method: 'GET',  // Request type.
            timeout: 45,    // Total seconds before the request timed out.
            pipelining: 2,  // HTTP request pipeline
            amount: 3000000,
            getHeader : function(){
                // Custom header to set when ever this test execute.
            },
            getBody : function(){
                // Custom request Body to set whenever this test excecute.
                // Useful for POST methods.
            },
            reset:false // If you need to pass custom headers and body, use this flag. This will ensure that custom headers are set for every request to the URL in this configuration.
        }
        return cfg;
    });
})