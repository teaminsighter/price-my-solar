
'use client';

import { useEffect, useState, useMemo } from 'react';
import { getLeads } from '@/app/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight, Download, ArrowUpDown, Columns } from 'lucide-react';
import type { QuoteData } from '@/components/quote-funnel';
import { ScrollArea } from '@/components/ui/scroll-area';

type Lead = QuoteData & { id: string; createdAt: string | null };
type SortDirection = 'asc' | 'desc';

// Define all possible columns
const allColumns: { key: keyof Lead; label: string }[] = [
    { key: 'createdAt', label: 'Created At' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'propertyType', label: 'Property Type' },
    { key: 'motivation', label: 'Motivation' },
    { key: 'roofType', label: 'Roof Type' },
    { key: 'householdSize', label: 'Household Size' },
    { key: 'monthlyBill', label: 'Monthly Bill' },
    { key: 'island', label: 'Island' },
    { key: 'region', label: 'Region' },
    { key: 'gridSellBackInterest', label: 'Grid Sell Back' },
    { key: 'changePowerCompanyInterest', label: 'Change Power Co.' },
    { key: 'savingsPercent', label: 'Savings %' },
    { key: 'financeInterest', label: 'Finance Interest' },
];

const defaultVisibleColumns: (keyof Lead)[] = ['createdAt', 'firstName', 'lastName', 'propertyType', 'phone', 'address'];

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState<keyof Lead>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        allColumns.forEach(col => {
            initialState[col.key] = defaultVisibleColumns.includes(col.key as keyof Lead);
        });
        return initialState;
    });

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

    const paginatedLeads = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedLeads.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedLeads, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(leads.length / rowsPerPage);

    const handleSort = (column: keyof Lead) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

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
        const activeColumns = allColumns.filter(c => visibleColumns[c.key]);
        const headers = activeColumns.map(c => c.label).join(',');
        const rows = data.map(row => 
            activeColumns.map(col => {
                const value = row[col.key as keyof Lead];
                return `"${String(value ?? '').replace(/"/g, '""')}"`;
            }).join(',')
        );
        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
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

    const renderCellContent = (lead: Lead, columnKey: keyof Lead) => {
        const value = lead[columnKey];
        if (columnKey === 'propertyType') {
            return (
                <Badge variant={value === 'RESIDENTIAL' ? 'default' : 'secondary'}>
                    {value}
                </Badge>
            );
        }
        if (columnKey === 'createdAt' && typeof value === 'string') {
            return new Date(value).toLocaleString('en-NZ');
        }
        return String(value ?? '');
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Columns className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                             <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             <ScrollArea className="h-64">
                                {allColumns.map(column => (
                                    <DropdownMenuCheckboxItem
                                        key={column.key}
                                        className="capitalize"
                                        checked={visibleColumns[column.key]}
                                        onCheckedChange={value =>
                                            setVisibleColumns(prev => ({
                                                ...prev,
                                                [column.key]: !!value,
                                            }))
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        {column.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                             </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                                  checked={paginatedLeads.length > 0 && selectedRows.length === paginatedLeads.length}
                                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                                />
                            </TableHead>
                            {allColumns.filter(c => visibleColumns[c.key]).map(column => (
                                <TableHead key={column.key}>
                                    <Button variant="ghost" onClick={() => handleSort(column.key as keyof Lead)}>
                                        {column.label}
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedLeads.length > 0 ? (
                            paginatedLeads.map(lead => (
                                <TableRow key={lead.id} data-state={selectedRows.includes(lead.id) ? "selected" : ""}>
                                    <TableCell>
                                        <Checkbox 
                                            checked={selectedRows.includes(lead.id)}
                                            onCheckedChange={(checked) => handleSelectRow(lead.id, Boolean(checked))}
                                        />
                                    </TableCell>
                                    {allColumns.filter(c => visibleColumns[c.key]).map(column => (
                                        <TableCell key={column.key} className="whitespace-normal align-top">
                                            {renderCellContent(lead, column.key as keyof Lead)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="text-center h-24">
                                    No leads found.
                                </TableCell>
                            </TableRow>
                        )}
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
