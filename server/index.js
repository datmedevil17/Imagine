import pathfinding from "pathfinding";
import { Server } from "socket.io";
// import socketIO from "socket.io";
import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers";
import abi from "../client/src/abi/NFTGallery.json" with { type: "json" };
// const http = require("http");
import http from "http";

// const hostname = "127.0.0.1";
const port = 8080;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello, World!\n");
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found\n");
  }
});

server.listen(port, () => {
  console.log(`Server running at port = ${port}/`);
});

const io = new Server(server, {
  cors: {
    origin: ["https://meta-gallery-client.vercel.app/", "http://localhost:5173", "http://localhost:3000", "https://imagine-sandy.vercel.app", "https://imagine-dlv3.onrender.com"],
    methods: ["GET", "POST"]
  },
});

// const io = new Server({
// });

const privateKey =
  "440e0d85a55d3f9bb901900c62bc33f77570c32b640b3e881e3422c34a199ca7";
const alchemyProvider = new JsonRpcProvider(
  "https://rpc.basecamp.t.raas.gelato.cloud"
);
const contractAddress = "0x192690c260b80dCeFb40Ec847b45AfE13eA43Ff0";

// console.log(abi.abi)
const signer = new ethers.Wallet(privateKey, alchemyProvider);
const contract = new ethers.Contract(contractAddress, abi.abi, signer);
// Check if the contract instance is created successfully
if (contract) {
  console.log("Contract instance:", contract);
} else {
  console.error("Failed to create contract instance");
}
const fetchAllPosts = async () => {
  const posts = await contract.getAllPosts();
  posts.map(async (post, i) => {
    const imgResponse = await fetch(post[1]);
    const imgData = await imgResponse.json();
    const obj = {
      ...items.frame,
      gridPosition: [Number(post[8]), Number(post[9])],
      by: post[2],
      likes: Number(post[7]),
      rotation: Number(post[10]),
      link: imgData.img,
      title: imgData.title,
      price: imgData.price,
      auctionActive: post[5],
      sold: post[6],
      maxBidder: post[4],
      currentBid: Number(post[3]),
      id: Number(post[0]),
    };
    console.log(obj);
    map.items.push(obj);
  });
};
fetchAllPosts()

const characters = [];

