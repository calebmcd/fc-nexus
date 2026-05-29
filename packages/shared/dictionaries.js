// Shared static dictionaries extracted from the Tampermonkey userscript.
// Note: The userscript does not import these yet (no build pipeline).

export const FC_ENDPOINTS = {
  list: 'https://admin.faithfulcompanion.com/job/list',
  details: '/job/details/',
  updateStatus: 'https://admin.faithfulcompanion.com/job/updateStatus',
  print: 'https://admin.faithfulcompanion.com/job/print-details/',
};

export const FC_EXPORT_THEME = {
  fontFamily: "'Lexend Deca', sans-serif",
  headerFontSize: '11pt',
  bodyFontSize: '10pt',
  // Padding "Vertical Horizontal"
  summaryPadding: '1.5pt 2.5pt',
  logPadding: '1.5pt 2.5pt',
  rowHeightHeader: '12pt',
  rowHeightBody: '12pt',
  borderThick: '1.5pt solid black',
  borderThin: '0.5pt solid black',
  bgHeader: '#bfbfbf',
  bgEven: '#ededed',
  bgOdd: '#ffffff',
};

export const FC_DEFAULT_SETTINGS = {
  initials: null,
  soundEnabled: true,
  rapidAutoPrint: true,
  commWeightMode: 'size',
  commSWeight: 10,
  commMWeight: 35,
  commLWeight: 70,
  commSummaryFormat: 'split',
  commColorCode: true,
  commPalletCount: 2,
  commExportFormat: 'combined',
  xrayEnabled: true,
  nativePrintEnabled: true,
  searchDays: 60,
  maxCombinedWeight: 3000,
  defaultPosition: 'bottom-right',
  terminalOpacity: 0.95,
  audioVolume: 0.1,
  devMode: false,
  simulateOffline: false,
  commSearchDaysNormal: 7,
  commSearchDaysDeep: 60,
  enableLocalCache: true,
  positions: {
    rapid: { top: null, left: null, width: '480px', height: 'auto' },
    comm: { top: null, left: null, width: '480px', height: 'auto' },
    global: { top: null, left: null, width: '400px', height: 'auto' },
  },
  shortcuts: {
    toggleRapid: 'Alt+R',
    toggleComm: 'Alt+C',
    focusSearch: 'Alt+F',
    closeTerminals: 'Escape',
  },
};

export const FC_CLINIC_ACRONYMS = ['AAE', 'OVRS', 'ARAR', 'GLPE', 'VES', 'VEC', 'AGAR'];

// Kept verbatim from `CONFIG.formatters.clinics` in the userscript (keys are already uppercased there).
export const FC_CLINICS = {
  'WILSON VETERINARY HOSPITAL': 'Wilson Vet Hosp.',
  'WAVERLY ANIMAL HOSPITAL': 'Waverly Vet Hosp.',
  'A REJOYCEFUL ANIMAL RESCUE': 'ARAR',
};

