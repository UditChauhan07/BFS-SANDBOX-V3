import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppLayout from '../../components/AppLayout';
import Styles from "./index.module.css";
import { FilterItem } from '../../components/FilterItem';
import { GetAuthData, originAPi, DestoryAuth } from '../../lib/store';

function ContactDetailedReport() {
    const [accountManufacturerRecords, setAccountManufacturerRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [accountFilter, setAccountFilter] = useState('');
    const [saleRepFilter , setSaleRepFilter] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [salesReps, setSalesReps] = useState([]);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const data = await GetAuthData();
                if (!data) {
                    console.log("No data found, destroying auth");
                    DestoryAuth();
                    return;
                }

                const accessToken = data.access_token;
                console.log("Access Token:", accessToken);

                // Fetch account manufacturer records
                const apiUrl = `${originAPi}/new-report/fetch-account-data`;
                const res = await axios.post(apiUrl, { accessToken });

                console.log("API Response:", res.data);

                if (res.data && res.data.accountManufacturerRecords) {
                    setAccountManufacturerRecords(res.data.accountManufacturerRecords);
                    setFilteredRecords(res.data.accountManufacturerRecords);

                    // Extract accounts and sales reps for filter dropdowns
                    const accountList = res.data.accountManufacturerRecords.map(record => ({
                        label: record.AccountId__r?.Name ,
                        value: record.AccountId__r?.Name
                    }));

                    const saleRepList = res.data.accountManufacturerRecords.map(record => ({
                        label: record.Sales_Rep__r?.Name,
                        value: record.Sales_Rep__r?.Name
                    }));

                    // Remove duplicates using Map
                    setAccounts([...new Map(accountList.map(account => [account.value, account])).values()]);
                    setSalesReps([...new Map(saleRepList.map(rep => [rep.value, rep])).values()]);
                }

            } catch (error) {
                console.error("Error fetching account details:", error);
            }
        };

        fetchAccountDetails();
    }, []);

    useEffect(() => {
        const newFilteredRecords = accountManufacturerRecords.filter(record => {
            const accountMatch = accountFilter ? record.AccountId__r?.Name.toLowerCase().includes(accountFilter.toLowerCase()) : true;
            const saleRepMatch = saleRepFilter ? record.Sales_Rep__r?.Name.toLowerCase().includes(saleRepFilter.toLowerCase()) : true;
            return accountMatch && saleRepMatch;
        });

        setFilteredRecords(newFilteredRecords);
    }, [accountFilter, saleRepFilter, accountManufacturerRecords]);

    return (
        <>
            <AppLayout
                filterNodes={
                    <div className="d-flex justify-content-center gap-10" style={{ width: "99%" }}>
                        <FilterItem
                            minWidth="120px"
                            label="Account Name"
                            value={accountFilter}
                            options={accounts}
                            onChange={(value) => setAccountFilter(value)}
                        />
                        <FilterItem
                            width="220px"
                            label="Sales Rep"
                            value={saleRepFilter}
                            options={salesReps}
                            onChange={(value) => setSaleRepFilter(value)}
                        />
                    </div>
                }
            >
                <div className={`d-flex p-3 ${Styles.tableBoundary} mb-5`}>
                    <div className="" style={{ maxHeight: "73vh", minHeight: "40vh", overflow: "auto", width: "100%" }}>
                        <table id="salesReportTable" className="table table-responsive" style={{ minHeight: "300px" }}>
                            <thead>
                                <tr>
                                    <th className={`${Styles.th}`} style={{ minWidth: "170px" }}>Account Name</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "150px" }}>First Name</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "200px" }}>Last Name</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "200px" }}>Sale Rep</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "200px" }}>Email</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "200px" }}>Phone</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Account Number</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Margin</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Payment Type</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Store Street</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Store City</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Store State</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Store Zip</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Store Country</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Shipping Street</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Shipping City</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Shipping State/Province</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Shipping Zip/Postal Code</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Shipping Country</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Billing Street</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Billing City/State Province</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Billing Zip/Postal Code</th>
                                    <th className={`${Styles.th}`} style={{ minWidth: "125px" }}>Billing Country</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.length ? filteredRecords.map((record, index) => (
                                    <tr key={record.Id || index}>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.Name || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.contacts?.[0]?.FirstName || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.contacts?.[0]?.LastName || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.Sales_Rep__r?.Name || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.contacts?.[0]?.Email || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.contacts?.[0]?.Phone || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.Account_Number__c || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.Margin__c || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.Payment_Type__c || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.Store_Street__c || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.Store_City__c || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.Store_State__c || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.Store_Zip__c || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.Store_Country__c || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.ShippingStreet || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.ShippingCity || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.ShippingState || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.ShippingPostalCode || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.ShippingCountry || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.BillingStreet || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.BillingCity || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.BillingPostalCode || ''}
                                        </td>
                                        <td className={`${Styles.td}`}>
                                            {record.AccountId__r?.BillingCountry || ''}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="24" className={`${Styles.td} text-center`}>
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

export default ContactDetailedReport;
