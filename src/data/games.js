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
        intro: 'Help a small wasp climb 33 steps up a wet window pane. Raindrops slide down and bubbles drift across the glass: pick your lane, keep moving and do not get hit.',
        facts: [
            'Tap or click left, center or right to choose your lane.',
            '6 levels of drops and bubbles to dodge.',
            'Plays in the browser, nothing to install.',
        ],
    },
];
