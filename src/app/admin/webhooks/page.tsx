
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getWebhooks, addWebhook, updateWebhookStatus, deleteWebhook } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type Webhook = {
  id: string;
  name: string;
  url: string;
  active: boolean;
};

const webhookSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  url: z.string().url('Please enter a valid URL'),
});

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof webhookSchema>>({
    resolver: zodResolver(webhookSchema),
    defaultValues: { name: '', url: '' },
  });

  const fetchWebhooks = async () => {
    const result = await getWebhooks();
    if (result.success && result.webhooks) {
      setWebhooks(result.webhooks);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch webhooks.' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const onSubmit = async (values: z.infer<typeof webhookSchema>) => {
    const result = await addWebhook(values.name, values.url);
    if (result.success) {
      toast({ title: 'Success', description: 'Webhook added successfully.' });
      form.reset();
      setLoading(true);
      fetchWebhooks();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };
  
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const result = await updateWebhookStatus(id, !currentStatus);
    if (result.success) {
      toast({ title: 'Success', description: `Webhook ${!currentStatus ? 'activated' : 'deactivated'}.`});
      setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !currentStatus } : w));
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteWebhook(id);
    if (result.success) {
      toast({ title: 'Success', description: 'Webhook deleted.' });
      setLoading(true);
      fetchWebhooks();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Webhook</CardTitle>
          <CardDescription>
            Active webhooks will receive a POST request with the form data when a new quote is submitted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Zapier Integration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-webhook-url.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:pt-8">
                 <Button type="submit" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? 'Adding...' : 'Add Webhook'}
                 </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                    </TableRow>
                  ))
                ) : webhooks.length > 0 ? (
                  webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">{webhook.name}</TableCell>
                      <TableCell className="max-w-sm truncate text-muted-foreground">{webhook.url}</TableCell>
                      <TableCell>
                        <Switch
                          checked={webhook.active}
                          onCheckedChange={() => handleToggleActive(webhook.id, webhook.active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the webhook "{webhook.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(webhook.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No webhooks found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
