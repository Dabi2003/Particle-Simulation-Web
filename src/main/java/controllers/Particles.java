package controllers;                // tip when doing other APIs press Alt Enter to Im

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;


@Path("particles/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)


public class Particles {
    @GET
    @Path("get")
    public  String Particle(@FormDataParam("ParticleID") Integer ParticleID, @FormDataParam("Name") String Name, @FormDataParam("Symbol") Character Symbol, @FormDataParam("Anti-Particle") String Antiparticle,
                             @FormDataParam("Charge") Integer Charge,@FormDataParam("Radius")Integer Radius,@FormDataParam("Anti-Symbol")String Antisymbol,@FormDataParam("Description")String Description){
        System.out.println("Invoked Particles.GetParticle() with ParticleID " + ParticleID);
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT Name,Symbol,Anti-Particle,Charge,Radius,Anti-Symbol,Description FROM Particles WHERE ParticleID=?");
            ps.setInt(1, ParticleID);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            if (results.next()==true) {
                response.put("ParticleID", ParticleID);
                response.put("Name", results.getString(1));
                response.put("Symbol", results.getCharacterStream(2));
                response.put("Anti-Particle", results.getString(3));
                response.put("Charge", results.getInt(4));
                response.put("Radius", results.getInt(5));
                response.put("Anti-Symbol", results.getInt(6));
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

}
