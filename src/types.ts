export interface FreshnessData {
  itemName: string;
  isFood: boolean;
  freshnessScore: number; // 0 to 100
  freshnessLabel: string; // e.g., "Sangat Segar", "Mulai Layu"
  confidence: number; // 0 to 100 (AI Confidence)
  visualIndicators: string[]; // e.g., "Kulit cerah", "Tidak ada bintik hitam"
  shelfLife: string; // e.g., "2-3 hari di suhu ruang"
  storageAdvice: string;
  nutritionHighlights: string;
  shortDescription: string;
  // New fields
  ripenessLevel: string; // e.g., "Belum Matang", "Matang Sempurna", "Terlalu Matang"
  cookingSuggestions: string[]; // List of ways to process it based on freshness
  recipeName: string; // Specific recipe name
  recipeInstructions: string; // Short instructions/ingredients
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  data: FreshnessData | null;
  error?: string;
  imagePreview?: string;
}
