export type CupcakeData = {
  id: string;
  baseIndex: number;
  frostingIndex: number;
  toppingIndex: number;
  name: string;
  createdAt: number;
};

export function generateCupcakeId(): string {
  return `cupcake-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function encodeCupcakeData(data: CupcakeData): string {
  return btoa(JSON.stringify(data));
}

export function decodeCupcakeData(encoded: string): CupcakeData | null {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

