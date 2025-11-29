import { CupcakeData } from "./cupcakeUtils";

const BASES = [
  { id: "vanilla", label: "Vanilla Cake", className: "bg-[#ffe5b4] text-black", color: "#ffe5b4" },
  { id: "chocolate", label: "Chocolate Cake", className: "bg-[#c47a5a] text-white", color: "#c47a5a" },
  { id: "strawberry", label: "Strawberry Cake", className: "bg-[#ffc0d9] text-black", color: "#ffc0d9" },
  { id: "redvelvet", label: "Red Velvet", className: "bg-[#c41e3a] text-white", color: "#c41e3a" },
  { id: "lemon", label: "Lemon Cake", className: "bg-[#fffacd] text-black", color: "#fffacd" },
  { id: "carrot", label: "Carrot Cake", className: "bg-[#ffa500] text-black", color: "#ffa500" },
];

const FROSTINGS = [
  { id: "vanilla", label: "Vanilla Swirl", className: "bg-[#fff6cf]", color: "#fff6cf" },
  { id: "chocolate", label: "Chocolate Drip", className: "bg-[#8b4b2c]", color: "#8b4b2c" },
  { id: "strawberry", label: "Strawberry Cloud", className: "bg-[#ffb3c7]", color: "#ffb3c7" },
  { id: "mint", label: "Mint Dream", className: "bg-[#b7f4d6]", color: "#b7f4d6" },
  { id: "creamcheese", label: "Cream Cheese", className: "bg-[#fff8dc]", color: "#fff8dc" },
  { id: "caramel", label: "Caramel Drizzle", className: "bg-[#d2691e]", color: "#d2691e" },
  { id: "blueberry", label: "Blueberry Swirl", className: "bg-[#e6e6fa]", color: "#e6e6fa" },
];

const TOPPINGS = [
  { id: "sprinkles", label: "Rainbow Sprinkles", emojis: ["✨", "🍬", "✨"] },
  { id: "strawberry", label: "Fresh Strawberry", emojis: ["🍓"] },
  { id: "chocochip", label: "Choco Chips", emojis: ["🍫", "🍫"] },
  { id: "hearts", label: "Candy Hearts", emojis: ["💗", "💛", "💜"] },
  { id: "cherries", label: "Cherries", emojis: ["🍒", "🍒"] },
  { id: "nuts", label: "Nuts", emojis: ["🥜", "🥜"] },
  { id: "marshmallows", label: "Marshmallows", emojis: ["🍡", "🍡"] },
  { id: "stars", label: "Star Candies", emojis: ["⭐", "⭐", "⭐"] },
];

export async function generateCupcakeImage(cupcakeData: CupcakeData): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve("");
      return;
    }

    // Background
    const gradient = ctx.createRadialGradient(200, 100, 0, 200, 250, 300);
    gradient.addColorStop(0, "#ffeef7");
    gradient.addColorStop(0.4, "#ffe1c7");
    gradient.addColorStop(1, "#f5c3ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 500);

    // Title
    ctx.fillStyle = "#ff4f8b";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🧁", 200, 50);
    ctx.font = "bold 24px Arial";
    ctx.fillText(cupcakeData.name, 200, 90);

    const base = BASES[cupcakeData.baseIndex] || BASES[0];
    const frosting = FROSTINGS[cupcakeData.frostingIndex] || FROSTINGS[0];
    const topping = TOPPINGS[cupcakeData.toppingIndex] || TOPPINGS[0];

    const centerX = 200;
    const cupcakeY = 250;
    const cupcakeSize = 120;

    // Plate
    ctx.fillStyle = "#ddd8f2";
    ctx.beginPath();
    ctx.ellipse(centerX, cupcakeY + cupcakeSize / 2 + 20, cupcakeSize * 0.6, 8, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Base
    ctx.fillStyle = base.color;
    ctx.beginPath();
    ctx.roundRect(centerX - cupcakeSize / 2, cupcakeY + cupcakeSize / 2 - 30, cupcakeSize, 40, 10);
    ctx.fill();

    // Frosting
    ctx.fillStyle = frosting.color;
    ctx.beginPath();
    ctx.ellipse(centerX, cupcakeY + cupcakeSize / 2 - 30, cupcakeSize / 2, cupcakeSize / 3, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Toppings (simplified - just draw emojis as text)
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    topping.emojis.forEach((emoji, idx) => {
      ctx.fillText(emoji, centerX - 20 + idx * 20, cupcakeY + cupcakeSize / 2 - 40);
    });

    // Footer
    ctx.fillStyle = "#666";
    ctx.font = "14px Arial";
    ctx.fillText("Made with 💖 - Solene & Ellie's Cupcake Game", 200, 480);

    resolve(canvas.toDataURL("image/png"));
  });
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

