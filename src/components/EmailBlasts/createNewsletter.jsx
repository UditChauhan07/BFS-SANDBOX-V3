import { useNavigate } from "react-router-dom";
import AppLayout from "../AppLayout"
import MultiStepForm from "./Custom"
import { BiLeftArrow } from "react-icons/bi";

const CreateNewsletter = () => {
    const navigate = useNavigate();
    return (<AppLayout>
        <div className="emailContainer">
            <div style={{
                marginBottom: '0px', borderBottom: '1px dashed #000',
                paddingBottom:'10px',
                margin: '27px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 className="d-flex justify-content-start align-items-center" style={{ color: '#000', fontFamily: "Montserrat-400", fontSize: '20px', fontStyle: 'normal', fontWeight: 500, lineHeight: 'normal', letterSpacing: '2px'}}><span style={{ cursor: 'pointer' }} onClick={() => { navigate('/newsletter') }}><BiLeftArrow /></span><p style={{margin:0}}>&nbsp;Create Newsletter</p></h2>
            </div>
            <MultiStepForm />
        </div>
    </AppLayout>)
}
export default CreateNewsletter