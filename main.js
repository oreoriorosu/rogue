const WIDTH = 32;
const HEIGHT = 32;
const MIN_SIZE = 3;
const MAX_SIZE = 6;
const MAX_ATTEMPTS = 100;
const WALL = '#';
const FLOOR = '-';
const AISLE = '.'


function createRoom(grid, rooms) {
    let newRoom = null;
    let safeToPlace = false;

    while (!safeToPlace) {
        let roomWidth = getRandomInt(MIN_SIZE, MAX_SIZE);
        let roomHeight = getRandomInt(MIN_SIZE, MAX_SIZE);
        let roomX = getRandomInt(1, WIDTH - roomWidth - 1);
        let roomY = getRandomInt(1, HEIGHT - roomHeight - 1);

        newRoom = {
            x: roomX,
            y: roomY,
            width: roomWidth,
            height: roomHeight
        };

        safeToPlace = isSafeToPlaceRoom(grid, newRoom);
    }

    fillRoomInGrid(grid, newRoom); if (rooms.length > 0) {
        // 接続可能な部屋の中からランダムに一つ選ぶ
        let connectTo = rooms[getRandomInt(0, rooms.length - 1)];
        connectRooms(grid, connectTo, newRoom);
    }
    rooms.push(newRoom);
}
// 部屋を安全に配置できるかどうかチェック（更新）
function isSafeToPlaceRoom(grid, room) {
    let padding = 2;  // 部屋と部屋の間の最小距離
    for (let y = room.y - padding; y < room.y + room.height + padding; y++) {
        for (let x = room.x - padding; x < room.x + room.width + padding; x++) {
            if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT || grid[y][x] === FLOOR || grid[y][x] === AISLE) {
                return false; // 他の部屋または通路と重なっている、またはグリッドの範囲外
            }
        }
    }
    return true;
}

// 部屋をグリッドに埋める
function fillRoomInGrid(grid, room) {
    for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) {
            grid[y][x] = FLOOR;
        }
    }
}

// 2つの部屋を通路で接続
function connectRooms(grid, room1, room2) {
    // 中点を計算
    let point1 = { x: Math.floor(room1.x + room1.width / 2), y: Math.floor(room1.y + room1.height / 2) };
    let point2 = { x: Math.floor(room2.x + room2.width / 2), y: Math.floor(room2.y + room2.height / 2) };

    // 垂直方向または水平方向に通路を生成
    let vertical = getRandomInt(0, 1);
    if (vertical === 1) {
        // 垂直、後に水平
        verticalCorridor(grid, point1.y, point2.y, point1.x);
        horizontalCorridor(grid, point1.x, point2.x, point2.y);
    } else {
        // 水平、後に垂直
        horizontalCorridor(grid, point1.x, point2.x, point1.y);
        verticalCorridor(grid, point1.y, point2.y, point2.x);
    }
}

// 垂直通路を作成
function verticalCorridor(grid, y1, y2, x) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        if (grid[y][x] !== FLOOR) {
            grid[y][x] = AISLE;
        }
    }
}

// 水平通路を作成（更新）
function horizontalCorridor(grid, x1, x2, y) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        if (grid[y][x] !== FLOOR) {
            grid[y][x] = AISLE;
        }
    }
}

// ダンジョンのグリッドを生成
function createDungeon() {
    let grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(WALL));
    // 部屋を生成
    let rooms = [];
    let roomCount = getRandomInt(5, 10); // 部屋の数

    for (let i = 0; i < roomCount; i++) {
        createRoom(grid, rooms);
    }

    // 入口と出口を設置
    placeEntranceAndExit(grid);

    return grid;
}

// 入口と出口を設置
function placeEntranceAndExit(grid) {
    let placed = false;
    while (!placed) {
        let x = getRandomInt(1, WIDTH - 2);
        let y = getRandomInt(1, HEIGHT - 2);

        if (grid[y][x] === FLOOR) {
            grid[y][x] = 'I';  // 入口
            placed = true;
        }
    }

    placed = false;
    while (!placed) {
        let x = getRandomInt(1, WIDTH - 2);
        let y = getRandomInt(1, HEIGHT - 2);

        if (grid[y][x] === FLOOR) {
            grid[y][x] = 'E';  // 出口
            placed = true;
        }
    }
}

// ランダムな整数を生成
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ダンジョンを表示
function printDungeon(grid) {
    grid.forEach(row => console.log(row.join('')));
}

let dungeon = createDungeon();
printDungeon(dungeon);
