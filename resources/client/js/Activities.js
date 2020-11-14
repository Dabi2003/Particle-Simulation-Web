function getPP(){  // declaring a function to fetch the "Pair Production web page
    console.log("Invoked getPP()");  // A test to see if the function was actually called
    let ActivityID=1; //declaring the ActivityID to 1 which is the same ActivityID for the record in the database
    //debugger;
    const url="/Activity/get/";// this is the first part of the API path to get the record
    fetch(url+ActivityID,{ // The API is called and the record is specified
        method:"GET", // declaring that it's a get method
    }).then(response=>{
        return response.json(); // returns the record as JSON
    }).then(response=>{
        if(response.hasOwnProperty("Error")){  // Checks if web browser has an error
            alert(JSON.stringify(response)); //If there is convert JSON Object to a string
        } else{
            window.open(response.URL); // this is a test to see if the correct URL was fetched.

        }


    });



}