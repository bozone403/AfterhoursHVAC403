import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FileCheck, DollarSign, Calculator, Download, Plus, Trash2, Search, Package, Clock } from "lucide-react";
import { ProAccessGuard } from "@/components/ProAccessGuard";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { apiFetch } from "@/lib/api";

interface QuoteItem {
  id: string;
  name: string;
  category: string;
  item: string;
  quantity: number;
  unitPrice: number;
  laborHours: number;
  total: number;
}

interface Quote {
  items: QuoteItem[];
  subtotal: number;
  labor: number;
  markup: number;
  tax: number;
  total: number;
}

// Category-specific multipliers based on supplier rates
const categoryMultipliers = {
  // Major Equipment - Standard contractor rates
  furnaces: 0.650, // Equipment
  airConditioners: 0.650, // Equipment
  heatPumps: 0.650, // Equipment
  rooftopUnits: 0.600, // Commercial Equipment
  makeUpAirUnits: 0.600, // Commercial Equipment
  bathFans: 0.550, // Small Equipment
  exhaustFans: 0.550, // Ventilation Equipment
  heatRecoveryVentilators: 0.600, // Equipment
  energyRecoveryVentilators: 0.600, // Equipment
  waterHeaters: 0.650, // Equipment
  boilers: 0.650, // Equipment
  
  // Ductwork and Components - Residential rates
  plenums: 0.625, // Residential
  filterFrames: 0.625, // Residential
  plenumTakeOffs: 0.625, // Residential
  ductwork: 0.625, // Residential
  endCaps: 0.625, // Residential
  ductReducers: 0.625, // Residential
  elbowsRectangular: 0.625, // Residential
  elbowsRound: 0.625, // Residential
  drainPans: 0.525, // Heating & Cooling - Residential
  freshAirIntakes: 0.618, // Venting
  combustionAirDiffusers: 0.618, // Venting
  dampers: 0.600, // Louvers & Dampers
  takeOffs: 0.625, // Residential
  tapInCollars: 0.625, // Residential
  boots: 0.625, // Residential
  ovalBoots: 0.625, // Residential
  pipe: 0.625, // Residential
  ovalPipe: 0.625, // Residential
  teesAndWyes: 0.625, // Residential
  reducersIncreasers: 0.625, // Residential
  capsAndPlugs: 0.625, // Residential
  joistLiners: 0.600, // Miscellaneous
  supports: 0.600, // Miscellaneous
  miscellaneous: 0.600, // Miscellaneous
};

