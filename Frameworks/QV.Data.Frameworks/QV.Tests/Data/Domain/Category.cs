using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QV;
using QV.Model.Domain;
using System.ComponentModel.DataAnnotations;

namespace QV.Tests.Data.Domain
{
    public class Category : Entity
    {
        public Category()
        {
            Products = new List<Product>();
        }

        public virtual string Name
        {
            get;
            set;
        }

        public virtual IList<Product> Products { get; set; }
    }
}
