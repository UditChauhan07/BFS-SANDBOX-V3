import Styles from "./Style.module.css"
const BMAIHandler = ({ reasons, reason, setReason }) => {
    const shakeHandler = () => {
        let lock1 = document.getElementById("reason");
        if (lock1) {
            setTimeout(() => {
                lock1.classList.remove(Styles.shake);
            }, 300)
            lock1.classList.add(Styles.shake)
        }
    }
    return (
        <div className={Styles.reasonContainer} style={{ borderBottom: '1px solid #ccc' }}>
            <div>
                <p className={Styles.reasonTitle}>Select  a reason for your visit:</p>
                <div className={Styles.reasonHolder}>
                    {reasons.map((item) => {
                        return (<div className={`${Styles.reasonCard} ${reason == item.name ? Styles.activeReason : ''}`} title={reason != item.name ? `Click here to Select '${item.name}'` : null} id={reason == item.name ? "reason" : ""} onClick={reason == item.name ? shakeHandler : () => setReason(item.name)}>
                            <img src={item.icon} alt={item.name} className={Styles.iconHolder} />
                            <p className={Styles.textHolder}>{item.name}<br />
                                <p className={Styles.descHolder}>{item.desc}</p>
                            </p>
                        </div>)
                    })}
                </div>
            </div>
        </div>
    )
}
export default BMAIHandler