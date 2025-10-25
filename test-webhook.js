// Test script for Make.com webhook integration
// Run this with: node test-webhook.js

const webhookUrl = 'https://hook.eu2.make.com/j5jcfvscebxa88ga2yevvu4cpg4pg7l5';

const testData = {
  to: 'test@example.com',
  subject: 'Test Email from EngineCore',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reply from EngineCore Support</h2>
      <p>Hello Test User,</p>
      <p>Thank you for contacting us. Here is our response to your inquiry:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
        <p style="margin: 0; white-space: pre-wrap;">This is a test reply message from EngineCore admin panel.</p>
      </div>
      <p>If you have any further questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>EngineCore Support Team</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #666;">
        Original message:<br>
        <strong>Subject:</strong> Test Engine Inquiry<br>
        <strong>Date:</strong> ${new Date().toLocaleString()}
      </p>
    </div>
  `,
  text: 'This is a test reply message from EngineCore admin panel.',
  from: 'support@enginecore.com',
  replyTo: 'support@enginecore.com',
  messageId: 'test-' + Date.now(),
  timestamp: new Date().toISOString()
};

async function testWebhook() {
  try {
    console.log('🧪 Testing Make.com webhook integration...');
    console.log('📡 Webhook URL:', webhookUrl);
    console.log('📧 Test email to:', testData.to);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      console.log('✅ Webhook test successful!');
      console.log('📊 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('📄 Response body:', responseText);
      
      console.log('\n🎉 Your Make.com webhook is working!');
      console.log('📧 Check your email service to see if the test email was sent.');
      console.log('🔧 If no email was received, check your Make.com scenario setup.');
    } else {
      console.log('❌ Webhook test failed!');
      console.log('📊 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('📄 Response body:', responseText);
      
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check if your Make.com scenario is activated');
      console.log('2. Verify the webhook URL is correct');
      console.log('3. Check Make.com execution history for errors');
    }
  } catch (error) {
    console.log('❌ Webhook test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check your internet connection');
    console.log('2. Verify the webhook URL is accessible');
    console.log('3. Check if Make.com is experiencing issues');
  }
}

// Run the test
testWebhook();

