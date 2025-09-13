import { Report, ReportStatus, ReportCategory } from '@/lib/types';

// In-memory store for reports
let reports: Report[] = [];

const submittedByNames = [
    'Arjun Sharma', 'Priya Patel', 'Rohan Das', 'Anika Gupta', 'Vikram Singh',
    'Ishaan Reddy', 'Meera Iyer', 'Sameer Khan', 'Diya Mehta', 'Kabir Joshi'
];

// A specific set of 10 mock reports for predictable demoing
const mockReports: Report[] = [
    // 1 (Resolved)
    { id: 'rep-mock-1', trackingId: 'CC-MOCK-1', category: 'Pothole', description: 'Large pothole in front of the local market in Mumbai, causing severe traffic disruption.', location: { lat: 19.0760, lng: 72.8777 }, address: 'Near Dadar Market, Mumbai, Maharashtra', status: 'Resolved', isUrgent: false, photoUrl: 'https://d3i6fh83elv35t.cloudfront.net/static/2020/05/2020-05-21T100018Z_383787307_RC2WSG9NQ3MW_RTRMADP_3_ASIA-STORM-INDIA-1024x696.jpg', submittedAt: new Date('2024-07-10T09:00:00Z'), updatedAt: new Date('2024-07-15T14:30:00Z'), submittedBy: 'Priya Patel' },
    // 2 (In Progress)
    { id: 'rep-mock-2', trackingId: 'CC-MOCK-2', category: 'Broken Streetlight', description: 'Streetlight on corner of Park Street is out, area is very dark and unsafe at night.', location: { lat: 22.5596, lng: 88.3541 }, address: 'Park Street, Kolkata, West Bengal', status: 'In Progress', isUrgent: true, photoUrl: 'https://c8.alamy.com/comp/2R6KEKN/a-family-standing-on-a-culvert-in-a-village-logged-with-rain-water-tamil-nadu-south-india-india-asia-2R6KEKN.jpg', submittedAt: new Date('2024-07-18T22:15:00Z'), updatedAt: new Date('2024-07-19T11:00:00Z'), submittedBy: 'Rohan Das' },
    // 3 (Acknowledged)
    { id: 'rep-mock-3', trackingId: 'CC-MOCK-3', category: 'Overflowing Trash Bin', description: 'Community trash bin near the temple in Varanasi has not been emptied for a week.', location: { lat: 25.3176, lng: 82.9739 }, address: 'Near Kashi Vishwanath Temple, Varanasi, Uttar Pradesh', status: 'Acknowledged', isUrgent: false, photoUrl: 'https://i.ytimg.com/vi/vDvvFg_Dvkw/hq720.jpg', submittedAt: new Date('2024-07-20T11:45:00Z'), updatedAt: new Date('2024-07-20T16:00:00Z'), submittedBy: 'Anika Gupta' },
    // 4 (Resolved)
    { id: 'rep-mock-4', trackingId: 'CC-MOCK-4', category: 'Water Leak', description: 'Clean water pipe is leaking heavily on the main road in Jaipur.', location: { lat: 26.9124, lng: 75.7873 }, address: 'Hawa Mahal Road, Jaipur, Rajasthan', status: 'Resolved', isUrgent: true, photoUrl: 'https://images.assettype.com/nationalherald/2024-07/8eaecba8-8f41-48a4-8940-8793e629ee8c/PTI07_30_2024_000054B.jpg', submittedAt: new Date('2024-07-12T08:00:00Z'), updatedAt: new Date('2024-07-13T17:00:00Z'), submittedBy: 'Vikram Singh' },
    // 5 (Submitted)
    { id: 'rep-mock-5', trackingId: 'CC-MOCK-5', category: 'Other', description: 'Stray dogs are causing issues in the residential area of Sector 17.', location: { lat: 30.7415, lng: 76.7766 }, address: 'Sector 17, Chandigarh', status: 'Submitted', isUrgent: false, photoUrl: 'https://resize.indiatvnews.com/en/resize/gallery/840_-/2021/12/cloudburst-in-devprayag-1-1640797324.jpg', submittedAt: new Date(), updatedAt: new Date(), submittedBy: 'Ishaan Reddy' },
    // 6 (Resolved)
    { id: 'rep-mock-6', trackingId: 'CC-MOCK-6', category: 'Pothole', description: 'Series of potholes on the road to the IT park.', location: { lat: 12.9716, lng: 77.5946 }, address: 'Electronic City, Bengaluru, Karnataka', status: 'Resolved', isUrgent: false, photoUrl: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202407/wayanad-visual-explainer-how-landslide-triggered-mud-wall-swept-villages-312238722-16x9_0.jpg?VersionId=WL912oKi2t_sT.kgdx7M5yDu4NTsPHhb&size=690:388', submittedAt: new Date('2024-07-01T10:00:00Z'), updatedAt: new Date('2024-07-08T12:00:00Z'), submittedBy: 'Meera Iyer' },
    // 7 (Resolved)
    { id: 'rep-mock-7', trackingId: 'CC-MOCK-7', category: 'Traffic Signal Malfunction', description: 'The traffic signal at the main Chennai crossing is stuck on green, very dangerous.', location: { lat: 13.0827, lng: 80.2707 }, address: 'Anna Salai, Chennai, Tamil Nadu', status: 'Resolved', isUrgent: true, photoUrl: 'https://www.reuters.com/resizer/v2/4BQECLG2N5P4JOBWNXZ2TSWPEE.jpg?auth=cde92101b9eb6cb84f575cf45450569fc896d0a994907d2924f54c4b2ff22348&width=1080&quality=80', submittedAt: new Date('2024-07-19T18:00:00Z'), updatedAt: new Date('2024-07-19T20:30:00Z'), submittedBy: 'Sameer Khan' },
    // 8 (Resolved)
    { id: 'rep-mock-8', trackingId: 'CC-MOCK-8', category: 'Overflowing Trash Bin', description: 'Garbage overflowing at Marina Beach entrance.', location: { lat: 13.0500, lng: 80.2824 }, address: 'Marina Beach, Chennai, Tamil Nadu', status: 'Resolved', isUrgent: false, photoUrl: 'https://static.toiimg.com/thumb/msid-66073756,width-748,height-499,resizemode=4,imgsize-199400/Pictures-of-these-gorgeous-Indian-villages-will-make-you-change-your-travel-plans.jpg', submittedAt: new Date('2024-07-14T13:00:00Z'), updatedAt: new Date('2024-07-16T11:00:00Z'), submittedBy: 'Diya Mehta' },
    // 9 (Rejected)
    { id: 'rep-mock-9', trackingId: 'CC-MOCK-9', category: 'Other', description: 'My neighbour plays loud music. Please tell them to stop.', location: { lat: 28.6139, lng: 77.2090 }, address: 'Connaught Place, New Delhi, Delhi', status: 'Rejected', isUrgent: false, photoUrl: 'https://images.unsplash.com/photo-1586618770443-e6f8167fca61', submittedAt: new Date('2024-07-21T19:00:00Z'), updatedAt: new Date('2024-07-21T19:30:00Z'), submittedBy: 'Kabir Joshi' },
    // 0 -> 10 (Rejected)
    { id: 'rep-mock-0', trackingId: 'CC-MOCK-0', category: 'Other', description: 'A cat is stuck on my roof.', location: { lat: 17.3850, lng: 78.4867 }, address: 'Charminar, Hyderabad, Telangana', status: 'Rejected', isUrgent: false, photoUrl: 'https://picsum.photos/seed/mock0/400/300', submittedAt: new Date('2024-07-20T19:00:00Z'), updatedAt: new Date('2024-07-20T19:30:00Z'), submittedBy: 'Arjun Sharma' },
     // 11 -> Should also be rejected
    { id: 'rep-mock-11', trackingId: 'CC-MOCK-11', category: 'Broken Streetlight', description: 'The light is too bright, it shines in my window.', location: { lat: 18.5204, lng: 73.8567 }, address: 'Koregaon Park, Pune, Maharashtra', status: 'Rejected', isUrgent: false, photoUrl: 'https://picsum.photos/seed/mock11/400/300', submittedAt: new Date('2024-07-18T23:00:00Z'), updatedAt: new Date('2024-07-19T09:00:00Z'), submittedBy: 'Aisha Begum' },
];


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
    const streets = ['Panchayat Ghar Road', 'Main Bazaar', 'Badhauli-Sadhaura Road', 'Link Road', 'Village Outskirts'];
    return `${getRandom(streets)}, Badhauli Village, Haryana, 8997`;
}

