// Alggin Catalog Data - Real pricing from Calgary HVAC supplier
export interface CatalogItem {
  stockNumber: string;
  description: string;
  price: number;
  gauge?: string;
  size?: string;
  category: string;
  subcategory: string;
  unit?: string;
}

export const algginCatalog: CatalogItem[] = [
  // RESIDENTIAL PIPE - GALVANIZED
  { stockNumber: "PIPE036030", description: "3\" x 60\" Galvanized Pipe", price: 3.19, gauge: "30", size: "3\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE0460LG", description: "4\" x 60\" Light Gauge Galvanized Pipe", price: 1.73, gauge: "LG", size: "4\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE046030", description: "4\" x 60\" Galvanized Pipe", price: 2.58, gauge: "30", size: "4\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE046028", description: "4\" x 60\" Galvanized Pipe", price: 4.29, gauge: "28", size: "4\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE0560LG", description: "5\" x 60\" Light Gauge Galvanized Pipe", price: 1.98, gauge: "LG", size: "5\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE056030", description: "5\" x 60\" Galvanized Pipe", price: 3.14, gauge: "30", size: "5\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE056028", description: "5\" x 60\" Galvanized Pipe", price: 5.45, gauge: "28", size: "5\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE0660LG", description: "6\" x 60\" Light Gauge Galvanized Pipe", price: 2.40, gauge: "LG", size: "6\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE066030", description: "6\" x 60\" Galvanized Pipe", price: 3.52, gauge: "30", size: "6\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE066028", description: "6\" x 60\" Galvanized Pipe", price: 6.07, gauge: "28", size: "6\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE076030", description: "7\" x 60\" Galvanized Pipe", price: 4.28, gauge: "30", size: "7\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE076028", description: "7\" x 60\" Galvanized Pipe", price: 7.19, gauge: "28", size: "7\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE086030", description: "8\" x 60\" Galvanized Pipe", price: 4.78, gauge: "30", size: "8\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE086028", description: "8\" x 60\" Galvanized Pipe", price: 8.30, gauge: "28", size: "8\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE096030", description: "9\" x 60\" Galvanized Pipe", price: 8.22, gauge: "30", size: "9\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE106028", description: "10\" x 60\" Galvanized Pipe", price: 10.03, gauge: "28", size: "10\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },
  { stockNumber: "PIPE126028", description: "12\" x 60\" Galvanized Pipe", price: 11.96, gauge: "28", size: "12\"", category: "Pipe", subcategory: "Round Pipe", unit: "ft" },

  // COMMERCIAL PIPE - GALVANIZED
  { stockNumber: "PIPE044826", description: "4\" x 48\" Commercial Galvanized Pipe", price: 6.36, gauge: "26", size: "4\"", category: "Pipe", subcategory: "Commercial Pipe", unit: "ft" },
  { stockNumber: "PIPE054826", description: "5\" x 48\" Commercial Galvanized Pipe", price: 7.20, gauge: "26", size: "5\"", category: "Pipe", subcategory: "Commercial Pipe", unit: "ft" },
  { stockNumber: "PIPE064826", description: "6\" x 48\" Commercial Galvanized Pipe", price: 7.88, gauge: "26", size: "6\"", category: "Pipe", subcategory: "Commercial Pipe", unit: "ft" },
  { stockNumber: "PIPE074826", description: "7\" x 48\" Commercial Galvanized Pipe", price: 9.09, gauge: "26", size: "7\"", category: "Pipe", subcategory: "Commercial Pipe", unit: "ft" },
  { stockNumber: "PIPE084826", description: "8\" x 48\" Commercial Galvanized Pipe", price: 10.31, gauge: "26", size: "8\"", category: "Pipe", subcategory: "Commercial Pipe", unit: "ft" },
  { stockNumber: "PIPE094826", description: "9\" x 48\" Commercial Galvanized Pipe", price: 11.82, gauge: "26", size: "9\"", category: "Pipe", subcategory: "Commercial Pipe", unit: "ft" },
  { stockNumber: "PIPE104826", description: "10\" x 48\" Commercial Galvanized Pipe", price: 12.63, gauge: "26", size: "10\"", category: "Pipe", subcategory: "Commercial Pipe", unit: "ft" },
  { stockNumber: "PIPE124826", description: "12\" x 48\" Commercial Galvanized Pipe", price: 16.00, gauge: "26", size: "12\"", category: "Pipe", subcategory: "Commercial Pipe", unit: "ft" },
  { stockNumber: "PIPE144826", description: "14\" x 48\" Commercial Galvanized Pipe", price: 18.27, gauge: "26", size: "14\"", category: "Pipe", subcategory: "Commercial Pipe", unit: "ft" },

  // RECTANGULAR DUCT
  { stockNumber: "DUC0808530", description: "8 x 8 Rectangular Duct", price: 7.74, gauge: "30", size: "8x8", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC1008530", description: "10 x 8 Rectangular Duct", price: 8.64, gauge: "30", size: "10x8", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC1208530", description: "12 x 8 Rectangular Duct", price: 9.18, gauge: "30", size: "12x8", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC1408530", description: "14 x 8 Rectangular Duct", price: 10.32, gauge: "30", size: "14x8", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC1608528", description: "16 x 8 Rectangular Duct", price: 11.79, gauge: "28", size: "16x8", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC1808528", description: "18 x 8 Rectangular Duct", price: 13.20, gauge: "28", size: "18x8", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC2008528", description: "20 x 8 Rectangular Duct", price: 14.38, gauge: "28", size: "20x8", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC1010530", description: "10 x 10 Rectangular Duct", price: 10.14, gauge: "30", size: "10x10", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC1210530", description: "12 x 10 Rectangular Duct", price: 10.80, gauge: "30", size: "12x10", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC1410530", description: "14 x 10 Rectangular Duct", price: 11.46, gauge: "30", size: "14x10", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },
  { stockNumber: "DUC1610528", description: "16 x 10 Rectangular Duct", price: 13.62, gauge: "28", size: "16x10", category: "Duct", subcategory: "Rectangular Duct", unit: "ft" },

  // ELBOWS - ROUND
  { stockNumber: "ELB9004RES", description: "4\" 90° Residential Elbow", price: 3.13, gauge: "RES", size: "4\"", category: "Fittings", subcategory: "Elbows", unit: "each" },
  { stockNumber: "ELB900428X", description: "4\" 90° Commercial Elbow", price: 5.74, gauge: "28", size: "4\"", category: "Fittings", subcategory: "Elbows", unit: "each" },
  { stockNumber: "ELB9005RES", description: "5\" 90° Residential Elbow", price: 3.55, gauge: "RES", size: "5\"", category: "Fittings", subcategory: "Elbows", unit: "each" },
  { stockNumber: "ELB900528X", description: "5\" 90° Commercial Elbow", price: 6.37, gauge: "28", size: "5\"", category: "Fittings", subcategory: "Elbows", unit: "each" },
  { stockNumber: "ELB9006RES", description: "6\" 90° Residential Elbow", price: 4.50, gauge: "RES", size: "6\"", category: "Fittings", subcategory: "Elbows", unit: "each" },
  { stockNumber: "ELB900628X", description: "6\" 90° Commercial Elbow", price: 8.15, gauge: "28", size: "6\"", category: "Fittings", subcategory: "Elbows", unit: "each" },
  { stockNumber: "ELB9008RES", description: "8\" 90° Residential Elbow", price: 9.14, gauge: "RES", size: "8\"", category: "Fittings", subcategory: "Elbows", unit: "each" },
  { stockNumber: "ELB900828X", description: "8\" 90° Commercial Elbow", price: 15.15, gauge: "28", size: "8\"", category: "Fittings", subcategory: "Elbows", unit: "each" },

  // REDUCERS
  { stockNumber: "REDSTB0403", description: "4-3 Stubby Reducer", price: 16.80, gauge: "28", size: "4-3", category: "Fittings", subcategory: "Reducers", unit: "each" },
  { stockNumber: "REDSTB0504", description: "5-4 Stubby Reducer", price: 16.80, gauge: "26", size: "5-4", category: "Fittings", subcategory: "Reducers", unit: "each" },
  { stockNumber: "REDSTB0605", description: "6-5 Stubby Reducer", price: 19.44, gauge: "26", size: "6-5", category: "Fittings", subcategory: "Reducers", unit: "each" },
  { stockNumber: "REDSTB0806", description: "8-6 Stubby Reducer", price: 25.79, gauge: "26", size: "8-6", category: "Fittings", subcategory: "Reducers", unit: "each" },

  // TEES AND WYES
  { stockNumber: "T04040428X", description: "4x4x4 Tee", price: 19.76, gauge: "28", size: "4x4x4", category: "Fittings", subcategory: "Tees", unit: "each" },
  { stockNumber: "Y04040428X", description: "4x4x4 Wye", price: 22.08, gauge: "28", size: "4x4x4", category: "Fittings", subcategory: "Wyes", unit: "each" },
  { stockNumber: "T06060626X", description: "6x6x6 Tee", price: 29.42, gauge: "26", size: "6x6x6", category: "Fittings", subcategory: "Tees", unit: "each" },
  { stockNumber: "Y06060626X", description: "6x6x6 Wye", price: 29.24, gauge: "26", size: "6x6x6", category: "Fittings", subcategory: "Wyes", unit: "each" },
  { stockNumber: "T08080826X", description: "8x8x8 Tee", price: 41.63, gauge: "26", size: "8x8x8", category: "Fittings", subcategory: "Tees", unit: "each" },
  { stockNumber: "Y08080826X", description: "8x8x8 Wye", price: 47.69, gauge: "26", size: "8x8x8", category: "Fittings", subcategory: "Wyes", unit: "each" },

  // TAKE OFFS
  { stockNumber: "SIDETOFF04", description: "4\" Side Take Off", price: 6.28, gauge: "28", size: "4\"", category: "Fittings", subcategory: "Take Offs", unit: "each" },
  { stockNumber: "TOPTOFFX04", description: "4\" Top Take Off", price: 7.38, size: "4\"", category: "Fittings", subcategory: "Take Offs", unit: "each" },
  { stockNumber: "SIDETOFF06", description: "6\" Side Take Off", price: 8.89, size: "6\"", category: "Fittings", subcategory: "Take Offs", unit: "each" },
  { stockNumber: "TOPTOFFX06", description: "6\" Top Take Off", price: 8.58, size: "6\"", category: "Fittings", subcategory: "Take Offs", unit: "each" },
  { stockNumber: "SIDETOFF08", description: "8\" Side Take Off", price: 16.24, size: "8\"", category: "Fittings", subcategory: "Take Offs", unit: "each" },
  { stockNumber: "TOPTOFFX08", description: "8\" Top Take Off", price: 24.18, size: "8\"", category: "Fittings", subcategory: "Take Offs", unit: "each" },

  // BOOTS
  { stockNumber: "RAB04310XX", description: "4\" Right Angle Boot 3x10", price: 7.36, size: "4\"", category: "Fittings", subcategory: "Boots", unit: "each" },
  { stockNumber: "UB04310XXX", description: "4\" Universal Boot 3x10", price: 7.36, size: "4\"", category: "Fittings", subcategory: "Boots", unit: "each" },
  { stockNumber: "RAB06410XX", description: "6\" Right Angle Boot 4x10", price: 8.88, size: "6\"", category: "Fittings", subcategory: "Boots", unit: "each" },
  { stockNumber: "UB06410XXX", description: "6\" Universal Boot 4x10", price: 8.88, size: "6\"", category: "Fittings", subcategory: "Boots", unit: "each" },

  // CAPS AND PLUGS
  { stockNumber: "CAP04XXXXX", description: "4\" Spun Cap", price: 11.22, size: "4\"", category: "Fittings", subcategory: "Caps", unit: "each" },
  { stockNumber: "PLUG04XXXX", description: "4\" Plug", price: 6.10, size: "4\"", category: "Fittings", subcategory: "Plugs", unit: "each" },
  { stockNumber: "CAP06XXXXX", description: "6\" Spun Cap", price: 14.52, size: "6\"", category: "Fittings", subcategory: "Caps", unit: "each" },
  { stockNumber: "PLUG06XXXX", description: "6\" Plug", price: 8.22, size: "6\"", category: "Fittings", subcategory: "Plugs", unit: "each" },
  { stockNumber: "CAP08XXXXX", description: "8\" Spun Cap", price: 17.76, size: "8\"", category: "Fittings", subcategory: "Caps", unit: "each" },
  { stockNumber: "PLUG08XXXX", description: "8\" Plug", price: 10.15, size: "8\"", category: "Fittings", subcategory: "Plugs", unit: "each" },

  // DAMPERS
  { stockNumber: "DAMPRESX04", description: "4\" Residential Damper", price: 2.80, size: "4\"", category: "Controls", subcategory: "Dampers", unit: "each" },
  { stockNumber: "DAMPRESX05", description: "5\" Residential Damper", price: 3.04, size: "5\"", category: "Controls", subcategory: "Dampers", unit: "each" },
  { stockNumber: "DAMPRESX06", description: "6\" Residential Damper", price: 3.55, size: "6\"", category: "Controls", subcategory: "Dampers", unit: "each" },
  { stockNumber: "INLIDAMP04", description: "4\" Inline Damper", price: 20.55, size: "4\"", category: "Controls", subcategory: "Inline Dampers", unit: "each" },
  { stockNumber: "INLIDAMP06", description: "6\" Inline Damper", price: 27.41, size: "6\"", category: "Controls", subcategory: "Inline Dampers", unit: "each" },
  { stockNumber: "INLIDAMP08", description: "8\" Inline Damper", price: 34.25, size: "8\"", category: "Controls", subcategory: "Inline Dampers", unit: "each" },

  // PLENUMS
  { stockNumber: "PLEN162059", description: "16.5 x 20.25 - 59\" Plenum w/end cap", price: 155.82, size: "16.5x20.25x59", category: "Equipment", subcategory: "Plenums", unit: "each" },
  { stockNumber: "PLEN202059", description: "20 x 20.25 - 59\" Plenum w/end cap", price: 170.41, size: "20x20.25x59", category: "Equipment", subcategory: "Plenums", unit: "each" },
  { stockNumber: "PLEN162071", description: "16.5 x 20.25 - 71\" Plenum w/end cap", price: 140.00, size: "16.5x20.25x71", category: "Equipment", subcategory: "Plenums", unit: "each" },

  // HANGERS AND SUPPORTS
  { stockNumber: "HGRSTRLTGA", description: "1\" x 96\" Light Gauge Hanger Strap", price: 3.15, size: "1x96", category: "Hardware", subcategory: "Hangers", unit: "each" },
  { stockNumber: "HGRSTR1X96", description: "1\" x 96\" Commercial Hanger Strap", price: 7.48, gauge: "18", size: "1x96", category: "Hardware", subcategory: "Hangers", unit: "each" },
  { stockNumber: "PIPESUPP16", description: "16\" Pipe Support", price: 1.28, size: "16\"", category: "Hardware", subcategory: "Supports", unit: "each" },
  { stockNumber: "PIPESUPP21", description: "21\" Pipe Support", price: 2.02, size: "21\"", category: "Hardware", subcategory: "Supports", unit: "each" },
  { stockNumber: "PIPESUPP24", description: "24\" Pipe Support", price: 2.26, size: "24\"", category: "Hardware", subcategory: "Supports", unit: "each" },

  // CLEATS
  { stockNumber: "SCLEAT60LG", description: "60\" Slip Cleat Light Gauge", price: 5.32, size: "60\"", category: "Hardware", subcategory: "Cleats", unit: "each" },
  { stockNumber: "SCLEAT96LG", description: "96\" Slip Cleat Light Gauge", price: 9.27, size: "96\"", category: "Hardware", subcategory: "Cleats", unit: "each" },
  { stockNumber: "DCLEAT60LG", description: "60\" Drive Cleat Light Gauge", price: 3.24, size: "60\"", category: "Hardware", subcategory: "Cleats", unit: "each" },
  { stockNumber: "DCLEAT96LG", description: "96\" Drive Cleat Light Gauge", price: 5.97, size: "96\"", category: "Hardware", subcategory: "Cleats", unit: "each" },

  // WALL PENETRATIONS
  { stockNumber: "WALLCAP04WS", description: "4\" Wall Cap with Screen", price: 21.45, size: "4\"", category: "Penetrations", subcategory: "Wall Caps", unit: "each" },
  { stockNumber: "WALLCAP06WS", description: "6\" Wall Cap with Screen", price: 30.51, size: "6\"", category: "Penetrations", subcategory: "Wall Caps", unit: "each" },
  { stockNumber: "WALLCAP08WS", description: "8\" Wall Cap with Screen", price: 65.27, size: "8\"", category: "Penetrations", subcategory: "Wall Caps", unit: "each" },

  // ROOF PENETRATIONS
  { stockNumber: "APRJ06XXXX", description: "6\" All Pitch Roof Jack", price: 23.20, size: "6\"", category: "Penetrations", subcategory: "Roof Jacks", unit: "each" },
  { stockNumber: "APRJ08XXXX", description: "8\" Large All Pitch Roof Jack", price: 38.70, size: "8\"", category: "Penetrations", subcategory: "Roof Jacks", unit: "each" },
  { stockNumber: "RAINCAP04", description: "4\" Rain Cap", price: 22.80, size: "4\"", category: "Penetrations", subcategory: "Rain Caps", unit: "each" },
  { stockNumber: "RAINCAP06", description: "6\" Rain Cap", price: 31.92, size: "6\"", category: "Penetrations", subcategory: "Rain Caps", unit: "each" },
  { stockNumber: "RAINCAP08", description: "8\" Rain Cap", price: 43.98, size: "8\"", category: "Penetrations", subcategory: "Rain Caps", unit: "each" },

  // DRAIN PANS
  { stockNumber: "DRPAN24242", description: "24 x 24 x 2\" Deep Drain Pan", price: 78.83, size: "24x24x2", category: "Equipment", subcategory: "Drain Pans", unit: "each" },

  // FILTERS
  { stockNumber: "FILFR20166", description: "20 x 16 - 6.5\" Filter Frame", price: 53.15, size: "20x16x6.5", category: "Equipment", subcategory: "Filter Frames", unit: "each" },
  { stockNumber: "FILFR25166", description: "25 x 16 - 6.5\" Filter Frame", price: 55.72, size: "25x16x6.5", category: "Equipment", subcategory: "Filter Frames", unit: "each" },
  { stockNumber: "FILFR25206", description: "25 x 20 - 6.5\" Filter Frame", price: 61.56, size: "25x20x6.5", category: "Equipment", subcategory: "Filter Frames", unit: "each" },
];

export const categories = [
  "Pipe",
  "Duct", 
  "Fittings",
  "Controls",
  "Equipment",
  "Hardware",
  "Penetrations"
];

export const subcategories: { [key: string]: string[] } = {
  "Pipe": ["Round Pipe", "Commercial Pipe"],
  "Duct": ["Rectangular Duct"],
  "Fittings": ["Elbows", "Reducers", "Tees", "Wyes", "Take Offs", "Boots", "Caps", "Plugs"],
  "Controls": ["Dampers", "Inline Dampers"],
  "Equipment": ["Plenums", "Drain Pans", "Filter Frames"],
  "Hardware": ["Hangers", "Supports", "Cleats"],
  "Penetrations": ["Wall Caps", "Roof Jacks", "Rain Caps"]
};

export function searchCatalog(query: string): CatalogItem[] {
  const searchTerm = query.toLowerCase();
  return algginCatalog.filter(item => 
    item.description.toLowerCase().includes(searchTerm) ||
    item.stockNumber.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm) ||
    item.subcategory.toLowerCase().includes(searchTerm) ||
    (item.size && item.size.toLowerCase().includes(searchTerm))
  );
}

export function getCatalogByCategory(category: string): CatalogItem[] {
  return algginCatalog.filter(item => item.category === category);
}

export function getCatalogBySubcategory(subcategory: string): CatalogItem[] {
  return algginCatalog.filter(item => item.subcategory === subcategory);
}