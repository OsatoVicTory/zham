import { BiSolidError } from "react-icons/bi";
import "./styles.css";

export default function YTError() {

    return (
        <div className="youtube-iframe-error">
            <div>
                <BiSolidError className="yie-icon" />
                <h3>Failed to Load</h3>
                <p>Check your internet and refresh page</p>
            </div>
        </div>
    )
};