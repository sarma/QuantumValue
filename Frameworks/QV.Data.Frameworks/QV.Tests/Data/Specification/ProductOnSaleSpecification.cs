using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QV.Data.Specification;
using QV.Tests.Data.Domain;

namespace QV.Tests.Data.Specification
{
    public class ProductOnSaleSpecification : Specification<Product>
    {
        public ProductOnSaleSpecification() : base(p => p.Price < 100) { }
    }
}
