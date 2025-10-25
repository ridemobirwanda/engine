# Make.com Email Integration Setup Guide

This guide will help you set up Make.com (formerly Integromat) to automatically send contact message replies from your EngineCore admin panel.

## 🔗 Your Webhook URL
```
https://hook.eu2.make.com/j5jcfvscebxa88ga2yevvu4cpg4pg7l5
```

## 📋 Make.com Scenario Setup

### Step 1: Create New Scenario
1. Log into [Make.com](https://make.com)
2. Click "Create a new scenario"
3. Name it "EngineCore Contact Replies"

### Step 2: Add Webhook Trigger
1. Search for "Webhooks" and select "Webhook"
2. Choose "Custom webhook"
3. Click "Add" to create the webhook
4. Copy the webhook URL: `https://hook.eu2.make.com/j5jcfvscebxa88ga2yevvu4cpg4pg7l5`
5. Click "Save" to activate the webhook

### Step 3: Add Email Service
Choose one of these email services:

#### Option A: Gmail (Recommended)
1. Search for "Gmail" and select "Gmail > Send an Email"
2. Connect your Gmail account
3. Configure the email:
   - **To**: `{{to}}` (from webhook data)
   - **Subject**: `{{subject}}` (from webhook data)
   - **Message**: `{{html}}` (from webhook data)
   - **From**: Your Gmail address

#### Option B: Outlook/Hotmail
1. Search for "Outlook" and select "Microsoft 365 > Send an Email"
2. Connect your Microsoft account
3. Configure similar to Gmail above

#### Option C: SMTP (Any Email Provider)
1. Search for "Email" and select "Email > Send an Email"
2. Configure SMTP settings:
   - **Host**: Your SMTP server (e.g., smtp.gmail.com)
   - **Port**: 587 or 465
   - **Username**: Your email
   - **Password**: App password
   - **To**: `{{to}}`
   - **Subject**: `{{subject}}`
   - **Message**: `{{html}}`

### Step 4: Test the Scenario
1. Click "Run once" to test
2. Send a test webhook with this data:
```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "html": "<p>This is a test email from EngineCore.</p>",
  "text": "This is a test email from EngineCore.",
  "from": "support@enginecore.com",
  "replyTo": "support@enginecore.com",
  "messageId": "test-123",
  "timestamp": "2025-01-30T10:00:00Z"
}
```

### Step 5: Activate the Scenario
1. Click the toggle switch to activate
2. The scenario will now automatically send emails when triggered

## 📊 Webhook Data Structure

Your webhook will receive this data from EngineCore:

```json
{
  "to": "customer@example.com",
  "subject": "Re: Your Engine Inquiry",
  "html": "<div>Professional HTML email template...</div>",
  "text": "Plain text version of the email",
  "from": "support@enginecore.com",
  "replyTo": "support@enginecore.com",
  "messageId": "uuid-of-contact-message",
  "timestamp": "2025-01-30T10:00:00Z"
}
```

## 🎯 Available Data Fields

| Field | Description | Example |
|-------|-------------|---------|
| `to` | Customer's email address | `customer@example.com` |
| `subject` | Email subject line | `Re: Your Engine Inquiry` |
| `html` | HTML formatted email body | `<div>Professional template...</div>` |
| `text` | Plain text version | `Plain text email content` |
| `from` | Sender email address | `support@enginecore.com` |
| `replyTo` | Reply-to email address | `support@enginecore.com` |
| `messageId` | Unique message ID | `uuid-string` |
| `timestamp` | When the reply was sent | `2025-01-30T10:00:00Z` |

## 🔧 Advanced Configuration

### Custom Email Templates
You can modify the email template in Make.com by:
1. Adding a "Text" module before the email module
2. Creating a custom HTML template using the webhook data
3. Using the custom template in the email module

### Email Filtering
Add filters to:
- Only send emails during business hours
- Filter by customer email domains
- Add delays for testing

### Error Handling
1. Add an "Error handling" module
2. Configure to send notifications if email fails
3. Log errors for debugging

## 🧪 Testing Your Setup

### Test from EngineCore Admin Panel
1. Go to `http://localhost:21201/admin/contact-messages`
2. Find a contact message
3. Click "Reply"
4. Type a test message
5. Click "Send Email"
6. Check if the email was sent successfully

### Test Webhook Directly
Use this curl command to test your webhook:

```bash
curl -X POST https://hook.eu2.make.com/j5jcfvscebxa88ga2yevvu4cpg4pg7l5 \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email from EngineCore",
    "html": "<h1>Test Email</h1><p>This is a test email from EngineCore.</p>",
    "text": "Test Email\n\nThis is a test email from EngineCore.",
    "from": "support@enginecore.com",
    "replyTo": "support@enginecore.com",
    "messageId": "test-123",
    "timestamp": "2025-01-30T10:00:00Z"
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **Webhook not receiving data**
   - Check if the webhook URL is correct
   - Verify the scenario is activated
   - Check Make.com logs for errors

2. **Emails not sending**
   - Verify email service connection
   - Check SMTP credentials
   - Test with a simple email first

3. **HTML emails not formatting**
   - Ensure you're using the `html` field, not `text`
   - Check if your email service supports HTML

4. **Authentication errors**
   - Re-authenticate your email service
   - Check if app passwords are required
   - Verify API keys are correct

### Debug Steps
1. Check Make.com execution history
2. Look for error messages in the logs
3. Test webhook with simple data first
4. Verify email service settings

## 📞 Support

If you need help with the Make.com setup:
1. Check Make.com documentation
2. Contact Make.com support
3. Review the EngineCore admin panel logs
4. Test with the provided curl command

## ✅ Success Indicators

Your setup is working when:
- ✅ Webhook receives data from EngineCore
- ✅ Make.com scenario executes successfully
- ✅ Emails are sent to customers
- ✅ Customers receive properly formatted emails
- ✅ Reply-to functionality works

## 🔄 Next Steps

1. **Test thoroughly** with different email addresses
2. **Monitor logs** for any issues
3. **Set up monitoring** for failed emails
4. **Create backup scenarios** for redundancy
5. **Document your setup** for team members

Your Make.com integration is now ready to automatically send contact message replies!

