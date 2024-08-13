import { MdOutlineDownload } from "react-icons/md"
import AppLayout from "../components/AppLayout"
import { useState } from "react"
import ModalPage from "../components/Modal UI";
import SelectBrandModel from "../components/My Retailers/SelectBrandModel/SelectBrandModel";
import { useManufacturer } from "../api/useManufacturer";

const AuditReport = () => {
    const [isShowBrandModal,setIsShowBrandModal] = useState(false);
    const { data: manufacturers, isLoading, error } = useManufacturer();
    console.log({manufacturers});
    
    return (<AppLayout
        filterNodes={<button className="border px-2 py-1 leading-tight d-flex" onClick={() => setIsShowBrandModal(true)}>

            <MdOutlineDownload size={16} className="m-auto" />
            <small style={{ fontSize: '9px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Brand <br/>Report</small>
        </button>}>
        <ModalPage content={<SelectBrandModel brands={manufacturers.data} onChange={null} onClose={() => setIsShowBrandModal(false)} />} onClose={() => setIsShowBrandModal(false)} open={isShowBrandModal}/>
        </AppLayout>)
}
export default AuditReport