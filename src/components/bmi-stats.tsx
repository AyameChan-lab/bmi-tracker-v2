'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subDays, subMonths, subYears, isAfter } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function BMIStats({ data }: { data: any[] }) {
    const [range, setRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');

    const stats = useMemo(() => {
        const now = new Date();
        let startDate = subDays(now, 7);

        if (range === 'daily') startDate = subDays(now, 1); // stats for last 24h? or today? Let's say last 7 days for daily view usually.
        // Actually the requirement says daily/weekly... let's interpret:
        // Daily: Last 7 days
        // Weekly: Last 1 month
        // Monthly: Last 6 months
        // Yearly: Last 1 year
        // Wait, let's stick to standard report periods.
        if (range === 'daily') startDate = subDays(now, 7);
        if (range === 'weekly') startDate = subMonths(now, 1);
        if (range === 'monthly') startDate = subMonths(now, 6);
        if (range === 'yearly') startDate = subYears(now, 1);

        const filtered = data.filter((entry) => isAfter(new Date(entry.date), startDate));

        if (filtered.length === 0) return null;

        const bmis = filtered.map(e => e.bmi);
        const min = Math.min(...bmis);
        const max = Math.max(...bmis);
        const avg = bmis.reduce((a, b) => a + b, 0) / bmis.length;

        // Trend (compare first and last of period)
        const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const first = sorted[0].bmi;
        const last = sorted[sorted.length - 1].bmi;
        const trend = last - first;

        return { min, max, avg, trend, count: filtered.length };
    }, [data, range]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">MIS Reports</h2>
                <div className="flex gap-2">
                    {['daily', 'weekly', 'monthly', 'yearly'].map((r) => (
                        <Button
                            key={r}
                            variant={range === r ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setRange(r as any)}
                            className="capitalize"
                        >
                            {r}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average BMI</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.avg.toFixed(2) || '-'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Lowest BMI</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.min.toFixed(2) || '-'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Highest BMI</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.max.toFixed(2) || '-'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <div className="text-2xl font-bold">
                            {stats ? Math.abs(stats.trend).toFixed(2) : '-'}
                        </div>
                        {stats && (
                            stats.trend > 0 ? <TrendingUp className="text-red-500" /> :
                                stats.trend < 0 ? <TrendingDown className="text-green-500" /> : <Minus />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
