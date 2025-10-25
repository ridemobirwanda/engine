// Test Supabase connection and contact messages update
// Run this in the browser console on your admin page

console.log('🔌 Testing Supabase Connection...');

// Test 1: Check if Supabase client is available
if (typeof window.supabase !== 'undefined') {
    console.log('✅ Supabase client found');
} else {
    console.log('❌ Supabase client not found');
}

// Test 2: Try to read contact messages
async function testContactMessagesRead() {
    try {
        console.log('📖 Testing contact messages read...');
        const { data, error } = await window.supabase
            .from('contact_messages')
            .select('id, name, email, subject, status')
            .limit(5);
        
        if (error) {
            console.error('❌ Read error:', error);
            return false;
        } else {
            console.log('✅ Read successful:', data);
            return true;
        }
    } catch (err) {
        console.error('❌ Read exception:', err);
        return false;
    }
}

// Test 3: Try to update a contact message
async function testContactMessagesUpdate() {
    try {
        console.log('✏️ Testing contact messages update...');
        
        // First, get a message to update
        const { data: messages, error: readError } = await window.supabase
            .from('contact_messages')
            .select('id, status')
            .limit(1);
        
        if (readError || !messages || messages.length === 0) {
            console.error('❌ No messages to update:', readError);
            return false;
        }
        
        const messageId = messages[0].id;
        console.log('📝 Updating message:', messageId);
        
        // Try to update the message
        const { data: updateResult, error: updateError } = await window.supabase
            .from('contact_messages')
            .update({ 
                status: 'test_update',
                admin_notes: 'Test update from console',
                updated_at: new Date().toISOString()
            })
            .eq('id', messageId)
            .select();
        
        if (updateError) {
            console.error('❌ Update error:', updateError);
            console.error('❌ Error details:', {
                code: updateError.code,
                message: updateError.message,
                details: updateError.details,
                hint: updateError.hint
            });
            return false;
        } else {
            console.log('✅ Update successful:', updateResult);
            
            // Revert the change
            await window.supabase
                .from('contact_messages')
                .update({ 
                    status: messages[0].status,
                    admin_notes: null
                })
                .eq('id', messageId);
            
            console.log('🔄 Reverted test update');
            return true;
        }
    } catch (err) {
        console.error('❌ Update exception:', err);
        return false;
    }
}

// Test 4: Check authentication status
async function testAuthentication() {
    try {
        console.log('🔐 Testing authentication...');
        const { data: { session }, error } = await window.supabase.auth.getSession();
        
        if (error) {
            console.error('❌ Auth error:', error);
            return false;
        } else if (session) {
            console.log('✅ Authenticated:', session.user.email);
            return true;
        } else {
            console.log('❌ Not authenticated');
            return false;
        }
    } catch (err) {
        console.error('❌ Auth exception:', err);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Running all database tests...');
    
    const authResult = await testAuthentication();
    const readResult = await testContactMessagesRead();
    const updateResult = await testContactMessagesUpdate();
    
    console.log('📊 Test Results:');
    console.log('  Authentication:', authResult ? '✅' : '❌');
    console.log('  Read Messages:', readResult ? '✅' : '❌');
    console.log('  Update Messages:', updateResult ? '✅' : '❌');
    
    if (!authResult) {
        console.log('💡 Solution: Make sure you are logged in to the admin panel');
    }
    
    if (!readResult) {
        console.log('💡 Solution: Check RLS policies for SELECT operations');
    }
    
    if (!updateResult) {
        console.log('💡 Solution: Check RLS policies for UPDATE operations');
        console.log('💡 Run this SQL in Supabase dashboard:');
        console.log(`
DROP POLICY IF EXISTS "contact_messages_update_authenticated" ON public.contact_messages;
CREATE POLICY "contact_messages_allow_update" ON public.contact_messages FOR UPDATE USING (true);
        `);
    }
    
    return { authResult, readResult, updateResult };
}

// Export functions for manual testing
window.testSupabaseConnection = {
    testAuth: testAuthentication,
    testRead: testContactMessagesRead,
    testUpdate: testContactMessagesUpdate,
    runAll: runAllTests
};

console.log('🔧 Test functions available:');
console.log('  testSupabaseConnection.runAll() - Run all tests');
console.log('  testSupabaseConnection.testAuth() - Test authentication');
console.log('  testSupabaseConnection.testRead() - Test reading messages');
console.log('  testSupabaseConnection.testUpdate() - Test updating messages');

// Auto-run tests
runAllTests();

