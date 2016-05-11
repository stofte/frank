namespace QueryEngine.Models
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    public class TemplateResult 
    {
        public string Namespace { get; set; }
        public string Template { get; set; }
        
        public int ColumnOffset { get; set; }
        
        public int LineOffset { get; set; }
    }
}
