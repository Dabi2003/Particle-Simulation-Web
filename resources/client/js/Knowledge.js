function getParticleList(){ //declaring a function to get my particle list unto the page
    //debugger;
    console.log("Invoked getParticleList()") //testing to see weather the function has been called.
    const url="/Particles/list";
    fetch(url,{
        method: "GET", //Get method
    }) .then(response=> {
        return response.json();  //return response as JSON
    }).then(response=>{
        if(response.hasOwnProperty("Error")) { //checks if response in the web browser has an error
           alert(JSON.stringify(response)); // if it does, convert JSON object to string and alert (pop up window)
        } else{
            formatParticleList(response) ; //this function will create an HTML table of the data (as per previous lesson)

        }
    });

}

function formatParticleList(myJSONArray) { //function to start listing the particle data from database
    let dataHTML = ""; // setting variable  for each record of the particle table
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + "Name: "+item.Name + "<td><td>" +"Charge: "+ item.Charge + "<td><td>"+ "Description:"+item.Description+ "<tr><td>"; // adding the record to an invisible table
    }
    document.getElementById("ParticleTable").innerHTML = dataHTML; // outputting table unto page

}