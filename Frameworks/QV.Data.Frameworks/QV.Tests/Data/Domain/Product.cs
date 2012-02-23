using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QV.Model.Domain;

namespace QV.Tests.Data.Domain
{
    public class Product : Entity
    {
        public Product()
        {
            Categories = new List<Category>();
            OrderLines = new List<OrderLine>();
        }

        public virtual string Name
        {
            get;
            set;
        }

        public virtual double Price
        {
            get;
            set;
        }

        public virtual string Description
        {
            get;
            set;
        }

        public virtual IList<Category> Categories
        {
            get;
            set;
        }

        public virtual IList<OrderLine> OrderLines
        {
            get;
            set;
        }
    }
}