// Complete Alggin pricing data from Calgary catalog - ALL components included
const algginPricing = {
  // HVAC Equipment - Major Units
  furnaces: {
    "Carrier 59SC5A080 80k BTU 95% AFUE": { price: 3299.00, laborHours: 8 },
    "Carrier 59SC5A100 100k BTU 95% AFUE": { price: 3599.00, laborHours: 8 },
    "Carrier 59SC5A120 120k BTU 95% AFUE": { price: 3899.00, laborHours: 8 },
    "Lennox EL296V 80k BTU 96% AFUE": { price: 3199.00, laborHours: 8 },
    "Lennox EL296V 100k BTU 96% AFUE": { price: 3499.00, laborHours: 8 },
    "York TM9V080 80k BTU 95% AFUE": { price: 2999.00, laborHours: 8 },
    "York TM9V100 100k BTU 95% AFUE": { price: 3299.00, laborHours: 8 },
    "Rheem R95T 80k BTU 95% AFUE": { price: 2899.00, laborHours: 8 },
    "Goodman GMVC96 80k BTU 96% AFUE": { price: 2499.00, laborHours: 8 },
    "Goodman GMVC96 100k BTU 96% AFUE": { price: 2799.00, laborHours: 8 }
  },
  airConditioners: {
    "Carrier 24ACC6 2 Ton R-410A": { price: 2199.00, laborHours: 6 },
    "Carrier 24ACC6 2.5 Ton R-410A": { price: 2399.00, laborHours: 6 },
    "Carrier 24ACC6 3 Ton R-410A": { price: 2599.00, laborHours: 6 },
    "Carrier 24ACC6 3.5 Ton R-410A": { price: 2799.00, laborHours: 6 },
    "Carrier 24ACC6 4 Ton R-410A": { price: 2999.00, laborHours: 6 },
    "Carrier 24ACC6 5 Ton R-410A": { price: 3299.00, laborHours: 6 },
    "Lennox XC16 2 Ton 16 SEER": { price: 2099.00, laborHours: 6 },
    "Lennox XC16 3 Ton 16 SEER": { price: 2499.00, laborHours: 6 },
    "York YXV 2 Ton 16 SEER": { price: 1999.00, laborHours: 6 },
    "York YXV 3 Ton 16 SEER": { price: 2299.00, laborHours: 6 },
    "Goodman GSX16 2 Ton": { price: 1699.00, laborHours: 6 },
    "Goodman GSX16 3 Ton": { price: 1899.00, laborHours: 6 }
  },
  heatPumps: {
    "Carrier 25HCE6 2 Ton Cold Climate": { price: 3299.00, laborHours: 8 },
    "Carrier 25HCE6 3 Ton Cold Climate": { price: 3699.00, laborHours: 8 },
    "Lennox XP16 2 Ton Heat Pump": { price: 3199.00, laborHours: 8 },
    "Lennox XP16 3 Ton Heat Pump": { price: 3599.00, laborHours: 8 },
    "York YZV 2 Ton Variable Speed": { price: 2999.00, laborHours: 8 },
    "York YZV 3 Ton Variable Speed": { price: 3399.00, laborHours: 8 }
  },
  // Commercial Rooftop Units
  rooftopUnits: {
    "Carrier 48TCED04 3 Ton RTU": { price: 8999.00, laborHours: 16 },
    "Carrier 48TCED06 5 Ton RTU": { price: 11999.00, laborHours: 20 },
    "Carrier 48TCED08 7.5 Ton RTU": { price: 14999.00, laborHours: 24 },
    "Carrier 48TCED10 10 Ton RTU": { price: 17999.00, laborHours: 28 },
    "Lennox LGH048 4 Ton Gas/Electric": { price: 9499.00, laborHours: 18 },
    "Lennox LGH060 5 Ton Gas/Electric": { price: 12499.00, laborHours: 22 },
    "Lennox LGH072 6 Ton Gas/Electric": { price: 14999.00, laborHours: 26 },
    "York YLAA 5 Ton Rooftop": { price: 10999.00, laborHours: 20 },
    "York YLAA 7.5 Ton Rooftop": { price: 13999.00, laborHours: 24 },
    "York YLAA 10 Ton Rooftop": { price: 16999.00, laborHours: 28 },
    "Trane YSC048 4 Ton Split System": { price: 9299.00, laborHours: 18 },
    "Trane YSC060 5 Ton Split System": { price: 12299.00, laborHours: 22 }
  },
  // Make-Up Air Units (MUA)
  makeUpAirUnits: {
    "Cambridge M30NG 30k BTU Gas MUA": { price: 4999.00, laborHours: 12 },
    "Cambridge M50NG 50k BTU Gas MUA": { price: 6999.00, laborHours: 16 },
    "Cambridge M75NG 75k BTU Gas MUA": { price: 8999.00, laborHours: 20 },
    "Cambridge M100NG 100k BTU Gas MUA": { price: 11999.00, laborHours: 24 },
    "Cambridge M150NG 150k BTU Gas MUA": { price: 16999.00, laborHours: 32 },
    "Reznor EGHB-3 30k BTU Gas MUA": { price: 4799.00, laborHours: 12 },
    "Reznor EGHB-5 50k BTU Gas MUA": { price: 6799.00, laborHours: 16 },
    "Reznor EGHB-10 100k BTU Gas MUA": { price: 11799.00, laborHours: 24 },
    "Modine MUA030 30k BTU Gas": { price: 4599.00, laborHours: 12 },
    "Modine MUA050 50k BTU Gas": { price: 6599.00, laborHours: 16 },
    "Modine MUA075 75k BTU Gas": { price: 8599.00, laborHours: 20 },
    "Unit Heater UH30 30k BTU Gas": { price: 899.00, laborHours: 4 },
    "Unit Heater UH50 50k BTU Gas": { price: 1199.00, laborHours: 4 },
    "Unit Heater UH75 75k BTU Gas": { price: 1499.00, laborHours: 4 }
  },
  // Bath Fans and Ventilation
  bathFans: {
    "Broan 688 50 CFM Bath Fan": { price: 29.99, laborHours: 1 },
    "Broan 688 80 CFM Bath Fan": { price: 34.99, laborHours: 1 },
    "Broan 688 110 CFM Bath Fan": { price: 39.99, laborHours: 1 },
    "Broan Sensonic 110 CFM with Bluetooth": { price: 199.99, laborHours: 1.5 },
    "Panasonic WhisperCeiling 80 CFM": { price: 89.99, laborHours: 1 },
    "Panasonic WhisperCeiling 110 CFM": { price: 99.99, laborHours: 1 },
    "Panasonic WhisperGreen 80 CFM LED": { price: 199.99, laborHours: 1.5 },
    "Panasonic WhisperGreen 110 CFM LED": { price: 229.99, laborHours: 1.5 },
    "Delta BreezRadiance 80 CFM Heater/Light": { price: 149.99, laborHours: 2 },
    "Delta BreezRadiance 110 CFM Heater/Light": { price: 169.99, laborHours: 2 },
    "NuTone 769RFT 110 CFM with Light": { price: 79.99, laborHours: 1 },
    "Air King BFQ90 90 CFM Energy Star": { price: 49.99, laborHours: 1 }
  },
  // Commercial Exhaust Fans
  exhaustFans: {
    "Fantech RVF4 4\" Inline Fan 75 CFM": { price: 89.99, laborHours: 1 },
    "Fantech RVF6 6\" Inline Fan 225 CFM": { price: 129.99, laborHours: 1.5 },
    "Fantech RVF8 8\" Inline Fan 493 CFM": { price: 199.99, laborHours: 2 },
    "Fantech RVF10 10\" Inline Fan 703 CFM": { price: 299.99, laborHours: 2.5 },
    "Broan 20GA Wall Fan 1200 CFM": { price: 399.99, laborHours: 3 },
    "Broan 20GA Wall Fan 1800 CFM": { price: 549.99, laborHours: 4 },
    "Continental CRF18 Roof Fan 1800 CFM": { price: 899.99, laborHours: 6 },
    "Continental CRF24 Roof Fan 2400 CFM": { price: 1199.99, laborHours: 8 },
    "Loren Cook Upblast 1500 CFM": { price: 1299.99, laborHours: 6 },
    "Loren Cook Upblast 3000 CFM": { price: 1899.99, laborHours: 10 }
  },
  // Heat Recovery Ventilators (HRV)
  heatRecoveryVentilators: {
    "Venmar AVS HRV EKO 1.5": { price: 899.99, laborHours: 8 },
    "Venmar AVS HRV EKO 2.0": { price: 1199.99, laborHours: 10 },
    "Lifebreath 155 ECM HRV": { price: 1099.99, laborHours: 8 },
    "Lifebreath 195 ECM HRV": { price: 1399.99, laborHours: 10 },
    "Broan AI Series HRV 70 CFM": { price: 799.99, laborHours: 6 },
    "Broan AI Series HRV 130 CFM": { price: 1099.99, laborHours: 8 },
    "Fantech SHR 1504 HRV": { price: 1299.99, laborHours: 10 },
    "Fantech SHR 2005 HRV": { price: 1599.99, laborHours: 12 }
  },
  // Energy Recovery Ventilators (ERV)
  energyRecoveryVentilators: {
    "Venmar AVS ERV Constructo 1.5": { price: 1199.99, laborHours: 8 },
    "Venmar AVS ERV Constructo 2.0": { price: 1499.99, laborHours: 10 },
    "Lifebreath 265 ERV": { price: 1399.99, laborHours: 8 },
    "Lifebreath 355 ERV": { price: 1699.99, laborHours: 10 },
    "Broan ERV180TE 180 CFM": { price: 1299.99, laborHours: 8 },
    "Fantech VER 1505 ERV": { price: 1499.99, laborHours: 10 }
  },
  // Water Heaters
  waterHeaters: {
    "Bradford White MI75T6FBN 75 Gal Gas": { price: 1299.00, laborHours: 4 },
    "Bradford White MI50T6FBN 50 Gal Gas": { price: 999.00, laborHours: 4 },
    "Bradford White MI40T6FBN 40 Gal Gas": { price: 899.00, laborHours: 4 },
    "Rheem G75-50N 75 Gal Gas": { price: 1199.00, laborHours: 4 },
    "Rheem G50-40N 50 Gal Gas": { price: 949.00, laborHours: 4 },
    "A.O. Smith GCV-75 75 Gal Gas": { price: 1149.00, laborHours: 4 },
    "A.O. Smith GCV-50 50 Gal Gas": { price: 899.00, laborHours: 4 },
    "Tankless Navien NPE-240A 199k BTU": { price: 1999.00, laborHours: 6 },
    "Tankless Navien NPE-210A 180k BTU": { price: 1799.00, laborHours: 6 },
    "Tankless Rinnai RU199 199k BTU": { price: 1899.00, laborHours: 6 }
  },
  // Boilers
  boilers: {
    "Crown Aruba 10 AWR 87k BTU": { price: 4999.00, laborHours: 12 },
    "Crown Aruba 12 AWR 105k BTU": { price: 5499.00, laborHours: 12 },
    "Crown Aruba 15 AWR 131k BTU": { price: 5999.00, laborHours: 12 },
    "Weil McLain CGa-4 131k BTU": { price: 5799.00, laborHours: 12 },
    "Weil McLain CGa-5 174k BTU": { price: 6299.00, laborHours: 14 },
    "Buderus GB142 80k BTU Condensing": { price: 6999.00, laborHours: 14 },
    "Buderus GB142 110k BTU Condensing": { price: 7499.00, laborHours: 14 },
    "Navien NCB-E 110k BTU Combi": { price: 3999.00, laborHours: 10 },
    "Navien NCB-E 150k BTU Combi": { price: 4499.00, laborHours: 10 }
  },
  plenums: {
    "Plenum 16.5x20.25x59\" with End Cap": { price: 155.82, laborHours: 2 },
    "Plenum 20x20.25x59\" with End Cap": { price: 170.41, laborHours: 2 },
    "Plenum 23.5x20.25x59\" with End Cap": { price: 183.93, laborHours: 2 },
    "Plenum 13.5x20.25x71\" with End Cap": { price: 142.00, laborHours: 2 },
    "Plenum 16.5x20.25x71\" with End Cap": { price: 140.00, laborHours: 2 },
    "Plenum 20x20.25x71\" with End Cap": { price: 144.00, laborHours: 2 },
    "Plenum Strip 23\" Wide x 96\" Long": { price: 64.43, laborHours: 0.3 },
    "Plenum Panel 24\" Wide x 35\" Long": { price: 25.67, laborHours: 0.2 }
  },
  filterFrames: {
    "Filter Frame 20x16x6.5\"": { price: 53.15, laborHours: 0.5 },
    "Filter Frame 25x16x6.5\"": { price: 55.72, laborHours: 0.5 },
    "Filter Frame 25x20x6.5\"": { price: 61.56, laborHours: 0.5 },
    "Filter Frame 25x16x3\"": { price: 37.57, laborHours: 0.5 },
    "Filter Frame 25x20x3\"": { price: 44.95, laborHours: 0.5 },
    "Filter Frame 25x16x1\"": { price: 21.95, laborHours: 0.5 }
  },
  plenumTakeOffs: {
    "Plenum Take Off 8x8 - 5\" Rise": { price: 31.95, laborHours: 0.5 },
    "Plenum Take Off 10x8 - 5\" Rise": { price: 32.68, laborHours: 0.5 },
    "Plenum Take Off 10x10 - 5\" Rise": { price: 33.85, laborHours: 0.5 },
    "Plenum Take Off 12x8 - 5\" Rise": { price: 32.89, laborHours: 0.5 },
    "Plenum Take Off 12x10 - 5\" Rise": { price: 36.07, laborHours: 0.5 },
    "Plenum Take Off 14x8 - 5\" Rise": { price: 33.75, laborHours: 0.5 },
    "Plenum Take Off 14x10 - 5\" Rise": { price: 37.64, laborHours: 0.5 },
    "Plenum Take Off 16x8 - 5\" Rise": { price: 35.20, laborHours: 0.5 },
    "Plenum Take Off 16x10 - 5\" Rise": { price: 38.95, laborHours: 0.5 },
    "Plenum Take Off 18x8 - 5\" Rise": { price: 37.61, laborHours: 0.5 },
    "Plenum Take Off 18x10 - 5\" Rise": { price: 40.46, laborHours: 0.5 },
    "Plenum Take Off 20x8 - 5\" Rise": { price: 38.74, laborHours: 0.5 },
    "Plenum Take Off 20x10 - 5\" Rise": { price: 42.36, laborHours: 0.5 }
  },
  ductwork: {
    "Duct 8x8x5' 30ga Button Lock": { price: 38.70, laborHours: 0.3 },
    "Duct 10x8x5' 30ga Button Lock": { price: 43.20, laborHours: 0.3 },
    "Duct 12x8x5' 30ga Button Lock": { price: 45.90, laborHours: 0.3 },
    "Duct 14x8x5' 30ga Button Lock": { price: 51.60, laborHours: 0.3 },
    "Duct 16x8x5' 28ga Button Lock": { price: 58.95, laborHours: 0.3 },
    "Duct 18x8x5' 28ga Button Lock": { price: 66.00, laborHours: 0.3 },
    "Duct 20x8x5' 28ga Button Lock": { price: 71.90, laborHours: 0.3 },
    "Duct 22x8x5' 28ga Button Lock": { price: 76.65, laborHours: 0.3 },
    "Duct 24x8x5' 28ga Button Lock": { price: 80.15, laborHours: 0.3 },
    "Duct 10x10x5' 30ga Button Lock": { price: 50.70, laborHours: 0.3 },
    "Duct 12x10x5' 30ga Button Lock": { price: 54.00, laborHours: 0.3 },
    "Duct 14x10x5' 30ga Button Lock": { price: 57.30, laborHours: 0.3 },
    "Duct 16x10x5' 28ga Button Lock": { price: 68.10, laborHours: 0.3 },
    "Duct 18x10x5' 28ga Button Lock": { price: 73.65, laborHours: 0.3 },
    "Duct 20x10x5' 28ga Button Lock": { price: 79.55, laborHours: 0.3 },
    "Duct 22x10x5' 28ga Button Lock": { price: 82.90, laborHours: 0.3 },
    "Duct 24x10x5' 28ga Button Lock": { price: 88.20, laborHours: 0.3 },
    "Duct 25x9.5x4' 26ga Button Lock": { price: 83.48, laborHours: 0.3 },
    "Duct 3.125x10x5' 30ga Button Lock": { price: 35.00, laborHours: 0.3 },
    "Duct 3.125x10x8' 30ga Button Lock": { price: 36.50, laborHours: 0.3 },
    "Duct 3.125x10x9' 30ga Button Lock": { price: 36.75, laborHours: 0.3 }
  },
  endCaps: {
    "End Cap 8x8": { price: 5.24, laborHours: 0.1 },
    "End Cap 10x8": { price: 5.42, laborHours: 0.1 },
    "End Cap 10x10": { price: 6.88, laborHours: 0.1 },
    "End Cap 12x8": { price: 5.70, laborHours: 0.1 },
    "End Cap 12x10": { price: 7.27, laborHours: 0.1 },
    "End Cap 14x8": { price: 6.45, laborHours: 0.1 },
    "End Cap 14x10": { price: 8.01, laborHours: 0.1 },
    "End Cap 16x8": { price: 7.03, laborHours: 0.1 },
    "End Cap 16x10": { price: 9.12, laborHours: 0.1 },
    "End Cap 18x8": { price: 8.09, laborHours: 0.1 },
    "End Cap 18x10": { price: 10.41, laborHours: 0.1 },
    "End Cap 20x8": { price: 8.63, laborHours: 0.1 },
    "End Cap 20x10": { price: 11.14, laborHours: 0.1 },
    "End Cap 22x8": { price: 9.58, laborHours: 0.1 },
    "End Cap 22x10": { price: 12.36, laborHours: 0.1 },
    "End Cap 24x8": { price: 10.45, laborHours: 0.1 },
    "End Cap 24x10": { price: 13.14, laborHours: 0.1 },
    "End Cap 3x10": { price: 3.30, laborHours: 0.1 },
    "End Cap 25x9.5": { price: 13.73, laborHours: 0.1 }
  },
  ductReducers: {
    "Duct Reducer 10x8 to 8x8": { price: 24.23, laborHours: 0.3 },
    "Duct Reducer 12x8 to 8x8": { price: 24.29, laborHours: 0.3 },
    "Duct Reducer 12x8 to 10x8": { price: 24.01, laborHours: 0.3 },
    "Duct Reducer 14x8 to 10x8": { price: 26.00, laborHours: 0.3 },
    "Duct Reducer 14x8 to 12x8": { price: 25.88, laborHours: 0.3 },
    "Duct Reducer 16x8 to 10x8": { price: 27.94, laborHours: 0.3 },
    "Duct Reducer 16x8 to 12x8": { price: 27.05, laborHours: 0.3 },
    "Duct Reducer 16x8 to 14x8": { price: 27.43, laborHours: 0.3 },
    "Duct Reducer 18x8 to 12x8": { price: 30.66, laborHours: 0.3 },
    "Duct Reducer 18x8 to 14x8": { price: 31.29, laborHours: 0.3 },
    "Duct Reducer 18x8 to 16x8": { price: 30.64, laborHours: 0.3 },
    "Reducing Panel for 8\" Duct": { price: 17.83, laborHours: 0.2 },
    "Reducing Panel for 10\" Duct": { price: 18.67, laborHours: 0.2 }
  },
  elbowsRectangular: {
    "90° Long Way Elbow 8x8": { price: 30.35, laborHours: 0.2 },
    "90° Long Way Elbow 10x8": { price: 36.59, laborHours: 0.2 },
    "45° Long Way Elbow 10x8": { price: 25.81, laborHours: 0.2 },
    "90° Long Way Elbow 12x8": { price: 40.44, laborHours: 0.2 },
    "45° Long Way Elbow 12x8": { price: 29.84, laborHours: 0.2 },
    "90° Long Way Elbow 14x8": { price: 49.31, laborHours: 0.2 },
    "45° Long Way Elbow 14x8": { price: 37.94, laborHours: 0.2 },
    "90° Long Way Elbow 16x8": { price: 54.64, laborHours: 0.2 },
    "45° Long Way Elbow 16x8": { price: 37.70, laborHours: 0.2 },
    "90° Long Way Elbow 18x8": { price: 67.13, laborHours: 0.2 },
    "45° Long Way Elbow 18x8": { price: 42.38, laborHours: 0.2 },
    "90° Long Way Elbow 10x10": { price: 40.75, laborHours: 0.2 },
    "90° Long Way Elbow 12x10": { price: 43.06, laborHours: 0.2 },
    "90° Long Way Elbow 14x10": { price: 52.34, laborHours: 0.2 },
    "90° Long Way Elbow 16x10": { price: 59.58, laborHours: 0.2 },
    "90° Short Way Elbow 3.25x10": { price: 19.10, laborHours: 0.2 },
    "90° Short Way Elbow 10x8": { price: 34.86, laborHours: 0.2 },
    "45° Short Way Elbow 10x8": { price: 23.97, laborHours: 0.2 },
    "90° Short Way Elbow 12x8": { price: 38.34, laborHours: 0.2 },
    "45° Short Way Elbow 12x8": { price: 24.49, laborHours: 0.2 },
    "90° Short Way Elbow 14x8": { price: 40.21, laborHours: 0.2 },
    "45° Short Way Elbow 14x8": { price: 26.77, laborHours: 0.2 },
    "90° Short Way Elbow 16x8": { price: 51.22, laborHours: 0.2 },
    "45° Short Way Elbow 16x8": { price: 36.33, laborHours: 0.2 }
  },
  elbowsRound: {
    "Round 90° Elbow 3\" 28ga": { price: 8.93, laborHours: 0.2 },
    "Round 90° Elbow 4\" Residential": { price: 3.13, laborHours: 0.2 },
    "Round 90° Elbow 4\" 28ga": { price: 5.74, laborHours: 0.2 },
    "Round 90° Elbow 5\" Residential": { price: 3.55, laborHours: 0.2 },
    "Round 90° Elbow 5\" 28ga": { price: 6.37, laborHours: 0.2 },
    "Round 90° Elbow 6\" Residential": { price: 4.50, laborHours: 0.2 },
    "Round 90° Elbow 6\" 28ga": { price: 8.15, laborHours: 0.2 },
    "Round 90° Elbow 7\" Residential": { price: 8.81, laborHours: 0.2 },
    "Round 90° Elbow 7\" 28ga": { price: 11.85, laborHours: 0.2 },
    "Round 90° Elbow 8\" Residential": { price: 9.14, laborHours: 0.2 },
    "Round 90° Elbow 8\" 28ga": { price: 15.15, laborHours: 0.2 },
    "Round 90° Elbow 9\" Residential": { price: 14.66, laborHours: 0.2 },
    "Round 90° Elbow 10\" 28ga": { price: 19.94, laborHours: 0.2 },
    "Round 90° Elbow 4\" Commercial 26ga": { price: 8.46, laborHours: 0.2 },
    "Round 90° Elbow 5\" Commercial 26ga": { price: 9.18, laborHours: 0.2 },
    "Round 90° Elbow 6\" Commercial 26ga": { price: 10.03, laborHours: 0.2 },
    "Round 90° Elbow 6\" Commercial 24ga": { price: 21.23, laborHours: 0.2 },
    "Round 90° Elbow 7\" Commercial 26ga": { price: 14.08, laborHours: 0.2 },
    "Round 90° Elbow 8\" Commercial 26ga": { price: 14.29, laborHours: 0.2 },
    "Round 90° Elbow 8\" Commercial 24ga": { price: 26.65, laborHours: 0.2 },
    "Round 90° Elbow 9\" Commercial 26ga": { price: 22.49, laborHours: 0.2 },
    "Round 90° Elbow 10\" Commercial 26ga": { price: 17.79, laborHours: 0.2 },
    "Round 90° Elbow 10\" Commercial 24ga": { price: 31.94, laborHours: 0.2 },
    "Round 90° Elbow 12\" Commercial 26ga": { price: 24.79, laborHours: 0.2 },
    "Round 90° Elbow 12\" Commercial 24ga": { price: 39.94, laborHours: 0.2 },
    "Round 90° Elbow 14\" Commercial 26ga": { price: 37.97, laborHours: 0.2 },
    "Round 90° Elbow 16\" Commercial 24ga": { price: 62.84, laborHours: 0.2 },
    "Round 90° Elbow 18\" Commercial 24ga": { price: 102.18, laborHours: 0.2 },
    "Round 90° Elbow 20\" Commercial 22ga": { price: 132.90, laborHours: 0.2 }
  },
  drainPans: {
    "Drain Pan 24x24x2\" with Drain": { price: 78.83, laborHours: 1 }
  },
  freshAirIntakes: {
    "Fresh Air Intake Hood 4\"": { price: 22.44, laborHours: 0.5 },
    "Fresh Air Intake Hood 5\"": { price: 23.22, laborHours: 0.5 },
    "Fresh Air Intake Hood 6\"": { price: 28.62, laborHours: 0.5 },
    "Fresh Air Intake Hood 7\"": { price: 35.70, laborHours: 0.5 },
    "Fresh Air Intake Hood 8\"": { price: 46.80, laborHours: 0.5 },
    "Fresh Air Intake Hood 10\"": { price: 77.28, laborHours: 0.5 },
    "Fresh Air Intake Hood 12\"": { price: 114.60, laborHours: 0.5 }
  },
  combustionAirDiffusers: {
    "Combustion Air Diffuser 4\"": { price: 43.08, laborHours: 0.5 },
    "Combustion Air Diffuser 5\"": { price: 46.26, laborHours: 0.5 },
    "Combustion Air Diffuser 6\"": { price: 51.03, laborHours: 0.5 },
    "Combustion Air Diffuser 7\"": { price: 66.96, laborHours: 0.5 },
    "Combustion Air Diffuser 8\"": { price: 76.53, laborHours: 0.5 },
    "Combustion Air Diffuser 10\"": { price: 100.09, laborHours: 0.5 },
    "Combustion Air Diffuser 12\"": { price: 175.05, laborHours: 0.5 }
  },
  dampers: {
    "Galvanized Damper 4\"": { price: 2.80, laborHours: 0.2 },
    "Galvanized Damper 5\"": { price: 3.04, laborHours: 0.2 },
    "Galvanized Damper 6\"": { price: 3.55, laborHours: 0.2 },
    "Inline Damper 4\"": { price: 20.55, laborHours: 0.3 },
    "Inline Damper 5\"": { price: 24.66, laborHours: 0.3 },
    "Inline Damper 6\"": { price: 27.41, laborHours: 0.3 },
    "Inline Damper 8\"": { price: 34.25, laborHours: 0.3 }
  },
  takeOffs: {
    "Side Take Off 4\"": { price: 6.28, laborHours: 0.2 },
    "Top Take Off 4\"": { price: 7.38, laborHours: 0.2 },
    "Side Take Off 5\"": { price: 6.61, laborHours: 0.2 },
    "Top Take Off 5\"": { price: 7.38, laborHours: 0.2 },
    "Side Take Off 6\"": { price: 8.89, laborHours: 0.2 },
    "Top Take Off 6\"": { price: 8.58, laborHours: 0.2 },
    "Side Take Off 7\"": { price: 11.94, laborHours: 0.2 },
    "Top Take Off 7\"": { price: 16.86, laborHours: 0.2 },
    "Side Take Off 8\"": { price: 16.24, laborHours: 0.2 },
    "Top Take Off 8\"": { price: 24.18, laborHours: 0.2 },
    "Side Take Off 9\"": { price: 22.36, laborHours: 0.2 },
    "Top Take Off 9\"": { price: 29.28, laborHours: 0.2 },
    "Universal Take Off 4\"": { price: 5.22, laborHours: 0.2 },
    "Universal Take Off 5\"": { price: 5.37, laborHours: 0.2 },
    "Universal Take Off 6\"": { price: 6.12, laborHours: 0.2 },
    "Saddle Take Off 4\"": { price: 4.75, laborHours: 0.2 },
    "Saddle Take Off 5\"": { price: 5.04, laborHours: 0.2 },
    "Saddle Take Off 6\"": { price: 7.05, laborHours: 0.2 }
  },
  tapInCollars: {
    "Tap-In Collar Round 4\" 28ga": { price: 5.65, laborHours: 0.1 },
    "Tap-In Collar Round 5\" 28ga": { price: 5.87, laborHours: 0.1 },
    "Tap-In Collar Round 6\" 28ga": { price: 6.10, laborHours: 0.1 },
    "Tap-In Collar Round 7\" 28ga": { price: 6.30, laborHours: 0.1 },
    "Tap-In Collar Round 8\" 28ga": { price: 9.06, laborHours: 0.1 },
    "Tap-In Collar Round 10\" 26ga": { price: 10.62, laborHours: 0.1 },
    "Tap-In Collar Round 12\" 26ga": { price: 11.82, laborHours: 0.1 },
    "Tap-In Collar Duct 24x10x10": { price: 43.28, laborHours: 0.2 },
    "Tap-In Collar Duct 25x9x10": { price: 42.83, laborHours: 0.2 }
  },
  boots: {
    "Right Angle Boot 4\" 3x10": { price: 7.36, laborHours: 0.3 },
    "Universal Boot 4\" 3x10": { price: 7.36, laborHours: 0.3 },
    "End Boot 4\" 3x10": { price: 7.36, laborHours: 0.3 },
    "Right Angle Boot 4\" 4x10": { price: 8.28, laborHours: 0.3 },
    "Universal Boot 4\" 4x10": { price: 8.28, laborHours: 0.3 },
    "End Boot 4\" 4x10": { price: 8.28, laborHours: 0.3 },
    "Right Angle Boot 5\" 2.25x12": { price: 16.22, laborHours: 0.3 },
    "Universal Boot 5\" 2.25x12": { price: 16.22, laborHours: 0.3 },
    "End Boot 5\" 2.25x12": { price: 16.22, laborHours: 0.3 },
    "Right Angle Boot 5\" 3x10": { price: 7.04, laborHours: 0.3 },
    "Universal Boot 5\" 3x10": { price: 7.04, laborHours: 0.3 },
    "End Boot 5\" 3x10": { price: 7.04, laborHours: 0.3 },
    "Right Angle Boot 6\" 3x10": { price: 8.13, laborHours: 0.3 },
    "Universal Boot 6\" 3x10": { price: 8.13, laborHours: 0.3 },
    "End Boot 6\" 3x10": { price: 8.13, laborHours: 0.3 },
    "Right Angle Boot 6\" 4x10": { price: 8.88, laborHours: 0.3 },
    "Universal Boot 6\" 4x10": { price: 8.88, laborHours: 0.3 },
    "End Boot 6\" 4x10": { price: 8.88, laborHours: 0.3 },
    "Right Angle Boot 6\" 4x12": { price: 18.91, laborHours: 0.3 },
    "Universal Boot 6\" 4x12": { price: 18.91, laborHours: 0.3 },
    "End Boot 6\" 4x12": { price: 18.91, laborHours: 0.3 },
    "Universal Boot 7\" 3x10": { price: 41.06, laborHours: 0.3 },
    "Right Angle Boot 7\" 4x10": { price: 43.47, laborHours: 0.3 },
    "Universal Boot 7\" 4x10": { price: 43.47, laborHours: 0.3 },
    "End Boot 7\" 4x10": { price: 43.47, laborHours: 0.3 },
    "Universal Boot 7\" 4x12": { price: 44.02, laborHours: 0.3 },
    "Universal Boot 8\" 3x10": { price: 54.86, laborHours: 0.3 },
    "Right Angle Boot 8\" 4x10": { price: 54.86, laborHours: 0.3 },
    "Universal Boot 8\" 4x10": { price: 54.86, laborHours: 0.3 },
    "Right Angle Boot 8\" 4x12": { price: 54.86, laborHours: 0.3 },
    "Universal Boot 8\" 4x12": { price: 54.86, laborHours: 0.3 },
    "End Boot 8\" 4x12": { price: 54.86, laborHours: 0.3 },
    "Right Angle Boot 8\" 4x14": { price: 54.86, laborHours: 0.3 },
    "Universal Boot 8\" 4x14": { price: 54.86, laborHours: 0.3 },
    "Basement Boot 5\" 3x10": { price: 14.89, laborHours: 0.3 },
    "Range Hood Transition 5\" 3.25x10": { price: 8.70, laborHours: 0.3 },
    "Range Hood Transition 6\" 3.25x10": { price: 8.88, laborHours: 0.3 }
  },
  ovalBoots: {
    "Oval Right Angle Boot 5\" 3x6": { price: 10.64, laborHours: 0.3 },
    "Oval Universal Boot 5\" 3x6": { price: 10.85, laborHours: 0.3 },
    "Oval End Boot 5\" 3x6": { price: 10.82, laborHours: 0.3 },
    "Oval Right Angle Boot 5\" 3x8": { price: 11.02, laborHours: 0.3 },
    "Oval Universal Boot 5\" 3x8": { price: 10.82, laborHours: 0.3 },
    "Oval End Boot 5\" 3x8": { price: 10.82, laborHours: 0.3 },
    "Oval Right Angle Boot 6\" 3x8": { price: 11.35, laborHours: 0.3 },
    "Oval Universal Boot 6\" 3x8": { price: 12.11, laborHours: 0.3 },
    "Oval End Boot 6\" 3x8": { price: 12.11, laborHours: 0.3 }
  },
  pipe: {
    "Galvanized Pipe 3\" x60\" 30ga": { price: 3.19, laborHours: 0.05 },
    "Galvanized Pipe 4\" x60\" Light": { price: 1.73, laborHours: 0.05 },
    "Galvanized Pipe 4\" x60\" 30ga": { price: 2.58, laborHours: 0.05 },
    "Galvanized Pipe 4\" x60\" 28ga": { price: 4.29, laborHours: 0.05 },
    "Galvanized Pipe 5\" x60\" Light": { price: 1.98, laborHours: 0.05 },
    "Galvanized Pipe 5\" x60\" 30ga": { price: 3.14, laborHours: 0.05 },
    "Galvanized Pipe 5\" x60\" 28ga": { price: 5.45, laborHours: 0.05 },
    "Galvanized Pipe 6\" x60\" Light": { price: 2.40, laborHours: 0.05 },
    "Galvanized Pipe 6\" x60\" 30ga": { price: 3.52, laborHours: 0.05 },
    "Galvanized Pipe 6\" x60\" 28ga": { price: 6.07, laborHours: 0.05 },
    "Galvanized Pipe 7\" x60\" 30ga": { price: 4.28, laborHours: 0.05 },
    "Galvanized Pipe 7\" x60\" 28ga": { price: 7.19, laborHours: 0.05 },
    "Galvanized Pipe 8\" x60\" 30ga": { price: 4.78, laborHours: 0.05 },
    "Galvanized Pipe 8\" x60\" 28ga": { price: 8.30, laborHours: 0.05 },
    "Galvanized Pipe 9\" x60\" 30ga": { price: 8.22, laborHours: 0.05 },
    "Galvanized Pipe 10\" x60\" 28ga": { price: 10.03, laborHours: 0.05 },
    "Galvanized Pipe 12\" x60\" 28ga": { price: 11.96, laborHours: 0.05 },
    "Galvanized Pipe 3\" x36\" 28ga": { price: 4.31, laborHours: 0.05 },
    "Galvanized Pipe 4\" x36\" 28ga": { price: 5.21, laborHours: 0.05 },
    "Galvanized Pipe 4\" x48\" 26ga": { price: 6.36, laborHours: 0.05 },
    "Galvanized Pipe 5\" x48\" 26ga": { price: 7.20, laborHours: 0.05 },
    "Galvanized Pipe 5\" x36\" 24ga": { price: 10.16, laborHours: 0.05 },
    "Galvanized Pipe 6\" x48\" 26ga": { price: 7.88, laborHours: 0.05 },
    "Galvanized Pipe 6\" x36\" 24ga": { price: 10.92, laborHours: 0.05 },
    "Galvanized Pipe 7\" x48\" 26ga": { price: 9.09, laborHours: 0.05 },
    "Galvanized Pipe 7\" x36\" 24ga": { price: 12.51, laborHours: 0.05 },
    "Galvanized Pipe 8\" x48\" 26ga": { price: 10.31, laborHours: 0.05 },
    "Galvanized Pipe 8\" x36\" 24ga": { price: 15.30, laborHours: 0.05 },
    "Galvanized Pipe 9\" x48\" 26ga": { price: 11.82, laborHours: 0.05 },
    "Galvanized Pipe 9\" x36\" 24ga": { price: 18.51, laborHours: 0.05 },
    "Galvanized Pipe 10\" x48\" 26ga": { price: 12.63, laborHours: 0.05 },
    "Galvanized Pipe 10\" x36\" 24ga": { price: 20.46, laborHours: 0.05 },
    "Galvanized Pipe 12\" x48\" 26ga": { price: 16.00, laborHours: 0.05 },
    "Galvanized Pipe 12\" x36\" 24ga": { price: 24.05, laborHours: 0.05 },
    "Galvanized Pipe 14\" x48\" 26ga": { price: 18.27, laborHours: 0.05 },
    "Galvanized Pipe 14\" x36\" 24ga": { price: 33.98, laborHours: 0.05 },
    "Galvanized Pipe 16\" x36\" 24ga": { price: 36.90, laborHours: 0.05 },
    "Galvanized Pipe 18\" x36\" 24ga": { price: 36.90, laborHours: 0.05 }
  },
  ovalPipe: {
    "Oval Pipe 3x6 (5\") x60\" 30ga": { price: 3.90, laborHours: 0.05 },
    "Oval Pipe 3x8 (6\") x60\" 30ga": { price: 4.43, laborHours: 0.05 }
  },
  teesAndWyes: {
    "Tee 4x4x4 28ga": { price: 19.76, laborHours: 0.3 },
    "Wye 4x4x4 28ga": { price: 22.08, laborHours: 0.3 },
    "Tee 5x5x4 26ga": { price: 22.52, laborHours: 0.3 },
    "Wye 5x5x4 26ga": { price: 26.07, laborHours: 0.3 },
    "Tee 5x5x5 26ga": { price: 22.67, laborHours: 0.3 },
    "Wye 5x5x5 26ga": { price: 26.43, laborHours: 0.3 },
    "Tee 6x6x4 26ga": { price: 29.45, laborHours: 0.3 },
    "Wye 6x6x4 26ga": { price: 28.94, laborHours: 0.3 },
    "Tee 6x6x5 26ga": { price: 29.49, laborHours: 0.3 },
    "Tee 6x6x6 26ga": { price: 29.42, laborHours: 0.3 },
    "Wye 6x6x6 26ga": { price: 29.24, laborHours: 0.3 },
    "Tee 7x7x7 26ga": { price: 35.81, laborHours: 0.3 },
    "Wye 7x7x7 26ga": { price: 40.17, laborHours: 0.3 },
    "Tee 8x8x5 26ga": { price: 40.46, laborHours: 0.3 },
    "Tee 8x8x6 26ga": { price: 40.53, laborHours: 0.3 },
    "Tee 8x8x8 26ga": { price: 41.63, laborHours: 0.3 },
    "Wye 8x8x8 26ga": { price: 47.69, laborHours: 0.3 },
    "Tee 10x10x6 24ga": { price: 52.96, laborHours: 0.3 },
    "Tee 10x10x8 24ga": { price: 53.33, laborHours: 0.3 },
    "Tee 10x10x10 24ga": { price: 54.53, laborHours: 0.3 },
    "Tee 12x12x12 24ga": { price: 72.84, laborHours: 0.3 },
    "Saddle Wye 4\" Y 45° to fit 6\" Pipe": { price: 27.88, laborHours: 0.3 },
    "Saddle Wye 6\" Y 45° to fit 6\" Pipe": { price: 33.00, laborHours: 0.3 }
  },
  reducersIncreasers: {
    "Round Reducer 4-3 28ga": { price: 16.80, laborHours: 0.2 },
    "Round Increaser 3-4 28ga": { price: 16.80, laborHours: 0.2 },
    "Round Reducer 5-3 26ga": { price: 16.80, laborHours: 0.2 },
    "Round Increaser 3-5 26ga": { price: 16.80, laborHours: 0.2 },
    "Round Reducer 5-4 26ga": { price: 16.80, laborHours: 0.2 },
    "Round Increaser 4-5 26ga": { price: 16.80, laborHours: 0.2 },
    "Round Reducer 6-3 26ga": { price: 19.07, laborHours: 0.2 },
    "Round Increaser 3-6 26ga": { price: 19.07, laborHours: 0.2 },
    "Round Reducer 6-4 26ga": { price: 19.07, laborHours: 0.2 },
    "Round Increaser 4-6 26ga": { price: 19.07, laborHours: 0.2 },
    "Round Reducer 6-5 26ga": { price: 19.44, laborHours: 0.2 },
    "Round Increaser 5-6 26ga": { price: 19.44, laborHours: 0.2 },
    "Round Reducer 7-4 26ga": { price: 21.20, laborHours: 0.2 },
    "Round Increaser 4-7 26ga": { price: 21.20, laborHours: 0.2 },
    "Round Reducer 7-5 26ga": { price: 21.20, laborHours: 0.2 },
    "Round Increaser 5-7 26ga": { price: 21.20, laborHours: 0.2 },
    "Round Reducer 7-6 26ga": { price: 22.08, laborHours: 0.2 },
    "Round Increaser 6-7 26ga": { price: 22.08, laborHours: 0.2 },
    "Round Reducer 8-4 26ga": { price: 24.73, laborHours: 0.2 },
    "Round Increaser 4-8 26ga": { price: 24.73, laborHours: 0.2 },
    "Round Reducer 8-5 26ga": { price: 25.63, laborHours: 0.2 },
    "Round Increaser 5-8 26ga": { price: 25.63, laborHours: 0.2 },
    "Round Reducer 8-6 26ga": { price: 25.79, laborHours: 0.2 },
    "Round Increaser 6-8 26ga": { price: 25.79, laborHours: 0.2 },
    "Round Reducer 8-7 26ga": { price: 26.49, laborHours: 0.2 },
    "Round Increaser 7-8 26ga": { price: 26.49, laborHours: 0.2 },
    "Round Reducer 10-8 24ga": { price: 31.56, laborHours: 0.2 },
    "Round Increaser 8-10 24ga": { price: 31.95, laborHours: 0.2 }
  },
  capsAndPlugs: {
    "Cap 3\" Galvanized": { price: 15.42, laborHours: 0.1 },
    "Plug 4\" Galvanized": { price: 6.10, laborHours: 0.1 },
    "Cap 4\" Galvanized": { price: 11.22, laborHours: 0.1 },
    "Cap 4\" with Birdscreen": { price: 21.55, laborHours: 0.1 },
    "Plug 5\" Galvanized": { price: 6.46, laborHours: 0.1 },
    "Cap 5\" Galvanized": { price: 13.80, laborHours: 0.1 },
    "Cap 5\" with Birdscreen": { price: 25.88, laborHours: 0.1 },
    "Plug 6\" Galvanized": { price: 8.22, laborHours: 0.1 },
    "Cap 6\" Galvanized": { price: 14.52, laborHours: 0.1 },
    "Cap 6\" with Birdscreen": { price: 27.28, laborHours: 0.1 },
    "Plug 7\" Galvanized": { price: 8.82, laborHours: 0.1 },
    "Cap 7\" Galvanized": { price: 15.66, laborHours: 0.1 },
    "Cap 7\" with Birdscreen": { price: 31.52, laborHours: 0.1 },
    "Plug 8\" Galvanized": { price: 10.15, laborHours: 0.1 },
    "Cap 8\" Galvanized": { price: 17.76, laborHours: 0.1 },
    "Cap 8\" with Birdscreen": { price: 34.29, laborHours: 0.1 },
    "Plug 9\" Galvanized": { price: 10.50, laborHours: 0.1 },
    "Cap 9\" Galvanized": { price: 21.12, laborHours: 0.1 },
    "Plug 10\" Galvanized": { price: 13.08, laborHours: 0.1 },
    "Cap 10\" Galvanized": { price: 23.28, laborHours: 0.1 },
    "Cap 10\" with Birdscreen": { price: 43.28, laborHours: 0.1 },
    "Plug 12\" Galvanized": { price: 19.62, laborHours: 0.1 },
    "Cap 12\" Galvanized": { price: 25.80, laborHours: 0.1 },
    "Cap 12\" with Birdscreen": { price: 47.68, laborHours: 0.1 },
    "Plug 14\" Galvanized": { price: 22.62, laborHours: 0.1 },
    "Cap 14\" Galvanized": { price: 28.56, laborHours: 0.1 },
    "Plug 16\" Galvanized": { price: 26.04, laborHours: 0.1 },
    "Cap 16\" Galvanized": { price: 36.29, laborHours: 0.1 },
    "Plug 18\" Galvanized": { price: 29.70, laborHours: 0.1 },
    "Plug 20\" Galvanized": { price: 36.90, laborHours: 0.1 },
    "Plug 22\" Galvanized": { price: 40.92, laborHours: 0.1 },
    "Plug 24\" Galvanized": { price: 45.60, laborHours: 0.1 }
  },
  joistLiners: {
    "Joist Liner 16\"x34\" Galvanized": { price: 8.04, laborHours: 0.2 },
    "Joist Liner 19.5\"x34\" Galvanized": { price: 9.42, laborHours: 0.2 },
    "Joist Liner 24\"x34\" Galvanized": { price: 11.56, laborHours: 0.2 }
  },
  supports: {
    "Pipe Support 16\"": { price: 1.28, laborHours: 0.1 },
    "Pipe Support 21\"": { price: 2.02, laborHours: 0.1 },
    "Pipe Support 24\"": { price: 2.26, laborHours: 0.1 },
    "Hanger Strap 1\"x96\" Light Gauge": { price: 3.15, laborHours: 0.1 },
    "Slip Cleat 60\" Light Gauge": { price: 5.32, laborHours: 0.1 },
    "Slip Cleat 96\" Light Gauge": { price: 9.27, laborHours: 0.1 },
    "Drive Cleat 60\" Light Gauge": { price: 3.24, laborHours: 0.1 },
    "Drive Cleat 96\" Light Gauge": { price: 5.97, laborHours: 0.1 },
    "Angle 1.5\"x1.5\"x120\" 28ga": { price: 12.68, laborHours: 0.1 }
  },
  miscellaneous: {
    "Kitchen Kick Board Box 2.25x12x15\"": { price: 22.00, laborHours: 0.5 },
    "Kitchen Kick Board Box 3x10x15\"": { price: 22.00, laborHours: 0.5 },
    "Return Air Frame 9.75\" Long 25x9.5\"": { price: 9.02, laborHours: 0.3 },
    "Brochure Holder": { price: 7.75, laborHours: 0.1 }
  }
};

