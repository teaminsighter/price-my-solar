
'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSetting, saveSetting, uploadFileAndSaveSetting } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

const settingsSchema = z.object({
  logoUrl: z.string().url('Invalid URL').or(z.literal('')),
  faviconUrl: z.string().url('Invalid URL').or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

function BrandingCard({
  title,
  description,
  settingKey,
}: {
  title: string;
  description: string;
  settingKey: 'logoUrl' | 'faviconUrl';
}) {
  const { toast } = useToast();
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<{ url: string }>({
    resolver: zodResolver(z.object({ url: z.string().url('Invalid URL').or(z.literal('')) })),
    defaultValues: { url: '' },
  });

  useEffect(() => {
    async function fetchSetting() {
      setLoading(true);
      const result = await getSetting(settingKey);
      if (result.success && result.value) {
        setCurrentImageUrl(result.value);
        form.setValue('url', result.value);
      } else {
        // Fallback for initial state if nothing is in the DB, and seed it.
        if (settingKey === 'logoUrl') {
            const defaultLogo = "https://firebasestorage.googleapis.com/v0/b/clariofs-3b19b.firebasestorage.app/o/PMS%20Images%2FPMS-Final-Logo-2.webp?alt=media&token=486ac4d9-d9dd-4921-ab19-0b4b55b4b2f1";
            await saveSetting(settingKey, defaultLogo);
            setCurrentImageUrl(defaultLogo);
            form.setValue('url', defaultLogo);
        }
        if (settingKey === 'faviconUrl') {
            const defaultFavicon = "/favicon.ico";
            await saveSetting(settingKey, defaultFavicon);
            setCurrentImageUrl(defaultFavicon);
            form.setValue('url', defaultFavicon);
        }
      }
      setLoading(false);
    }
    fetchSetting();
  }, [settingKey, form]);

  const handleUrlSubmit = async (values: { url: string }) => {
    setIsSubmitting(true);
    const result = await saveSetting(settingKey, values.url);
    if (result.success) {
      toast({ title: 'Success', description: `${title} URL saved.` });
      setCurrentImageUrl(values.url);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsSubmitting(false);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a file to upload.' });
        return;
    }
    setIsSubmitting(true);

    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            const fileData = {
                base64: base64String,
                type: file.type,
                name: file.name
            };

            const result = await uploadFileAndSaveSetting(settingKey, fileData);

            if (result.success && result.url) {
                toast({ title: 'Success', description: `${title} uploaded and saved.` });
                setCurrentImageUrl(result.url);
                form.setValue('url', result.url);
                setFile(null);
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
             setIsSubmitting(false);
        };
    } catch(e) {
         toast({ variant: 'destructive', title: 'Error', description: 'Could not read file.' });
         setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/3">
          <p className="text-sm font-medium mb-2">Current Image</p>
          <div className="w-full h-32 flex items-center justify-center rounded-lg border border-dashed bg-muted/50">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : currentImageUrl ? (
              <Image src={currentImageUrl} alt={`Current ${title}`} width={128} height={128} className="object-contain max-h-full max-w-full" unoptimized={settingKey === 'faviconUrl'} />
            ) : (
              <p className="text-sm text-muted-foreground">No Image Set</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
                <div className="space-y-4 mt-4">
                   <div className="space-y-2">
                     <Label htmlFor={`${settingKey}-file`}>Upload from computer</Label>
                     <Input id={`${settingKey}-file`} type="file" onChange={handleFileChange} accept="image/*,.ico" />
                   </div>
                   <Button onClick={handleFileUpload} disabled={isSubmitting || !file}>
                     {isSubmitting ? 'Uploading...' : 'Upload and Save'}
                   </Button>
                </div>
            </TabsContent>
            <TabsContent value="url">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUrlSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save URL'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}


export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
      <div className="space-y-6">
        <BrandingCard 
            title="Logo"
            description="Update your site's main logo. Recommended size: 400x100px."
            settingKey="logoUrl"
        />
        <BrandingCard 
            title="Favicon"
            description="Update your site's favicon. Recommended size: 32x32px or 16x16px."
            settingKey="faviconUrl"
        />
      </div>
    </div>
  );
}
