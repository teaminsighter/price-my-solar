
'use client';

import { useEffect, useState, useMemo } from 'react';
import { getLeads } from '@/app/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { QuoteData } from '@/components/quote-funnel';

type Lead = QuoteData & { id: string; createdAt: string | null };

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            const result = await getLeads();
            if (result.success && result.leads) {
                // Sort leads by creation date, newest first
                const sortedLeads = (result.leads as Lead[]).sort((a, b) => {
                    if (a.createdAt && b.createdAt) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    return 0;
                });
                setLeads(sortedLeads);
            } else {
                console.error("Failed to fetch leads:", result.error);
            }
            setLoading(false);
        };

        fetchLeads();
    }, []);

    const totalPages = Math.ceil(leads.length / rowsPerPage);
    const paginatedLeads = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return leads.slice(startIndex, startIndex + rowsPerPage);
    }, [leads, currentPage, rowsPerPage]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(paginatedLeads.map(lead => lead.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedRows(prev => [...prev, id]);
        } else {
            setSelectedRows(prev => prev.filter(rowId => rowId !== id));
        }
    };
    
    const downloadCSV = (data: Lead[], filename: string) => {
        if (data.length === 0) return;
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => 
            Object.values(row).map(value => 
                `"${String(value ?? '').replace(/"/g, '""')}"`
            ).join(',')
        );
        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportAll = () => {
        downloadCSV(leads, 'all_leads.csv');
    };

    const handleExportSelected = () => {
        const selectedLeads = leads.filter(lead => selectedRows.includes(lead.id));
        downloadCSV(selectedLeads, 'selected_leads.csv');
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
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={handleExportAll} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export All
                    </Button>
                    <Button onClick={handleExportSelected} variant="outline" size="sm" disabled={selectedRows.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Selected ({selectedRows.length})
                    </Button>
                </div>
            </div>
            <div className="rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox 
                                  checked={selectedRows.length === paginatedLeads.length && paginatedLeads.length > 0}
                                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                                />
                            </TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Property Type</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            paginatedLeads.length > 0 ? paginatedLeads.map(lead => (
                                <TableRow key={lead.id} data-state={selectedRows.includes(lead.id) ? "selected" : ""}>
                                    <TableCell>
                                      <Checkbox 
                                        checked={selectedRows.includes(lead.id)}
                                        onCheckedChange={(checked) => handleSelectRow(lead.id, Boolean(checked))}
                                      />
                                    </TableCell>
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
                                    <TableCell colSpan={6} className="text-center h-24">
                                        No leads found.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    {selectedRows.length} of {leads.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${rowsPerPage}`}
                            onValueChange={(value) => {
                                setRowsPerPage(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={rowsPerPage} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
