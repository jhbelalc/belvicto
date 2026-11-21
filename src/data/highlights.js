// Add a new highlight by appending an object to this array.
// Videos: { id, type: 'short' | 'video', title } where id is the YouTube video id.
// Images go in /public/images/ (not /public/highlights: that path is the page route).

export const HIGHLIGHTS = [
    {
        id: 'piradar',
        name: 'piRadar',
        tagline: 'Expense tracker for iPhone and iPad',
        logo: '/images/piradar.png',
        storeUrl: 'https://apps.apple.com/us/app/piradar-expense-tracker/id6817079629',
        intro: 'piRadar is a personal finance app that keeps everything on your phone. No accounts, no cloud and no internet needed: your transactions, receipts and reports never leave your device.',
        sections: [
            {
                title: 'Log in seconds',
                items: [
                    'Expenses and income in US dollars (USD) and Colombian pesos (COP).',
                    'Categories and subcategories with icons and colors, ready to use or made your way.',
                    'Payment methods: cash, cards, bank accounts, digital wallets like Venmo or Zelle, and your own.',
                    'Merchant, description and notes so you can find every transaction later.',
                ],
            },
            {
                title: 'Scan your receipts',
                items: [
                    'Take a photo of the receipt or pick one from your gallery.',
                    'The text is read on your phone and is never sent to any server.',
                    'piRadar suggests the total, date and merchant; you confirm before saving.',
                    'It remembers the name and category you chose last time for that merchant.',
                    'The photo is stored next to the transaction, inside the encrypted database.',
                ],
            },
            {
                title: 'See where your money goes',
                items: [
                    "A home screen with this month's totals and how they compare with last month.",
                    'Reports by day, week, month or year.',
                    'Charts by category and by payment method, and over time.',
                    'Average daily spending.',
                    'A combined view in your base currency using the exchange rates you enter.',
                ],
            },
            {
                title: 'Private by design',
                items: [
                    "The database is encrypted with a key kept in your phone's secure storage.",
                    'The app does not request internet access, so it cannot send your data anywhere.',
                    'No ads, no sign-up and no tracking.',
                ],
            },
            {
                title: 'Your backup, in your hands',
                items: [
                    'Export an encrypted backup file with a password you choose.',
                    'Save it wherever you like and restore it on another device.',
                    'piRadar reminds you to back up if more than a month has passed.',
                ],
            },
        ],
        outro: 'Also: light, dark or system theme, in English or Spanish, and a layout that adapts to iPhone and iPad.',
        videos: [
            { id: 'gROeHvwQ0Js', type: 'short', title: 'piRadar short 1' },
            { id: 'KENa9gr38fs', type: 'short', title: 'piRadar short 2' },
            { id: 'qO7Mhn5W89w', type: 'video', title: 'piRadar video' },
        ],
    },
    {
        id: 'mifacweb',
        name: 'MifacWeb',
        tagline: 'Sales, inventory and point of sale',
        logo: '/images/mifacweb.svg',
        intro: 'MifacWeb is a sales and inventory system with a point of sale, built for small businesses that need to get up and running quickly. It runs in the browser, on one computer or across several stations, and keeps the owner informed by email about what happens in the shop.',
        sections: [
            {
                title: 'Sell and control stock',
                items: [
                    'Point of sale for fast checkout at the counter.',
                    'Sales and inventory in one place, so stock follows every sale.',
                    'Quick to set up and learn, made for small teams.',
                ],
            },
            {
                title: 'Email alerts for key events',
                items: [
                    'First sale of the day.',
                    'Closing of the day.',
                    'Movements in the cash register.',
                    'Login audit, and other events.',
                ],
            },
            {
                title: 'Install it your way',
                items: [
                    'Locally on a Windows or Linux computer.',
                    'Work directly on the server PC, or connect several stations over Wi-Fi.',
                    'Or deploy it to a Windows or Linux VPS.',
                ],
            },
            {
                title: 'Built with',
                items: [
                    '.NET 10',
                    'ASP.NET Core and Blazor',
                    'MudBlazor',
                    'EF Core with SQLite',
                ],
            },
        ],
        demo: {
            url: 'https://demo.mifac.tech/',
            user: 'publicdemo@belvicto.com',
            password: 'publicdemo2026',
        },
    },
];
