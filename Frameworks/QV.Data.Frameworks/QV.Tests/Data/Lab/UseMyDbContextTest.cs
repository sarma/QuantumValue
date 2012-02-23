﻿using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using System.Linq.Expressions;
using QV.Tests.Data.Domain;
using QV.Data.Specification;
using QV.Tests.Data.Specification;
using QV.Data;
using QV.Data.EntityFramework.Lab;
using System.Data;
using System.Data.Entity;
using QV.Tests.Domain.Mapping;
using System.Data.Entity.Infrastructure;

namespace QV.Tests.Data.Lab
{
    [TestFixture]
    public class UseMyDbContextTest
    {
        private QV.Tests.Data.Lab.ICustomerRepository customerRepository;
        private IRepository repository;
        private MyDbContext context;

        [TestFixtureSetUp]
        public void SetUp()
        {
            Database.SetInitializer<MyDbContext>(new DataSeedingInitializer());
            context = new MyDbContext("DefaultDb");
            
            customerRepository = new QV.Tests.Data.Lab.CustomerRepository(context);
            repository = new QV.Data.EntityFramework.Lab.GenericRepository(context);
        }

        [TestFixtureTearDown]
        public void TearDown()
        {
            if ((context != null) && (((IObjectContextAdapter)context).ObjectContext.Connection.State == System.Data.ConnectionState.Open))
            {
                ((IObjectContextAdapter)context).ObjectContext.Connection.Close();
                context = null;
            }
        }

        [Test]
        public void Test()
        {
            DoAction(() => FindOneCustomer());
            DoAction(() => FindManyOrdersForJohnDoe());
            DoAction(() => FindNewlySubscribed());
            DoAction(() => FindBySpecification());
            DoAction(() => FindByCompositeSpecification());
            DoAction(() => FindByConcretSpecification());
            DoAction(() => FindByConcretCompositeSpecification());
            DoAction(() => GetProductsWithPaging());
        }

        private void FindManyOrdersForJohnDoe()
        {
            var customer = customerRepository.FindByName("John", "Doe");
            var orders = repository.Find<Order>(x => x.Customer.Id == customer.Id);

            Console.Write("Found {0} Orders with {1} OrderLines", orders.Count(), orders.ToList()[0].OrderLines.Count);
        }

        private void FindNewlySubscribed()
        {
            var newCustomers = customerRepository.NewlySubscribed();

            Console.Write("Found {0} new customers", newCustomers.Count);
        }

        private void FindBySpecification()
        {
            Specification<Product> specification = new Specification<Product>(p => p.Price < 100);
            IEnumerable<Product> productsOnSale = repository.Find<Product>(specification);
            Assert.AreEqual(2, productsOnSale.Count());
        }

        private void FindByCompositeSpecification()
        {
            IEnumerable<Product> products = repository.Find<Product>(
                new Specification<Product>(p => p.Price < 100).And(new Specification<Product>(p => p.Name == "Windows XP Professional")));
            Assert.AreEqual(1, products.Count());
        }

        private void FindByConcretSpecification()
        {
            ProductOnSaleSpecification specification = new ProductOnSaleSpecification();
            IEnumerable<Product> productsOnSale = repository.Find<Product>(specification);
            Assert.AreEqual(2, productsOnSale.Count());
        }

        private void FindByConcretCompositeSpecification()
        {
            IEnumerable<Product> products = repository.Find<Product>(
                new AndSpecification<Product>(
                    new ProductOnSaleSpecification(),
                    new ProductByNameSpecification("Windows XP Professional")));
            Assert.AreEqual(1, products.Count());
        }

        private void FindOneCustomer()
        {
            var c = repository.FindOne<Customer>(x => x.Firstname == "John" &&
                                                    x.Lastname == "Doe");

            Console.Write("Found Customer: {0} {1}", c.Firstname, c.Lastname);
        }

        private void GetProductsWithPaging()
        {
            var output = repository.Get<Product>(x => x.Name, 0, 5).ToList();
            Assert.IsTrue(output[0].Name == "Windows Seven Home");
            Assert.IsTrue(output[1].Name == "Windows Seven Premium");
            Assert.IsTrue(output[2].Name == "Windows Seven Professional");
            Assert.IsTrue(output[3].Name == "Windows Seven Ultimate");
            Assert.IsTrue(output[4].Name == "Windows XP Professional");
        }


        private static void DoAction(Expression<Action> action)
        {
            Console.Write("Executing {0} ... ", action.Body.ToString());

            var act = action.Compile();
            act.Invoke();

            Console.WriteLine();
        }        
    }
}
