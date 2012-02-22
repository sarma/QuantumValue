using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QV.Data.Objects;

namespace QV.Web.Services
{
    public class DataService
    {
         private List<Category> categories = new List<Category>();
        private Category current_Category;
        private static List<WPage> pages = new List<WPage>();

        public DataService()
        {
          
        }

        public Category AddCategory(string category,int menuId = 1)
        {
            current_Category = new Category(){CategoryID = categories.Count+1,MenudID = menuId,Name = category};
            categories.Add(current_Category);
            return current_Category; 
        }

        public void AddPortlet(string link,int column_No,string title,int row_Sequence,bool is_Image_Allowed,int contentID=0)
        {
            var portlet = new Portlet()
                              {
                                  Category = current_Category
                                  ,CategoryID = current_Category.CategoryID
                                  ,Column_No = column_No
                                  ,Title = title
                                  ,ContentID = contentID
                                  ,Is_Image_Allowed = is_Image_Allowed
                                  ,Link = link
                                  ,Portlet_ID = ((from c in categories
                                                from p in c.Portlets
                                                select p).Count())+1
                                  ,Row_Sequence = row_Sequence
                              };
            current_Category.Portlets.Add(portlet);
        }

        public WPage GetPageByID(int id)
        {
            return pages.Find(p => p.ID == id);
        }

        public List<Category> Complete()
        {

            this.AddCategory("Home");
            this.AddPortlet("~/Home/WhatWeDo", 1, "What We Do", 1, false, 5);
            this.AddPortlet("~/Home/WhyUs", 2, "Why Us", 1, false,4);
          //  this.AddPortlet("~/Blog/Index", 2, "Blogs", 3, false,3);
            this.AddPortlet("~/Services/Index", 3, "Capabilities", 1, false,2);
            this.AddPortlet("~/People/Index", 3, "People", 2, false, 1);
                       

            AddCategory("Services", 3);
            this.AddPortlet("~/Services/Index/ID=1", 1, "IT Consulting", 1, false,6);
            this.AddPortlet("~/Services/Index/ID=2", 2, "Development", 1, false, 7);
            this.AddPortlet("~/Services/Index/ID=3", 2, "Support And Maintainance", 1, false,8);
            this.AddPortlet("~/Services/Index/ID=4", 3, "Quality Assurance", 1, false,9);

            AddCategory("Process And Technologies", 3);
            this.AddPortlet("~/Services/Index/ID=5", 1, "Maturity Models", 1, false,11);
            this.AddPortlet("~/Services/Index/ID=6", 1, "Architecture Frameworks", 2, false,12);
            this.AddPortlet("~/Services/Index/ID=7", 2, "Development Technologies", 1, false,13);
            this.AddPortlet("~/Services/Index/ID=8", 3, "Quality & Process Management", 4, false,14);
            if (pages.Find(p => p.ID == 1) == null)
            {
                WPage page = new WPage()
                                 {
                                     ID = 1
                                     ,
                                     Header = "IT Consulting"
                                     ,
                                     Introduction = "This is what we do. Resourcing, Process defination and others.."
                                     ,
                                     Name = "IT Consulting"
                                     ,
                                     Title = "IT Consulting"
                                     ,
                                     Sections = new List<Section>()
                                                    {
                                                        new Section()
                                                            {
                                                                Content =
                                                                    "The usual problem is that a business owner doesn't know the detail of what the project is going to deliver until it starts the process. In many cases, the incremental effort in some projects can lead to significant financial loss. The worst problem is that the baseline for evaluating the managers appointed to manage the project becomes blurred - making it more difficult to hold him or her accountable"
                                                                ,
                                                                Header = "Project Scoping and Planning"
                                                                ,
                                                                ID = 1
                                                                ,
                                                                Introduction = ""
                                                                ,
                                                                PageID = 1

                                                            }
                                                        ,
                                                        new Section()
                                                            {
                                                                Content =
                                                                    "The scope of a project is linked intimately to the proposed business processes and"
                                                                    +
                                                                    "systems that the project is going to deliver. Regardless of whether the project"
                                                                    +
                                                                    "is to launch a new product range or discontinue unprofitable parts of the business,"
                                                                    +
                                                                    "the change will have some impact on business processes and systems. The documentation"
                                                                    +
                                                                    "of your business processes and system requirements are as fundamental to project"
                                                                    +
                                                                    "scoping as an architects plans would be to the costing and scoping of the construction of a building."
                                                                ,
                                                                Header = "Business Process and System Design"
                                                                ,
                                                                ID = 2
                                                                ,
                                                                Introduction = ""
                                                                ,
                                                                PageID = 1
                                                            }
                                                        ,
                                                        new Section()
                                                            {
                                                                Content =
                                                                    "The most successful business projects are always those that are driven by an employee"
                                                                    +
                                                                    "who has the authority, vision and influence to drive the required changes in a business."
                                                                    +
                                                                    "It is highly unlikely that a business owner (decision maker or similar) will realize"
                                                                    +
                                                                    "the changes unless one has one of these people in the employment. However, the project"
                                                                    +
                                                                    "leadership role typically requires significant experience and skills which are not"
                                                                    +
                                                                    "usually found within a company focused on day-to-day operations. Due to this requirement"
                                                                    +
                                                                    "within more significant business change projects / programs, outside expertise is"
                                                                    +
                                                                    "often sought from firms which can bring this specific skill set to the company."
                                                                ,
                                                                Header = "Project Management Support"
                                                                ,
                                                                ID = 3
                                                                ,
                                                                Introduction = ""
                                                                ,
                                                                PageID = 1
                                                            }
                                                    }

                                 };

                pages.Add(page);
            }

            return categories;
        }

    }
}
