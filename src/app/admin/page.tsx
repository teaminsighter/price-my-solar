
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { getLeads } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
    const [leadCount, setLeadCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            const result = await getLeads();
            if (result.success && result.leads) {
                setLeadCount(result.leads.length);
            } else {
                console.error("Failed to fetch leads:", result.error);
                setLeadCount(0);
            }
            setLoading(false);
        };

        fetchLeads();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Leads
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                             <Skeleton className="h-8 w-1/4" />
                        ) : (
                            <div className="text-2xl font-bold">{leadCount}</div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Total number of submitted quotes
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