// Function to get category-specific multiplier
const getCategoryMultiplier = (category: string): number => {
  return categoryMultipliers[category as keyof typeof categoryMultipliers] || 0.625;
};

// Popular/Common HVAC items for quick selection
const popularItems = {
  "Round 90° Elbow 4\" Residential": { category: "elbowsRound", price: 3.13, laborHours: 0.2 },
  "Round 90° Elbow 5\" Residential": { category: "elbowsRound", price: 3.55, laborHours: 0.2 },
  "Round 90° Elbow 6\" Residential": { category: "elbowsRound", price: 4.50, laborHours: 0.2 },
  "Galvanized Pipe 4\" x60\" 30ga": { category: "pipe", price: 2.58, laborHours: 0.05 },
  "Galvanized Pipe 5\" x60\" 30ga": { category: "pipe", price: 3.14, laborHours: 0.05 },
  "Galvanized Pipe 6\" x60\" 30ga": { category: "pipe", price: 3.52, laborHours: 0.05 },
  "Universal Boot 4\" 3x10": { category: "boots", price: 7.36, laborHours: 0.3 },
  "Universal Boot 5\" 3x10": { category: "boots", price: 7.04, laborHours: 0.3 },
  "Universal Boot 6\" 3x10": { category: "boots", price: 8.13, laborHours: 0.3 },
  "Side Take Off 4\"": { category: "takeOffs", price: 6.28, laborHours: 0.2 },
  "Side Take Off 5\"": { category: "takeOffs", price: 6.61, laborHours: 0.2 },
  "Side Take Off 6\"": { category: "takeOffs", price: 8.89, laborHours: 0.2 },
  "Galvanized Damper 4\"": { category: "dampers", price: 2.80, laborHours: 0.2 },
  "Galvanized Damper 5\"": { category: "dampers", price: 3.04, laborHours: 0.2 },
  "Galvanized Damper 6\"": { category: "dampers", price: 3.55, laborHours: 0.2 },
};

