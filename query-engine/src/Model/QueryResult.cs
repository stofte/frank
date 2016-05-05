namespace QueryEngine.Model
{
    using System.Runtime.Serialization;

    [DataContract]
    public class QueryResult 
    {
        [DataMember]
        public string Value { get; set; }
    }
}
