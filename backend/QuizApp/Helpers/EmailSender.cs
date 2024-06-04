using System.Net;
using System.Net.Mail;

namespace QuizApp.Helpers;

public class EmailSender(ILogger logger)
{
    public async Task SendEmailAsync(string email, string subject, string body, Attachment? attachment, bool isHtml = false)
    {
        // read secrets
        var smtp = Environment.GetEnvironmentVariable("EMAIL_SMTP");
        var port = Environment.GetEnvironmentVariable("EMAIL_PORT");
        var address = Environment.GetEnvironmentVariable("EMAIL_ADDRESS");
        var password = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");

        if (smtp == null || port == null || address == null || password == null)
        {
            logger.LogError("Could not send email. One of the following was not specified at backend/QuizApp/.env: EMAIL_SMTP, EMAIL_PORT, EMAIL_ADDRESS, EMAIL_PASSWORD");
            return;
        }
        
        var message = new MailMessage();
        message.From = new MailAddress(address);
        message.To.Add(new MailAddress(email));
        message.Subject = subject;
        message.Body = body;
        message.IsBodyHtml = isHtml;
        if (attachment is not null) message.Attachments.Add(attachment);
        
        using (var smtpClient = new SmtpClient(smtp))
        {
            smtpClient.Port = int.Parse(port);
            smtpClient.Credentials = new NetworkCredential(address, password);
            smtpClient.EnableSsl = true; // Enable SSL for secure transmission

            await smtpClient.SendMailAsync(message);
        }
    }
}