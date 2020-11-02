package controllers;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("Activity/") //started with the Path parameter called 'Activity'
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)
public class Activites{
    @GET
    @Path("get/{ActivityID}")   //created path to read Activity record
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public  String GetActivity(@PathParam("ActivityID") Integer ActivityID){
        System.out.println("Invoked Activites.GetActivity() with ActivityID " + ActivityID);
        try{
            PreparedStatement ps = Main.db.prepareStatement("SELECT Title,URL,Description FROM Activites WHERE ActivityID=?");
            ps.setInt(1,ActivityID);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            if(results.next()==true){
                response.put("ActivityID",ActivityID);
                response.put("Title",results.getString(1));
                response.put("URL",results.getString(2));
                response.put("Description",results.getString(3));
            } else{
                System.out.println("Error");
            }
            return response.toString();

        }catch (Exception exception) {
            System.out.println("Database error:" + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }

}
