// ==UserScript==
// @name         FC Master Terminal Suite
// @namespace    http://tampermonkey.net/
// @version      13.12
// @description  Unified terminal. Multi-User profiles, dynamic storage, native print, custom shortcuts. Export fixed.
// @author       Caleb McDougall
// @match        *://admin.faithfulcompanion.com/job*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration & Constants ---
    const CONFIG = {
        storage: {
            getKeys: (username) => ({
                RAPID: `fc-rapid-log-${username}`,
                COMM: `fc-comm-log-${username}`,
                SETTINGS: `fc-master-settings-${username}`,
                SYNC: `fc-sync-queue-${username}`
            })
        },
        endpoints: { list: 'https://admin.faithfulcompanion.com/job/list', details: '/job/details/', updateStatus: 'https://admin.faithfulcompanion.com/job/updateStatus', print: 'https://admin.faithfulcompanion.com/job/print-details/' },
        formatters: {
            acronyms: ['AAE', 'OVRS', 'ARAR', 'GLPE', 'VES', 'VEC'],
            clinics: {
                'WILSON VETERINARY HOSPITAL': 'Wilson Vet Hosp.',
                'WAVERLY ANIMAL HOSPITAL': 'Waverly Vet Hosp.',
                'A REJOYCEFUL ANIMAL RESCUE': 'ARAR'
            },
            clinicMap: {
                "4 Paws Urgent Care": "4 PAWS UC", "9 Tel Animal Hospital": "9 TEL", "Adrian Animal Clinic": "ADRIAN", "Advanced Animal Emergency": "AAE", "Advanced PetCare of Oakland": "APCO", "Advanced Veterinary Care Group": "AVCG", "Advanced Veterinary Medical Center": "AVMC", "Affiliated Veterinary Emergency Services": "AVES", "Affordable Veterinary Care Center": "AVCC", "Airport Veterinary Hospital": "AIRPORT", "AlfaVet Animal Hospital": "ALFA", "All Creatures Animal Clinic": "ALL CREATURES", "Almont-Dryden Veterinary Clinic": "ALMONT", "Alsager Animal Care Center": "AACC", "Anchor Bay Veterinary Center": "ABVC", "Angel Paws At Home Dr. Karagosian": "ANG PAWS", "Animal Alley Veterinary Hospital": "ALLEY", "Animal Cancer & Imaging Center": "ACIC", "Animal Friends Veterinary Hospital": "AFVH", "Animal Health Care North Branch": "AHC-NB", "Animal Health Clinic": "AHC-F", "Animal Hospital Maple Orchard": "AHMO", "Animal Hospital of Chesterfield": "AHOC", "Animal Hospital of Flint": "AHOF", "Animal Hospital of Vandercook Lake": "AHVL", "Animal Kingdom Veterinary Hospital": "AKVH", "Animal Medical Center of Troy": "AMC-T", "Animal Medical Center of Van Buren": "AMC-VB", "Animal Surgical Center of Michigan": "ASC", "Animal Urgent Center": "AUC", "Animal Wellness & Medical Center of Oxford": "AWMC OXFORD", "Animal Wellness Center of Troy": "AWC - T", "Ann Arbor Animal Hospital": "AAAH", "Ann Arbor Mobile Vet Dr. Staebler": "AAMV", "Arbor Hills Animal Clinic": "ARBOR HILLS-AA", "Arbor Hills Veterinary Clinic": "ARBOR HILLS-JACKSON", "Arborview Veterinary Clinic": "ARBORVIEW", "Ark Animal Clinic": "ARK-N", "Ark Veterinary Hospital": "ARK", "Auburn Animal Hospital": "AUBURN", "Bad Axe Animal Medical Clinic": "BAD AXE", "Bancroft Veterinary Clinic": "BANCROFT", "Banfield Pet Hospital - Ann Arbor #0695": "BAN-AA", "Banfield Pet Hospital - Brighton #0701": "BAN-BRI", "Banfield Pet Hospital - Chesterfield #0700": "BAN-C", "Banfield Pet Hospital - Lansing #0725": "BAN-LAN", "Banfield Pet Hospital - Livonia #1050": "BAN-LIV", "Banfield Pet Hospital - Northville #0688": "BAN-NV", "Banfield Pet Hospital - Okemos #0724": "BAN-OK", "Banfield Pet Hospital - Rochester Rd #0694": "BAN-ROCH", "Banfield Pet Hospital - Roseville #0685": "BAN-ROSE", "Banfield Pet Hospital - Rossford #1433": "BAN-ROSS", "Banfield Pet Hospital - Southfield Telegraph #5359": "BAN-SF", "Banfield Pet Hospital - Spring Meadows #1434": "BAN-HOL", "Banfield Pet Hospital - Troy #5278": "BAN-TROY", "Banfield Pet Hospital - Utica #0687": "BAN-UTICA", "Banfield Pet Hospital - Woodhaven #1638": "BAN-WOOD", "Baylis Animal Hospital": "BAYLIS", "BC Veterinary Home Care Dr. Barbara Corn": "BCVET", "Bell Veterinary Clinic - Metamora": "BELL-M", "Berkley Animal Clinic": "BAC", "Best Friends Veterinary Hospital": "BFVH", "Bloomfield Animal Hospital": "BAH", "Blue Cross Animal Hospital": "BLUE CROSS", "Breckenridge Veterinary": "BRECK", "Briarpointe Veterinary Clinic": "BRIARPOINTE", "Brookeside Veterinary Hospital": "BROOKSIDE", "Brooklyn Road Veterinary Clinic": "BROOKLYN RD", "Canton Center Animal Hospital": "CCAH", "Caprine & Ewe Veterinary Consulting Dr. Melissa Holahan": "CAPRINE", "Caseville Small Animal Clinic": "CSAC", "Centerline Veterinary Hospital": "CLVH", "Cherry Hill Animal Clinic": "CHAC", "Clarkston Animal Medical Center": "CAMC", "Clio Animal Hospital": "CLIO", "Cobblestone Veterinary Hospital Dr. Karen Pidick": "COBBLESTONE", "CodaPet In-Home Euthanasia Dr. Emily Yavaraski": "CODA", "Cole Veterinary Hospital": "COLE", "Colonial Veterinary Clinic": "COLONIAL", "Commerce Animal Hospital": "COMM AH", "Commerce Village Veterinary Hospital": "COMM VILL", "Companion Animal Care Clinic": "CACC", "Companion Animal Hospital": "CAH", "Compassionate Care Animal Hospital": "COMP CARE", "Country Garden Veterinary Clinic": "CGVC", "Creekside Animal Hospital": "CREEKSIDE", "Cross Veterinary Clinic": "CROSS", "Crossroads Animal Hospital & Pet Resort": "CAHPR", "Crossroads Veterinary Hospice Dr. Ellen & Dr. Kender": "CRVH", "Crossroads Veterinary Hospice Dr. Mitchell": "CRVH", "D'Adamo Veterinary Hospital": "D'ADAMO", "Davison Veterinary Integrated Care": "DAVISON",
                "Dearborn Family Pet Care": "DFPC", "DePorre Veterinary Hospital": "DEPORRE", "Dixboro Veterinary Dental": "DIXBORO", "Dixie Veterinary Hospital": "DIXIE", "Doctor Paws Veterinary Hospital": "DOC PAWS", "Downtown Birmingham Veterinary Clinic": "DTWN BIRM", "Dr. Fitz's Bayside Animal Clinic": "BAYSIDE", "Dr. Jayne’s Veterinary Van Dr. Jayne": "JAYNE", "Dr. Osborne Veterinary Home Care Services Dr. Elena Osborne": "OSBORNE", "Dunckel Veterinary Hospital": "DUNCKEL", "Dundee Veterinary Clinic": "DUNDEE", "East Detroit Animal Hospital": "EDAH", "Eastside Veterinary Hospital": "EASTSIDE", "Emergency Veterinary Hospital": "EVHAA", "Faithful Friends Veterinary Care": "FFVC", "Family Paws Veterinary": "FAM PAWS", "Family Pet Practice": "FPP-W", "Five Mile Animal Hospital": "5 MILE", "Flushing Animal Hospital": "FLUSHING", "Ford Caputo Animal Hospital": "FORD-CAPUTO", "Four Paws Veterinary Wellness Dr. Monica Turenne": "4 PAWS", "Four Seasons Veterinary Services": "FSVH", "Fowlerville Veterinary Clinic": "FOWLER", "Fox Run Animal Hospital": "FRAH", "Frankenmuth-Birch Run Veterinary Hospital": "FBR", "Gasow Veterinary Hospital": "GASOW", "Gibraltar Veterinary Hospital": "GVH", "Goodison Veterinary Center": "GOODISON", "Grand Blanc Veterinary Hospital": "GBVH", "Great Lakes Pet Emergency": "GLPE", "Greater Lansing Veterinary Center": "GLVC", "Great Oaks Veterinary Clinic": "GOVC", "Griffith Veterinary Hospital": "GRIF", "Hamilton Animal Hospital": "HAMILTON", "Hartrick Veterinary Clinic": "HART", "Harvey Animal Hospital": "HARVEY", "Haslett Animal Hospital": "HASLETT", "Healthy Paws Veterinary Care Center - Livonia": "HPAWS - L", "Healthy Paws Veterinary Hospital - Belleville": "HPAWS - B", "Healthy Paws Veterinary Medical Center - Westland": "HPAWS - W", "Heartstrings Pet Hospice Dr. Heidi Christopher": "HPH-OH", "Heartstrings Pet Hospice Dr. Sarah Hammar Dr. Barbara Daniels": "HPH-FARM", "Heritage Veterinary Hospital": "HERITAGE", "Hidden Springs Veterinary Clinic": "HSVC", "Highland Veterinary Clinic": "HIGHLAND", "Hilton Veterinary Clinic": "HILTON", "Hollow Corners Veterinary Services": "HCVS", "Home Care Veterinary Services Dr. Barlas": "HCVS", "Home Vet Dr. Szwarcman": "HOME VET", "HVC Animal Medical & Surgical Center": "HVC", "Imlay City Veterinary Clinic": "ICVC", "In-Home Veterinary Euthanasia Service - (IVES) Dr. Fish": "IVES", "Jefferson Veterinary Center": "JEFFERSON", "Kibby Park Animal Hospital": "KIBBY", "Kimball Animal Hospital": "KIMBALL", "Kind Farewell Dr. Doreen Cawley": "KIND", "KMP Farm Vets": "KMP", "LaFond Veterinary Hospital": "LAFOND", "Lake Huron Veterinary Clinic": "LHVH", "Lake Orion Veterinary Hospital": "LOVH", "Lakeland Veterinary Dr. Kraut Dr. Spletzer": "LAKELAND", "Lakeville Animal Clinic": "LAKEVILLE", "Lane Animal Hospital": "LANE", "Lap of Love - Dr. Amy": "LOL - AMY", "Lap of Love - Dr. Ashley": "LOL - Ashley", "Lap of Love - Dr. Courtney": "LOL - COURTNEY", "Lap of Love - Dr. Emily": "LOL - EMILY", "Lap of Love - Dr. Hanna": "LOL-HANNA", "Lap of Love - Dr. Kristin": "LOL - KRISTIN", "Lap of Love - Dr. Laura": "LOL - Laura P.", "Lap of Love - Dr. Sarah (Toledo)": "LOL - Sarah", "Lap of Love - Dr. Stacii": "LOL - Stacii", "Legacy Pet Care HERMANN": "HERMANN", "Levan Road Veterinary Hospital": "LEVAN ROAD", "Lincoln Park Veterinary Hospital": "LINC", "Lisner Animal Hospital": "LISNER", "Little Friends of Ferndale": "LFOF", "Livonia Veterinary Hospital": "LVH", "Long Lake Animal Hospital": "LLAH", "Lyon Veterinary Clinic": "LYON", "M-20 Animal Hospital": "M20", "Mackinaw Veterinary Associates": "MACKINAW", "Macomb Center Veterinary Hospital": "MCVH", "Madison Veterinary Hospital": "MADISON", "Manchester Veterinary Clinic": "MANCHESTER", "Maple Veterinary Hospital": "MAPLE", "Matero Veterinary Services": "MATERO", "Meadowbrook Veterinary Clinic": "MEADOW", "MedVet Commerce": "MEDVET", "MedVet-Toledo": "MEDVET TOL", "Metropolitan Veterinary Center": "METRO", "Milford Veterinary Clinic": "MILFORD", "Miller Animal Clinic": "MILLER", "MiVet Animal Clinic": "MIVET", "Morrison Animal Hospital": "MORRISON", "Natural Healing Pet Care": "NHPC", "Nichols Veterinary Clinic": "NICHOLS", "Northern Animal Clinic": "NORTHERN", "North Hills Animal Hospital": "N. HILLS", "North Main Animal Hospital": "NMAH", "Nucci Veterinary Clinic": "NUCCI", "Oakland Animal Hospital": "OAH", "Oakland Hills Veterinary Hospital": "OAK HILLS", "Oakland Veterinary Referral Services": "OVRS", "Orchard Lake Animal Hospital": "OLAH", "Orion Oaks Animal Hospital": "OOAH", "Paint Creek Animal Clinic": "PAINT", "Parker Veterinary Hospital": "PARKER", "Parkway Animal Clinic Ann Arbor": "PARKWAY-AA", "Parkway Small Animal & Exotic Hospital": "PSAEH", "Parkway Veterinary Clinic - Plymouth": "PARK-PLY", "Patterson Dog & Cat Hospital": "PATTERSON", "Peaceful Promise Veterinary Hospice Dr. Cate Szurek": "PPVH", "Pet Alliance In-Home Veterinary Services": "PET ALLIANCE", "PetLove Dentistry & Oral Surgery": "PETLOVE", "Plaza Veterinary Hospital": "PLAZA", "Plymouth Veterinary Hospital": "PLYMOUTH", "Pointe Animal Hospital": "POINTE", "Poppy Hill Vet": "POPPY", "Reliance Animal Hospital": "RELIANCE", "River Rock Animal Hospital": "RRAH", "Roadside Veterinary Clinic": "RVC", "Rochester Veterinary Hospital": "ROCH", "Romeo Veterinary Hospital": "ROMEO", "Roose Animal Hospital": "ROOSE", "Ross Hospital for Animals": "ROSS", "Royal Oak Animal Hospital": "ROAH", "Serenity Animal Hospital": "SERENITY", "Sheehy Animal Hospital": "SHEEHY", "Shelby Veterinary Hospital": "SHELBY", "Snyder Veterinary Clinic": "SNYD", "Somerset Veterinary Hospital": "SOMERSET", "South Arbor Animal Hospital": "SAAH", "South Lyon Animal Clinic": "SLAC", "Southpointe Veterinary Hospital": "SPVH", "Spartan Veterinary Clinic": "SPARTAN", "Stadium Veterinary Services": "STADIUM", "Strong Village Veterinary Center": "STRONG", "Synergy Animal Hospital": "SYNERGY", "Taylor Veterinary Clinic": "TAYLOR", "The Cat Practice": "CAT P", "The Kitty Clinic": "KC", "Thomson Animal Clinic": "THOMSON", "Timberstone Vet": "TIMB", "Town Center Veterinary Associates": "TCVA", "Towne & Country Animal Hospital": "TOWN & COUNTRY", "Trenton Veterinary Hospital": "TVH", "Troy & Heights Animal Hospital": "THAH", "Uptown Veterinary Clinic": "UPTOWN", "Valkyrie Vets Dr. Naomi Fleischmann": "VALKYRIE", "Veterinary Cardiology Consultants - Novi": "VCC", "Veterinary Cardiology Consultants - Rochester": "VCC-R", "Veterinary Care Center of Richmond": "HVCC", "Veterinary Care Specialist": "VCS", "Veterinary Emergency Center": "VEC", "Veterinary Emergency Services - West": "VES-W", "Veterinary Health Center": "VHC", "Veterinary House Calls of West Bloomfield Dr. Andrea Switch": "VHCWB", "Veterinary Urgent Care": "VUC", "Vet On The Run Dr. Burkhart": "VOTR", "Vets2U Dr. Justina Supria": "VETS2U", "VetSelect Animal Hospital of Commerce Twp": "VETSC", "VetSelect Animal Hospital of Dearborn": "VETSD", "VetSelect Animal Hospital of Novi": "VETSN", "Walled Lake Veterinary Hospital": "WLVH", "Warren Animal Clinic": "WAC", "Warren Woods Veterinary Hospital": "WWVH", "Washtenaw Veterinary Hospital": "WASHTENAW", "Waverly Animal Hospital": "WAVERLY", "West Bloomfield Veterinary Hospital": "WBVH", "West Flint Animal Hospital": "WFAH", "Westland Veterinary Hospital": "WESTLAND", "Whittaker Road Animal Clinic": "WRAC", "Whole Life Veterinary Services Dr. Bickel": "WHOLE LIFE", "Williamston Animal Clinic": "WILLIAMSTON", "Willowood Acres Veterinary Clinic": "WILLOW", "Wilson Veterinary Hospital": "WILSON", "Wixom Family Pet Practice": "WFPP", "Woodland Animal Hospital": "WOODLAND", "Wyandotte Animal Hospital": "WYANDOTTE", "A&A Pet Hospital": "AAPH", "Adopt-A-Pet": "ADOPT-A-PET", "All About Animals": "AAA", "Allen Animal Hospital": "ALLEN", "Alpine Animal Hospital": "ALPINE", "Angel Animal Hospital - Farmington Hills": "ANGEL-F", "Angel Animal Hospital - Southgate": "ANGEL-SG", "Animal Advocates Veterinary Hospital": "ADVOCATES", "Animal Care Clinic": "ACC-INK", "Animal Clinic At Oxford Mills": "ACOM", "Animal Clinic East": "ACE", "Animal Clinic of Sterling Heights": "ACoSH", "Animal Emergency Center-Novi": "AEC-N", "Animal Emergency Center-Rochester": "AEC-R", "Animal Emergency Hospital - Flint": "AEH-F", "Animal Medical Center of Lapeer": "ACM-L", "Animal Ready Care Dr. Molina": "ARC", "APAWS Veterinary Hospital": "APAWS", "A-Quality Care Veterinary Hospital": "AQCV", "Arbor Pointe Veterinary Hospital": "APVH", "Ash Veterinary Clinic": "ASH", "Banfield Pet Hospital - Traverse City #0727": "BAN-TC", "Bangor Veterinary Clinic": "BANGOR", "Bay Valley Animal Hospital": "BAY VALLEY", "BetterVet Dr. Jessica Rice & Dr. Bayne": "BETTER VET", "Beverly Hills Veterinary Associates": "BHVA", "Bloom Animal Hospital": "BLOOM", "Blue Paws Animal Hospital": "BLUE PAWS", "BluePearl Veterinary Partners - Ann Arbor": "BPAA", "BluePearl Veterinary Partners - Auburn Hills": "BPAH", "BluePearl Veterinary Partners - Southfield": "BPSF", "Bloomfield Pointe Veterinary Hospital": "BLOOM POINTE", "Brinker Veterinary Hospital": "BRINKER", "Cahill Veterinary Hospital": "CAHILL", "Cameron Medical Center for Animals": "CAMERON", "Care Veterinary Services": "CARE", "Comfort Care Veterinary Services Dr. Zinderman": "DR. Z", "Companion Care Veterinary Hospital": "CCVH", "Dine Veterinary Hospital": "DINE", "Dogwood Veterinary Referral Center": "DOGWOOD", "Dworkis Dog & Cat Hospital": "DWORKIS", "Dr. James Romin": "Romin", "Dr. Terri McCormick": "DR. TERRI", "Eckels": "ECKELS", "Fohey Veterinary Hospital": "FOHEY", "Garden City Veterinary Hospital": "GCVH", "Greenfield Animal Hospital": "GAH", "Healthy Pet Veterinary Hospital": "HEALTHY", "Hilldale Veterinary Hospital": "HILLDALE", "Hometown Veterinary Hospital": "HVH", "Hoover Road Animal Hospital": "HRAH", "I <3 Dogs Rescue and Animal Haven": "I <3 Dogs", "Jeffrey Animal Hospital": "JEFFREY", "Kern Road Veterinary Clinic": "KERN", "Krause Veterinary Clinic": "KRAUSE",
                "Leader Dogs for the Blind": "LEADER DOGS", "Lilley Veterinary Medical Center": "LVMC", "Mayfair Veterinary Hospital": "MAYFAIR", "Michigan Veterinary Total Health Care": "MVTHC", "Mitten Animal Hospital": "MITTEN", "Monroe SPCA": "MONROE SPCA", "Moore Veterinary Hospital": "MOORE", "Motor City Vet Care Dr. Marcy": "MOTOR CITY", "MSU Veterinary Diagnostic Laboratory": "MSU Diagnostics", "MSU Small Animal Veterinary Medical Center": "MSU", "Nie Family Funeral Home": "NIE", "Northwest Animal Clinic": "NWAC", "Orion Animal Hospital": "ORION", "Oxford Veterinary Hospital": "OXFORD", "Pawsitive Care Affordable Pet Clinic": "PAWSITIVE", "Personalized Veterinary: Behavior & Rehabilitation": "PERSONALIZED", "Pet Care Plus": "PCP", "Pet Urgent Care": "PUC", "Pierson Pet Hospital": "PIERSON", "Plymouth-Beech Animal Hospital": "PLY BEECH", "Pytel Veterinary Clinic": "PYTEL", "Rejoyceful Animal Rescue": "Rejoyceful", "Reed Veterinary Services": "REED", "Reese Veterinary Clinic": "REESE", "Richmond Veterinary Hospital": "RICH", "Riverside Animal Hospital": "RIVERSIDE", "Riverview Animal Hospital": "RIVERVIEW", "Roberts Veterinary Services": "ROBERTS", "Sharp Animal Hospital": "SHARP", "Sheldon Veterinary Hospital": "SHELDON", "Southgate Animal Hospital": "SGATE", "St. Julian's Cat Care": "St. JULIAN", "Thorpe Animal Hospital": "THORPE", "Thumb Veterinary Services": "THUMB", "Unleashed Pet Care": "UNLEASHED", "VCA Allen Park Animal Hospital": "VCA-AP", "VCA Brighton Animal Hospital": "VCA-B", "VCA Clinton Twp Animal Hospital": "VCA-CT", "VCA Countryside Animal Hospital of Howell": "VCA-HOWELL", "VCA St. Clair Shores Animal Hospital": "VCA-SCS", "VCA White Lake Animal Hospital": "VCA-WL", "Vetco Total Care": "VETCO/MCLAU", "Veterinary Associates of Port Huron": "VET ASSOCIATES", "Veterinary Medical Center - Howell (Red Barn)": "VMC-H", "VetMED Veterinary Hospital": "VETMED", "Village Animal Healthcare": "VILLAGE", "Wayne Mercy Animal Hospital": "WMAH", "West Warren Veterinary Hospital": "WEST WARREN", "West Woodward Animal Hospital": "WWAH", "Westwood Veterinary Hospital": "WESTWOOD", "Whispering Pines Pet Cemetery": "WPPC", "Woodhaven Animal Hospital": "WOODHAVEN"
            }
        },

        defaultSettings: {
            initials: null, soundEnabled: true, rapidAutoPrint: true, commWeightMode: 'size', commSWeight: 10, commMWeight: 35, commLWeight: 70, commSummaryFormat: 'split', commColorCode: true, commPalletCount: 2, commExportFormat: 'combined', xrayEnabled: true, nativePrintEnabled: true, searchDays: 60, maxCombinedWeight: 3000, defaultPosition: 'bottom-right', terminalOpacity: 0.95, audioVolume: 0.1, devMode: false, simulateOffline: false,
            positions: { rapid: { top: null, left: null, width: '480px', height: 'auto' }, comm: { top: null, left: null, width: '480px', height: 'auto' }, global: { top: null, left: null, width: '400px', height: 'auto' } },
            shortcuts: { toggleRapid: 'Alt+R', toggleComm: 'Alt+C', focusSearch: 'Alt+F', closeTerminals: 'Escape' }
        }
    };

    // --- State Management ---
    const State = {
        currentUser: null, rapidLog: [], commLog: [], syncQueue: [], activePallet: 1, settings: { ...CONFIG.defaultSettings }, xrayCache: {}, viewAllRapid: false, viewAllComm: false,
        load() {
            try {
                const keys = CONFIG.storage.getKeys(this.currentUser);
                const rLog = localStorage.getItem(keys.RAPID); if (rLog) this.rapidLog = JSON.parse(rLog);
                const cLog = localStorage.getItem(keys.COMM); if (cLog) this.commLog = JSON.parse(cLog);
                const sQueue = localStorage.getItem(keys.SYNC); if (sQueue) this.syncQueue = JSON.parse(sQueue);
                const s = localStorage.getItem(keys.SETTINGS);
                if (s) { const ps = JSON.parse(s); this.settings = { ...this.settings, ...ps, positions: { rapid: { ...this.settings.positions.rapid, ...(ps.positions?.rapid || {}) }, comm: { ...this.settings.positions.comm, ...(ps.positions?.comm || {}) }, global: { ...this.settings.positions.global, ...(ps.positions?.global || {}) } }, shortcuts: { ...this.settings.shortcuts, ...(ps.shortcuts || {}) } }; }

                // Smart Initials Generator
                if (!this.settings.initials) {
                    if (!this.currentUser || this.currentUser === 'Shared') {
                        this.settings.initials = 'FC';
                    } else {
                        const parts = this.currentUser.split('_');
                        const first = parts[0] ? parts[0].charAt(0).toUpperCase() : '';
                        const last = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : '';
                        this.settings.initials = (first + last) || 'FC';
                    }
                    this.saveSettings();
                }
            } catch (e) { console.error('[FC Terminal] Load error:', e); }
        },
        saveSettings() { const keys = CONFIG.storage.getKeys(this.currentUser); localStorage.setItem(keys.SETTINGS, JSON.stringify(this.settings)); App.XRay.applyState(); App.NativePrint.applyState(); },
        saveRapid() { const keys = CONFIG.storage.getKeys(this.currentUser); localStorage.setItem(keys.RAPID, JSON.stringify(this.rapidLog)); },
        saveComm() { const keys = CONFIG.storage.getKeys(this.currentUser); localStorage.setItem(keys.COMM, JSON.stringify(this.commLog)); },
        saveSync() { const keys = CONFIG.storage.getKeys(this.currentUser); localStorage.setItem(keys.SYNC, JSON.stringify(this.syncQueue)); this.updateSyncUI(); },
        updateSyncUI() { const badge = document.getElementById('fc-sync-badge'); if (badge) { badge.style.display = this.syncQueue.length > 0 ? 'block' : 'none'; badge.title = `${this.syncQueue.length} job(s) pending network sync`; } }
    };

    // --- Utility / Helpers ---
    const Utils = {
        stripHtml(html) { const tmp = document.createElement('div'); tmp.innerHTML = html || ''; return tmp.textContent.trim(); },
        getFilterDateRange() { const d = new Date(), fmt = date => `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()}`; const end = fmt(d); d.setDate(d.getDate() - (State.settings.searchDays || 60)); return `${fmt(d)} - ${end}`; },
        buildDataTablesPayload(searchTerm, isClosed) {
            const params = new URLSearchParams({ draw: 1, start: 0, length: 20, 'search[value]': searchTerm, 'search[regex]': false, job_filter_order: 0, job_filter_status_id: 0, job_filter_type_id: 0, job_filter_period: this.getFilterDateRange(), show_completed_orders: isClosed.toString(), 'order[0][column]': 4, 'order[0][dir]': 'DESC' });
            for (let i = 0; i <= 13; i++) { params.append(`columns[${i}][data]`, i); params.append(`columns[${i}][name]`, ''); params.append(`columns[${i}][searchable]`, (i !== 2).toString()); params.append(`columns[${i}][orderable]`, (i !== 2 && i !== 13).toString()); params.append(`columns[${i}][search][value]`, ''); params.append(`columns[${i}][search][regex]`, 'false'); }
            return params.toString();
        },
        async copyToClipboard(html, text, successBtnId) {
            try { if (navigator.clipboard && window.ClipboardItem) { await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })]); } else { await navigator.clipboard.writeText(text); }
                const btn = document.getElementById(successBtnId); if (btn) { const old = btn.innerText; btn.innerText = 'Copied!'; setTimeout(() => btn.innerText = old, 2000); }
            } catch (err) { alert('Failed to copy. Check permissions.'); }
        },
        toTitleCase(str) {
            return str.replace(/\w\S*/g, txt => {
                const upper = txt.toUpperCase();
                if (CONFIG.formatters.acronyms.includes(upper)) return upper;
                if (!/[aeiouy]/i.test(txt)) return upper;
                return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
            });
        },
        formatPet(name) { return this.toTitleCase(name); },
        formatFamily(name) {
            if (!name) return '';

            // Priority 1: Check if the family name is actually a clinic in the dictionary
            const match = this.suggestClinicAcronym(name);
            if (match) return match.acronym;

            const lower = name.toLowerCase();

            // Priority 2: Check for unknown clinics and route to standard clinic truncation
            if (/(clinic|hospital|veterinary|vet)/.test(lower)) return this.formatClinic(name);

            // Priority 3: Check for rescues/organizations and preserve the full Title Case name
            if (/(rescue|society|animal|fund|county|shelter|sanctuary|foundation|league|project|trust|network)/.test(lower)) return this.toTitleCase(name);

            // Priority 4: Standard family names (truncate to the last word)
            const parts = name.trim().split(' ');
            return this.toTitleCase(parts[parts.length - 1]);
        },
        formatClinic(name) {
            if (!name) return '';

            // Priority 1: Check the dictionary via safe fuzzy matching
            const match = this.suggestClinicAcronym(name);
            if (match) return match.acronym;

            // Priority 2: Fallback exact match and truncation rules
            const upper = name.toUpperCase().trim();
            if (CONFIG.formatters.clinics && CONFIG.formatters.clinics[upper]) return CONFIG.formatters.clinics[upper];
            let n = this.toTitleCase(name);
            return n.replace(/Veterinary/g, 'Vet').replace(/Hospital/g, 'Hosp.').replace(/Animal/g, 'Anim.').replace(/Center/g, 'Ctr.');
        },
        suggestClinicAcronym(userInput) {
            if (!userInput) return null;
            const cleanStr = (str) => {
                return str.replace(/[.,\-\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                          .toLowerCase()
                          .split(/\s+/)
                          .filter(w => !['veterinary', 'vet', 'animal', 'anim', 'hospital', 'hosp', 'clinic', 'center', 'ctr', 'care', 'services', 'inc', 'llc', 'of'].includes(w))
                          .join(' ')
                          .trim();
            };
            const inputClean = cleanStr(userInput);
            if (!inputClean) return null;

            for (const [fullName, acronym] of Object.entries(CONFIG.formatters.clinicMap)) {
                if (userInput.toUpperCase().trim() === acronym.toUpperCase()) return null; // Already using acronym
                if (cleanStr(fullName) === inputClean) {
                    return { original: fullName, acronym: acronym };
                }
            }
            return null;
        }
    };

    // --- Audio Service ---
    const AudioService = {
        ctx: null,
        play(type) {
            if (!State.settings.soundEnabled) return;
            if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator(), gain = this.ctx.createGain(), now = this.ctx.currentTime;
            const vol = State.settings.audioVolume;
            osc.connect(gain); gain.connect(this.ctx.destination);

            if (type === 'found') { osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); gain.gain.setValueAtTime(vol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
            else if (type === 'success') { osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, now); osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); gain.gain.setValueAtTime(vol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3); osc.start(now); osc.stop(now + 0.3); }
            else if (type === 'alert') { osc.type = 'square'; osc.frequency.setValueAtTime(300, now); gain.gain.setValueAtTime(vol, now); gain.gain.setValueAtTime(0, now + 0.1); gain.gain.setValueAtTime(vol, now + 0.15); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3); osc.start(now); osc.stop(now + 0.3); }
        }
    };

    // --- API Service ---
    const API = {
        async searchJobs(searchTerm, primaryStatus, secondaryStatus) {
            let p1 = Utils.buildDataTablesPayload(searchTerm, primaryStatus);
            let res1 = await fetch(CONFIG.endpoints.list, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest" }, body: p1 });
            let data1 = await res1.json(); let rows = data1.data || [];
            if (rows.length === 0) {
                let p2 = Utils.buildDataTablesPayload(searchTerm, secondaryStatus);
                let res2 = await fetch(CONFIG.endpoints.list, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest" }, body: p2 });
                let data2 = await res2.json(); rows = data2.data || [];
            }
            const unique = [], seen = new Set();
            rows.forEach(r => {
                const match = r[0].match(/\/job\/details\/(\d+)/);
                if (match && !seen.has(match[1])) {
                    seen.add(match[1]); const clinicMatch = (r[6] || '').match(/data-content="([^"]+)"/);
                    unique.push({ jobId: match[1], reqId: Utils.stripHtml(r[0]), cremId: Utils.stripHtml(r[3]), type: Utils.stripHtml(r[5]), clinic: clinicMatch ? clinicMatch[1] : Utils.stripHtml(r[6]), family: Utils.stripHtml(r[7]), pet: Utils.stripHtml(r[8]) });
                }
            });
            return unique.filter(m => m.reqId.toLowerCase().includes(searchTerm.toLowerCase()) || m.cremId.toLowerCase().includes(searchTerm.toLowerCase()) || m.pet.toLowerCase().includes(searchTerm.toLowerCase()) || m.family.toLowerCase().includes(searchTerm.toLowerCase()) || m.clinic.toLowerCase().includes(searchTerm.toLowerCase()));
        },
        async getJobDetailsHTML(jobId) { const res = await fetch(`${CONFIG.endpoints.details}${jobId}`); if (!res.ok) throw new Error('Network error'); return await res.text(); },
        async checkInJob(jobId, fromSync = false) {
            try {
                if (State.settings.simulateOffline) throw new Error('Simulated Offline');
                const res = await fetch(CONFIG.endpoints.updateStatus, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest" }, body: `job_id=${jobId}&status_id=5&is_batched=0` });
                if (!res.ok) throw new Error(`HTTP Error ${res.status}`); return res;
            } catch (err) {
                if (!fromSync) { if (!State.syncQueue.includes(jobId)) { State.syncQueue.push(jobId); State.saveSync(); } return { ok: true, queued: true }; }
                throw err;
            }
        }
    };

    // --- UI Construction ---
    const UI = {
        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `#fc-master-wrapper{font-family:Arial,sans-serif;box-sizing:border-box}#fc-toggle-dock{position:fixed;bottom:32px;right:77px;display:flex;gap:12px;z-index:10000}.fc-dock-btn{height:45px;color:#fff;border:none;border-radius:25px;padding:0 20px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,.4);transition:all .2s;display:flex;align-items:center;justify-content:center}.fc-sync-badge{position:absolute;top:-5px;right:-5px;width:14px;height:14px;background-color:#ffb800;border:2px solid #1e1e1e;border-radius:50%;display:none;z-index:10001;animation:pulse-amber 2s infinite}@keyframes pulse-amber{0%{box-shadow:0 0 0 0 rgba(255,184,0,.7)}70%{box-shadow:0 0 0 6px rgba(255,184,0,0)}100%{box-shadow:0 0 0 0 rgba(255,184,0,0)}}#rapid-toggle-btn{background:#8c0101}#rapid-toggle-btn.active,#rapid-toggle-btn:hover{background:#a30101;transform:scale(1.05)}#rapid-term{border:2px solid #8c0101}#rapid-term .fc-term-header h3{color:#8c0101}#rapid-term .fc-action-btn,#rapid-term .fc-toggle-btn.active{background:#8c0101;color:#fff}#rapid-term .fc-action-btn:hover{background:#a30101}#rapid-input:focus,#rapid-term .fc-manual-input:focus{border-color:#8c0101}#rapid-tiebreaker-list .fc-tie-btn:hover{background:#8c0101;border-color:#ff6b6b}#comm-toggle-btn{background:#014a8c}#comm-toggle-btn.active,#comm-toggle-btn:hover{background:#0261b8;transform:scale(1.05)}#comm-term{border:2px solid #014a8c}#comm-term .fc-term-header h3{color:#3498db}#comm-term .fc-action-btn,#comm-term .fc-toggle-btn.active{background:#014a8c;color:#fff}#comm-term .fc-action-btn:hover{background:#2980b9}#comm-input:focus,#comm-term .fc-manual-input:focus{border-color:#3498db}#comm-tiebreaker-list .fc-tie-btn:hover{background:#014a8c;border-color:#3498db}.fc-term-panel{position:fixed;bottom:87px;right:77px;z-index:10000;background:#1e1e1e;color:#eee;border-radius:8px;padding:15px;box-shadow:0 8px 20px rgba(0,0,0,.5);width:480px;display:none;resize:both;overflow:hidden;min-width:400px;min-height:200px;max-height:90vh}.fc-term-header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #444;margin-bottom:10px;padding-bottom:5px;cursor:move;user-select:none}.fc-term-header h3{margin:0;font-size:16px;text-transform:uppercase;pointer-events:none}.fc-header-controls{display:flex;gap:10px;align-items:center;cursor:default}.fc-icon-btn{background:0 0;border:none;color:#888;font-size:16px;font-weight:700;cursor:pointer;padding:0;line-height:1;transition:color .2s}.fc-icon-btn:hover{color:#fff}.fc-input-row{display:flex;gap:10px;margin-bottom:10px}.fc-main-input,.fc-manual-input,.fc-weight-input{padding:10px;font-size:14px;font-weight:700;background:#111;color:#fff;border:1px solid #444;border-radius:4px;box-sizing:border-box}.fc-main-input{flex:3;width:100%}.fc-weight-input{display:none;flex:1;text-align:center}.fc-main-input:focus,.fc-weight-input:focus{outline:0;border-color:#aaa}@keyframes fc-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}.fc-shake{animation:fc-shake .3s ease-in-out;border-color:#ff6b6b!important}.fc-status-text{font-size:12px;color:#aaa;margin-bottom:10px;min-height:15px}.fc-confirm-box{display:none;background:#2a2a2a;border:1px solid #555;padding:10px;border-radius:4px;margin-bottom:10px;font-size:13px;line-height:1.5}.fc-confirm-label{color:#aaa;font-weight:700;display:inline-block;width:75px;vertical-align:top}.fc-confirm-val{color:#fff;display:inline-block;width:355px;word-wrap:break-word}.fc-confirm-warn{color:#ffd93d;font-weight:700;margin-top:8px;border-top:1px dashed #555;padding-top:8px;text-align:center}.fc-capacity-container{width:100%;height:6px;background:#222;border-radius:3px;overflow:hidden;border:1px solid #444;margin:12px 0 4px}.fc-capacity-bar{height:100%;width:0;transition:width .3s ease,background-color .3s ease}.fc-capacity-text{font-size:11px;color:#888;text-align:right;margin-bottom:10px}.fc-tiebreaker-list{display:none;margin-bottom:10px;max-height:250px;overflow-y:auto;padding-right:5px;border:1px solid #333;padding:5px;border-radius:4px;background:#111}.fc-tiebreaker-list::-webkit-scrollbar,.fc-log-container::-webkit-scrollbar{width:6px}.fc-tiebreaker-list::-webkit-scrollbar-thumb,.fc-log-container::-webkit-scrollbar-thumb{background:#555;border-radius:3px}.fc-tie-btn{width:100%;text-align:left;background:#2a2a2a;color:#fff;border:1px solid #555;padding:10px;border-radius:4px;cursor:pointer;margin-bottom:5px;transition:background .2s}.fc-tie-clinic{color:#aaa;font-size:11px;margin-top:4px;font-style:italic;border-top:1px solid #444;padding-top:4px}.fc-log-container{background:#111;border:1px solid #444;padding:5px;font-size:11px;margin-bottom:10px;display:none;max-height:250px;overflow-y:auto;overscroll-behavior:contain}.fc-log-entry{border-bottom:1px solid #333;padding:4px 0;display:flex;justify-content:space-between;align-items:center;position:relative;padding-right:65px;}.fc-log-entry:last-child{border-bottom:none}.fc-log-actions{position:absolute;right:0;top:50%;transform:translateY(-50%);display:none;gap:6px;}.fc-log-entry:hover .fc-log-actions{display:flex;}.fc-action-icon{cursor:pointer;opacity:0.7;font-size:12px;background:none;border:none;padding:0;}.fc-action-icon:hover{opacity:1;}.fc-action-icon[disabled]{opacity:0.2;cursor:not-allowed;}.fc-view-all-btn{background:none;border:none;color:#3498db;cursor:pointer;text-decoration:underline;font-size:11px;padding:5px 0;width:100%;text-align:center;}.fc-view-all-btn:hover{color:#5dade2;}.fc-btn-row{display:flex;gap:5px;margin-top:5px}.fc-action-btn,.fc-action-btn-clear,.fc-action-btn-copy{border:none;padding:10px;font-weight:700;cursor:pointer;border-radius:4px;text-align:center;flex:1.5;color:#fff}.fc-action-btn-copy{color:#000;background:#2ecc71}.fc-action-btn-copy:hover{background:#27ae60}.fc-action-btn-clear{flex:1;background:#444}.fc-action-btn-clear:hover{background:#ff6b6b;color:#000}.fc-sub-view{display:none;background:#111;border:1px solid #444;padding:15px;border-radius:6px;margin-bottom:10px;max-height:60vh;overflow-y:auto;overscroll-behavior:contain}.fc-sub-view::-webkit-scrollbar{width:6px}.fc-sub-view::-webkit-scrollbar-thumb{background:#555;border-radius:3px}.fc-setting-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:13px;color:#ccc}.fc-setting-input{background:#222;color:#fff;border:1px solid #555;padding:5px;border-radius:3px;text-align:center;font-weight:700}.fc-weight-setup-input{background:#222;color:#fff;border:1px solid #555;padding:5px;border-radius:3px;text-align:center;font-weight:700;width:60px;margin-right:5px}.fc-manual-row{display:flex;flex-direction:column;margin-bottom:10px}.fc-manual-row label{font-size:12px;color:#ccc;margin-bottom:4px;font-weight:700}.fc-manual-input{background:#222;color:#fff;border:1px solid #555;padding:8px;border-radius:4px;font-size:14px}.fc-toggle-row{display:flex;gap:10px;margin-bottom:10px}.fc-toggle-group{display:flex;flex:1;background:#111;border:1px solid #444;border-radius:4px;overflow:hidden}.fc-toggle-btn{flex:1;background:0 0;color:#888;border:none;padding:8px 0;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s}.fc-toggle-btn:hover{background:#2a2a2a;color:#fff}.fc-help-wrapper{position:relative;display:inline-block}.fc-help-wrapper:hover .fc-help-tooltip{display:block}.fc-help-tooltip{display:none;position:absolute;top:120%;right:0;background:#2a2a2a;border:1px solid #555;padding:12px;border-radius:6px;width:170px;z-index:10005;font-size:13px;color:#eee;box-shadow:0 4px 15px rgba(0,0,0,.6);text-align:left;font-weight:400;line-height:1.6}.fc-help-tooltip strong{color:#ffd93d;font-size:14px;display:block;border-bottom:1px solid #444;padding-bottom:4px;margin-bottom:6px}.fc-help-tooltip b{color:#3498db}#fc-xray-tooltip{position:fixed;display:none;z-index:10000;background:#1e1e1e;color:#eee;border:1px solid #444;border-radius:6px;padding:12px;box-shadow:0 4px 15px rgba(0,0,0,.4);width:350px;font-size:13px;line-height:1.4;transition:pointer-events .1s;pointer-events:none}#fc-xray-tooltip h4{margin:0 0 8px;color:#ff6b6b;font-size:14px;border-bottom:1px solid #444;padding-bottom:4px}.fc-xray-row{margin-bottom:6px;word-wrap:break-word}.fc-xray-label{font-weight:700;color:#aaa}#fc-import-file{display:none}.fc-native-print-btn{position:absolute;right:5px;top:50%;transform:translateY(-50%);background:#3498db;color:#fff;border:none;border-radius:4px;padding:4px 6px;cursor:pointer;display:none;z-index:10;font-size:12px;box-shadow:0 2px 5px rgba(0,0,0,.2)}.fc-native-print-btn:hover{background:#2980b9}body.fc-native-print-active tr[role="row"]:hover .fc-native-print-btn{display:inline-block}
            .fc-shortcut-input{cursor:pointer; text-align:center; transition: background 0.2s, border-color 0.2s;}
            .fc-shortcut-input:hover{background:#333; border-color:#3498db;}
            .fc-shortcut-input.listening{background:#ffb800; color:#000; border-color:#fff;}
            `;
            document.head.appendChild(style);
        },

        injectDOM() {
            const wrapper = document.createElement('div');
            wrapper.id = 'fc-master-wrapper';
            wrapper.innerHTML = `<div id="fc-toggle-dock"><div id="fc-sync-badge" class="fc-sync-badge" title="0 jobs pending"></div><button id="global-settings-btn" class="fc-dock-btn" style="background:#5a5a5a; font-size:18px;" title="Global Settings">⚙️</button><button id="rapid-toggle-btn" class="fc-dock-btn">Communal Check-In</button><button id="comm-toggle-btn" class="fc-dock-btn">Communal Cremation</button></div><input type="file" id="fc-import-file" accept=".json">
            <div id="global-settings-panel" class="fc-term-panel" style="display:none; top:50%; left:50%; transform:translate(-50%, -50%); width:400px; bottom:auto; right:auto; z-index:10010;">
                <div class="fc-term-header"><h3 id="global-settings-header" style="cursor:pointer; pointer-events:auto; display:flex; align-items:center;" title="Tap 5 times to unlock Developer Mode">Global Settings <span id="fc-active-user-badge" style="font-size: 11px; background: #3498db; color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 10px; pointer-events: none;"></span></h3><div class="fc-header-controls"><button id="global-reset-btn" class="fc-icon-btn" title="Reset Position" style="font-size:18px;">⟲</button><button id="global-minimize-btn" class="fc-icon-btn">—</button></div></div>
                <div id="global-settings-main" class="fc-sub-view" style="display:block; max-height: 70vh; overflow-y: auto;">
                    <div class="fc-btn-row" style="margin-bottom: 15px;"><button id="global-export-btn" class="fc-action-btn-copy" style="background:#3498db; color:#fff;">Export Backup</button><button id="global-import-btn" class="fc-action-btn" style="background:#e67e22;">Import Backup</button></div>
                    <div class="fc-setting-row"><label>Your Initials:</label><input type="text" id="global-set-initials" class="fc-setting-input" style="width:50px; text-transform:uppercase;" maxlength="3"></div>
                    <div class="fc-setting-row"><label>Audio Cues:</label><input type="checkbox" id="global-set-audio"></div>
                    <div class="fc-setting-row"><label>Audio Volume:</label><input type="range" id="global-set-volume" min="0" max="1" step="0.05" style="width:100px;"></div>
                    <div class="fc-setting-row" style="border-top: 1px solid #444; padding-top: 12px;"><label>Terminal Opacity:</label><input type="range" id="global-set-opacity" min="0.5" max="1.0" step="0.05" style="width:100px;"></div>
                    <div class="fc-setting-row"><label>Default Position:</label><select id="global-set-position" class="fc-setting-input" style="width:110px;"><option value="bottom-right">Bottom Right</option><option value="bottom-left">Bottom Left</option><option value="top-right">Top Right</option><option value="top-left">Top Left</option><option value="center">Center</option></select></div>
                    <div id="dev-settings-container" style="display: none; border-left: 2px solid #ffb800; padding-left: 10px; margin-top: 15px;">
                        <div class="fc-setting-row"><label style="color:#ffb800;">Search History (Days):</label><input type="number" id="global-set-days" class="fc-setting-input" style="width:60px;"></div>
                        <div class="fc-setting-row"><label style="color:#ffb800;">Native UI Print Button:</label><input type="checkbox" id="global-set-nativeprint"></div>
                        <div class="fc-setting-row"><label style="color:#ffb800;">Enable X-Ray Vision:</label><input type="checkbox" id="global-set-xray"></div>
                        <div class="fc-setting-row"><label style="color:#ffb800;">Simulate Offline Mode:</label><input type="checkbox" id="global-set-offline"></div>
                        <div class="fc-setting-row" style="border-top: 1px solid #444; padding-top: 12px; margin-top: 10px;"><button id="global-dev-migrate" class="fc-action-btn-copy" style="width:100%; background:#e74c3c; color:#fff;" title="Force all current logs through the latest auto-formatter and fuzzy matcher">Migrate Legacy Logs</button></div>
                    </div>
                    <div class="fc-btn-row" style="margin-top: 15px;"><button id="global-shortcuts-btn" class="fc-action-btn" style="background:#5dade2; color:#fff;">Keyboard Shortcuts</button></div>
                    <div class="fc-btn-row" style="margin-top: 5px;"><button id="global-settings-save" class="fc-action-btn" style="background:#2ecc71; color:#000;">Save Settings</button><button id="global-settings-cancel" class="fc-action-btn-clear" style="background:#5a5a5a;">Cancel</button></div>
                </div>
                <div id="shortcuts-view" class="fc-sub-view" style="display:none; max-height: 70vh; overflow-y: auto;">
                    <h4 style="margin: 0 0 12px 0; color: #5dade2; text-align: center; text-transform: uppercase; font-size: 14px;">Shortcuts</h4>
                    <p style="font-size:11px; color:#aaa; text-align:center; margin-bottom:15px;">Click an input below, then press a key combination to remap.</p>
                    <div class="fc-setting-row"><label>Toggle Communal Check-In:</label><input type="text" id="shortcut-toggleRapid" class="fc-setting-input fc-shortcut-input" readonly></div>
                    <div class="fc-setting-row"><label>Toggle Communal Cremation:</label><input type="text" id="shortcut-toggleComm" class="fc-setting-input fc-shortcut-input" readonly></div>
                    <div class="fc-setting-row"><label>Focus Search Bar:</label><input type="text" id="shortcut-focusSearch" class="fc-setting-input fc-shortcut-input" readonly></div>
                    <div class="fc-setting-row"><label>Close Terminals:</label><input type="text" id="shortcut-closeTerminals" class="fc-setting-input fc-shortcut-input" readonly></div>
                    <div class="fc-btn-row" style="margin-top: 15px;"><button id="shortcuts-back-btn" class="fc-action-btn-clear" style="background:#5a5a5a; color:#fff;">Done</button></div>
                </div>
            </div>

            <div id="rapid-term" class="fc-term-panel"><div class="fc-term-header"><h3 title="Communal Check-In">Communal Check-In</h3><div class="fc-header-controls"><div class="fc-help-wrapper"><button class="fc-icon-btn" style="cursor:help;">ℹ️</button><div class="fc-help-tooltip"><strong>Keepsake Codes:</strong><b>CP</b> = Clay Paw<br><b>IP</b> = Ink Paw<br><b>IN</b> = Ink Nose<br><b>FC</b> = Fur Clip<br><b>PH</b> = Photo</div></div><button id="rapid-manual-btn" class="fc-icon-btn" title="Add FC Form">➕</button><button id="rapid-settings-btn" class="fc-icon-btn" title="Settings">⚙️</button><button id="rapid-reset-btn" class="fc-icon-btn" title="Reset Position" style="font-size:18px;">⟲</button><button id="rapid-minimize-btn" class="fc-icon-btn" title="Minimize">—</button></div></div>
            <div id="rapid-settings-view" class="fc-sub-view"><div class="fc-setting-row"><label>Auto-Print Keepsakes:</label><input type="checkbox" id="rapid-set-print"></div><div class="fc-btn-row" style="margin-top: 15px;"><button id="rapid-settings-save" class="fc-action-btn">Save</button><button id="rapid-settings-cancel" class="fc-action-btn-clear" style="background:#5a5a5a;">Cancel</button></div></div>
            <div id="rapid-manual-view" class="fc-sub-view"><h4 style="margin: 0 0 12px 0; color: #ffd93d; text-align: center; text-transform: uppercase; font-size: 14px;">Manual FC Form</h4><div class="fc-manual-row"><label>Pet Name *</label><input type="text" id="rapid-man-pet" class="fc-manual-input" autocomplete="off"></div><div class="fc-manual-row"><label>Family Name</label><input type="text" id="rapid-man-fam" class="fc-manual-input" autocomplete="off"></div><div class="fc-manual-row"><label>Clinic Name</label><input type="text" id="rapid-man-clin" class="fc-manual-input" autocomplete="off"></div><div class="fc-manual-row"><label>Keepsakes (Blank for none)</label><input type="text" id="rapid-man-keep" class="fc-manual-input" placeholder="e.g. CP, IP" autocomplete="off"></div><div id="rapid-man-acr-prompt" class="fc-confirm-box" style="display:none; margin-top:15px;"></div><div class="fc-btn-row" style="margin-top: 15px;"><button id="rapid-man-submit" class="fc-action-btn">Add to Log</button><button id="rapid-man-cancel" class="fc-action-btn-clear" style="background:#5a5a5a;">Cancel</button></div></div>
            <div id="rapid-edit-view" class="fc-sub-view"><h4 style="margin: 0 0 12px 0; color: #3498db; text-align: center; text-transform: uppercase; font-size: 14px;">Edit Record</h4><input type="hidden" id="rapid-edit-index"><div class="fc-manual-row"><label>Pet Name</label><input type="text" id="rapid-edit-pet" class="fc-manual-input"></div><div class="fc-manual-row"><label>Family Name</label><input type="text" id="rapid-edit-fam" class="fc-manual-input"></div><div class="fc-manual-row"><label>Clinic Name</label><input type="text" id="rapid-edit-clin" class="fc-manual-input"></div><div class="fc-manual-row"><label>Keepsakes</label><input type="text" id="rapid-edit-keep" class="fc-manual-input"></div><div id="rapid-edit-acr-prompt" class="fc-confirm-box" style="display:none; margin-top:15px;"></div><div class="fc-btn-row" style="margin-top: 15px;"><button id="rapid-edit-save" class="fc-action-btn">Save Changes</button><button id="rapid-edit-cancel" class="fc-action-btn-clear" style="background:#5a5a5a;">Cancel</button></div></div>            <div id="rapid-main-view"><div class="fc-input-row"><input type="text" id="rapid-input" class="fc-main-input" placeholder="Enter Request ID, Pet, or Clinic..." autocomplete="off"></div><div id="rapid-status" class="fc-status-text">Ready.</div><div id="rapid-confirm-box" class="fc-confirm-box"></div><div id="rapid-tiebreaker-list" class="fc-tiebreaker-list"></div><div id="rapid-log-container" class="fc-log-container"></div><div class="fc-btn-row"><button id="rapid-print-btn" class="fc-action-btn" title="Open formatted log">View / Print</button><button id="rapid-copy-btn" class="fc-action-btn-copy" title="Copy Word table">Copy</button><button id="rapid-clear-btn" class="fc-action-btn-clear" title="Clear All">Clear</button></div></div></div>
            <div id="comm-term" class="fc-term-panel"><div class="fc-term-header"><h3>Communal Cremation</h3><div class="fc-header-controls"><button id="comm-manual-btn" class="fc-icon-btn" title="Add Special Entry">➕</button><button id="comm-settings-btn" class="fc-icon-btn" title="Settings">⚙️</button><button id="comm-reset-btn" class="fc-icon-btn" title="Reset Position" style="font-size:18px;">⟲</button><button id="comm-minimize-btn" class="fc-icon-btn" title="Minimize">—</button></div></div>
            <div id="comm-settings-view" class="fc-sub-view"><div class="fc-setting-row"><label>Summary Format:</label><select id="comm-set-summary" class="fc-setting-input" style="width:120px;"><option value="split">Split</option><option value="combined">Combined</option></select></div><div class="fc-setting-row"><label>Export Format:</label><select id="comm-set-export" class="fc-setting-input" style="width:120px;"><option value="combined">Combined</option><option value="separate">By Pallet</option></select></div><div class="fc-setting-row"><label>Color Code Logs:</label><input type="checkbox" id="comm-set-color"></div><div class="fc-setting-row"><label>Number of Pallets:</label><input type="number" id="comm-set-pallets" class="fc-setting-input" style="width:50px;" min="1" max="4"></div><div class="fc-setting-row" style="border-top: 1px solid #444; padding-top: 12px;"><label>Weight Mode:</label><select id="comm-set-wmode" class="fc-setting-input" style="width:120px;"><option value="size">DB Size</option><option value="numeric">Numeric</option></select></div><div class="fc-setting-row"><label>Est. Weights (lbs):</label><div><span style="color:#888;">S</span><input type="number" id="comm-set-sw" class="fc-weight-setup-input"><span style="color:#888;">M</span><input type="number" id="comm-set-mw" class="fc-weight-setup-input"><span style="color:#888;">L</span><input type="number" id="comm-set-lw" class="fc-weight-setup-input" style="margin-right:0;"></div></div><div class="fc-setting-row" style="border-top: 1px solid #444; padding-top: 12px;"><label>Max Combined Wt (lbs):</label><input type="number" id="comm-set-maxwt" class="fc-setting-input" style="width:60px;"></div><div class="fc-btn-row" style="margin-top: 15px;"><button id="comm-settings-save" class="fc-action-btn">Save</button><button id="comm-settings-cancel" class="fc-action-btn-clear" style="background:#5a5a5a;">Cancel</button></div></div>
            <div id="comm-manual-view" class="fc-sub-view"><h4 style="margin: 0 0 12px 0; color: #3498db; text-align: center; text-transform: uppercase; font-size: 14px;">Special Entry</h4><div class="fc-toggle-group" style="margin-bottom: 15px;"><button id="comm-type-fc" class="fc-toggle-btn active">FC Form</button><button id="comm-type-stray" class="fc-toggle-btn">Stray/Wildlife</button></div><div class="fc-manual-row"><label>Pet Name *</label><input type="text" id="comm-man-pet" class="fc-manual-input" autocomplete="off"></div><div class="fc-manual-row"><label>Family Name</label><input type="text" id="comm-man-fam" class="fc-manual-input" autocomplete="off"></div><div class="fc-manual-row"><label>Clinic Name</label><input type="text" id="comm-man-clin" class="fc-manual-input" autocomplete="off"></div><div class="fc-manual-row"><label>Size *</label><select id="comm-man-size" class="fc-manual-input" style="padding: 7px;"><option value="Small">Small</option><option value="Medium">Medium</option><option value="Large">Large</option></select></div><div class="fc-manual-row"><label>Keepsakes (Blank for none)</label><input type="text" id="comm-man-keep" class="fc-manual-input" placeholder="e.g. CP, IP" autocomplete="off"></div><div id="comm-man-acr-prompt" class="fc-confirm-box" style="display:none; margin-top:15px;"></div><div class="fc-btn-row" style="margin-top: 15px;"><button id="comm-man-submit" class="fc-action-btn">Log to Pallet <span id="comm-man-pal-lbl">1</span></button><button id="comm-man-cancel" class="fc-action-btn-clear" style="background:#5a5a5a;">Cancel</button></div></div>
            <div id="comm-edit-view" class="fc-sub-view"><h4 style="margin: 0 0 12px 0; color: #3498db; text-align: center; text-transform: uppercase; font-size: 14px;">Edit Record</h4><input type="hidden" id="comm-edit-index"><div class="fc-manual-row"><label>Pet Name</label><input type="text" id="comm-edit-pet" class="fc-manual-input"></div><div class="fc-manual-row"><label>Family Name</label><input type="text" id="comm-edit-fam" class="fc-manual-input"></div><div class="fc-manual-row"><label>Clinic Name</label><input type="text" id="comm-edit-clin" class="fc-manual-input"></div><div class="fc-manual-row"><label>Size</label><select id="comm-edit-size" class="fc-manual-input" style="padding: 7px;"><option value="Small">Small</option><option value="Medium">Medium</option><option value="Large">Large</option></select></div><div class="fc-manual-row"><label>Keepsakes</label><input type="text" id="comm-edit-keep" class="fc-manual-input"></div><div class="fc-manual-row" id="comm-edit-weight-row"><label>Weight (lbs)</label><input type="number" id="comm-edit-weight" class="fc-manual-input"></div><div id="comm-edit-acr-prompt" class="fc-confirm-box" style="display:none; margin-top:15px;"></div><div class="fc-btn-row" style="margin-top: 15px;"><button id="comm-edit-save" class="fc-action-btn">Save Changes</button><button id="comm-edit-cancel" class="fc-action-btn-clear" style="background:#5a5a5a;">Cancel</button></div></div>            <div id="comm-main-view"><div class="fc-toggle-row"><div class="fc-toggle-group" id="comm-pallet-group"><button id="comm-pal-1" class="fc-toggle-btn active">Pallet 1</button><button id="comm-pal-2" class="fc-toggle-btn">Pallet 2</button><button id="comm-pal-3" class="fc-toggle-btn" style="display:none;">Pallet 3</button><button id="comm-pal-4" class="fc-toggle-btn" style="display:none;">Pallet 4</button></div></div><div class="fc-capacity-container"><div id="comm-capacity-bar" class="fc-capacity-bar"></div></div><div id="comm-capacity-text" class="fc-capacity-text">0 / 3000 lbs</div><div class="fc-input-row"><input type="text" id="comm-input" class="fc-main-input" placeholder="Enter Request ID, Pet, or Clinic..." autocomplete="off"><input type="number" id="comm-weight" class="fc-weight-input" placeholder="lbs" autocomplete="off"></div><div id="comm-status" class="fc-status-text">Ready.</div><div id="comm-confirm-box" class="fc-confirm-box"></div><div id="comm-tiebreaker-list" class="fc-tiebreaker-list"></div><div id="comm-log-container" class="fc-log-container"></div><div class="fc-btn-row"><button id="comm-print-btn" class="fc-action-btn" title="Open formatted log">View / Print</button><button id="comm-copy-btn" class="fc-action-btn-copy" title="Copy Word table">Copy</button><button id="comm-clear-btn" class="fc-action-btn-clear" title="Clear All">Clear</button></div></div></div>
            `;
            document.body.appendChild(wrapper);
        }
    };

    // --- Application Logic ---
    const App = {
        async init() {
            if (document.getElementById('fc-master-wrapper')) return;
            State.currentUser = await this.UserManager.identifyUser();
            State.load(); UI.injectStyles(); UI.injectDOM(); State.updateSyncUI();
            this.GlobalSettings.init(); this.bindGlobalEvents(); this.SyncManager.init(); this.Drag.init(); this.NativePrint.init(); this.Rapid.init(); this.Comm.init(); this.XRay.init(); this.Shortcuts.init();
        },

        UserManager: {
            async identifyUser() {
                const profileNode = document.querySelector('a.profileName');
                if (profileNode && profileNode.innerText.trim() !== '') {
                    return profileNode.innerText.trim().replace(/\s+/g, '_');
                }
                return 'Shared';
            }
        },

        bindGlobalEvents() {
            const getEl = id => document.getElementById(id);
            const rTerm = getEl('rapid-term'), cTerm = getEl('comm-term'), rToggle = getEl('rapid-toggle-btn'), cToggle = getEl('comm-toggle-btn');
            const closeAll = () => { rTerm.style.display = 'none'; cTerm.style.display = 'none'; rToggle.classList.remove('active'); cToggle.classList.remove('active'); };

            getEl('global-settings-btn').addEventListener('click', () => { closeAll(); this.GlobalSettings.toggleView(); });
            rToggle.addEventListener('click', () => { if (rTerm.style.display === 'block') closeAll(); else { closeAll(); getEl('global-settings-panel').style.display='none'; rTerm.style.display = 'block'; rToggle.classList.add('active'); this.Drag.ensureInBounds(rTerm); this.Rapid.renderLog(); getEl('rapid-input').focus(); } });
            cToggle.addEventListener('click', () => { if (cTerm.style.display === 'block') closeAll(); else { closeAll(); getEl('global-settings-panel').style.display='none'; cTerm.style.display = 'block'; cToggle.classList.add('active'); this.Comm.applySettings(); this.Drag.ensureInBounds(cTerm); this.Comm.renderLog(); getEl('comm-input').focus(); } });

            getEl('rapid-minimize-btn').addEventListener('click', closeAll); getEl('comm-minimize-btn').addEventListener('click', closeAll);

            getEl('global-export-btn').addEventListener('click', () => {
                const payload = { version: "13.3", timestamp: new Date().toISOString(), settings: State.settings, rapidLog: State.rapidLog, communalLog: State.commLog, syncQueue: State.syncQueue };
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `fc-master-backup_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
            });

            getEl('global-import-btn').addEventListener('click', () => getEl('fc-import-file').click());

            let clickCount = 0, clickTimer = null;
            getEl('global-settings-header').addEventListener('mousedown', (e) => {
                clickCount++;
                if (clickCount === 1) clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
                if (clickCount >= 5) {
                    clearTimeout(clickTimer); clickCount = 0; State.settings.devMode = !State.settings.devMode; State.saveSettings(); this.GlobalSettings.applyDevMode();
                    if(State.settings.devMode) { AudioService.play('success'); e.target.innerText = "Developer Mode Unlocked"; }
                    else { AudioService.play('alert'); e.target.innerText = "Global Settings"; }
                }
            });

            getEl('fc-import-file').addEventListener('change', e => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                    try {
                        const imported = JSON.parse(ev.target.result);
                        if (imported.settings && imported.rapidLog && imported.communalLog) {
                            State.settings = { ...State.settings, ...imported.settings }; State.rapidLog = imported.rapidLog; State.commLog = imported.communalLog; if (imported.syncQueue) State.syncQueue = imported.syncQueue;
                            State.saveSettings(); State.saveRapid(); State.saveComm(); State.saveSync();
                            this.Rapid.renderLog(); this.Comm.renderLog(); this.Comm.applySettings(); this.Drag.applyInitialPositions(); this.GlobalSettings.applyOpacity(); this.GlobalSettings.applyDevMode(); this.Shortcuts.refreshUI();
                            alert("Import successful!");
                        } else throw new Error("Missing format");
                    } catch (err) { alert("Import Failed: Invalid JSON format."); }
                    e.target.value = '';
                };
                reader.readAsText(file);
            });
        },

        GlobalSettings: {
            init() {
                this.bindEvents();
                this.applyOpacity();
                this.applyDevMode();

                const userBadge = document.getElementById('fc-active-user-badge');
                if (userBadge) {
                    userBadge.innerText = (State.currentUser || 'Shared').replace(/_/g, ' ');
                }
            },
            applyOpacity() {
                const op = State.settings.terminalOpacity || 0.95; const bg = `rgba(30, 30, 30, ${op})`;
                ['rapid-term', 'comm-term', 'global-settings-panel'].forEach(id => { const el = document.getElementById(id); if (el) el.style.backgroundColor = bg; });
            },
            applyDevMode() {
                const devContainer = document.getElementById('dev-settings-container'), header = document.getElementById('global-settings-header');
                if (devContainer) devContainer.style.display = State.settings.devMode ? 'block' : 'none';
                if (header) {
                    const badgeHtml = `<span id="fc-active-user-badge" style="font-size: 11px; background: #3498db; color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 10px; pointer-events: none;">${(State.currentUser || 'Shared').replace(/_/g, ' ')}</span>`;
                    header.innerHTML = State.settings.devMode ? `Developer Mode Unlocked ${badgeHtml}` : `Global Settings ${badgeHtml}`;
                }
            },
            bindEvents() {
                const el = id => document.getElementById(id);
                const migrateBtn = el('global-dev-migrate');
                if (migrateBtn) {
                    migrateBtn.addEventListener('click', () => {
                        if (!confirm("This will run all current log entries through the new formatting and acronym rules. Proceed?")) return;

                        let updatedRapid = 0, updatedComm = 0;

                        State.rapidLog = State.rapidLog.map(row => {
                            const c = row.clinic || '';
                            const match = Utils.suggestClinicAcronym(c);
                            updatedRapid++;
                            return {
                                ...row,
                                pet: Utils.formatPet(row.pet || ''),
                                family: Utils.formatFamily(row.family || ''),
                                clinic: match ? match.acronym : Utils.formatClinic(c)
                            };
                        });

                        State.commLog = State.commLog.map(row => {
                            const c = row.clinic || '';
                            const match = Utils.suggestClinicAcronym(c);
                            updatedComm++;
                            return {
                                ...row,
                                pet: (row.pet === 'Stray/Wildlife') ? row.pet : Utils.formatPet(row.pet || ''),
                                family: (row.pet === 'Stray/Wildlife') ? '' : Utils.formatFamily(row.family || ''),
                                clinic: match ? match.acronym : Utils.formatClinic(c)
                            };
                        });

                        State.saveRapid();
                        State.saveComm();
                        App.Rapid.renderLog();
                        App.Comm.renderLog();
                        AudioService.play('success');
                        alert(`Migration Complete!\nRe-formatted ${updatedRapid} Check-In records and ${updatedComm} Cremation records.`);
                    });
                }
                el('global-settings-save').addEventListener('click', () => {
                    State.settings.initials = el('global-set-initials').value.trim().toUpperCase() || 'CM'; State.settings.soundEnabled = el('global-set-audio').checked; State.settings.audioVolume = parseFloat(el('global-set-volume').value); State.settings.terminalOpacity = parseFloat(el('global-set-opacity').value); State.settings.searchDays = parseInt(el('global-set-days').value) || 60; State.settings.defaultPosition = el('global-set-position').value; State.settings.nativePrintEnabled = el('global-set-nativeprint').checked; State.settings.xrayEnabled = el('global-set-xray').checked; State.settings.simulateOffline = el('global-set-offline').checked;
                    State.saveSettings(); this.applyOpacity(); App.Drag.applyDefaultCSS(el('rapid-term'), 'rapid'); App.Drag.applyDefaultCSS(el('comm-term'), 'comm'); el('global-settings-panel').style.display = 'none';
                });
                el('global-settings-cancel').addEventListener('click', () => { el('global-settings-panel').style.display = 'none'; });
                el('global-minimize-btn').addEventListener('click', () => { el('global-settings-panel').style.display = 'none'; });
            },
            toggleView() {
                const panel = document.getElementById('global-settings-panel');
                if (panel.style.display === 'block') { panel.style.display = 'none'; } else {
                    const el = id => document.getElementById(id);
                    el('global-set-initials').value = State.settings.initials; el('global-set-audio').checked = State.settings.soundEnabled; el('global-set-volume').value = State.settings.audioVolume; el('global-set-opacity').value = State.settings.terminalOpacity; el('global-set-days').value = State.settings.searchDays; el('global-set-position').value = State.settings.defaultPosition || 'bottom-right'; el('global-set-nativeprint').checked = State.settings.nativePrintEnabled; el('global-set-xray').checked = State.settings.xrayEnabled; el('global-set-offline').checked = State.settings.simulateOffline || false;
                    this.applyDevMode(); document.getElementById('global-settings-main').style.display = 'block'; document.getElementById('shortcuts-view').style.display = 'none'; panel.style.display = 'block';
                }
            }
        },

        Shortcuts: {
            isListening: null,
            init() {
                if (!State.settings.shortcuts) State.settings.shortcuts = { ...CONFIG.defaultSettings.shortcuts };
                this.bindUI();
                this.bindGlobalKeydown();
            },
            bindUI() {
                const getEl = id => document.getElementById(id);
                const btn = getEl('global-shortcuts-btn');
                if (btn) {
                    btn.addEventListener('click', () => {
                        getEl('global-settings-main').style.display = 'none';
                        getEl('shortcuts-view').style.display = 'block';
                        this.refreshUI();
                    });
                }
                const backBtn = getEl('shortcuts-back-btn');
                if (backBtn) {
                    backBtn.addEventListener('click', () => {
                        getEl('shortcuts-view').style.display = 'none';
                        getEl('global-settings-main').style.display = 'block';
                        State.saveSettings();
                    });
                }

                ['toggleRapid', 'toggleComm', 'focusSearch', 'closeTerminals'].forEach(key => {
                    const input = getEl(`shortcut-${key}`);
                    if (input) {
                        input.addEventListener('click', () => {
                            this.isListening = key;
                            input.value = "Listening...";
                            input.classList.add('listening');
                        });
                    }
                });
            },
            refreshUI() {
                ['toggleRapid', 'toggleComm', 'focusSearch', 'closeTerminals'].forEach(key => {
                    const el = document.getElementById(`shortcut-${key}`);
                    if (el) {
                        el.value = State.settings.shortcuts[key] || '';
                        el.classList.remove('listening');
                    }
                });
            },
            bindGlobalKeydown() {
                document.addEventListener('keydown', (e) => {
                    if (this.isListening) {
                        e.preventDefault(); e.stopPropagation();
                        if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

                        if (e.key === 'Escape') {
                            this.isListening = null; this.refreshUI(); return;
                        }

                        let keys = [];
                        if (e.ctrlKey || e.metaKey) keys.push('Ctrl');
                        if (e.altKey) keys.push('Alt');
                        if (e.shiftKey) keys.push('Shift');

                        let keyName = e.key.length === 1 ? e.key.toUpperCase() : e.key;
                        if (keyName === ' ') keyName = 'Space';
                        keys.push(keyName);

                        const combo = keys.join('+');
                        State.settings.shortcuts[this.isListening] = combo;
                        this.isListening = null;
                        this.refreshUI();
                        return;
                    }

                    if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

                    let keys = [];
                    if (e.ctrlKey || e.metaKey) keys.push('Ctrl');
                    if (e.altKey) keys.push('Alt');
                    if (e.shiftKey) keys.push('Shift');

                    let keyName = e.key.length === 1 ? e.key.toUpperCase() : e.key;
                    if (keyName === ' ') keyName = 'Space';
                    keys.push(keyName);
                    const combo = keys.join('+');

                    const s = State.settings.shortcuts;
                    if (!s) return;

                    let triggered = false;
                    const getEl = id => document.getElementById(id);

                    if (combo === s.toggleRapid) { const btn = getEl('rapid-toggle-btn'); if(btn) btn.click(); triggered = true; }
                    else if (combo === s.toggleComm) { const btn = getEl('comm-toggle-btn'); if(btn) btn.click(); triggered = true; }
                    else if (combo === s.focusSearch) {
                        if (getEl('rapid-term') && getEl('rapid-term').style.display === 'block') { getEl('rapid-input').focus(); triggered = true; }
                        else if (getEl('comm-term') && getEl('comm-term').style.display === 'block') { getEl('comm-input').focus(); triggered = true; }
                    }
                    else if (combo === s.closeTerminals) {
                        const rMin = getEl('rapid-minimize-btn'), cMin = getEl('comm-minimize-btn'), gMin = getEl('global-minimize-btn');
                        if (rMin) rMin.click();
                        if (cMin) cMin.click();
                        if (gMin) gMin.click();
                        triggered = true;
                    }

                    if (triggered) {
                        e.preventDefault();
                    }
                });
            }
        },

        SyncManager: {
            isSyncing: false,
            init() { window.addEventListener('online', () => this.processQueue()); setInterval(() => this.processQueue(), 30000); setTimeout(() => this.processQueue(), 2000); },
            async processQueue() {
                if (this.isSyncing || State.syncQueue.length === 0 || !navigator.onLine) return;
                this.isSyncing = true; const queue = [...State.syncQueue];
                for (let i = 0; i < queue.length; i++) {
                    const jobId = queue[i];
                    try {
                        await API.checkInJob(jobId, true);
                        State.syncQueue = State.syncQueue.filter(id => id !== jobId); State.saveSync();
                    } catch (err) { break; }
                    if (i < queue.length - 1) await new Promise(r => setTimeout(r, 1000));
                }
                this.isSyncing = false;
            }
        },

        NativePrint: {
            init() {
                this.applyState();
                document.body.addEventListener('mouseover', e => {
                    if (!State.settings.nativePrintEnabled) return;
                    const row = e.target.closest('tr[role="row"]');
                    if (!row || row.dataset.fcPrintInjected) return;

                    const link = row.querySelector('td a[href*="/job/details/"]');
                    if (link && link.parentElement) {
                        row.dataset.fcPrintInjected = 'true';
                        link.parentElement.style.position = 'relative';

                        const btn = document.createElement('button');
                        btn.innerHTML = '🖨️';
                        btn.className = 'fc-native-print-btn';
                        btn.title = 'Print Job';
                        btn.onclick = (ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            AudioService.play('found');
                            const jobId = link.href.split('/').pop();
                            const pf = document.createElement('iframe');
                            pf.style.display = 'none';
                            pf.src = `${CONFIG.endpoints.print}${jobId}`;
                            document.body.appendChild(pf);
                            pf.onload = () => {
                                try { pf.contentWindow.focus(); pf.contentWindow.print(); } catch(err){}
                                setTimeout(() => pf.remove(), 10000);
                            };
                        };
                        link.parentElement.appendChild(btn);
                    }
                });
            },
            applyState() {
                if (State.settings.nativePrintEnabled) document.body.classList.add('fc-native-print-active');
                else document.body.classList.remove('fc-native-print-active');
            }
        },

        Drag: {
            init() {
                this.applyInitialPositions();
                this.makeDraggable('rapid-term', 'rapid-term .fc-term-header', 'rapid');
                this.makeDraggable('comm-term', 'comm-term .fc-term-header', 'comm');
                this.makeDraggable('global-settings-panel', 'global-settings-panel .fc-term-header', 'global');

                ['rapid', 'comm', 'global'].forEach(key => { const btn = document.getElementById(`${key}-reset-btn`); if (btn) btn.addEventListener('click', () => this.resetPosition(key)); });

                const observer = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        if (entry.target.style.top && entry.target.style.top !== 'auto' && !entry.target.style.transform) this.ensureInBounds(entry.target);
                        let key = entry.target.id.replace('-term', '');
                        if (key === 'global-settings-panel') key = 'global';
                        if (State.settings.positions && State.settings.positions[key]) {
                            State.settings.positions[key].width = entry.target.style.width || (key === 'global' ? '400px' : '480px');
                            State.settings.positions[key].height = entry.target.style.height || 'auto';
                            State.saveSettings();
                        }
                    }
                });
                ['rapid-term', 'comm-term', 'global-settings-panel'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) observer.observe(el);
                });
                window.addEventListener('resize', () => {
                    ['rapid-term', 'comm-term', 'global-settings-panel'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el && el.style.top && !el.style.transform) this.ensureInBounds(el);
                    });
                });
            },

            resetPosition(key) {
                const term = document.getElementById(key === 'global' ? 'global-settings-panel' : `${key}-term`); if (!term) return;
                term.style.width = key === 'global' ? '400px' : '480px'; term.style.height = 'auto';
                this.applyDefaultCSS(term, key);
                if (State.settings.positions) { State.settings.positions[key] = { top: term.style.top, left: term.style.left, width: key === 'global' ? '400px' : '480px', height: 'auto' }; State.saveSettings(); }
            },

            applyDefaultCSS(term, key) {
                term.style.top = ''; term.style.bottom = ''; term.style.left = ''; term.style.right = ''; term.style.transform = '';
                const pos = State.settings.defaultPosition || 'bottom-right';
                if (pos === 'bottom-right') { term.style.bottom = '87px'; term.style.right = '77px'; }
                else if (pos === 'bottom-left') { term.style.bottom = '87px'; term.style.left = '20px'; }
                else if (pos === 'top-right') { term.style.top = '20px'; term.style.right = '77px'; }
                else if (pos === 'top-left') { term.style.top = '20px'; term.style.left = '20px'; }
                else if (pos === 'center') { term.style.top = '50%'; term.style.left = '50%'; term.style.transform = 'translate(-50%, -50%)'; }
            },

            ensureInBounds(term) {
                if (!term || term.style.display === 'none' || !term.style.top || term.style.top === 'auto' || term.style.top === '' || term.style.transform.includes('translate')) return;
                const rect = term.getBoundingClientRect(); let newTop = parseFloat(term.style.top), newLeft = parseFloat(term.style.left), changed = false, pad = 20;
                if (rect.bottom > window.innerHeight - pad) { newTop -= (rect.bottom - (window.innerHeight - pad)); changed = true; }
                if (newTop < pad) { newTop = pad; changed = true; }
                if (rect.right > window.innerWidth - pad) { newLeft -= (rect.right - (window.innerWidth - pad)); changed = true; }
                if (newLeft < pad) { newLeft = pad; changed = true; }
                if (changed) {
                    term.style.top = `${newTop}px`; term.style.left = `${newLeft}px`;
                    let key = term.id.replace('-term', ''); if (key === 'global-settings-panel') key = 'global';
                    if (State.settings.positions && State.settings.positions[key]) { State.settings.positions[key].top = term.style.top; State.settings.positions[key].left = term.style.left; State.saveSettings(); }
                }
            },

            applyInitialPositions() {
                ['rapid', 'comm', 'global'].forEach(key => {
                    const termId = key === 'global' ? 'global-settings-panel' : `${key}-term`;
                    const term = document.getElementById(termId); if (!term) return;
                    const pos = State.settings.positions ? State.settings.positions[key] : null;
                    if (pos && pos.top && pos.left) { term.style.top = pos.top; term.style.left = pos.left; term.style.bottom = 'auto'; term.style.right = 'auto'; term.style.transform = ''; } else { this.applyDefaultCSS(term, key); }
                    if (pos && pos.width) term.style.width = pos.width; if (pos && pos.height) term.style.height = pos.height;
                });
            },

            makeDraggable(termId, headerSelector, configKey) {
                const term = document.getElementById(termId), header = document.querySelector(`#${headerSelector}`); if (!term || !header) return;
                let isDragging = false, startX, startY, initialLeft, initialTop;
                header.addEventListener('mousedown', (e) => {
                    if (e.target.closest('.fc-header-controls')) return;
                    isDragging = true; startX = e.clientX; startY = e.clientY; const rect = term.getBoundingClientRect();
                    term.style.bottom = 'auto'; term.style.right = 'auto'; term.style.transform = ''; term.style.left = rect.left + 'px'; term.style.top = rect.top + 'px';
                    initialLeft = rect.left; initialTop = rect.top; e.preventDefault();
                });
                document.addEventListener('mousemove', (e) => { if (!isDragging) return; term.style.left = `${initialLeft + (e.clientX - startX)}px`; term.style.top = `${initialTop + (e.clientY - startY)}px`; });
                document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; if (!State.settings.positions) State.settings.positions = { rapid: {}, comm: {}, global: {} }; State.settings.positions[configKey] = { top: term.style.top, left: term.style.left, width: term.style.width || (configKey === 'global' ? '400px' : '480px'), height: term.style.height || 'auto' }; State.saveSettings(); } });
            }
        },

        XRay: {
            tooltip: null, hoverTimer: null, isPinned: false, lastX: 0, lastY: 0,
            init() { let tt = document.getElementById('fc-xray-tooltip'); if (!tt) { tt = document.createElement('div'); tt.id = 'fc-xray-tooltip'; document.body.appendChild(tt); } this.tooltip = tt; this.bindEvents(); this.applyState(); },
            applyState() { if (!State.settings.xrayEnabled && this.tooltip) this.tooltip.style.display = 'none'; },
            bindEvents() {
                document.body.addEventListener('mouseover', e => {
                    if (!State.settings.xrayEnabled) return; const row = e.target.closest('tr[role="row"]'), link = row?.querySelector('td a[href*="/job/details/"]');
                    if (link) { const jobId = link.href.split('/').pop(); this.hoverTimer = setTimeout(() => this.loadData(e, jobId), 600); }
                });
                document.body.addEventListener('mousemove', e => { this.lastX = e.clientX; this.lastY = e.clientY; if (!State.settings.xrayEnabled) { if (this.tooltip) this.tooltip.style.display = 'none'; return; } if (this.tooltip && this.tooltip.style.display === 'block') { if (!this.isPinned) { this.tooltip.style.left = `${e.clientX + 15}px`; this.tooltip.style.top = `${e.clientY + 15}px`; } } });
                document.body.addEventListener('mouseout', e => { if (e.target.closest('tr[role="row"]')) { clearTimeout(this.hoverTimer); if (this.tooltip && !this.isPinned) { this.tooltip.style.display = 'none'; } } });
                document.addEventListener('keydown', e => { if (e.key === 'Shift' && this.tooltip && this.tooltip.style.display === 'block') { this.isPinned = true; this.tooltip.style.pointerEvents = 'auto'; } });
                document.addEventListener('keyup', e => { if (e.key === 'Shift') { this.isPinned = false; if (this.tooltip) { this.tooltip.style.pointerEvents = 'none'; const hovered = document.elementFromPoint(this.lastX, this.lastY); if (!hovered || (!hovered.closest('tr[role="row"]') && !hovered.closest('#fc-xray-tooltip'))) { this.tooltip.style.display = 'none'; } } } });
            },
            async loadData(e, jobId) {
                if (!this.tooltip) return; this.tooltip.style.left = `${e.clientX + 15}px`; this.tooltip.style.top = `${e.clientY + 15}px`; this.tooltip.style.display = 'block';
                if (State.xrayCache[jobId]) return this.render(State.xrayCache[jobId]);
                this.tooltip.innerHTML = `<div style="color:#888;">Scanning record ${jobId}...</div>`;
                try { const html = await API.getJobDetailsHTML(jobId); const doc = new DOMParser().parseFromString(html, 'text/html'); const data = this.extractDetails(doc, jobId); State.xrayCache[jobId] = data; this.render(data); } catch (err) { this.tooltip.innerHTML = '<div style="color:red;">Error connecting to server.</div>'; }
            },
            extractDetails(doc, jobId) {
                const getInline = (label) => { const node = Array.from(doc.querySelectorAll('.inline_details_section h4')).find(h => h.innerText.trim() === label); return node ? node.nextElementSibling?.innerText.trim() || 'Unknown' : 'Unknown'; };
                let returnTo = doc.querySelector('.return-to-title')?.innerText.replace('Return To:', '').trim() || 'Unknown';
                if (returnTo === 'Clinic') { const cName = Array.from(doc.querySelectorAll('.return-pet-to-single-sec')).find(n => n.innerText.includes('Name:'))?.innerText.replace('Name:', '').trim(); if (cName) returnTo += ` (${cName})`; }
                const keepsakes = Array.from(doc.querySelectorAll('.job-detail-items-section .custom-control-description')).map(n => n.innerText.trim()).join(' | ') || 'None';
                const firstHistory = doc.querySelector('.pro_row'); let history = 'No history found';
                if (firstHistory) { const status = firstHistory.querySelector('.pro_right span')?.innerText.trim() || 'Unknown', date = firstHistory.querySelector('.pro_left span')?.innerText.trim() || ''; history = `<span style="color:#3498db;">${status}</span> <span style="font-size:11px; color:#888;">(${date})</span>`; }
                return { jobId, pet: getInline('Pet:'), size: getInline('Size:'), returnTo, specialReq: doc.querySelector('.job_special_request')?.innerText.trim() || 'None', amountDue: doc.querySelector('.job_amount_due')?.innerText.trim() || '$0.00', notes: doc.querySelector('.job_internal_notes')?.innerText.trim() || 'None', keepsakes, history };
            },
            render(data) {
                if (!this.tooltip) return;
                this.tooltip.innerHTML = `<h4>${data.pet} <span style="color:#aaa; font-size:12px; font-weight:normal;">(ID: ${data.jobId})</span></h4><div class="fc-xray-row"><span class="fc-xray-label">Size:</span> ${data.size}</div><div class="fc-xray-row"><span class="fc-xray-label">Status:</span> ${data.history}</div><div class="fc-xray-row"><span class="fc-xray-label">Keepsakes:</span> ${data.keepsakes !== 'None' ? `<span style="color:#4cd137">${data.keepsakes}</span>` : 'None'}</div><div class="fc-xray-row"><span class="fc-xray-label">Return To:</span> ${data.returnTo}</div><div class="fc-xray-row"><span class="fc-xray-label">Amt Due:</span> <span style="color:${data.amountDue === '$0.00' ? '#888' : '#ff4d4d'}">${data.amountDue}</span></div><div class="fc-xray-row"><span class="fc-xray-label">Special:</span> ${data.specialReq !== 'None' ? `<span style="color:#ffd93d">${data.specialReq}</span>` : 'None'}</div><div class="fc-xray-row"><span class="fc-xray-label">Notes:</span> ${data.notes}</div>`;
            }
        },

        Rapid: {
            awaitingConfirm: false, pendingJob: null, getEl: (id) => document.getElementById(id),
            init() { this.bindEvents(); },
            bindEvents() {
                const el = this.getEl;
                el('rapid-settings-btn').addEventListener('click', () => this.toggleView('settings'));
                el('rapid-manual-btn').addEventListener('click', () => this.toggleView('manual'));
                el('rapid-settings-cancel').addEventListener('click', () => this.toggleView('main'));
                el('rapid-man-cancel').addEventListener('click', () => this.toggleView('main'));
                el('rapid-edit-cancel').addEventListener('click', () => this.toggleView('main'));

                el('rapid-term').addEventListener('keydown', e => {
                    if (e.key === 'Escape') {
                        if (this.awaitingConfirm) this.cancelConfirm();
                        else if (el('rapid-settings-view').style.display === 'block' || el('rapid-manual-view').style.display === 'block' || el('rapid-edit-view').style.display === 'block') this.toggleView('main');
                        else document.getElementById('rapid-minimize-btn').click();
                    }
                });

                el('rapid-settings-save').addEventListener('click', () => {
                    State.settings.rapidAutoPrint = el('rapid-set-print').checked;
                    State.saveSettings(); this.toggleView('main'); this.setStatus('Settings saved.', 'success');
                });

                const finalizeManual = (pName, pFam, pClin, kText) => {
                    State.rapidLog.push({ jobId: `manual-${Date.now()}`, batch: State.rapidLog.length + 1, pet: pName, family: pFam, clinic: pClin, keepsakes: kText, hasKeepsakes: kText !== 'X', initials: State.settings.initials });
                    State.saveRapid(); this.renderLog(); AudioService.play('success'); this.setStatus(`Success: Manual form for ${pName} added.`, 'success'); this.toggleView('main');
                    el('rapid-man-acr-prompt').style.display = 'none';
                };

                const submitManual = () => {
                    const rawPet = el('rapid-man-pet').value.trim();
                    if (!rawPet) { AudioService.play('alert'); const pInput = el('rapid-man-pet'); pInput.classList.remove('fc-shake'); void pInput.offsetWidth; pInput.classList.add('fc-shake'); return pInput.focus(); }

                    const pName = rawPet;
                    const pFam = el('rapid-man-fam').value.trim();
                    const rawClin = el('rapid-man-clin').value.trim();
                    const kText = el('rapid-man-keep').value.trim().toUpperCase() || 'X';

                    const match = Utils.suggestClinicAcronym(rawClin);
                    if (match) {
                        const promptBox = el('rapid-man-acr-prompt');
                        promptBox.innerHTML = `<div>Clinic Match: <b>${match.original}</b><br>Use acronym <b>${match.acronym}</b>?</div><div class="fc-btn-row" style="margin-top:10px;"><button id="rm-acr-yes" class="fc-action-btn">Yes</button><button id="rm-acr-no" class="fc-action-btn-clear" style="background:#5a5a5a;">No</button></div>`;
                        promptBox.style.display = 'block';
                        el('rm-acr-yes').onclick = () => finalizeManual(pName, pFam, match.acronym, kText);
                        el('rm-acr-no').onclick = () => finalizeManual(pName, pFam, rawClin, kText);
                    } else {
                        finalizeManual(pName, pFam, rawClin, kText);
                    }
                };
                el('rapid-man-submit').addEventListener('click', submitManual);
                ['rapid-man-pet', 'rapid-man-fam', 'rapid-man-clin', 'rapid-man-keep'].forEach(id => { el(id).addEventListener('keypress', e => { if (e.key === 'Enter') submitManual(); }); });

                const finalizeEdit = (idx, row, ePet, eFam, eClin, newKeep) => {
                    State.rapidLog[idx] = { ...row, pet: ePet || row.pet, family: eFam, clinic: eClin, keepsakes: newKeep || 'X', hasKeepsakes: newKeep !== '' && newKeep !== 'X' };
                    State.saveRapid(); this.renderLog(); this.toggleView('main'); this.setStatus('Record updated.', 'success');
                    el('rapid-edit-acr-prompt').style.display = 'none';
                };

                el('rapid-edit-save').addEventListener('click', () => {
                    const idx = el('rapid-edit-index').value, row = State.rapidLog[idx]; if(!row) return;
                    const ePet = el('rapid-edit-pet').value.trim();
                    const eFam = el('rapid-edit-fam').value.trim();
                    const rawClin = el('rapid-edit-clin').value.trim();
                    const newKeep = el('rapid-edit-keep').value.trim().toUpperCase();

                    const match = Utils.suggestClinicAcronym(rawClin);
                    if (match) {
                        const promptBox = el('rapid-edit-acr-prompt');
                        promptBox.innerHTML = `<div>Clinic Match: <b>${match.original}</b><br>Use acronym <b>${match.acronym}</b>?</div><div class="fc-btn-row" style="margin-top:10px;"><button id="re-acr-yes" class="fc-action-btn">Yes</button><button id="re-acr-no" class="fc-action-btn-clear" style="background:#5a5a5a;">No</button></div>`;
                        promptBox.style.display = 'block';
                        el('re-acr-yes').onclick = () => finalizeEdit(idx, row, ePet, eFam, match.acronym, newKeep);
                        el('re-acr-no').onclick = () => finalizeEdit(idx, row, ePet, eFam, rawClin, newKeep);
                    } else {
                        finalizeEdit(idx, row, ePet, eFam, rawClin, newKeep);
                    }
                });

                el('rapid-input').addEventListener('keypress', async e => {
                    if (e.key !== 'Enter') return;
                    if (this.awaitingConfirm) { e.preventDefault(); await this.executeCheckIn(); return; }
                    const term = el('rapid-input').value.trim(); if (!term) return;
                    if (term.toLowerCase() === 'test') { el('rapid-input').value = ''; [{p:'Garfield',f:'Arbuckle',c:'Cartoon Vet',k:'X'},{p:'Snoopy',f:'Brown',c:'Peanuts',k:'CP, 2FC'},{p:'Scooby',f:'Doo',c:'Mystery Inc',k:'X'}].forEach((d,i) => { State.rapidLog.push({ jobId:'test-'+Date.now()+'-'+i, batch: State.rapidLog.length+1, pet: d.p, family: d.f, clinic: d.c, keepsakes: d.k, hasKeepsakes: d.k!=='X', initials: State.settings.initials }); }); State.saveRapid(); this.renderLog(); this.setStatus('Secret: Fake records injected.', 'success'); AudioService.play('success'); return; }
                    el('rapid-input').value = ''; el('rapid-input').disabled = true; el('rapid-tiebreaker-list').style.display = 'none'; el('rapid-confirm-box').style.display = 'none';
                    this.setStatus(`Searching for "${term}"...`, 'neutral');
                    try {
                        const matches = await API.searchJobs(term, 0, 1);
                        if (matches.length === 0) { this.setStatus(`No exact matches for "${term}".`, 'error'); el('rapid-input').disabled = false; el('rapid-input').focus(); }
                        else if (matches.length === 1) { this.previewJob(matches[0]); }
                        else {
                            this.setStatus(`Found ${matches.length} matches. Select one:`, 'warning');
                            const ties = this.getEl('rapid-tiebreaker-list'); ties.innerHTML = '';
                            matches.forEach(m => { const btn = document.createElement('button'); btn.className = 'fc-tie-btn'; btn.innerHTML = `<div style="font-size:14px; font-weight:bold; color:#4cd137; margin-bottom:2px;">${m.pet}</div><div style="font-size:12px; color:#fff;">Family: ${m.family}</div><div class="fc-tie-clinic">Clinic: ${m.clinic} | ID: ${m.reqId} | Crem ID: ${m.cremId}</div>`; btn.onclick = () => { ties.style.display = 'none'; ties.innerHTML = ''; this.previewJob(m); }; ties.appendChild(btn); });
                            ties.style.display = 'block';
                        }
                    } catch (err) { this.setStatus('Network error.', 'error'); el('rapid-input').disabled = false; el('rapid-input').focus(); }
                });

                el('rapid-clear-btn').addEventListener('click', () => { if (confirm('Clear the entire check-in log?')) { State.rapidLog = []; State.saveRapid(); this.renderLog(); this.setStatus('Log cleared.', 'neutral'); } });
                el('rapid-copy-btn').addEventListener('click', () => this.exportLog(false)); el('rapid-print-btn').addEventListener('click', () => this.exportLog(true));
            },

            toggleView(view) {
                const el = this.getEl;
                el('rapid-main-view').style.display = view === 'main' ? 'block' : 'none'; el('rapid-settings-view').style.display = view === 'settings' ? 'block' : 'none'; el('rapid-manual-view').style.display = view === 'manual' ? 'block' : 'none'; el('rapid-edit-view').style.display = view === 'edit' ? 'block' : 'none';
                if (view === 'settings') {
                    el('rapid-set-print').checked = State.settings.rapidAutoPrint;
                } else if (view === 'manual') {
                    ['pet', 'fam', 'clin', 'keep'].forEach(id => { el(`rapid-man-${id}`).value = ''; el(`rapid-man-${id}`).classList.remove('fc-shake'); }); el('rapid-man-pet').focus();
                } else if (view === 'edit') {
                    el('rapid-edit-pet').focus();
                } else { App.Drag.ensureInBounds(el('rapid-term')); el('rapid-input').focus(); }
            },

            setStatus(msg, type) { const colors = { neutral: '#aaa', success: '#4cd137', warning: '#ffd93d', error: '#ff6b6b' }; const st = this.getEl('rapid-status'); st.style.color = colors[type] || colors.neutral; st.textContent = msg; },
            cancelConfirm() { this.awaitingConfirm = false; this.pendingJob = null; this.getEl('rapid-confirm-box').style.display = 'none'; this.setStatus('Cancelled. Ready.', 'neutral'); App.Drag.ensureInBounds(this.getEl('rapid-term')); const inp = this.getEl('rapid-input'); inp.disabled = false; inp.focus(); },

            async previewJob(data) {
                if (State.rapidLog.some(e => e.jobId === data.jobId)) { AudioService.play('alert'); this.setStatus(`DUPLICATE: ${data.pet} is already logged!`, 'error'); this.getEl('rapid-input').disabled = false; this.getEl('rapid-input').focus(); return; }
                this.setStatus('Fetching details...', 'neutral');
                try {
                    const html = await API.getJobDetailsHTML(data.jobId); const doc = new DOMParser().parseFromString(html, 'text/html');
                    let tFam = 'Unknown', tClin = 'Unknown', tPet = 'Unknown', specReq = 'None';

                    doc.querySelectorAll('.inline_details_section').forEach(el => { const h4 = el.querySelector('h4'); if(h4) { const hdr = h4.innerText.trim(); if(hdr==='Family:') tFam = el.querySelector('h5') ? el.querySelector('h5').innerText.trim() : tFam; if(hdr==='Clinic:') tClin = el.querySelector('h5') ? el.querySelector('h5').innerText.trim() : tClin; if(hdr==='Pet:') tPet = el.querySelector('.request-detail-pet-name') ? el.querySelector('.request-detail-pet-name').innerText.trim() : tPet; } });
                    const specNode = doc.querySelector('.job_special_request'); if (specNode && specNode.innerText.trim()!=='') specReq = specNode.innerText.trim();
                    let kList = []; doc.querySelectorAll('.job-detail-items-section .custom-control-description').forEach(n => { let txt = n.innerText.trim().toLowerCase(), code = ''; if(txt.includes('clay paw')) code = 'CP'; else if(txt.includes('ink paw')) code = 'IP'; else if(txt.includes('ink nose')) code = 'IN'; else if(txt.includes('fur clip')||txt.includes('hair clip')) code = 'FC'; else if(txt.includes('photo')) code = 'PH'; else code = txt; let match = txt.match(/\(x(\d+)\)/); if(match && parseInt(match[1])>1 && code.length===2) code = match[1]+code; kList.push(code.toUpperCase()); });
                    const hasK = kList.length > 0; const kText = hasK ? kList.join(', ') : 'X';

                    this.pendingJob = { ...data, pet: Utils.formatPet(tPet), family: Utils.formatFamily(tFam), clinic: Utils.formatClinic(tClin), keepsakes: kText, hasKeepsakes: hasK };
                    this.getEl('rapid-confirm-box').innerHTML = `<div><span class="fc-confirm-label">Type:</span> <span class="fc-confirm-val" style="color:#3498db; font-weight:bold;">${data.type}</span></div><div><span class="fc-confirm-label">Pet:</span> <span class="fc-confirm-val">${this.pendingJob.pet}</span></div><div><span class="fc-confirm-label">Family:</span> <span class="fc-confirm-val">${this.pendingJob.family}</span></div><div><span class="fc-confirm-label">Clinic:</span> <span class="fc-confirm-val">${this.pendingJob.clinic}</span></div><div><span class="fc-confirm-label">Keepsakes:</span> <span class="fc-confirm-val" style="color:${hasK?'#4cd137':'#fff'}; font-weight:bold;">${kText}</span></div><div><span class="fc-confirm-label">Special:</span> <span class="fc-confirm-val" style="color:${specReq!=='None'?'#ff6b6b':'#fff'}; font-weight:bold;">${specReq}</span></div><div class="fc-confirm-warn">Press ENTER to confirm, or ESC to cancel.</div>`;
                    this.getEl('rapid-confirm-box').style.display = 'block'; App.Drag.ensureInBounds(this.getEl('rapid-term')); this.setStatus('Awaiting verification...', 'warning'); specReq !== 'None' ? AudioService.play('alert') : AudioService.play('found'); this.awaitingConfirm = true; this.getEl('rapid-input').disabled = false; this.getEl('rapid-input').focus();
                } catch (err) { this.setStatus('Failed to fetch details.', 'error'); this.getEl('rapid-input').disabled = false; this.getEl('rapid-input').focus(); }
            },

            async executeCheckIn() {
                if (!this.pendingJob || !this.awaitingConfirm) return;
                const job = this.pendingJob;
                this.pendingJob = null;
                this.awaitingConfirm = false;

                this.getEl('rapid-input').disabled = true;
                this.getEl('rapid-confirm-box').style.display = 'none';
                App.Drag.ensureInBounds(this.getEl('rapid-term'));
                this.setStatus(`Checking in ${job.pet}...`, 'neutral');

                try {
                    const res = await API.checkInJob(job.jobId);
                    if (res.queued) {
                        this.setStatus(`Offline: ${job.pet} saved to sync queue.`, 'warning');
                    } else {
                        if (job.hasKeepsakes && State.settings.rapidAutoPrint) {
                            this.setStatus('Sending to printer...', 'neutral');
                            const pf = document.createElement('iframe'); pf.style.display = 'none'; pf.src = `${CONFIG.endpoints.print}${job.jobId}`; document.body.appendChild(pf); pf.onload = () => { try { pf.contentWindow.focus(); pf.contentWindow.print(); } catch(e){} setTimeout(() => pf.remove(), 10000); };
                        }
                        this.setStatus(`Success: ${job.pet} Checked In.`, 'success');
                    }
                    State.rapidLog.push({ ...job, batch: State.rapidLog.length + 1, initials: State.settings.initials });
                    State.saveRapid();
                    this.renderLog();
                    AudioService.play('success');
                } catch (err) {
                    this.setStatus('Failed to process job.', 'error');
                }

                this.getEl('rapid-input').disabled = false;
                this.getEl('rapid-input').value = '';
                this.getEl('rapid-input').focus();
            },

            handleLogAction(e) {
                const action = e.target.getAttribute('data-action'), index = parseInt(e.target.getAttribute('data-index')), row = State.rapidLog[index]; if (!row) return;
                if (action === 'delete') {
                    if (confirm(`Remove ${row.pet} from the local log?`)) {
                        State.rapidLog.splice(index, 1); State.saveRapid(); this.renderLog();
                    }
                } else if (action === 'print') {
                    if (row.jobId.startsWith('manual-')) return;
                    this.setStatus(`Printing ${row.pet}...`, 'neutral'); const pf = document.createElement('iframe'); pf.style.display = 'none'; pf.src = `${CONFIG.endpoints.print}${row.jobId}`; document.body.appendChild(pf); pf.onload = () => { try { pf.contentWindow.focus(); pf.contentWindow.print(); } catch(err){} setTimeout(() => pf.remove(), 10000); };
                } else if (action === 'edit') {
                    const el = this.getEl; el('rapid-edit-index').value = index; el('rapid-edit-pet').value = row.pet; el('rapid-edit-fam').value = row.family; el('rapid-edit-clin').value = row.clinic; el('rapid-edit-keep').value = row.keepsakes === 'X' ? '' : row.keepsakes; this.toggleView('edit');
                }
            },

            renderLog() {
                const box = this.getEl('rapid-log-container'); box.innerHTML = '';
                if (!State.rapidLog.length) { box.style.display = 'none'; return; }
                box.style.display = 'block';

                const log = State.rapidLog;
                const toShow = State.viewAllRapid ? log : log.slice(-5);
                const startIndex = State.viewAllRapid ? 0 : Math.max(0, log.length - 5);

                if (!State.viewAllRapid && log.length > 5) {
                    box.innerHTML += `<button class="fc-view-all-btn" id="rapid-view-all">View All History (${log.length - 5} hidden)</button>`;
                } else if (State.viewAllRapid && log.length > 5) {
                    box.innerHTML += `<button class="fc-view-all-btn" id="rapid-view-all">Collapse History</button>`;
                }

                toShow.forEach((row, i) => {
                    const actualIndex = startIndex + i; const printDisabled = row.jobId.startsWith('manual-') ? 'disabled' : '';
                    box.innerHTML += `<div class="fc-log-entry"><span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${row.pet}">${row.batch}. ${row.pet}</span><span style="color:${row.hasKeepsakes ? '#4cd137' : '#888'}; max-width:30%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-right:65px;" title="${row.keepsakes}">[${row.keepsakes}]</span><div class="fc-log-actions"><button class="fc-action-icon" data-action="edit" data-index="${actualIndex}" title="Edit">✏️</button><button class="fc-action-icon" data-action="print" data-index="${actualIndex}" title="Print" ${printDisabled}>🖨️</button><button class="fc-action-icon" data-action="delete" data-index="${actualIndex}" title="Delete">🗑️</button></div></div>`;
                });

                const viewAllBtn = document.getElementById('rapid-view-all'); if (viewAllBtn) viewAllBtn.onclick = () => { State.viewAllRapid = !State.viewAllRapid; this.renderLog(); };
                box.querySelectorAll('.fc-action-icon').forEach(btn => { btn.onclick = (e) => this.handleLogAction(e); });
                App.Drag.ensureInBounds(this.getEl('rapid-term'));
            },

            exportLog(isPrint) {
                if (!State.rapidLog.length) return alert('Log empty!');
                const logLen = State.rapidLog.length;
                let plainText = "Batch\tPet Name\tFamily Name\tClinic\tKeepsakes\tInitials\n";
                let tableHtml = `<div><h3 style="font-family:-apple-system,sans-serif;">Communal Check-In Log</h3><table cellspacing="0" border="0" cellpadding="0" style="border-collapse:collapse;border:1.5pt solid black;font-family:'Lexend',sans-serif;font-size:10pt;width:100%;"><tr style="height:19.2pt;background-color:#bfbfbf;"><td style="border:1.5pt solid black;padding:4pt;text-align:center;width:8%;"><b>Batch</b></td><td style="border:1.5pt solid black;padding:4pt;width:24%;"><b>Pet Name</b></td><td style="border:1.5pt solid black;padding:4pt;width:24%;"><b>Family Name</b></td><td style="border:1.5pt solid black;padding:4pt;width:24%;"><b>Clinic</b></td><td style="border:1.5pt solid black;padding:4pt;text-align:center;width:12%;"><b>Keepsakes</b></td><td style="border:1.5pt solid black;padding:4pt;text-align:center;width:8%;"><b>Initials</b></td></tr>`;

                for (let i = 0; i < logLen; i++) {
                    const r = State.rapidLog[i];
                    let rB = i + 1, rP = r.pet||'', rF = r.family||'', rC = r.clinic||'', rK = r.keepsakes||'', rI = r.initials||'';
                    plainText += `${rB}\t${rP}\t${rF}\t${rC}\t${rK}\t${rI}\n`;
                    let bg = (i % 2 === 0) ? 'background-color:#ededed;' : 'background-color:#ffffff;'; let bBtm = (i === logLen - 1) ? '1.5pt' : '0.5pt';
                    tableHtml += `<tr style="height:19.2pt; ${bg}"><td style="padding:4pt; border-left:1.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black; text-align:center;"><b>${rB}</b></td><td style="padding:4pt; border-left:0.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black;">${rP}</td><td style="padding:4pt; border-left:0.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black;">${rF}</td><td style="padding:4pt; border-left:0.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black;">${rC}</td><td style="padding:4pt; border-left:0.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black; text-align:center;"><b>${rK}</b></td><td style="padding:4pt; border-left:0.5pt solid black; border-right:1.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black; text-align:center;">${rI}</td></tr>`;
                }
                tableHtml += `</table></div>`;
                let wordHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body>${tableHtml}</body></html>`;

                if (isPrint) {
                    let tableRows = ''; State.rapidLog.forEach((row, index) => { let printBgStyle = (index % 2 === 0) ? 'background-color:#ededed;' : 'background-color:#ffffff;'; tableRows += `<tr style="${printBgStyle}"><td style="text-align:center;">${row.batch}</td><td>${row.pet}</td><td>${row.family}</td><td>${row.clinic}</td><td style="text-align:center; font-size:11px; font-weight:bold;">${row.keepsakes}</td><td style="text-align:center;">${row.initials}</td></tr>`; });
                    let allPagesHtml = `<div class="page"><div class="header-sec"><span>Communal Check-In Log</span><span>Date: <span style="text-decoration:underline;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></div><table><thead><tr><th style="width:8%;text-align:center;">Batch</th><th style="width:20%;">Pet Name</th><th style="width:20%;">Family Name</th><th style="width:32%;">Clinic</th><th style="width:12%;text-align:center;">Keepsakes</th><th style="width:8%;text-align:center;">Initials</th></tr></thead><tbody>${tableRows}</tbody></table></div>`;

                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`<html><head><title>Communal Check-In Log</title><style>
                        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap');
                        body{font-family:'Lexend',-apple-system,sans-serif;padding:0;margin:0;color:#000;box-sizing:border-box;}
                        .page{box-sizing:border-box;padding:0.4in;}
                        .header-sec{display:flex;justify-content:space-between;font-size:18px;font-weight:bold;margin-bottom:12px;}
                        table{width:100%;border-collapse:collapse;font-size:13px;table-layout:fixed;}
                        th,td{border:1px solid #000;padding:4px 6px;text-align:left;height:23px;overflow:hidden;white-space:nowrap;}
                        th{background-color:#f2f2f2;font-weight:bold;}
                        @media print{body{padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}@page{size:letter portrait;margin:0;}}
                    </style></head><body>${allPagesHtml}</body></html>`);
                    printWindow.document.close(); setTimeout(() => printWindow.focus(), 500);
                } else { Utils.copyToClipboard(wordHtml, plainText, 'rapid-copy-btn'); this.getEl('rapid-input').focus(); }
            }
        },

        Comm: {
            awaitingConfirm: false, pendingJob: null, getEl: (id) => document.getElementById(id),
            init() { this.bindEvents(); },
            applySettings() {
                this.getEl('comm-weight').style.display = State.settings.commWeightMode === 'numeric' ? 'block' : 'none';
                const count = State.settings.commPalletCount || 2;
                for(let i=1; i<=4; i++) { const btn = this.getEl(`comm-pal-${i}`); if(btn) btn.style.display = i <= count ? 'block' : 'none'; }
                if (State.activePallet > count) this.setPallet(1);
                this.renderLog();
            },
            setPallet(num) { State.activePallet = num; [1, 2, 3, 4].forEach(n => this.getEl(`comm-pal-${n}`)?.classList.toggle('active', n === num)); const lbl = this.getEl('comm-man-pal-lbl'); if (lbl) lbl.innerText = num; if (!this.getEl('comm-input').disabled) this.getEl('comm-input').focus(); },
            bindEvents() {
                const el = this.getEl;
                [1, 2, 3, 4].forEach(n => el(`comm-pal-${n}`)?.addEventListener('click', () => this.setPallet(n)));
                el('comm-settings-btn').addEventListener('click', () => this.toggleView('settings')); el('comm-manual-btn').addEventListener('click', () => this.toggleView('manual')); el('comm-settings-cancel').addEventListener('click', () => this.toggleView('main')); el('comm-man-cancel').addEventListener('click', () => this.toggleView('main')); el('comm-edit-cancel').addEventListener('click', () => this.toggleView('main'));

                el('comm-term').addEventListener('keydown', e => { if (e.key === 'Escape') { if (this.awaitingConfirm) this.cancelConfirm(); else if (el('comm-settings-view').style.display === 'block' || el('comm-manual-view').style.display === 'block' || el('comm-edit-view').style.display === 'block') this.toggleView('main'); else document.getElementById('comm-minimize-btn').click(); } });

                el('comm-settings-save').addEventListener('click', () => {
                    let pc = parseInt(el('comm-set-pallets').value) || 2; if(pc < 1) pc = 1; if(pc > 4) pc = 4;
                    // Shrink Validation
                    const maxUsed = State.commLog.reduce((max, r) => Math.max(max, r.pallet), 1);
                    if (pc < maxUsed) {
                        el('comm-set-pallets').classList.remove('fc-shake'); void el('comm-set-pallets').offsetWidth; el('comm-set-pallets').classList.add('fc-shake');
                        AudioService.play('alert'); this.setStatus(`Error: You must remove all pets from Pallet ${maxUsed} first.`, 'error'); return;
                    }
                    State.settings.commSummaryFormat = el('comm-set-summary').value; State.settings.commExportFormat = el('comm-set-export').value; State.settings.commColorCode = el('comm-set-color').checked; State.settings.commPalletCount = pc; State.settings.commWeightMode = el('comm-set-wmode').value; State.settings.commSWeight = parseInt(el('comm-set-sw').value) || 10; State.settings.commMWeight = parseInt(el('comm-set-mw').value) || 35; State.settings.commLWeight = parseInt(el('comm-set-lw').value) || 70; State.settings.maxCombinedWeight = parseInt(el('comm-set-maxwt').value) || 3000;
                    State.saveSettings(); this.applySettings(); this.toggleView('main'); this.setStatus('Settings saved.', 'success');
                });

                el('comm-type-fc').addEventListener('click', () => { el('comm-type-fc').classList.add('active'); el('comm-type-stray').classList.remove('active'); el('comm-man-pet').value = ''; el('comm-man-pet').disabled = false; el('comm-man-fam').value = ''; el('comm-man-fam').disabled = false; el('comm-man-fam').style.opacity = '1'; el('comm-man-pet').focus(); });
                el('comm-type-stray').addEventListener('click', () => { el('comm-type-stray').classList.add('active'); el('comm-type-fc').classList.remove('active'); el('comm-man-pet').value = 'Stray/Wildlife'; el('comm-man-fam').value = ''; el('comm-man-fam').disabled = true; el('comm-man-fam').style.opacity = '0.4'; el('comm-man-clin').focus(); });

                const finalizeCommManual = (pName, pFam, pClin, kText, numW, sizeVal) => {
                    State.commLog.push({ jobId: 'manual-' + Date.now(), batch: State.commLog.length + 1, pallet: State.activePallet, size: sizeVal, weightNum: numW, pet: pName, family: pFam, clinic: pClin, keepsakes: kText, hasKeepsakes: kText !== 'X', initials: State.settings.initials });
                    State.saveComm(); this.renderLog(); AudioService.play('success'); this.setStatus(`Success: Logged ${pName} to Pallet ${State.activePallet}.`, 'success'); el('comm-weight').value = ''; this.toggleView('main');
                    el('comm-man-acr-prompt').style.display = 'none';
                };

                const submitManual = () => {
                    const rawPet = el('comm-man-pet').value.trim();
                    const isStray = el('comm-type-stray').classList.contains('active');
                    if (!rawPet && !isStray) { AudioService.play('alert'); const pInput = el('comm-man-pet'); pInput.classList.remove('fc-shake'); void pInput.offsetWidth; pInput.classList.add('fc-shake'); return pInput.focus(); }

                    let numW = 0; if (State.settings.commWeightMode === 'numeric') { numW = parseFloat(el('comm-weight').value) || 0; if(numW === 0) { alert("Please enter numeric weight in main view first."); this.toggleView('main'); el('comm-weight').focus(); return; } }

                    const pName = isStray && !rawPet ? 'Stray/Wildlife' : rawPet;
                    const pFam = isStray ? '' : el('comm-man-fam').value.trim();
                    const rawClin = el('comm-man-clin').value.trim();
                    const kText = el('comm-man-keep').value.trim().toUpperCase() || 'X';
                    const sizeVal = el('comm-man-size').value;

                    const match = Utils.suggestClinicAcronym(rawClin);
                    if (match) {
                        const promptBox = el('comm-man-acr-prompt');
                        promptBox.innerHTML = `<div>Clinic Match: <b>${match.original}</b><br>Use acronym <b>${match.acronym}</b>?</div><div class="fc-btn-row" style="margin-top:10px;"><button id="cm-acr-yes" class="fc-action-btn">Yes</button><button id="cm-acr-no" class="fc-action-btn-clear" style="background:#5a5a5a;">No</button></div>`;
                        promptBox.style.display = 'block';
                        el('cm-acr-yes').onclick = () => finalizeCommManual(pName, pFam, match.acronym, kText, numW, sizeVal);
                        el('cm-acr-no').onclick = () => finalizeCommManual(pName, pFam, rawClin, kText, numW, sizeVal);
                    } else {
                        finalizeCommManual(pName, pFam, rawClin, kText, numW, sizeVal);
                    }
                };
                el('comm-man-submit').addEventListener('click', submitManual); ['comm-man-pet', 'comm-man-fam', 'comm-man-clin', 'comm-man-size', 'comm-man-keep'].forEach(id => { el(id).addEventListener('keypress', e => { if (e.key === 'Enter') submitManual(); }); });

                const finalizeCommEdit = (idx, row, ePet, eFam, eClin, newKeep, newWeight, sizeVal) => {
                    State.commLog[idx] = { ...row, pet: ePet || row.pet, family: eFam, clinic: eClin, size: sizeVal, weightNum: newWeight, keepsakes: newKeep || 'X', hasKeepsakes: newKeep !== '' && newKeep !== 'X' };
                    State.saveComm(); this.renderLog(); this.toggleView('main'); this.setStatus('Record updated.', 'success');
                    el('comm-edit-acr-prompt').style.display = 'none';
                };

                el('comm-edit-save').addEventListener('click', () => {
                    const idx = el('comm-edit-index').value, row = State.commLog[idx]; if(!row) return;
                    const ePet = el('comm-edit-pet').value.trim();
                    const eFam = el('comm-edit-fam').value.trim();
                    const rawClin = el('comm-edit-clin').value.trim();
                    const newKeep = el('comm-edit-keep').value.trim().toUpperCase();
                    const sizeVal = el('comm-edit-size').value;
                    let newWeight = row.weightNum; if (State.settings.commWeightMode === 'numeric') { newWeight = parseFloat(el('comm-edit-weight').value) || 0; }

                    const match = Utils.suggestClinicAcronym(rawClin);
                    if (match) {
                        const promptBox = el('comm-edit-acr-prompt');
                        promptBox.innerHTML = `<div>Clinic Match: <b>${match.original}</b><br>Use acronym <b>${match.acronym}</b>?</div><div class="fc-btn-row" style="margin-top:10px;"><button id="ce-acr-yes" class="fc-action-btn">Yes</button><button id="ce-acr-no" class="fc-action-btn-clear" style="background:#5a5a5a;">No</button></div>`;
                        promptBox.style.display = 'block';
                        el('ce-acr-yes').onclick = () => finalizeCommEdit(idx, row, ePet, eFam, match.acronym, newKeep, newWeight, sizeVal);
                        el('ce-acr-no').onclick = () => finalizeCommEdit(idx, row, ePet, eFam, rawClin, newKeep, newWeight, sizeVal);
                    } else {
                        finalizeCommEdit(idx, row, ePet, eFam, rawClin, newKeep, newWeight, sizeVal);
                    }
                });
                el('comm-weight').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if(el('comm-input').value.trim()!=='') el('comm-input').dispatchEvent(new KeyboardEvent('keypress',{'key':'Enter'})); else el('comm-input').focus(); } });
                el('comm-input').addEventListener('keypress', async e => { if (e.key !== 'Enter') return; if (this.awaitingConfirm) { e.preventDefault(); await this.executeCheckIn(); return; } const term = el('comm-input').value.trim(); if (!term) return; let numW = 0; if (State.settings.commWeightMode === 'numeric') { numW = parseFloat(el('comm-weight').value) || 0; if(numW===0 && term.toLowerCase()!=='test') { this.setStatus("Enter numeric weight first.", 'warning'); el('comm-weight').focus(); return; } } if (term.toLowerCase() === 'test') { el('comm-input').value = ''; el('comm-weight').value = ''; let testArr = [{p:'Garfield',s:'Large',pal:1},{p:'Snoopy',s:'Medium',pal:1},{p:'Scooby',s:'Large',pal:1},{p:'Tom',s:'Small',pal:2},{p:'Pluto',s:'Medium',pal:2},{p:'Goofy',s:'Large',pal:2}]; if (State.settings.commPalletCount > 2) testArr.push({p:'Porky',s:'Medium',pal:3}); if (State.settings.commPalletCount > 3) testArr.push({p:'Bugs',s:'Small',pal:4}); testArr.forEach((d,i) => { let w = d.s==='Small'?12 : d.s==='Medium'?40 : 85; State.commLog.push({ jobId:'test-'+Date.now()+'-'+i, batch:State.commLog.length+1, pallet:d.pal, size:d.s, weightNum:w, pet:d.p, family:'Fam', clinic:'Vet', keepsakes:'X', hasKeepsakes:false, initials:State.settings.initials }); }); State.saveComm(); this.renderLog(); this.setStatus('Secret: Fake records injected.', 'success'); AudioService.play('success'); return; } el('comm-input').value = ''; el('comm-input').disabled = true; el('comm-tiebreaker-list').style.display = 'none'; el('comm-confirm-box').style.display = 'none'; this.setStatus(`Searching for "${term}"...`, 'neutral'); try { const matches = await API.searchJobs(term, 1, 0); if (matches.length === 0) { this.setStatus(`No exact matches for "${term}".`, 'error'); el('comm-input').disabled = false; el('comm-input').focus(); } else if (matches.length === 1) { this.previewJob(matches[0]); } else { this.setStatus(`Found ${matches.length} matches. Select one:`, 'warning'); const ties = this.getEl('comm-tiebreaker-list'); ties.innerHTML = ''; matches.forEach(m => { const btn = document.createElement('button'); btn.className = 'fc-tie-btn'; btn.innerHTML = `<div style="font-size:14px; font-weight:bold; color:#3498db; margin-bottom:2px;">${m.pet}</div><div style="font-size:12px; color:#fff;">Family: ${m.family}</div><div class="fc-tie-clinic">Clinic: ${m.clinic} | ID: ${m.reqId} | Crem ID: ${m.cremId}</div>`; btn.onclick = () => { ties.style.display = 'none'; ties.innerHTML = ''; this.previewJob(m); }; ties.appendChild(btn); }); ties.style.display = 'block'; } } catch (err) { this.setStatus('Network error.', 'error'); el('comm-input').disabled = false; el('comm-input').focus(); } });

                el('comm-clear-btn').addEventListener('click', () => { if (confirm('Clear entire communal log?')) { State.commLog = []; State.saveComm(); this.renderLog(); this.setStatus('Log cleared.', 'neutral'); } });
                el('comm-copy-btn').addEventListener('click', () => this.exportLog(false)); el('comm-print-btn').addEventListener('click', () => this.exportLog(true));
            },

            toggleView(view) {
                const el = this.getEl;
                el('comm-main-view').style.display = view === 'main' ? 'block' : 'none'; el('comm-settings-view').style.display = view === 'settings' ? 'block' : 'none'; el('comm-manual-view').style.display = view === 'manual' ? 'block' : 'none'; el('comm-edit-view').style.display = view === 'edit' ? 'block' : 'none';
                if (view === 'settings') {
                    el('comm-set-summary').value = State.settings.commSummaryFormat; el('comm-set-export').value = State.settings.commExportFormat || 'combined'; el('comm-set-color').checked = State.settings.commColorCode; el('comm-set-pallets').value = State.settings.commPalletCount || 2; el('comm-set-wmode').value = State.settings.commWeightMode; el('comm-set-sw').value = State.settings.commSWeight; el('comm-set-mw').value = State.settings.commMWeight; el('comm-set-lw').value = State.settings.commLWeight; el('comm-set-maxwt').value = State.settings.maxCombinedWeight || 3000;
                } else if (view === 'manual') {
                    el('comm-type-fc').click(); el('comm-man-clin').value = ''; el('comm-man-size').value = 'Small'; el('comm-man-keep').value = ''; el('comm-man-pal-lbl').innerText = State.activePallet; ['pet', 'fam', 'clin', 'keep'].forEach(id => { const input = el(`comm-man-${id}`); if(input) { input.value = ''; input.classList.remove('fc-shake'); } });
                } else if (view === 'edit') {
                    el('comm-edit-pet').focus();
                } else { App.Drag.ensureInBounds(el('comm-term')); el('comm-input').focus(); }
            },

            setStatus(msg, type) { const colors = { neutral: '#aaa', success: '#4cd137', warning: '#ffd93d', error: '#ff6b6b' }; const st = this.getEl('comm-status'); st.style.color = colors[type] || colors.neutral; st.textContent = msg; },
            cancelConfirm() { this.awaitingConfirm = false; this.pendingJob = null; this.getEl('comm-confirm-box').style.display = 'none'; this.setStatus('Cancelled. Ready.', 'neutral'); App.Drag.ensureInBounds(this.getEl('comm-term')); const inp = this.getEl('comm-input'); inp.disabled = false; inp.focus(); },

            async previewJob(data) {
                if (State.commLog.some(e => e.jobId === data.jobId)) { AudioService.play('alert'); this.setStatus(`DUPLICATE: ${data.pet} is already in log!`, 'error'); this.getEl('comm-input').disabled = false; this.getEl('comm-input').focus(); return; }
                this.setStatus('Fetching details...', 'neutral');
                try {
                    const html = await API.getJobDetailsHTML(data.jobId); const doc = new DOMParser().parseFromString(html, 'text/html');
                    let tFam = 'Unknown', tClin = 'Unknown', tPet = 'Unknown', tSize = 'Unknown';

                    doc.querySelectorAll('.inline_details_section').forEach(el => { const h4 = el.querySelector('h4'); if(h4) { const hdr = h4.innerText.trim(); if(hdr==='Family:') tFam = el.querySelector('h5') ? el.querySelector('h5').innerText.trim() : tFam; if(hdr==='Clinic:') tClin = el.querySelector('h5') ? el.querySelector('h5').innerText.trim() : tClin; if(hdr==='Pet:') tPet = el.querySelector('.request-detail-pet-name') ? el.querySelector('.request-detail-pet-name').innerText.trim() : tPet; if(hdr==='Size:') tSize = el.querySelector('h6') ? el.querySelector('h6').innerText.trim() : tSize; } });
                    let kList = []; doc.querySelectorAll('.job-detail-items-section .custom-control-description').forEach(n => { let txt = n.innerText.trim().toLowerCase(), code = ''; if(txt.includes('clay paw')) code = 'CP'; else if(txt.includes('ink paw')) code = 'IP'; else if(txt.includes('ink nose')) code = 'IN'; else if(txt.includes('fur clip')||txt.includes('hair clip')) code = 'FC'; else if(txt.includes('photo')) code = 'PH'; else code = txt; let match = txt.match(/\(x(\d+)\)/); if(match && parseInt(match[1])>1 && code.length===2) code = match[1]+code; kList.push(code.toUpperCase()); });
                    const hasK = kList.length > 0; const kText = hasK ? kList.join(', ') : 'X';

                    this.pendingJob = { ...data, pet: Utils.formatPet(tPet), family: Utils.formatFamily(tFam), clinic: Utils.formatClinic(tClin), keepsakes: kText, hasKeepsakes: hasK, size: tSize };
                    const actW = (State.settings.commWeightMode === 'numeric') ? `${this.getEl('comm-weight').value} lbs` : tSize;
                    this.getEl('comm-confirm-box').innerHTML = `<div><span class="fc-confirm-label">Pallet:</span> <span class="fc-confirm-val" style="color:#3498db; font-weight:bold;">${State.activePallet}</span></div><div><span class="fc-confirm-label">Weight:</span> <span class="fc-confirm-val" style="color:#3498db; font-weight:bold;">${actW}</span></div><div><span class="fc-confirm-label">Type:</span> <span class="fc-confirm-val" style="color:#3498db; font-weight:bold;">${data.type}</span></div><div><span class="fc-confirm-label">Pet:</span> <span class="fc-confirm-val">${this.pendingJob.pet}</span></div><div><span class="fc-confirm-label">Family:</span> <span class="fc-confirm-val">${this.pendingJob.family}</span></div><div><span class="fc-confirm-label">Keepsakes:</span> <span class="fc-confirm-val" style="color:${hasK?'#4cd137':'#fff'}; font-weight:bold;">${kText}</span></div><div class="fc-confirm-warn">Press ENTER to confirm to Pallet ${State.activePallet}.</div>`;
                    this.getEl('comm-confirm-box').style.display = 'block'; App.Drag.ensureInBounds(this.getEl('comm-term')); this.setStatus('Awaiting verification...', 'warning'); AudioService.play('found'); this.awaitingConfirm = true; this.getEl('comm-input').disabled = false; this.getEl('comm-input').focus();
                } catch (err) { this.setStatus('Failed to fetch details.', 'error'); this.getEl('comm-input').disabled = false; this.getEl('comm-input').focus(); }
            },

            async executeCheckIn() {
                if (!this.pendingJob || !this.awaitingConfirm) return;
                const job = this.pendingJob;
                this.pendingJob = null;
                this.awaitingConfirm = false;

                this.getEl('comm-input').disabled = true;
                this.getEl('comm-confirm-box').style.display = 'none';
                App.Drag.ensureInBounds(this.getEl('comm-term'));
                this.setStatus(`Logging ${job.pet}...`, 'neutral');

                let numW = 0; if (State.settings.commWeightMode === 'numeric') { numW = parseFloat(this.getEl('comm-weight').value) || 0; }

                this.setStatus(`Success: Logged ${job.pet} to Pallet ${State.activePallet}.`, 'success');
                State.commLog.push({ ...job, batch: State.commLog.length + 1, pallet: State.activePallet, weightNum: numW, size: job.size, initials: State.settings.initials });
                State.saveComm();
                this.renderLog();
                AudioService.play('success');

                this.getEl('comm-input').disabled = false;
                if (State.settings.commWeightMode === 'numeric') { this.getEl('comm-weight').value = ''; }
                this.getEl('comm-input').value = '';
                this.getEl('comm-input').focus();
            },

            handleLogAction(e) {
                const action = e.target.getAttribute('data-action'), index = parseInt(e.target.getAttribute('data-index')), row = State.commLog[index]; if (!row) return;
                if (action === 'delete') {
                    if (confirm(`Remove ${row.pet} from the local log?`)) {
                        State.commLog.splice(index, 1); State.saveComm(); this.renderLog();
                    }
                } else if (action === 'print') {
                    if (row.jobId.startsWith('manual-')) return;
                    this.setStatus(`Printing ${row.pet}...`, 'neutral'); const pf = document.createElement('iframe'); pf.style.display = 'none'; pf.src = `${CONFIG.endpoints.print}${row.jobId}`; document.body.appendChild(pf); pf.onload = () => { try { pf.contentWindow.focus(); pf.contentWindow.print(); } catch(err){} setTimeout(() => pf.remove(), 10000); };
                } else if (action === 'edit') {
                    const el = this.getEl; el('comm-edit-index').value = index; el('comm-edit-pet').value = row.pet; el('comm-edit-fam').value = row.family; el('comm-edit-clin').value = row.clinic; el('comm-edit-size').value = row.size || 'Small'; el('comm-edit-keep').value = row.keepsakes === 'X' ? '' : row.keepsakes;
                    if (State.settings.commWeightMode === 'numeric') { el('comm-edit-weight-row').style.display = 'flex'; el('comm-edit-weight').value = row.weightNum; } else { el('comm-edit-weight-row').style.display = 'none'; }
                    this.toggleView('edit');
                }
            },

            renderLog() {
                const box = this.getEl('comm-log-container'); box.innerHTML = '';
                const stats = this.getCommStats(), totalWeight = stats.c.w, maxWeight = State.settings.maxCombinedWeight || 3000, pct = Math.min((totalWeight / maxWeight) * 100, 100);

                // Live Pallet Breakdown UI
                for (let j = 1; j <= 4; j++) {
                    const btn = this.getEl(`comm-pal-${j}`);
                    if (btn) btn.innerHTML = `Pallet ${j}<br><span style="font-size:10px; color:${State.activePallet === j ? '#fff' : '#888'}; font-weight:normal;">${stats[`p${j}`].s}S ${stats[`p${j}`].m}M ${stats[`p${j}`].l}L</span>`;
                }

                const bar = this.getEl('comm-capacity-bar'), txt = this.getEl('comm-capacity-text');
                if (bar && txt) { bar.style.width = `${pct}%`; if (pct < 60) bar.style.backgroundColor = '#2ecc71'; else if (pct < 90) bar.style.backgroundColor = '#ffd93d'; else bar.style.backgroundColor = '#ff6b6b'; txt.innerText = `${totalWeight} / ${maxWeight} lbs (Combined)`; }

                if (!State.commLog.length) { box.style.display = 'none'; return; }
                box.style.display = 'block';

                const log = State.commLog; const toShow = State.viewAllComm ? log : log.slice(-5); const startIndex = State.viewAllComm ? 0 : Math.max(0, log.length - 5);
                if (!State.viewAllComm && log.length > 5) { box.innerHTML += `<button class="fc-view-all-btn" id="comm-view-all">View All History (${log.length - 5} hidden)</button>`; } else if (State.viewAllComm && log.length > 5) { box.innerHTML += `<button class="fc-view-all-btn" id="comm-view-all">Collapse History</button>`; }

                toShow.forEach((row, i) => {
                    const actualIndex = startIndex + i; const printDisabled = row.jobId.startsWith('manual-') ? 'disabled' : ''; const sL = row.size ? row.size.charAt(0).toUpperCase() : 'U'; const weightStr = State.settings.commWeightMode === 'numeric' ? `${row.weightNum} lbs` : '';
                    box.innerHTML += `<div class="fc-log-entry"><span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${row.pet}"><strong>P${row.pallet} [${sL}]</strong> ${row.pet}</span><span style="color:${row.hasKeepsakes ? '#4cd137' : '#888'}; max-width:25%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-right:10px;" title="${row.keepsakes}">[${row.keepsakes}]</span><span style="color:#888; text-align:right; margin-right:65px; min-width:35px;">${weightStr}</span><div class="fc-log-actions"><button class="fc-action-icon" data-action="edit" data-index="${actualIndex}" title="Edit">✏️</button><button class="fc-action-icon" data-action="print" data-index="${actualIndex}" title="Print" ${printDisabled}>🖨️</button><button class="fc-action-icon" data-action="delete" data-index="${actualIndex}" title="Delete">🗑️</button></div></div>`;
                });

                const viewAllBtn = document.getElementById('comm-view-all'); if (viewAllBtn) viewAllBtn.onclick = () => { State.viewAllComm = !State.viewAllComm; this.renderLog(); };
                box.querySelectorAll('.fc-action-icon').forEach(btn => { btn.onclick = (e) => this.handleLogAction(e); });
                App.Drag.ensureInBounds(this.getEl('comm-term'));
            },

            getCommStats() {
                let s = { c: {s:0,m:0,l:0,t:0,w:0} };
                for(let i=1; i<=4; i++) s[`p${i}`] = {s:0,m:0,l:0,t:0,w:0};
                State.commLog.forEach(r => {
                    let tgt = s[`p${r.pallet}`] || s.p1; tgt.t++; s.c.t++;
                    let sz = r.size ? r.size.charAt(0).toUpperCase() : ''; if(sz==='S' || sz==='E') { tgt.s++; s.c.s++; } else if(sz==='M') { tgt.m++; s.c.m++; } else if(sz==='L') { tgt.l++; s.c.l++; }
                    let w = (State.settings.commWeightMode === 'numeric') ? (r.weightNum||0) : ((sz==='S' || sz==='E')?State.settings.commSWeight : sz==='M'?State.settings.commMWeight : State.settings.commLWeight); tgt.w += w; s.c.w += w;
                });
                return s;
            },

            genCommExport() {
                const st = this.getCommStats(); let sumHtml = '', tsv = "SUMMARY\nPallet #\tStart Time\tStart Temp\tSmall\tMedium\tLarge\tTotal Count\tCombined Weight\n";
                const hHtml = `<tr style="height:21.75pt;"><td width="75" style="width:56.15pt;background-color:#bfbfbf;padding:0pt 5.4pt;border-left:1.5pt solid #000000;border-top:1.5pt solid #000000;border-right:2.25pt solid #000000;border-bottom:1.5pt solid #000000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:9pt;color:#000000;"><b>Pallet #</b></span></p></td><td width="80" style="width:60.25pt;background-color:#bfbfbf;padding:0pt 5.4pt;border-left:2.25pt solid #000000;border-top:1.5pt solid #000000;border-right:0.5pt solid #000000;border-bottom:1.5pt solid #000000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:9pt;color:#000000;"><b>Start Time</b></span></p></td><td width="80" style="width:60.25pt;background-color:#bfbfbf;padding:0pt 5.4pt;border-left:0.5pt solid #000000;border-top:1.5pt solid #000000;border-right:2.25pt solid #000000;border-bottom:1.5pt solid #000000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:9pt;color:#000000;"><b>Start Temp</b></span></p></td><td width="97" style="width:72.7pt;background-color:#bfbfbf;padding:0pt 5.4pt;border-left:2.25pt solid #000000;border-top:1.5pt solid #000000;border-right:0.5pt solid #000000;border-bottom:1.5pt solid #000000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:9pt;color:#000000;"><b>Small</b></span></p></td><td width="97" style="width:72.7pt;background-color:#bfbfbf;padding:0pt 5.4pt;border-left:0.5pt solid #000000;border-top:1.5pt solid #000000;border-right:0.5pt solid #000000;border-bottom:1.5pt solid #000000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:9pt;color:#000000;"><b>Medium</b></span></p></td><td width="97" style="width:72.7pt;background-color:#bfbfbf;padding:0pt 5.4pt;border-left:0.5pt solid #000000;border-top:1.5pt solid #000000;border-right:1.5pt solid #000000;border-bottom:1.5pt solid #000000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:9pt;color:#000000;"><b>Large</b></span></p></td><td width="97" style="width:72.7pt;background-color:#bfbfbf;padding:0pt 5.4pt;border-left:1.5pt solid #000000;border-top:1.5pt solid #000000;border-right:2.25pt solid #000000;border-bottom:1.5pt solid #000000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:9pt;color:#000000;"><b>Total</b></span></p></td><td width="97" style="width:72.7pt;background-color:#bfbfbf;padding:0pt 5.4pt;border-left:2.25pt solid #000000;border-top:1.5pt solid #000000;border-right:1.5pt solid #000000;border-bottom:1.5pt solid #000000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:9pt;color:#000000;"><b>Combined Weight</b></span></p></td></tr>`;
                const buildRow = (lbl, S, M, L, T, W, bg, isL) => { let bb = isL?'1.5pt':'0.5pt'; return `<tr style="height:38.8pt;"><td style="width:56.15pt;background-color:${bg};padding:0pt 5.4pt;border-left:1.5pt solid #000;border-top:0.5pt solid #000;border-right:2.25pt solid #000;border-bottom:${bb} solid #000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:10pt;color:#000;"><b>${lbl}</b></span></p></td><td style="width:60.25pt;background-color:${bg};padding:0pt 5.4pt;border-left:2.25pt solid #000;border-top:0.5pt solid #000;border-right:0.5pt solid #000;border-bottom:${bb} solid #000;"></td><td style="width:60.25pt;background-color:${bg};padding:0pt 5.4pt;border-left:0.5pt solid #000;border-top:0.5pt solid #000;border-right:2.25pt solid #000;border-bottom:${bb} solid #000;"></td><td style="width:72.7pt;background-color:${bg};padding:0pt 5.4pt;border-left:2.25pt solid #000;border-top:0.5pt solid #000;border-right:0.5pt solid #000;border-bottom:${bb} solid #000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:10pt;color:#000;">${S}</span></p></td><td style="width:72.7pt;background-color:${bg};padding:0pt 5.4pt;border-left:0.5pt solid #000;border-top:0.5pt solid #000;border-right:0.5pt solid #000;border-bottom:${bb} solid #000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:10pt;color:#000;">${M}</span></p></td><td style="width:72.7pt;background-color:${bg};padding:0pt 5.4pt;border-left:0.5pt solid #000;border-top:0.5pt solid #000;border-right:1.5pt solid #000;border-bottom:${bb} solid #000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:10pt;color:#000;">${L}</span></p></td><td style="width:72.7pt;background-color:${bg};padding:0pt 5.4pt;border-left:1.5pt solid #000;border-top:0.5pt solid #000;border-right:2.25pt solid #000;border-bottom:${bb} solid #000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:10pt;color:#000;"><b>${T}</b></span></p></td><td style="width:72.7pt;background-color:${bg};padding:0pt 5.4pt;border-left:2.25pt solid #000;border-top:0.5pt solid #000;border-right:1.5pt solid #000;border-bottom:${bb} solid #000;"><p style="text-align:center;margin:0;"><span style="font-family:'Lexend';font-size:10pt;color:#000;"><b>${W}</b></span></p></td></tr>`; };

                const isSeparate = State.settings.commExportFormat === 'separate'; let logHtml = ''; let tsvLog = "\nLOG\n"; const pCount = State.settings.commPalletCount || 2; let palletsToExport = isSeparate ? Array.from({length: pCount}, (_, i) => i + 1) : [0]; let isFirstTable = true;

                if (State.settings.commSummaryFormat === 'split') {
                    for(let i=1; i<=pCount; i++) {
                        tsv += `Pallet ${i}\t\t\t${st[`p${i}`].s}\t${st[`p${i}`].m}\t${st[`p${i}`].l}\t${st[`p${i}`].t}\t${st[`p${i}`].w}\n`;
                        sumHtml += buildRow(`${i}`, st[`p${i}`].s, st[`p${i}`].m, st[`p${i}`].l, st[`p${i}`].t, st[`p${i}`].w, (i%2!==0?'#ededed':'#ffffff'), false);
                    }
                    if (pCount > 1) {
                        sumHtml += buildRow('All', st.c.s, st.c.m, st.c.l, st.c.t, st.c.w, (pCount%2!==0?'#ffffff':'#ededed'), true);
                        tsv += `All\t\t\t${st.c.s}\t${st.c.m}\t${st.c.l}\t${st.c.t}\t${st.c.w}\n`;
                    } else { sumHtml = sumHtml.replace('border-bottom:0.5pt', 'border-bottom:1.5pt'); }
                } else {
                    let combinedLabel = Array.from({length: pCount}, (_, i) => i + 1).join(pCount>2?', ':' & ').replace(/, ([^,]*)$/, ' & $1');
                    if (pCount === 1) combinedLabel = "1"; tsv += `${combinedLabel}\t\t\t${st.c.s}\t${st.c.m}\t${st.c.l}\t${st.c.t}\t${st.c.w}\n`; sumHtml += buildRow(combinedLabel, st.c.s, st.c.m, st.c.l, st.c.t, st.c.w, '#ededed', true);
                }
                const sizeRank = (s) => { if(!s) return 99; let c = s.charAt(0).toUpperCase(); if(c==='S' || c==='E') return 1; if(c==='M') return 2; if(c==='L') return 3; return 4; };

                palletsToExport.forEach(palletNum => {
                    let pLog = []; if (isSeparate) { pLog = [...State.commLog].filter(r => r.pallet === palletNum); if (pLog.length === 0) return; } else { pLog = [...State.commLog]; }
                    pLog.sort((a, b) => { if (!isSeparate && a.pallet !== b.pallet) return a.pallet - b.pallet; return sizeRank(a.size) - sizeRank(b.size); });

                    let heading = isSeparate ? `Communal Cremation Log - Pallet ${palletNum}` : `Communal Cremation Log`;
                    if (isSeparate) tsvLog += `\n--- PALLET ${palletNum} ---\nBatch\tWeight\tPet Name\tFamily Name\tClinic\tKeepsakes\tInitials\n`; else tsvLog += `Batch\tWeight\tPet Name\tFamily Name\tClinic\tKeepsakes\tInitials\n`;

                    let pageBreakStyle = (!isFirstTable && isSeparate) ? 'page-break-before: always; break-before: page;' : ''; isFirstTable = false;
                    let tableHtml = `<div style="${pageBreakStyle}"><h3 style="font-family:-apple-system,sans-serif;">${heading}</h3><table cellspacing="0" border="0" cellpadding="0" style="border-collapse:collapse;border:1.5pt solid black;font-family:'Lexend',sans-serif;font-size:10pt;width:100%;"><tr style="height:19.2pt;background-color:#bfbfbf;"><td style="border:1.5pt solid black;padding:4pt;text-align:center;width:8%;"><b>Batch</b></td><td style="border:1.5pt solid black;padding:4pt;text-align:center;width:10%;"><b>Weight</b></td><td style="border:1.5pt solid black;padding:4pt;width:20%;"><b>Pet Name</b></td><td style="border:1.5pt solid black;padding:4pt;width:20%;"><b>Family Name</b></td><td style="border:1.5pt solid black;padding:4pt;width:22%;"><b>Clinic</b></td><td style="border:1.5pt solid black;padding:4pt;text-align:center;width:12%;"><b>Keepsakes</b></td><td style="border:1.5pt solid black;padding:4pt;text-align:center;width:8%;"><b>Initials</b></td></tr>`;

                    pLog.forEach((rowObj, index) => {
                        let rB = index+1, rW = '', rP = rowObj.pet||'', rF = rowObj.family||'', rC = rowObj.clinic||'', rK = rowObj.keepsakes||'', rI = rowObj.initials||'', pN = rowObj.pallet || palletNum;
                        rW = (State.settings.commWeightMode === 'numeric') ? (rowObj.weightNum?rowObj.weightNum:'') : (rowObj.size||'');
                        tsvLog += `${rB}\t${rW}\t${rP}\t${rF}\t${rC}\t${rK}\t${rI}\n`;

                        let bg = (index%2===0) ? 'background-color:#ededed;' : 'background-color:#ffffff;';
                        if(State.settings.commColorCode) { if (pN === 1) bg = 'background-color:#ffe0b2;'; else if (pN === 2) bg = 'background-color:#cce0ff;'; else if (pN === 3) bg = 'background-color:#c8e6c9;'; else if (pN === 4) bg = 'background-color:#f8cce6;'; }
                        let bBtm = (index === pLog.length - 1) ? '1.5pt' : '0.5pt';
                        tableHtml += `<tr style="height:19.2pt; ${bg}"><td style="padding:4pt; border-left:1.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black; text-align:center;"><b>${rB}</b></td><td style="padding:4pt; border-left:0.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black; text-align:center;">${rW}</td><td style="padding:4pt; border-left:0.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black;">${rP}</td><td style="padding:4pt; border-left:0.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black;">${rF}</td><td style="padding:4pt; border-left:0.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black;">${rC}</td><td style="padding:4pt; border-left:0.5pt solid black; border-right:0.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black; text-align:center;"><b>${rK}</b></td><td style="padding:4pt; border-left:0.5pt solid black; border-right:1.5pt solid black; border-top:0.5pt solid black; border-bottom:${bBtm} solid black; text-align:center;">${rI}</td></tr>`;
                    });
                    tableHtml += `</table></div>`; logHtml += tableHtml;
                });

                let wordHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><h3 style="font-family:-apple-system,sans-serif;">Communal Totals</h3><table cellspacing="0" border="0" cellpadding="0" style="margin-left:0pt;border-collapse:collapse;border:1.5pt solid black;margin-bottom:20pt;width:100%;">${hHtml}${sumHtml}</table>${logHtml}</body></html>`;

                return { wordHtml, tsv: tsv + tsvLog };
            },

            exportLog(isPrint) {
                if (!State.commLog.length) return alert('Log is empty!');
                const ex = this.genCommExport();
                if (isPrint) {
                    const pw = window.open('', '_blank');
                    pw.document.write(`<html><head><title>Communal Cremation Log</title><style>
                        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap');
                        body{font-family:'Lexend',-apple-system,sans-serif;padding:20px;color:#000;box-sizing:border-box;}
                        @media print{body{padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
                    </style></head><body>${ex.wordHtml}</body></html>`);
                    pw.document.close(); setTimeout(() => pw.focus(), 500);
                } else {
                    Utils.copyToClipboard(ex.wordHtml, ex.tsv, 'comm-copy-btn');
                    this.getEl('comm-input').focus();
                }
            }
        }
    };

    // --- Initialization Trigger ---
    if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(() => App.init(), 1);
    else window.addEventListener("DOMContentLoaded", () => App.init());

})();
