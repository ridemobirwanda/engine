import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { getMessages, updateMessage, deleteMessage } from '@/services/contactMessagesService';
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Trash2,
  Reply,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettingByKey } from '@/services/websiteSettingsService';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: string | null;
  created_at: string;
  responded_at?: string | null;
}

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);
  const hasMore = messages.length < total;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadMessages(1, true);

    // Remove Supabase real-time channel logic.
  }, []); // Empty dependency array - only run once on mount

  const loadMessages = async (nextPage = page, replace = false) => {
    try {
      if (replace) setLoading(true); else setLoadingMore(true);

      const { messages: rows, total: count } = await getMessages({
        page: nextPage,
        pageSize,
        status: statusFilter,
        search: searchQuery
      });

      setTotal(count || 0);
      setPage(nextPage);
      setMessages(replace ? rows : [...messages, ...rows]);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to load contact messages',
        variant: "destructive",
      });
      if (replace) setMessages([]);
    } finally {
      if (replace) setLoading(false); else setLoadingMore(false);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      await updateMessage(messageId, { status, updated_at: new Date().toISOString() });
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status, updated_at: new Date().toISOString() } : msg));

      toast({
        title: "Status Updated",
        description: `Message marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update message status';
      
      toast({
        title: "Error",
        description: `Failed to update message status: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const replyToMessage = async (sendEmail: boolean) => {
    if (!selectedMessage) return;
    
    try {
      console.log('Saving reply for message:', selectedMessage.id);
      console.log('Reply text:', replyText);
      
      // First update the message status with better error handling
      const updateData = { status: 'replied', responded_at: new Date().toISOString(), admin_notes: replyText };
      
      console.log('Update data:', updateData);
      
      await updateMessage(selectedMessage.id, updateData);
      
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, ...updateData } : m));
      
      if (sendEmail) {
        // Try to send email via the email service
        try {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Reply from EngineCore Support</h2>
              <p>Hello ${selectedMessage.name},</p>
              <p>Thank you for contacting us. Here is our response to your inquiry:</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
                <p style="margin: 0; white-space: pre-wrap;">${replyText}</p>
              </div>
              <p>If you have any further questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>EngineCore Support Team</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                Original message:<br>
                <strong>Subject:</strong> ${selectedMessage.subject}<br>
                <strong>Date:</strong> ${new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </div>
          `;

          // Get email settings from admin settings
          const emailSettingsRecord = await getSettingByKey('email_settings');
          const emailSettings = emailSettingsRecord?.value || {
            enable_contact_replies: true,
            contact_reply_from: 'support@enginecore.com',
            contact_reply_name: 'EngineCore Support',
            email_service_type: 'webhook',
            email_webhook_url: '',
          };

          if (!emailSettings.enable_contact_replies) {
            toast({ 
              title: 'Contact Replies Disabled', 
              description: 'Contact reply emails are disabled in settings.',
              variant: 'destructive'
            });
            return;
          }

          const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-email-direct', {
            body: {
              to: selectedMessage.email,
              subject: `Re: ${selectedMessage.subject}`,
              html: emailHtml,
              text: replyText,
              from: emailSettings.contact_reply_from,
              replyTo: emailSettings.contact_reply_from,
              messageId: selectedMessage.id
            }
          });

          if (emailError) {
            console.error('Email service error:', emailError);
            
            // Check if we got a mailto link from the service
            if (emailResult?.mailtoLink) {
              window.open(emailResult.mailtoLink, '_blank');
              toast({ 
                title: 'Email Service Unavailable', 
                description: emailResult.message || 'Email composer opened as fallback. Please send manually.',
                variant: 'destructive'
              });
            } else {
              // Fallback to mailto
              const mailto = `mailto:${encodeURIComponent(selectedMessage.email)}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}&body=${encodeURIComponent(replyText)}`;
              window.open(mailto, '_blank');
              
              toast({ 
                title: 'Email Service Unavailable', 
                description: 'Email composer opened as fallback. Please send manually.',
                variant: 'destructive'
              });
            }
          } else if (emailResult?.success) {
            toast({ 
              title: 'Reply Sent!', 
              description: emailResult.message || `Email sent to ${selectedMessage.email} successfully.` 
            });
          } else if (emailResult?.mailtoLink) {
            // Service provided a mailto link
            window.open(emailResult.mailtoLink, '_blank');
            toast({ 
              title: 'Email Service Not Configured', 
              description: emailResult.message || 'Email composer opened. Please send manually.',
              variant: 'destructive'
            });
          } else {
            toast({ 
              title: 'Reply Sent!', 
              description: `Email sent to ${selectedMessage.email} successfully.` 
            });
          }
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          
          // Fallback to mailto
          const mailto = `mailto:${encodeURIComponent(selectedMessage.email)}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}&body=${encodeURIComponent(replyText)}`;
          window.open(mailto, '_blank');
          
          toast({ 
            title: 'Email Service Error', 
            description: 'Email composer opened as fallback. Please send manually.',
            variant: 'destructive'
          });
        }
      } else {
        toast({ title: 'Reply Saved', description: 'Message marked as replied and saved.' });
      }
      
      setReplyText('');
      setReplyOpen(false);
    } catch (e) {
      console.error('Reply save error:', e);
      const description = e instanceof Error ? e.message : 'Failed to save reply';
      
      // Try to provide more specific error messages
      if (description.includes('Database error')) {
        toast({ 
          title: 'Database Error', 
          description: 'Failed to save reply to database. Please check your connection and try again.',
          variant: 'destructive' 
        });
      } else if (description.includes('permission')) {
        toast({ 
          title: 'Permission Error', 
          description: 'You do not have permission to update this message. Please contact your administrator.',
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: 'Error', 
          description: `Failed to save reply: ${description}`,
          variant: 'destructive' 
        });
      }
    }
  };

  const deleteMessageHandler = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(messageId);

      setMessages(prev => prev.filter(msg => msg.id !== messageId));

      toast({
        title: "Message Deleted",
        description: "Contact message has been deleted",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'read':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'replied':
        return <Reply className="h-4 w-4 text-green-500" />;
      case 'archived':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: ContactMessage['status']) => {
    const variants = {
      new: 'destructive',
      read: 'default',
      replied: 'secondary',
      archived: 'outline',
    } as const;

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // server-side filtered; use current messages
  const filteredMessages = messages;

  // Refetch on filter/search changes
  useEffect(() => {
    const t = setTimeout(() => loadMessages(1, true), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchQuery]);

  const messageStats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1">
          <header className="bg-background border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold">Contact Messages</h1>
                  <p className="text-muted-foreground">
                    Manage customer inquiries and support requests
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messageStats.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{messageStats.new}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Read</CardTitle>
                  <Eye className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{messageStats.read}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Replied</CardTitle>
                  <Reply className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{messageStats.replied}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Messages List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading messages...</p>
                <p className="text-xs text-muted-foreground mt-2">If this takes too long, refresh. Check contact_messages RLS if it persists.</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No messages match your current filters.' 
                      : 'No contact messages have been received yet.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(message.status)}
                            <h3 className="font-semibold text-lg">{message.subject}</h3>
                            {getStatusBadge(message.status)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{message.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span>{message.email}</span>
                            </div>
                            {message.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{message.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(message.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm">
                            Click "View" to see the full message.
                          </p>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // fetch full message body on demand
                              (async () => {
                                // Use the message data directly since we already have it
                                  setSelectedMessage(message);
                                setShowMessageModal(true);
                              })();
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => { setSelectedMessage(message); setReplyText(''); setReplyOpen(true); }}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          
                          {message.status === 'new' && (
                            <Button
                              size="sm"
                              onClick={() => updateMessageStatus(message.id, 'read')}
                            >
                              Mark as Read
                            </Button>
                          )}
                          
                          {message.status === 'read' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => updateMessageStatus(message.id, 'replied')}
                            >
                              <Reply className="h-4 w-4 mr-1" />
                              Mark as Replied
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMessageHandler(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          {/* Pagination */}
          <div className="p-4 pt-0">
            {hasMore && (
              <Button onClick={() => loadMessages(page + 1)} disabled={loadingMore} className="w-full">
                {loadingMore ? 'Loading…' : 'Load More'}
              </Button>
            )}
          </div>
        </main>
      </div>
      {/* Reply Dialog */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>Write your response and optionally open your email client to send it.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              To: {selectedMessage?.email} {selectedMessage?.name ? `(${selectedMessage.name})` : ''}
            </div>
            <Textarea rows={6} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your reply here..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyOpen(false)}>Cancel</Button>
            <Button onClick={() => replyToMessage(false)} disabled={!replyText.trim()}>Save Reply</Button>
            <Button onClick={() => replyToMessage(true)} disabled={!replyText.trim()}>Send Email & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
