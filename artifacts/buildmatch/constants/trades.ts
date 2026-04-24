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
  "CSCS Card",
  "Working at Heights",
  "Confined Space",
  "IPAF Card",
  "FLT Licence",
  "First Aid",
  "Asbestos Awareness",
  "Streetworks Licence",
  "SMSTS",
  "SSSTS",
] as const;

export type Ticket = (typeof TICKETS)[number];
