using Microsoft.AspNetCore.Mvc;
using Mission11_Gibson.Data;

namespace Mission11_Gibson.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetBooks(int pageNum = 1, int pageSize = 5, string sortOrder = "title")
    {
        var query = _context.Books.AsQueryable();

        query = sortOrder.ToLower() switch
        {
            "author" => query.OrderBy(b => b.Author),
            _        => query.OrderBy(b => b.Title),
        };

        var totalBooks = query.Count();
        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { books, totalBooks });
    }
}
