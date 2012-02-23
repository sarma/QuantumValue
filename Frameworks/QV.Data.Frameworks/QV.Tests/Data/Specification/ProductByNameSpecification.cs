using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QV.Data.Specification;
using QV.Tests.Data.Domain;
using System.Linq.Expressions;

namespace QV.Tests.Data.Specification
{
    public class ProductByNameSpecification : Specification<Product>
    {
        public ProductByNameSpecification(string nameToMatch)
            : base(p => p.Name == nameToMatch)
        { 
        }        
    }
}
