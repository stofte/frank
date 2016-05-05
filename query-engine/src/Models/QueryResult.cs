namespace QueryEngine.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class QueryResult 
    {
        [DataMember]
        public object Value { get; set; }
    }
}
