// Add a new game by appending an object to this array.
// Games are deployed outside this app, as static folders under /games/<id>/ on the server,
// so `url` and `icon` point at the live site.

export const GAMES = [
    {
        id: 'wasp',
        name: 'Wasp',
        tagline: 'Arcade climber for phone and desktop',
        url: 'https://www.belvicto.com/games/wasp/',
        icon: 'https://www.belvicto.com/games/wasp/icon-192.png',
        storeUrl: 'https://apps.apple.com/us/app/wasp-escape-the-shower/id6836850966',
        // Not on Google Play yet: shows the early tester popup. Replace with `playUrl` once published.
        playTesterEmail: 'belvictodeveloper@gmail.com',
        intro: 'Help a small wasp climb 33 steps up a wet window pane. Raindrops slide down and bubbles drift across the glass: pick your lane, keep moving and do not get hit.',
        facts: [
            'Tap or click left, center or right to choose your lane.',
            '6 levels of drops and bubbles to dodge.',
            'Plays in the browser, nothing to install.',
        ],
    },
    {
        id: 'labyrinth',
        name: 'Labyrinth',
        tagline: '3D memory maze',
        url: 'https://www.belvicto.com/games/labyrinth/',
        icon: '/images/labyrinth.svg',
        comingSoon: true, // remove once the game is live at `url`
        intro: 'Take a quick look at the way out, then find it from memory. Labyrinth shows you the maze from above with the escape route marked, then drops you inside it in 3D. Walk the corridors and retrace the path: you get just enough time to leave, or you lose.',
        facts: [
            'Study the maze from above while the way out is shown.',
            'Then walk it in first-person 3D, with only your memory to guide you.',
            'Find the exit before the time runs out.',
        ],
    },
];