// Kept verbatim from `CONFIG.formatters.clinicMap` in the userscript.
export const FC_CLINIC_MAP = {
  "4 Paws Urgent Care": "4 PAWS UC", "9 Tel Animal Hospital": "9 TEL", "Adrian Animal Clinic": "ADRIAN", "Advanced Animal Emergency": "AAE", "Advanced PetCare of Oakland": "APCO", "Advanced Veterinary Care Group": "AVCG", "Advanced Veterinary Medical Center": "AVMC", "Affiliated Veterinary Emergency Service": "AVES", "Affordable Veterinary Care Center": "AVCC", "Airport Veterinary Hospital": "AIRPORT", "AlfaVet Animal Hospital": "ALFA", "All Creatures Animal Clinic": "ALL CREATURES", "Almont-Dryden Veterinary Clinic": "ALMONT", "Alsager Animal Care Center": "AACC", "Amazing Grace Animal Rescue": "AGAR", "Anchor Bay Veterinary Center": "ABVC", "Angel Paws At Home Dr. Karagosian": "ANG PAWS", "Animal Alley Veterinary Hospital": "ALLEY", "Animal Cancer & Imaging Center": "ACIC", "Animal Friends Veterinary Hospital": "AFVH", "Animal Health Care North Branch": "AHC-NB", "Animal Health Clinic": "AHC-F", "Animal Hospital Maple Orchard": "AHMO", "Animal Hospital of Chesterfield": "AHOC", "Animal Hospital of Flint": "AHOF", "Animal Hospital of Vandercook Lake": "AHVL", "Animal Kingdom Veterinary Hospital": "AKVH", "Animal Medical Center of Troy": "AMC-T", "Animal Medical Center of Van Buren": "AMC-VB", "Animal Surgical Center of Michigan": "ASC", "Animal Urgent Center": "AUC", "Animal Wellness & Medical Center of Oxford": "AWMC OXFORD", "Animal Wellness Center of Troy": "AWC - T", "Ann Arbor Animal Hospital": "AAAH", "Ann Arbor Mobile Vet Dr. Staebler": "AAMV", "Arbor Hills Animal Clinic": "ARBOR HILLS-AA", "Arbor Hills Veterinary Clinic": "ARBOR HILLS-JACKSON", "Arborview Veterinary Clinic": "ARBORVIEW", "Ark Animal Clinic": "ARK-N", "Ark Veterinary Hospital": "ARK", "Auburn Animal Hospital": "AUBURN", "Bad Axe Animal Medical Clinic": "BAD AXE", "Bancroft Veterinary Clinic": "BANCROFT", "Banfield Pet Hospital - Ann Arbor #0695": "BAN-AA", "Banfield Pet Hospital - Brighton #0701": "BAN-BRI", "Banfield Pet Hospital - Chesterfield #0700": "BAN-C", "Banfield Pet Hospital - Lansing #0725": "BAN-LAN", "Banfield Pet Hospital - Livonia #1050": "BAN-LIV", "Banfield Pet Hospital - Northville #0688": "BAN-NV", "Banfield Pet Hospital - Okemos #0724": "BAN-OK", "Banfield Pet Hospital - Rochester Rd #0694": "BAN-ROCH", "Banfield Pet Hospital - Roseville #0685": "BAN-ROSE", "Banfield Pet Hospital - Rossford #1433": "BAN-ROSS", "Banfield Pet Hospital - Southfield Telegraph #5359": "BAN-SF", "Banfield Pet Hospital - Spring Meadows #1434": "BAN-HOL", "Banfield Pet Hospital - Troy #5278": "BAN-TROY", "Banfield Pet Hospital - Utica #0687": "BAN-UTICA", "Banfield Pet Hospital - Woodhaven #1638": "BAN-WOOD", "Baylis Animal Hospital": "BAYLIS", "BC Veterinary Home Care Dr. Barbara Corn": "BCVET", "Bell Veterinary Clinic - Metamora": "BELL-M", "Berkley Animal Clinic": "BAC", "Best Friends Veterinary Hospital": "BFVH", "Bloomfield Animal Hospital": "BAH", "Blue Cross Animal Hospital": "BLUE CROSS", "Breckenridge Veterinary": "BRECK", "Briarpointe Veterinary Clinic": "BRIARPOINTE", "Brookeside Veterinary Hospital": "BROOKSIDE", "Brooklyn Road Veterinary Clinic": "BROOKLYN RD", "Canton Center Animal Hospital": "CCAH", "Caprine & Ewe Veterinary Consulting Dr. Melissa Holahan": "CAPRINE", "Caseville Small Animal Clinic": "CSAC", "Centerline Veterinary Hospital": "CLVH", "Cherry Hill Animal Clinic": "CHAC", "Clarkston Animal Medical Center": "CAMC", "Clio Animal Hospital": "CLIO", "Cobblestone Vet Hospital": "COBBLESTONE", "CodaPet In-Home Euthanasia Dr. Emily Yavaraski": "CODA", "Cole Veterinary Hospital": "COLE", "Colonial Veterinary Clinic": "COLONIAL", "Commerce Animal Hospital": "COMM AH", "Commerce Village Veterinary Hospital": "COMM VILL", "Companion Animal Care Clinic": "CACC", "Companion Animal Hospital": "CAH", "Compassionate Care Animal Hospital": "COMP CARE", "Country Garden Veterinary Clinic": "CGVC", "Creekside Animal Hospital": "CREEKSIDE", "Cross Veterinary Clinic": "CROSS", "Crossroads Animal Hospital & Pet Resort": "CAHPR", "Crossroads Veterinary Hospice Dr. Ellen & Dr. Kender": "CRVH", "Crossroads Veterinary Hospice Dr. Mitchell": "CRVH", "D'Adamo Veterinary Hospital": "D'ADAMO", "Davison Veterinary Integrated Care": "DAVISON", "Dearborn Family Pet Care": "DFPC", "DePorre Veterinary Hospital": "DEPORRE", "Dixboro Veterinary Dental": "DIXBORO", "Dixie Veterinary Hospital": "DIXIE", "Doctor Paws Veterinary Hospital": "DOC PAWS", "Downtown Birmingham Veterinary Clinic": "DTWN BIRM", "Dr. Fitz's Bayside Animal Clinic": "BAYSIDE", "Dr. Jayne’s Veterinary Van Dr. Jayne": "JAYNE", "Dr. Osborne Veterinary Home Care Services Dr. Elena Osborne": "OSBORNE", "Dunckel Veterinary Hospital": "DUNCKEL", "Dundee Veterinary Clinic": "DUNDEE", "East Detroit Animal Hospital": "EDAH", "Eastside Veterinary Hospital": "EASTSIDE", "Emergency Veterinary Hospital": "EVHAA", "Faithful Friends Veterinary Care": "FFVC", "Family Paws Veterinary": "FAM PAWS", "Family Pet Practice": "FPP-W", "Five Mile Animal Hospital": "5 MILE", "Flushing Animal Hospital": "FLUSHING", "Ford Caputo Animal Hospital": "FORD-CAPUTO", "Four Paws Veterinary Wellness Dr. Monica Turenne": "4 PAWS", "Four Seasons Veterinary Services": "FSVH", "Fowlerville Veterinary Clinic": "FOWLER", "Fox Run Animal Hospital": "FRAH", "Frankenmuth-Birch Run Veterinary Hospital": "FBR", "Gasow Veterinary Hospital": "GASOW", "Gibraltar Veterinary Hospital": "GVH", "Goodison Veterinary Center": "GOODISON", "Grand Blanc Veterinary Hospital": "GBVH", "Great Lakes Pet Emergencies": "GLPE", "Greater Lansing Veterinary Center": "GLVC", "Great Oaks Veterinary Clinic": "GOVC", "Griffith Veterinary Hospital": "GRIF", "Hamilton Animal Hospital": "HAMILTON", "Hartrick Veterinary Clinic": "HART", "Harvey Animal Hospital": "HARVEY", "Haslett Animal Hospital": "HASLETT", "Healthy Paws Veterinary Care Center - Livonia": "HPAWS - L", "Healthy Paws Veterinary Hospital - Belleville": "HPAWS - B", "Healthy Paws Veterinary Medical Center - Westland": "HPAWS - W", "Heartstrings Pet Hospice Dr. Heidi Christopher": "HPH-OH", "Heartstrings Pet Hospice Dr. Sarah Hammar Dr. Barbara Daniels": "HPH-FARM", "Heritage Veterinary Hospital": "HERITAGE", "Hidden Spring Veterinary Clinic": "HSVC", "Highland Veterinary Clinic": "HIGHLAND", "Hilton Veterinary Clinic": "HILTON", "Hollow Corners Veterinary Services": "HCVS", "Home Care Veterinary Services Dr. Barlas": "HCVS", "Home Vet Dr. Szwarcman": "HOME VET", "HVC Animal Medical & Surgical Center": "HVC", "Imlay City Veterinary Clinic": "ICVC", "In-Home Veterinary Euthanasia Service - (IVES) Dr. Fish": "IVES", "Jefferson Veterinary Center": "JEFFERSON", "Kibby Park Animal Hospital": "KIBBY", "Kimball Animal Hospital": "KIMBALL", "Kind Farewell Dr. Doreen Cawley": "KIND", "KMP Farm Vets": "KMP", "LaFond Veterinary Hospital": "LAFOND", "Lake Huron Veterinary Clinic": "LHVH", "Lake Orion Veterinary Hospital": "LOVH", "Lakeland Veterinary Dr. Kraut Dr. Spletzer": "LAKELAND", "Lakeville Animal Clinic": "LAKEVILLE", "Lane Animal Hospital": "LANE", "Lap of Love - Dr. Amy": "LOL - AMY", "Lap of Love - Dr. Ashley": "LOL - Ashley", "Lap of Love - Dr. Comstock": "LOL - COMSTOCK", "Lap of Love - Dr. Courtney": "LOL - COURTNEY", "Lap of Love - Dr. Emily": "LOL - EMILY", "Lap of Love - Dr. Hanna": "LOL - HANNA", "Lap of Love - Dr. Kristin": "LOL - KRISTIN", "Lap of Love - Dr. Laura": "LOL - Laura P.", "Lap of Love - Dr. Sarah (Toledo)": "LOL - Sarah", "Lap of Love - Dr. Stacii": "LOL - Stacii", "Legacy Pet Care formerly Dr. Hermann Mobile": "HERMANN", "Levan Road Veterinary Hospital": "LEVAN ROAD", "Lincoln Park Veterinary Hospital": "LINC", "Lisner Animal Hospital": "LISNER", "Little Friends of Ferndale": "LFOF", "Livonia Veterinary Hospital": "LVH", "Long Lake Animal Hospital": "LLAH", "Lyon Veterinary Clinic": "LYON", "M-20 Animal Hospital": "M20", "Mackinaw Veterinary Associates": "MACKINAW", "Macomb Center Veterinary Hospital": "MCVH", "Madison Veterinary Hospital": "MADISON", "Manchester Veterinary Clinic": "MANCHESTER", "Maple Veterinary Hospital": "MAPLE", "Matero Veterinary Services": "MATERO", "Meadowbrook Veterinary Clinic": "MEADOW", "MedVet Commerce": "MEDVET", "MedVet Toledo": "MEDVET TOL", "Metropolitan Veterinary Center": "METRO", "Milford Veterinary Clinic": "MILFORD", "Miller Animal Clinic": "MILLER", "MiVet Animal Clinic": "MIVET", "Morrison Animal Hospital": "MORRISON", "Natural Healing Pet Care": "NHPC", "Nichols Veterinary Clinic": "NICHOLS", "Northern Animal Clinic": "NORTHERN", "North Hills Animal Hospital": "N. HILLS", "North Main Animal Hospital": "NMAH", "Nucci Veterinary Clinic": "NUCCI", "Oakland Animal Hospital": "OAH", "Oakland Hills Veterinary Hospital": "OAK HILLS", "Oakland Veterinary Referral Services": "OVRS", "Orchard Lake Animal Hospital": "OLAH", "Orion Oaks Animal Hospital": "OOAH", "Paint Creek Animal Clinic": "PAINT", "Parker Veterinary Hospital": "PARKER", "Parkway Animal Clinic Ann Arbor": "PARKWAY-AA", "Parkway Small Animal & Exotic Hospital": "PSAEH", "Parkway Veterinary Clinic - Plymouth": "PARK-PLY", "Patterson Dog & Cat Hospital": "PATTERSON", "Peaceful Promise Veterinary Hospice Dr. Cate Szurek": "PPVH", "Pet Alliance In-Home Veterinary Services": "PET ALLIANCE", "PetLove Dentistry & Oral Surgery": "PETLOVE", "Plaza Veterinary Hospital": "PLAZA", "Plymouth Veterinary Hospital": "PLYMOUTH", "Pointe Animal Hospital": "POINTE", "Poppy Hill Vet": "POPPY", "Reliance Animal Hospital": "RELIANCE", "River Rock Animal Hospital": "RRAH", "Roadside Veterinary Clinic": "RVC", "Rochester Veterinary Hospital": "ROCH", "Romeo Veterinary Hospital": "ROMEO", "Roose Animal Hospital": "ROOSE", "Ross Hospital for Animals": "ROSS", "Royal Oak Animal Hospital": "ROAH", "Serenity Animal Hospital": "SERENITY", "Sheehy Animal Hospital": "SHEEHY", "Shelby Veterinary Hospital": "SHELBY", "Snyder Veterinary Clinic": "SNYD", "Somerset Veterinary Hospital": "SOMERSET", "South Arbor Animal Hospital": "SAAH", "South Lyon Animal Clinic": "SLAC", "Southpointe Veterinary Hospital": "SPVH", "Spartan Veterinary Clinic": "SPARTAN", "Stadium Veterinary Services": "STADIUM", "Strong Village Veterinary Center": "STRONG", "Synergy Animal Hospital": "SYNERGY", "Taylor Veterinary Clinic": "TAYLOR", "The Cat Practice": "CAT P", "The Kitty Clinic": "KC", "Thomson Animal Clinic": "THOMSON", "Timberstone Vet": "TIMB", "Town Center Veterinary Associates": "TCVA", "Towne & Country Animal Hospital": "TOWN & COUNTRY", "Trenton Veterinary Hospital": "TVH", "Troy & Heights Animal Hospital": "THAH", "Uptown Veterinary Clinic": "UPTOWN", "Valkyrie Vets Dr. Naomi Fleischmann": "VALKYRIE", "Veterinary Cardiology Consultants - Novi": "VCC", "Veterinary Cardiology Consultants - Rochester": "VCC-R", "Veterinary Care Center of Richmond": "HVCC", "Veterinary Care Specialist": "VCS", "Veterinary Emergency Center": "VEC", "Veterinary Emergency Services-West": "VES-W", "Veterinary Health Center": "VHC", "Veterinary House Calls of West Bloomfield Dr. Andrea Switch": "VHCWB", "Veterinary Urgent Care": "VUC", "Vet On The Run Dr. Burkhart": "VOTR", "Vets2U Dr. Justina Supria": "VETS2U", "VetSelect Animal Hospital of Commerce Twp": "VETSC", "VetSelect Animal Hospital of Dearborn": "VETSD", "VetSelect Animal Hospital of Novi": "VETSN", "Walled Lake Veterinary Hospital": "WLVH", "Warren Animal Clinic": "WAC", "Warren Woods Veterinary Hospital": "WWVH", "Washtenaw Veterinary Hospital": "WASHTENAW", "Waverly Animal Hospital": "WAVERLY", "West Bloomfield Veterinary Hospital": "WBVH", "West Flint Animal Hospital": "WFAH", "Westland Veterinary Hospital": "WESTLAND", "Whittaker Road Animal Clinic": "WRAC", "Whole Life Veterinary Services Dr. Bickel": "WHOLE LIFE", "Williamston Animal Clinic": "WILLIAMSTON", "Willowood Acres Veterinary Clinic": "WILLOW", "Wilson Veterinary Hospital": "WILSON", "Wixom Family Pet Practice": "WFPP", "Woodland Animal Hospital": "WOODLAND", "Wyandotte Animal Hospital": "WYANDOTTE", "A&A Pet Hospital": "AAPH", "Adopt-A-Pet": "ADOPT-A-PET", "All About Animals": "AAA", "Allen Animal Hospital": "ALLEN", "Alpine Animal Hospital": "ALPINE", "Angel Animal Hospital - Farmington Hills": "ANGEL-F", "Angel Animal Hospital - Southgate": "ANGEL-SG", "Animal Advocates Veterinary Hospital": "ADVOCATES", "Animal Care Clinic": "ACC-INK", "Animal Clinic At Oxford Mills": "ACOM", "Animal Clinic East": "ACE", "Animal Clinic of Sterling Heights": "ACoSH", "Animal Emergency Center-Novi": "AEC-N", "Animal Emergency Center-Rochester": "AEC-R", "Animal Emergency Hospital - Flint": "AEH-F", "Animal Medical Center of Lapeer": "ACM-L", "Animal Ready Care Dr. Molina": "ARC", "APAWS Veterinary Hospital": "APAWS", "A-Quality Care Veterinary Hospital": "AQCV", "Arbor Pointe Veterinary Hospital": "APVH", "Ash Veterinary Clinic": "ASH", "Banfield Pet Hospital - Traverse City #0727": "BAN-TC", "Bangor Veterinary Clinic": "BANGOR", "Bay Valley Animal Hospital": "BAY VALLEY", "BetterVet Dr. Jessica Rice & Dr. Bayne": "BETTER VET", "Beverly Hills Veterinary Associates": "BHVA", "Bloom Animal Hospital": "BLOOM", "Blue Paws Animal Hospital": "BLUE PAWS", "BluePearl Veterinary Partners - Ann Arbor": "BPAA", "BluePearl Veterinary Partners - Auburn Hills": "BPAH", "BluePearl Veterinary Partners - Southfield": "BPSF", "Bloomfield Pointe Veterinary Hospital": "BLOOM POINTE", "Brinker Veterinary Hospital": "BRINKER", "Cahill Veterinary Hospital": "CAHILL", "Cameron Medical Center for Animals": "CAMERON", "Care Veterinary Services": "CARE", "Comfort Care Veterinary Services Dr. Zinderman": "DR. Z", "Companion Care Veterinary Hospital": "CCVH", "Dine Veterinary Hospital": "DINE", "Dogwood Veterinary Referral Center": "DOGWOOD", "Dworkis Dog & Cat Hospital": "DWORKIS", "Dr. James Romin": "Romin", "Dr. Terri McCormick": "DR. TERRI", "Eckels": "ECKELS", "Fohey Veterinary Hospital": "FOHEY", "Garden City Veterinary Hospital": "GCVH", "Greenfield Animal Hospital": "GAH", "Healthy Pet Veterinary Hospital": "HEALTHY", "Hilldale Veterinary Hospital": "HILLDALE", "Hometown Veterinary Hospital": "HVH", "Hoover Road Animal Hospital": "HRAH", "I <3 Dogs Rescue and Animal Haven": "I <3 Dogs", "Jeffrey Animal Hospital": "JEFFREY", "Kern Road Veterinary Clinic": "KERN", "Krause Veterinary Clinic": "KRAUSE", "Leader Dogs for the Blind": "LEADER DOGS", "Lilley Veterinary Medical Center": "LVMC", "Mayfair Veterinary Hospital": "MAYFAIR", "Michigan Veterinary Total Health Care": "MVTHC", "Mitten Animal Hospital": "MITTEN", "Monroe SPCA": "MONROE SPCA", "Moore Veterinary Hospital": "MOORE", "Motor City Vet Care Dr. Marcy": "MOTOR CITY", "MSU Veterinary Diagnostic Laboratory": "MSU Diagnostics", "MSU Small Animal Veterinary Medical Center": "MSU", "Nie Family Funeral Home": "NIE", "Northwest Animal Clinic": "NWAC", "Orion Animal Hospital": "ORION", "Oxford Veterinary Hospital": "OXFORD", "Pawsitive Care Affordable Pet Clinic": "PAWSITIVE", "Personalized Veterinary: Behavior & Rehabilitation": "PERSONALIZED", "Pet Care Plus": "PCP", "Pet Urgent Care": "PUC", "Pierson Pet Hospital": "PIERSON", "Plymouth-Beech Animal Hospital": "PLY BEECH", "Pytel Veterinary Clinic": "PYTEL", "Rejoyceful Animal Rescue": "Rejoyceful", "Reed Veterinary Services": "REED", "Reese Veterinary Clinic": "REESE", "Richmond Veterinary Hospital": "RICH", "Riverside Animal Hospital": "RIVERSIDE", "Riverview Animal Hospital": "RIVERVIEW", "Roberts Veterinary Services": "ROBERTS", "Sharp Animal Hospital": "SHARP", "Sheldon Veterinary Hospital": "SHELDON", "Southgate Animal Hospital": "SGATE", "St. Julian's Cat Care": "St. JULIAN", "Thorpe Animal Hospital": "THORPE", "Thumb Veterinary Services": "THUMB", "Towne & Country Animal Hospital Brighton": "TCAH-BRIGHTON", "Towne & Country Animal Hospital Hartland": "TCAH-HARTLAND", "Unleashed Pet Care": "UNLEASHED", "VCA Allen Park Animal Hospital": "VCA-AP", "VCA Brighton Animal Hospital": "VCA-B", "VCA Clinton Twp Animal Hospital": "VCA-CT", "VCA Countryside Animal Hospital of Howell": "VCA-HOWELL", "VCA St. Clair Shores Animal Hospital": "VCA-SCS", "VCA White Lake Animal Hospital": "VCA-WL", "Vetco Total Care": "VETCO/MCLAU", "Veterinary Associates of Port Huron": "VET ASSOCIATES", "Veterinary Medical Center - Howell (Red Barn)": "VMC-H", "VetMED Veterinary Hospital": "VETMED", "Village Animal Healthcare": "VILLAGE", "Wayne Mercy Animal Hospital": "WMAH", "West Warren Veterinary Hospital": "WEST WARREN", "West Woodward Animal Hospital": "WWAH", "Westwood Veterinary Hospital": "WESTWOOD", "Whispering Pines Pet Cemetery": "WPPC", "Woodhaven Animal Hospital": "WOODHAVEN"
};

export const FC_FORMATTERS = {
  acronyms: FC_CLINIC_ACRONYMS,
  clinics: FC_CLINICS,
  clinicMap: FC_CLINIC_MAP,
};

export const FC_KEEPSAKE_CODES = {
  CP: 'Clay Paw',
  IP: 'Ink Paw',
  IN: 'Ink Nose',
  FC: 'Fur Clip',
  PH: 'Photo',
};

// Mirrors the userscript’s keyword -> code mapping (see job detail parsing logic).
export const FC_KEEPSAKE_KEYWORDS = {
  CP: ['clay paw'],
  IP: ['ink paw'],
  IN: ['ink nose'],
  FC: ['fur clip', 'hair clip'],
  PH: ['photo'],
};

