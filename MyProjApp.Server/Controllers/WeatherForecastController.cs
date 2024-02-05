using Microsoft.AspNetCore.Mvc;
using PuppeteerSharp;
using System.IO;

namespace MyProjApp.Server.Controllers
{
    [ApiController]
    [Route("/api/importfile")]
    public class WeatherForecastController : ControllerBase
    {

        [HttpPost("ImportFile")]
        public async Task<IActionResult> ImportFile([FromForm] IFormFile file)
        {
            var html = string.Empty;
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                html = await reader.ReadToEndAsync();
                // Делайте что-то с содержимым файла здесь
            }
            var pdfOptions = new PuppeteerSharp.PdfOptions();
            using (var browser = await Puppeteer.LaunchAsync(new LaunchOptions
            {
                Headless = true,
                ExecutablePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe"
            }))
            {
                using (var page = await browser.NewPageAsync())
                {
                    await page.SetContentAsync(html);
                    await page.PdfAsync("index.pdf", pdfOptions);
                }
            }

            //do something with the file here

            var filePath = "index.pdf";
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var response = File(fileStream, "application/pdf");
            return response;
        }
    }
}
