'use client';

import { useState, useMemo } from 'react';
import type { Report, ReportStatus, ReportCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ListFilter, AlertCircle, Clock, CheckCircle2, TrafficCone, Lightbulb, Trash2, Droplets, ShieldAlert, BarChartHorizontal, PieChart } from 'lucide-react';
import { ReportMap } from './ReportMap';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import Image from 'next/image';
import { format, formatDistanceToNow, startOfWeek, endOfWeek } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';


const statusColors: Record<ReportStatus, string> = {
    Submitted: 'border-blue-500/50 text-blue-500',
    Acknowledged: 'border-yellow-500/50 text-yellow-500',
    'In Progress': 'border-orange-500/50 text-orange-500',
    Resolved: 'border-green-500/50 text-green-500',
    Rejected: 'border-red-500/50 text-red-500',
};

const categoryIcons: Record<ReportCategory, React.ReactNode> = {
    'Pothole': <TrafficCone className="w-4 h-4 text-gray-500"/>,
    'Broken Streetlight': <Lightbulb className="w-4 h-4 text-gray-500"/>,
    'Overflowing Trash Bin': <Trash2 className="w-4 h-4 text-gray-500"/>,
    'Traffic Signal Malfunction': <AlertCircle className="w-4 h-4 text-red-500"/>,
    'Water Leak': <Droplets className="w-4 h-4 text-blue-500"/>,
    'Other': <AlertCircle className="w-4 h-4 text-gray-500"/>,
};

