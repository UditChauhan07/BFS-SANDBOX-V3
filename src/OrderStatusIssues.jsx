import CustomerSupportLayout from "./components/customerSupportLayout";
import Filters from "./components/OrderList/Filters";
import Styles from "./components/OrderList/style.module.css";
import AppLayout from "./components/AppLayout";
import { GetAuthData, admins, getOrderCustomerSupport, getOrderList, getSalesRepList } from "./lib/store";
import Loading from "./components/Loading";
import Pagination from "./components/Pagination/Pagination";
import OrderListContent from "./components/OrderList/OrderListContent";
import { FilterItem } from "./components/FilterItem";
import { useEffect, useMemo, useState } from "react";

let PageSize = 10;
const OrderStatusIssues = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [shipByText, setShipByText] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [orders, setOrders] = useState([]);
    const [searchShipBy, setSearchShipBy] = useState();
    const [userData, setUserData] = useState({});
    const [salesRepList, setSalesRepList] = useState([])
    const [selectedSalesRepId, setSelectedSalesRepId] = useState();
    const [filterValue, onFilterChange] = useState({
        month: "",
        manufacturer: null,
        search: "",
    });

    const handleFilterChange = (filterType, value) => {
        onFilterChange((prev) => {
            const newData = { ...prev };
            newData[filterType] = value;
            return newData;
        });
        setCurrentPage(1);
    };

    function sortingList(data) {
        data.sort(function (a, b) {
            return new Date(b.CreatedDate) - new Date(a.CreatedDate);
        });
        return data;
    }

    const orderData = useMemo(() => {
        return (
            orders
                // Manufacturer filter
                ?.filter(
                    (order) =>
                        !filterValue.manufacturer ||
                        filterValue.manufacturer === order.ManufacturerId__c
                )
                // Search by account filter
                ?.filter((order) => {
                    return (
                        !filterValue?.search?.length ||
                        order.AccountName?.toLowerCase().includes(
                            filterValue?.search?.toLowerCase()
                        )
                    );
                })
                .filter((order) => {
                    if (searchShipBy) {
                        const orderItems = order.OpportunityLineItems?.records;
                        if (orderItems?.length) {
                            return (
                                orderItems?.some((item) => {
                                    return item.Name?.toLowerCase().includes(
                                        searchShipBy?.toLowerCase()
                                    );
                                }) ||
                                order.PO_Number__c?.toLowerCase().includes(
                                    searchShipBy?.toLowerCase()
                                )
                            );
                        } else if (
                            order.PO_Number__c?.toLowerCase().includes(
                                searchShipBy.toLowerCase()
                            )
                        ) {
                            return true;
                        }
                        return false;
                    }
                    return true;
                })
        );
    }, [filterValue, orders, searchShipBy]);

    useEffect(() => {
        setLoaded(false);
        GetAuthData()
            .then((response) => {
                setUserData(response)
                if (!selectedSalesRepId) setSelectedSalesRepId(response.Sales_Rep__c)
                getOrderlIsthandler({ key: response.x_access_token, Sales_Rep__c: selectedSalesRepId ?? response.Sales_Rep__c })
                if (admins.includes(response.Sales_Rep__c)) {
                    getSalesRepList({ key: response.x_access_token }).then((repRes) => {
                        setSalesRepList(repRes.data)
                    }).catch((repErr) => {
                        console.log({ repErr });
                    })
                }
            })
            .catch((err) => {
                console.log({ err });
            });
    }, [filterValue.month]);

    useEffect(() => {
        setShipByText(searchShipBy);
    }, [searchShipBy]);

    const getOrderlIsthandler = ({ key, Sales_Rep__c }) => {
        getOrderCustomerSupport({
            user: {
                key,
                Sales_Rep__c,
            },
            month: filterValue.month,
        })
            .then((order) => {
                let sorting = sortingList(order);
                setOrders(sorting);
                setLoaded(true);
            })
            .catch((error) => {
                console.log({ error });
            });
    }
    const orderListBasedOnRepHandler = (value) => {
        setSelectedSalesRepId(value)
        setLoaded(false)
        setOrders([])
        getOrderlIsthandler({ key: userData.x_access_token, Sales_Rep__c: value })
    }
    return (<CustomerSupportLayout
        filterNodes={
            <>
              {(admins.includes(userData.Sales_Rep__c), salesRepList.length > 0) &&
                <FilterItem
                  minWidth="220px"
                  label="salesRep"
                  name="salesRep"
                  value={selectedSalesRepId}
                  options={salesRepList.map((salesRep) => ({
                    label: salesRep.Id == userData.Sales_Rep__c ? 'My Orders ('+salesRep.Name+')' : salesRep.Name,
                    value: salesRep.Id,
                  }))}
                  onChange={(value) => orderListBasedOnRepHandler(value)}
                />
              }
              <Filters
                onChange={handleFilterChange}
                value={filterValue}
                resetFilter={() => {
                  onFilterChange({
                    manufacturer: null,
                    month: "",
                    search: "",
                  });
                  setSearchShipBy("");
                  setSelectedSalesRepId(userData.Sales_Rep__c);
                }}
              />
            </>
          }
    >
        {!loaded ? (
            <Loading />
        ) : (
            <div>
                <section>
                    <div className="">
                        <div className={Styles.orderMainDiv}>
                            {/* style={{width:'100%'}} */}
                            <div className={Styles.OrderMainPr} >
                                <div className={Styles.inorderflex}>
                                    <div>
                                        <h2>Your Orders</h2>
                                    </div>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            setSearchShipBy(e.target.elements.searchShipBy.value);
                                        }}
                                    >
                                        <div
                                            className={`d-flex align-items-center ${Styles.InputControll}`}
                                        >
                                            <input
                                                type="text"
                                                name="searchShipBy"
                                                onChange={(e) => setShipByText(e.target.value)}
                                                value={shipByText}
                                                placeholder="Search All Orders"
                                            />
                                            <button>Search Orders</button>
                                        </div>
                                    </form>
                                </div>
                                <OrderListContent
                                    data={orderData?.slice(
                                        (currentPage - 1) * PageSize,
                                        currentPage * PageSize
                                    )}
                                    hideDetailedShow
                                    setSearchShipBy={setSearchShipBy}
                                    searchShipBy={searchShipBy}
                                />
                            </div>
                            <Pagination
                                className="pagination-bar"
                                currentPage={currentPage}
                                totalCount={orderData.length}
                                pageSize={PageSize}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    </div>
                </section>
            </div>
        )}
    </CustomerSupportLayout>)
}
export default OrderStatusIssues;