function EnhancedQuoteBuilderContent() {
  const [quote, setQuote] = useState<Quote>({
    items: [],
    subtotal: 0,
    labor: 0,
    markup: 0,
    tax: 0,
    total: 0
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPopularItems, setShowPopularItems] = useState(true);
  const [quickFilter, setQuickFilter] = useState("");

  // Filter items based on search term
  const getFilteredItems = (category: string) => {
    if (!algginPricing[category as keyof typeof algginPricing]) return [];
    
    const items = Object.keys(algginPricing[category as keyof typeof algginPricing]);
    
    if (!searchTerm) return items;
    
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const [laborRate, setLaborRate] = useState<number>(95); // $95/hour Calgary rate
  const [priceMultiplier, setPriceMultiplier] = useState<number>(0.625); // Default residential multiplier
  const [markupPercentage, setMarkupPercentage] = useState<number>(40); // 40% markup on final price
  const [taxRate] = useState<number>(5); // 5% GST
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    jobDescription: ""
  });
  
  const [laborHours, setLaborHours] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSavingQuote, setIsSavingQuote] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const categories = Object.keys(algginPricing);
  const availableItems = selectedCategory ? Object.keys(algginPricing[selectedCategory as keyof typeof algginPricing]) : [];
  
  // Filter items based on search term
  const filteredItems = availableItems.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = () => {
    if (!selectedCategory || !selectedItem || !quantity) return;

    const categoryData = algginPricing[selectedCategory as keyof typeof algginPricing];
    if (!categoryData) return;
    
    const itemData = categoryData[selectedItem as keyof typeof categoryData];
    if (!itemData) return;
    
    const qty = parseFloat(quantity);
    const categoryMultiplier = getCategoryMultiplier(selectedCategory);
    const discountedPrice = itemData.price * categoryMultiplier; // Apply category-specific multiplier
    
    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random()}`,
      name: selectedItem,
      category: selectedCategory,
      item: selectedItem,
      quantity: qty,
      unitPrice: discountedPrice,
      laborHours: 0, // Remove labor hours from materials
      total: discountedPrice * qty
    };

    setQuote(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Reset form
    setSelectedItem("");
    setQuantity("1");
    setSearchTerm("");
  };

  const removeItem = (id: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const qty = Math.max(0.1, newQuantity);
          const originalLaborHours = item.laborHours / item.quantity;
          return {
            ...item,
            quantity: qty,
            laborHours: originalLaborHours * qty,
            total: item.unitPrice * qty
          };
        }
        return item;
      })
    }));
  };

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.total, 0);
    const labor = laborHours * laborRate; // Use manual labor hours entry
    const markup = (subtotal + labor) * (markupPercentage / 100);
    const beforeTax = subtotal + labor + markup;
    const tax = beforeTax * (taxRate / 100);
    const total = beforeTax + tax;

    setQuote(prev => ({
      ...prev,
      subtotal,
      labor,
      markup,
      tax,
      total
    }));
  }, [quote.items, laborHours, laborRate, markupPercentage, taxRate]);

  const generateQuoteText = () => {
    const date = new Date().toLocaleDateString();
    
    return `AFTERHOURS HVAC - PROFESSIONAL ESTIMATE
