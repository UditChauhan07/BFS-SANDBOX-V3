import { MdOutlineDownload } from "react-icons/md"
import AppLayout from "../components/AppLayout"
import { useEffect, useState } from "react"
import ModalPage from "../components/Modal UI";
import SelectBrandModel from "../components/My Retailers/SelectBrandModel/SelectBrandModel";
import { useManufacturer } from "../api/useManufacturer";
import Loading from "../components/Loading";
import { generateBrandAuditTemplate, GetAuthData, originAPi } from "../lib/store";

const AuditReport = () => {
    const [isShowBrandModal, setIsShowBrandModal] = useState(false);
    const { data: manufacturers, isLoading, error } = useManufacturer();
    const [isPdfGenerated,setIsPdfGenerated]=useState(false)


    const onChangeHandler = (brand) => {
        setIsPdfGenerated(true)
        setIsShowBrandModal(false)
        GetAuthData().then((user) => {
            generateBrandAuditTemplate({ key: user.x_access_token, Ids: JSON.stringify([brand.Id]), }).then((file) => {
                setIsPdfGenerated(false)
                if (file) {
                    const a = document.createElement('a');
                    a.href = originAPi+"/files/"+file+"/Brand-Audit-Report.pdf/index"
                    // a.target = '_blank'
                    a.click();
                  }

            }).catch((aErr) => {
                console.log({ aErr });
            })
        }).catch((userErr) => {
            console.log({ userErr });

        })

    }

    return (<AppLayout
        filterNodes={<button className="border px-2 py-1 leading-tight d-flex" onClick={() => setIsShowBrandModal(true)}>

            <MdOutlineDownload size={16} className="m-auto" />
            <small style={{ fontSize: '9px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Brand <br />Report</small>
        </button>}>
        <ModalPage content={<SelectBrandModel brands={manufacturers?.data} onChange={onChangeHandler} onClose={() => setIsShowBrandModal(false)} />} onClose={() => setIsShowBrandModal(false)} open={isShowBrandModal} />
        {isLoading||isPdfGenerated ? <Loading height={'40vh'}/> : null}
    </AppLayout>)
}
export default AuditReport