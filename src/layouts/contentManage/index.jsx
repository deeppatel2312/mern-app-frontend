import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import ContentManageEdit from "views/contentManage/default/edit";

export default function ContentManage(props) {
    const { ...rest } = props;
    const location = useLocation();
    const [open, setOpen] = React.useState(true);
    const [currentRoute, setCurrentRoute] = React.useState("Content Management");

    React.useEffect(() => {
        window.addEventListener("resize", () =>
            window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
        );
    }, []);
    React.useEffect(() => {
        getActiveRoute(routes);
    }, [location.pathname]);

    const getActiveRoute = (routes) => {
        let activeRoute = "Content Management";
        for (let i = 0; i < routes.length; i++) {
            if (
                window.location.href.indexOf(
                    routes[i].layout + "/" + routes[i].path
                ) !== -1
            ) {
                setCurrentRoute(routes[i].name);
            } else if (routes[i].layout === 'parent') {
                for (let j = 0; j < routes[i].child.length; j++) {
                    if (
                        window.location.href.indexOf(routes[i].child[j].layout + "/" + routes[i].child[j].path) !== -1
                    ) {
                        setCurrentRoute(routes[i].child[j].name)
                    }
                }
            }
        }
        return activeRoute;
    };
    const getActiveNavbar = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (
                window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
            ) {
                return routes[i].secondary;
            } else if (routes[i].layout === 'parent') {
                for (let j = 0; j < routes[i].child.length; j++) {
                    if (
                        window.location.href.indexOf(routes[i].child[j].layout + "/" + routes[i].child[j].path) !== -1
                    ) {
                        return routes[i].child[j].secondary;
                    }
                }
            }
        }
        return activeNavbar;
    };
    const getRoutes = (routes) => {
        // console.log(routes)
        return routes.map((prop, key) => {
            if (prop.layout === "/contentManage") {
                return (
                    <Route path={`/${prop.path}`} element={prop.component} key={key} />
                );
            } else if (prop.layout === "parent") {
                // console.log(prop)
                return prop.child.map((childProp, childKey) => {
                    if (childProp.layout === "/contentManage") {
                        // console.log(childProp, key)
                        return (
                            <Route path={`/${childProp.path}`} element={childProp.component} key={key} />
                        );
                    } else {
                        return null;
                    }
                })
            } else {
                return null;
            }
        });
    };

    document.documentElement.dir = "ltr";
    return (
        <div className="flex h-full w-full">
            <Sidebar open={open} onClose={() => setOpen(false)} />
            {/* Navbar & Main Content */}
            <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
                {/* Main Content */}
                <main
                    className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
                >
                    {/* Routes */}
                    <div className="h-full">
                        <div className="relative z-40">
                            <Navbar
                                onOpenSidenav={() => setOpen(true)}
                                logoText={"Luminix"}
                                brandText={currentRoute}
                                secondary={getActiveNavbar(routes)}
                                {...rest}
                            />
                        </div>
                        <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                            <Routes>
                                {getRoutes(routes)}

                                <Route
                                    path="/"
                                    element={<Navigate to="/contentManage/default" replace />}
                                />
                                <Route
                                    path="/edit"
                                    element={<ContentManageEdit />}
                                />
                            </Routes>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
