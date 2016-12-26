var Product = require("../models/product");
var mongoose = require("mongoose");

mongoose.connect('localhost:27017/shopping');

// Create a bunch of new products and add data
var products = [
  new Product({
    imagePath: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Gothiccover.png/250px-Gothiccover.png",
    title: "Gothic Video Game",
    description: "Awesome Game!!!!",
    price: 12
  }),
  new Product({
    imagePath: "http://cdn2.list25.com/wp-content/uploads/2013/02/Slide11061.jpg",
    title: "Legend of Zelda: Ocarina of Time",
    description: "Considered one of the best games ever when it became a hit on Gameboy it was released by NES in 1998 and players were blown away by the graphics and gameplay of the game compared with the other Gameboy Zelda games. Originally designed for the Nintendo 64DD, it was released instead on a 256-megabit cartridge, the largest-capacity cartridge NES ever produced and also was the first with 3D graphics.",
    price: 15
  }),
  new Product({
    imagePath: "http://cdn4.list25.com/wp-content/uploads/2013/02/Slide2681.jpg",
    title: "Pokemon Red, Blue, and Green",
    description: "Over 20 million copies of these role-playing games were sold by Nintendo for Gameboy. Developed by Game Freak, the first installments were Red and Green, which were released in Japan in 1996. Blue was later released in the year as a special edition, with Pokemon Yellow subsequently released three years later. Pokemon Fire Red and Leaf Green were remade afterwards for the Game Boy Advance in 2004 where upwards of 10 million copies were sold.",
    price: 12
  }),
  new Product({
    imagePath: "http://cdn.list25.com/wp-content/uploads/2013/02/Slide3221.jpg",
    title: "Super Mario 64",
    description: "Published by Nintendo for its Nintendo 64 and released in June 23, 1996 Super Mario 64 sold over 11 million copies worldwide. The third-person, free roaming, 3D platform was the brainchild of Shigeru Miyamoto who had spent years trying to build a fully-3D platform for the SNES before he quit the idea altogether. However, when the company shifted to the development of N64, he played a big role in helping the company veer away from same thumb-destroying crosspads the company had been employing for over a decade.",
    price: 10
  }),
  new Product({
    imagePath: "http://cdn4.list25.com/wp-content/uploads/2013/02/Slide4211.jpg",
    title: "The Sims",
    description: "Often considered the most successful video game series of all time, The Sims has sold more than 150 million copies worldwide as of May 2011. A strategic life simulation video game, it is also hailed as the best-selling PC franchise in history. The sandbox game was developed by Maxis, and was later turned over to The Sims Studio published by Electronic Arts. The gameplay involves creating virtual characters called ‘Sims’ who are placed in homes where players can direct their moods and satisfy their desires.",
    price: 13
  }),
  new Product({
    imagePath: "http://cdn.list25.com/wp-content/uploads/2013/02/Slide5201.jpg",
    title: "Tetris",
    description: "Released in June 6, 1984, this tile-matching puzzle video game was created by Alexey Pajitnov, a young researcher at Moscow’s Academy of Science. The inspiration for this game came from a board game called Pentomino where 12 different shapes made out of five squares are twisted and turned until they all fit together in a box. Nowadays, an estimated billion people have played Tetris, the first entertainment software from the USSR that was exported to the US. This game is available on nearly all platforms helping it earn the topmost ranking on the  ‘100 Greatest Games of All Time’ list from the Electronic Gaming Monthly’s 100th issue.",
    price: 12
  }),
  new Product({
    imagePath: "http://cdn3.list25.com/wp-content/uploads/2013/02/Slide6191.jpg",
    title: "Nintendogs",
    description: "A real-time pet simulation video game developed for the Nintendo DS, Nintendogs has sold 23.64 million copies worldwide as of March 2011 since it was first released in Japan in 2005. The game uses the DS’s touchscreen and built-in microphone to pet a dog and to use various items. It also allows players to interact with others through the console’s wireless linkup. Nintendogs has received positive critical reception and has many awards including the 2006 Innovation Award from PC World.",
    price: 9
  }),
  new Product({
    imagePath: "http://cdn.list25.com/wp-content/uploads/2013/02/Slide7191.jpg",
    title: "Final Fantasy VII",
    description: "One of the best titles in the series, Final Fantasy VII became an immediate critical and commercial success when it was first released in 1997 for the Sony PlayStation. A version was also released in 1998 for Microsoft Windows PC and for the PlayStation Network in 2009. It sold 10 million copies by May 2010 and was highly popular as it was the first game in the series to be released using 3D computer graphics with fully-rendered characters on pre-rendered backgrounds. The first role-playing video game of the Final Fantasy series made available for European gamers, FFVII was lauded for its graphics, gameplay, music, and story, which led its publisher Square Enix to make a series of sequels and prequels using other platforms.",
    price: 15
  }),
  new Product({
    imagePath: "http://cdn.list25.com/wp-content/uploads/2013/02/Slide8191.jpg",
    title: "Grand Theft Auto: Vice City",
    description: "Considered to be the most visually stunning video game of the Grand Theft Auto Series, Vice City is the second 3D action-adventure video game that was developed by Rockstar North (DMA Design) in the UK in 2002. The same year, it became the best-selling video game of 2002 and the best-selling PlayStation 2 game of all time as well. After its debut for PlayStation 2, it was ported to Xbox and Microsoft Windows in 2003. It also became available on Steam in 2008 and the Mac App Store in 2011. For the game’s 10th anniversary celebration in December 2012, Rockstar released a new version of Vice City for iOS and other Android platforms.",
    price: 12
  }),
  new Product({
    imagePath: "http://cdn3.list25.com/wp-content/uploads/2013/02/Slide9191.jpg",
    title: "Half-Life 2",
    description: "Half-Life 2 is a first-person shooting game like its predecessor and was originally released on November 16, 2004. It took five years of development, as the game was leaked and distributed on the internet, to complete the game. It was praised, however, for its gameplay, soundtracks, animation, storyline, and graphics when it was finally made public. It was also awarded “Game of the Decade” at the 2012 Video Game Awards. As of February of 2012, it already sold over 12 million copies, making it one of the best-selling PC games of all time.",
    price: 14
  })
];

// Loop over the products array and save them into the database
var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

mongoose.disconnect();
