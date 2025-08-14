import Youtube from "react-youtube";
import "./styles.css";
import "../home/styles.css";
import logo from "../../assets/logo.png";
import useScrollThrottler from "../../hooks/useScroll";
import { Songs } from "../../utils";
import { GoDotFill } from "react-icons/go";
import { MdOutlineIosShare } from "react-icons/md";
import { IoMusicalNotesSharp } from "react-icons/io5";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import SkeletonLoader from "../../component/loading";
import { FaGithub, FaInstagram, FaLinkedin, FaSnapchat, FaXTwitter } from "react-icons/fa6";
import { AppContext } from "../../context";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import YTError from "./error";
import axios from "axios";
import { SERVER } from "../../config";
import ToastAlert from "../../component/alert";

export default function Song() {

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const zhamCount = searchParams.get("zhamCount");
    const { state } = useLocation();
    const { setZham } = useContext(AppContext);
    const song = Songs.find(v => v.youtubeId === id);

    const [vidLoading, setVidLoading] = useState(true);
    const [loadedSongs, setLoadedSongs] = useState({});
    const [failedSongs, setFailedSongs] = useState({});
    const [scrolled, setScrolled] = useState(false);
    const [error, setError] = useState(false);
    const [ytError, setYtError] = useState(false);
    const scrollCtrl = useRef(false);
    const [numZhams, setNumZhams] = useState("--");

    const songs = useMemo(() => {
        if(id && state?.songIds) {
            const slice = state.songIds.slice(1); // first is the perfect match so ignore
            const res = [];
            for(const id of slice) {
                for(const Song of Songs) {
                    if(id === Song.youtubeId) {
                        res.push(Song);
                        break;
                    }
                }
            }
            if(res.length < 5) {
                for(const Song of Songs) {
                    if(res.length >= 5) break;
                    if(!slice.includes(Song.youtubeId)) res.push(Song);
                }
            }
            return res;
        } else {
            return Songs.filter(v => v.youtubeId !== id).slice(0, 5);
        }
    }, [id, state?.songIds]);

    const getZhamCount = useCallback(async () => {
        try {
            const res = await axios.get(`${SERVER}/zham/${id}`);
            // console.log(res.data);
            setNumZhams(String(res.data));
            setYtError(false);
        } catch(err) {
            console.log(err);
            setError("Network connection error. Check internet and Refresh");
            setYtError(true);
        }
    }, [id]);

    // const handleOnline = useCallback(() => {
    //     setYtError(false);
    // }, []);

    const handleOffline = useCallback(() => {
        setYtError(true);
    }, []);

    useEffect(() => {
        if(!zhamCount && zhamCount !== "0") {
            getZhamCount();
        } else if(id && zhamCount >= 0) {
            setNumZhams(String(zhamCount));
        }

        window.addEventListener("online", getZhamCount); //handleOnline)
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", getZhamCount);
            window.removeEventListener("offline", handleOffline);
        };

    }, [id, zhamCount, getZhamCount, handleOffline]);

    const _songsLoaded = useCallback((yId) => {
        setLoadedSongs((prev) => {
            return {...prev, [yId]: true};
        });
    }, []);

    const _songsFailed = useCallback((yId) => {
        setFailedSongs((prev) => {
            return {...prev, [yId]: true};
        });
    }, []);

    useScrollThrottler((e) => {
        if(e.target.scrollTop >= 20 && !scrollCtrl.current) {
            scrollCtrl.current = true;
            setScrolled(true);
        } else if(e.target.scrollTop < 20 && scrollCtrl.current) {
            scrollCtrl.current = false;
            setScrolled(false);
        }
    });

    return (
        <div className="Song">

            {error && <ToastAlert text={error} clickFn={() => setError(false)} />} 

            <header className={`Song_header ${scrolled}`}>
                <div className="SH">
                    <span className="SH_logo">
                        <Link to="/" className="SH_logo">
                            <img src={logo} alt="logo" />
                            <span>ZHAM</span>
                        </Link>
                    </span>
                    <button className="SH_button pointer" onClick={() => setZham(true)}>
                        <span>Zham song</span>
                    </button>
                </div>
            </header>
            <main className="Song_main">
                <div className="SM_top">
                    <div className="SMt_bg"></div>
                    <div className="SMt_content">
                        <div className="song-cover">
                            <img src={song.img} alt={song.title} />
                        </div>
                        <div className="SMtc">
                            <div className="song-details">
                                <h2>{song.title}</h2>
                                <p>{song.artiste}</p>
                                <div className="sd">
                                    <span>{song.genre}</span>
                                    <GoDotFill className="sd-icon" />
                                    <div className="sd-logo">
                                        <img src={logo} alt="logo" />
                                    </div>
                                    <span className="sd-with-loader">
                                        {
                                            numZhams === "--" ?
                                            <div>
                                                <SkeletonLoader />
                                            </div> 
                                            :
                                            numZhams
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="song-buttons">
                                <a href={`https://youtu.be/${song.youtubeId}`} className="player" target="_blank" rel="noreferrer">
                                    <div>
                                        <IoMusicalNotesSharp className="sb-icon" />
                                    </div>
                                    <span>PLAY SONG</span>
                                </a>
                                <button className="sharer">
                                    <MdOutlineIosShare className="sb-icon" />
                                    <span>SHARE</span>
                                </button>
                            </div>
                            <div className="song-extra">Songs are linked to YouTube</div>
                        </div>
                    </div>
                </div>
                <div className="SM_mid">
                    <div className="smm_vid">
                        <div className={`smmv ${vidLoading}`}>
                            <SkeletonLoader />
                        </div>

                        {(vidLoading !== "loaded" && ytError) && <YTError />}

                        <Youtube 
                            videoId={id}
                            opts={{
                                playerVars: {start: 0, rel: 0},
                            }}
                            onReady={() => {
                                setTimeout(() => {
                                    setVidLoading("loaded");
                                }, 1000);
                            }}
                            onError={() => {
                                setYtError(true);
                                setError("Youtube video failed to load. Check internet conn.");
                            }}
                            iframeClassName={"smm_y_vid"}
                        />
                    </div>
                    <div className="smm_div">
                        <h1>Result is not correct match ?</h1>
                        <p>Here are some likely causes :</p>
                        <ul>
                            <li>
                                <div className="smmd_li">
                                    <span className="smm_span_1">Low speaker volume and much noise</span>
                                    <span className="smm_span_2"><b>Solution: </b>Increase speaker volume (to max. probably) and use quiet room</span>
                                </div>
                            </li>
                            <li>
                                <div className="smmd_li">
                                    <span className="smm_span_1">Speaker too far from recording device</span>
                                    <span className="smm_span_2"><b>Solution: </b>Place speaker close to recording device</span>
                                </div>
                            </li>
                            <li>
                                <div className="smmd_li">
                                    <span className="smm_span_1">Recorded regions of low sounds in the song (rare, only if max volume fails)</span>
                                    <span className="smm_span_2"><b>Solution: </b>Try playing from regions of the song that do not have too low sounds</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="other_songs">
                    <h1>Other Recommended Songs</h1>
                    <div className="Songs_Slider no_scrollbar">
                        <ul>
                            {songs.map((song, s_index) => (
                                <li key={`s-${s_index}-${song.youtubeId}`} className="song_Li">
                                    <div className={`sL-loader ${loadedSongs[song.youtubeId]}`}>
                                        <SkeletonLoader />
                                    </div>

                                    {(!loadedSongs[song.youtubeId] && (ytError || failedSongs[song.youtubeId])) && <YTError />}

                                    <Youtube 
                                        videoId={song.youtubeId}
                                        opts={{
                                            playerVars: {start: 0, rel: 0},
                                        }}
                                        onReady={() => {
                                            setTimeout(() => {
                                                _songsLoaded(song.youtubeId);
                                            }, 1000);
                                        }}
                                        onError={() => {
                                            _songsFailed(song.youtubeId);
                                        }}
                                        iframeClassName={"sL_y_vid"}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
            <footer className="Home_footer">
                <div>
                    <div className="logo_footer">
                        <span className="Hns_logo">
                            <Link to="/" className="Hn_logo footer_logo">
                                <img src={logo} alt="logo" />
                                <span>ZHAM</span>
                            </Link>
                        </span>
                    </div>
                    <div className="footer_links">
                        <span>Follow the Creator</span>
                        <div className="socials">
                            <a href="https://www.linkedin.com/in/osatohanmen-ogbeide-94377719a" target="_blank" rel="noreferrer">
                                <FaLinkedin className="socials_icon" />
                            </a>
                            <a href="https://github.com/OsatoVicTory" target="_blank" rel="noreferrer">
                                <FaGithub className="socials_icon" />
                            </a>
                            <a href="https://x.com/tory_maximus?t=YYxqBG3hYyeE7Y2PYDF_qQ&s=09" target="_blank" rel="noreferrer">
                                <FaXTwitter className="socials_icon" />
                            </a>
                            <a href="https://www.instagram.com/torhee_?igsh=dTU5Nmk4ODZ6Y3Uz" target="_blank" rel="noreferrer">
                                <FaInstagram className="socials_icon" />
                            </a>
                            <a href="https://www.snapchat.com/add/boy_tory?share_id=iw-ghX84MVE&locale=en-US" target="_blank" rel="noreferrer">
                                <FaSnapchat className="socials_icon" />
                            </a>
                        </div>
                        <span className="copyright">
                            &#169; {`Copyright ${new Date().getFullYear()} Osato Co. and its affiliates`}
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
};