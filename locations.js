// ===== MAP SETTINGS =====
// The image is 2560x2048 pixels at 1 pixel = 1 block. The top-left corner is X -1536, Z -512
// (taken from the screenshot filename and checked against a known spot). So 0,0 is NOT the centre.
// To recalibrate, change minX / minZ only:
//   minX = Minecraft X at the LEFT edge of the image
//   minZ = Minecraft Z at the TOP edge of the image
const MAP_CONFIG = {
  image: 'map.png',
  width: 2560,
  height: 2048,
  minX: -1536,
  minZ: -512,
  blocksPerPixel: 1
};

// ===== CATEGORIES =====
const CATEGORIES = {
  city:     { label: 'City / Nation', color: '#ff3b3b' },
  town:     { label: 'Town',          color: '#c0562f' },
  monument: { label: 'Monument',      color: '#2196f3' },
  building: { label: 'Building',      color: '#ffd700' },
  landmark: { label: 'Landmark',      color: '#4caf50' }
};

// ===== LOCATIONS =====
// Paste lines from the coordinate finder (alphas-secret-page.html) in here.
// Optional fields: owner, leader, description, image, discord, contact, y
const LOCATIONS = [
      { name: 'Axe Brotherhood', type: 'city', x: -598, z: 119, owner: 'CosMog', description: 'The Axe Brotherhood is a nation focused entirely on protecting each other and fight at all costs regardless of skill.', discord: 'https://discord.gg/BP8rep7zq' },
      { name: 'Bunny Homestead', type: 'city', x: -170, z: -127, owner: 'TheFlyingSpaghet', description: 'A peaceful place deisgned to protect you from mobs, threatening factions, free gear, animals, farming and overall a sunshine and rainbows to the event.', discord: 'https://discord.gg/gnWSTdBRn' },
      { name: 'Atheron', type: 'city', x: 380, z: 173, owner: 'Walrus', description: 'A nation designed to kill off the weak, work together, make history and fight until the last day. Requires no tax.', discord: 'https://discord.gg/GnBrhNATU' },  
      { name: 'The Core', type: 'city', x: -123, z: 199, owner: 'skywalkerbb8', description: 'A peaceful bunker inside a mountain to protect people when the server goes into chaos. The goal is to "Clip farm".', discord: 'https://discord.gg/GRb2DZAff' },
      { name: 'Volcano 1', type: 'landmark', x: -389, z: 247, owner: 'N/A', description: 'A volcano!' },
      { name: 'Volcano 2', type: 'landmark', x: -1, z: 707, owner: 'N/A', description: 'A volcano as wel!' },  
      { name: 'Pyramid', type: 'monument', x: -290, z: 397, owner: 'N/A', description: 'A GIANT PYRAMID!!!' },
        { name: 'Unknown Structure', type: 'monument', x: 121, z: 358, owner: 'N/A', description: 'Some random structure for now..' },
          { name: 'Another random structure', type: 'monument', x: -38, z: 319, owner: 'N/A', description: 'Another random monument for now...' },
  { name: 'Pyramid 3', type: 'monument', x: -469, z: 67, owner: 'N/A', description: 'Another random pyamid???' },
  { name: 'Pyramid 4', type: 'monument', x: -391, z: -10, owner: 'N/A', description: 'Another random pyamid???' },
  { name: 'Pyramid 5', type: 'monument', x: -402, z: 81, owner: 'N/A', description: 'Another random pyamid???' },
  { name: 'Pyramid Mesa???', type: 'monument', x: -101, z: 97, owner: 'N/A', description: 'Another random pyamid??? This time its a mesa pyramid!!!' },
];
