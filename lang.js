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
    nav_team: "Exclusive Members",
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
    team_title_1: "Exclusive",
    team_title_2: "Members",
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
    tp_title_1: "Exclusive",
    tp_title_2: "Members",
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
    nav_team: "এক্সক্লুসিভ মেম্বার",
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
    team_title_1: "এক্সক্লুসিভ",
    team_title_2: "মেম্বার",
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
    tp_title_1: "এক্সক্লুসিভ",
    tp_title_2: "মেম্বার",
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
    btn.setAttribute('aria-label', lang === 'en' ? 'Switch to Bangla' : 'ইংরেজিতে পরিবর্তন করুন');
  });

  if (window.__i18nApplyAll) window.__i18nApplyAll();
}

// Run on load, and again after dynamic content mounts (safe to call multiple times)

/*=====================================================
  🌐 FULL-SITE TRANSLATION LAYER
  ----------------------------------------------------
  Goal: in English mode the whole site is English, in Bangla mode the
  whole site is Bangla. This layer translates ANY text on the page
  (static or created later by JavaScript: toasts, status labels, popups,
  quiz/vote messages...) by matching it against the phrase list below.
  - To add/fix a phrase, add { e: "English", b: "বাংলা" } to I18N_PAIRS.
  - "{0}", "{1}" are placeholders for dynamic values (names, dates, counts).
  - "a": extra source texts that should map to the same pair.
  - Brand names (TalentVerse, TVBD), emails and social handles stay as is.
=====================================================*/
const I18N_PAIRS = [
{
"e": "Apply Now",
"b": "এখনই আবেদন করুন"
},
{
"e": "Registration Closed",
"b": "রেজিস্ট্রেশন বন্ধ"
},
{
"e": "Important Notice",
"b": "গুরুত্বপূর্ণ নোটিশ"
},
{
"e": "Registration is Open Now!",
"b": "রেজিস্ট্রেশন এখন চলছে!"
},
{
"e": "Registration is now open!",
"b": "রেজিস্ট্রেশন এখন শুরু হয়েছে!"
},
{
"e": "Scroll to top",
"b": "উপরে যান"
},
{
"e": "Switch language",
"b": "ভাষা পরিবর্তন করুন"
},
{
"e": "Menu",
"b": "মেনু"
},
{
"e": "Logo",
"b": "লোগো"
},
{
"e": "TalentVerse Logo",
"b": "TalentVerse লোগো"
},
{
"e": "Dhaka, Bangladesh",
"b": "ঢাকা, বাংলাদেশ"
},
{
"e": "ESTD 2026",
"b": "প্রতিষ্ঠিত ২০২৬"
},
{
"e": "Loading... {0}%",
"b": "লোড হচ্ছে... {0}%"
},
{
"e": "Loading...",
"b": "লোড হচ্ছে..."
},
{
"e": "Loading…",
"b": "লোড হচ্ছে…"
},
{
"e": "Loading events...",
"b": "ইভেন্ট লোড হচ্ছে..."
},
{
"e": "Loading form…",
"b": "ফর্ম লোড হচ্ছে…"
},
{
"e": "Loading quizzes...",
"b": "কুইজ লোড হচ্ছে..."
},
{
"e": "Loading your dashboard...",
"b": "আপনার ড্যাশবোর্ড লোড হচ্ছে..."
},
{
"e": "Description loading...",
"b": "বিবরণ লোড হচ্ছে..."
},
{
"e": "Facebook",
"b": "ফেসবুক"
},
{
"e": "Instagram",
"b": "ইনস্টাগ্রাম"
},
{
"e": "YouTube",
"b": "ইউটিউব"
},
{
"e": "10K+",
"b": "১০ হাজার+"
},
{
"e": "Affiliated Pages",
"b": "সংযুক্ত পেজসমূহ"
},
{
"e": "Our Network",
"b": "আমাদের নেটওয়ার্ক"
},
{
"e": "TalentVerse Bangladesh is the official hub — explore our partner & branch pages below.",
"b": "TalentVerse Bangladesh হলো অফিসিয়াল হাব — নিচে আমাদের পার্টনার ও শাখা পেজগুলো দেখুন।"
},
{
"e": "Founder",
"b": "প্রতিষ্ঠাতা"
},
{
"e": "Founder's",
"b": "প্রতিষ্ঠাতার"
},
{
"e": "From Our Founder",
"b": "আমাদের প্রতিষ্ঠাতার কাছ থেকে"
},
{
"e": "Message",
"b": "বার্তা"
},
{
"e": "🔷 Lead",
"b": "🔷 লিড"
},
{
"e": "Leadership",
"b": "নেতৃত্ব"
},
{
"e": "Lead",
"b": "লিড"
},
{
"e": "Account",
"b": "অ্যাকাউন্ট"
},
{
"e": "My",
"b": "আমার"
},
{
"e": "Dashboard",
"b": "ড্যাশবোর্ড"
},
{
"e": "talentversebangladesh@gmail.com",
"b": "talentversebangladesh@gmail.com"
},
{
"e": "Participant Portal",
"b": "অংশগ্রহণকারী পোর্টাল"
},
{
"e": "Contact — TalentVerse Bangladesh",
"b": "যোগাযোগ — TalentVerse Bangladesh"
},
{
"e": "Events — TalentVerse Bangladesh",
"b": "ইভেন্ট — TalentVerse Bangladesh"
},
{
"e": "Exclusive Members — TalentVerse Bangladesh",
"b": "এক্সক্লুসিভ মেম্বার — TalentVerse Bangladesh"
},
{
"e": "Form — TalentVerse Bangladesh",
"b": "ফর্ম — TalentVerse Bangladesh"
},
{
"e": "My Account — TalentVerse Bangladesh",
"b": "আমার অ্যাকাউন্ট — TalentVerse Bangladesh"
},
{
"e": "My Dashboard — TalentVerse Bangladesh",
"b": "আমার ড্যাশবোর্ড — TalentVerse Bangladesh"
},
{
"e": "News — TalentVerse Bangladesh",
"b": "নিউজ — TalentVerse Bangladesh"
},
{
"e": "Page Not Found — TalentVerse Bangladesh",
"b": "পেজ খুঁজে পাওয়া যায়নি — TalentVerse Bangladesh"
},
{
"e": "Quiz / Exam — TalentVerse Bangladesh",
"b": "কুইজ / পরীক্ষা — TalentVerse Bangladesh"
},
{
"e": "Register — TalentVerse Bangladesh",
"b": "রেজিস্ট্রেশন — TalentVerse Bangladesh"
},
{
"e": "TalentVerse Bangladesh — Events, Olympiads & Quiz Zone",
"b": "TalentVerse Bangladesh — ইভেন্ট, অলিম্পিয়াড ও কুইজ জোন"
},
{
"e": "Verify Certificate — TalentVerse Bangladesh",
"b": "সার্টিফিকেট যাচাই — TalentVerse Bangladesh"
},
{
"e": "Vote — TalentVerse Bangladesh",
"b": "ভোট — TalentVerse Bangladesh"
},
{
"e": "Page Not Found",
"b": "পেজ খুঁজে পাওয়া যায়নি"
},
{
"e": "This page could not be found",
"b": "এই পেজটা খুঁজে পাওয়া যায়নি",
"a": [
"এই পেজটা খুঁজে পাওয়া যায়নি"
]
},
{
"e": "The link may be broken, or the page may have been moved. No worries — use any link below to get back on track.",
"b": "লিংকটা হয়তো ভুল, অথবা পেজটা সরিয়ে ফেলা হয়েছে। চিন্তা নেই — নিচের যেকোনো লিংক থেকে আবার সঠিক জায়গায় যেতে পারবেন।",
"a": [
"লিংকটা হয়তো ভুল, অথবা পেজটা সরিয়ে ফেলা হয়েছে। চিন্তা নেই — নিচের যেকোনো লিংক থেকে আবার সঠিক জায়গায় যেতে পারো।"
]
},
{
"e": "Back to Home",
"b": "হোমপেজে ফিরে যান"
},
{
"e": "Contact",
"b": "যোগাযোগ"
},
{
"e": "Team",
"b": "টিম"
},
{
"e": "Events & Quiz",
"b": "ইভেন্ট ও কুইজ"
},
{
"e": "Register",
"b": "রেজিস্ট্রেশন"
},
{
"e": "Verify Certificate",
"b": "সার্টিফিকেট যাচাই"
},
{
"e": "Log In",
"b": "লগইন"
},
{
"e": "Sign Up",
"b": "সাইন আপ"
},
{
"e": "Create Account",
"b": "অ্যাকাউন্ট খুলুন"
},
{
"e": "Log In / Sign Up",
"b": "লগইন / সাইন আপ"
},
{
"e": "Log In / Sign Up →",
"b": "লগইন / সাইন আপ →"
},
{
"e": "Log in to see your quiz results, or create a free account if you're new here.",
"b": "আপনার কুইজের ফলাফল দেখতে লগইন করুন, অথবা নতুন হলে বিনামূল্যে একটি অ্যাকাউন্ট খুলুন।"
},
{
"e": "Email Address",
"b": "ইমেইল ঠিকানা"
},
{
"e": "Email Address *",
"b": "ইমেইল ঠিকানা *"
},
{
"e": "Email *",
"b": "ইমেইল *"
},
{
"e": "Password",
"b": "পাসওয়ার্ড"
},
{
"e": "Confirm Password",
"b": "পাসওয়ার্ড নিশ্চিত করুন"
},
{
"e": "Forgot password?",
"b": "পাসওয়ার্ড ভুলে গেছেন?"
},
{
"e": "First Name",
"b": "প্রথম নাম"
},
{
"e": "Last Name",
"b": "শেষ নাম"
},
{
"e": "First Name *",
"b": "প্রথম নাম *"
},
{
"e": "Last Name *",
"b": "শেষ নাম *"
},
{
"e": "Date of Birth",
"b": "জন্ম তারিখ"
},
{
"e": "Date of Birth *",
"b": "জন্ম তারিখ *"
},
{
"e": "Gender",
"b": "লিঙ্গ"
},
{
"e": "Gender *",
"b": "লিঙ্গ *"
},
{
"e": "Male",
"b": "পুরুষ"
},
{
"e": "Female",
"b": "নারী"
},
{
"e": "Other",
"b": "অন্যান্য"
},
{
"e": "Religion",
"b": "ধর্ম"
},
{
"e": "Religion *",
"b": "ধর্ম *"
},
{
"e": "Islam",
"b": "ইসলাম"
},
{
"e": "Hinduism",
"b": "হিন্দু ধর্ম"
},
{
"e": "Buddhism",
"b": "বৌদ্ধ ধর্ম"
},
{
"e": "Christianity",
"b": "খ্রিস্টান ধর্ম"
},
{
"e": "Select...",
"b": "নির্বাচন করুন..."
},
{
"e": "District",
"b": "জেলা"
},
{
"e": "District *",
"b": "জেলা *"
},
{
"e": "Class / Level",
"b": "শ্রেণি / স্তর"
},
{
"e": "Class / Level *",
"b": "শ্রেণি / স্তর *"
},
{
"e": "University / Institution",
"b": "বিশ্ববিদ্যালয় / প্রতিষ্ঠান"
},
{
"e": "University / Institution *",
"b": "বিশ্ববিদ্যালয় / প্রতিষ্ঠান *"
},
{
"e": "Phone Number",
"b": "ফোন নম্বর"
},
{
"e": "Phone Number *",
"b": "ফোন নম্বর *"
},
{
"e": "Phone *",
"b": "ফোন *"
},
{
"e": "Profile Photo",
"b": "প্রোফাইল ছবি"
},
{
"e": "(optional)",
"b": "(ঐচ্ছিক)"
},
{
"e": "). Only the profile photo is optional.",
"b": "). শুধু প্রোফাইল ছবি ঐচ্ছিক।",
"a": [
")। শুধু প্রোফাইল ছবি ঐচ্ছিক।"
]
},
{
"e": "All fields are required (",
"b": "সব ঘর পূরণ করা বাধ্যতামূলক (",
"a": [
"সব ঘর পূরণ করা বাধ্যতামূলক ("
]
},
{
"e": "Resend Verification Email",
"b": "ভেরিফিকেশন ইমেইল আবার পাঠান"
},
{
"e": "Verify Your Email",
"b": "আপনার ইমেইল যাচাই করুন"
},
{
"e": "We've sent a verification link to",
"b": "আমরা একটি ভেরিফিকেশন লিংক পাঠিয়েছি:"
},
{
"e": ". Click the link in that email, then come back and log in.",
"b": ". ওই ইমেইলের লিংকে ক্লিক করুন, তারপর ফিরে এসে লগইন করুন।"
},
{
"e": "Back to Log In",
"b": "লগইনে ফিরে যান"
},
{
"e": "💡 Use the exact same email you used for quizzes/registrations — that's how we match your results to your account.",
"b": "💡 কুইজ বা রেজিস্ট্রেশনে যে ইমেইল ব্যবহার করেছেন ঠিক সেটিই দিন — এভাবেই আপনার ফলাফল অ্যাকাউন্টের সাথে মেলানো হয়।"
},
{
"e": "01XXXXXXXXX",
"b": "০১৭১২৩৪৫৬৭৮"
},
{
"e": "e.g. 01XXXXXXXXX",
"b": "যেমন ০১৭১২৩৪৫৬৭৮"
},
{
"e": "you@email.com",
"b": "আপনার@ইমেইল.কম"
},
{
"e": "At least 6 characters",
"b": "কমপক্ষে ৬ অক্ষর"
},
{
"e": "Re-type your password",
"b": "পাসওয়ার্ড আবার লিখুন"
},
{
"e": "Your password",
"b": "আপনার পাসওয়ার্ড"
},
{
"e": "Use the same email you registered with",
"b": "রেজিস্ট্রেশনের সময় ব্যবহৃত ইমেইলটিই দিন"
},
{
"e": "e.g. Class 9, HSC 1st Year",
"b": "যেমন নবম শ্রেণি, এইচএসসি ১ম বর্ষ"
},
{
"e": "e.g. Class 9, HSC 1st year",
"b": "যেমন নবম শ্রেণি, এইচএসসি ১ম বর্ষ"
},
{
"e": "e.g. Abdur Rahman",
"b": "যেমন আব্দুর রহমান"
},
{
"e": "This email already has an account — please log in.",
"b": "এই ইমেইল দিয়ে আগেই একটা অ্যাকাউন্ট আছে — লগইন করুন।",
"a": [
"এই email দিয়ে আগেই একটা account আছে — Log In করুন।"
]
},
{
"e": "Please enter a valid email address.",
"b": "সঠিক ইমেইল ঠিকানা দিন।",
"a": [
"সঠিক email address দিন।"
]
},
{
"e": "Password must be at least 6 characters.",
"b": "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
"a": [
"Password কমপক্ষে ৬ অক্ষরের হতে হবে।"
]
},
{
"e": "Wrong email or password.",
"b": "ইমেইল অথবা পাসওয়ার্ড ভুল।",
"a": [
"Email অথবা password ভুল।"
]
},
{
"e": "Too many attempts — please try again in a little while.",
"b": "অনেকবার চেষ্টা হয়েছে — একটু পর আবার চেষ্টা করুন।"
},
{
"e": "Something went wrong, please try again.",
"b": "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।"
},
{
"e": "Please choose an image file only.",
"b": "শুধু ছবি (image) ফাইল দিন।",
"a": [
"শুধু ছবি (image) ফাইল দিন।"
]
},
{
"e": "is required — all fields are mandatory.",
"b": "দিতে হবে — সব তথ্য বাধ্যতামূলক।"
},
{
"e": "Please enter a valid phone number (e.g. 01XXXXXXXXX).",
"b": "সঠিক ফোন নম্বর দিন (যেমন ০১৭১২৩৪৫৬৭৮)।",
"a": [
"সঠিক ফোন নম্বর দিন (যেমন 01XXXXXXXXX)।"
]
},
{
"e": "Please enter a password.",
"b": "পাসওয়ার্ড দিন।",
"a": [
"Password দিন।"
]
},
{
"e": "The two passwords do not match.",
"b": "দুটো পাসওয়ার্ড মিলছে না।",
"a": [
"দুটো Password মিলছে না।"
]
},
{
"e": "Please enter your email and password.",
"b": "ইমেইল ও পাসওয়ার্ড দিন।",
"a": [
"Email ও Password দিন।"
]
},
{
"e": "Logging in...",
"b": "লগইন হচ্ছে..."
},
{
"e": "Please log in again first.",
"b": "আগে আবার লগইন করুন।"
},
{
"e": "Verification email sent! ✅",
"b": "ভেরিফিকেশন ইমেইল পাঠানো হয়েছে! ✅"
},
{
"e": "Enter your email first, then press \"Forgot password?\".",
"b": "আগে ইমেইল ঠিকানা লিখুন, তারপর \"পাসওয়ার্ড ভুলে গেছেন?\" চাপুন।",
"a": [
"আগে email address লিখুন, তারপর \"Forgot password?\" চাপুন।"
]
},
{
"e": "Password reset link sent to your email! ✅",
"b": "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে! ✅"
},
{
"e": "Academic Information",
"b": "শিক্ষাগত তথ্য"
},
{
"e": "Personal Information",
"b": "ব্যক্তিগত তথ্য"
},
{
"e": "Complete Profile →",
"b": "প্রোফাইল সম্পূর্ণ করুন →"
},
{
"e": "Edit Profile",
"b": "প্রোফাইল সম্পাদনা"
},
{
"e": "Save Profile",
"b": "প্রোফাইল সংরক্ষণ"
},
{
"e": "Copy",
"b": "কপি"
},
{
"e": "Welcome back!",
"b": "স্বাগতম!"
},
{
"e": "Welcome, {0}",
"b": "স্বাগতম, {0}",
"a": [
"স্বাগতম, {0}"
]
},
{
"e": "Logged in as",
"b": "লগইন করা আছে:"
},
{
"e": "Log In →",
"b": "লগইন →"
},
{
"e": "Please Log In",
"b": "অনুগ্রহ করে লগইন করুন"
},
{
"e": "You need to be logged in to view your dashboard.",
"b": "ড্যাশবোর্ড দেখতে হলে আপনাকে লগইন করা থাকতে হবে।"
},
{
"e": "Member ID:",
"b": "মেম্বার আইডি:"
},
{
"e": "My Events",
"b": "আমার ইভেন্ট"
},
{
"e": "My Profile",
"b": "আমার প্রোফাইল"
},
{
"e": "My Quiz Results",
"b": "আমার কুইজের ফলাফল"
},
{
"e": "My Results",
"b": "আমার ফলাফল"
},
{
"e": "Log Out",
"b": "লগআউট"
},
{
"e": "Open Admin Panel",
"b": "অ্যাডমিন প্যানেল খুলুন"
},
{
"e": "👋 Your profile is not complete yet — please fill in the details below.",
"b": "👋 আপনার প্রোফাইল এখনো পূরণ করা হয়নি — নিচের তথ্যগুলো দিয়ে দিন।",
"a": [
"👋 তোমার প্রোফাইল এখনো পূরণ করা হয়নি — নিচের তথ্যগুলো দিয়ে দাও।"
]
},
{
"e": "Notifications",
"b": "নোটিফিকেশন"
},
{
"e": "🔔 Notifications",
"b": "🔔 নোটিফিকেশন",
"a": [
"🔔 নোটিফিকেশন"
]
},
{
"e": "No notifications yet.",
"b": "এখনো কোনো নোটিফিকেশন নেই।",
"a": [
"এখনো কোনো নোটিফিকেশন নেই।"
]
},
{
"e": "Pending review",
"b": "পর্যালোচনার অপেক্ষায়"
},
{
"e": "Registered",
"b": "রেজিস্ট্রেশন সম্পন্ন"
},
{
"e": "Member ID copied!",
"b": "মেম্বার আইডি কপি হয়েছে!"
},
{
"e": "{0} is required — all details are mandatory!",
"b": "{0} দিতে হবে — সব তথ্য বাধ্যতামূলক!",
"a": [
"{0} দিতে হবে — সব তথ্য বাধ্যতামূলক!"
]
},
{
"e": "Profile updated! ✅",
"b": "প্রোফাইল আপডেট হয়েছে! ✅"
},
{
"e": "Failed to save profile.",
"b": "প্রোফাইল সংরক্ষণ করা যায়নি।"
},
{
"e": "Please choose an image file.",
"b": "একটি ছবির ফাইল বেছে নিন।"
},
{
"e": "Uploading photo...",
"b": "ছবি আপলোড হচ্ছে..."
},
{
"e": "Photo updated! ✅",
"b": "ছবি আপডেট হয়েছে! ✅"
},
{
"e": "Photo upload failed.",
"b": "ছবি আপলোড ব্যর্থ হয়েছে।"
},
{
"e": "Download failed!",
"b": "ডাউনলোড ব্যর্থ হয়েছে!"
},
{
"e": "Address",
"b": "ঠিকানা"
},
{
"e": "Class / Grade",
"b": "শ্রেণি / গ্রেড"
},
{
"e": "Competition Title",
"b": "প্রতিযোগিতার নাম"
},
{
"e": "School / Institution",
"b": "স্কুল / প্রতিষ্ঠান"
},
{
"e": "Full Name *",
"b": "পূর্ণ নাম *"
},
{
"e": "Phone Number *",
"b": "ফোন নম্বর *"
},
{
"e": "Message (optional)",
"b": "বার্তা (ঐচ্ছিক)"
},
{
"e": "Which Olympiad / Event? * ",
"b": "কোন অলিম্পিয়াড / ইভেন্ট? *"
},
{
"e": "Which Olympiad / Event? *",
"b": "কোন অলিম্পিয়াড / ইভেন্ট? *"
},
{
"e": "Submit Registration ✅",
"b": "রেজিস্ট্রেশন জমা দিন ✅"
},
{
"e": "Submit Registration",
"b": "রেজিস্ট্রেশন জমা দিন"
},
{
"e": "Anything else you'd like to add",
"b": "আরও কিছু জানাতে চাইলে লিখুন"
},
{
"e": "District, Division",
"b": "জেলা, বিভাগ"
},
{
"e": "Your full name",
"b": "আপনার পূর্ণ নাম"
},
{
"e": "Your school or college name",
"b": "আপনার স্কুল বা কলেজের নাম"
},
{
"e": "Email Address *",
"b": "ইমেইল ঠিকানা *"
},
{
"e": "Submit",
"b": "জমা দিন"
},
{
"e": "You must log in to your account before registering — that way all your registrations and results appear in one place (Dashboard).",
"b": "রেজিস্ট্রেশন করতে হলে আগে অ্যাকাউন্টে লগইন করতে হবে — এতে আপনার সব রেজিস্ট্রেশন ও ফলাফল এক জায়গায় (ড্যাশবোর্ড) দেখা যাবে।",
"a": [
"রেজিস্ট্রেশন করতে হলে আগে account দিয়ে Log In করতে হবে — এতে তোমার সব registration/result এক জায়গায় (Dashboard) দেখা যাবে।"
]
},
{
"e": "Your registration is saved under your account email, so you can see it later in your Dashboard.",
"b": "আপনার অ্যাকাউন্টের ইমেইল দিয়েই রেজিস্ট্রেশন সেভ হবে, তাই ড্যাশবোর্ডে পরে নিজের রেজিস্ট্রেশন দেখা যাবে।",
"a": [
"তোমার account-এর email দিয়েই registration সেভ হবে, তাই Dashboard-এ পরে নিজের registration দেখা যাবে।"
]
},
{
"e": "Please enter your name!",
"b": "আপনার নাম লিখুন!"
},
{
"e": "Please enter your email!",
"b": "আপনার ইমেইল লিখুন!"
},
{
"e": "Please enter a valid email!",
"b": "সঠিক ইমেইল লিখুন!"
},
{
"e": "Please enter your message!",
"b": "আপনার বার্তা লিখুন!"
},
{
"e": "Message sent successfully! ✅",
"b": "বার্তা সফলভাবে পাঠানো হয়েছে! ✅"
},
{
"e": "Failed to send. Please try again!",
"b": "পাঠানো যায়নি। আবার চেষ্টা করুন!"
},
{
"e": "You must log in to your account before registering.",
"b": "রেজিস্ট্রেশন করতে আগে অ্যাকাউন্টে লগইন করতে হবে।",
"a": [
"রেজিস্ট্রেশন করতে আগে account দিয়ে Log In করতে হবে।"
]
},
{
"e": "Please complete your profile from the Dashboard first.",
"b": "আগে ড্যাশবোর্ড থেকে আপনার প্রোফাইল সম্পূর্ণ করুন।",
"a": [
"আগে Dashboard থেকে তোমার Profile সম্পূর্ণ করো।"
]
},
{
"e": "Please select an olympiad!",
"b": "একটি অলিম্পিয়াড নির্বাচন করুন!"
},
{
"e": "Please select a segment!",
"b": "একটি সেগমেন্ট নির্বাচন করুন!",
"a": [
"একটা Segment সিলেক্ট করো!"
]
},
{
"e": "Transaction ID is required — this is a paid event!",
"b": "ট্রানজ্যাকশন আইডি দিতে হবে — এটি একটি পেইড ইভেন্ট!",
"a": [
"Transaction ID দিতে হবে — এটা Paid Event!"
]
},
{
"e": "Failed to submit. Please try again!",
"b": "জমা দেওয়া যায়নি। আবার চেষ্টা করুন!"
},
{
"e": "Registration successful! We'll contact you soon. ✅",
"b": "রেজিস্ট্রেশন সফল হয়েছে! আমরা শীঘ্রই যোগাযোগ করব। ✅"
},
{
"e": "Event not found!",
"b": "ইভেন্ট খুঁজে পাওয়া যায়নি!"
},
{
"e": "Form not found!",
"b": "ফর্ম খুঁজে পাওয়া যায়নি!"
},
{
"e": "Please fill in \"{0}\"!",
"b": "\"{0}\" পূরণ করুন!",
"a": [
"\"{0}\" পূরণ করো!"
]
},
{
"e": "-- Select an Olympiad --",
"b": "-- একটি অলিম্পিয়াড বেছে নিন --"
},
{
"e": "-- Select a segment --",
"b": "-- একটি সেগমেন্ট বেছে নিন --"
},
{
"e": "No open registrations available",
"b": "এখন কোনো রেজিস্ট্রেশন খোলা নেই"
},
{
"e": "Registration Fee: {0}",
"b": "রেজিস্ট্রেশন ফি: {0}"
},
{
"e": "Complete the payment and enter the Transaction ID below.",
"b": "পেমেন্ট সম্পন্ন করে নিচে ট্রানজ্যাকশন আইডি দিন।",
"a": [
"পেমেন্ট সম্পন্ন করে নিচে Transaction ID দাও।"
]
},
{
"e": "Register Now",
"b": "এখনই রেজিস্ট্রেশন করুন"
},
{
"e": "📝 Registration",
"b": "📝 রেজিস্ট্রেশন"
},
{
"e": "e.g. bKash/Nagad Transaction ID",
"b": "যেমন বিকাশ/নগদ ট্রানজ্যাকশন আইডি"
},
{
"e": "Astronomy",
"b": "জ্যোতির্বিজ্ঞান"
},
{
"e": "Biology",
"b": "জীববিজ্ঞান"
},
{
"e": "Chemistry",
"b": "রসায়ন"
},
{
"e": "Physics",
"b": "পদার্থবিজ্ঞান"
},
{
"e": "Mathematics",
"b": "গণিত"
},
{
"e": "Science",
"b": "বিজ্ঞান"
},
{
"e": "English",
"b": "ইংরেজি"
},
{
"e": "General Knowledge",
"b": "সাধারণ জ্ঞান"
},
{
"e": "Informatics/CS",
"b": "ইনফরমেটিক্স/সিএস"
},
{
"e": "No events found.",
"b": "কোনো ইভেন্ট পাওয়া যায়নি।"
},
{
"e": "🔍No events found.",
"b": "🔍কোনো ইভেন্ট পাওয়া যায়নি।"
},
{
"e": "Quiz",
"b": "কুইজ"
},
{
"e": "Zone",
"b": "জোন"
},
{
"e": "Events",
"b": "ইভেন্ট"
},
{
"e": "Exam",
"b": "পরীক্ষা"
},
{
"e": "Title",
"b": "শিরোনাম"
},
{
"e": "Test your knowledge with our timed olympiad-style quizzes.",
"b": "আমাদের সময়ভিত্তিক অলিম্পিয়াড-ধাঁচের কুইজে নিজের জ্ঞান যাচাই করুন।"
},
{
"e": "No quizzes available right now",
"b": "এখন কোনো কুইজ নেই"
},
{
"e": "Start Quiz →",
"b": "কুইজ শুরু করুন →"
},
{
"e": "Start Quiz",
"b": "কুইজ শুরু করুন"
},
{
"e": "Back to Events",
"b": "ইভেন্টে ফিরে যান"
},
{
"e": "Submit Quiz",
"b": "কুইজ জমা দিন"
},
{
"e": "{0} min",
"b": "{0} মিনিট"
},
{
"e": "{0} questions",
"b": "{0}টি প্রশ্ন"
},
{
"e": "{0} / {1} answered",
"b": "{1}টির মধ্যে {0}টির উত্তর দেওয়া হয়েছে"
},
{
"e": "Head back to the",
"b": "ফিরে যান:"
},
{
"e": "page and look for the \"📝 Take Quiz Now\" button on an event.",
"b": "পেজে গিয়ে কোনো ইভেন্টে \"📝 এখনই কুইজ দিন\" বাটনটি খুঁজুন।"
},
{
"e": "Already Submitted",
"b": "ইতোমধ্যে জমা দেওয়া হয়েছে"
},
{
"e": "You have already completed this exam. Each participant can take it only once.",
"b": "আপনি এই পরীক্ষা ইতোমধ্যে সম্পন্ন করেছেন। প্রত্যেক অংশগ্রহণকারী কেবল একবার দিতে পারবেন।"
},
{
"e": "Not Open Yet",
"b": "এখনো শুরু হয়নি"
},
{
"e": "This exam opens on {0}. Please check back then.",
"b": "এই পরীক্ষা {0} তারিখে শুরু হবে। তখন আবার দেখুন।"
},
{
"e": "Exam Closed",
"b": "পরীক্ষা শেষ"
},
{
"e": "This exam closed on {0} and is no longer accepting submissions.",
"b": "এই পরীক্ষা {0} তারিখে শেষ হয়েছে এবং আর জমা নেওয়া হচ্ছে না।"
},
{
"e": "Login Required",
"b": "লগইন প্রয়োজন",
"a": [
"Log In প্রয়োজন"
]
},
{
"e": "Only participants registered for the {0} event can take this exam. Please log in to your account first.",
"b": "এই পরীক্ষায় শুধু {0} ইভেন্টে রেজিস্ট্রেশন করা অংশগ্রহণকারীরা অংশ নিতে পারবেন। আগে আপনার অ্যাকাউন্টে লগইন করুন।",
"a": [
"এই পরীক্ষায় শুধু {0} ইভেন্টে রেজিস্ট্রেশন করা অংশগ্রহণকারীরা অংশ নিতে পারবেন। আগে আপনার অ্যাকাউন্টে Log In করুন।"
],
"el": 1
},
{
"e": "Registration Required",
"b": "রেজিস্ট্রেশন প্রয়োজন"
},
{
"e": "Only registered participants can take this exam. Please register for the {0} event first, then come back here.",
"b": "এই পরীক্ষায় শুধু রেজিস্ট্রেশন করা অংশগ্রহণকারীরা অংশ নিতে পারবেন। আগে {0} ইভেন্টে রেজিস্টার করুন, তারপর এখানে ফিরে আসুন।",
"a": [
"এই পরীক্ষায় শুধু রেজিস্ট্রেশন করা অংশগ্রহণকারীরা অংশ নিতে পারবেন। আগে {0} ইভেন্টে Register করুন, তারপর এখানে ফিরে আসুন।"
],
"el": 1
},
{
"e": "Name, email and phone are required!",
"b": "নাম, ইমেইল ও ফোন নম্বর দিতে হবে!"
},
{
"e": "This exam can only be taken with your registered email.",
"b": "এই পরীক্ষা শুধু আপনার রেজিস্টার্ড ইমেইল দিয়েই দেওয়া যাবে।",
"a": [
"এই পরীক্ষা শুধু আপনার রেজিস্টার্ড ইমেইল দিয়েই দেওয়া যাবে।"
]
},
{
"e": "This exam hasn't opened yet.",
"b": "এই পরীক্ষা এখনো শুরু হয়নি।"
},
{
"e": "This exam is now closed.",
"b": "এই পরীক্ষা এখন বন্ধ।"
},
{
"e": "This email has already submitted this exam. Each participant can take it only once.",
"b": "এই ইমেইল দিয়ে ইতোমধ্যে পরীক্ষা জমা দেওয়া হয়েছে। প্রত্যেক অংশগ্রহণকারী কেবল একবার দিতে পারবেন।"
},
{
"e": "Type your answer...",
"b": "আপনার উত্তর লিখুন..."
},
{
"e": "Time's up! Submitting your quiz...",
"b": "সময় শেষ! আপনার কুইজ জমা দেওয়া হচ্ছে..."
},
{
"e": "Exam deadline reached! Submitting your quiz...",
"b": "পরীক্ষার সময়সীমা শেষ! আপনার কুইজ জমা দেওয়া হচ্ছে..."
},
{
"e": "You have {0} unanswered question(s). Submit anyway?",
"b": "আপনার {0}টি প্রশ্নের উত্তর দেওয়া হয়নি। তবুও জমা দেবেন?"
},
{
"e": "Correct answer: {0}",
"b": "সঠিক উত্তর: {0}"
},
{
"e": "Answer Review",
"b": "উত্তর পর্যালোচনা"
},
{
"e": "Your Score",
"b": "আপনার স্কোর"
},
{
"e": "No description provided.",
"b": "কোনো বিবরণ দেওয়া হয়নি।"
},
{
"e": "Closed",
"b": "বন্ধ"
},
{
"e": "Opens {0}",
"b": "শুরু: {0}"
},
{
"e": "Closes {0}",
"b": "শেষ: {0}"
},
{
"e": "Closed {0}",
"b": "শেষ হয়েছে: {0}"
},
{
"e": "Time Left:",
"b": "বাকি সময়:"
},
{
"e": "Pending",
"b": "অপেক্ষমাণ"
},
{
"e": "Ballot",
"b": "ব্যালট"
},
{
"e": "Committee",
"b": "কমিটি"
},
{
"e": "Election",
"b": "নির্বাচন"
},
{
"e": "Vote",
"b": "ভোট দিন"
},
{
"e": "Cast Your",
"b": "আপনার"
},
{
"e": "Confirm Your",
"b": "যাচাই করুন আপনার"
},
{
"e": "Cast your vote below. Your vote is completely anonymous.",
"b": "নিচে আপনার ভোট দিন। আপনার ভোট সম্পূর্ণ গোপন থাকবে।"
},
{
"e": "Select one option for each position below.",
"b": "নিচের প্রতিটি পদের জন্য একটি করে অপশন বেছে নিন।"
},
{
"e": "Please review carefully — once submitted, your vote cannot be changed.",
"b": "মনোযোগ দিয়ে দেখে নিন — একবার জমা দিলে ভোট আর বদলানো যাবে না।"
},
{
"e": "Continue to Ballot →",
"b": "ব্যালটে যান →"
},
{
"e": "Review My Ballot →",
"b": "আমার ব্যালট যাচাই করুন →"
},
{
"e": "Edit",
"b": "সম্পাদনা"
},
{
"e": "Submit My Vote",
"b": "আমার ভোট জমা দিন"
},
{
"e": "Secret Ballot",
"b": "গোপন ব্যালট"
},
{
"e": "Full Name *",
"b": "পূর্ণ নাম *"
},
{
"e": "Voting Not Open",
"b": "ভোটগ্রহণ চালু নেই"
},
{
"e": "Voting is not currently open. Please check back later.",
"b": "এখন ভোটগ্রহণ চালু নেই। পরে আবার দেখুন।"
},
{
"e": "Voting Has Not Started Yet",
"b": "ভোটগ্রহণ এখনো শুরু হয়নি"
},
{
"e": "Voting opens on {0}. Please come back then.",
"b": "ভোটগ্রহণ {0} তারিখে শুরু হবে। তখন আবার আসুন।"
},
{
"e": "Voting Has Closed",
"b": "ভোটগ্রহণ শেষ"
},
{
"e": "Voting closed on {0} and is no longer accepting ballots.",
"b": "ভোটগ্রহণ {0} তারিখে শেষ হয়েছে এবং আর ব্যালট নেওয়া হচ্ছে না।"
},
{
"e": "Not Ready Yet",
"b": "এখনো প্রস্তুত নয়"
},
{
"e": "The election has not been set up with candidates yet.",
"b": "নির্বাচনে এখনো প্রার্থী যোগ করা হয়নি।"
},
{
"e": "Already Voted",
"b": "ইতোমধ্যে ভোট দেওয়া হয়েছে"
},
{
"e": "You have already cast your vote in this election. Each person can only vote once.",
"b": "আপনি এই নির্বাচনে ইতোমধ্যে ভোট দিয়েছেন। প্রত্যেকে কেবল একবার ভোট দিতে পারবেন।"
},
{
"e": "You have already cast your vote in this election.",
"b": "আপনি এই নির্বাচনে ইতোমধ্যে ভোট দিয়েছেন।"
},
{
"e": "Submission Failed",
"b": "জমা দেওয়া ব্যর্থ হয়েছে"
},
{
"e": "Something went wrong while submitting your vote. Please try again.",
"b": "ভোট জমা দেওয়ার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।"
},
{
"e": "Thank You for Voting!",
"b": "ভোট দেওয়ার জন্য ধন্যবাদ!"
},
{
"e": "Your ballot has been securely and anonymously recorded. Results will be announced by the Election Committee once voting closes.",
"b": "আপনার ব্যালট নিরাপদে ও গোপনভাবে সংরক্ষণ করা হয়েছে। ভোটগ্রহণ শেষ হলে নির্বাচন কমিটি ফলাফল ঘোষণা করবে।"
},
{
"e": "💡 Your name/email/phone are only used to make sure each person votes once. They are never linked to your ballot choices — the vote itself is completely anonymous.",
"b": "💡 আপনার নাম/ইমেইল/ফোন শুধু প্রত্যেকে একবার ভোট দিচ্ছেন কি না তা নিশ্চিত করতে ব্যবহৃত হয়। এগুলো কখনোই আপনার ভোটের সাথে যুক্ত করা হয় না — ভোট সম্পূর্ণ গোপন।"
},
{
"e": "Abstain",
"b": "ভোটদানে বিরত"
},
{
"e": "e.g. Abdur Rahman",
"b": "যেমন আব্দুর রহমান"
},
{
"e": "Form Not Available",
"b": "ফর্ম পাওয়া যাচ্ছে না"
},
{
"e": "This form doesn't exist or isn't accepting responses right now.",
"b": "এই ফর্মটি নেই অথবা এখন উত্তর নেওয়া হচ্ছে না।"
},
{
"e": "This form will open on {0}.",
"b": "এই ফর্ম {0} তারিখে চালু হবে।"
},
{
"e": "This form closed on {0}.",
"b": "এই ফর্ম {0} তারিখে বন্ধ হয়েছে।"
},
{
"e": "This form is not accepting responses right now.",
"b": "এই ফর্মে এখন উত্তর নেওয়া হচ্ছে না।"
},
{
"e": "Time's up — submitting your answers…",
"b": "সময় শেষ — আপনার উত্তর জমা দেওয়া হচ্ছে…"
},
{
"e": "Only image files are supported.",
"b": "শুধু ছবির ফাইল সমর্থিত।"
},
{
"e": "❌ Only image files are supported.",
"b": "❌ শুধু ছবির ফাইল সমর্থিত।"
},
{
"e": "📎 Change image",
"b": "📎 ছবি পরিবর্তন করুন"
},
{
"e": "Upload failed — try again.",
"b": "আপলোড ব্যর্থ হয়েছে — আবার চেষ্টা করুন।"
},
{
"e": "❌ Upload failed — try again.",
"b": "❌ আপলোড ব্যর্থ হয়েছে — আবার চেষ্টা করুন।"
},
{
"e": "✅ Uploaded",
"b": "✅ আপলোড হয়েছে"
},
{
"e": "Please answer all required questions.",
"b": "সব বাধ্যতামূলক প্রশ্নের উত্তর দিন।"
},
{
"e": "Response Submitted!",
"b": "উত্তর জমা হয়েছে!"
},
{
"e": "Thank you — your response has been recorded.",
"b": "ধন্যবাদ — আপনার উত্তর সংরক্ষণ করা হয়েছে।"
},
{
"e": "Here's how you did:",
"b": "আপনার ফলাফল:"
},
{
"e": "Something went wrong. Please try again.",
"b": "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।"
},
{
"e": "Time Left:",
"b": "বাকি সময়:"
},
{
"e": "Quiz Submitted!",
"b": "কুইজ জমা হয়েছে!"
},
{
"e": "Thanks, {0}! আপনার উত্তর জমা হয়েছে।",
"b": "ধন্যবাদ, {0}! আপনার উত্তর জমা হয়েছে।",
"a": [
"Thanks, {0}! Your answers have been submitted."
]
},
{
"e": "⏳ Result Pending",
"b": "⏳ ফলাফল অপেক্ষমাণ",
"a": [
"Result Pending"
]
},
{
"e": "ফলাফল গ্রেডিংয়ের পর প্রকাশ করা হবে",
"b": "ফলাফল গ্রেডিংয়ের পর প্রকাশ করা হবে",
"a": [
"Results will be published after grading"
]
},
{
"e": "ফলাফল প্রকাশ হলে আপনার Dashboard-এর My Quiz Results-এ দেখতে পারবেন।",
"b": "ফলাফল প্রকাশ হলে আপনার ড্যাশবোর্ডের \"আমার কুইজের ফলাফল\" অংশে দেখতে পারবেন।",
"a": [
"Once published, you can see your result in My Quiz Results on your Dashboard."
],
"el": 1
},
{
"e": "👥 অংশগ্রহণকারীদের গ্রুপে যোগ দিন",
"b": "👥 অংশগ্রহণকারীদের গ্রুপে যোগ দিন",
"a": [
"👥 Join the participants' group"
]
},
{
"e": "Join Group",
"b": "গ্রুপে যোগ দিন"
},
{
"e": "Correct",
"b": "সঠিক"
},
{
"e": "Incorrect",
"b": "ভুল"
},
{
"e": "Event",
"b": "ইভেন্ট"
},
{
"e": "Email",
"b": "ইমেইল"
},
{
"e": "Organization",
"b": "সংস্থা"
},
{
"e": "Failed to load data",
"b": "ডেটা লোড করা যায়নি"
},
{
"e": "Upload failed",
"b": "আপলোড ব্যর্থ হয়েছে"
},
{
"e": "Submission not found",
"b": "জমা দেওয়া উত্তর পাওয়া যায়নি"
},
{
"e": "Verified",
"b": "যাচাইকৃত"
},
{
"e": "You have already submitted this exam.",
"b": "আপনি এই পরীক্ষা ইতোমধ্যে জমা দিয়েছেন।"
},
{
"e": "You have already voted.",
"b": "আপনি ইতোমধ্যে ভোট দিয়েছেন।"
},
{
"e": "Bangladesh's Premier Olympiad Hub",
"b": "বাংলাদেশের শীর্ষ অলিম্পিয়াড হাব"
},
{
"e": "Bangladesh's Premier Events Hub",
"b": "বাংলাদেশের শীর্ষ ইভেন্ট হাব"
},
{
"e": "Connecting ambitious students with national & international olympiads, competitions, and academic excellence programs across Bangladesh.",
"b": "সারা বাংলাদেশের উচ্চাকাঙ্ক্ষী শিক্ষার্থীদের জাতীয় ও আন্তর্জাতিক অলিম্পিয়াড, প্রতিযোগিতা এবং একাডেমিক শ্রেষ্ঠত্বের কর্মসূচির সাথে যুক্ত করছি।"
},
{
"e": "Explore Olympiads",
"b": "অলিম্পিয়াড দেখুন"
},
{
"e": "Olympiads Listed",
"b": "তালিকাভুক্ত অলিম্পিয়াড"
},
{
"e": "Discover upcoming olympiads and competitions designed to elevate your potential.",
"b": "আপনার সম্ভাবনাকে এগিয়ে নিতে সাজানো আসন্ন অলিম্পিয়াড ও প্রতিযোগিতাগুলো খুঁজে নিন।"
},
{
"e": "No olympiads found. Check back later!",
"b": "কোনো অলিম্পিয়াড পাওয়া যায়নি। পরে আবার দেখুন!"
},
{
"e": "No news available yet.",
"b": "এখনো কোনো নিউজ নেই।"
},
{
"e": "Learn More",
"b": "আরও জানুন"
},
{
"e": "Students Reached",
"b": "পৌঁছানো শিক্ষার্থী"
},
{
"e": "Districts Covered",
"b": "জেলা অন্তর্ভুক্ত"
},
{
"e": "TalentVerse Bangladesh is the country's most dedicated platform for olympiad information, resources, and community.",
"b": "TalentVerse Bangladesh হলো অলিম্পিয়াডের তথ্য, রিসোর্স ও কমিউনিটির জন্য দেশের সবচেয়ে নিবেদিত প্ল্যাটফর্ম।"
},
{
"e": "TalentVerse Bangladesh is the country's most dedicated platform for olympiad information, resources, and community. ",
"b": "TalentVerse Bangladesh হলো অলিম্পিয়াডের তথ্য, রিসোর্স ও কমিউনিটির জন্য দেশের সবচেয়ে নিবেদিত প্ল্যাটফর্ম।"
},
{
"e": "Bangladesh's most dedicated platform for event information, resources, and community — connecting ambitious students with national & international events, competitions, and online quizzes.",
"b": "ইভেন্টের তথ্য, রিসোর্স ও কমিউনিটির জন্য বাংলাদেশের সবচেয়ে নিবেদিত প্ল্যাটফর্ম — উচ্চাকাঙ্ক্ষী শিক্ষার্থীদের জাতীয় ও আন্তর্জাতিক ইভেন্ট, প্রতিযোগিতা ও অনলাইন কুইজের সাথে যুক্ত করছে।"
},
{
"e": "\"Every child in Bangladesh deserves to know about the opportunity that awaits their talent.\"",
"b": "\"বাংলাদেশের প্রতিটি শিশুর জানার অধিকার আছে তার প্রতিভার জন্য কী সুযোগ অপেক্ষা করছে।\""
},
{
"e": ". All rights reserved | Developed By Samin & Fahad.",
"b": ". সর্বস্বত্ব সংরক্ষিত | ডেভেলপড বাই Samin & Fahad।"
},
{
"e": "Quick Links",
"b": "দ্রুত লিংক"
},
{
"e": "Home",
"b": "হোম"
},
{
"e": "News",
"b": "নিউজ"
},
{
"e": "Committee Election",
"b": "কমিটি নির্বাচন"
},
{
"e": "Campus Ambassador Registration - Only 1 Day Left!",
"b": "ক্যাম্পাস অ্যাম্বাসেডর রেজিস্ট্রেশন — আর মাত্র ১ দিন বাকি!"
},
{
"e": "Description",
"b": "বিবরণ"
}
];

