using Microsoft.EntityFrameworkCore;
using Mission11_Gibson.Models;

namespace Mission11_Gibson.Data;

// DbContext is the bridge between C# and the database — Entity Framework uses this to run queries
public class BookstoreContext : DbContext
{
    // Constructor passes configuration (connection string, provider) up to the base DbContext
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

    // Represents the Books table — query this like a list (e.g. Books.Where(...), Books.ToList())
    public DbSet<Book> Books { get; set; }
}
