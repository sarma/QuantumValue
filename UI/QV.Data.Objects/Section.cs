using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace QV.Data.Objects
{
    public class Section
    {
        public int ID
        {get; set; }

        public string Header
        {get; set; }

        public string Introduction
        {get; set; }

        public string Content
        {get; set; }

        public int ParentSection
        {get; set; }

        public int PageID
        {get; set; }
    }
}
