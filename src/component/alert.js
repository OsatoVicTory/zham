import { AiOutlineClose } from "react-icons/ai";
import "./styles.css";

export default function ToastAlert({text, clickFn}) {
    return (
        <span>
            <div className={`Fm_notification`}>
                <div className={`Fm_notification_div`}>
                    <span>{text}</span>
                    <button className={`Fmn_close_btn`} onClick={clickFn}>
                        <AiOutlineClose className={`Fmn_close`} />
                    </button> 
                </div>
            </div>
        </span>
    );
};