const items = {
  chineseMonk: {
    name: "chineseMonk",
    size: [2, 2],
  },
  goldenRetriever: {
    name: "goldenRetriever",
    size: [2, 2],
  },
  chineseArtifact: {
    name: "chineseArtifact",
    size: [2, 2],
  },
  squareBlock1: {
    name: "squareBlock",
    size: [2, 2],
  },
  squareBlock2: {
    name: "squareBlock",
    size: [2, 2],
  },
  squareBlock3: {
    name: "squareBlock",
    size: [2, 2],
  },
  stanchion1: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion2: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion3: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion4: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion5: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion6: {
    name: "stanchion2",
    size: [5, 1],
  },
  stanchion7: {
    name: "stanchion2",
    size: [5, 1],
  },
  stanchion8: {
    name: "stanchion2",
    size: [5, 1],
  },
  stanchion9: {
    name: "stanchion2",
    size: [5, 1],
  },
  stanchion10: {
    name: "stanchion2",
    size: [5, 1],
  },
  stanchion11: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion12: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion13: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion14: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion15: {
    name: "stanchion1",
    size: [1, 5],
  },
  stanchion16: {
    name: "stanchion2",
    size: [5, 1],
  },
  stanchion17: {
    name: "stanchion2",
    size: [5, 1],
  },
  stanchion18: {
    name: "stanchion2",
    size: [5, 1],
  },
  stanchion19: {
    name: "stanchion2",
    size: [5, 1],
  },
  stanchion20: {
    name: "stanchion2",
    size: [5, 1],
  },
  portraitWall: {
    name: "portraitWall",
    size: [1, 12],
  },
  portraitWall2: {
    name: "portraitWall",
    size: [1, 12],
  },
  portraitWall3: {
    name: "portraitWall",
    size: [1, 12],
  },
  frame: {
    name: "frame",
    size: [1, 4],
  },
  washer: {
    name: "washer",
    size: [2, 2],
    drag: false,
  },
  toiletSquare: {
    name: "toiletSquare",
    size: [2, 2],
  },
  trashcan: {
    name: "trashcan",
    size: [1, 1],
  },
  bathroomCabinetDrawer: {
    name: "bathroomCabinetDrawer",
    size: [2, 2],
  },
  bathtub: {
    name: "bathtub",
    size: [4, 2],
  },
  bathroomMirror: {
    name: "bathroomMirror",
    size: [2, 1],
    wall: true,
  },
  bathroomCabinet: {
    name: "bathroomCabinet",
    size: [2, 1],
    wall: true,
  },
  bathroomSink: {
    name: "bathroomSink",
    size: [2, 2],
  },
  showerRound: {
    name: "showerRound",
    size: [2, 2],
  },
  tableCoffee: {
    name: "tableCoffee",
    size: [4, 2],
  },
  loungeSofaCorner: {
    name: "loungeSofaCorner",
    size: [5, 5],
  },
  bear: {
    name: "bear",
    size: [2, 1],
    wall: true,
  },
  loungeSofaOttoman: {
    name: "loungeSofaOttoman",
    size: [2, 2],
  },
  tableCoffeeGlassSquare: {
    name: "tableCoffeeGlassSquare",
    size: [2, 2],
  },
  loungeDesignSofaCorner: {
    name: "loungeDesignSofaCorner",
    size: [5, 5],
  },
  loungeDesignSofa: {
    name: "loungeDesignSofa",
    size: [5, 2],
  },
  loungeSofa: {
    name: "loungeSofa",
    size: [5, 2],
  },
  bookcaseOpenLow: {
    name: "bookcaseOpenLow",
    size: [2, 1],
  },
  kitchenBar: {
    name: "kitchenBar",
    size: [2, 1],
  },
  bookcaseClosedWide: {
    name: "bookcaseClosedWide",
    size: [3, 1],
  },
  bedSingle: {
    name: "bedSingle",
    size: [3, 5],
  },
  bench: {
    name: "bench",
    size: [2, 1],
  },
  bedDouble: {
    name: "bedDouble",
    size: [5, 5],
  },
  benchCushionLow: {
    name: "benchCushionLow",
    size: [2, 1],
  },
  loungeChair: {
    name: "loungeChair",
    size: [2, 2],
  },
  cabinetBedDrawer: {
    name: "cabinetBedDrawer",
    size: [1, 1],
  },
  cabinetBedDrawerTable: {
    name: "cabinetBedDrawerTable",
    size: [1, 1],
  },
  table: {
    name: "table",
    size: [4, 2],
  },
  tableCrossCloth: {
    name: "tableCrossCloth",
    size: [4, 2],
  },
  plant: {
    name: "plant",
    size: [1, 1],
  },
  plantSmall: {
    name: "plantSmall",
    size: [1, 1],
  },
  rugRounded: {
    name: "rugRounded",
    size: [6, 4],
    walkable: true,
  },
  rugRound: {
    name: "rugRound",
    size: [4, 4],
    walkable: true,
  },
  rugSquare: {
    name: "rugSquare",
    size: [4, 4],
    walkable: true,
  },
  rugRectangle: {
    name: "rugRectangle",
    size: [8, 4],
    walkable: true,
  },
  televisionVintage: {
    name: "televisionVintage",
    size: [4, 2],
  },
  televisionModern: {
    name: "televisionModern",
    size: [4, 2],
  },
  kitchenCabinetCornerRound: {
    name: "kitchenCabinetCornerRound",
    size: [2, 2],
  },
  kitchenCabinetCornerInner: {
    name: "kitchenCabinetCornerInner",
    size: [2, 2],
  },
  kitchenCabinet: {
    name: "kitchenCabinet",
    size: [2, 2],
  },
  kitchenBlender: {
    name: "kitchenBlender",
    size: [1, 1],
  },
  dryer: {
    name: "dryer",
    size: [2, 2],
  },
  chairCushion: {
    name: "chairCushion",
    size: [1, 1],
  },
  chair: {
    name: "chair",
    size: [1, 1],
  },
  deskComputer: {
    name: "deskComputer",
    size: [3, 2],
  },
  desk: {
    name: "desk",
    size: [3, 2],
  },
  chairModernCushion: {
    name: "chairModernCushion",
    size: [1, 1],
  },
  chairModernFrameCushion: {
    name: "chairModernFrameCushion",
    size: [1, 1],
  },
  kitchenMicrowave: {
    name: "kitchenMicrowave",
    size: [1, 1],
  },
  coatRackStanding: {
    name: "coatRackStanding",
    size: [1, 1],
  },
  kitchenSink: {
    name: "kitchenSink",
    size: [2, 2],
  },
  lampRoundFloor: {
    name: "lampRoundFloor",
    size: [1, 1],
  },
  lampRoundTable: {
    name: "lampRoundTable",
    size: [1, 1],
  },
  lampSquareFloor: {
    name: "lampSquareFloor",
    size: [1, 1],
  },
  lampSquareTable: {
    name: "lampSquareTable",
    size: [1, 1],
  },
  toaster: {
    name: "toaster",
    size: [1, 1],
  },
  kitchenStove: {
    name: "kitchenStove",
    size: [2, 2],
  },
  laptop: {
    name: "laptop",
    size: [1, 1],
  },
  radio: {
    name: "radio",
    size: [1, 1],
  },
  speaker: {
    name: "speaker",
    size: [1, 1],
  },
  speakerSmall: {
    name: "speakerSmall",
    size: [1, 1],
  },
  stoolBar: {
    name: "stoolBar",
    size: [1, 1],
  },
  stoolBarSquare: {
    name: "stoolBarSquare",
    size: [1, 1],
  },
};