// Pre-populating with some data only if reports array is empty
if (reports.length === 0) {
    // Adding the specific mock reports first
    reports.push(...mockReports);
    
    // Add some more random ones to populate the admin dashboard
    for (let i = 1; i <= 15; i++) {
        const submittedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const description = getRandom(descriptions);
        reports.push({
            id: `rep-rand-${i}`,
            trackingId: `CC-RAND-${String(Date.now()).slice(-4)}${i}`,
            category: getRandom(categories),
            description: description,
            location: {
                lat: 30.3953 + (Math.random() - 0.5) * 0.05, // around Badhauli, Haryana
                lng: 77.1008 + (Math.random() - 0.5) * 0.05,
            },
            address: generateRandomAddress(),
            status: getRandom(statuses),
            isUrgent: /hazard|chaos|fallen|major/i.test(description), // Simple logic for urgency
            photoUrl: `https://picsum.photos/seed/report${i}/400/300`,
            submittedAt: submittedAt,
            updatedAt: new Date(submittedAt.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000),
            submittedBy: getRandom(submittedByNames),
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
    
    // First, try to find a real report
    const realReport = reports.find(report => report.trackingId === trackingId);
    if (realReport) {
        return realReport;
    }

    // If not found, use the new demo logic
    const lastChar = trackingId.slice(-1);
    const lastDigit = parseInt(lastChar, 10);

    if (!isNaN(lastDigit)) {
        // '0' corresponds to the 10th report in our 0-indexed array (mockReports[9])
        // '1' corresponds to mockReports[0], etc.
        let report;
        if (lastDigit === 0) {
            report = mockReports[9]; // CC-MOCK-0
        } else if (lastDigit > 0 && lastDigit <= 9) {
            report = mockReports[lastDigit - 1];
        }

        if (report) {
            // Return a copy with the user's trackingId
            return { ...report, trackingId: trackingId };
        }
    }
    
    // Fallback to original random generator if last digit is not a number or out of range
    return getRandomReportData(trackingId);
};

// Generates a random report for prototyping when a tracking ID is not found
export const getRandomReportData = (trackingId: string): Report => {
    const submittedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const description = getRandom(descriptions);
    const status = getRandom(statuses);
    return {
        id: `rep-random-${Math.floor(Math.random() * 1000)}`,
        trackingId: trackingId,
        category: getRandom(categories),
        description,
        location: {
            lat: 30.3953 + (Math.random() - 0.5) * 0.05, // around Badhauli, Haryana
            lng: 77.1008 + (Math.random() - 0.5) * 0.05,
        },
        address: generateRandomAddress(),
        status,
        isUrgent: /hazard|chaos|fallen|major/i.test(description),
        photoUrl: `https://picsum.photos/seed/${trackingId}/400/300`,
        submittedAt: submittedAt,
        updatedAt: new Date(submittedAt.getTime() + Math.random() * (status === 'Submitted' ? 0 : 10 * 24 * 60 * 60 * 1000)),
        submittedBy: getRandom(submittedByNames),
    };
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
