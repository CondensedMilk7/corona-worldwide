// Bind this type of data to card from parent on [data]
export interface StatCard {
  title: string;
  stats: { name: string; value: number }[];
}

// Bind colors to card with [colors]
export interface StatCardColors {
  primary: string;
  accent: string;
}