export function AdminDashboard({ reports }: { reports: Report[] }) {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [statusFilter, setStatusFilter] = useState<ReportStatus[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<ReportCategory[]>([]);
    
    const { statusCounts, urgentReportsCount } = useMemo(() => {
        const counts = reports.reduce((acc, report) => {
            acc.statusCounts[report.status] = (acc.statusCounts[report.status] || 0) + 1;
            if (report.isUrgent) {
                acc.urgentReportsCount++;
            }
            return acc;
        }, { statusCounts: {} as Record<ReportStatus, number>, urgentReportsCount: 0 });
        return counts;
    }, [reports]);
    
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const statusMatch = statusFilter.length === 0 || statusFilter.includes(report.status);
            const categoryMatch = categoryFilter.length === 0 || categoryFilter.includes(report.category);
            return statusMatch && categoryMatch;
        });
    }, [reports, statusFilter, categoryFilter]);
    
    const uniqueCategories = [...new Set(reports.map(r => r.category))] as ReportCategory[];
    const uniqueStatuses = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'] as ReportStatus[];
    
    const reportsThisWeek = useMemo(() => {
        const now = new Date();
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        return reports.filter(r => new Date(r.submittedAt) >= weekStart && new Date(r.submittedAt) <= weekEnd).length;
    }, [reports]);

    const averageResolutionTime = useMemo(() => {
        const resolvedReports = reports.filter(r => r.status === 'Resolved');
        if (resolvedReports.length === 0) return 'N/A';
        const totalTime = resolvedReports.reduce((acc, r) => {
            return acc + (new Date(r.updatedAt).getTime() - new Date(r.submittedAt).getTime());
        }, 0);
        const avgMilliseconds = totalTime / resolvedReports.length;
        const avgDays = avgMilliseconds / (1000 * 60 * 60 * 24);
        return `${avgDays.toFixed(1)} days`;
    }, [reports]);
    
    const categoryDistribution = useMemo(() => {
        const dist = reports.reduce((acc, report) => {
            acc[report.category] = (acc[report.category] || 0) + 1;
            return acc;
        }, {} as Record<ReportCategory, number>);
        
        return Object.entries(dist).map(([name, value]) => ({ name, value, fill: `hsl(var(--chart-${Object.keys(dist).indexOf(name) + 1}))` })).sort((a, b) => b.value - a.value);
    }, [reports]);
    
    const reportsByDay = useMemo(() => {
        const dist = reports.reduce((acc, report) => {
            const day = format(new Date(report.submittedAt), 'EEE');
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.map(day => ({ day, count: dist[day] || 0 }));
    }, [reports]);

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Reports" value={reports.length} icon={<ListFilter />} />
                <StatCard title="Urgent High-Priority" value={urgentReportsCount} icon={<ShieldAlert />} />
                <StatCard title="Resolved This Week" value={statusCounts['Resolved'] || 0} icon={<CheckCircle2 />} />
                <StatCard title="Average Resolution Time" value={averageResolutionTime} icon={<Clock />} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className='font-headline text-lg text-primary'>Reports by Category</CardTitle>
                        <CardDescription>Distribution of all submitted reports.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={{ value: { label: 'Reports', color: 'hsl(var(--accent))' } }} className="h-64 w-full">
                            <BarChart accessibilityLayer data={categoryDistribution} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 50 }}>
                                <CartesianGrid horizontal={false} />
                                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
                                <XAxis dataKey="value" type="number" hide />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="value" fill="hsl(var(--accent))" radius={4} layout="vertical">
                                     {categoryDistribution.map((entry) => (
                                        <Cell key={entry.name} fill={entry.fill} />
                                     ))}
                                </Bar>
                                 <ChartLegend content={<ChartLegendContent />} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className='font-headline text-lg text-primary'>Weekly Report Volume</CardTitle>
                        <CardDescription>Number of new reports submitted each day this week.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={{ count: { label: 'Reports', color: 'hsl(var(--accent))' } }} className="h-64 w-full">
                            <BarChart accessibilityLayer data={reportsByDay} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="hsl(var(--accent))" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-headline text-primary">Recent Reports</CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-auto gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueStatuses.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={statusFilter.includes(status)}
                                        onCheckedChange={(checked) => {
                                            setStatusFilter(prev => checked ? [...prev, status] : prev.filter(s => s !== status));
                                        }}
                                    >{status}</DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                 {uniqueCategories.map(cat => (
                                    <DropdownMenuCheckboxItem
                                        key={cat}
                                        checked={categoryFilter.includes(cat)}
                                        onCheckedChange={(checked) => {
                                            setCategoryFilter(prev => checked ? [...prev, cat] : prev.filter(c => c !== cat));
                                        }}
                                    >{cat}</DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px]">
                        <Table>
                            <TableHeader className="sticky top-0 bg-card">
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="hidden sm:table-cell">Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReports.map(report => (
                                    <TableRow key={report.id} onClick={() => setSelectedReport(report)} className="cursor-pointer">
                                        <TableCell className="font-medium flex items-center gap-2">
                                            {report.isUrgent && <ShieldAlert className="w-4 h-4 text-destructive" titleAccess='Urgent' />}
                                            {categoryIcons[report.category] || categoryIcons['Other']}
                                            {report.category}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{report.address}</TableCell>
                                        <TableCell><Badge variant="outline" className={statusColors[report.status]}>{report.status}</Badge></TableCell>
                                        <TableCell className="hidden md:table-cell">{formatDistanceToNow(new Date(report.submittedAt), { addSuffix: true })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline text-primary">Issue Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReportMap reports={filteredReports} />
                    </CardContent>
                </Card>
            </div>
            
            <ReportDetailsSheet report={selectedReport} onOpenChange={() => setSelectedReport(null)} />
        </div>
    );
}

function StatCard({ title, value, icon }: { title: string, value: number | string, icon: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function ReportDetailsSheet({ report, onOpenChange }: { report: Report | null, onOpenChange: (open: boolean) => void }) {
    return (
        <Sheet open={!!report} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg w-[90vw]">
                <ScrollArea className="h-full w-full pr-6">
                {report && (
                    <>
                    <SheetHeader>
                        <SheetTitle className="font-headline text-2xl flex items-center gap-2 text-primary">
                            {report.isUrgent && <ShieldAlert className="w-6 h-6 text-destructive" titleAccess='Urgent' />}
                            {report.category}
                        </SheetTitle>
                        <SheetDescription>Details for report <span className="font-mono">{report.trackingId}</span></SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6 py-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Status</span>
                             <Badge variant="outline" className={`${statusColors[report.status]} text-sm`}>{report.status}</Badge>
                        </div>

                        {report.photoUrl && (
                             <div className="space-y-2">
                                <h4 className="font-semibold">Photo</h4>
                                <Image src={report.photoUrl} alt="Report photo" width={400} height={300} className="rounded-lg border object-cover w-full" data-ai-hint="civic issue" />
                            </div>
                        )}
                        <div className="space-y-2">
                            <h4 className="font-semibold">Description</h4>
                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{report.description}</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold">Location</h4>
                            <p className="text-sm text-muted-foreground">{report.address}</p>
                        </div>
                         <div className="space-y-2">
                            <h4 className="font-semibold">Timeline</h4>
                            <ul className="text-xs text-muted-foreground space-y-2 border-l pl-4 ml-1">
                                <li className="flex gap-2 relative"><span className="absolute -left-[22px] top-1.5 h-2 w-2 rounded-full bg-muted-foreground"></span><span className="font-medium">Submitted:</span> {format(new Date(report.submittedAt), "PPP 'at' p")}</li>
                                <li className="flex gap-2 relative"><span className="absolute -left-[22px] top-1.5 h-2 w-2 rounded-full bg-muted-foreground/50"></span><span className="font-medium">Last Update:</span> {format(new Date(report.updatedAt), "PPP 'at' p")}</li>
                            </ul>
                        </div>
                    </div>
                     <SheetFooter className="mt-auto pt-6">
                        <div className="flex gap-2 w-full">
                            <Button size="sm" className="flex-1" variant="accent">Assign Department</Button>
                            <Button size="sm" variant="outline" className="flex-1">Update Status</Button>
                        </div>
                     </SheetFooter>
                    </>
                )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
