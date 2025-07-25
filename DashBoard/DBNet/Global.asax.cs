using System;
using System.Web;
using System.Web.Routing;

namespace DashBoard.DBNet
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs
            Exception ex = Server.GetLastError();
            
            // Log the error (you can implement your own logging here)
            System.Diagnostics.Debug.WriteLine($"Application Error: {ex.Message}");
            
            // Clear the error
            Server.ClearError();
        }

        void Session_Start(object sender, EventArgs e)
        {
            // Code that runs when a new session is started
        }

        void Session_End(object sender, EventArgs e)
        {
            // Code that runs when a session ends
        }
    }

    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            // Register any custom routes here if needed
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
        }
    }
} 