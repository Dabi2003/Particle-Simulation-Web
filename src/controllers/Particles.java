package controllers;


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
    @Path("get/{ParticleID}")   //created a path to read
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
    public String Particlelist(){
        System.out.println("Invoked Particles.Particlelist()");
        JSONArray response= new JSONArray();
        try{
            PreparedStatement ps=Main.db.prepareStatement("SELECT Name,Charge,Description From Particles");
            ResultSet results= ps.executeQuery();
            while (results.next()==true){
                JSONObject row = new JSONObject();
                row.put("Name",results.getString(1));
                row.put("Charge",results.getString(2));
                row.put("Description",results.getString(3));
                response.add(row);
            }
            return response.toString();

        } catch(Exception exception){
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";

        }
    }




}


