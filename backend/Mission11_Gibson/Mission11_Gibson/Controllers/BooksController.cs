using Microsoft.AspNetCore.Mvc;
using Mission11_Gibson.Data;

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
}
