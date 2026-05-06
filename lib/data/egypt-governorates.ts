export type GovernorateCity = {
  id: string;
  nameAr: string;
  nameEn: string;
  defaultShippingFee: number;
  cities: string[];
};

export const EGYPT_GOVERNORATES: GovernorateCity[] = [
  {
    id: "cairo",
    nameAr: "القاهرة",
    nameEn: "Cairo",
    defaultShippingFee: 70,
    cities: ["القاهرة", "مدينة نصر", "مصر الجديدة", "المعادي", "التجمع الخامس", "6 أكتوبر", "الشيخ زايد", "حدائق القبة", "عين شمس", "المرج", "المطرية", "الزيتون", "الوايلي", "باب الشعرية", "السيدة زينب", "الموسكي", "الدرب الأحمر", "الخليفة", "بولاق", "شبرا"],
  },
  {
    id: "alexandria",
    nameAr: "الإسكندرية",
    nameEn: "Alexandria",
    defaultShippingFee: 70,
    cities: ["الإسكندرية", "سيدي بشر", "المنتزه", "العجمي", "الدخيلة", "العامرية", "برج العرب", "الحضرة", "محطة الرمل", "كفر عبده", "سموحة", "فلمنج", "سبورتنج", "الإبراهيمية", "المنشية"],
  },
  {
    id: "giza",
    nameAr: "الجيزة",
    nameEn: "Giza",
    defaultShippingFee: 100,
    cities: ["الجيزة", "الهرم", "فيصل", "الدقي", "العجوزة", "إمبابة", "الوراق", "بولاق الدكرور", "الصف", "أطفيح", "العياط", "الواحات البحرية"],
  },
  {
    id: "qalyubia",
    nameAr: "القليوبية",
    nameEn: "Qalyubia",
    defaultShippingFee: 100,
    cities: ["بنها", "قليوب", "شبرا الخيمة", "الخانكة", "كفر شكر", "القناطر الخيرية", "طوخ", "الخصوص"],
  },
  {
    id: "dakahlia",
    nameAr: "الدقهلية",
    nameEn: "Dakahlia",
    defaultShippingFee: 100,
    cities: ["المنصورة", "طلخا", "ميت غمر", "دكرنس", "أجا", "منية النصر", "السنبلاوين", "بلقاس", "شربين", "المطرية"],
  },
  {
    id: "sharkia",
    nameAr: "الشرقية",
    nameEn: "Sharqia",
    defaultShippingFee: 100,
    cities: ["الزقازيق", "بلبيس", "منيا القمح", "أبو حماد", "فاقوس", "الإبراهيمية", "ديرب نجم", "كفر صقر", "أولاد صقر", "الحسينية"],
  },
  {
    id: "gharbia",
    nameAr: "الغربية",
    nameEn: "Gharbia",
    defaultShippingFee: 100,
    cities: ["طنطا", "المحلة الكبرى", "كفر الزيات", "سمنود", "السنطة", "قطور", "زفتى", "بسيون"],
  },
  {
    id: "monufia",
    nameAr: "المنوفية",
    nameEn: "Monufia",
    defaultShippingFee: 100,
    cities: ["شبين الكوم", "منوف", "أشمون", "الباجور", "قويسنا", "تلا", "بركة السبع", "الشهداء", "سرس الليان"],
  },
  {
    id: "beheira",
    nameAr: "البحيرة",
    nameEn: "Beheira",
    defaultShippingFee: 100,
    cities: ["دمنهور", "كفر الدوار", "رشيد", "إدكو", "أبو المطامير", "المحمودية", "الرحمانية", "إيتاي البارود", "شبراخيت", "كوم حمادة", "وادي النطرون"],
  },
  {
    id: "kafr_el_sheikh",
    nameAr: "كفر الشيخ",
    nameEn: "Kafr El Sheikh",
    defaultShippingFee: 100,
    cities: ["كفر الشيخ", "دسوق", "فوه", "مطوبس", "البرلس", "الحامول", "بيلا", "الرياض", "سيدي سالم", "قلين"],
  },
  {
    id: "damietta",
    nameAr: "دمياط",
    nameEn: "Damietta",
    defaultShippingFee: 100,
    cities: ["دمياط", "دمياط الجديدة", "فارسكور", "كفر سعد", "الزرقا", "كفر البطيخ", "الروضة"],
  },
  {
    id: "port_said",
    nameAr: "بورسعيد",
    nameEn: "Port Said",
    defaultShippingFee: 100,
    cities: ["بورسعيد", "بورفؤاد", "العرب", "المناخ", "الشرق", "الجنوب"],
  },
  {
    id: "ismailia",
    nameAr: "الإسماعيلية",
    nameEn: "Ismailia",
    defaultShippingFee: 100,
    cities: ["الإسماعيلية", "فايد", "القنطرة شرق", "القنطرة غرب", "التل الكبير", "أبو صوير"],
  },
  {
    id: "suez",
    nameAr: "السويس",
    nameEn: "Suez",
    defaultShippingFee: 100,
    cities: ["السويس", "الأربعين", "فيصل", "عتاقة", "الجناين"],
  },
  {
    id: "fayoum",
    nameAr: "الفيوم",
    nameEn: "Fayoum",
    defaultShippingFee: 100,
    cities: ["الفيوم", "سنورس", "إطسا", "أبشواي", "طامية", "يوسف الصديق"],
  },
  {
    id: "beni_suef",
    nameAr: "بني سويف",
    nameEn: "Beni Suef",
    defaultShippingFee: 100,
    cities: ["بني سويف", "الفشن", "ببا", "الواسطى", "ناصر", "إهناسيا", "سمسطا"],
  },
  {
    id: "minya",
    nameAr: "المنيا",
    nameEn: "Minya",
    defaultShippingFee: 100,
    cities: ["المنيا", "ملوي", "سمالوط", "بني مزار", "مغاغة", "أبو قرقاص", "دير مواس", "مطاي"],
  },
  {
    id: "assiut",
    nameAr: "أسيوط",
    nameEn: "Assiut",
    defaultShippingFee: 100,
    cities: ["أسيوط", "ديروط", "القوصية", "منفلوط", "أبو تيج", "الغنايم", "البداري", "ساحل سليم", "صدفا"],
  },
  {
    id: "sohag",
    nameAr: "سوهاج",
    nameEn: "Sohag",
    defaultShippingFee: 100,
    cities: ["سوهاج", "أخميم", "جرجا", "طهطا", "طما", "المراغة", "البلينا", "المنشأة", "دار السلام", "جهينة"],
  },
  {
    id: "qena",
    nameAr: "قنا",
    nameEn: "Qena",
    defaultShippingFee: 100,
    cities: ["قنا", "نجع حمادي", "دشنا", "فرشوط", "أبو تشت", "نقادة", "الوقف", "قوص"],
  },
  {
    id: "luxor",
    nameAr: "الأقصر",
    nameEn: "Luxor",
    defaultShippingFee: 100,
    cities: ["الأقصر", "إسنا", "أرمنت", "الطود"],
  },
  {
    id: "aswan",
    nameAr: "أسوان",
    nameEn: "Aswan",
    defaultShippingFee: 100,
    cities: ["أسوان", "إدفو", "دراو", "كوم أمبو", "نصر النوبة", "السباعية"],
  },
  {
    id: "red_sea",
    nameAr: "البحر الأحمر",
    nameEn: "Red Sea",
    defaultShippingFee: 100,
    cities: ["الغردقة", "سفاجا", "القصير", "مرسى علم", "شلاتين", "حلايب"],
  },
  {
    id: "new_valley",
    nameAr: "الوادي الجديد",
    nameEn: "New Valley",
    defaultShippingFee: 100,
    cities: ["الخارجة", "الداخلة", "الفرافرة", "باريس", "بلاط", "الوادي الجديد"],
  },
  {
    id: "matrouh",
    nameAr: "مرسى مطروح",
    nameEn: "Matrouh",
    defaultShippingFee: 100,
    cities: ["مرسى مطروح", "العلمين", "الضبعة", "سيوة", "الحمام", "النجيلة", "براني"],
  },
  {
    id: "north_sinai",
    nameAr: "شمال سيناء",
    nameEn: "North Sinai",
    defaultShippingFee: 100,
    cities: ["العريش", "الشيخ زويد", "رفح", "بئر العبد", "الحسنة", "نخل"],
  },
  {
    id: "south_sinai",
    nameAr: "جنوب سيناء",
    nameEn: "South Sinai",
    defaultShippingFee: 100,
    cities: ["شرم الشيخ", "دهب", "نويبع", "طابا", "سانت كاترين", "رأس سدر", "أبو رديس"],
  },
];

export function getGovernorateById(id: string): GovernorateCity | undefined {
  return EGYPT_GOVERNORATES.find((g) => g.id === id);
}

export function getCitiesForGovernorate(governorateId: string): string[] {
  return getGovernorateById(governorateId)?.cities ?? [];
}

export function getDefaultShippingFee(governorateId: string): number {
  return getGovernorateById(governorateId)?.defaultShippingFee ?? 100;
}
