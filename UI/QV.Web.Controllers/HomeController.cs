using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QV.Web.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
           
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult WhatWeDo()
        {
            return View();
        }

        public ActionResult WhyUs()
        {
            return View();
        }

        public ActionResult ContactUs()
        {
            return About();
        }
    }
}
