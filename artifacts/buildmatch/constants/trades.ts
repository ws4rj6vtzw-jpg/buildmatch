export const TRADES = [
  "Carpentry",
  "Concreting",
  "Electrical",
  "Plumbing",
  "Bricklaying",
  "Tiling",
  "Plastering",
  "Painting",
  "Roofing",
  "Landscaping",
  "Demolition",
  "Steel Fixing",
  "Scaffolding",
  "Glazing",
  "Flooring",
  "Excavation",
  "HVAC",
  "Welding",
  "Rendering",
  "Waterproofing",
] as const;

export type Trade = (typeof TRADES)[number];

export const TICKETS = [
  "White Card",
  "Working at Heights",
  "Confined Space",
  "EWP License",
  "Forklift License",
  "First Aid",
  "Asbestos Awareness",
  "Traffic Control",
] as const;

export type Ticket = (typeof TICKETS)[number];
