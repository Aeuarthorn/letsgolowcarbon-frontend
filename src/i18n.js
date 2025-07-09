import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'th',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: process.env.PUBLIC_URL + '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: false,
    },
  });


export default i18n;

//  import i18n from 'i18next';
//  import { initReactI18next } from 'react-i18next';

//  const resources = {
//   th: {
//    translation: {
//     home: 'หน้าหลัก',
//     routes: 'แนะนำเส้นทาง',
//     format: 'รูปแบบ',
//     about: 'เกี่ยวกับเรา',
//     contact: 'ติดต่อ',
//     language: 'ภาษา',
//     districts: [
//      {
//       "id": "mueang",
//       "name_th": "อำเภอเมือง",
//       "name_en": "Muang District"
//      },
//      {
//       "id": "phu_pha_man",
//       "name_th": "อำเภอภูผาม่าน",
//       "name_en": "Phu Pha Man"
//      },
//      {
//       "id": "ubonrat",
//       "name_th": "อำเภออุบลรัตน์",
//       "name_en": "Ubolratana"
//      },
//      {
//       "id": "phu_wiang",
//       "name_th": "อำเภอภูเวียง",
//       "name_en": "Phu Wiang"
//      },
//      {
//       "id": "nam_pong",
//       "name_th": "อำเภอน้ำพอง",
//       "name_en": "Nam Phong"
//      },
//      {
//       "id": "si_chomphu",
//       "name_th": "อำเภอสีชมพู",
//       "name_en": "Si Chomphu"
//      }
//     ],
//     formats: [
//      {
//       "id": "1day",
//       "name_th": "1 วัน",
//       "name_en": "1 Day"
//      },
//      {
//       "id": "2d1n",
//       "name_th": "2 วัน 1 คืน",
//       "name_en": "2 Days 1 Night"
//      },
//      {
//       "id": "3d2n",
//       "name_th": "3 วัน 2 คืน",
//       "name_en": "3 Days 2 Nights"
//      }
//     ],
//    },
//   },
//   en: {
//    translation: {
//     home: 'Home',
//     routes: 'Routes',
//     format: 'Format',
//     about: 'About Us',
//     contact: 'Contact',
//     language: 'Language',
//     districts: [
//      {
//       "id": "mueang",
//       "name_th": "อำเภอเมือง",
//       "name_en": "Muang District"
//      },
//      {
//       "id": "phu_pha_man",
//       "name_th": "อำเภอภูผาม่าน",
//       "name_en": "Phu Pha Man"
//      },
//      {
//       "id": "ubonrat",
//       "name_th": "อำเภออุบลรัตน์",
//       "name_en": "Ubolratana"
//      },
//      {
//       "id": "phu_wiang",
//       "name_th": "อำเภอภูเวียง",
//       "name_en": "Phu Wiang"
//      },
//      {
//       "id": "nam_pong",
//       "name_th": "อำเภอน้ำพอง",
//       "name_en": "Nam Phong"
//      },
//      {
//       "id": "si_chomphu",
//       "name_th": "อำเภอสีชมพู",
//       "name_en": "Si Chomphu"
//      }
//     ],
//     formats: [
//      {
//       "id": "1day",
//       "name_th": "1 วัน",
//       "name_en": "1 Day"
//      },
//      {
//       "id": "2d1n",
//       "name_th": "2 วัน 1 คืน",
//       "name_en": "2 Days 1 Night"
//      },
//      {
//       "id": "3d2n",
//       "name_th": "3 วัน 2 คืน",
//       "name_en": "3 Days 2 Nights"
//      }
//     ],
//    },
//   },
//  };

//  i18n.use(initReactI18next).init({
//   resources,
//   lng: 'th',
//   fallbackLng: 'en',
//   interpolation: {
//    escapeValue: false,
//   },
//  });

//  export default i18n;

// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import translationTH from './locales/th/translation.json';
// import translationEN from './locales/en/translation.json';

// i18n
//   .use(initReactI18next)
//   .init({
//     resources: {
//       th: {
//         translation: translationTH,
//       },
//       en: {
//         translation: translationEN,
//       },
//     },
//     lng: 'th', // หรือ 'en'
//     fallbackLng: 'th',
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;


