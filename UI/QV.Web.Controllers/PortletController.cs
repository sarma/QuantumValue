using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Xml;
using QV.Web.Helpers;
using QV.Data.Objects;

namespace QV.Web.Controllers
{
    public class PortletController : Controller
    {
         XmlDocument objDoc;
        //
        // GET: /Portlet/
        //
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// provides portlet/webpart content using provided context parameters
        /// </summary>
        /// <param name="Portlet_ID">application portlet id</param>
        /// <param name="page">specific portlet page to be viewed</param>
        /// <param name="portletName">portlet name</param>
        /// <returns></returns>
        public ActionResult Content(int? portlet_ID, int page, string portletName)
        {
            //Thread.Sleep(100);
            // invalid portlet id
            if (portlet_ID == null)
                return View("ErrorPortalItem");

            #region declaration
           StringBuilder str = new StringBuilder();
            // portlet page size 
            int pageSize;
            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["PageSize"],out pageSize);
                      System.IO.TextWriter tr = new System.IO.StringWriter();
            HtmlTextWriter writer = new HtmlTextWriter(tr);
            HtmlTextWriter nestedWriter = new HtmlTextWriter(tr);
            #endregion

            #region loading RSS feed

            Portlet portRow =
                (from Category c in (List<Category>) this.HttpContext.Application["data"]
                from Portlet p in c.Portlets
                where p.Portlet_ID == portlet_ID
                select p).FirstOrDefault();

               string link = portRow.Link;
            bool is_Image_Allowed = portRow.Is_Image_Allowed;

            int contentID=portRow.ContentID;

            if (contentID > 0)
            {
               
              
                try
                {
                    string path = Server.MapPath("~/Portlet-Content.xml");
                    if (objDoc == null)
                    {
                        objDoc =new XmlDocument();
                        objDoc.Load(path);
                    }

                }
                catch (Exception exp)
                {

                    return View("ErrorPortalItem",exp);
                }
                StringBuilder stringBuilder = new StringBuilder();
                XmlNodeList nodes = objDoc.SelectNodes("portlets/content");
                foreach (XmlNode node in nodes)
                {
                    if (int.Parse(node.Attributes["id"].InnerText) ==contentID)

                        stringBuilder.AppendLine(node.InnerXml);

                }
                ViewData["content"] = stringBuilder.ToString();
            }
            else
            {
                  ViewData["content"] = string.Empty;
            }

            #endregion


          

            #region setting view's content variables
          // str.ToString();
            ViewData["title"] = portRow.Title;
            ViewData["portletName"] = portletName;
            string urllink = portRow.Link;

            if (link.Contains("~"))
            {
                string path = Utility.Get_Path();
                urllink = urllink.Replace("~", path);
            }
            ViewData["link"] = urllink;
            #endregion
            return View();
        }


        public ActionResult GetItemDetail(int? portlet_ID, int? item_No)
        {
            // invalid portlet id
            if (portlet_ID == null || item_No == null)
                return View("ErrorPortalItem");

            #region declaration
            XmlNodeList objNL;
            StringBuilder str = new StringBuilder();

            // portlet page size 
            int pageSize = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["PageSize"].ToString());

            string title = "";
            string imagePath = "";
            string ItemName = "Item" + portlet_ID.ToString();
            string ItemLink = "";
            string ItemTitle = "";
            #endregion

            #region loading RSS path
            string link =
                (from Category c in (List<Category>) this.HttpContext.Application["data"]
                from Portlet p in c.Portlets
                where p.Portlet_ID == portlet_ID
                select p).FirstOrDefault().Link;

            XmlDocument objDoc = new XmlDocument();

            try
            {
                objDoc.Load(link);
            }
            catch
            {
                // invalid portlet id
                return View("ErrorPortalItem");
            }
            #endregion

            #region parsing RSS header for title
            objNL = objDoc.SelectNodes("rss/channel");
            if (null != objNL)
            {
                // get title for portlet
                title = objNL[0].ChildNodes[0].InnerText;
            }
            #endregion

            #region get image path for portlet from RSS feed
            objNL = objDoc.SelectNodes("rss/channel/image");
            if (null != objNL)
            {
                objNL = objDoc.SelectNodes("rss/channel/image/url");
                if (objNL.Count != 0)
                    imagePath = objNL[0].InnerText;
                else
                    imagePath = "";
            }
            #endregion

            #region content to be generated from RSS feed
            int total_Items = 0;
            if (null != objDoc)
            {
                objNL = objDoc.SelectNodes("rss/channel/item");
                if (null != objNL)
                {
                    int counter = 1;
                    string description = "";

                    total_Items = objNL.Count;
                    foreach (XmlNode XNode in objNL)
                    {
                        if (counter == item_No)
                        {
                            ItemTitle = "";
                            description = "";
                            ItemLink = "";

                            foreach (XmlNode XNodeNested in XNode.ChildNodes)
                            {
                                switch (XNodeNested.Name)
                                {
                                    case "description":
                                        description = XNodeNested.InnerText;
                                        break;
                                    case "title":
                                        ItemTitle = XNodeNested.InnerText;
                                        break;
                                    case "link":
                                        ItemLink = XNodeNested.InnerText;
                                        break;
                                }
                            }
                            break;
                        }
                        counter++;
                    }
                    str.Append(description);
                }
            }
            #endregion

