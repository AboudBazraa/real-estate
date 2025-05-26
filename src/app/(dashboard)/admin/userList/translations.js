"use client";

// Translations for the userList page
const userListTranslations = {
  en: {
    // Page header and description
    userManagement: "User Management",
    manageUsers: "Manage all user accounts",

    // Tabs
    allUsers: "All Users",
    activeUsers: "Active Users",
    blockedUsers: "Blocked Users",

    // User fields
    name: "Name",
    email: "Email",
    role: "Role",
    lastActive: "Last Active",
    status: "Status",
    actions: "Actions",

    // Status labels
    active: "Active",
    inactive: "Inactive",
    blocked: "Blocked",

    // Role labels
    admin: "Admin",
    agent: "Agent",
    user: "User",

    // Buttons
    addUser: "Add User",
    editUser: "Edit User",
    deleteUser: "Delete User",
    blockUser: "Block User",
    unblockUser: "Unblock User",
    viewDetails: "View Details",
    export: "Export",
    import: "Import",
    refresh: "Refresh",

    // Search and filter
    searchUsers: "Search users...",
    filterByRole: "Filter by role",
    sortBy: "Sort by",
    selectAll: "Select all",

    // Bulk actions
    bulkActions: "Bulk Actions",

    // Stats
    userCount: "User Count",

    // Confirmations
    confirmDeleteUser: "Are you sure you want to delete this user?",
    confirmBlockUser: "Are you sure you want to block this user?",
    confirmUnblockUser: "Are you sure you want to unblock this user?",

    // Success messages
    userAddedSuccess: "User added successfully",
    userUpdatedSuccess: "User updated successfully",
    userDeletedSuccess: "User deleted successfully",
    userBlockedSuccess: "User blocked successfully",
    userUnblockedSuccess: "User unblocked successfully",

    // Form fields
    firstName: "First Name",
    lastName: "Last Name",
    password: "Password",
    confirmPassword: "Confirm Password",
    cancel: "Cancel",
    save: "Save",

    // Error states
    errorFetchingUsers: "Error fetching users",
    tryAgain: "Try Again",
    noUsersFound: "No users found",

    // Empty state
    noUsersYet: "No users yet",

    // Import/export
    exportUsers: "Export Users",
    importUsers: "Import Users",
    downloadTemplate: "Download Template",
  },
  ar: {
    // Page header and description
    userManagement: "إدارة المستخدمين",
    manageUsers: "إدارة جميع حسابات المستخدمين",

    // Tabs
    allUsers: "جميع المستخدمين",
    activeUsers: "المستخدمون النشطون",
    blockedUsers: "المستخدمون المحظورون",

    // User fields
    name: "الاسم",
    email: "البريد الإلكتروني",
    role: "الدور",
    lastActive: "آخر نشاط",
    status: "الحالة",
    actions: "إجراءات",

    // Status labels
    active: "نشط",
    inactive: "غير نشط",
    blocked: "محظور",

    // Role labels
    admin: "مسؤول",
    agent: "وكيل",
    user: "مستخدم",

    // Buttons
    addUser: "إضافة مستخدم",
    editUser: "تعديل المستخدم",
    deleteUser: "حذف المستخدم",
    blockUser: "حظر المستخدم",
    unblockUser: "إلغاء حظر المستخدم",
    viewDetails: "عرض التفاصيل",
    export: "تصدير",
    import: "استيراد",
    refresh: "تحديث",

    // Search and filter
    searchUsers: "البحث عن المستخدمين...",
    filterByRole: "تصفية حسب الدور",
    sortBy: "ترتيب حسب",
    selectAll: "تحديد الكل",

    // Bulk actions
    bulkActions: "إجراءات جماعية",

    // Stats
    userCount: "عدد المستخدمين",

    // Confirmations
    confirmDeleteUser: "هل أنت متأكد من حذف هذا المستخدم؟",
    confirmBlockUser: "هل أنت متأكد من حظر هذا المستخدم؟",
    confirmUnblockUser: "هل أنت متأكد من إلغاء حظر هذا المستخدم؟",

    // Success messages
    userAddedSuccess: "تمت إضافة المستخدم بنجاح",
    userUpdatedSuccess: "تم تحديث المستخدم بنجاح",
    userDeletedSuccess: "تم حذف المستخدم بنجاح",
    userBlockedSuccess: "تم حظر المستخدم بنجاح",
    userUnblockedSuccess: "تم إلغاء حظر المستخدم بنجاح",

    // Form fields
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    cancel: "إلغاء",
    save: "حفظ",

    // Error states
    errorFetchingUsers: "خطأ في جلب المستخدمين",
    tryAgain: "حاول مرة أخرى",
    noUsersFound: "لم يتم العثور على مستخدمين",

    // Empty state
    noUsersYet: "لا يوجد مستخدمين بعد",

    // Import/export
    exportUsers: "تصدير المستخدمين",
    importUsers: "استيراد المستخدمين",
    downloadTemplate: "تنزيل القالب",
  },
};

export default userListTranslations;
