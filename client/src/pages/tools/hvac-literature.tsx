import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Download, Search, FileText, MapPin, 
  Building, Thermometer, Zap, AlertTriangle, Star,
  Calendar, DollarSign, Wrench, Shield, Phone
} from "lucide-react";

export default function HVACLiterature() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const literatureCategories = [
    { id: "all", name: "All Documents", icon: BookOpen },
    { id: "codes", name: "Building Codes", icon: Building },
    { id: "pricing", name: "Pricing Guides", icon: DollarSign },
    { id: "installation", name: "Installation Manuals", icon: Wrench },
    { id: "safety", name: "Safety Protocols", icon: Shield },
    { id: "local", name: "Calgary Specific", icon: MapPin }
  ];

  const documents = [
    {
      id: 1,
      title: "Calgary HVAC Installation Pricing Guide",
      category: "pricing",
      type: "pricing",
      description: "Comprehensive pricing guide for residential HVAC installations in Calgary area with aggressive but competitive rates.",
      tags: ["Calgary", "Pricing", "Residential", "Installation"],
      lastUpdated: "2025-01-01",
      downloadUrl: "/api/download/calgary-pricing-guide.pdf",
      content: `
# Calgary HVAC Installation Pricing Guide - The Apex Standard

## Residential HVAC Codes & Installation Pricing
**Note from Earl:** These are aggressive but competitive pricing standards for the Calgary market.

### Furnace Installation Pricing (CAD)
**High-Efficiency Furnaces (90%+ AFUE)**
- 80,000 BTU: $3,200 - $4,500 (installed)
- 100,000 BTU: $3,800 - $5,200 (installed)
- 120,000 BTU: $4,200 - $5,800 (installed)

**Premium Furnaces (95%+ AFUE)**
- 80,000 BTU: $4,500 - $6,200 (installed)
- 100,000 BTU: $5,200 - $7,000 (installed)
- 120,000 BTU: $5,800 - $7,800 (installed)

### Air Conditioning Installation
**Central Air Systems**
- 2 Ton Unit: $2,800 - $4,200 (installed)
- 2.5 Ton Unit: $3,200 - $4,800 (installed)
- 3 Ton Unit: $3,600 - $5,400 (installed)
- 4 Ton Unit: $4,200 - $6,200 (installed)

### Ductwork Pricing
**New Ductwork Installation**
- Main trunk lines: $12-18 per linear foot
- Branch ducts: $8-12 per linear foot
- Return air ducts: $10-15 per linear foot
- Vent installation: $125-200 per vent

**Ductwork Repair & Sealing**
- Duct sealing (whole house): $800-1,500
- Duct cleaning: $300-600
- Minor repairs: $150-400 per section

### Emergency Service Rates
**Standard Rates**
- Diagnostic fee: $199 (credited toward repair)
- Regular hours labor: $125/hour
- After hours (6PM-8AM): $185/hour
- Weekend/Holiday: $165/hour
- Emergency calls: $225 trip charge

### Installation Add-Ons
**Common Upgrades**
- Programmable thermostat: $175-350
- Smart thermostat: $250-450
- Humidifier installation: $400-800
- Air purifier: $600-1,200
- Zone control system: $1,500-3,200

### Maintenance Plans
**Annual Service Packages**
- Basic Plan: $150/year (1 tune-up)
- Premium Plan: $275/year (2 tune-ups + priority service)
- Commercial Plan: $400-800/year (depending on size)

### Warranty Information
**Standard Warranties**
- Parts: 5-10 years (manufacturer)
- Labor: 1-2 years (AfterHours HVAC)
- Extended warranties available

### Contact Information
**AfterHours HVAC**
- Phone: (403) 613-6014
- Email: Jordan@Afterhourshvac.ca
- Emergency Service: 24/7
- Service Area: Calgary & surrounding areas

*Prices subject to change. Final pricing depends on installation complexity, accessibility, and local permit requirements.*
      `
    },
    {
      id: 2,
      title: "Alberta Residential HVAC Codes",
      category: "codes",
      type: "reference",
      description: "Complete reference guide for Alberta residential HVAC building codes, safety standards, and compliance requirements.",
      tags: ["Alberta", "Building Codes", "Safety", "Compliance"],
      lastUpdated: "2024-12-15",
      downloadUrl: "https://www.csagroup.org/store/product/CSA%20B149.1-20/",
      content: `
# Alberta Residential HVAC Codes - Quick Reference

## Safety Code Requirements

### Gas Furnace Installation (CSA B149.1)
**Clearances (Minimum)**
- Front: 24 inches for service access
- Sides: 6 inches from combustibles
- Top: 12 inches minimum
- Flue pipe: 6 inches from combustibles

**Ventilation Requirements**
- Combustion air: 1 sq inch per 1,000 BTU input
- High-efficiency units: direct vent required
- Condensate drain: gravity drain to floor drain

### Electrical Requirements (Alberta Electrical Code)
**Circuit Requirements**
- Furnace: Dedicated 15A circuit minimum
- A/C condenser: Dedicated circuit sized to unit
- Disconnect switches required within sight

**Grounding**
- All metal ducts must be grounded
- Equipment grounding required
- GFCI protection for outdoor units

### Ductwork Standards (SMACNA)
**Duct Sizing**
- Supply ducts: Based on CFM requirements
- Return ducts: Minimum 1 CFM per sq ft
- Trunk lines: Sized for total system CFM

**Insulation Requirements**
- Supply ducts in unconditioned space: R-6 minimum
- Return ducts: R-4 minimum in unconditioned areas
- Vapor barrier required on cooling ducts

### Permit Requirements
**When Permits Required**
- New furnace installation
- Central A/C installation
- Major ductwork changes
- Gas line modifications

**Inspection Points**
- Rough-in inspection (before drywall)
- Final inspection (before occupancy)
- Gas fitting inspection
- Electrical inspection (if applicable)

### Safety Standards
**Carbon Monoxide Detection**
- Required in all homes with fuel-burning appliances
- Must be installed outside sleeping areas
- Battery backup required

**Gas Leak Detection**
- All joints must be tested
- Soap solution test acceptable
- Electronic leak detectors preferred

### Energy Efficiency Requirements
**AFUE Ratings**
- Minimum 90% AFUE for new installations
- Condensing units required in most applications
- Energy labels must be displayed

**Ductwork Efficiency**
- Maximum 10% total leakage allowed
- Duct blaster testing may be required
- Sealing materials must meet standards

## Common Code Violations to Avoid

1. **Insufficient combustion air**
2. **Improper flue sizing or routing**
3. **Missing electrical disconnects**
4. **Inadequate ductwork support**
5. **Improper refrigerant line sizing**
6. **Missing permits or inspections**

## Contact Information
**Alberta Safety Codes Authority**
- Phone: 1-888-413-0099
- Website: safetycodes.ab.ca

**Local Building Department (Calgary)**
- Phone: 311
- Online permits: calgary.ca

*Always verify current codes with local authority having jurisdiction*
      `
    },
    {
      id: 3,
      title: "Furnace Installation Best Practices",
      category: "installation",
      type: "manual",
      description: "Step-by-step installation procedures for residential furnaces with safety protocols and quality standards.",
      tags: ["Installation", "Furnace", "Safety", "Best Practices"],
      lastUpdated: "2024-12-20",
      downloadUrl: "/api/download/furnace-installation-guide.pdf",
      content: `
# Furnace Installation Best Practices Guide

## Pre-Installation Checklist

### Site Assessment
- [ ] Adequate clearances available
- [ ] Proper ventilation and combustion air
- [ ] Gas line capacity and pressure
- [ ] Electrical supply adequate
- [ ] Condensate drain available
- [ ] Access for service and maintenance

### Tools & Materials Required
**Tools**
- Gas leak detector
- Manometer for gas pressure
- Multimeter for electrical testing
- Drill and bits
- Pipe wrenches and fittings
- Level and measuring tools

**Materials**
- Gas line materials (if needed)
- Electrical wire and connectors
- Ductwork connections
- Condensate drain materials
- Mounting hardware

## Installation Procedure

### Step 1: Remove Old Unit
1. Turn off gas supply and electrical power
2. Disconnect gas line at union
3. Disconnect electrical connections
4. Remove ductwork connections
5. Safely remove old furnace

### Step 2: Prepare Installation Area
1. Clean and level installation surface
2. Install new gas line if required
3. Run electrical circuit if needed
4. Prepare condensate drain route
5. Check clearances one final time

### Step 3: Position New Furnace
1. Carefully move unit into position
2. Level furnace using adjustable legs
3. Maintain proper clearances
4. Secure unit to prevent movement

### Step 4: Make Connections

**Gas Line Connection**
1. Apply thread sealant to male threads
2. Hand tighten, then wrench tighten
3. Test with soap solution
4. Check with gas leak detector

**Electrical Connection**
1. Install disconnect switch
2. Run wire from panel to furnace
3. Make connections per wiring diagram
4. Test with multimeter

**Ductwork Connection**
1. Connect supply plenum
2. Connect return air duct
3. Seal all joints with mastic
4. Insulate as required

### Step 5: Initial Startup
1. Turn on electrical power
2. Slowly open gas valve
3. Follow manufacturer's startup procedure
4. Check for proper operation
5. Test safety controls

## Safety Protocols

### Gas Safety
- Always use gas leak detector
- Never use open flame for leak testing
- Proper ventilation during installation
- Know location of gas shutoffs

### Electrical Safety
- Verify power is off before working
- Use lockout/tagout procedures
- Proper grounding essential
- GFCI protection where required

### Personal Safety
- Use proper lifting techniques
- Wear safety glasses and gloves
- Ensure adequate lighting
- Have fire extinguisher available

## Quality Standards

### Performance Testing
- Manifold pressure within specifications
- Temperature rise within range
- Proper air flow measurements
- Safety controls functional

### Final Documentation
- Installation checklist completed
- Warranty registration submitted
- Customer operation manual provided
- Service schedule established

## Troubleshooting Common Issues

### Unit Won't Start
- Check electrical connections
- Verify gas supply
- Test thermostat operation
- Check safety controls

### Poor Heating Performance
- Verify proper gas pressure
- Check air filter condition
- Inspect ductwork for leaks
- Measure temperature rise

### Safety Control Trips
- Check for blocked vents
- Verify proper combustion air
- Inspect heat exchanger
- Test pressure switches

## Contact for Technical Support
**AfterHours HVAC Technical Line**
- Phone: (403) 613-6014
- Email: tech@afterhourshvac.ca
- Emergency Support: 24/7

*Always follow manufacturer's instructions and local codes*
      `
    },
    {
      id: 4,
      title: "Emergency Service Protocols",
      category: "safety",
      type: "protocol",
      description: "Emergency response procedures for HVAC system failures, gas leaks, and safety situations.",
      tags: ["Emergency", "Safety", "Protocols", "Response"],
      lastUpdated: "2024-12-10",
      downloadUrl: "https://www.hrai.ca/resources/",
      content: `
# Emergency Service Protocols - AfterHours HVAC

## Emergency Response Priority Matrix

### Priority 1 - Immediate Response (1-2 hours)
- Gas leaks or suspected gas leaks
- Carbon monoxide alarms
- No heat with outdoor temps below -10°C
- Electrical hazards from HVAC equipment

### Priority 2 - Same Day Response (4-8 hours)
- No heat with temps above -10°C
- No cooling during extreme heat warnings
- Water leaks from HVAC equipment
- Safety control failures

### Priority 3 - Next Business Day
- Comfort issues (insufficient heating/cooling)
- Noisy operation
- High energy bills
- Maintenance requests

## Gas Leak Response Protocol

### Upon Arrival
1. **DO NOT** use electrical switches or create sparks
2. **DO NOT** smoke or use open flames
3. Ventilate area immediately
4. Check for gas odor intensity
5. Use gas detector to locate source

### Assessment Steps
1. Check all gas appliances
2. Test gas line pressure
3. Inspect all connections with soap solution
4. Document leak location and severity
5. Determine if immediate shutoff required

### Repair Procedures
1. Shut off gas supply if unsafe
2. Evacuate building if necessary
3. Call gas utility if meter or service line
4. Make necessary repairs with proper materials
5. Test all repairs with leak detector

### Safety Clearance
1. Ventilate area thoroughly
2. Test atmosphere with gas detector
3. Verify all repairs hold pressure
4. Document all work performed
5. Customer safety briefing

## Carbon Monoxide Emergency

### Immediate Actions
1. Evacuate building immediately
2. Call 911 if medical symptoms present
3. Ventilate area completely
4. Do not re-enter until safe levels confirmed

### Investigation Procedure
1. Test CO levels with calibrated detector
2. Check all fuel-burning appliances
3. Inspect venting systems
4. Test combustion air supply
5. Check heat exchanger integrity

### Resolution Steps
1. Identify and eliminate CO source
2. Make necessary repairs
3. Test CO levels before restart
4. Install CO detectors if missing
5. Provide customer education

## No Heat Emergency (Winter)

### Rapid Assessment (15 minutes)
1. Check thermostat settings and operation
2. Verify electrical power to unit
3. Check gas supply and pressure
4. Test for obvious safety lockouts
5. Inspect air filter condition

### Diagnostic Sequence
1. Test ignition system operation
2. Check pressure switches
3. Verify proper venting
4. Test flame sensor
5. Check gas valve operation

### Temporary Solutions
1. Space heaters (if safe and adequate power)
2. Temporary furnace repairs
3. Hotel arrangements if necessary
4. Emergency heating unit rental

## Electrical Hazards

### Safety First Protocol
1. Turn off power at breaker
2. Verify power is off with meter
3. Look for signs of arcing or burning
4. Check for water intrusion
5. Document hazardous conditions

### Common Electrical Issues
- Tripped breakers or blown fuses
- Loose or corroded connections
- Water damage to electrical components
- Overloaded circuits
- Improper wiring installations

## Customer Communication

### Arrival Notification
- Call customer upon arrival
- Explain assessment process
- Provide realistic timeframes
- Document emergency conditions

### Progress Updates
- Update every 30 minutes during repair
- Explain what was found
- Discuss repair options and costs
- Get approval before proceeding

### Completion Documentation
- Explain all work performed
- Provide safety recommendations
- Schedule follow-up if needed
- Leave emergency contact information

## Emergency Contact Information

### AfterHours HVAC Emergency Line
- **Phone: (403) 613-6014**
- **Available: 24/7/365**
- **Response: 1-2 hours for Priority 1**

### Utility Emergency Numbers
- **ATCO Gas: 1-800-511-3447**
- **ENMAX: 403-514-6100**
- **Emergency Services: 911**

### After-Hours Parts Suppliers
- Emergency parts hotline available
- 24-hour supplier relationships
- Mobile parts inventory on trucks

## Documentation Requirements

### Every Emergency Call
- Time of call and arrival
- Customer contact information
- Detailed problem description
- Safety hazards identified
- Work performed and materials used
- Customer signature on work order

*Safety is always the top priority in emergency situations*
      `
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-6">
            <BookOpen className="h-5 w-5 text-blue-700 mr-3" />
            <span className="text-blue-800 text-lg font-bold">HVAC Literature</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Documentation</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Comprehensive library of HVAC codes, pricing guides, installation manuals, and Calgary-specific resources.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-lg border-0 bg-white mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search documentation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {literatureCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center gap-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                      {doc.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{doc.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {doc.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {doc.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Separator />
                
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Updated: {doc.lastUpdated}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {doc.content.slice(0, 500)}...
                  </pre>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Document
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card className="shadow-lg border-0 bg-white mt-12">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center">
              <Phone className="h-5 w-5 mr-3" />
              Technical Support
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Documentation Support</h3>
                <p className="text-gray-700 mb-2">
                  Need help with codes, procedures, or technical documentation?
                </p>
                <div className="space-y-1 text-sm">
                  <p><strong>Email:</strong> tech@afterhourshvac.ca</p>
                  <p><strong>Phone:</strong> (403) 613-6014</p>
                  <p><strong>Hours:</strong> Monday-Friday 8AM-6PM</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Document Requests</h3>
                <p className="text-gray-700 mb-2">
                  Request additional documentation or custom guides for your projects.
                </p>
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Custom Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}