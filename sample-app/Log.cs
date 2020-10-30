using System;
using Microsoft.Extensions.Logging;

namespace sample_app
{
    internal static class Log
    {
        // Event IDs: ABxx (based on Theory of Reply Codes)
        
        // Event ID Type:
        // 1bxx info - preliminary
        // 2bxx info - completion
        // 3bxx info - intermediate
        // 8bxx info - finalization
        // 4bxx warning
        // 5bxx error
        // 9bxx critical
        
        // Event ID Category:
        // a0xx syntax
        // a1xx information
        // a2xx connections
        // a3xx storage
        
        // 1bxx 
        
        public static readonly Action<ILogger, Exception?> WeatherRequested =
            LoggerMessage.Define(LogLevel.Information,
                new EventId(1001, nameof(WeatherRequested)),
                "Weather requested");      
    }
}
