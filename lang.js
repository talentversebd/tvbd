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
    nav_olympiads: "Events & Quiz",
    nav_team: "Team",
    nav_news: "News",
    nav_register: "Register",
    nav_verify: "Verify",
    nav_contact: "Contact",
    nav_admin: "⚙ Admin",

    // Hero
    hero_badge: "Bangladesh's Premier Events Hub",
    hero_title_1: "Where",
    hero_title_2: "Talent",
    hero_title_3: "Meets",
    hero_title_4: "Opportunity",
    hero_sub: "Connecting ambitious students with national & international events, competitions, and academic excellence programs across Bangladesh.",
    hero_btn1: "Explore Events",
    hero_btn2: "Learn More",
    hero_stat1_lbl: "Events Listed",
    hero_stat2_lbl: "Students Reached",
    hero_stat3_lbl: "Districts Covered",

    // Featured Events
    olymp_eyebrow: "Competitions & Events",
    olymp_title_1: "Featured",
    olymp_title_2: "Events",
    olymp_desc: "Discover upcoming events and competitions designed to elevate your potential.",
    olymp_viewall: "View All Events →",

    // About
    about_eyebrow: "Who We Are",
    about_title_1: "Building",
    about_title_2: "Champions",
    about_title_3: "Across Bangladesh",
    about_p1: "TalentVerse Bangladesh is the country's most dedicated platform for event information, resources, and community — bridging the gap between aspiring students and world-class competition opportunities.",
    about_p2: "We curate, verify, and publish information on national and international events so every talented student can discover competitions that match their strengths.",
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
    f_desc: "TalentVerse Bangladesh is the country's most dedicated platform for event information, resources, and community.",
    f_quicklinks: "Quick Links",
    f_contact: "Contact",
    f_bottom: "© 2026 TalentVerse Bangladesh. All rights reserved | Developed By Samin & Fahad.",

    // Popup / Notice (fallback defaults — admin text still overrides these)
    popup_title_default: "Important Notice",
    popup_dontshow: "Don't show again today",
    popup_closed: "🔴 Registration Closed",
    days: "Days", hours: "Hours", mins: "Mins", secs: "Secs",

    // Events page
    op_eyebrow: "Competitions & Events",
    op_title_1: "All",
    op_title_2: "Events",
    op_desc: "Browse and discover events and competitions designed to elevate your potential.",
    op_search_ph: "🔍 Search events...",
    op_status_all: "All Status",
    op_status_active: "Active",
    op_status_upcoming: "Upcoming",
    op_status_past: "Past",
    op_cat_all: "All Categories",
    o_readmore: "Read More",

    // Team page
    tp_eyebrow: "Our Team",
    tp_title_1: "Executive",
    tp_title_2: "Panel",
    tp_desc: "Meet the leaders and members of TalentVerse Bangladesh.",
    tp_loading_t: "Team Loading...",
    tp_loading_d: "Please wait or refresh the page.",
    tp_empty_t: "Coming Soon",
    tp_empty_d: "Our team information will be available soon. Stay tuned!",
    tp_member: "Member",
    tp_members: "Members",

    // News page
    np_eyebrow: "Updates",
    np_title_1: "Latest",
    np_title_2: "News",
    np_desc: "Stay updated with the latest event news, announcements and updates.",

    // Register page
    rp_eyebrow: "Registration",
    rp_title_1: "Join Our",
    rp_title_2: "Competition",
    rp_desc: "Register for upcoming events and competitions with a simple form.",
    reg_loading: "Loading registration details...",
    reg_status_open: "Registration Open",
    reg_status_closed: "Registration Closed",
    reg_desc_fallback: "Registration is now open. Click the button below to fill out the form.",
    reg_deadline_label: "Registration Deadline",
    reg_btn_fill: "📝 Fill Registration Form",
    reg_note_label: "Note:",
    reg_note_body: "Clicking the button will open the Google Form in a new tab. Fill out all details and submit. You'll receive confirmation after successful submission.",
    reg_empty_t: "No Active Registration",
    reg_empty_d: "There are no open competitions at the moment. Please check back later or visit our Events page for upcoming events.",
    reg_empty_btn: "View Events →",
    reg_closed_btn: "❌ Registration Closed",

    // Verify page
    vp_eyebrow: "Certificate Verification",
    vp_title_1: "Verify",
    vp_title_2: "Certificate",
    vp_desc: "Enter or scan a certificate ID to verify its authenticity.",
    v_search_title: "🔍 Search Certificate",
    v_search_ph: "Enter Certificate ID (e.g. TVBD-2026-001)",
    v_search_btn: "🔍 Verify",
    v_loading: "Verifying certificate...",
    v_verified_title: "Certificate Verified",
    v_verified_sub: "This is an authentic certificate issued by TalentVerse Bangladesh",
    v_label_certid: "🆔 Certificate ID",
    v_label_name: "👤 Name",
    v_label_event: "🏆 Event",
    v_label_position: "🥇 Position",
    v_label_date: "📅 Issue Date",
    v_label_status: "✅ Status",
    v_status_verified: "Verified ✓",
    v_print: "🖨️ Print",
    v_share: "🔗 Share Link",
    v_trust_t: "Verified by TalentVerse Bangladesh",
    v_trust_d: "This certificate has been digitally verified and is authentic. For any queries, contact us.",
    v_notfound_title: "Certificate Not Found",
    v_notfound_d: "The certificate ID you entered doesn't exist in our database. Please check the ID and try again.",
    v_notfound_note: "If you believe this is an error, please contact us.",
    v_try_again: "🔄 Try Again",
    v_contact_us: "📧 Contact Us",
    v_toast_enter_id: "Please enter a Certificate ID!",
    v_toast_link_copied: "Link copied to clipboard! ✅",

    // Contact page
    cp_eyebrow: "Get In Touch",
    cp_title_1: "Contact",
    cp_title_2: "Us",
    cp_desc: "Have a question or want to collaborate? We'd love to hear from you!",
    ci_email_t: "Email Us",
    ci_call_t: "Call Us",
    ci_loc_t: "Location",
    ci_resp_t: "Response Time",
    ci_resp_d: "We usually respond within 24 hours.",
    ci_follow_t: "Follow Us",
    cf_title: "Send us a Message ✉️",
    cf_name_l: "Your Name *",
    cf_name_ph: "Enter your full name",
    cf_email_l: "Email Address *",
    cf_email_ph: "your@email.com",
    cf_subject_l: "Subject",
    cf_subject_ph: "What is this about?",
    cf_message_l: "Message *",
    cf_message_ph: "Write your message here...",
    cf_submit: "Send Message 🚀",

    // Toast / misc
    lang_switch: "বাং",
  },

  bn: {
    // Nav
    nav_home: "হোম",
    nav_olympiads: "ইভেন্ট & কুইজ",
    nav_team: "টিম",
    nav_news: "নিউজ",
    nav_register: "রেজিস্টার",
    nav_verify: "ভেরিফাই",
    nav_contact: "যোগাযোগ",
    nav_admin: "⚙ অ্যাডমিন",

    // Hero
    hero_badge: "বাংলাদেশের শীর্ষস্থানীয় ইভেন্ট হাব",
    hero_title_1: "যেখানে",
    hero_title_2: "মেধা",
    hero_title_3: "খুঁজে পায়",
    hero_title_4: "সুযোগ",
    hero_sub: "সারা বাংলাদেশের উচ্চাকাঙ্ক্ষী শিক্ষার্থীদের জাতীয় ও আন্তর্জাতিক ইভেন্ট, প্রতিযোগিতা এবং একাডেমিক এক্সিলেন্স প্রোগ্রামের সাথে সংযুক্ত করছি।",
    hero_btn1: "ইভেন্ট দেখুন",
    hero_btn2: "আরও জানুন",
    hero_stat1_lbl: "ইভেন্ট তালিকাভুক্ত",
    hero_stat2_lbl: "শিক্ষার্থী পৌঁছেছে",
    hero_stat3_lbl: "জেলা কভার করা হয়েছে",

    // Featured Events
    olymp_eyebrow: "প্রতিযোগিতা ও ইভেন্ট",
    olymp_title_1: "নির্বাচিত",
    olymp_title_2: "ইভেন্ট",
    olymp_desc: "আপনার সম্ভাবনাকে এগিয়ে নিতে ডিজাইন করা আসন্ন ইভেন্ট ও প্রতিযোগিতাগুলো দেখুন।",
    olymp_viewall: "সব ইভেন্ট দেখুন →",

    // About
    about_eyebrow: "আমরা কারা",
    about_title_1: "গড়ে তুলছি",
    about_title_2: "চ্যাম্পিয়ন",
    about_title_3: "সারা বাংলাদেশ জুড়ে",
    about_p1: "TalentVerse Bangladesh দেশের সবচেয়ে নিবেদিতপ্রাণ ইভেন্ট তথ্য, রিসোর্স ও কমিউনিটি প্ল্যাটফর্ম — যা উচ্চাকাঙ্ক্ষী শিক্ষার্থী ও বিশ্বমানের প্রতিযোগিতার সুযোগের মধ্যে সেতুবন্ধন তৈরি করে।",
    about_p2: "আমরা জাতীয় ও আন্তর্জাতিক ইভেন্টের তথ্য যাচাই করে প্রকাশ করি, যাতে প্রতিটি মেধাবী শিক্ষার্থী তাদের সক্ষমতার সাথে মিলে যাওয়া প্রতিযোগিতা খুঁজে পায়।",
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
    f_desc: "TalentVerse Bangladesh দেশের সবচেয়ে নিবেদিতপ্রাণ ইভেন্ট তথ্য, রিসোর্স ও কমিউনিটি প্ল্যাটফর্ম।",
    f_quicklinks: "দ্রুত লিংক",
    f_contact: "যোগাযোগ",
    f_bottom: "© ২০২৬ TalentVerse Bangladesh. সর্বস্বত্ব সংরক্ষিত | ডেভেলপড বাই Samin & Fahad.",

    // Popup / Notice
    popup_title_default: "গুরুত্বপূর্ণ নোটিশ",
    popup_dontshow: "আজকের জন্য আর দেখাবে না",
    popup_closed: "🔴 রেজিস্ট্রেশন বন্ধ",
    days: "দিন", hours: "ঘণ্টা", mins: "মিনিট", secs: "সেকেন্ড",

    // Events page
    op_eyebrow: "প্রতিযোগিতা ও ইভেন্ট",
    op_title_1: "সকল",
    op_title_2: "ইভেন্ট",
    op_desc: "আপনার সম্ভাবনাকে এগিয়ে নিতে ডিজাইন করা ইভেন্ট ও প্রতিযোগিতাগুলো ব্রাউজ করুন।",
    op_search_ph: "🔍 ইভেন্ট খুঁজুন...",
    op_status_all: "সব স্ট্যাটাস",
    op_status_active: "চলমান",
    op_status_upcoming: "আসন্ন",
    op_status_past: "সমাপ্ত",
    op_cat_all: "সব ক্যাটাগরি",
    o_readmore: "বিস্তারিত দেখুন",

    // Team page
    tp_eyebrow: "আমাদের টিম",
    tp_title_1: "নির্বাহী",
    tp_title_2: "প্যানেল",
    tp_desc: "TalentVerse Bangladesh-এর নেতৃত্ব ও সদস্যদের সাথে পরিচিত হোন।",
    tp_loading_t: "টিম লোড হচ্ছে...",
    tp_loading_d: "অনুগ্রহ করে অপেক্ষা করুন বা পেজ রিফ্রেশ করুন।",
    tp_empty_t: "শীঘ্রই আসছে",
    tp_empty_d: "আমাদের টিমের তথ্য শীঘ্রই আসবে। সাথে থাকুন!",
    tp_member: "সদস্য",
    tp_members: "সদস্য",

    // News page
    np_eyebrow: "আপডেট",
    np_title_1: "সাম্প্রতিক",
    np_title_2: "সংবাদ",
    np_desc: "সর্বশেষ ইভেন্ট সংবাদ, ঘোষণা ও ইভেন্ট সম্পর্কে আপডেট থাকুন।",

    // Register page
    rp_eyebrow: "রেজিস্ট্রেশন",
    rp_title_1: "যোগ দিন আমাদের",
    rp_title_2: "প্রতিযোগিতায়",
    rp_desc: "একটি সহজ ফর্মের মাধ্যমে আসন্ন ইভেন্ট ও প্রতিযোগিতায় রেজিস্টার করুন।",
    reg_loading: "রেজিস্ট্রেশনের তথ্য লোড হচ্ছে...",
    reg_status_open: "রেজিস্ট্রেশন চলছে",
    reg_status_closed: "রেজিস্ট্রেশন বন্ধ",
    reg_desc_fallback: "রেজিস্ট্রেশন এখন খোলা আছে। ফর্ম পূরণ করতে নিচের বাটনে ক্লিক করুন।",
    reg_deadline_label: "রেজিস্ট্রেশনের শেষ তারিখ",
    reg_btn_fill: "📝 রেজিস্ট্রেশন ফর্ম পূরণ করুন",
    reg_note_label: "নোট:",
    reg_note_body: "বাটনে ক্লিক করলে Google Form একটি নতুন ট্যাবে খুলবে। সব তথ্য পূরণ করে সাবমিট করুন। সফলভাবে সাবমিট করার পর আপনি নিশ্চিতকরণ পাবেন।",
    reg_empty_t: "কোনো সক্রিয় রেজিস্ট্রেশন নেই",
    reg_empty_d: "এই মুহূর্তে কোনো খোলা প্রতিযোগিতা নেই। পরে আবার চেক করুন অথবা আসন্ন ইভেন্টের জন্য আমাদের ইভেন্ট পেজ দেখুন।",
    reg_empty_btn: "ইভেন্ট দেখুন →",
    reg_closed_btn: "❌ রেজিস্ট্রেশন বন্ধ",

    // Verify page
    vp_eyebrow: "সার্টিফিকেট ভেরিফিকেশন",
    vp_title_1: "সার্টিফিকেট",
    vp_title_2: "ভেরিফাই করুন",
    vp_desc: "সার্টিফিকেট আসল কিনা যাচাই করতে সার্টিফিকেট আইডি দিন বা স্ক্যান করুন।",
    v_search_title: "🔍 সার্টিফিকেট খুঁজুন",
    v_search_ph: "সার্টিফিকেট আইডি দিন (যেমন TVBD-2026-001)",
    v_search_btn: "🔍 ভেরিফাই",
    v_loading: "সার্টিফিকেট যাচাই করা হচ্ছে...",
    v_verified_title: "সার্টিফিকেট ভেরিফাইড",
    v_verified_sub: "এটি TalentVerse Bangladesh কর্তৃক প্রদত্ত একটি প্রকৃত সার্টিফিকেট",
    v_label_certid: "🆔 সার্টিফিকেট আইডি",
    v_label_name: "👤 নাম",
    v_label_event: "🏆 ইভেন্ট",
    v_label_position: "🥇 অবস্থান",
    v_label_date: "📅 ইস্যুর তারিখ",
    v_label_status: "✅ স্ট্যাটাস",
    v_status_verified: "ভেরিফাইড ✓",
    v_print: "🖨️ প্রিন্ট",
    v_share: "🔗 লিংক শেয়ার করুন",
    v_trust_t: "TalentVerse Bangladesh কর্তৃক ভেরিফাইড",
    v_trust_d: "এই সার্টিফিকেটটি ডিজিটালভাবে যাচাই করা হয়েছে এবং এটি প্রকৃত। কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।",
    v_notfound_title: "সার্টিফিকেট পাওয়া যায়নি",
    v_notfound_d: "আপনার দেওয়া সার্টিফিকেট আইডি আমাদের ডেটাবেজে নেই। আইডি চেক করে আবার চেষ্টা করুন।",
    v_notfound_note: "এটি ভুল মনে হলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।",
    v_try_again: "🔄 আবার চেষ্টা করুন",
    v_contact_us: "📧 যোগাযোগ করুন",
    v_toast_enter_id: "অনুগ্রহ করে একটি সার্টিফিকেট আইডি দিন!",
    v_toast_link_copied: "লিংক কপি হয়েছে! ✅",

    // Contact page
    cp_eyebrow: "যোগাযোগ করুন",
    cp_title_1: "যোগাযোগ",
    cp_title_2: "করুন",
    cp_desc: "কোনো প্রশ্ন আছে বা একসাথে কাজ করতে চান? আমরা আপনার কথা শুনতে চাই!",
    ci_email_t: "ইমেইল করুন",
    ci_call_t: "কল করুন",
    ci_loc_t: "অবস্থান",
    ci_resp_t: "রেসপন্স টাইম",
    ci_resp_d: "আমরা সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই।",
    ci_follow_t: "আমাদের ফলো করুন",
    cf_title: "আমাদের মেসেজ পাঠান ✉️",
    cf_name_l: "আপনার নাম *",
    cf_name_ph: "আপনার পুরো নাম লিখুন",
    cf_email_l: "ইমেইল ঠিকানা *",
    cf_email_ph: "your@email.com",
    cf_subject_l: "বিষয়",
    cf_subject_ph: "এটা কি নিয়ে?",
    cf_message_l: "মেসেজ *",
    cf_message_ph: "এখানে আপনার মেসেজ লিখুন...",
    cf_submit: "মেসেজ পাঠান 🚀",

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
