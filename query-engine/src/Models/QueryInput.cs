namespace QueryEngine.Models
{
    public class QueryInput
    {
        public int Id { get; set; }
        public string Command { get; set; }
        public string ConnectionString { get; set; }
        public string Source { get; set; }
    }
}
