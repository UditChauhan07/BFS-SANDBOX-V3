import AppLayout from "../components/AppLayout"
import Newsletter from "../components/EmailBlasts/Newsletter";

const EmailSetting = () => {

    return (<AppLayout
    >
        <div className="emailContainer">
            <Newsletter />
        </div>
    </AppLayout>)
}
export default EmailSetting