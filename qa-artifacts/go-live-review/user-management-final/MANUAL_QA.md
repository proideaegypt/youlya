# User Management Manual QA

1. Open `/dashboard/settings/users`.
2. Confirm `إضافة مستخدم` button is visible.
3. Open Add User modal.
4. Enter invalid email and confirm error `يرجى إدخال بريد إلكتروني صحيح.`.
5. Submit without valid role and confirm role validation error.
6. Add a safe test user if email delivery is configured.
7. Confirm the new user appears in the table.
8. Click `تعديل` on a user row.
9. Change role/status and save.
10. Try demoting/deactivating the only active `super_admin` and confirm block message `لا يمكن إزالة آخر مدير رئيسي في النظام.`.
11. In mobile width, verify `إضافة مستخدم` and row action buttons remain visible.
12. Verify non-super_admin accounts cannot call users management actions (403 message).
