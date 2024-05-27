export const originAPi = "https://b2b.beautyfashionsales.com"
// export const originAPi = "https://dev.beautyfashionsales.com"
// export const originAPi = "http://localhost:6194"
let url = `${originAPi}/beauty/`;
let URL = `${originAPi}/beauty/0DS68FOD7s`;
const orderKey = "orders";
const accountIdKey = "AccountId__c";
const brandIdKey = "ManufacturerId__c";
const brandKey = "Account";
const accountKey = "manufacturer";
const POCount = "woX5MkCSIOlHXkT";
const support = "AP0HBuNwbNnuhKR";
const shareKey = "R7Mmw2nG41y6MqI";
export const salesRepIdKey = "BzQIEAjzCEHmlXc";
export const admins = ["00530000005AdvsAAC", "0053b00000DgEVEAA3","0053b00000CwOnLAAV"]; //,"0053b00000CwOnLAAV" ,"0053b00000DgEVEAA3"

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ShareDrive(data, remove = false) {
  if (remove) {
    localStorage.removeItem(shareKey);
    return true;
  }
  if (data) {
    localStorage.setItem(shareKey, JSON.stringify(data));
    return true;
  } else {
    let strData = localStorage.getItem(shareKey);
    return JSON.parse(strData);
  }
}

export async function AuthCheck() {
  if (JSON.parse(localStorage.getItem("Api Data"))?.data) {
    return true;
  } else {
    DestoryAuth();
    return false;
  }
}

export function POGenerator() {
  let count = parseInt(localStorage.getItem(POCount)) || 1;
  if (count == "NaN") {
    localStorage.setItem(POCount, 1);
    count = 1;
  }
  let date = new Date();
  let currentMonth = padNumber(date.getMonth() + 1, true);
  let currentDate = padNumber(date.getDate(), true);
  let beg = fetchBeg();
  let AcCode = getStrCode(beg?.Account?.name);
  let MaCode = getStrCode(beg?.Manufacturer?.name);

  let orderCount = padNumber(count, true);
  if (beg?.orderList?.[0]?.productType === "pre-order") return `PRE-${AcCode + MaCode}${currentDate + currentMonth}${orderCount}`;
  else return `${AcCode + MaCode}${currentDate + currentMonth}${orderCount}`;
}

export function getStrCode(str) {
  if (!str) return null;
  let codeLength = str.split(" ");
  if (codeLength.length >= 2) {
    return `${codeLength[0].charAt(0).toUpperCase() + codeLength[1].charAt(0).toUpperCase()}`;
  } else {
    return `${codeLength[0].charAt(0).toUpperCase() + codeLength[0].charAt(codeLength[0].length - 1).toUpperCase()}`;
  }
}
function padNumber(n, isTwoDigit) {
  if (isTwoDigit) {
    if (n < 10) {
      return "0" + n;
    } else {
      return n;
    }
  } else {
    if (n < 10) {
      return "000" + n;
    } else if (n < 100) {
      return "00" + n;
    } else if (n < 1000) {
      return "0" + n;
    } else {
      return n;
    }
  }
}

export function formatNumber(num) {
  if (num >= 0 && num < 1000000) {
    return (num / 1000).toFixed(1).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "K";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "M";
  } else if (num < 0) {
    return (num / 1000).toFixed(1).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "K";
  } else {
    return num;
  }
}
export function supportDriveBeg() {
  let supportList = localStorage.getItem(support);
  return JSON.parse(supportList);
}
export async function supportShare(data) {
  localStorage.setItem(support, JSON.stringify(data));
  return true;
}
export function supportClear() {
  localStorage.removeItem(support);
  if (localStorage.getItem(support)) {
    return false;
  } else {
    return true;
  }
}

export function fetchBeg() {
  let orderStr = localStorage.getItem(orderKey);
  let orderDetails = {
    orderList: [],
    Account: {
      name: null,
      id: null,
      address: null,
      shippingMethod: null,
    },
    Manufacturer: {
      name: null,
      id: null,
    },
  };
  if (orderStr) {
    let orderList = Object.values(JSON.parse(orderStr));
    if (orderList.length > 0) {
      orderDetails.Account.id = orderList[0].account.id;
      orderDetails.Account.name = orderList[0].account.name;
      orderDetails.Account.shippingMethod = orderList[0].account.shippingMethod;
      orderDetails.Account.address = JSON.parse(orderList[0].account.address);
      orderDetails.Manufacturer.id = orderList[0].manufacturer.id;
      orderDetails.Manufacturer.name = orderList[0].manufacturer.name;
      orderDetails.orderList = orderList;
    }
  }
  return orderDetails;
}