const map = {
  size: [15, 15],
  gridDivision: 2,
  items: [
    {
      ...items.chineseMonk,
      gridPosition: [7, 5],
    },
    {
      ...items.goldenRetriever,
      gridPosition: [14, 22],
    },
    {
      ...items.chineseArtifact,
      gridPosition: [21, 5],
    },
    {
      ...items.squareBlock1,
      gridPosition: [21, 5],
    },
    {
      ...items.squareBlock2,
      gridPosition: [14, 22],
    },
    {
      ...items.squareBlock3,
      gridPosition: [7, 5],
    },
    {
      ...items.stanchion1,
      gridPosition: [1, 2],
    },
    {
      ...items.stanchion2,
      gridPosition: [1, 7],
    },
    {
      ...items.stanchion3,
      gridPosition: [1, 12],
    },
    {
      ...items.stanchion4,
      gridPosition: [1, 17],
    },
    {
      ...items.stanchion5,
      gridPosition: [1, 22],
    },
    {
      ...items.stanchion6,
      gridPosition: [3, 1],
    },
    {
      ...items.stanchion7,
      gridPosition: [8, 1],
    },
    {
      ...items.stanchion8,
      gridPosition: [13, 1],
    },
    {
      ...items.stanchion9,
      gridPosition: [18, 1],
    },
    {
      ...items.stanchion10,
      gridPosition: [23, 1],
    },
    {
      ...items.stanchion11,
      gridPosition: [27, 2],
    },
    {
      ...items.stanchion12,
      gridPosition: [27, 7],
    },
    {
      ...items.stanchion13,
      gridPosition: [27, 12],
    },
    {
      ...items.stanchion14,
      gridPosition: [27, 17],
    },
    {
      ...items.stanchion15,
      gridPosition: [27, 22],
    },
    {
      ...items.stanchion16,
      gridPosition: [3, 27],
    },
    {
      ...items.stanchion17,
      gridPosition: [8, 27],
    },
    {
      ...items.stanchion18,
      gridPosition: [13, 27],
    },
    {
      ...items.stanchion19,
      gridPosition: [18, 27],
    },
    {
      ...items.stanchion20,
      gridPosition: [23, 27],
    },
    {
      ...items.portraitWall,
      gridPosition: [8, 12],
    },
    {
      ...items.portraitWall2,
      gridPosition: [15, 4],
    },
    {
      ...items.portraitWall3,
      gridPosition: [22, 12],
    },
    // {
    //   ...items.showerRound,
    //   gridPosition: [0, 0],
    // },
    // {
    //   ...items.toiletSquare,
    //   gridPosition: [0, 3],
    //   rotation: 1,
    // },
    // {
    //   ...items.washer,
    //   gridPosition: [5, 0],
    // },
    // {
    //   ...items.bathroomSink,
    //   gridPosition: [7, 0],
    // },
    // {
    //   ...items.trashcan,
    //   gridPosition: [0, 5],
    //   rotation: 1,
    // },
    // {
    //   ...items.bathroomCabinetDrawer,
    //   gridPosition: [3, 0],
    // },
    // {
    //   ...items.bathtub,
    //   gridPosition: [4, 4],
    // },
    // {
    //   ...items.bathtub,
    //   gridPosition: [0, 8],
    //   rotation: 3,
    // },
    // {
    //   ...items.bathroomCabinet,
    //   gridPosition: [3, 0],
    // },
    // {
    //   ...items.bathroomMirror,
    //   gridPosition: [0, 8],
    //   rotation: 1,
    // },
    // {
    //   ...items.bathroomMirror,
    //   gridPosition: [, 10],
    //   rotation: 1,
    // },
    // {
    //   ...items.tableCoffee,
    //   gridPosition: [10, 8],
    // },
    // {
    //   ...items.rugRectangle,
    //   gridPosition: [8, 7],
    // },
    // {
    //   ...items.loungeSofaCorner,
    //   gridPosition: [6, 10],
    // },
    // {
    //   ...items.bear,
    //   gridPosition: [0, 3],
    //   rotation: 1,
    // },
    // {
    //   ...items.plant,
    //   gridPosition: [11, 13],
    // },
    // {
    //   ...items.cabinetBedDrawerTable,
    //   gridPosition: [13, 19],
    // },
    // {
    //   ...items.cabinetBedDrawer,
    //   gridPosition: [19, 19],
    // },
    // {
    //   ...items.bedDouble,
    //   gridPosition: [14, 15],
    // },
    // {
    //   ...items.bookcaseClosedWide,
    //   gridPosition: [12, 0],
    //   rotation: 2,
    // },
    // {
    //   ...items.speaker,
    //   gridPosition: [11, 0],
    // },
    // {
    //   ...items.speakerSmall,
    //   gridPosition: [15, 0],
    // },
    // {
    //   ...items.loungeChair,
    //   gridPosition: [10, 4],
    // },
    // {
    //   ...items.loungeSofaOttoman,
    //   gridPosition: [14, 4],
    // },
    // {
    //   ...items.loungeDesignSofa,
    //   gridPosition: [18, 0],
    //   rotation: 1,
    // },
    // {
    //   ...items.kitchenCabinetCornerRound,
    //   gridPosition: [2, 18],
    //   rotation: 2,
    // },
    // {
    //   ...items.kitchenCabinetCornerInner,
    //   gridPosition: [0, 18],
    //   rotation: 2,
    // },
    // {
    //   ...items.kitchenStove,
    //   gridPosition: [0, 16],
    //   rotation: 1,
    // },
    // {
    //   ...items.dryer,
    //   gridPosition: [0, 14],
    //   rotation: 1,
    // },
    // {
    //   ...items.lampRoundFloor,
    //   gridPosition: [0, 12],
    // },
  ],
};

