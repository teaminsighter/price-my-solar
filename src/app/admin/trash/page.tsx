
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { getLeads, restoreFromTrash, deleteLeadPermanently, emptyTrash } from '@/app/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Trash2, Undo, AlertTriangle } from 'lucide-react';
import type { QuoteData } from '@/components/quote-funnel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Lead = QuoteData & { id: string; createdAt: string | null };
type SortDirection = 'asc' | 'desc';

export default function TrashPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState<keyof Lead>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const { toast } = useToast();

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        const result = await getLeads(true); // Fetch deleted leads
        if (result.success && result.leads) {
            setLeads(result.leads as Lead[]);
        } else {
            console.error("Failed to fetch trashed leads:", result.error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch trashed leads.' });
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const sortedLeads = useMemo(() => {
        return [...leads].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            
            let comparison = 0;
            if (sortColumn === 'createdAt' && aValue && bValue) {
                comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                comparison = aValue - bValue;
            } else {
                comparison = String(aValue).localeCompare(String(bValue));
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [leads, sortColumn, sortDirection]);

    const handleSort = (column: keyof Lead) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleRestore = async (id: string) => {
        const result = await restoreFromTrash(id);
        if (result.success) {
            toast({ title: 'Success', description: 'Lead restored successfully.' });
            fetchLeads();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };

    const handlePermanentDelete = async (id: string) => {
        const result = await deleteLeadPermanently(id);
        if (result.success) {
            toast({ title: 'Success', description: 'Lead permanently deleted.' });
            fetchLeads();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };
    
    const handleEmptyTrash = async () => {
        const result = await emptyTrash();
        if (result.success) {
            toast({ title: 'Success', description: `${result.deletedCount} leads permanently deleted.` });
            fetchLeads();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };

    const renderCellContent = (lead: Lead, columnKey: keyof Lead) => {
        const value = lead[columnKey];
        if (columnKey === 'createdAt' && typeof value === 'string') {
            return new Date(value).toLocaleString('en-NZ');
        }
        return String(value ?? '');
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Trash</h1>
            
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="text-destructive" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Actions performed here are irreversible. Leads deleted from the trash cannot be recovered.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" disabled={leads.length === 0}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Empty Trash
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all {leads.length} leads in the trash.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleEmptyTrash} className="bg-destructive hover:bg-destructive/90">
                                    Yes, delete everything
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Trashed Leads</CardTitle>
                    <CardDescription>
                        Leads in this list have been deleted from the main view. You can restore them or delete them permanently.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border shadow-sm">
                        <ScrollArea className="h-[50vh]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                                                Date Trashed
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button variant="ghost" onClick={() => handleSort('firstName')}>
                                                Name
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button variant="ghost" onClick={() => handleSort('address')}>
                                                Address
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedLeads.length > 0 ? (
                                        sortedLeads.map(lead => (
                                            <TableRow key={lead.id}>
                                                <TableCell>{renderCellContent(lead, 'createdAt')}</TableCell>
                                                <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                                                <TableCell>{lead.address}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleRestore(lead.id)}>
                                                        <Undo className="mr-2 h-4 w-4" />
                                                        Restore
                                                    </Button>
                                                    
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Permanently delete?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. The lead will be gone forever.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handlePermanentDelete(lead.id)} className="bg-destructive hover:bg-destructive/90">
                                                                    Delete Permanently
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">
                                                The trash is empty.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
