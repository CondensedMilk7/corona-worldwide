// Bind this type of data to card from parent on [data]
export class StatCardData {
  constructor(
    public title: string,
    public stats: { name: string; value: number }[]
  ) {}
}

// Bind colors to card with [colors]
export class StatCardColors {
  constructor(
    public primary: string,
    public accent: string,
    public contrast?: string
  ) {}
}
