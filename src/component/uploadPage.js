import { useRef, useState } from "react";
import axios from "axios";
import { SERVER } from "../config";

export default function UploadPage() {

    const [status, setStatus] = useState("");
    const inputRef = useRef();
    const audioFile = useRef(null);

    const uploadFn = async () => {
        try {
            const songId = inputRef.current.value;
            if(!audioFile || !songId) return setStatus("An input field is empty");

            setStatus("uploading file");
            const formData = new FormData();
            formData.append("audio", audioFile.current);
            formData.append("SongId", songId);
            const res = await axios.put(`${SERVER}/zham`, formData);
            console.log("res.data", res);
            // const { Time } = res.data;
            // console.log("res.data", Time.slice(0, 30));
            console.log("songId", songId);

            setStatus("");
        } catch(err) {
            console.log("upload err", err);
            setStatus("");
        }
    };

    return (
        <div className="upload">
            <p>{status}</p>
            <p></p>
            <p></p>
            <p></p>
            <input placeholder="Enter song Id" ref={inputRef} />
            <p></p>
            <p></p>
            <p></p>
            <input type="file" onChange={(e) => {
                audioFile.current = e.target.files[0];
            }}/>
            <p></p>
            <p></p>
            <p></p>
            <button onClick={uploadFn}>Upload</button>
        </div>
    )
};