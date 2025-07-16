
'use client';

import { useEffect, useState, useMemo } from 'react';
import { getLeads } from '@/app/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight, Download, ArrowUpDown, Columns, GripVertical } from 'lucide-react';
import type { QuoteData } from '@/components/quote-funnel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Lead = QuoteData & { id: string; createdAt: string | null };
type SortDirection = 'asc' | 'desc';
type ColumnConfig = { key: keyof Lead; label: string; visible: boolean };

const initialColumns: ColumnConfig[] = [
    { key: 'createdAt', label: 'Created At', visible: true },
    { key: 'firstName', label: 'First Name', visible: true },
    { key: 'lastName', label: 'Last Name', visible: true },
    { key: 'email', label: 'Email', visible: false },
    { key: 'phone', label: 'Phone', visible: true },
    { key: 'address', label: 'Address', visible: true },
    { key: 'propertyType', label: 'Property Type', visible: true },
    { key: 'motivation', label: 'Motivation', visible: false },
    { key: 'roofType', label: 'Roof Type', visible: false },
    { key: 'householdSize', label: 'Household Size', visible: false },
    { key: 'monthlyBill', label: 'Monthly Bill', visible: false },
    { key: 'island', label: 'Island', visible: false },
    { key: 'region', label: 'Region', visible: false },
    { key: 'gridSellBackInterest', label: 'Grid Sell Back', visible: false },
    { key: 'changePowerCompanyInterest', label: 'Change Power Co.', visible: false },
    { key: 'savingsPercent', label: 'Savings %', visible: false },
    { key: 'financeInterest', label: 'Finance Interest', visible: false },
];

function SortableColumnItem({ id, label, checked, onCheckedChange }: { id: string, label: string, checked: boolean, onCheckedChange: (value: boolean) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center" >
             <DropdownMenuCheckboxItem
                className="w-full"
                checked={checked}
                onCheckedChange={onCheckedChange}
                onSelect={(e) => e.preventDefault()}
            >
                <button {...attributes} {...listeners} className="cursor-grab mr-2">
                    <GripVertical className="h-4 w-4" />
                </button>
                {label}
            </DropdownMenuCheckboxItem>
        </div>
    );
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState<keyof Lead>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);

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
        const activeColumns = columns.filter(c => c.visible);
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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setColumns((items) => {
                const oldIndex = items.findIndex((item) => item.key === active.id);
                const newIndex = items.findIndex((item) => item.key === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    
    const handleColumnVisibilityChange = (key: string, value: boolean) => {
        setColumns(prev => 
            prev.map(col => col.key === key ? { ...col, visible: value } : col)
        );
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex-none p-8 pb-4">
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
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <ScrollArea className="h-64">
                                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext items={columns.map(c => c.key)} strategy={verticalListSortingStrategy}>
                                            {columns.map(column => (
                                                <SortableColumnItem
                                                    key={column.key}
                                                    id={column.key}
                                                    label={column.label}
                                                    checked={column.visible}
                                                    onCheckedChange={(value) => handleColumnVisibilityChange(column.key, value)}
                                                />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
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
            </div>

            <ScrollArea className="flex-grow">
                <div className="rounded-lg border shadow-sm mx-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox 
                                    checked={paginatedLeads.length > 0 && selectedRows.length === paginatedLeads.length}
                                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                                    />
                                </TableHead>
                                {columns.filter(c => c.visible).map(column => (
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
                                        {columns.filter(c => c.visible).map(column => (
                                            <TableCell key={column.key} className="whitespace-normal align-top">
                                                {renderCellContent(lead, column.key as keyof Lead)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.filter(c => c.visible).length + 1} className="text-center h-24">
                                        No leads found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </ScrollArea>
            
            <div className="flex-none p-8 pt-4">
                <div className="flex items-center justify-between">
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
                                    <SelectValue placeholder={rowsPerPage.toString()} />
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
        </div>
    );
}
