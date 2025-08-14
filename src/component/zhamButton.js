import "./styles.css";
import logo from "../assets/logo.png";
import { AiOutlineClose } from "react-icons/ai";
import { useContext, useState } from "react";
import { AppContext } from "../context";

export default function ZhamButton() {

    const { setZham } = useContext(AppContext);
    const [Zb, setZb] = useState(true);

    return (
        <div className="Zham_Button">
            <div>
                <div className={`zB_text ${Zb}`}>
                    <span className="zBt1">
                        Click to Zham!
                        <AiOutlineClose className="zBt-icon" onClick={() => setZb(false)} />
                    </span>
                    <span className="zBt2">
                        Identify songs playing around you
                    </span>
                </div>
                <button className="Z_Button" onClick={() => setZham(true)}>
                    <div className="zB_img">
                        <img src={logo} alt="logo" />
                    </div>
                </button>
            </div>
        </div>
    )
}