export async function OrderPlaced({ order }) {
  let orderinit = {
    info: order,
  };
  let headersList = {
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "4eIAaY2H", {
    method: "POST",
    body: JSON.stringify(orderinit),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 200) {
    localStorage.removeItem(orderKey);
    localStorage.removeItem(accountIdKey);
    localStorage.removeItem(brandIdKey);
    localStorage.removeItem(brandKey);
    localStorage.removeItem(accountKey);
    let lastCount = localStorage.getItem(POCount) || 1;
    localStorage.setItem(POCount, parseInt(+lastCount + 1));
    return data.order;
  } else if (data.status == 300) {
    DestoryAuth();
  } else {
    if (data?.data) {
      return data.data;
    } else {
      return false;
    }
  }
}

export async function DestoryAuth() {
  localStorage.clear();
  window.location.href = window.location.origin;
  return true;
}

export async function GetAuthData() {
  if (!AuthCheck) {
    DestoryAuth();
  } else {
    return JSON.parse(localStorage.getItem("Api Data"))?.data;
  }
}

export async function getOrderList({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("Sales_Rep__c", user.Sales_Rep__c);
  bodyContent.append("month", month === "last-6-months" ? "" : month);

  let response = await fetch(url + "v3/20h2J48c", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderCustomerSupport({ user, PONumber }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("Sales_Rep__c", user.Sales_Rep__c);
  if (PONumber) bodyContent.append("PONumber", PONumber);

  let response = await fetch(url + "v3/Jn91V1GChwP9dZg", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderofSalesRep({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("salesRepId", user.Sales_Rep__c);

  let response = await fetch(url + "v3/8QUZQtEILKLsFeE", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getTargetReportAll({ user, year, preOrder }) {
  if (user) {
    let headersList = {
      Accept: "*/*",
    };
    let tried = false;
    let bodyContent = new FormData();
    bodyContent.append("key", user.x_access_token);
    if (!admins.includes(user.Sales_Rep__c)) {
      bodyContent.append("SalesRepId", user.Sales_Rep__c);
    }
    if (year) {
      bodyContent.append("year", year);
    }
    if (preOrder) {
      bodyContent.append("preorder", preOrder);
    }
    let response = await fetch(url + "target/4Tu6do95AxLM3Cl", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });
    let data = JSON.parse(await response.text());
    if (data.status == 300) {
      DestoryAuth();
    } else {
      let rawRes = { ownerPermission: false, list: data.data };
      if (admins.includes(user.Sales_Rep__c)) {
        rawRes.ownerPermission = true;
      }
      return rawRes;
    }
  } else {
    return false;
  }
}
export async function getOrderDetailsBasedId({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.id);

  let response = await fetch(url + "0DS68FOD7s", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderDetailsInvoice({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.id);

  let response = await fetch(url + "3JlgPqaeYIveHd6", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return { data: data.data, attachment: data.attachedmenetdata };
  }
}

export async function getDashboardata({ user }) {
  let headersList = {};
  if (user.headers) {
    headersList = user.headers || {};
  } else {
    headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
  }

  headersList = { ...headersList, key: user.x_access_token, SalesRepId: user.Sales_Rep__c }

  let response = await fetch(originAPi + "/95zWpMEFtbAr8lq/FlEpv2cw4VbxgDF", {
    // let response = await fetch(url + "v3/3kMMguJj62cyyf0", {
    method: "POST",
    body: null,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.warn({ data });
  // console.warn({data:user.Sales_Rep__c});
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getSupportList({ key, salesRepId }) {
  let headersList = {
    Accept: "*/*",
  };
  // console.log({user});
  let bodyContent = new FormData();
  bodyContent.append("key", key);
  bodyContent.append("salesRepId", salesRepId);

  let response = await fetch(url + "v3/TDIztRiHo6Juf3I", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getSupportDetails({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("caseId", rawData.caseId);

  let response = await fetch(url + "v3/ffBUF1vNs9LTLfz", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getSupportFormRaw({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("AccountId", rawData.AccountId);

  let response = await fetch(url + "v3/HX0RbhJ3jppDwQX", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getAllAccount({ user }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let body = {
    key: user.x_access_token,
    salesRepId: user.Sales_Rep__c,
  };
  let response = await fetch(url + "v3/fmJJCh9HaL33Iqp", {
    method: "POST",
    headers: headersList,
    body: JSON.stringify(body),
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function postSupport({ rawData }) {
  console.log({ rawData });
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/hunQaon7f5sTDeb", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function postSupportAny({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/OFT88qVeJPUGsly", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function postSupportComment({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/dgwz2CbCvN2QzAk", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getProductList({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "7ozraf8z5TdMyyH", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    console.warn({ data });
    return data;
  }
}

export async function getProductImage({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/4v8x5lE25F6VmIs", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.url;
  }
}

export async function getProductImageAll({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  // let response = await fetch(url + "v3/Ftr7xyLKqgFo5MO", {
  let response = await fetch(url + "v3/fGBDynHKNNfVNki", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getProductDetails({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/V59WN1CMm8Pjxay", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function topProduct({ month, manufacturerId }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/dC0mhTDnL9l0mK1", {
    method: "POST",
    body: JSON.stringify({ month, manufacturerId }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}
export async function getBrandList({ key, userId }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    key,
    userId,
  };
  let response = await fetch(url + "v3/yRNGIO", {
    method: "POST",
    // body: JSON.stringify({key,userid:userId}),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}
export async function getRetailerList({ key, userId }) {
  let headersList = {
    Accept: "*/*",
    key,
    userId,
    "Content-Type": "application/json",
  };
  let response = await fetch(url + "v3/JbUxci", {
    method: "POST",
    // body: JSON.stringify({key,userid:userId}),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getSalesRepList({ key }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/1FnQ4K9DItMBZ1D", {
    method: "POST",
    body: JSON.stringify({ key }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getEmailBlast({ key, Id }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/EAZ7KKgTyBDsI4M", {
    method: "POST",
    body: JSON.stringify({ key, Id }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getSessionStatus({ key, salesRepId }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let response = await fetch(url + "v3/XbgheAKvG5EtkXs", {
    method: "POST",
    body: JSON.stringify({ key, salesRepId }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getMarketingCalendar({ key, manufacturerId }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/eVC3IaiEEz3x7ym", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({ data });
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.data;
  }
}

export async function getYearlyComparison({ year, ManufacturerId__c }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/9kJs2I6Bn/Ox2KAg3U0e9l3Ht7lBG7", {
    method: "POST",
    body: JSON.stringify({ year, ManufacturerId__c }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.data;
  }
}

export async function getOrderDetailsPdf({ key, opportunity_id }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/0DS68FOD7s", {
    method: "POST",
    body: JSON.stringify({ key, opportunity_id }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getMarketingCalendarPDF({ key, manufacturerId, month }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, month }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({ data });
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getMarketingCalendarPDFV2({ key, manufacturerId, month }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/VTOUZjSm8aIm1ve", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, month }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({ data });
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getMarketingCalendarPDFV3({ key, manufacturerId, month }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/ohSOBafoPQH0NQi", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, month }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}
export async function uploadFileSupport({ key, supportId, files }) {
  if (files.length) {

    let headersList = {
      "Accept": "*/*", key, supportId
    }
    console.log({ headersList });
    let bodyContent = new FormData();
    files.map((file) => {
      bodyContent.append("files", file.file);
    })
    let response = await fetch(originAPi + "/unCb9Coo4FFqCtG/w72MrdYNHfsSsqe", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });

    let data = JSON.parse(await response.text());
    if (data) {
      return data.data
    }
  }
}


export const hexabrand = {
  a0O3b00000hym7GEAQ: "#38A3A5",
  a0O3b00000fQrZyEAK: "#9EC1DA",
  a0O1O00000XYBvQUAX: "#f6b6ad",
  a0O3b00000pY2vqEAC: "#ffe3d5",
  a0O3b00000p80IJEAY: "#fff9ed",
  a0O3b00000lCFmREAW: "#a6a0d4",
  a0ORb000000BQ0nMAG: "#206BA1",
  a0O3b00000p7zqKEAQ: "#BEE6DC",
  a0O3b00000ffNzbEAE: "#A66C98",
  a0O3b00000p4F4DEAU: "#6D597A",
  a0O3b00000p4F4CEAU: "#CBA188",
  a0ORb0000000uwfMAA: "#EFD6B1",
  a0O3b00000p4F4HEAU: "#D9D9D9",
  a0ORb000000QzsfMAC: "#B7C8B3",
  a0O1O00000XYBvkUAH: "#6D243E",
  a0O1O00000XYBvaUAH: "#4B95DD",
  a0ORb000000nDfFMAU: "#073763",
  a0ORb000000nDIiMAM: "#7f6000"
};

export const hexabrandText = {
  a0O3b00000hym7GEAQ: "#ffffff",
  a0O3b00000fQrZyEAK: "#2a516d",
  a0O1O00000XYBvQUAX: "#972111",
  a0O3b00000pY2vqEAC: "#bb3e00",
  a0O3b00000p80IJEAY: "#c58300",
  a0O3b00000lCFmREAW: "#352e66",
  a0ORb000000BQ0nMAG: "#0d2b40",
  a0O3b00000p7zqKEAQ: "#2f7967",
  a0O3b00000ffNzbEAE: "#EEDD82",
  a0O3b00000p4F4DEAU: "#ffffff",
  a0O3b00000p4F4CEAU: "#5e3d29",
  a0ORb0000000uwfMAA: "#8a5e1c",
  a0O3b00000p4F4HEAU: "#575757",
  a0ORb000000QzsfMAC: "#445840",
  a0O1O00000XYBvkUAH: "#ffffff",
  a0O1O00000XYBvaUAH: "#ffffff",
  a0ORb000000nDfFMAU: "#deb887",
  a0ORb000000nDIiMAM: "#deb887"
};


export function DateConvert(dateString, timeStamp=false) {
  if(timeStamp){
  const options = { year: "numeric", month: "long", day: "numeric"}
  dateString= new Date(dateString).toLocaleDateString(undefined, options)
  return dateString
  }
  if (dateString) {
    const [year, month, day] = dateString.split(/[-/]/);
    if (day && month && year) {
      let parsedDate = new Date(`${month}/${day}/${year}`);
      if (!isNaN(parsedDate.getTime())) {
        const options = { day: "numeric", month: "short", year: "numeric" };
        let launchDateFormattedDate = new Intl.DateTimeFormat("en-US", options).format(new Date(parsedDate));
        return launchDateFormattedDate;
      }
    }
    // throw new Error("Invalid date string");
  }
}