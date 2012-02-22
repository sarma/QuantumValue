using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace QV.Data.Objects
{
    public class WPage
    {
        public int ID{get; set; }

        public string Name{get; set; }

        public string Title{get; set; }

        public string Header{get; set; }

        public string Introduction{get; set; }

        public List<Section> Sections{get; set; }
    }
}