const grid = new pathfinding.Grid(
  map.size[0] * map.gridDivision,
  map.size[1] * map.gridDivision
);

const finder = new pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true,
});

const findPath = (start, end) => {
  const gridClone = grid.clone();
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);
  return path;
};

const updateGrid = () => {
  // RESET
  for (let x = 0; x < map.size[0] * map.gridDivision; x++) {
    for (let y = 0; y < map.size[1] * map.gridDivision; y++) {
      grid.setWalkableAt(x, y, true);
    }
  }

  map.items.forEach((item) => {
    if (item.walkable || item.wall) {
      return;
    }
    const width =
      item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height =
      item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const gridX = item.gridPosition[0] + x;
        const gridY = item.gridPosition[1] + y;
        // Check bounds before setting walkable
        if (gridX >= 0 && gridX < map.size[0] * map.gridDivision && 
            gridY >= 0 && gridY < map.size[1] * map.gridDivision) {
          grid.setWalkableAt(gridX, gridY, false);
        }
      }
    }
  });
};

updateGrid();

const generateRandomPosition = () => {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);
    if (grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("user connected");
  fetchAllPosts();

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
    avatarUrl: "https://models.readyplayer.me/64f0265b1db75f90dcfd9e2c.glb",
    address: "",
  });

  socket.emit("hello", {
    map,
    characters,
    id: socket.id,
    items,
  });

  io.emit("characters", characters);

  socket.on("characterAvatarUpdate", (avatarUrl, address) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    if (address != null) {
      character.address = address;
    }
    if (avatarUrl != null) {
      character.avatarUrl =
        avatarUrl.split("?")[0] + "?" + new Date().getTime();
    }
    io.emit("characters", characters);
  });

  socket.on("move", (from, to) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    const path = findPath(from, to);
    if (!path) {
      return;
    }
    character.position = from;
    character.path = path;
    io.emit("playerMove", character);
  });

  socket.on("dance", () => {
    io.emit("playerDance", {
      id: socket.id,
    });
  });

  socket.on("itemsUpdate", (items) => {
    map.items = items;
    characters.forEach((character) => {
      character.path = [];
      character.position = generateRandomPosition();
    });
    updateGrid();
    io.emit("mapUpdate", {
      map,
      characters,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});