Quote #: AH-${Date.now().toString().slice(-6)}
Generated: ${date}

CUSTOMER INFORMATION:
${customerInfo.name}
${customerInfo.address}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email}

JOB DESCRIPTION:
${customerInfo.jobDescription}

MATERIALS & LABOR BREAKDOWN:

${quote.items.map((item, index) => 
  `${index + 1}. ${item.item}
   Quantity: ${item.quantity} @ $${item.unitPrice.toFixed(2)} each
   Labor: ${item.laborHours.toFixed(1)} hours
   Line Total: $${item.total.toFixed(2)}`
).join('\n\n')}

QUOTE SUMMARY:
Materials Subtotal: $${quote.subtotal.toFixed(2)}
Labor (${laborHours.toFixed(1)} hrs @ $${laborRate}/hr): $${quote.labor.toFixed(2)}
Contractor Markup (${markupPercentage}%): $${quote.markup.toFixed(2)}
Subtotal: $${(quote.subtotal + quote.labor + quote.markup).toFixed(2)}
GST (${taxRate}%): $${quote.tax.toFixed(2)}

TOTAL PROJECT COST: $${quote.total.toFixed(2)}

TERMS & CONDITIONS:
• Payment Schedule: 40% deposit, 40% at rough-in, 20% completion
• Quote valid for 30 days from date issued
• Warranty: 1 year workmanship, manufacturer warranty on materials
• All work performed to Alberta Building Code standards
• Permits and inspections included where applicable

