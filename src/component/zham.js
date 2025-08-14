import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "../pages/home/styles.css";
import "./zham.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";
import axios from "axios";
import { AppContext } from "../context";
import { SERVER } from "../config";
import ToastAlert from "./alert";

export default function Zham() {

    const navigate = useNavigate();
    const { setZham, recorder, setRecorder } = useContext(AppContext);
    const [recordingStatus, setRecordingStatus] = useState("");
    const [error, setError] = useState(false);
    const streamRef = useRef(null);
    const registeredMediaEncoder = useRef(false);
    

    const randomId = () => {
        const ap = 'abcdefghijklmnopqrstuvwxyz';
        let str = "";
        for(let i = 0; i < 10; i++) {
            if(i % 5) str += ap[Math.floor(Math.random() * 26)];
            else str += Math.floor(Math.random() * 10);
        }
        return str;
    };

    function cleanup() {
        const st = streamRef.current;
        if(st) {
            st.getTracks().forEach((track) => track.stop());
        }
        
    };

    useEffect(() => {
        return () => {
            cleanup();
        }
    }, []);

    const startRecording = useCallback(async () => {
        setError(false);
        if(recordingStatus) return;

        try {
            setRecordingStatus("Listening to music");
            if(!recorder) {
                await register(await connect());
                registeredMediaEncoder.current = true;
                setRecorder(true);
            }
            const contraints = {
                audio: {
                    audioGainControl: false,
                    channelCount: 1,
                    echoCancellation: false,
                    noiseSuppression: false,
                    sampleSize: 16,
                },
                video: false,
            };
            const stream = await navigator.mediaDevices.getUserMedia(contraints);
            streamRef.current = stream;
            // const destination = cleanStream(stream);
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/wav" });
            mediaRecorder.start();
            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            }

            setTimeout(() => {
                mediaRecorder.stop();
            }, 15000); // should be 20000 -> 20 secs

            mediaRecorder.addEventListener("stop", async () => {
                try {
                    const blob = new Blob(chunks, { type: "audio/wav" });
                    const file = new File([blob], `rec_${Date.now()}.mp3`, { type: "audio/mp3" });

                    cleanup();

                    const data = new FormData();
                    data.append("audio", file);
                    data.append("SongId", randomId());

                    setRecordingStatus("Now searching for song");
                    
                    const res = await axios.post(`${SERVER}/zham`, data);
                    const { Results, ZhamCount } = res.data;
                    // const { Results, Peaks, Offsets } = res.data;
                    // console.log("res", Results, ZhamCount);

                    setRecordingStatus("");
                    setZham(false);
                    navigate(`/song/${Results[0]}?zhamCount=${ZhamCount}`, { state: { songIds: Results } });
                } catch(err) {
                    console.log("media stop err", err);
                    setError("There was an error. Check internet and retry.");
                    setRecordingStatus("");
                    cleanup();
                }
            })
        } catch (err) {
            console.log(err);
            setError("There was an error with recording. Try again.");
            setRecordingStatus("");
            cleanup();
        }
    }, [recorder, setRecorder, navigate, setZham, recordingStatus]);

    return (
        <div className="Zham">

            {error && <ToastAlert text={error} clickFn={() => setError(false)} />} 

            <nav className={`Home_Nav`}>
                <div className="Home_nav">
                    <span className="Hns_logo">
                        <a href="/" className="Hn_logo">
                            <img src={logo} alt="logo" />
                            <span>ZHAM</span>
                        </a>
                    </span>
                </div>
            </nav>
            <main>
                <div className="Zham_main">
                    <div className={`Zham_Pulse ${recordingStatus ? true : false}`}>
                        <div className='pulse1'></div>
                        <div className='pulse2'></div>
                        <div className='pulse3'></div>
                        <button className={`no-pulse pulse_img ${!recordingStatus ? "pointer" : ""}`}
                        onClick={() => startRecording()}>
                            <img src={logo} alt="logo" />
                        </button>
                        <h2>
                            {recordingStatus || "Click button up to Zham"}
                        </h2>
                        <span>{recordingStatus ? "Please wait" : "Waiting on you"}</span>
                    </div>
                </div>
                <div className="Zham_footer">
                    <button className="zf_button" onClick={() => setZham(false)}>
                        CANCEL
                    </button>
                </div>
            </main>
        </div>
    )
};