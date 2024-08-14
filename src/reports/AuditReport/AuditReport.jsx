import { MdOutlineDownload } from "react-icons/md"
import AppLayout from "../../components/AppLayout"
import { useEffect, useState } from "react"
import ModalPage from "../../components/Modal UI";
import SelectBrandModel from "../../components/My Retailers/SelectBrandModel/SelectBrandModel";
import { useManufacturer } from "../../api/useManufacturer";
import Loading from "../../components/Loading";
import { generateBrandAuditTemplate, GetAuthData, originAPi } from "../../lib/store";

const AuditReport = () => {
    const [isShowBrandModal, setIsShowBrandModal] = useState(false);
    const { data: manufacturers, isLoading, error } = useManufacturer();
    const [isPdfGenerated, setIsPdfGenerated] = useState(false)
    const [brandSelect, setbrandSelected] = useState();


    const onChangeHandler = (brand) => {
        setbrandSelected(brand)
        setIsPdfGenerated(true)
        setIsShowBrandModal(false)
        GetAuthData().then((user) => {
            generateBrandAuditTemplate({ key: user.x_access_token, Ids: JSON.stringify([brand.Id]), }).then((file) => {
                setIsPdfGenerated(false)
                setbrandSelected()
                if (file) {
                    const a = document.createElement('a');
                    let fileName = brand.Name + "-Audit-Report-" + new Date() + ".pdf"
                    a.href = originAPi + "/files/" + file + "/" + fileName.replaceAll(" ", "-") + "/index"
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
        {isLoading ? <Loading height={'40vh'} />  : <>
            {/* <div>
                <h2>
                    Audit Report
                </h2>
            </div> */}
            <div className="d-grid place-content-center min-h-[40vh]">
            {isPdfGenerated?<><img src="https://i.giphy.com/7jtU9sxHNLZuv8HZCa.webp" width="480" height="480" /><p className="text-center mt-2">{`Creating PDF Audit Report for ${brandSelect?.Name}`}</p></>:<div className="col-12">
                    <p className="m-0 fs-2 font-[Montserrat-400] text-[14px] tracking-[2.20px]">Coming Soon...</p>
                </div>}
                
            </div></>}
    </AppLayout>)
}
export default AuditReport