AfterHours HVAC
Calgary, Alberta
Phone: (403) 613-6014
Email: info@afterhourshvac.ca

Thank you for choosing AfterHours HVAC for your project needs.`;
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF();
      const date = new Date().toLocaleDateString();
      const quoteNum = quoteNumber || `AH-${Date.now().toString().slice(-6)}`;
      setQuoteNumber(quoteNum);
      
      // Header
      pdf.setFontSize(20);
      pdf.text('AFTERHOURS HVAC', 20, 30);
      pdf.setFontSize(16);
      pdf.text('Professional HVAC Estimate', 20, 40);
      
      // Quote Info
      pdf.setFontSize(12);
      pdf.text(`Quote #: ${quoteNum}`, 20, 55);
      pdf.text(`Date: ${date}`, 120, 55);
      
      // Customer Info
      pdf.setFontSize(14);
      pdf.text('CUSTOMER INFORMATION', 20, 75);
      pdf.setFontSize(10);
      pdf.text(`Name: ${customerInfo.name}`, 20, 85);
      pdf.text(`Address: ${customerInfo.address}`, 20, 95);
      pdf.text(`Phone: ${customerInfo.phone}`, 20, 105);
      pdf.text(`Email: ${customerInfo.email}`, 20, 115);
      
      // Job Description
      pdf.setFontSize(14);
      pdf.text('JOB DESCRIPTION', 20, 135);
      pdf.setFontSize(10);
      const jobLines = pdf.splitTextToSize(customerInfo.jobDescription, 170);
      pdf.text(jobLines, 20, 145);
      
      // Materials
      let yPos = 165;
      pdf.setFontSize(14);
      pdf.text('MATERIALS & LABOR', 20, yPos);
      yPos += 15;
      
      pdf.setFontSize(10);
      quote.items.forEach((item, index) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 30;
        }
        pdf.text(`${index + 1}. ${item.item}`, 20, yPos);
        pdf.text(`Qty: ${item.quantity} @ $${item.unitPrice.toFixed(2)}`, 20, yPos + 8);
        pdf.text(`$${item.total.toFixed(2)}`, 160, yPos);
        yPos += 20;
      });
      
      // Totals
      yPos += 10;
      if (yPos > 220) {
        pdf.addPage();
        yPos = 30;
      }
      
      pdf.setFontSize(12);
      pdf.text(`Materials Subtotal: $${quote.subtotal.toFixed(2)}`, 20, yPos);
      pdf.text(`Labor (${laborHours}hrs @ $${laborRate}/hr): $${quote.labor.toFixed(2)}`, 20, yPos + 12);
      pdf.text(`Markup (${markupPercentage}%): $${quote.markup.toFixed(2)}`, 20, yPos + 24);
      pdf.text(`GST (${taxRate}%): $${quote.tax.toFixed(2)}`, 20, yPos + 36);
      pdf.setFontSize(14);
      pdf.text(`TOTAL: $${quote.total.toFixed(2)}`, 20, yPos + 50);
      
      if (depositAmount && parseFloat(depositAmount) > 0) {
        pdf.setFontSize(12);
        pdf.text(`DEPOSIT REQUIRED: $${parseFloat(depositAmount).toFixed(2)}`, 20, yPos + 65);
        pdf.text(`BALANCE DUE: $${(quote.total - parseFloat(depositAmount)).toFixed(2)}`, 20, yPos + 77);
      }
      
      // Footer
      pdf.setFontSize(10);
      pdf.text('Terms: Payment due within 30 days. Quote valid for 30 days.', 20, yPos + 95);
      pdf.text('AfterHours HVAC | info@afterhourshvac.ca | Licensed & Insured', 20, yPos + 105);
      
      // Save PDF
      pdf.save(`afterhours-hvac-quote-${quoteNum}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const saveQuote = async () => {
    setIsSavingQuote(true);
    try {
      const quoteData = {
        quoteNumber: quoteNumber || `AH-${Date.now().toString().slice(-6)}`,
        customerInfo,
        items: quote.items,
        laborHours,
        laborRate,
        markupPercentage,
        taxRate,
        subtotal: quote.subtotal,
        labor: quote.labor,
        markup: quote.markup,
        tax: quote.tax,
        total: quote.total,
        depositAmount: depositAmount ? parseFloat(depositAmount) : null,
        createdAt: new Date().toISOString()
      };
      
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });
      
      if (response.ok) {
        alert('Quote saved successfully!');
      } else {
        throw new Error('Failed to save quote');
      }
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Error saving quote. Please try again.');
    } finally {
      setIsSavingQuote(false);
    }
  };

  const processStripePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const paymentAmount = depositAmount && parseFloat(depositAmount) > 0 
        ? parseFloat(depositAmount) 
        : quote.total;
      
      const response = await apiFetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          quoteNumber: quoteNumber || `AH-${Date.now().toString().slice(-6)}`,
          customerInfo,
          isDeposit: depositAmount && parseFloat(depositAmount) > 0
        }),
      });
      
      const { clientSecret } = await response.json();
      
      // Redirect to Stripe checkout or handle payment
      window.open(`/checkout?client_secret=${clientSecret}`, '_blank');
      
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-green-100 border border-green-200 rounded-full px-6 py-3 mb-6">
            <FileCheck className="h-5 w-5 text-green-700 mr-3" />
            <span className="text-green-800 text-lg font-bold">Professional Quote Builder</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Calgary HVAC Material Calculator</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Complete job estimating with real Alggin pricing data. Build comprehensive quotes for residential and commercial HVAC projects.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl xl:col-span-1 shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5" />
                Customer & Job Details
              </CardTitle>
            </CardHeader>
            
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="customerName" className="text-gray-800 font-semibold">Customer Name</Label>
                <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                  id="customerName"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Smith"
                  className="mt-1 text-white"
                />
              </div>
              <div>
                <Label htmlFor="customerAddress" className="text-gray-800 font-semibold">Project Address</Label>
                <Textarea
                  id="customerAddress"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main St, Calgary, AB T2P 1A1"
                  rows={2}
                  className="mt-1 text-white"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone" className="text-gray-800 font-semibold">Phone Number</Label>
                <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                  id="customerPhone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(403) 555-0123"
                  className="mt-1 text-white"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail" className="text-gray-800 font-semibold">Email Address</Label>
                <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                  id="customerEmail"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="mt-1 text-white"
                />
              </div>
              <div>
                <Label htmlFor="jobDescription" className="text-gray-800 font-semibold">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={customerInfo.jobDescription}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, jobDescription: e.target.value }))}
                  placeholder="Describe the scope of work, special requirements, or project details..."
                  rows={3}
                  className="mt-1 text-white"
                />
              </div>
              
              {/* Pricing Controls */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg border border-blue-200">
                <div>
                  <Label htmlFor="laborRate" className="text-gray-800 font-semibold">Labor Rate ($/hr)</Label>
                  <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                    id="laborRate"
                    type="number"
                    value={laborRate}
                    onChange={(e) => setLaborRate(parseFloat(e.target.value) || 0)}
                    placeholder="95"
                    className="mt-1 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-800 font-semibold">Category Multipliers</Label>
                  <div className="mt-1 p-2 bg-white rounded border text-xs">
                    <div className="grid grid-cols-2 gap-1 text-white/80">
                      <div>Furnaces: 65.0%</div>
                      <div>A/C Units: 65.0%</div>
                      <div>Heat Pumps: 65.0%</div>
                      <div>RTU: 60.0%</div>
                      <div>MUA: 60.0%</div>
                      <div>Bath Fans: 55.0%</div>
                      <div>HRV/ERV: 60.0%</div>
                      <div>Water Heaters: 65.0%</div>
                      <div>Boilers: 65.0%</div>
                      <div>Ductwork: 62.5%</div>
                      <div>Components: 62.5%</div>
                      <div>Hardware: 60.0%</div>
                    </div>
                  </div>
                  <div className="text-xs text-white/60 mt-1">Automatic pricing based on category</div>
                </div>
              </div>
              
              {/* Labor Hours Input */}
              <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg border border-orange-200">
                <Label htmlFor="laborHours" className="text-gray-800 font-semibold">Total Labor Hours</Label>
                <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                  id="laborHours"
                  type="number"
                  step="0.5"
                  value={laborHours}
                  onChange={(e) => setLaborHours(parseFloat(e.target.value) || 0)}
                  placeholder="8.0"
                  className="mt-1 text-white"
                />
                <div className="text-xs text-white/60 mt-1">Enter estimated labor hours for the entire job</div>
              </div>
            </div>
          </div>

          {/* Add Items */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl xl:col-span-1 shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Materials & Components
              </CardTitle>
            </CardHeader>
            
            <div className="p-6 space-y-4">
              {/* Quick Selection Popular Items */}
              {!selectedCategory && (
                <div className="mb-6">
                  <Label className="text-gray-800 font-semibold mb-3 block">Quick Add Popular Items</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(popularItems).slice(0, 6).map(([itemName, itemData]) => (
                      <Button
                        key={itemName}
                        variant="outline"
                        className="h-auto p-3 text-left justify-between hover:bg-white/5 backdrop-blur-sm border border-white/10"
                        onClick={() => {
                          const categoryData = algginPricing[itemData.category as keyof typeof algginPricing];
                          if (categoryData && itemName in categoryData) {
                            const categoryMultiplier = getCategoryMultiplier(itemData.category);
                            const discountedPrice = itemData.price * categoryMultiplier;
                            const item: QuoteItem = {
                              id: Date.now().toString(),
                              name: itemName,
                              category: itemData.category,
                              item: itemName,
                              unitPrice: discountedPrice,
                              quantity: 1,
                              total: discountedPrice,
                              laborHours: 0
                            };
                            setQuote(prev => ({
                              ...prev,
                              items: [...prev.items, item]
                            }));
                          }
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">{itemName.replace(/"/g, '"')}</div>
                          <div className="text-green-400 font-bold text-xs">${(itemData.price * getCategoryMultiplier(itemData.category)).toFixed(2)}</div>
                        </div>
                        <Plus className="h-4 w-4 text-green-400" />
                      </Button>
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedCategory("elbowsRound")}
                      className="text-blue-400 hover:text-blue-700"
                    >
                      Browse All Categories →
                    </Button>
                  </div>
                </div>
              )}

              {/* Search and Filter */}
              <div>
                <Label className="text-gray-800 font-semibold">Search Materials</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                    placeholder="Search by name or size (e.g. '4 inch elbow', 'galvanized pipe')..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-white"
                  />
                </div>
              </div>

              {/* Quick Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={quickFilter === "4inch" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setQuickFilter(quickFilter === "4inch" ? "" : "4inch");
                    setSearchTerm(quickFilter === "4inch" ? "" : "4");
                  }}
                  className="text-xs"
                >
                  4" Items
                </Button>
                <Button
                  variant={quickFilter === "5inch" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setQuickFilter(quickFilter === "5inch" ? "" : "5inch");
                    setSearchTerm(quickFilter === "5inch" ? "" : "5");
                  }}
                  className="text-xs"
                >
                  5" Items
                </Button>
                <Button
                  variant={quickFilter === "6inch" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setQuickFilter(quickFilter === "6inch" ? "" : "6inch");
                    setSearchTerm(quickFilter === "6inch" ? "" : "6");
                  }}
                  className="text-xs"
                >
                  6" Items
                </Button>
                <Button
                  variant={quickFilter === "elbows" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setQuickFilter(quickFilter === "elbows" ? "" : "elbows");
                    setSearchTerm(quickFilter === "elbows" ? "" : "elbow");
                  }}
                  className="text-xs"
                >
                  Elbows
                </Button>
                <Button
                  variant={quickFilter === "pipe" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setQuickFilter(quickFilter === "pipe" ? "" : "pipe");
                    setSearchTerm(quickFilter === "pipe" ? "" : "pipe");
                  }}
                  className="text-xs"
                >
                  Pipe
                </Button>
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-800 font-semibold">Browse by Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category or use search above" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Major HVAC Equipment */}
                    <SelectItem value="furnaces">🔥 Furnaces (80k-120k BTU)</SelectItem>
                    <SelectItem value="airConditioners">❄️ Air Conditioners (2-5 Ton)</SelectItem>
                    <SelectItem value="heatPumps">🔄 Heat Pumps (Cold Climate)</SelectItem>
                    <SelectItem value="rooftopUnits">🏢 Rooftop Units (3-10 Ton RTU)</SelectItem>
                    <SelectItem value="makeUpAirUnits">🌬️ Make-Up Air Units (30k-150k BTU)</SelectItem>
                    <SelectItem value="waterHeaters">🚿 Water Heaters (40-75 Gal + Tankless)</SelectItem>
                    <SelectItem value="boilers">♨️ Boilers (80k-174k BTU)</SelectItem>
                    
                    {/* Ventilation Equipment */}
                    <SelectItem value="bathFans">🛁 Bath Fans (50-110 CFM)</SelectItem>
                    <SelectItem value="exhaustFans">💨 Exhaust Fans (Commercial)</SelectItem>
                    <SelectItem value="heatRecoveryVentilators">🔄 HRV Units</SelectItem>
                    <SelectItem value="energyRecoveryVentilators">⚡ ERV Units</SelectItem>
                    
                    {/* Ductwork & Components */}
                    <SelectItem value="plenums">📦 Plenums</SelectItem>
                    <SelectItem value="ductwork">🔧 Ductwork (All Sizes)</SelectItem>
                    <SelectItem value="elbowsRound">↪️ Round Elbows (4", 5", 6"+)</SelectItem>
                    <SelectItem value="pipe">🔩 Galvanized Pipe (All Sizes)</SelectItem>
                    <SelectItem value="boots">👢 Boots & Transitions</SelectItem>
                    <SelectItem value="takeOffs">🔀 Take Offs</SelectItem>
                    <SelectItem value="dampers">🎛️ Dampers</SelectItem>
                    <SelectItem value="teesAndWyes">🔀 Tees & Wyes</SelectItem>
                    <SelectItem value="reducersIncreasers">📐 Reducers</SelectItem>
                    <SelectItem value="capsAndPlugs">🔒 Caps & Plugs</SelectItem>
                    <SelectItem value="filterFrames">🌪️ Filter Frames</SelectItem>
                    <SelectItem value="endCaps">🔚 End Caps</SelectItem>
                    <SelectItem value="supports">🔧 Hardware & Supports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && (
                <>
                  <div>
                    <Label htmlFor="search" className="text-gray-800 font-semibold">Search Items</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search materials..."
                        className="pl-10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="item" className="text-gray-800 font-semibold">Select Item</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose specific item" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {filteredItems.map(item => {
                          const categoryData = algginPricing[selectedCategory as keyof typeof algginPricing];
                          const itemData = categoryData ? categoryData[item as keyof typeof categoryData] : null;
                          return (
                            <SelectItem key={item} value={item}>
                              <div className="flex justify-between items-center w-full">
                                <span className="text-white font-medium">{item}</span>
                                <span className="text-green-400 font-bold ml-4">${itemData?.price?.toFixed(2) || "0.00"}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedItem && (
                <div>
                  <Label htmlFor="quantity" className="text-gray-800 font-semibold">Quantity</Label>
                  <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                    id="quantity"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 text-white"
                  />
                  <div className="mt-2 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg border border-blue-200">
                    <div className="text-sm text-gray-800">
                      <div className="font-semibold text-blue-800">Item Details:</div>
                      <div>Unit Price: <span className="font-bold text-green-400">${algginPricing[selectedCategory as keyof typeof algginPricing][selectedItem as any]?.price.toFixed(2)}</span></div>
                      <div>Labor Hours: <span className="font-bold text-amber-500">{algginPricing[selectedCategory as keyof typeof algginPricing][selectedItem as any]?.laborHours} hrs</span></div>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={addItem}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
                disabled={!selectedCategory || !selectedItem || !quantity}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Quote
              </Button>
            </div>
          </div>

          {/* Quote Summary */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl xl:col-span-1 shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Quote Summary
              </CardTitle>
            </CardHeader>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">Materials:</span>
                  <span className="font-bold">${quote.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">Labor ({(quote.labor / laborRate).toFixed(1)} hrs):</span>
                  <span className="font-bold">${quote.labor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-800">
                  <span className="font-medium">Markup:</span>
                  <div className="flex items-center gap-2">
                    <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      type="number"
                      value={markupPercentage}
                      onChange={(e) => setMarkupPercentage(parseFloat(e.target.value) || 0)}
                      className="w-16 h-8 text-xs text-center"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm">%</span>
                    <span className="font-bold">${quote.markup.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">GST ({taxRate}%):</span>
                  <span className="font-bold">${quote.tax.toFixed(2)}</span>
                </div>
                <Separator className="bg-gray-300" />
                <div className="flex justify-between text-xl font-bold text-green-700">
                  <span>Total:</span>
                  <span>${quote.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Deposit Override Field */}
              <div className="pt-4 border-t border-gray-200">
                <Label className="text-gray-800 font-semibold">Deposit Amount (Optional)</Label>
                <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                  type="number"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Leave blank for full payment"
                  className="mt-1 text-white"
                />
                <div className="text-xs text-white/60 mt-1">
                  For trusted customers - override payment amount
                </div>
                {depositAmount && parseFloat(depositAmount) > 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <div className="text-sm text-yellow-800">
                      <div>Deposit: ${parseFloat(depositAmount).toFixed(2)}</div>
                      <div>Balance Due: ${(quote.total - parseFloat(depositAmount)).toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={generatePDF}
                  disabled={quote.items.length === 0 || isGeneratingPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Quote'}
                </Button>

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={saveQuote}
                  disabled={quote.items.length === 0 || isSavingQuote}
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  {isSavingQuote ? 'Saving...' : 'Save Quote to Site'}
                </Button>

                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                  onClick={processStripePayment}
                  disabled={quote.items.length === 0 || isProcessingPayment}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {isProcessingPayment ? 'Processing...' : 
                    depositAmount && parseFloat(depositAmount) > 0 
                      ? `Collect $${parseFloat(depositAmount).toFixed(2)} Deposit`
                      : `Collect $${quote.total.toFixed(2)} Payment`
                  }
                </Button>
                
                <div className="text-center text-sm text-white/70">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Estimated completion: {(quote.labor / laborRate / 8).toFixed(1)} days
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Items List */}
        {quote.items.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
              <CardTitle className="text-xl">Quote Line Items</CardTitle>
            </CardHeader>
            
            <div className="p-6">
              <div className="space-y-4">
                {quote.items.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg">{index + 1}. {item.item}</div>
                      <div className="text-sm text-white/60 mt-1">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                          {item.category}
                        </span>
                        <span className="mr-4">${item.unitPrice.toFixed(2)} each</span>
                        <span className="mr-4">{item.laborHours.toFixed(1)} labor hrs</span>
                        <span className="font-bold text-green-400">Line Total: ${item.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                        className="w-20 text-center text-white"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnhancedQuoteBuilder() {
  return (
    <ProAccessGuard>
      <EnhancedQuoteBuilderContent />
    </ProAccessGuard>
  );
}