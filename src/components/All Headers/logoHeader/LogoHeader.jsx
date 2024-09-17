import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetAuthData } from "../../../lib/store";
import { getPermissions } from "../../../lib/permission";
import PermissionDenied from "../../PermissionDeniedPopUp/PermissionDenied";
import styles from "../topNav/index.module.css";

const LogoHeader = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const user = await GetAuthData(); // Fetch user data
        const userPermissions = await getPermissions(); // Fetch permissions
        setPermissions(userPermissions); // Set permissions in state
      } catch (err) {
        console.error("Error fetching permissions", err);
      }
    }

    fetchPermissions(); // Fetch permissions on mount
  }, []);

  // Memoize permissions to avoid unnecessary re-calculations
  const memoizedPermissions = useMemo(() => permissions, [permissions]);

  // Handle restricted access
  const handleRestrictedAccess = () => {
    PermissionDenied(); 
  };

  return (
    <div className={styles.laptopModeSticky}>
      <div className={`${styles.laptopMode}`}>
        {/* My Retailers */}
        <div className={`${styles.lapSetting} d-none-print`}>
          <p className={`m-0  ${styles.language}`}>
            {memoizedPermissions?.modules?.myRetailers?.view ? (
              <Link to="/my-retailers" className="linkStyle">
                My Retailers
              </Link>
            ) : (
              <span
                onClick={handleRestrictedAccess}
                className="linkStyle"
                style={{ cursor: "not-allowed", color: "grey" }}
              >
                My Retailers
              </span>
            )}
          </p>

          {/* New Arrivals */}
          <p className={`m-0   ${styles.language}`}>
            {memoizedPermissions?.modules?.newArrivals?.view  ? (
              <Link to="/new-arrivals" className="linkStyle">
                New Arrivals
              </Link>
            ) : (
              <span
                onClick={handleRestrictedAccess}
                className="linkStyle"
                style={{ cursor: "not-allowed", color: "grey" }}
              >
                New Arrivals
              </span>
            )}
          </p>

          {/* Brands */}
          <p className={`m-0   ${styles.language}`}>
            {memoizedPermissions?.modules?.brands?.view  ? (
              <Link to="/brand" className="linkStyle">
                Brands
              </Link>
            ) : (
              <span
                onClick={handleRestrictedAccess}
                className="linkStyle"
                style={{ cursor: "not-allowed", color: "grey" }}
              >
                Brands
              </span>
            )}
          </p>
        </div>

        {/* Logo */}
        <div className={styles.lapSetting}>
          <Link to="/dashboard" className={`linkStyle`}>
            <img src={"/assets/images/BFSG_logo.svg"} alt="logo" />
          </Link>
        </div>

        {/* Dashboard & My Bag */}
        <div className={`${styles.lapSetting} d-none-print`}>
          {/* Dashboard */}
          <p className={`m-0  ${styles.language}`}>
            {memoizedPermissions?.modules?.dashboard?.view ? (
              <Link to="/dashboard" className="linkStyle">
                Dashboard
              </Link>
            ) : (
              <span
                onClick={handleRestrictedAccess}
                className="linkStyle"
                style={{ cursor: "not-allowed", color: "grey" }}
              >
                Dashboard
              </span>
            )}
          </p>

          {/* My Bag */}
          <p className={`m-0  ${styles.language}`}>
            {memoizedPermissions?.modules?.order?.view ? (
              <Link to="/my-bag" className="linkStyle">
                My Bag
              </Link>
            ) : (
              <span
                onClick={handleRestrictedAccess}
                className="linkStyle"
                style={{ cursor: "not-allowed", color: "grey" }}
              >
                My Bag
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoHeader;
