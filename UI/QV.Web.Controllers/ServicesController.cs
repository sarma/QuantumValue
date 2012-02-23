using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QV.Web.Services;

namespace QV.Web.Controllers
{
    public class ServicesController : Controller
    {
        //
        // GET: /Services/

        public ActionResult Index(int ID=0)
        {
            DataService data = new DataService();
            var page = data.GetPageByID(1);
            return View(page);
        }

    }
}
