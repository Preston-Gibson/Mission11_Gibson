namespace Mission11_Gibson.Models;

// Represents a single book record — maps directly to the Books table in the database
public class Book
{
    public int BookID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Classification { get; set; } = string.Empty; // e.g. "Fiction" or "Non-Fiction"
    public string Category { get; set; } = string.Empty;       // e.g. "Biography", "Self-Help"
    public int PageCount { get; set; }
    public double Price { get; set; }
}
