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
  admin_notes?: string | null;
}

export default function AdminContactMessagesFixed() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      console.log('Loading contact messages...');
      // Replace Supabase with MySQL service
      const { messages: rows, total: count } = await getMessages({
        page: 1,
        pageSize: 20,
        status: statusFilter,
        search: searchQuery
      });
      setMessages(rows);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      console.log('Updating message status:', messageId, newStatus);
      
      await updateMessage(messageId, { status: newStatus, updated_at: new Date().toISOString() });
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus, updated_at: new Date().toISOString() } : msg
      ));

      toast({
        title: "Status Updated",
        description: `Message status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    }
  };

  const replyToMessage = async (sendEmail: boolean) => {
    if (!selectedMessage) return;
    
    try {
      console.log('Saving reply for message:', selectedMessage.id);
      console.log('Reply text:', replyText);
      console.log('Send email:', sendEmail);
      
      // Update the message with reply
      const updateData = { 
        status: 'replied',
        responded_at: new Date().toISOString(),
        admin_notes: replyText,
        updated_at: new Date().toISOString()
      };
      
      console.log('Update data:', updateData);
      
      await updateMessage(selectedMessage.id, { ...updateData });
      
      // Update local state
      setMessages(prev => prev.map(m => 
        m.id === selectedMessage.id ? { 
          ...m, 
          status: 'replied',
          admin_notes: replyText,
          responded_at: new Date().toISOString()
        } : m
      ));
      
      if (sendEmail) {
        // Try to send email
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
            </div>
          `;

          // Try to send via email service
          const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-email-direct', {
            body: {
              to: selectedMessage.email,
              subject: `Re: ${selectedMessage.subject}`,
              html: emailHtml,
              text: replyText,
              from: 'verifiedengines@gmail.com',
              replyTo: 'verifiedengines@gmail.com',
              messageId: selectedMessage.id
            }
          });

          if (emailError) {
            console.error('Email service error:', emailError);
            
            // Fallback to mailto
            const mailto = `mailto:${encodeURIComponent(selectedMessage.email)}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}&body=${encodeURIComponent(replyText)}`;
            window.open(mailto, '_blank');
            
            toast({ 
              title: 'Email Service Unavailable', 
              description: 'Email composer opened as fallback. Please send manually.',
              variant: 'destructive'
            });
          } else if (emailResult?.success) {
            toast({ 
              title: 'Reply Sent!', 
              description: `Email sent to ${selectedMessage.email} successfully.` 
            });
          } else {
            // Fallback to mailto
            const mailto = `mailto:${encodeURIComponent(selectedMessage.email)}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}&body=${encodeURIComponent(replyText)}`;
            window.open(mailto, '_blank');
            
            toast({ 
              title: 'Email Service Not Available', 
              description: 'Email composer opened. Please send manually.',
              variant: 'destructive'
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
        toast({ 
          title: 'Reply Saved', 
          description: 'Message marked as replied and saved.' 
        });
      }
      
      setReplyText('');
      setReplyOpen(false);
    } catch (error) {
      console.error('Reply save error:', error);
      const description = error instanceof Error ? error.message : 'Failed to save reply';
      
      toast({ 
        title: 'Error', 
        description: `Failed to save reply: ${description}`,
        variant: 'destructive' 
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(messageId);

      setMessages(prev => prev.filter(msg => msg.id !== messageId));

      toast({
        title: "Message Deleted",
        description: "Contact message has been deleted successfully.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = !searchQuery || 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      case 'read':
        return <Badge variant="outline">Read</Badge>;
      case 'replied':
        return <Badge variant="default">Replied</Badge>;
      case 'archived':
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return <Badge variant="secondary">New</Badge>;
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Contact Messages</h1>
            </div>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading contact messages...</p>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Contact Messages</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No messages match your current filters.' 
                      : 'No contact messages have been received yet.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{message.name}</h3>
                          {getStatusBadge(message.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {message.email}
                          </div>
                          {message.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {message.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(message.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <h4 className="font-medium mb-2">{message.subject}</h4>
                        <p className="text-muted-foreground line-clamp-2">{message.message}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setShowMessageModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setReplyOpen(true);
                          }}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Select
                          value={message.status || 'new'}
                          onValueChange={(value) => updateMessageStatus(message.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>

        {/* Message Detail Modal */}
        <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Message Details</DialogTitle>
              <DialogDescription>
                Full details of the contact message
              </DialogDescription>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-sm">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-sm">{selectedMessage.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p className="text-sm">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="text-sm font-medium">{selectedMessage.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                {selectedMessage.admin_notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">{selectedMessage.admin_notes}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowMessageModal(false);
                setReplyOpen(true);
              }}>
                Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reply Modal */}
        <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reply to Message</DialogTitle>
              <DialogDescription>
                Send a reply to {selectedMessage?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Reply Message</label>
                <Textarea
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-32"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setReplyOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => replyToMessage(false)}
                disabled={!replyText.trim()}
              >
                Save Only
              </Button>
              <Button 
                onClick={() => replyToMessage(true)}
                disabled={!replyText.trim()}
              >
                Save & Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}

