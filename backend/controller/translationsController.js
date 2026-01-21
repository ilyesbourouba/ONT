const { asyncHandler } = require('../utils/helpers');

// Static translations (can be moved to DB later)
const translations = {
  en: {
    nav: {
      home: 'Home',
      aboutUs: 'About Us',
      news: 'News',
      tourGuide: 'Tour Guide',
      planTrip: 'Plan Your Trip',
      contact: 'Contact',
    },
    logoText: 'ONT',
    logoHighlight: 'ALGERIA',
    tagline: 'Official Tourism Portal',
    headline: 'Experience the Timeless Beauty of Algeria',
    footer: {
      tagline: 'The official gateway to Algeria\'s tourism and heritage.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      address: '02, Rue Amar El Kama, Algiers, Algeria',
      phone: '+213 (0) 21 71 30 60',
      email: 'contact@ont.dz',
      rights: 'All rights reserved.'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      aboutUs: 'من نحن',
      news: 'أخبار السياحة',
      tourGuide: 'جولة افتراضية',
      planTrip: 'خطط لرحلتك',
      contact: 'اتصل بنا',
    },
    logoText: 'الديوان',
    logoHighlight: 'الجزائر',
    tagline: 'البوابة الرسمية للسياحة',
    headline: 'اكتشف الجمال الخالد للجزائر',
    footer: {
      tagline: 'البوابة الرسمية للسياحة والتراث في الجزائر.',
      quickLinks: 'روابط سريعة',
      contactUs: 'اتصل بنا',
      address: '02، شارع عمار الكامة، الجزائر العاصمة',
      phone: '+213 (0) 21 71 30 60',
      email: 'contact@ont.dz',
      rights: 'جميع الحقوق محفوظة.'
    }
  }
};

/**
 * @desc    Get translations for a language
 * @route   GET /api/translations/:lang
 * @access  Public
 */
exports.getTranslations = asyncHandler(async (req, res) => {
  const { lang } = req.params;
  
  if (!translations[lang]) {
    return res.status(404).json({
      success: false,
      message: `Translations for language '${lang}' not found`
    });
  }
  
  res.json({
    success: true,
    data: translations[lang]
  });
});

/**
 * @desc    Get all available languages
 * @route   GET /api/translations
 * @access  Public
 */
exports.getAvailableLanguages = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: Object.keys(translations)
  });
});
