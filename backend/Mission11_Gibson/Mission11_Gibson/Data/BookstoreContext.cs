using Microsoft.EntityFrameworkCore;
using Mission11_Gibson.Models;

namespace Mission11_Gibson.Data;

public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

    public DbSet<Book> Books { get; set; }
}
