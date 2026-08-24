/*=====================================================
  🌐 TVBD LANGUAGE SYSTEM (EN / বাংলা)
  ----------------------------------------------------
  How it works:
  - All translatable text lives in the `translations` object below.
  - Any element that should change language gets: data-i18n="KEY"
  - For placeholder text (inputs) use: data-i18n-ph="KEY"
  - Language choice is saved in localStorage, so it persists
    across pages and future visits.
  - Call applyLanguage() on page load (already wired at bottom).
=====================================================*/

const translations = {
  en: {
    // Nav
    nav_home: "Home",
    nav_olympiads: "Olympiads",
    nav_team: "Team",
    nav_news: "News",
    nav_register: "Register",
    nav_verify: "Verify",
    nav_contact: "Contact",
    nav_admin: "⚙ Admin",

    // Hero
    hero_badge: "Bangladesh's Premier Olympiad Hub",
    hero_title_1: "Where",
    hero_title_2: "Talent",
    hero_title_3: "Meets",
    hero_title_4: "Opportunity",
    hero_sub: "Connecting ambitious students with national & international olympiads, competitions, and academic excellence programs across Bangladesh.",
    hero_btn1: "Explore Olympiads",
    hero_btn2: "Learn More",
    hero_stat1_lbl: "Olympiads Listed",
    hero_stat2_lbl: "Students Reached",
    hero_stat3_lbl: "Districts Covered",

    // Featured Olympiads
    olymp_eyebrow: "Competitions & Events",
    olymp_title_1: "Featured",
    olymp_title_2: "Olympiads",
    olymp_desc: "Discover upcoming olympiads and competitions designed to elevate your potential.",
    olymp_viewall: "View All Olympiads →",

    // About
    about_eyebrow: "Who We Are",
    about_title_1: "Building",
    about_title_2: "Champions",
    about_title_3: "Across Bangladesh",
    about_p1: "TalentVerse Bangladesh is the country's most dedicated platform for olympiad information, resources, and community — bridging the gap between aspiring students and world-class competition opportunities.",
    about_p2: "We curate, verify, and publish information on national and international olympiads so every talented student can discover competitions that match their strengths.",
    about_f1_t: "Verified Info",
    about_f1_d: "All details rigorously checked",
    about_f2_t: "Timely Updates",
    about_f2_d: "Never miss a deadline",
    about_f3_t: "All Bangladesh",
    about_f3_d: "Covering all 64 districts",
    about_f4_t: "International",
    about_f4_d: "Global competition pathways",
    about_quote: "\"Every child in Bangladesh deserves to know about the opportunity that awaits their talent.\"",

    // News
    news_eyebrow: "Updates",
    news_title_1: "Latest",
    news_title_2: "News",
    news_viewall: "View All News →",

    // Team
    team_eyebrow: "Our Team",
    team_title_1: "Executive",
    team_title_2: "Panel",
    team_desc: "Meet the leaders driving TalentVerse Bangladesh forward.",
    team_viewall: "See All Members →",
    team_role_fallback: "Team info coming soon!",

    // Footer
    f_desc: "TalentVerse Bangladesh is the country's most dedicated platform for olympiad information, resources, and community.",
    f_quicklinks: "Quick Links",
    f_contact: "Contact",
    f_bottom: "© 2026 TalentVerse Bangladesh. All rights reserved | Developed By Numexis.",

    // Popup / Notice (fallback defaults — admin text still overrides these)
    popup_title_default: "Important Notice",
    popup_dontshow: "Don't show again today",
    popup_closed: "🔴 Registration Closed",
    days: "Days", hours: "Hours", mins: "Mins", secs: "Secs",

    // Toast / misc
    lang_switch: "বাং",
  },

  bn: {
    // Nav
    nav_home: "হোম",
    nav_olympiads: "অলিম্পিয়াড",
    nav_team: "টিম",
    nav_news: "নিউজ",
    nav_register: "রেজিস্টার",
    nav_verify: "ভেরিফাই",
    nav_contact: "যোগাযোগ",
    nav_admin: "⚙ অ্যাডমিন",

    // Hero
    hero_badge: "বাংলাদেশের শীর্ষস্থানীয় অলিম্পিয়াড হাব",
    hero_title_1: "যেখানে",
    hero_title_2: "মেধা",
    hero_title_3: "খুঁজে পায়",
    hero_title_4: "সুযোগ",
    hero_sub: "সারা বাংলাদেশের উচ্চাকাঙ্ক্ষী শিক্ষার্থীদের জাতীয় ও আন্তর্জাতিক অলিম্পিয়াড, প্রতিযোগিতা এবং একাডেমিক এক্সিলেন্স প্রোগ্রামের সাথে সংযুক্ত করছি।",
    hero_btn1: "অলিম্পিয়াড দেখুন",
    hero_btn2: "আরও জানুন",
    hero_stat1_lbl: "অলিম্পিয়াড তালিকাভুক্ত",
    hero_stat2_lbl: "শিক্ষার্থী পৌঁছেছে",
    hero_stat3_lbl: "জেলা কভার করা হয়েছে",

    // Featured Olympiads
    olymp_eyebrow: "প্রতিযোগিতা ও ইভেন্ট",
    olymp_title_1: "নির্বাচিত",
    olymp_title_2: "অলিম্পিয়াড",
    olymp_desc: "আপনার সম্ভাবনাকে এগিয়ে নিতে ডিজাইন করা আসন্ন অলিম্পিয়াড ও প্রতিযোগিতাগুলো দেখুন।",
    olymp_viewall: "সব অলিম্পিয়াড দেখুন →",

    // About
    about_eyebrow: "আমরা কারা",
    about_title_1: "গড়ে তুলছি",
    about_title_2: "চ্যাম্পিয়ন",
    about_title_3: "সারা বাংলাদেশ জুড়ে",
    about_p1: "TalentVerse Bangladesh দেশের সবচেয়ে নিবেদিতপ্রাণ অলিম্পিয়াড তথ্য, রিসোর্স ও কমিউনিটি প্ল্যাটফর্ম — যা উচ্চাকাঙ্ক্ষী শিক্ষার্থী ও বিশ্বমানের প্রতিযোগিতার সুযোগের মধ্যে সেতুবন্ধন তৈরি করে।",
    about_p2: "আমরা জাতীয় ও আন্তর্জাতিক অলিম্পিয়াডের তথ্য যাচাই করে প্রকাশ করি, যাতে প্রতিটি মেধাবী শিক্ষার্থী তাদের সক্ষমতার সাথে মিলে যাওয়া প্রতিযোগিতা খুঁজে পায়।",
    about_f1_t: "যাচাইকৃত তথ্য",
    about_f1_d: "সব তথ্য নিবিড়ভাবে যাচাই করা",
    about_f2_t: "সময়মতো আপডেট",
    about_f2_d: "কোনো ডেডলাইন মিস হবে না",
    about_f3_t: "সারা বাংলাদেশ",
    about_f3_d: "৬৪ জেলা কভারেজ",
    about_f4_t: "আন্তর্জাতিক",
    about_f4_d: "বৈশ্বিক প্রতিযোগিতার পথ",
    about_quote: "\"বাংলাদেশের প্রতিটি শিশুর জানার অধিকার আছে, তাদের মেধার জন্য অপেক্ষা করা সুযোগ সম্পর্কে।\"",

    // News
    news_eyebrow: "আপডেট",
    news_title_1: "সাম্প্রতিক",
    news_title_2: "সংবাদ",
    news_viewall: "সব সংবাদ দেখুন →",

    // Team
    team_eyebrow: "আমাদের টিম",
    team_title_1: "নির্বাহী",
    team_title_2: "প্যানেল",
    team_desc: "TalentVerse Bangladesh-কে এগিয়ে নেওয়া নেতৃত্বের সাথে পরিচিত হোন।",
    team_viewall: "সব সদস্য দেখুন →",
    team_role_fallback: "টিমের তথ্য শীঘ্রই আসছে!",

    // Footer
    f_desc: "TalentVerse Bangladesh দেশের সবচেয়ে নিবেদিতপ্রাণ অলিম্পিয়াড তথ্য, রিসোর্স ও কমিউনিটি প্ল্যাটফর্ম।",
    f_quicklinks: "দ্রুত লিংক",
    f_contact: "যোগাযোগ",
    f_bottom: "© ২০২৬ TalentVerse Bangladesh. সর্বস্বত্ব সংরক্ষিত | ডেভেলপড বাই Numexis.",

    // Popup / Notice
    popup_title_default: "গুরুত্বপূর্ণ নোটিশ",
    popup_dontshow: "আজকের জন্য আর দেখাবে না",
    popup_closed: "🔴 রেজিস্ট্রেশন বন্ধ",
    days: "দিন", hours: "ঘণ্টা", mins: "মিনিট", secs: "সেকেন্ড",

    // Toast / misc
    lang_switch: "EN",
  }
};

/*===== CORE LANGUAGE ENGINE =====*/
function getLang() {
  return localStorage.getItem('tvbd_lang') || 'en';
}

function setLang(lang) {
  localStorage.setItem('tvbd_lang', lang);
  applyLanguage();
}

function toggleLang() {
  const current = getLang();
  setLang(current === 'en' ? 'bn' : 'en');
}

function applyLanguage() {
  const lang = getLang();
  const dict = translations[lang];
  if (!dict) return;

  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  // html lang attribute + font tweak for Bangla readability
  document.documentElement.lang = lang;
  document.body.classList.toggle('lang-bn', lang === 'bn');

  // Update toggle button label(s)
  document.querySelectorAll('.lang-toggle-label').forEach(el => {
    el.textContent = dict.lang_switch;
  });
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.setAttribute('aria-label', lang === 'en' ? 'Switch to Bangla' : 'Switch to English');
  });
}

// Run on load, and again after dynamic content mounts (safe to call multiple times)
document.addEventListener('DOMContentLoaded', applyLanguage);
