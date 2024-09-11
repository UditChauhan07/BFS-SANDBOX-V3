import React, { useEffect, useState, useMemo } from "react";
import styles from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  CustomerServiceIcon,
  NeedHelp,
  OrderStatusIcon,
} from "../../../lib/svg";
import ModalPage from "../../Modal UI";
import SelectCaseReason from "../../CustomerServiceFormSection/SelectCaseReason/SelectCaseReason";
import { GetAuthData } from "../../../lib/store";
import { BiLogoZoom, BiMailSend, BiStar } from "react-icons/bi";
import { RiGuideLine } from "react-icons/ri";
import { getPermissions } from "../../../lib/permission";
import PermissionDenied from "../../PermissionDeniedPopUp/PermissionDenied";

const TopNav = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem("Name") || "User"
  );
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        await GetAuthData();
        const userPermissions = await getPermissions();
        setPermissions(userPermissions);
      } catch (err) {
        console.log("Error fetching user data", err);
      }
    }

    fetchUserData();
  }, []);

  const reasons = {
    Charges: "Charges",
    "Product Missing": "Product Missing",
    "Product Overage Shipped": "Product Overage",
    "Product Damage": "Product Damage",
    "Update Account Info": "Update Account Info",
  };

  const memoizedPermissions = useMemo(() => permissions, [permissions]);

  const handlePermissionAlert = () => {
    PermissionDenied();
  };

  const hasPermission = (module) => memoizedPermissions?.modules?.TopNav?.childModules?.[module];

  const linkStyle = (hasAccess) => ({
    cursor: hasAccess ? "pointer" : "not-allowed",
    color: hasAccess ? "inherit" : "grey",
  });

  return (
    <>
      <div className={`${styles.NeedNone} d-none-print`}>
        <ModalPage
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          content={
            <SelectCaseReason
              reasons={reasons}
              onClose={() => setModalOpen(false)}
              recordType={{ id: "0123b0000007z9pAAA", name: "Customer Service" }}
            />
          }
        />

        <div
          className={`${styles.topNav} d-flex justify-content-between align-items-center gap-2`}
        >
          <div className="d-flex justify-content-center align-items-center gap-2">
            <img src={"/assets/images/americanFlag.svg"} alt="img" />
            <div className={styles.vr}></div>
            <p className={`m-0 ${styles.language}`}>EN</p>

            <p className={`m-0 ${styles.language} ${styles.text} flex`}>
              <div
                className="dropdown d-flex justify-content-center align-items-center"
                role="button"
                data-bs-toggle="dropdown"
                style={{ zIndex: 1021 }}
              >
                Need Help?&nbsp; <NeedHelp />
                <ul className="dropdown-menu">
                  <li
                    onClick={() =>
                      hasPermission("order_Status")
                        ? navigate("/orderStatus")
                        : handlePermissionAlert()
                    }
                  >
                    <Link
                      to="#"
                      className={`dropdown-item text-start d-flex align-items-center ${styles.nameText}`}
                      style={linkStyle(hasPermission("order_Status"))}
                    >
                      <OrderStatusIcon width={15} height={15} />
                      &nbsp;Order Status
                    </Link>
                  </li>

                  <li
                    onClick={() =>
                      hasPermission("customer_service")
                        ? navigate("/customerService")
                        : handlePermissionAlert()
                    }
                  >
                    <Link
                      to="#"
                      className={`dropdown-item text-start d-flex align-items-center ${styles.nameText}`}
                      style={linkStyle(hasPermission("customer_service"))}
                    >
                      <CustomerServiceIcon width={15} height={15} />
                      &nbsp;Customer Services
                    </Link>
                  </li>

                  <li
                    onClick={() =>
                      hasPermission("how_To_Guide")
                        ? navigate("/Help-Section")
                        : handlePermissionAlert()
                    }
                  >
                    <Link
                      to="#"
                      className={`dropdown-item text-start d-flex align-items-center ${styles.nameText}`}
                      style={linkStyle(hasPermission("how_To_Guide"))}
                    >
                      <RiGuideLine width={15} height={15} />
                      &nbsp;How-To Guides
                    </Link>
                  </li>
                </ul>
              </div>
            </p>
          </div>

          <div className="d-flex justify-content-center align-items-center gap-3">
            <p className={`m-0 ${styles.welcomeText}`}>
              Welcome, <span className={`m-0 ${styles.nameText}`}>{userName}</span>
            </p>

            <div className={styles.vr}></div>
            <p className={`m-0 ${styles.nameText}`}>
              <div
                className="dropdown d-flex justify-content-center align-items-center"
                role="button"
                data-bs-toggle="dropdown"
                style={{ zIndex: 1021 }}
              >
                Admin
                <ul className="dropdown-menu">
                  <li
                    onClick={() =>
                      hasPermission("emailBlast")
                        ? navigate("/newsletter")
                        : handlePermissionAlert()
                    }
                    className={`dropdown-item d-flex align-items-center ${styles.nameText}`}
                    style={linkStyle(hasPermission("emailBlast"))}
                  >
                    <BiMailSend />
                    &nbsp;Email Blast
                  </li>

                  <li
                    onClick={() =>
                      hasPermission("accountTier")
                        ? navigate("/TierStanding")
                        : handlePermissionAlert()
                    }
                    className={`dropdown-item d-flex align-items-center ${styles.nameText}`}
                    style={linkStyle(hasPermission("accountTier"))}
                  >
                    <BiStar />
                    &nbsp;Account Tier & Standing Report
                  </li>

                  <li
                    onClick={() =>
                      hasPermission("auditReport")
                        ? navigate("/AuditReport")
                        : handlePermissionAlert()
                    }
                    className={`dropdown-item d-flex align-items-center ${styles.nameText}`}
                    style={linkStyle(hasPermission("auditReport"))}
                  >
                    <BiLogoZoom />
                    &nbsp;Audit Report
                  </li>
                </ul>
              </div>
            </p>

            <div className={styles.vr}></div>
            <p className={`m-0 ${styles.nameText}`}>
              <div
                
                className="linkStyle"
              
                onClick={() =>
                  hasPermission("myOrders")
                    ? navigate("/order-list")
                    : handlePermissionAlert()
                }
                style={linkStyle(hasPermission("myOrders"))}
              >
                My Orders
              </div>
            </p>
            <div className={styles.vr}></div>
            <p className={`m-0 ${styles.nameText}`}>
              <Link to="/logout" className="linkStyle">
                Logout
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNav;
