import { Report, ReportStatus, ReportCategory } from '@/lib/types';

// In-memory store for reports
let reports: Report[] = [];

// a simple function to get a random element from an array
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const statuses: ReportStatus[] = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'];
const categories: ReportCategory[] = ['Pothole', 'Broken Streetlight', 'Overflowing Trash Bin', 'Traffic Signal Malfunction', 'Water Leak', 'Other'];
const descriptions = [
    'Huge pothole on the main road, causing traffic issues.',
    'Streetlight near the park is flickering and about to go out.',
    'The trash bin at the bus stop is overflowing and smells bad.',
    'Traffic signal at the intersection of Oak and Pine is stuck on red.',
    'Major water leak from a pipe on Elm Street.',
    'A tree has fallen and is blocking the road on Maple Ave. This is a major hazard!',
    'The traffic lights at the junction of 5th and Main are completely out. It is causing chaos.'
];

const generateRandomAddress = () => {
    const streets = ['Oak St', 'Pine St', 'Maple Ave', 'Cedar Ln', 'Elm St'];
    const cities = ['Springfield', 'Rivertown', 'Mapleton', 'Oakville'];
    return `${Math.floor(Math.random() * 900) + 100} ${getRandom(streets)}, ${getRandom(cities)}`;
}

// Pre-populating with some data only if reports array is empty
if (reports.length === 0) {
    for (let i = 1; i <= 25; i++) {
        const submittedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const description = getRandom(descriptions);
        reports.push({
            id: `rep-${i}`,
            trackingId: `CC-${String(Date.now()).slice(-4)}${i}`,
            category: getRandom(categories),
            description: description,
            location: {
                lat: 34.0522 + (Math.random() - 0.5) * 0.1, // around LA
                lng: -118.2437 + (Math.random() - 0.5) * 0.1,
            },
            address: generateRandomAddress(),
            status: getRandom(statuses),
            isUrgent: /hazard|chaos|fallen|major/i.test(description), // Simple logic for urgency
            photoUrl: `https://picsum.photos/seed/report${i}/400/300`,
            submittedAt: submittedAt,
            updatedAt: new Date(submittedAt.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000)
        });
    }
}


export const getReports = async (): Promise<Report[]> => {
    // simulate db delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return reports.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
};

export const getReportByTrackingId = async (trackingId: string): Promise<Report | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return reports.find(report => report.trackingId === trackingId);
};

export const addReport = async (reportData: Omit<Report, 'id' | 'submittedAt' | 'updatedAt' | 'status'>): Promise<Report> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const now = new Date();
    const newReport: Report = {
        ...reportData,
        id: `rep-${reports.length + 1}`,
        status: 'Submitted',
        submittedAt: now,
        updatedAt: now,
    };
    reports.unshift(newReport); // Add to the beginning of the array
    return newReport;
};

export const updateReportStatus = async (id: string, status: ReportStatus): Promise<Report | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const reportIndex = reports.findIndex(r => r.id === id);
    if (reportIndex > -1) {
        reports[reportIndex].status = status;
        reports[reportIndex].updatedAt = new Date();
        return reports[reportIndex];
    }
    return undefined;
};
