using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using WebTestingMVC.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.IO;
using Microsoft.AspNetCore.Http.Features;
using Azure;
using System.Reflection.PortableExecutable;

namespace WebTestingMVC.Controllers
{

    public class TestingController : Controller

    {
        string connectionstring = "Server=VITVIT\\SQLEXPRESS02;DataBase=WebTesting;Trusted_Connection=True;";
        public IActionResult webtesting()
        {  
            return View();
        }
        [HttpPost]
        public IActionResult Login(WebTestingModel data)
        {
            if (data.EmailDatas == null || data.InputPasswords == null)
            {
                return Ok("2");
            }

            string query = "SELECT ID, FullName,Position FROM UserInformation WHERE Email = @EmailData AND Password = @InputPassword UNION SELECT ID, FullName,Position FROM AdminInformation WHERE Email = @EmailData AND Password = @InputPassword";

            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@EmailData", data.EmailDatas);
                cmd.Parameters.AddWithValue("@InputPassword", data.InputPasswords);

                conn.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    var list = new Dictionary<string, string>();
                    list["fullName"] = reader["FullName"].ToString();
                    list["id"] = reader["ID"].ToString();
                    list["position"] = reader["Position"].ToString();
                    return Ok(list);
                }
                else
                {
                    return Ok("0");
                }
            }
        }
        [HttpPost]
        public IActionResult Register(WebTestingModel response)
        {
            string query = "DECLARE @fullName VARCHAR(100); SET @fullName = CONCAT(@firstName, ' ', @lastName); INSERT INTO UserInformation (FullName, Dob, Email,Password) VALUES (@fullName, @dob, @email, @password)";
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@firstName", response.FirstName);
                cmd.Parameters.AddWithValue("@lastName", response.LastName);
                cmd.Parameters.AddWithValue("@dob", response.DOB);
                cmd.Parameters.AddWithValue("@email", response.Email);
                cmd.Parameters.AddWithValue("@password", response.Password);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
            return Ok("0");
        }

        [HttpPost]
        public IActionResult ordernum(WebTestingModel response)
        {
            string query = "SELECT COUNT(*) as ordernum FROM OrderInformation WHERE Active='0' and Finish='0' and UserID=@userid";
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@userid", response.userid);
                conn.Open();
                int specificnum = (int)cmd.ExecuteScalar();
                return Ok(specificnum);
            }
        }

        [HttpPost]
        public IActionResult profile(WebTestingModel data)
        {
            string query = "select FullName,DOB,Email from UserInformation where ID=@ID and Position=@UserPosition UNION select FullName,DOB,Email from AdminInformation where ID=@ID and Position=@UserPosition";
            using (SqlConnection conn = new SqlConnection(connectionstring)) 
            using(SqlCommand cmd = new SqlCommand(query,conn))
            {
                cmd.Parameters.AddWithValue("@ID", data.UserID);
                cmd.Parameters.AddWithValue("@UserPosition", data.UserPosition);
                conn.Open ();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    var list = new Dictionary<string, string>();
                    list["fullName"] = reader["FullName"].ToString();
                    list["DOB"] = reader["DOB"].ToString();
                    list["Email"] = reader["Email"].ToString();
                    return Ok(list);
                }
                else
                {
                    return Ok("0");
                }
            }
        }
        [HttpPost]
        public IActionResult Dashboard(WebTestingModel data, IFormFile foodImageFile)
        {
            string query = "INSERT INTO MenuFood (namefood, price, foodimage) VALUES (@FoodName, @FoodPrice, @FoodImage)";
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@FoodName", data.FoodName);
                cmd.Parameters.AddWithValue("@FoodPrice", data.FoodPrice);
                // Check if a file was uploaded
                if (foodImageFile != null && foodImageFile.Length > 0)
                {
                    // Generate a unique file name to avoid conflicts
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(foodImageFile.FileName);

                    // Specify the path where you want to save the uploaded file
                    string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "image", "MenuFood-Copy");
                    string filePath = Path.Combine(directoryPath, fileName);

                    // Create the directory if it doesn't exist
                    Directory.CreateDirectory(directoryPath);

                    // Save the file to the specified path
                    using (FileStream stream = new FileStream(filePath, FileMode.Create))
                    {
                        foodImageFile.CopyTo(stream);
                    }

                    // Update the food image property with the file name or file path, depending on your needs
                    data.FoodImage = fileName; // or filePath
                }

                cmd.Parameters.AddWithValue("@FoodImage", data.FoodImage);

                conn.Open();
                cmd.ExecuteNonQuery();
            }

            return Ok("0");
        }
        public class Startup
        {
            public Startup(IConfiguration configuration)
            {
                Configuration = configuration;
            }

            public IConfiguration Configuration { get; }

            public void ConfigureServices(IServiceCollection services)
            {
                // Add the necessary services for file uploading
                services.AddControllersWithViews();
                services.AddRazorPages();

                // Configure the upload file size limit
                services.Configure<FormOptions>(options =>
                {
                    options.MultipartBodyLengthLimit = 104857600; // Set the limit to 100MB (in bytes)
                });
            }

            public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
            {
                // Other middleware configurations

                app.UseStaticFiles(); // Enable serving static files from wwwroot folder

                app.UseRouting();

                // Other middleware configurations

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllerRoute(
                        name: "default",
                        pattern: "{controller=Home}/{action=Index}/{id?}");

                    endpoints.MapRazorPages();
                });
            }
        }
        [HttpPost]
        public IActionResult Menu()
        {
            string query = "SELECT id, namefood, price, foodimage FROM MenuFood WHERE active='1'";
            List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    Dictionary<string, object> item = new Dictionary<string, object>();
                    item["id"] = (int)reader["id"];
                    item["namefood"] = (string)reader["namefood"];
                    item["price"] = (string)reader["price"];
                    item["foodimage"] = (string)reader["foodimage"];
                    dataList.Add(item);
                }
            }

            return Ok(dataList);
        }

        [HttpPost]
        public IActionResult DeleteFoodCard(WebTestingModel data)
        {
            string query = "UPDATE MenuFood SET active = '0' WHERE id = @id";
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@id", data.IDDeleteCart);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
            return Ok('1');
        }

        [HttpPost]
        public IActionResult UpdateFoodCard(WebTestingModel data)
        {
            string query = "SELECT id, namefood, price, foodimage FROM MenuFood where id=@id";
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@ID", data.IDUpdateCart);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    var list = new Dictionary<string, string>();
                    list["id"] = reader["id"].ToString();
                    list["namefood"] = reader["namefood"].ToString();
                    list["price"] = reader["price"].ToString();
                    list["foodimage"] = reader["foodimage"].ToString();
                    return Ok(list);
                }
                else
                {
                    return Ok("0");
                }
            }
        }

        [HttpPost]
        public IActionResult UpdateDataInCart(WebTestingModel data, IFormFile foodImageFileti2)
        {
            string query = "UPDATE MenuFood SET namefood=@FoodName, price=@FoodPrice, foodimage=@FoodImage WHERE id=@id";
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@id", data.idFood);
                cmd.Parameters.AddWithValue("@FoodName", data.FoodNames);
                cmd.Parameters.AddWithValue("@FoodPrice", data.FoodPrices);

                if (foodImageFileti2 != null && foodImageFileti2.Length > 0)
                {
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(foodImageFileti2.FileName);

                    // Specify the path where you want to save the uploaded file
                    string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "image", "MenuFood-Copy");
                    string filePath = Path.Combine(directoryPath, fileName);

                    // Create the directory if it doesn't exist
                    Directory.CreateDirectory(directoryPath);

                    // Save the file to the specified path
                    using (FileStream stream = new FileStream(filePath, FileMode.Create))
                    {
                        foodImageFileti2.CopyTo(stream);
                    }

                    // Update the food image property with the file name
                    data.foodImageFileti2 = fileName;
                }

                cmd.Parameters.AddWithValue("@FoodImage", data.foodImageFileti2);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            return Ok("1");
        }

        [HttpPost]
        public IActionResult Order(WebTestingModel data)
        {
            string query = "select id,foodimage from MenuFood where id=@ID";
            List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@ID", data.DataIDCart);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                Dictionary<string, object> item = new Dictionary<string, object>();
                item["id"] = (int)reader["id"];
                item["FoodSrc"] = (string)reader["foodimage"];
                dataList.Add(item);
                }
            }
             return Ok(dataList);
        }
        [HttpPost]
        public IActionResult Checkout(WebTestingModel data)
        {
            string query = "INSERT INTO OrderInformation (IdMenuFood,OrderType,FoodSize,Toppings,Quantity,AdditionNote,UserID) VALUES(@FoodID,@TypeChoose,@SizeChoose,@ToppingChoose,@QuantityChoose,@NoteChoose,@userinformation)";
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                if (data.NoteChoose == null)
                    data.NoteChoose = "";
                if (data.ToppingChoose == null)
                    data.ToppingChoose = "";
                if (data.TypeChoose == null)
                    data.TypeChoose = "";
                if (data.SizeChoose == null)
                    data.SizeChoose = "";
                cmd.Parameters.AddWithValue("@userinformation", data.userinformation);
                cmd.Parameters.AddWithValue("@FoodID", data.FoodID);
                cmd.Parameters.AddWithValue("@TypeChoose", data.TypeChoose);
                cmd.Parameters.AddWithValue("@SizeChoose", data.SizeChoose);
                cmd.Parameters.AddWithValue("@ToppingChoose", data.ToppingChoose);
                cmd.Parameters.AddWithValue("@QuantityChoose", data.QuantityChoose);
                cmd.Parameters.AddWithValue("@NoteChoose", data.NoteChoose);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    var list = new Dictionary<string, string>();
                    list["id"] = reader["ID"].ToString();
                    list["FullName"] = reader["FullName"].ToString();
                    list["Email"] = reader["Email"].ToString();
                  
                    return Ok(list);
                }
                else {
                    return Ok("0");
                }
            }
        
        }

            
        [HttpPost]
        public IActionResult Basket(WebTestingModel data)
        {
            string query = "SELECT a.OrderID, b.namefood, CAST(b.price AS FLOAT) * CAST(a.Quantity AS FLOAT) AS TotalPrice FROM OrderInformation a INNER JOIN MenuFood b ON b.id = a.IdMenuFood WHERE a.UserID = @UID and a.Active='0' and a.Finish='0' ORDER BY a.OrderID DESC;";

            List<Dictionary<string, string>> dataList = new List<Dictionary<string, string>>();

            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@UID", data.userid);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var item = new Dictionary<string, string>();
                    item["OrderID"] = reader["OrderID"].ToString();
                    item["namefood"] = reader["namefood"].ToString();
                    item["TotalPrice"] = reader["TotalPrice"].ToString();

                    dataList.Add(item);
                }
            }

            return Ok(dataList);
        }
        [HttpPost]
        public IActionResult ClearOrderBox(WebTestingModel data)
        {
            string query = "update OrderInformation set Active='1' where OrderID=@OrderID";
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@OrderID", data.ClearOrderBox);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
            return Ok('1');
        }
        [HttpPost]
        public IActionResult PaymentBoxID(WebTestingModel data)
        {
            string query = "UPDATE OrderInformation SET Finish='1',OrderDate=@OrderDate,UserNumber = @phone, Address = @address, PaymentMethod = @paymentMethod WHERE OrderID = @OrderID";
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@OrderDate", DateTime.Now);
                cmd.Parameters.AddWithValue("@phone", data.phone);
                cmd.Parameters.AddWithValue("@address", data.address);
                cmd.Parameters.AddWithValue("@paymentMethod", data.paymentMethod);
                cmd.Parameters.AddWithValue("@OrderID", data.OrderID);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
            return Ok('1');
        }

        [HttpPost]
        public IActionResult HistoryTable(WebTestingModel response)
        {
            string query = "SELECT ROW_NUMBER() OVER (ORDER BY a.OrderDate DESC) AS ID,b.id,a.OrderID,b.namefood, a.Quantity, CONCAT(CAST(b.price AS FLOAT) * CAST(a.Quantity AS FLOAT), '$') AS TotalPrice, a.OrderDate FROM OrderInformation a INNER JOIN MenuFood b ON b.id = a.IdMenuFood WHERE a.UserID = @userid and a.Finish='1' ORDER BY a.OrderDate DESC";
            List<Dictionary<string, string>> dataList = new List<Dictionary<string, string>>();
            using (SqlConnection conn = new SqlConnection(connectionstring))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@userid", response.userid);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var item = new Dictionary<string, string>();
                    item["id"] = reader["ID"].ToString();
                    item["namefood"] = reader["namefood"].ToString();
                    item["Quantity"] = reader["Quantity"].ToString();
                    item["TotalPrice"] = reader["TotalPrice"].ToString();
                    item["OrderDate"] = reader["OrderDate"].ToString();
                    item["OrderID"] = reader["OrderID"].ToString();

                    dataList.Add(item);
                }
            }
            return Ok(dataList);
        }

    }
}
