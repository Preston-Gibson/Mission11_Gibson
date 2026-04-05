using Microsoft.AspNetCore.Mvc;
using Mission11_Gibson.Data;
using Mission11_Gibson.Models;

namespace Mission11_Gibson.Controllers;

[ApiController]
[Route("api/[controller]")] // Route resolves to /api/books
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    // DbContext is injected automatically by ASP.NET's dependency injection system
    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // GET /api/books?pageNum=1&pageSize=5&sortOrder=title&category=Biography
    // Query params are optional — defaults are applied if not provided
    [HttpGet]
    public IActionResult GetBooks(int pageNum = 1, int pageSize = 5, string sortOrder = "title", string? category = null)
    {
        // Start with all books — no query is sent to the DB yet (deferred execution)
        var query = _context.Books.AsQueryable();

        // Filter by category if one was provided
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        // Apply sort — switch on the sortOrder string to pick the right OrderBy
        query = sortOrder.ToLower() switch
        {
            "author"     => query.OrderBy(b => b.Author),
            "title_desc" => query.OrderByDescending(b => b.Title),
            _            => query.OrderBy(b => b.Title), // default: title ascending
        };

        // Count total before paging — needed by the frontend to calculate total pages
        var totalBooks = query.Count();

        // Skip past previous pages, then take only the current page's worth of records
        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Return both the page of books and the total count as a JSON object
        return Ok(new { books, totalBooks });
    }

    // GET /api/books/categories — returns the distinct list of categories for the filter dropdown
    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        var categories = _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return Ok(categories);
    }

    // POST /api/books — add a new book
    [HttpPost]
    public IActionResult AddBook([FromBody] Book book)
    {
        _context.Books.Add(book);
        _context.SaveChanges();
        return CreatedAtAction(nameof(AddBook), new { id = book.BookID }, book);
    }

    // PUT /api/books/{id} — update an existing book
    [HttpPut("{id}")]
    public IActionResult UpdateBook(int id, [FromBody] Book book)
    {
        var existing = _context.Books.Find(id);
        if (existing == null) return NotFound();

        existing.Title = book.Title;
        existing.Author = book.Author;
        existing.Publisher = book.Publisher;
        existing.ISBN = book.ISBN;
        existing.Classification = book.Classification;
        existing.Category = book.Category;
        existing.PageCount = book.PageCount;
        existing.Price = book.Price;

        _context.SaveChanges();
        return Ok(existing);
    }

    // DELETE /api/books/{id} — remove a book
    [HttpDelete("{id}")]
    public IActionResult DeleteBook(int id)
    {
        var book = _context.Books.Find(id);
        if (book == null) return NotFound();

        _context.Books.Remove(book);
        _context.SaveChanges();
        return NoContent();
    }
}
