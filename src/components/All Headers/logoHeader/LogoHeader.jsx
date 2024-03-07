import React from "react";
import styles from "../topNav/index.module.css";
import { Link } from "react-router-dom";
import { useBag } from "../../../context/BagContext";
import { SearchIcon } from "../../../lib/svg";

const LogoHeader = () => {
  const { orderQuantity } = useBag();

  return (
    <>
      <div className={styles.laptopModeSticky}>
        <div className={` ${styles.laptopMode}`}>
          <div className={styles.lapSetting}>
            <p className={`m-0  ${styles.language}`}>
              <Link to="/my-retailers" className={`linkStyle`}>
                My Retailers
              </Link>
            </p>
            <p className={`m-0   ${styles.language}`}>
              <Link to="/new-arrivals" className={`linkStyle`}>
                New Arrivals
              </Link>
            </p>
            <p className={`m-0   ${styles.language}`}>
              <Link to="/brand" className={`linkStyle`}>
                Brands
              </Link>
            </p>
          </div>
          {/* image div */}
          <div className={styles.lapSetting}>
            <Link to="/dashboard" className={`linkStyle`}>
              <img src={"/assets/images/BFSG_logo.svg"} alt="img" />
            </Link>
          </div>
          {/* my bag */}
          <div className={styles.lapSetting}>
            <p className={`m-0 w-[100px]  ${styles.language} flex`}>
              <a href="#search" data-rr-ui-event-key="#search" className=" pr-0 nav-link active"><div className="search-container"><input className="search expandright" id="searchright" type="search" name="" placeholder="Search..." /><label className="button searchbutton" for="searchright"><span className="searchCode">Search...</span> <span className="mglass">
                <SearchIcon />
              </span> </label></div></a>
              {/* <img src={"/assets/images/searchIcon.svg"} alt="img" /> */}
            </p>

            <p className={`m-0  ${styles.language}`}>
              <Link to="/dashboard" className={`linkStyle`}>
                Dashboard
              </Link>
            </p>
            <p className={`m-0  ${styles.language}`}>

              {orderQuantity ? <Link to="/my-bag" className={`linkStyle`}> My Bag ({orderQuantity})
              </Link> : "My Bag(0)"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoHeader;
