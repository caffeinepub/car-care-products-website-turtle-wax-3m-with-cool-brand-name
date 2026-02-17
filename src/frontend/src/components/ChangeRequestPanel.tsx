import { useState } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquarePlus, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ChangeRequest {
  id: string;
  text: string;
  timestamp: number;
}

interface ChangeRequestPanelProps {
  trigger?: React.ReactNode;
}

export function ChangeRequestPanel({ trigger }: ChangeRequestPanelProps) {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useLocalStorageState<ChangeRequest[]>('change-requests', []);
  const [currentRequest, setCurrentRequest] = useState('');

  const handleSubmit = () => {
    const trimmedRequest = currentRequest.trim();
    
    if (!trimmedRequest) {
      toast.error('Please enter a change request');
      return;
    }

    const newRequest: ChangeRequest = {
      id: Date.now().toString(),
      text: trimmedRequest,
      timestamp: Date.now(),
    };

    setRequests([newRequest, ...requests]);
    setCurrentRequest('');
    toast.success('Change request submitted successfully');
  };

  const handleDelete = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
    toast.success('Change request deleted');
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Change Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Submit a Change Request</DialogTitle>
          <DialogDescription>
            Describe the changes you'd like to see in the application. Your requests are saved locally.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Input Section */}
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your change request in English..."
              value={currentRequest}
              onChange={(e) => setCurrentRequest(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <Button onClick={handleSubmit} className="w-full">
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </div>

          <Separator />

          {/* Previous Requests */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-sm font-semibold mb-3">
              Previous Requests ({requests.length})
            </h3>
            
            {requests.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center py-8">
                <div className="space-y-2">
                  <MessageSquarePlus className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No change requests yet
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-3">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 rounded-lg border border-border bg-muted/30 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm flex-1 whitespace-pre-wrap break-words">
                          {request.text}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(request.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(request.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
