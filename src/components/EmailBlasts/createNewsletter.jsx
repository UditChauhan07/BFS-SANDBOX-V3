import { useNavigate } from "react-router-dom";
import AppLayout from "../AppLayout"
import MultiStepForm from "./Custom"
import { BiLeftArrow } from "react-icons/bi";

const CreateNewsletter = () => {
    const navigate = useNavigate();
    return (<AppLayout>
        <div>
            <div style={{ marginBottom: '0px' }}>
                <h2 className="d-flex justify-content-start align-items-center"><span style={{ cursor: 'pointer' }} onClick={() => { navigate('/newsletter') }}><BiLeftArrow /></span><p>Create Newsletter</p></h2>
            </div>
            <MultiStepForm/>
        </div>
    </AppLayout>)
}
export default CreateNewsletter