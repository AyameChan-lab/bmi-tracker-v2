'use client';

import { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { format, subDays, subMonths, subYears, isAfter } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function BMIChart({ data }: { data: any[] }) {
    const [range, setRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

    const filteredData = useMemo(() => {
        const now = new Date();
        let startDate = subDays(now, 7); // Default to last 7 days for daily view

        if (range === 'weekly') startDate = subMonths(now, 1);
        if (range === 'monthly') startDate = subMonths(now, 6);
        if (range === 'yearly') startDate = subYears(now, 1);

        // Filter and Sort
        const filtered = data
            .filter((entry) => isAfter(new Date(entry.date), startDate))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Format for Chart
        return filtered.map((entry) => ({
            ...entry,
            formattedDate: format(new Date(entry.date), range === 'daily' ? 'MMM dd' : 'yyyy-MM-dd'),
            bmi: entry.bmi
        }));
    }, [data, range]);

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>BMI History</CardTitle>
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
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="formattedDate" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="bmi"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
