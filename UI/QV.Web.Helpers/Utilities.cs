using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QV.Web.Helpers
{
    public static class Utility
    {
        public static string Get_Path()
        {
            string temp = "";
            if (System.Web.HttpContext.Current.Request.Url.AbsolutePath == "/")
            {
                temp = System.Web.HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path);
                temp = temp.Remove(temp.Length - 1);
            }
            else
                temp = System.Web.HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path).Replace(System.Web.HttpContext.Current.Request.Url.AbsolutePath, "") + Utility.GetGSite();

            return temp;
        }

        public static string GetGSite()
        {
            return System.Configuration.ConfigurationManager.AppSettings["GSite"].ToString();
        }
    }
}