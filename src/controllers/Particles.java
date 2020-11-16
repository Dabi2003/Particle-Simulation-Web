package controllers;


import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;  //Importing features I need for all my APIs to function
import server.Main;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;


@Path("Particles/") //started with the Path Particles to show that the request relates to the particles table
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Particles{            //declaring particles class
    @GET//establishing get request
    @Path("get/{Name}")   //the path that captures what particle the user wants
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public  String GetParticle(@PathParam("Name") String Name){
        System.out.println("Invoked Particles.GetParticle() with Name " + Name);//test to show that the API works
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT Name,Symbol,AntiParticle,Charge,Radius,AntiSymbol,Description FROM Particles WHERE Name=?");// reading values of particle records and adding it to prepared statement
            ps.setString(1, Name);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject(); //declaring the record response a JSON object
            if (results.next()==true) {
                response.put("ParticleID", Name);
                response.put("Name", results.getString(1));
                response.put("Symbol", results.getString(2));      //processing of outputing values from database
                response.put("AntiParticle", results.getString(3));
                response.put("Charge", results.getInt(4));
                response.put("Radius", results.getInt(5));
                response.put("AntiSymbol", results.getString(6));
                response.put("Description", results.getString(7));
            } else{
                System.out.println("error"); //outputting an error if something goes wrong
            }
        return response.toString(); // returns the record as a JSON string
        } catch (Exception exception) {
            System.out.println("Database error:" + exception.getMessage());// details of error explained if something goes wrong
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }
    @GET //establishing the get request
    @Path("list")// adding list to the end of the 'Particles/' path
    public String ParticleList(){   //declaring a function to list particles
        System.out.println("Invoked Particles.ParticleList()");  //test to show that API executed it's function
        JSONArray response= new JSONArray(); // declaring the JSON response to be an outputed array
        try{
            PreparedStatement ps=Main.db.prepareStatement("SELECT Name,Charge,Description From Particles"); //readinf values in database
            ResultSet results= ps.executeQuery();
            while (results.next()==true){
                JSONObject row = new JSONObject();
                row.put("Name",results.getString(1));    //outputting values from datbase
                row.put("Charge",results.getInt(2));
                row.put("Description",results.getString(3));
                response.add(row);// adds each record to the JSONArray
            }
            return response.toString();  // my response should be outputed as a JSON string

        } catch(Exception exception){
            System.out.println("Database error: " + exception.getMessage()); // out puts an error if API not working properlly
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";

        }
    }
    @POST
    @Path("save")  //Creating a POST request with Path called "save" so resultant path would be Particles/save
     public  String ParticleSave(@FormDataParam("ParticleID") Integer ParticleID,@FormDataParam("Name") String Name,@FormDataParam("Symbol") String Symbol,@FormDataParam("AntiParticle") String AntiParticle,@FormDataParam("Charge") Integer Charge,@FormDataParam("Radius") Integer Radius,@FormDataParam("Antisymbol") String AntiSymbol,@FormDataParam("Description") String Description,@CookieParam("Token") String Token){
        System.out.println("Invoked Particles.ParticleSave");//Adding my form data parameters which are all the fields in the particles table along with cookie
        try{
            PreparedStatement ps=Main.db.prepareStatement("INSERT INTO Particles (ParticleID,Name,Symbol,AntiParticle,Charge,Radius,AntiSymbol,Description) VALUES");
            ps.setInt(1,ParticleID);
            ps.setString(2,Name);
            ps.setString(3,Symbol);
            ps.setString(4,AntiParticle); //Setting the values for the fields in to a new record to values of form data parameters
            ps.setInt(5,Charge);
            ps.setInt(6,Radius);
            ps.setString(7,AntiSymbol);
            ps.setString(8,Description);
            ps.execute();
            return "{\"OK\": \"Added user.\"}";
        }  catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }


    }






}


