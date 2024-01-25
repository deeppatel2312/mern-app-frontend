import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import UserIndex from "views/user/default";
import ServiceIndex from "views/service/default";
import ProviderIndex from "views/provider/default";
import RTLDefault from "views/rtl/default";

// Auth Imports
import SignIn from "views/auth/SignIn";
import ForgotPassword from "views/auth/ForgotPassword";

// Icon Imports
import {
    MdHome,
    MdOutlineShoppingCart,
    MdBarChart,
    MdPerson,
    MdOutlineStore,
    MdOutlinePersonPin,
    MdLock,
    MdPayment,
    MdOutlinePayment,
    MdWork,
    MdPeople,
    MdOutlineError,
    MdSettings,
    MdReviews,
    MdPages,
    MdPayments
} from "react-icons/md";
import SubscriptionIndex from "views/subscription/default";
import JobIndex from "views/job/default";
import DisputeIndex from "views/dispute/default";
import ReportIndex from "views/report/default";
import SettingIndex from "views/setting/default";
import TransactionIndex from "views/transaction/default";
import PayoutIndex from "views/transaction/payout";
import ReviewIndex from "views/reviewManagement/default";
import ContentManageIndex from "views/contentManage/default";
import ReviewUserIndex from "views/reviewManagementUser/default";

const routes = [
    {
        name: "Dashboard",
        layout: "/admin",
        path: "default",
        icon: <MdHome className="h-6 w-6" />,
        component: <MainDashboard />,
    },
    {
        name: "Data Tables",
        layout: "/admin",
        icon: <MdBarChart className="h-6 w-6" />,
        path: "data-tables",
        component: <DataTables />,
    },
    {
        name: "Profile",
        layout: "/admin",
        path: "profile",
        icon: <MdPerson className="h-6 w-6" />,
        component: <Profile />,
    },
    {
        name: "Sign In",
        layout: "/auth",
        path: "sign-in",
        icon: <MdLock className="h-6 w-6" />,
        component: <SignIn />,
    },
    {
        name: "Forgot password",
        layout: "/auth",
        path: "forgot-password",
        icon: <MdLock className="h-6 w-6" />,
        component: <ForgotPassword />,
    },
    {
        name: "Users",
        layout: "parent",
        icon: <MdPerson className="h-6 w-6" />,
        child: [
            {
                name: "Customers",
                parent: "Users",
                layout: "/user",
                path: "default",
                icon: <MdPerson className="h-6 w-6" />,
                component: <UserIndex />,
            },
            {
                name: "Providers",
                parent: "Users",
                layout: "/provider",
                path: "default",
                icon: <MdOutlinePersonPin className="h-6 w-6" />,
                component: <ProviderIndex />,
            }
        ]
    },
    // {
    //   name: "Users",
    //   layout: "/user",
    //   path: "default",
    //   icon: <MdPerson className="h-6 w-6" />,
    //   component: <UserIndex />,
    // },
    // {
    //   name: "Providers",
    //   layout: "/provider",
    //   path: "default",
    //   icon: <MdOutlinePersonPin className="h-6 w-6" />,
    //   component: <ProviderIndex />,
    // },
    {
        name: "Services",
        layout: "/service",
        path: "default",
        icon: <MdOutlineStore className="h-6 w-6" />,
        component: <ServiceIndex />,
    },
    {
        name: "Payments",
        layout: "parent",
        icon: <MdPayment className="h-6 w-6" />,
        child: [
            {
                name: "Subscription Plans",
                parent: "Payments",
                layout: "/subscription",
                path: "default",
                icon: <MdBarChart className="h-6 w-6" />,
                component: <SubscriptionIndex />,
            },
        ]
    },
    // {
    //   name: "Subscription",
    //   layout: "/subscription",
    //   path: "default",
    //   icon: <MdBarChart className="h-6 w-6" />,
    //   component: <SubscriptionIndex />,
    // },
    {
        name: "Jobs",
        layout: "/job",
        path: "default",
        icon: <MdWork className="h-6 w-6" />,
        component: <JobIndex />,
    },
    // {
    //   name: "Disputes",
    //   layout: "/dispute",
    //   path: "default",
    //   icon: <MdBarChart className="h-6 w-6" />,
    //   component: <DisputeIndex />,
    // },
    // {
    //   name: "Disputes",
    //   layout: "/report",
    //   path: "default",
    //   icon: <MdBarChart className="h-6 w-6" />,
    //   component: <ReportIndex />,
    // },
    {
        name: "Disputes",
        layout: "parent",
        icon: <MdPeople className="h-6 w-6" />,
        child: [
            {
                name: "Disputes",
                layout: "/dispute",
                path: "default",
                icon: <MdPeople className="h-6 w-6" />,
                component: <DisputeIndex />,
            },
            {
                name: "Reported Reviews",
                layout: "/report",
                path: "default",
                icon: <MdOutlineError className="h-6 w-6" />,
                component: <ReportIndex />,
            },
        ]
    },
    // {
    //     name: "Reviews",
    //     layout: "/review",
    //     path: "default",
    //     icon: <MdReviews className="h-6 w-6" />,
    //     component: <ReviewIndex />,
    // },
    {
        name: "Reviews",
        layout: "parent",
        icon: <MdPeople className="h-6 w-6" />,
        child: [
            {
                name: "Provider",
                layout: "/review",
                path: "default",
                icon: <MdPeople className="h-6 w-6" />,
                component: <ReviewIndex />,
            },
            {
                name: "User",
                layout: "/reviewUser",
                path: "default",
                icon: <MdPeople className="h-6 w-6" />,
                component: <ReviewUserIndex />,
            },
        ]
    },
    {
        name: "Static Pages",
        layout: "/contentManage",
        path: "default",
        icon: <MdPages className="h-6 w-6" />,
        component: <ContentManageIndex />,
    },
    // {
    //     name: "Transactions",
    //     layout: "/transaction",
    //     path: "default",
    //     icon: <MdPayments className="h-6 w-6" />,
    //     component: <TransactionIndex />,
    // },
    {
        name: "Transactions",
        layout: "parent",
        icon: <MdPayments className="h-6 w-6" />,
        child: [
            {
                name: "Incoming",
                layout: "/transaction",
                path: "default",
                icon: <MdOutlinePayment className="h-6 w-6" />,
                component: <TransactionIndex />,
            },
            {
                name: "Outgoing",
                layout: "/transaction",
                path: "payout",
                icon: <MdPayments className="h-6 w-6" />,
                component: <PayoutIndex />,
            },
        ]
    },
    {
        name: "Settings",
        layout: "/setting",
        path: "default",
        icon: <MdSettings className="h-6 w-6" />,
        component: <SettingIndex />,
    },
];
export default routes;
