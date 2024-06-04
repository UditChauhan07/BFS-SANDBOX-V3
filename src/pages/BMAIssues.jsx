import { useState } from "react";
import BrandManagementPage from "../components/Brand Management Approval/BrandManagementPage"
import Loading from "../components/Loading";
import CustomerSupportLayout from "../components/customerSupportLayout"

const BMAIssues = () => {
    const [sumitForm, setSubmitForm] = useState(false)
    if (sumitForm) return <Loading height={'80vh'} />;
    return (
        <CustomerSupportLayout>
            <BrandManagementPage setSubmitForm={setSubmitForm}/>
        </CustomerSupportLayout>
    )
}
export default BMAIssues