"use client";

// Translations for the subscriptions page
const subscriptionsTranslations = {
  en: {
    // Page title and headers
    subscriptions: "Subscriptions",
    subscriptionsOverview: "Subscriptions Overview",
    plans: "Plans",
    subscribers: "Subscribers",

    // Tabs
    overview: "Overview",
    manageUsers: "Manage Users",
    managePlans: "Manage Plans",

    // Stats and metrics
    totalSubscriptions: "Total Subscriptions",
    activeSubscriptions: "Active Subscriptions",
    revenue: "Revenue",
    freeUsers: "Free Users",
    proUsers: "Pro Users",
    enterpriseUsers: "Enterprise Users",

    // Plan details
    free: "Free",
    pro: "Pro",
    enterprise: "Enterprise",
    month: "month",
    price: "Price",
    current: "Current",
    popular: "Popular",

    // Plan features
    freeDescription: "Basic features for individual users",
    proDescription: "For serious real estate professionals",
    enterpriseDescription: "For large agencies and brokers",

    // Free plan features
    freeListing: "Up to 5 property listings",
    freeAnalytics: "Basic property analytics",
    freeSupport: "Email support",

    // Pro plan features
    proListing: "Unlimited property listings",
    proAnalytics: "Advanced property analytics",
    proSupport: "Priority support",
    proFilters: "Advanced search filters",
    proToolkit: "Complete agent toolkit",

    // Enterprise plan features
    enterpriseListing: "Unlimited property listings",
    enterpriseAgents: "Unlimited agent accounts",
    enterpriseAnalytics: "Custom analytics",
    enterpriseSupport: "24/7 phone support",
    enterpriseBranding: "Custom branding",
    enterpriseAPI: "API access",

    // Table headers
    user: "User",
    email: "Email",
    plan: "Plan",
    status: "Status",
    startDate: "Start Date",
    actions: "Actions",

    // Status labels
    active: "Active",
    inactive: "Inactive",
    all: "All",

    // Actions and buttons
    manageSubscription: "Manage Subscription",
    updatePlan: "Update Plan",
    cancelSubscription: "Cancel Subscription",
    addSubscription: "Add Subscription",
    search: "Search",
    filter: "Filter",
    refresh: "Refresh",
    update: "Update",
    confirm: "Confirm",
    cancel: "Cancel",

    // Dialogs and forms
    selectPlan: "Select Plan",
    selectUser: "Select User",
    userSubscription: "User Subscription",
    updateSubscription: "Update Subscription",
    cancelSubscriptionTitle: "Cancel Subscription",
    cancelSubscriptionMessage:
      "Are you sure you want to cancel this subscription? The user will be downgraded to the Free plan.",
    selectUserFirst: "Please select a user first",

    // Placeholders and messages
    searchUsers: "Search users...",
    noResults: "No results found",
    loading: "Loading...",
    subscriptionUpdated: "Subscription updated",
    subscriptionCancelled: "Subscription cancelled",
  },
  ar: {
    // Page title and headers
    subscriptions: "الاشتراكات",
    subscriptionsOverview: "نظرة عامة على الاشتراكات",
    plans: "الخطط",
    subscribers: "المشتركين",

    // Tabs
    overview: "نظرة عامة",
    manageUsers: "إدارة المستخدمين",
    managePlans: "إدارة الخطط",

    // Stats and metrics
    totalSubscriptions: "إجمالي الاشتراكات",
    activeSubscriptions: "الاشتراكات النشطة",
    revenue: "الإيرادات",
    freeUsers: "المستخدمين المجانيين",
    proUsers: "المستخدمين المحترفين",
    enterpriseUsers: "مستخدمي المؤسسات",

    // Plan details
    free: "مجاني",
    pro: "محترف",
    enterprise: "مؤسسة",
    month: "شهر",
    price: "السعر",
    current: "الحالي",
    popular: "الأكثر شعبية",

    // Plan features
    freeDescription: "ميزات أساسية للمستخدمين الأفراد",
    proDescription: "للمحترفين العقاريين الجادين",
    enterpriseDescription: "للوكالات والوسطاء الكبار",

    // Free plan features
    freeListing: "حتى 5 قوائم عقارية",
    freeAnalytics: "تحليلات عقارية أساسية",
    freeSupport: "دعم بالبريد الإلكتروني",

    // Pro plan features
    proListing: "قوائم عقارية غير محدودة",
    proAnalytics: "تحليلات عقارية متقدمة",
    proSupport: "دعم ذو أولوية",
    proFilters: "مرشحات بحث متقدمة",
    proToolkit: "مجموعة أدوات وكيل كاملة",

    // Enterprise plan features
    enterpriseListing: "قوائم عقارية غير محدودة",
    enterpriseAgents: "حسابات وكلاء غير محدودة",
    enterpriseAnalytics: "تحليلات مخصصة",
    enterpriseSupport: "دعم هاتفي على مدار الساعة",
    enterpriseBranding: "علامة تجارية مخصصة",
    enterpriseAPI: "الوصول إلى واجهة برمجة التطبيقات",

    // Table headers
    user: "المستخدم",
    email: "البريد الإلكتروني",
    plan: "الخطة",
    status: "الحالة",
    startDate: "تاريخ البدء",
    actions: "الإجراءات",

    // Status labels
    active: "نشط",
    inactive: "غير نشط",
    all: "الكل",

    // Actions and buttons
    manageSubscription: "إدارة الاشتراك",
    updatePlan: "تحديث الخطة",
    cancelSubscription: "إلغاء الاشتراك",
    addSubscription: "إضافة اشتراك",
    search: "بحث",
    filter: "تصفية",
    refresh: "تحديث",
    update: "تحديث",
    confirm: "تأكيد",
    cancel: "إلغاء",

    // Dialogs and forms
    selectPlan: "اختر الخطة",
    selectUser: "اختر المستخدم",
    userSubscription: "اشتراك المستخدم",
    updateSubscription: "تحديث الاشتراك",
    cancelSubscriptionTitle: "إلغاء الاشتراك",
    cancelSubscriptionMessage:
      "هل أنت متأكد من رغبتك في إلغاء هذا الاشتراك؟ سيتم خفض مستوى المستخدم إلى الخطة المجانية.",
    selectUserFirst: "الرجاء اختيار مستخدم أولاً",

    // Placeholders and messages
    searchUsers: "البحث عن المستخدمين...",
    noResults: "لم يتم العثور على نتائج",
    loading: "جارٍ التحميل...",
    subscriptionUpdated: "تم تحديث الاشتراك",
    subscriptionCancelled: "تم إلغاء الاشتراك",
  },
};

export default subscriptionsTranslations;
