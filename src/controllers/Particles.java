package controllers;


import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;


@Path("Particles/") //started with the Path parameter ttttttttt
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Particles{            //declaring particles class
    @GET
    @Path("get/{ParticleID}")   //created a path to read particle record
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public  String GetParticle(@PathParam("ParticleID") Integer ParticleID){
        System.out.println("Invoked Particles.GetParticle() with ParticleID " + ParticleID);
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT Name,Symbol,AntiParticle,Charge,Radius,AntiSymbol,Description FROM Particles WHERE ParticleID=?");
            ps.setInt(1, ParticleID);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            if (results.next()==true) {
                response.put("ParticleID", ParticleID);
                response.put("Name", results.getString(1));
                response.put("Symbol", results.getString(2));
                response.put("AntiParticle", results.getString(3));
                response.put("Charge", results.getInt(4));
                response.put("Radius", results.getInt(5));
                response.put("AntiSymbol", results.getString(6));
                response.put("Description", results.getString(7));
            } else{
                System.out.println("error");
            }
        return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error:" + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }
    @GET
    @Path("list")
    public String ParticleList(){
        System.out.println("Invoked Particles.ParticleList()");
        JSONArray response= new JSONArray();
        try{
            PreparedStatement ps=Main.db.prepareStatement("SELECT Name,Charge,Description From Particles");
            ResultSet results= ps.executeQuery();
            while (results.next()==true){
                JSONObject row = new JSONObject();
                row.put("Name",results.getString(1));
                row.put("Charge",results.getInt(2));
                row.put("Description",results.getString(3));
                response.add(row);
            }
            return response.toString();

        } catch(Exception exception){
            System.out.println("Database error: " + exception.getMessage());
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


