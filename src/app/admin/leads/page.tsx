
'use client';

import { useEffect, useState } from 'react';
import { getLeads } from '@/app/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import type { QuoteData } from '@/components/quote-funnel';

type Lead = QuoteData & { id: string; createdAt: string | null };

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            const result = await getLeads();
            if (result.success && result.leads) {
                setLeads(result.leads as Lead[]);
            } else {
                console.error("Failed to fetch leads:", result.error);
            }
            setLoading(false);
        };

        fetchLeads();
    }, []);

    const renderLoadingSkeleton = () => (
        Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
            </TableRow>
        ))
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <div className="rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Created At</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Property Type</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? renderLoadingSkeleton() : (
                            leads.length > 0 ? leads.map(lead => (
                                <TableRow key={lead.id}>
                                    <TableCell>
                                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-NZ') : 'N/A'}
                                    </TableCell>
                                    <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                                    <TableCell>
                                        <Badge variant={lead.propertyType === 'RESIDENTIAL' ? 'default' : 'secondary'}>
                                            {lead.propertyType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{lead.phone}</TableCell>
                                    <TableCell className="max-w-xs truncate">{lead.address}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No leads found.
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
