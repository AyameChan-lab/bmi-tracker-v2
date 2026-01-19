'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BMIInputForm({ onEntryCallback }: { onEntryCallback?: () => void }) {
    const router = useRouter();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const calculateBMI = () => {
        if (weight && height) {
            const h = parseFloat(height) / 100;
            const w = parseFloat(weight);
            return (w / (h * h)).toFixed(2);
        }
        return null;
    };

    const currentBMI = calculateBMI();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/bmi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    weight,
                    height,
                    date,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to add entry');
            }

            setWeight('');
            // Keep height as it usually doesn't change often
            if (onEntryCallback) onEntryCallback();
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getBMICategory = (bmi: number) => {
        if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
        if (bmi < 25) return { label: 'Normal weight', color: 'text-green-500' };
        if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
        return { label: 'Obese', color: 'text-red-500' };
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Entry</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                placeholder="70"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                                id="height"
                                type="number"
                                step="0.1"
                                placeholder="170"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {currentBMI && (
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div>
                                <span className="text-sm font-medium">Estimated BMI: </span>
                                <span className="text-2xl font-bold">{currentBMI}</span>
                            </div>
                            <div className={`font-semibold ${getBMICategory(parseFloat(currentBMI)).color}`}>
                                {getBMICategory(parseFloat(currentBMI)).label}
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Entry'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
