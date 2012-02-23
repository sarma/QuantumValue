using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using QV.Web.Controllers;
using QV.Web.Services;
using QV.Data.Objects;

namespace QV.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.Add(new Route("Default.aspx", new MvcRouteHandler())
            //{
            //    Defaults = new RouteValueDictionary(new { controller = "Portlet", action = "Portal"}),
            //});

            routes.MapRoute(
                "Default",                                              // Route name
                "{controller}/{action}",                           // URL with parameters
                new { controller = "Portlet", action = "Portal" }  // Parameter defaults
            );

            routes.MapRoute(
               "MenuPortals",                                              // Route name
               "{controller}/{action}/{menuID}",                           // URL with parameters
               new { controller = "Portlet", action = "Portal", menuId = "1" }  // Parameter defaults
           );


            routes.MapRoute(
                "UnActivePortlets",                                              // Route name
                "Portlet/UnActivePortlets",                           // URL with parameters
                new { controller = "Portlet", action = "UnActivePortlets" }  // Parameter defaults
            );



            routes.MapRoute(
              "portletName",                                              // Route name
              "Portlet/Content/{portlet_ID}/{page}/{portletName}",                           // URL with parameters
              new { controller = "Portlet", action = "Content", portlet_ID = "", page = "", portletName = "" }  // Parameter defaults
            );


            routes.MapRoute(
              "PortletsPlacementManager",                                              // Route name
              "Portlet/PortletsPlacementManager/{column_ID}/{portlet_ID}/{row_No}/{is_Drop}",                           // URL with parameters
              new { controller = "Portlet", action = "PortletsPlacementManager", column_ID = "", portlet_ID = "", row_No = "", is_Drop = "" }  // Parameter defaults
            );

            routes.MapRoute(
              "PortletsStatusManager",                                              // Route name
              "Portlet/PortletsStatusManager/{portlet_ID}/{is_Active}",                           // URL with parameters
              new { controller = "Portlet", action = "PortletsStatusManager", portlet_ID = "", is_Active = "" }  // Parameter defaults
            );


            routes.MapRoute(
            "TotalCatetogoryPortlets",                                              // Route name
            "Portlet/TotalCatetogoryPortlets/{category_ID}/{is_Active}",                           // URL with parameters
            new { controller = "Portlet", action = "TotalCatetogoryPortlets", category_ID = "", is_Active = "" }  // Parameter defaults
          );

            routes.MapRoute(
            "TotalPortlets",                                              // Route name
            "Portlet/TotalPortlets/{is_Active}",                           // URL with parameters
            new { controller = "Portlet", action = "TotalPortlets", is_Active = "" }  // Parameter defaults
          );

            routes.MapRoute(
             "GetItemDetail",                                              // Route name
             "Portlet/GetItemDetail/{portlet_ID}/{item_No}",                           // URL with parameters
             new { controller = "Portlet", action = "GetItemDetail", portlet_ID = "", item_No = "" }  // Parameter defaults
           );

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RegisterRoutes(RouteTable.Routes);
            
          //  RouteDebug.RouteDebugger.RewriteRoutesForTesting(RouteTable.Routes);

            DataService data = new DataService();
            Application["data"] = data.Complete();
        }

        public void Session_OnStart()
        {
            DataService data = new DataService();
            List<Portlet_User> _dsSession = new List<Portlet_User>();
           List<Category> _dsApplication = (List<Category>)Application["data"];

            foreach (Category category in _dsApplication)
            {
                foreach (Portlet row in category.Portlets)
                {
                    int userid = Session.Count + 1;
                    var portlet_User = new Portlet_User()
                                           {
                                               CategoryID = row.CategoryID
                                               ,UserID = userid
                                               ,Portlet_ID = row.Portlet_ID
                                               ,Column_No = row.Column_No
                                               ,Row_Sequence = row.Row_Sequence
                                               ,Title = row.Title
                                               ,Is_Image_Allowed = row.Is_Image_Allowed
                                               ,Is_Active = true
                                               ,Category = category
                                               ,Portlet = row
                                               ,User = new User() {UserID = userid,Name = userid.ToString()}
                                           };
                 
                    _dsSession.Add(portlet_User);
                }
                
            }
            

            Session["data"] = _dsSession;
        }
    }
}