using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

class Program
{
  static void Main()
  {
    int port = 5000;

    var server = new Server(port);

    Console.WriteLine("The server is running");
    Console.WriteLine($"Main Page: http://localhost:{port}/website/pages/index.html");

    var database = new Database();

    while (true)
    {
      (var request, var response) = server.WaitForRequest();

      Console.WriteLine($"Recieved a request with the path: {request.Path}");

      if (File.Exists(request.Path))
      {
        var file = new File(request.Path);
        response.Send(file);
      }
      else if (request.ExpectsHtml())
      {
        var file = new File("website/pages/404.html");
        response.SetStatusCode(404);
        response.Send(file);
      }
      else
      {
        try
        {
          if (request.Path == "verifyUserId")
          {
            var userId = request.GetBody<string>();

            var exists = database.Users.Any(user => user.Id == userId);

            response.Send(exists);
          }
          else if (request.Path == "signUp")
          {
            var (username, password) = request.GetBody<(string, string)>();

            var exists = database.Users.Any(user => user.Username == username);

            string? userId = null;

            if (!exists)
            {
              userId = Guid.NewGuid().ToString();
              var user = new User(userId, username, password);
              database.Users.Add(user);
            }

            response.Send(userId);
          }
          else if (request.Path == "logIn")
          {
            var (username, password) = request.GetBody<(string, string)>();

            var user = database.Users
              .FirstOrDefault(user => user.Username == username && user.Password == password);

            response.Send(user?.Id);
          }
          else if (request.Path == "getUsername")
          {
            var userId = request.GetBody<string>();

            var user = database.Users.Find(userId);

            response.Send(user?.Username);
          }
          else if (request.Path == "getContacts")
          {
            var userId = request.GetBody<string>();
            var contacts = database.Users.Where(user => user.Id != userId);
            response.Send(contacts);
          }
          else if (request.Path == "transfer")
          {
            var (senderId, recipientId, amount, reason) = request.GetBody<(string, string, double, string)>();
            Transfer transfer = new Transfer(senderId, recipientId, amount, reason);
            database.Transfers.Add(transfer);
          }
                    else if (request.Path == "getInbox")
          {
            var userId = request.GetBody<string>();
            var inbox = database.Transfers
              .Where(transfer => transfer.RecipientId == userId && transfer.Status == 0)
              .ToArray();
            response.Send(inbox);
          }
          else if (request.Path == "getHistory")
          {
            var userId = request.GetBody<string>();
            var history = database.Transfers
              .Where(transfer => 
                (transfer.RecipientId == userId || transfer.SenderId == userId)
                && transfer.Status != 0
              )
              .ToArray();
            response.Send(history);
          }
          else if (request.Path == "approve")
          {
            var requestId = request.GetBody<int>();
            var req = database.Transfers.Find(requestId)!;
            req.Status = 1;
          }
          else if (request.Path == "reject")
          {
            var requestId = request.GetBody<int>();
            var req = database.Transfers.Find(requestId)!;
            req.Status = 2;
          }
          else
          {
            response.SetStatusCode(405);
          }

          database.SaveChanges();
        }
        catch (Exception exception)
        {
          Log.WriteException(exception);
        }
      }

      response.Close();
    }
  }
}


class Database() : DbBase("database")
{
  public DbSet<User> Users { get; set; } = default!;
  public DbSet<Transfer> Transfers { get; set; } = default!;
}

class User(string id, string username, string password)
{
  [Key] public string Id { get; set; } = id;
  public string Username { get; set; } = username;
  public string Password { get; set; } = password;
}

class Transfer(string senderId, string recipientId, double amount, string reason)
{
  [Key] public int Id { get; set; } = default!;
  public string SenderId { get; set; } = senderId;
  [ForeignKey("SenderId")] public User Sender { get; set; } = default!;
  public string RecipientId { get; set; } = recipientId;
  [ForeignKey("RecipientId")] public User Recipient { get; set; } = default!;
  public double Amount { get; set; } = amount;
  public string Reason { get; set; } = reason;
  public int Status { get; set; } = 0;
}