            #region setting view's content variables
            ViewData["detail"] = str.ToString();
            ViewData["imagePath"] = imagePath;
            ViewData["title"] = title;
            #endregion

            return View("ItemDetail");
        }


        public ActionResult Portal(int menuId = 1)
        {
            ViewData["menuId"] = menuId;
            ViewData["feedsLinkText"] = "Disable Feeds";
            ViewData["feedsActionName"] = "UnActivePortlets";
            ViewData["refreshActionName"] = "Portal";
            return View("Portal");
        }


        public ActionResult UnActivePortlets()
        {
            ViewData["feedsLinkText"] = "Active Feeds";
            ViewData["feedsActionName"] = "Portal";
            ViewData["refreshActionName"] = "UnActivePortlets";
            return View("UnActivePortlets");
        }

        /// <summary>
        /// manage's customed portlet adjustment 
        /// </summary>
        /// <param name="column_ID">portlet column id</param>
        /// <param name="portlet_ID">portlet id</param>
        /// <param name="row_No">row no in particular portlet column</param>
        /// <param name="is_Drop">change in portlet category show 1 else 0</param>
        public ActionResult PortletsPlacementManager(string column_ID, string portlet_ID, int? row_No, int? is_Drop)
        {
            // invalid portlet id
            if (column_ID == null || portlet_ID == null || row_No == null || is_Drop == null)
                return View("ErrorPortalItem");

            #region declaration
            int _portlet_ID = Convert.ToInt32(portlet_ID.ToString().Replace("portlet", ""));
            int category_ID = Convert.ToInt32(column_ID.Replace("portletColumn", "").Substring(1));
            int column_No = Convert.ToInt32(column_ID.Replace("portletColumn", "").Substring(0, 1));

            List<Portlet_User> _ds = (List<Portlet_User>)Session["data"];

            string filter = " portlet_ID = " + _portlet_ID.ToString();
            List<Portlet_User> rows = _ds.FindAll(pu => pu.Portlet_ID == _portlet_ID);
            #endregion

            #region portlet placement
            if (rows.Count == 1)
            {
                Portlet_User firstRow = rows.FirstOrDefault();
                firstRow.CategoryID = category_ID;
                firstRow.Column_No = column_No;
                firstRow.Row_Sequence = Convert.ToInt32(row_No);

                filter = " portlet_ID = " + _portlet_ID.ToString() + " and category_ID =" + category_ID.ToString() +
                    " and column_No = " + column_No.ToString() + " and Row_Sequence > " + row_No.ToString();
                var tempRows =_ds.FindAll(
                        pu => pu.Portlet_ID == _portlet_ID && pu.CategoryID == category_ID && pu.Column_No == column_No);

                if (is_Drop == 0)
                {
                    int subsequent_Row_No = Convert.ToInt32(row_No) + 1;
                    foreach (Portlet_User row in tempRows)
                    {
                        row.Row_Sequence = subsequent_Row_No;
                        subsequent_Row_No++;
                    }
                }
                else
                {
                    firstRow.Row_Sequence = tempRows.Count + 1;
                }
            }
            
            Session["data"] = _ds;
            #endregion

            return View("ErrorPortalItem");
        }


        /// <summary>
        /// manage's customed portlet adjustment 
        /// </summary>
        /// <param name="column_ID">portlet column id</param>
        /// <param name="portlet_ID">portlet id</param>
        /// <param name="row_No">row no in particular portlet column</param>
        /// <param name="is_Drop">change in portlet category show 1 else 0</param>
        public ActionResult PortletsStatusManager(string portlet_ID, bool is_Active)
        {
            // invalid portlet id
            if (portlet_ID == null)
                return View("ErrorPortalItem");

            #region declaration
            int _portlet_ID = Convert.ToInt32(portlet_ID.ToString().Replace("portlet", ""));

            List<Portlet_User> _ds = (List<Portlet_User>)Session["data"];

            string filter = " portlet_ID = " + _portlet_ID.ToString();
            var rows = _ds.Find(pu=>pu.Portlet_ID==_portlet_ID);
            #endregion

            #region portlet placement
            if (rows!=null)
            {
                rows.Is_Active = is_Active;
            }
            
            Session["data"] = _ds;
            #endregion

            return View("ErrorPortalItem");
        }


        /// <summary>
        /// return's total number portlet in particular category
        /// </summary>
        /// <param name="category_ID">portlet category id</param>
        /// <param name="is_Active">portlet is_Active</param>
        public ContentResult TotalCatetogoryPortlets(string category_ID, bool is_Active)
        {
            int _category_ID = Convert.ToInt32(category_ID.Replace("portletColumn", "").Substring(1));
            string category = ((List<Category>)this.HttpContext.Application["data"]).Find(c=>c.CategoryID==_category_ID).Name;
            int total_Category_Protlets = ((List<Portlet_User>)Session["data"]).FindAll(pu=>pu.Is_Active==is_Active && pu.CategoryID==_category_ID).Count;
            return Content(category + " ( " + total_Category_Protlets.ToString() + " )");
        }

        /// <summary>
        /// return's total number portlet 
        /// </summary>
        public ContentResult TotalPortlets(bool is_Active)
        {
            string filter = " Is_Active = " + is_Active.ToString();
            int total_Category_Protlets = ((List<Portlet_User>)Session["data"]).FindAll(pu=>pu.Is_Active==is_Active).Count;
            return Content(total_Category_Protlets.ToString());
        }

    }
}
