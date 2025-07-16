
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGtmSnippet, saveGtmSnippet } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const gtmSchema = z.object({
  snippet: z.string().min(1, 'Snippet cannot be empty.'),
});

export default function GtmPage() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof gtmSchema>>({
    resolver: zodResolver(gtmSchema),
    defaultValues: { snippet: '' },
  });

  useEffect(() => {
    const fetchSnippet = async () => {
      setLoading(true);
      const result = await getGtmSnippet();
      if (result.success && result.snippet) {
        form.setValue('snippet', result.snippet);
      } else if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch GTM snippet.' });
      }
      setLoading(false);
    };
    fetchSnippet();
  }, [form, toast]);

  const onSubmit = async (values: z.infer<typeof gtmSchema>) => {
    const result = await saveGtmSnippet(values.snippet);
    if (result.success) {
      toast({ title: 'Success', description: 'GTM snippet saved successfully.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  if (loading) {
    return (
        <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Google Tag Manager</h1>
      
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>GTM Integration</CardTitle>
              <CardDescription>
                Paste your full GTM container snippet for the &lt;head&gt; tag here. It will be saved to the database and injected on every page load across the site.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                  control={form.control}
                  name="snippet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GTM Snippet</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="<script>...</script>"
                          className="font-mono h-48"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Snippet'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
