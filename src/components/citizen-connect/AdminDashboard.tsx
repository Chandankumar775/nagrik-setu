'use client';

import { useState, useMemo } from 'react';
import type { Report, ReportStatus, ReportCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ListFilter, AlertCircle, Clock, CheckCircle2, Hourglass, Wrench } from 'lucide-react';
import { ReportMap } from './ReportMap';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

const statusColors: Record<ReportStatus, string> = {
    Submitted: 'border-blue-500/50 text-blue-500',
    Acknowledged: 'border-yellow-500/50 text-yellow-500',
    'In Progress': 'border-orange-500/50 text-orange-500',
    Resolved: 'border-green-500/50 text-green-500',
    Rejected: 'border-red-500/50 text-red-500',
};

const categoryIcons: Record<ReportCategory, React.ReactNode> = {
    'Pothole': <Wrench className="w-4 h-4 text-gray-500"/>,
    'Broken Streetlight': <Wrench className="w-4 h-4 text-gray-500"/>,
    'Overflowing Trash Bin': <Wrench className="w-4 h-4 text-gray-500"/>,
    'Traffic Signal Malfunction': <Wrench className="w-4 h-4 text-gray-500"/>,
    'Water Leak': <Wrench className="w-4 h-4 text-gray-500"/>,
    'Other': <AlertCircle className="w-4 h-4 text-gray-500"/>,
};

export function AdminDashboard({ reports }: { reports: Report[] }) {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [statusFilter, setStatusFilter] = useState<ReportStatus[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<ReportCategory[]>([]);
    
    const statusCounts = useMemo(() => reports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
    }, {} as Record<ReportStatus, number>), [reports]);
    
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const statusMatch = statusFilter.length === 0 || statusFilter.includes(report.status);
            const categoryMatch = categoryFilter.length === 0 || categoryFilter.includes(report.category);
            return statusMatch && categoryMatch;
        });
    }, [reports, statusFilter, categoryFilter]);
    
    const uniqueCategories = [...new Set(reports.map(r => r.category))] as ReportCategory[];
    const uniqueStatuses = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'] as ReportStatus[];

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Reports" value={reports.length} icon={<ListFilter />} />
                <StatCard title="In Progress" value={statusCounts['In Progress'] || 0} icon={<Hourglass />} />
                <StatCard title="Resolved" value={statusCounts['Resolved'] || 0} icon={<CheckCircle2 />} />
                <StatCard title="Pending" value={(statusCounts['Submitted'] || 0) + (statusCounts['Acknowledged'] || 0)} icon={<Clock />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-headline">Recent Reports</CardTitle>
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
                        <CardTitle className="font-headline">Issue Map</CardTitle>
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

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
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
                        <SheetTitle className="font-headline text-2xl">{report.category}</SheetTitle>
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
                            <Button size="sm" className="flex-1">Assign Department</Button>
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
