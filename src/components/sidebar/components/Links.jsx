/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode

  const [opendMenu, setOpenedMenu] = useState('');
  let location = useLocation();
  // console.log("sidebar Called")
  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName;
  };
  useEffect(() => {
    // console.log(opendMenu)
    // setTimeout(() => {
    //   openMenu(openMenu);
    // }, 1000);
  }, [])

  const openMenu = (name) => {
    // console.log("parent called")
    let classList = document.getElementById(name).classList
    // console.log(classList, classList.DOMTokenList, classList.value.includes("hidden"))
    if (classList.value.includes("hidden")) {
      setOpenedMenu(name)
      classList.toggle('hidden')
      classList.toggle('block')
    } else {
      setOpenedMenu('')
      classList.toggle('hidden')
      classList.toggle('block')
    }
  }

  const preventOpenMenu = (e, name) => {
    // console.log("child called")
    // e.stopPropagation();
  }

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (
        (route.layout === "/admin" ||
          route.layout === "/auth" ||
          route.layout === "/job" ||
          route.layout === "/dispute" ||
          route.layout === "/report" ||
          // route.layout === "/user" ||
          // route.layout === "/provider" ||
          route.layout === "/service" ||
          route.layout === "/transaction" ||
          route.layout === "/setting" ||
          route.layout === "/review" ||
          route.layout === "/contentManage" ||
          // route.layout === "/subscription" ||
          route.layout === "/rtl") &&
        route.path !== "sign-in" &&
        // route.path !== "subscription" &&
        route.path !== "data-tables" &&
        route.path !== "forgot-password" &&
        route.path !== "profile" &&
        route.layout !== "parent"
      ) {
        return (
          <Link key={index} to={route.layout + "/" + route.path}>
            <div className="relative mb-3 flex hover:cursor-pointer">
              <li
                className={`my-[3px] flex cursor-pointer items-center px-8 ${activeRoute(route.layout + "/" + route.path)
                  // ? "dark:bg-gray-700"
                  // : ""
                  }`}
                key={index}
              >
                <span
                  className={`${activeRoute(route.layout + "/" + route.path) === true
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                    }`}
                >
                  {route.icon ? route.icon : <DashIcon />}{" "}
                </span>
                <p
                  className={`leading-1 ml-4 flex ${activeRoute(route.layout + "/" + route.path) === true
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                    }`}
                >
                  {route.name}
                </p>
              </li>
              {activeRoute(route.layout + "/" + route.path) ? (
                <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              ) : null}
            </div>
          </Link>
        );
      } else if (route.layout === "parent") {
        return (
          <>
            <div>
              <div className={`mb-3 flex cursor-pointer items-center px-8`} onClick={() => openMenu(route.name)}>
                <span className={`"font-medium text-gray-600 mr-4"`}>
                  {route.icon ? route.icon : <DashIcon />}
                </span>
                <p className="ml-4 w-full flex flex-row items-center justify-between font-medium text-gray-600">
                  <span>
                    {route.name}
                  </span>
                  <span className="font-medium ">
                    <MdOutlineKeyboardArrowDown className="ml-1 text-2xl" />
                  </span>
                </p>
              </div>
              <div className="ml-5 mt-2 childs hidden" id={route.name} onClick={(event) => preventOpenMenu(event, route.name)}>
                {
                  route.child.map((childRoute, childIndex) => {
                    return (
                      <Link key={childIndex} to={childRoute.layout + "/" + childRoute.path}>
                        <div className="relative mb-3 flex hover:cursor-pointer">
                          <li
                            className={`my-[3px] flex cursor-pointer items-center px-8 ${activeRoute(childRoute.layout + "/" + childRoute.path)
                              // ? "dark:bg-gray-700"
                              // : ""
                              }`}
                            key={childIndex}
                          >
                            <span
                              className={`${activeRoute(childRoute.layout + "/" + childRoute.path) === true
                                ? "font-bold text-brand-500 dark:text-white"
                                : "font-medium text-gray-600"
                                }`}
                            >
                              {childRoute.icon ? childRoute.icon : <DashIcon />}{" "}
                            </span>
                            <p
                              className={`leading-1 ml-2 flex ${activeRoute(childRoute.layout + "/" + childRoute.path) === true
                                ? "font-bold text-navy-700 dark:text-white"
                                : "font-medium text-gray-600"
                                }`}
                            >
                              {childRoute.name}
                            </p>
                          </li>
                          {activeRoute(childRoute.layout + "/" + childRoute.path) ? (
                            <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                          ) : null}
                        </div>
                      </Link>
                    )
                  })
                }
              </div>
            </div>
          </>
        )
      }
    });
  };
  // BRAND
  return createLinks(routes);
}

export default SidebarLinks;