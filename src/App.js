import React, { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import MainPage from "./component/view/MainPage";
import DistrictPage from "./component/view/DistrictPage";
import Contact from "./component/view/Contact";
import HeadPage from "./component/view/HeadPage";
import About from "./component/view/About";
import debounce from "lodash.debounce";
import { createTheme } from "@mui/material";
// import MainRouteMueangOne from "./component/view/routes/route_mueang/MainRouteMueangOne";
// import MainRouteMueangTwo from "./component/view/routes/route_mueang/MainRouteMueangTwo";
// import MainRouteMueangThree from "./component/view/routes/route_mueang/MainRouteMueangThree";
// import MainRoutePhuPhaManOne from "./component/view/routes/route_phu_pha_man/MainRoutePhuPhaManOne";
// import MainRoutePhuPhaManTwo from "./component/view/routes/route_phu_pha_man/MainRoutePhuPhaManTwo";
// import MainRouteUbolratOne from "./component/view/routes/route_ubolrat/MainRouteUbolratOne";
// import MainRouteUbolratTwo from "./component/view/routes/route_ubolrat/MainRouteUbolratTwo";
import MainRoutes from "./component/view/routes/MainRoutes";
import { APIProvider } from "@vis.gl/react-google-maps";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import MainAdmin from "./component/admin/MainAdmin";
import MainUser from "./component/user/MainUser";
import "leaflet/dist/leaflet.css";
import TermofService from "./component/view/TermofService";
import PrivacyPolicy from "./component/view/PrivacyPolicy"
import PlacesList from "./component/view/places/PlacesList";
import PlacesDetails from "./component/view/places/PlacesDetails";
import MainTravelTypes from "./component/view/traveltypes/MainTravelTypes";
import ResetPasswordPage from "./ResetPasswordPage";
import MainGroupTourPage from "./component/view/grouptour/MainGroupTourPage";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const defaultTheme = createTheme({
  typography: {
    fontFamily: "'Noto Sans Thai', 'Prompt', sans-serif",
  },
  palette: {
    primary: {
      main: "#007FFF",
      dark: "#0066CC",
    },
  },
});

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const [showHeader, setShowHeader] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [role, setRole] = useState("guest"); // กำหนด default เป็น guest เลย
  const [loadingRole, setLoadingRole] = useState(true);

  // ใช้ useRef เก็บสถานะล่าสุดของ showHeader เพื่อใช้ใน handler scroll
  const showHeaderRef = useRef(showHeader);

  useEffect(() => {
    showHeaderRef.current = showHeader;
  }, [showHeader]);

  useEffect(() => {
    // ฟังก์ชันดึง role user
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          if (data.role === "admin" || data.role === "user") {
            setRole(data.role);
          } else {
            setRole("guest");
          }
        } else {
          setRole("guest");
        }
      } catch {
        setRole("guest");
      } finally {
        setLoadingRole(false);
      }
    };
    fetchUserRole();


    let lastScrollTop = window.scrollY;

    // debounce ฟังก์ชันเพื่อจำกัดความถี่การเรียก setShowHeader
    const handleScroll = debounce(() => {
      const scrollTop = window.scrollY;

      if ((scrollTop < 100 || scrollTop < lastScrollTop) && !showHeaderRef.current) {
        setShowHeader(true);
      } else if (!(scrollTop < 100 || scrollTop < lastScrollTop) && showHeaderRef.current) {
        setShowHeader(false);
      }

      lastScrollTop = Math.max(scrollTop, 0);
    }, 100); // 100ms delay



    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      handleScroll.cancel(); // ยกเลิก debounce ตอน unmount
    };

  }, []);

  if (loadingRole) return <div>Loading...</div>;

  const ProtectedRoute = ({ element, allowedRoles, userRole }) => {
    // console.log("Checking role:", userRole, "Allowed roles:", allowedRoles);
    const currentRole = userRole ?? "guest";

    if (!allowedRoles.includes(currentRole)) {
      return (
        <div style={{ padding: 20, textAlign: "center" }}>
          ⛔ ไม่อนุญาตให้เข้าถึง
        </div>
      );
    }
    return element;
  };

  return (
    <>
      {/* HEADER */}
      {!isAdminPage && (
        <div
          className={`transition-transform duration-300 fixed top-0 left-0 right-0 z-50 ${showHeader ? "translate-y-0" : "-translate-y-full"
            }`}
        >
          <HeadPage
            screenWidth={screenWidth}
            defaultTheme={defaultTheme}
            roles={role}
            isAuthenticated={role !== "guest"}
          />
        </div>
      )}
      {/* BODY CONTENT */}
      <div style={{ paddingTop: !isAdminPage ? "60px" : "0px" }}>
        <Routes>
          <Route
            path="/"
            element={
              <MainPage screenWidth={screenWidth} defaultTheme={defaultTheme} />
            }
          />
          <Route
            path="/district/:id"
            element={
              <ProtectedRoute
                element={
                  <DistrictPage
                    screenWidth={screenWidth}
                    defaultTheme={defaultTheme}
                  />
                }
                allowedRoles={["admin", "user", "guest"]}
                userRole={role}
              />
            }
          />
          <Route
            path="/format/:ttid"
            element={
              <ProtectedRoute
                element={
                  <MainTravelTypes
                    screenWidth={screenWidth}
                    defaultTheme={defaultTheme}
                  />
                }
                allowedRoles={["admin", "user", "guest"]}
                userRole={role}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute
                element={
                  <Contact
                    screenWidth={screenWidth}
                    defaultTheme={defaultTheme}
                  />
                }
                allowedRoles={["admin", "user", "guest"]}
                userRole={role}
              />
            }
          />
          <Route
            path="/tour"
            element={
              <ProtectedRoute
                element={
                  <MainGroupTourPage
                    screenWidth={screenWidth}
                    defaultTheme={defaultTheme}
                  />
                }
                allowedRoles={["admin", "user", "guest"]}
                userRole={role}
              />
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute
                element={
                  <About
                    screenWidth={screenWidth}
                    defaultTheme={defaultTheme}
                  />
                }
                allowedRoles={["admin", "user", "guest"]}
                userRole={role}
              />
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute
                element={
                  <PrivacyPolicy
                    screenWidth={screenWidth}
                    defaultTheme={defaultTheme}
                  />
                }
                allowedRoles={["admin", "user", "guest"]}
                userRole={role}
              />
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute
                element={
                  <TermofService
                    screenWidth={screenWidth}
                    defaultTheme={defaultTheme}
                  />
                }
                allowedRoles={["admin", "user", "guest"]}
                userRole={role}
              />
            }
          />

          <Route
            path="/login"
            element={
              role !== "guest" ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage
                  screenWidth={screenWidth}
                  defaultTheme={defaultTheme}
                />
              )
            }
          />
          <Route
            path="/reset-password"
            element={
              role !== "guest" ? (
                <Navigate to="/" replace />
              ) : (
                <ResetPasswordPage
                  screenWidth={screenWidth}
                  defaultTheme={defaultTheme}
                />
              )
            }
          />

          <Route
            path="/signup"
            element={
              role !== "guest" ? (
                <Navigate to="/" replace />
              ) : (
                <SignUpPage
                  screenWidth={screenWidth}
                  defaultTheme={defaultTheme}
                />
              )
            }
          />
          {/* <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<MainAdmin />}
                allowedRoles={["admin"]}
                userRole={role}
              />
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute
                element={<MainUser />}
                allowedRoles={["user"]}
                userRole={role}
              />
            }
          /> */}
          <Route
            path="/admin/*"
            element={
              <MainAdmin
                screenWidth={screenWidth}
                defaultTheme={defaultTheme}
                allowedRoles={["admin"]}
                userRole={role}
              />
            }
          />
          <Route
            path="/user/*"
            element={
              <MainUser
                screenWidth={screenWidth}
                defaultTheme={defaultTheme}
                allowedRoles={["user"]}
                userRole={role}
              />
            }
          />

          <Route
            path="/place/*"
            element={
              <APIProvider apiKey={apiKey}>
                <Routes>
                  {/* รายการแต่ละประเภท */}
                  <Route path=":placeType" element={<PlacesList />} />

                  {/* รายละเอียด */}
                  <Route path="/:placeType/:slug/:id" element={<PlacesDetails />} />
                </Routes>
              </APIProvider>
            }
          />
          {/* <Route
            path="/place/home-stay/*"
            element={
              <APIProvider apiKey={apiKey}>
                <MainHomeStays
                  screenWidth={screenWidth}
                  defaultTheme={defaultTheme}
                  allowedRoles={["guest"]}
                  userRole={role}
                />
              </APIProvider>
            }
          />
          <Route
            path="/place/food/*"
            element={
              <APIProvider apiKey={apiKey}>
                <MainRestaurants
                  screenWidth={screenWidth}
                  defaultTheme={defaultTheme}
                  allowedRoles={["guest"]}
                  userRole={role}
                />
              </APIProvider>
            }
          />
          <Route
            path="/place/gift/*"
            element={
              <APIProvider apiKey={apiKey}>
                <MainSouvenirs
                  screenWidth={screenWidth}
                  defaultTheme={defaultTheme}
                  allowedRoles={["guest"]}
                  userRole={role}
                />
              </APIProvider>
            }
          />
          <Route
            path="/place/market/*"
            element={
              <APIProvider apiKey={apiKey}>
                <MainCommunityProducts
                  screenWidth={screenWidth}
                  defaultTheme={defaultTheme}
                  allowedRoles={["guest"]}
                  userRole={role}
                />
              </APIProvider>
            }
          /> */}

          <Route
            path="/district/:slug/:id"
            element={
              <APIProvider apiKey={apiKey}>
                <MainRoutes />
              </APIProvider>
            }
          />
        </Routes>
      </div>
    </>
  );
}
