import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        // General
        "appName": "ResQ-DMS",
        "tagline": "Disaster Management System",
        "welcome": "Welcome Back",
        "overview": "Overview of current status",
        "active": "Active",
        "donate": "Donate",
        "staffLogin": "Staff Login",
        "logout": "Logout",
        "settings": "Settings",
        "theme": "Theme",
        "language": "Language",
        "role": "Switch Role",
        "cancel": "Cancel",
        "search": "Search...",
        "filter": "Filter",
        "registerNew": "Register New",
        "addNew": "Add New",
        "updateStatus": "Update Status",
        "submit": "Submit",
        "save": "Save Changes",
        "close": "Close",
        "edit": "Edit",
        "delete": "Delete",
        "viewDetails": "View Details",
        "confirm": "Confirm",
        "phone": "Phone",
        "email": "Email",
        "address": "Address",
        "location": "Location",
        "capacity": "Capacity",
        "status": "Status",

        // Modules / Nav
        "nav.dashboard": "Dashboard",
        "nav.alerts": "Alerts & Updates",
        "nav.riskMap": "Risk Map",
        "nav.camps": "Relief Camps",
        "nav.safeHomes": "Safe Homes",
        "nav.refugees": "Refugees",
        "nav.missing": "Missing Persons",
        "nav.volunteers": "Volunteers",
        "nav.directory": "Directory",
        "nav.home": "Home",
        "nav.shelters": "Shelters",

        // Home / Landing
        "hero.title": "Disaster Management & Relief System",
        "hero.subtitle": "Coordinating relief efforts, managing resources, and connecting people during emergencies.",
        "hero.cta": "View Live Status",
        "stats.camps": "Active Camps",
        "stats.people": "People Sheltered",
        "stats.volunteers": "Volunteers Active",
        "stats.missing": "Thinking of You",

        // Cards
        "card.safeHomes": "Register Safe Home",
        "card.safeHomes.desc": "Offer your home as a temporary shelter for those in need.",
        "card.volunteer": "Join as Volunteer",
        "card.volunteer.desc": "Register to help with rescue and relief operations.",
        "card.missing": "Report Missing Person",
        "card.missing.desc": "File a report for a missing friend or family member.",
        "card.donate": "Donate Resources",
        "card.donate.desc": "Contribute food, clothes, or money to relief camps.",

        // Admin Dashboard
        "dash.incidentStatus": "Incident Status",
        "dash.activeCamps": "Active Camps",
        "dash.registeredRefugees": "Registered Refugees",
        "dash.missingReports": "Missing Reports",
        "dash.recentActivity": "Recent Activity",

        // Actions
        "action.reportMissing": "Report Missing",
        "action.registerRefugee": "Register Refugee",
        "action.addCamp": "Add New Camp",
        "action.listHome": "Register Safe Home",
        "action.alertBroadcast": "Broadcast Alert",

        // Missing Persons
        "missing.subtitle": "Search to find or report missing loved ones",
        "missing.date": "Missing Since",
        "missing.description": "Physical Description",
        "missing.markFound": "Mark Found",
        "missing.markMissing": "Mark Missing",
        "contact": "Contact Information",

        // Live Status / Admin
        "status.live": "Live Status",
        "status.lastUpdated": "Last Updated",
        "alert.high": "High Alert",
        "weather.heavyRain": "Heavy Rainfall",
        "districts.affected": "Affected Districts",
        "severity.severe": "Severe",
        "severity.moderate": "Moderate",
        "camp.manageDesc": "Manage active shelters and capacity",
        "action.requestCamp": "Request New Camp",
        "name": "Name",
        "actions": "Actions",
        "occupied": "Occupied",
        "manage": "Manage",
        "camp.editCapacity": "Edit Capacity",
        "capacity.total": "Total Capacity",
        "capacity.occupied": "Currently Admitted",

        // Volunteer / Forms
        "volunteer.connect": "Connect with fellow volunteers",
        "noResults": "No results found",
        "action.registerVolunteer": "Register Volunteer",
        "form.photo": "Photo",
        "form.fullName": "Full Name",
        "form.age": "Age",
        "form.bloodGroup": "Blood Group",
        "form.expertise": "Area of Expertise",
        "form.location": "Preferred Location",

        "form.bloodGroup": "Blood Group",
        "form.expertise": "Area of Expertise",
        "form.location": "Preferred Location",
        "action.uploadPhoto": "Upload Photo",
        "lastSeen": "Last Seen Location",
        "form.addressLandmark": "Address / Landmark",
        "form.descPlaceholder": "Red shirt, blue jeans...",
        "form.informant": "Contact Person (Informant)",
        "action.submitReport": "Submit Report",

        // Theme / Settings
        "mode.light": "Light Mode",
        "mode.dark": "Dark Mode",
        "lang.english": "English",
        "lang.malayalam": "മലയാളം",
        "role.admin": "Admin",
        "role.volunteer": "Volunteer",
        "role.public": "Public",
    },
    ml: {
        // General
        "appName": "റെസ്ക്യൂ-ഡിഎംഎസ്",
        "tagline": "ദുരന്ത നിവാരണ സംവിധാനം",
        "welcome": "സ്വാഗതം",
        "overview": "നിലവിലെ അവസ്ഥയുടെ അവലോകനം",
        "active": "സജീവം",
        "donate": "സംഭാവന",
        "staffLogin": "സ്റ്റാഫ് ലോഗിൻ",
        "logout": "പുറത്തുകടക്കുക",
        "settings": "ക്രമീകരണങ്ങൾ",
        "theme": "തീം",
        "language": "ഭാഷ",
        "role": "റോൾ മാറ്റുക",
        "cancel": "റദ്ദാക്കുക",
        "search": "തിരയുക...",
        "filter": "ഫിൽട്ടർ",
        "registerNew": "പുതിയത് ചേർക്കുക",
        "addNew": "പുതിയത് ചേർക്കുക",
        "updateStatus": "അവസ്ഥ മാറ്റുക",
        "submit": "സമർപ്പിക്കുക",
        "save": "മാറ്റങ്ങൾ സേവ് ചെയ്യുക",
        "close": "അടയ്ക്കുക",
        "edit": "എഡിറ്റ്",
        "delete": "നീക്കം ചെയ്യുക",
        "viewDetails": "വിശദാംശങ്ങൾ",
        "confirm": "സ്ഥിരീകരിക്കുക",
        "phone": "ഫോൺ",
        "email": "ഇമെയിൽ",
        "address": "വിലാസം",
        "location": "സ്ഥലം",
        "capacity": "ശേഷി",
        "status": "അവസ്ഥ",

        // Modules / Nav
        "nav.dashboard": "ഡാഷ്‌ബോർഡ്",
        "nav.alerts": "അറിയിപ്പുകൾ",
        "nav.riskMap": "റിസ്ക് മാപ്പ്",
        "nav.camps": "ദുരിതാശ്വാസ ക്യാമ്പുകൾ",
        "nav.safeHomes": "സുരക്ഷിത ഭവനങ്ങൾ",
        "nav.refugees": "അഭയാർത്ഥികൾ",
        "nav.missing": "കാണാതായവർ",
        "nav.volunteers": "വളണ്ടിയർമാർ",
        "nav.directory": "ഡയറക്ടറി",
        "nav.home": "പ്രധാനം",
        "nav.shelters": "അഭയകേന്ദ്രങ്ങൾ",

        // Home / Landing
        "hero.title": "ദുരന്ത നിവാരണ സംവിധാനം",
        "hero.subtitle": "അടിയന്തിര ഘട്ടങ്ങളിൽ സഹായം ഏകോപിപ്പിക്കാനും ആളുകളെ സുരക്ഷിതരാക്കാനും.",
        "hero.cta": "ലൈവ് സ്റ്റാറ്റസ് കാണുക",
        "stats.camps": "സജീവ ക്യാമ്പുകൾ",
        "stats.people": "അഭയം പ്രാപിച്ചവർ",
        "stats.volunteers": "വളണ്ടിയർമാർ",
        "stats.missing": "കാണാതായവർ",

        // Cards
        "card.safeHomes": "സുരക്ഷിത ഭവനം",
        "card.safeHomes.desc": "ദുരിതബാധിതർക്ക് താത്കാലിക അഭയം നൽകാൻ രജിസ്റ്റർ ചെയ്യുക.",
        "card.volunteer": "വളണ്ടിയർ ആകാം",
        "card.volunteer.desc": "രക്ഷാപ്രവർത്തനങ്ങളിൽ സഹായിക്കാൻ രജിസ്റ്റർ ചെയ്യുക.",
        "card.missing": "കാണാതായവരെ അറിയിക്കുക",
        "card.missing.desc": "കാണാതായ ബന്ധുക്കളെയോ സുഹൃത്തുക്കളെയോ റിപ്പോർട്ട് ചെയ്യുക.",
        "card.donate": "സഹായം നൽകാം",
        "card.donate.desc": "ഭക്ഷണം, വസ്ത്രം, പണം എന്നിവ ക്യാമ്പുകളിലേക്ക് നൽകാം.",

        // Admin Dashboard
        "dash.incidentStatus": "സംഭവ നില",
        "dash.activeCamps": "സജീവ ക്യാമ്പുകൾ",
        "dash.registeredRefugees": "രജിസ്റ്റർ ചെയ്തവർ",
        "dash.missingReports": "കാണാതായവർ",
        "dash.recentActivity": "സമീപകാല പ്രവർത്തനങ്ങൾ",

        // Actions
        "action.reportMissing": "റിപ്പോർട്ട് ചെയ്യുക",
        "action.registerRefugee": "അഭയാർത്ഥിയെ ചേർക്കുക",
        "action.addCamp": "പുതിയ ക്യാമ്പ്",
        "action.listHome": "പുതിയ വീട്",
        "action.alertBroadcast": "അലേർട്ട് നൽകുക",

        // Missing Persons
        "missing.subtitle": "കാണാതായവരെ കണ്ടെത്താൻ സഹായിക്കുക",
        "missing.date": "കാണാതായ തീയതി",
        "missing.description": "ശാരീരിക വിവരണം",
        "missing.markFound": "കണ്ടെത്തി",
        "missing.markMissing": "കാണാതായ ലിസ്റ്റിലേക്ക് മാറ്റുക",
        "contact": "ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ",

        // Live Status / Admin
        "status.live": "തത്സമയ വിവരങ്ങൾ",
        "status.lastUpdated": "അവസാനം അപ്ഡേറ്റ് ചെയ്തത്",
        "alert.high": "ജാഗ്രത നിർദ്ദേശം",
        "weather.heavyRain": "ശക്തമായ മഴ",
        "districts.affected": "ബാധിക്കപ്പെട്ട ജില്ലകൾ",
        "severity.severe": "രൂക്ഷമായ",
        "severity.moderate": "മിതമായ",
        "camp.manageDesc": "ഷെൽട്ടറുകളുടെയും ശേഷിയുടെയും നിയന്ത്രണം",
        "action.requestCamp": "പുതിയ ക്യാമ്പ് അഭ്യർത്ഥിക്കുക",
        "name": "പേര്",
        "actions": "പ്രവർത്തനങ്ങൾ",
        "occupied": "നിറഞ്ഞത്",
        "manage": "നിയന്ത്രിക്കുക",
        "camp.editCapacity": "ശേഷി എഡിറ്റ് ചെയ്യുക",
        "capacity.total": "ആകെ ശേഷി",
        "capacity.occupied": "നിലവിൽ പ്രവേശിച്ചവർ",

        // Volunteer / Forms
        "volunteer.connect": "മറ്റ് വളണ്ടിയർമാരുമായി ബന്ധപ്പെടുക",
        "noResults": "ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
        "action.registerVolunteer": "വളണ്ടിയറെ ചേർക്കുക",
        "form.photo": "ഫോട്ടോ",
        "form.fullName": "പൂർണ്ണ നാമം",
        "form.age": "വയസ്സ്",
        "form.bloodGroup": "രക്ത ഗ്രൂപ്പ്",
        "form.expertise": "വൈദഗ്ധ്യ മേഖല",
        "form.location": "താൽപ്പര്യമുള്ള സ്ഥലം",
        "action.uploadPhoto": "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
        "lastSeen": "അവസാനം കണ്ട സ്ഥലം",
        "form.addressLandmark": "വിലാസം / ലാൻഡ്മാർക്ക്",
        "form.descPlaceholder": "ചുവന്ന ഷർട്ട്, നീല ജീൻസ്...",
        "form.informant": "അറിയിക്കുന്നയാൾ (വിവരങ്ങൾ നൽകുന്നയാൾ)",
        "action.submitReport": "റിപ്പോർട്ട് സമർപ്പിക്കുക",
        "form.location": "താൽപ്പര്യമുള്ള സ്ഥലം",
        "action.uploadPhoto": "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
        "lastSeen": "അവസാനം കണ്ട സ്ഥലം",
        "form.addressLandmark": "വിലാസം / ലാൻഡ്മാർക്ക്",
        "form.descPlaceholder": "ചുവന്ന ഷർട്ട്, നീല ജീൻസ്...",
        "form.informant": "അറിയിക്കുന്നയാൾ (വിവരങ്ങൾ നൽകുന്നയാൾ)",
        "action.submitReport": "റിപ്പോർട്ട് സമർപ്പിക്കുക",

        // Theme / Settings
        "mode.light": "ലൈറ്റ് മോഡ്",
        "mode.dark": "ഡാർക്ക് മോഡ്",
        "lang.english": "English",
        "lang.malayalam": "മലയാളം",
        "role.admin": "അഡ്മിൻ",
        "role.volunteer": "വളണ്ടിയർ",
        "role.public": "പൊതുജനം",
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'ml' : 'en'));
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
