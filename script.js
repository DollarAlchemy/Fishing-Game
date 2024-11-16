// Initialize Game Variables
const lake = document.getElementById("lake");
const fishingLine = document.getElementById("fishing-line");
const castButton = document.getElementById("cast-button");
const caughtFishList = document.getElementById("caught-fish");

let isCasting = false; // Prevents multiple casts
let fishInLake = []; // Tracks fish in the lake
let isReeling = false; // Prevents reeling spam during minigame

// Fish Types and Rarity
const fishTypes = [
    { name: "Common Fish", rarity: "common", value: 10 },
    { name: "Rare Fish", rarity: "rare", value: 50 },
    { name: "Legendary Fish", rarity: "legendary", value: 200 }
];

// Cast Fishing Line
function castLine() {
    if (isCasting) return; // Prevent multiple casts
    isCasting = true;

    // Show and animate the fishing line dropping
    fishingLine.style.display = "block";
    fishingLine.style.height = "300px"; // Drop to a specific depth

    // After the line is in the water for 3 seconds, check for fish
    setTimeout(() => {
        if (checkForFish()) {
            startReelingMinigame(); // If a fish is present, start reeling minigame
        } else {
            retractLine(); // If no fish, retract line
        }
    }, 3000);
}

// Retract Fishing Line
function retractLine() {
    fishingLine.style.height = "0"; // Retract the line
    setTimeout(() => {
        fishingLine.style.display = "none"; // Hide the line after retracting
        isCasting = false; // Allow another cast
    }, 1000);
}

// Spawn Fish in the Lake
function spawnFish() {
    const fish = document.createElement("div");
    fish.classList.add("fish");

    // Assign a random fish type
    const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    fish.dataset.name = fishType.name;
    fish.dataset.rarity = fishType.rarity;
    fish.dataset.value = fishType.value;

    // Position the fish randomly in the lake
    fish.style.left = `${Math.random() * (lake.clientWidth - 50)}px`;
    fish.style.top = `${Math.random() * (lake.clientHeight - 50)}px`;

    // Add the fish to the lake
    lake.appendChild(fish);
    fishInLake.push(fish);

    // Make the fish swim randomly
    setInterval(() => {
        fish.style.left = `${Math.random() * (lake.clientWidth - 50)}px`;
        fish.style.top = `${Math.random() * (lake.clientHeight - 50)}px`;
    }, 2000); // Move every 2 seconds
}

// Check if a Fish is Present
function checkForFish() {
    let fishCaught = null;
    fishInLake.forEach((fish) => {
        const fishRect = fish.getBoundingClientRect();
        const lineRect = fishingLine.getBoundingClientRect();

        // Check if the fishing line intersects with a fish
        if (
            fishRect.left < lineRect.right &&
            fishRect.right > lineRect.left &&
            fishRect.top < lineRect.bottom &&
            fishRect.bottom > lineRect.top
        ) {
            fishCaught = fish;
        }
    });
    return fishCaught;
}

// Start Reeling Minigame
function startReelingMinigame() {
    isReeling = true; // Prevent other actions during reeling
    const reelingBar = document.createElement("div");
    reelingBar.id = "reeling-bar";

    const progressBar = document.createElement("div");
    progressBar.id = "progress-bar";
    progressBar.style.width = "0%";

    reelingBar.appendChild(progressBar);
    document.body.appendChild(reelingBar);

    let progress = 0;
    const reelingInterval = setInterval(() => {
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(reelingInterval);
            finishReeling();
        }
    }, 200); // Progress bar increases over time

    // Add keypress event for reeling
    const reel = (e) => {
        if (e.key === " ") { // Spacebar to reel
            progress += 10;
            progress = Math.min(progress, 100); // Cap progress at 100%
        }
    };
    document.addEventListener("keydown", reel);

    // Cleanup once reeling is finished
    function finishReeling() {
        document.removeEventListener("keydown", reel);
        reelingBar.remove();
        isReeling = false;
        retractLine(); // Retract the line after finishing
    }
}

// Catch Fish
function catchFish(fish) {
    const fishName = fish.dataset.name;
    const fishRarity = fish.dataset.rarity;
    const fishValue = parseInt(fish.dataset.value);

    // Add fish to the inventory
    const listItem = document.createElement("li");
    listItem.textContent = `${fishName} (${fishRarity}) - $${fishValue}`;
    caughtFishList.appendChild(listItem);

    // Remove fish from the lake
    fish.remove();
    fishInLake = fishInLake.filter((f) => f !== fish); // Update the fish array
}

// Initialize the Game
function startGame() {
    // Spawn initial fish in the lake
    for (let i = 0; i < 10; i++) {
        spawnFish();
    }
}

// Event Listener for Casting
castButton.addEventListener("click", castLine);

// Start the Game
startGame();
