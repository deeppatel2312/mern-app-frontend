import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import UserLayout from "layouts/user";
import ProviderLayout from "layouts/provider";
import ServiceLayout from "layouts/service";
import AuthLayout from "layouts/auth";
import SubscriptionLayout from "layouts/subscription";
import JobLayout from "layouts/job";
import TransactionLayout from "layouts/transaction";
import DisputeLayout from "layouts/dispute";
import ReportLayout from "layouts/report";
import SettingLayout from "layouts/setting";
import ReviewLayout from "layouts/reviewManagement";
import ContentManageLayout from "layouts/contentManage";
import ReviewUserLayout from "layouts/reviewManagementUser";
const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="user/*" element={<UserLayout />} />
      <Route path="provider/*" element={<ProviderLayout />} />
      <Route path="service/*" element={<ServiceLayout />} />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="subscription/*" element={<SubscriptionLayout />} />
      <Route path="job/*" element={<JobLayout />} />
      <Route path="transaction/*" element={<TransactionLayout />} />
      <Route path="dispute/*" element={<DisputeLayout />} />
      <Route path="report/*" element={<ReportLayout />} />
      <Route path="setting/*" element={<SettingLayout />} />
      <Route path="review/*" element={<ReviewLayout />} />
      <Route path="reviewUser/*" element={<ReviewUserLayout />} />
      <Route path="contentManage/*" element={<ContentManageLayout />} />
      <Route path="/" element={<Navigate to="/auth/" replace />} />
    </Routes>
  );
};

export default App;