(function () {
  const MONTHS = [['Jan','জানুয়ারি'],['Feb','ফেব্রুয়ারি'],['Mar','মার্চ'],['Apr','এপ্রিল'],['May','মে'],['Jun','জুন'],
                  ['Jul','জুলাই'],['Aug','আগস্ট'],['Sep','সেপ্টেম্বর'],['Oct','অক্টোবর'],['Nov','নভেম্বর'],['Dec','ডিসেম্বর']];
  const FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const BN_DIG = '০১২৩৪৫৬৭৮৯';
  const toBnDigits = s => s.replace(/[0-9]/g, d => BN_DIG[d]);
  const toEnDigits = s => s.replace(/[০-৯]/g, d => String(BN_DIG.indexOf(d)));

  const norm = s => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\s+/g, ' ').trim();
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const exact = new Map(), elExact = new Map(), tpls = [];
  I18N_PAIRS.forEach(p => {
    [p.e, p.b].concat(p.a || []).forEach(src => {
      const k = norm(src);
      if (/\{\d\}/.test(k)) {
        const order = [];
        const re = new RegExp('^' + escRe(k).replace(/\\\{(\d)\\\}/g, (_, n) => { order.push(+n); return '(.+?)'; }) + '$');
        tpls.push({ re, order, p });
      } else {
        exact.set(k, p);
        if (p.el) elExact.set(k, p);
      }
    });
  });

  function fill(target, vals) { return target.replace(/\{(\d)\}/g, (_, n) => vals[+n] !== undefined ? vals[+n] : ''); }

  function lookupIn(map, core, lang, withTpl) {
    const p = map.get(core);
    if (p) return lang === 'bn' ? p.b : p.e;
    if (!withTpl) return null;
    for (const t of tpls) {
      const m = core.match(t.re);
      if (m) {
        const vals = {};
        t.order.forEach((n, i) => { vals[n] = m[i + 1]; });
        // translate the captured values too (e.g. a month or a label)
        Object.keys(vals).forEach(n => { const tv = lookupSimple(vals[n], lang); if (tv !== null) vals[n] = tv; });
        return fill(lang === 'bn' ? t.p.b : t.p.e, vals);
      }
    }
    return null;
  }
  function lookupSimple(s, lang) { const p = exact.get(norm(s)); return p ? (lang === 'bn' ? p.b : p.e) : null; }

  const LEAD = /^[\s*\p{Extended_Pictographic}\uFE0F\u200D←→↑↓✓✔•]+/u;
  const TRAIL = /[\s*\p{Extended_Pictographic}\uFE0F\u200D←→↑↓✓✔•]+$/u;
  const LEAD_ANY = /^[^\p{L}\p{N}]+/u;
  const TRAIL_ANY = /[^\p{L}\p{N}]+$/u;

  function trStr(raw, lang, map) {
    map = map || exact;
    const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
    const core = norm(raw);
    if (!core) return null;
    let out = lookupIn(map, core, lang, map === exact);
    if (out !== null) return lead + out + trail;
    const variants = [
      [LEAD, null], [null, TRAIL], [LEAD, TRAIL], [LEAD_ANY, null], [LEAD_ANY, TRAIL_ANY]
    ];
    for (const [lr, tr] of variants) {
      let pre = '', suf = '', c = core;
      if (lr) { const m = c.match(lr); if (m) { pre = m[0]; c = c.slice(pre.length); } }
      if (tr) { const m = c.match(tr); if (m) { suf = m[0]; c = c.slice(0, c.length - suf.length); } }
      if (!c || (!pre && !suf)) continue;
      out = lookupIn(map, c, lang, map === exact);
      if (out !== null) return lead + pre + out + suf + trail;
    }
    return null;
  }

  function convertDates(s, lang) {
    if (lang === 'bn') {
      if (!/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b/.test(s) || !/\d/.test(s)) return s;
      let t = s;
      FULL.forEach((f, i) => { t = t.replace(new RegExp('\\b' + f + '\\b', 'g'), MONTHS[i][1]); });
      MONTHS.forEach(([sh, bn]) => { t = t.replace(new RegExp('\\b' + sh + '\\b', 'g'), bn); });
      return toBnDigits(t);
    }
    if (!/[জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর]/.test(s)) return s;
    let t = s, hit = false;
    MONTHS.forEach(([sh, bn]) => { if (t.indexOf(bn) !== -1) { hit = true; t = t.split(bn).join(sh); } });
    if (!hit) return s;
    return toEnDigits(t);
  }

  const SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, OPTION: 0 };
  const textRec = new WeakMap();
  const attrRec = new WeakMap();
  const elRec = new WeakMap();
  const ATTRS = ['placeholder', 'title', 'alt', 'aria-label'];
  window.__i18nMissing = window.__i18nMissing || {};

  function skipNode(n) {
    const p = n.parentNode;
    if (!p || SKIP_TAGS[p.nodeName]) return true;
    if (p.closest && p.closest('[data-no-i18n],.notranslate')) return true;
    return false;
  }

  function processText(n) {
    if (skipNode(n)) return;
    const lang = getLang();
    const cur = n.nodeValue;
    let rec = textRec.get(n);
    if (!rec || rec.applied !== cur) { rec = { orig: cur, applied: cur }; textRec.set(n, rec); }
    let out = trStr(rec.orig, lang);
    if (out === null) {
      out = rec.orig;
      const k = norm(rec.orig);
      const hasBn = /[\u0980-\u09FF]/.test(k), hasEn = /[A-Za-z]{2,}/.test(k);
      if ((lang === 'en' && hasBn) || (lang === 'bn' && hasEn)) window.__i18nMissing[k] = 1;
    }
    out = convertDates(out, lang);
    if (out !== cur) { rec.applied = out; n.nodeValue = out; }
  }

  function processAttrs(el) {
    if (!el.getAttribute) return;
    const lang = getLang();
    ATTRS.forEach(a => {
      if (!el.hasAttribute(a)) return;
      if (a === 'placeholder' && el.hasAttribute('data-i18n-ph')) return;
      if (el.closest && el.closest('[data-no-i18n],.notranslate')) return;
      const cur = el.getAttribute(a);
      let all = attrRec.get(el); if (!all) { all = {}; attrRec.set(el, all); }
      let rec = all[a];
      if (!rec || rec.applied !== cur) { rec = { orig: cur, applied: cur }; all[a] = rec; }
      let out = trStr(rec.orig, lang);
      if (out === null) out = rec.orig;
      if (out !== cur) { rec.applied = out; el.setAttribute(a, out); }
    });
  }

  // Messages built with <strong>…</strong> inside (flagged el:1) are matched on the whole element
  function processInlineParents(root) {
    if (!root.querySelectorAll || !elExact.size && !tpls.length) return;
    const lang = getLang();
    root.querySelectorAll('strong,b,em').forEach(inner => {
      const el = inner.parentElement;
      if (!el || el.closest('[data-no-i18n],.notranslate')) return;
      let rec = elRec.get(el);
      if (rec && el.innerHTML !== rec.applied) rec = null;
      if (rec) { el.innerHTML = rec.origHTML; }
      const origHTML = el.innerHTML;
      const txt = norm(el.textContent);
      let out = null;
      for (const t of tpls) {
        if (!t.p.el) continue;
        const m = txt.match(t.re);
        if (m) { const vals = {}; t.order.forEach((n, i) => { vals[n] = m[i + 1]; }); out = fill(lang === 'bn' ? t.p.b : t.p.e, vals); break; }
      }
      if (out === null) { const p = elExact.get(txt); if (p) out = lang === 'bn' ? p.b : p.e; }
      if (out === null) { if (rec) elRec.delete(el); return; }
      if (out !== txt) { el.textContent = out; elRec.set(el, { origHTML, applied: el.innerHTML }); }
      else elRec.delete(el);
    });
  }

  function walk(root) {
    if (root.nodeType === 3) { processText(root); return; }
    if (root.nodeType !== 1) return;
    processInlineParents(root);
    processAttrs(root);
    root.querySelectorAll && root.querySelectorAll('[placeholder],[title],[alt],[aria-label]').forEach(processAttrs);
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = tw.nextNode())) processText(n);
  }

  let titleOrig = null, titleApplied = null;
  function processTitle() {
    if (titleOrig === null || document.title !== titleApplied) { titleOrig = document.title; titleApplied = document.title; }
    const out = trStr(titleOrig, getLang());
    if (out !== null && out !== document.title) { titleApplied = out; document.title = out; }
  }

  let mo = null;
  function observe() {
    if (!mo) return;
    mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS });
  }
  function onMutations(muts) {
    mo.disconnect();
    try {
      muts.forEach(m => {
        if (m.type === 'characterData') processText(m.target);
        else if (m.type === 'attributes') processAttrs(m.target);
        else m.addedNodes.forEach(walk);
      });
      processTitle();
    } finally { observe(); }
  }

  function applyAll() {
    if (!document.body) return;
    if (mo) mo.disconnect();
    try { walk(document.body); processTitle(); } finally { observe(); }
  }
  window.__i18nApplyAll = applyAll;

  // alert()/confirm() are not part of the page, so translate them separately
  ['alert', 'confirm'].forEach(fn => {
    const orig = window[fn].bind(window);
    window[fn] = function (msg) {
      const t = trStr(String(msg), getLang());
      return orig(t !== null ? t : msg);
    };
  });

  // Pages without a language button (vote, forms) get a small floating one
  function ensureToggle() {
    if (document.querySelector('.lang-toggle-btn')) return;
    const b = document.createElement('button');
    b.className = 'lang-toggle-btn lang-toggle-float';
    b.setAttribute('aria-label', 'Switch language');
    b.setAttribute('data-no-i18n', '');
    b.setAttribute('onclick', 'toggleLang()');
    b.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:9999;background:#0b1730;color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:9px 14px;font-weight:700;font-size:.8rem;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.35);';
    b.innerHTML = '🌐 <span class="lang-toggle-label"></span>';
    document.body.appendChild(b);
  }

  function start() {
    ensureToggle();
    mo = new MutationObserver(onMutations);
    if (typeof applyLanguage === 'function') applyLanguage(); else applyAll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
