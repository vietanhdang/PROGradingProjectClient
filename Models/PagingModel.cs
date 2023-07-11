﻿namespace PROGradingProjectClient.Models
{
    public class PagingModel<T>
    {
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public List<T> Data { get; set; }
        public Func<int, string> Url { get; set; }

        public string? Search { get; set; }
    }
}
