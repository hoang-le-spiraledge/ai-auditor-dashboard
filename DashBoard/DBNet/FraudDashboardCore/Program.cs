using FraudDashboardCore.Data;
using FraudDashboardCore.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register EF Core DbContext
builder.Services.AddDbContext<FraudDashboardContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FraudDb")));

// Register application services
builder.Services.AddScoped<FraudLogService>();

// Add MVC services
builder.Services.AddControllersWithViews();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Dashboard}/{action=Index}/{id?}");

app.Run(); 