using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace QV.Data.Objects
{
    public class Category
    {
        public int CategoryID { get; set; }
        public string Name { get; set; }
        public int MenudID { get; set; }
        private List<Portlet> _portlets;
        public List<Portlet> Portlets
        {
            get { return _portlets ?? (_portlets = new List<Portlet>()); }
        }
    }

    public class Portlet
    {
        
        public int Portlet_ID { get; set; }
        public int CategoryID { get; set; }
        public string Link { get; set; }
        public int Column_No { get; set; }
        public string Title { get; set; }
        public int Row_Sequence { get; set; }
        public bool Is_Image_Allowed { get; set; }
        public int ContentID { get; set; }
        public Category Category { get; set; }
       

    }

    public class User
    {
        public int UserID { get; set; }
        public string Name { get; set; }
    }

    public class Portlet_User
    {

        public int CategoryID { get; set; }
        public int UserID { get; set; }
        public int Portlet_ID { get; set; }
        public int Column_No { get; set; }
        public int Row_Sequence { get; set; }
        public string Title { get; set; }
        public bool Is_Image_Allowed { get; set; }
        public bool Is_Active { get; set; }

        public Category Category { get; set; }
        public Portlet Portlet { get; set; }
        public User User { get; set; }

    }
}
