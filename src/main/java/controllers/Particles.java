package controllers;

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
import java.sql.SQLException;

@Path("Particles/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)


public class Particle {
    @GET
    @Path("get")
    pubilc  String Particles(@FormDataParam("ParticleID") Integer ParticleID, @FormDataParam("Name") String Name, @FormDataParam("Radius") Integer Radius, @FormDataParam("Charge") Integer Charge,
                             @FormDataParam("Symbol") Character Symbol,@FormDataParam("Anti-Particle") S){
        System.out.println("Invoked Particles.GetParticle() with ParticleID " +ParticleID);
        try{
            PreparedStatement ps=Main.db.prepareStatement("SELECT Name,Radius,Charge FROM Particles WHERE ParticleID=?");
            ps.setInt(1,ParticleID);
            ResultSet results = ps.executeQuery();
            JSONObject response=new JSONObject();
            if (results.next()== true) {
                response.put("ParticleID", ParticleID);
                response.put("Name", results.getString(1));


            }

        } catch (SQLException e) {
            e.printStackTrace();
        }


    }

}
