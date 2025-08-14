import { useContext, useRef, useState } from "react";
import qr from "../../assets/qrCode.png";
import logo from "../../assets/logo.png";
import hero from "../../assets/phone_hero.png";
import useScrollThrottler from "../../hooks/useScroll";
import { splitSongs } from "../../utils";
import "./styles.css";
import { FaGithub, FaInstagram, FaLinkedin, FaSnapchat, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AppContext } from "../../context";

export default function Home() {

    const songs = splitSongs(3);
    const { setZham } = useContext(AppContext);
    const [scrolled, setScrolled] = useState(false);
    const scrollCtrl = useRef(false);
    
    useScrollThrottler((e) => {
        if(e.target.scrollTop >= 70 && !scrollCtrl.current) {
            scrollCtrl.current = true;
            setScrolled(true);
        } else if(e.target.scrollTop < 20 && scrollCtrl.current) {
            scrollCtrl.current = false;
            setScrolled(false);
        }
    });

    return (
        <div className="Home">
            <nav className={`Home_Nav ${scrolled}`}>
                <div className="Home_nav">
                    <span className="Hns_logo">
                        <Link to="/" className="Hn_logo">
                            <img src={logo} alt="logo" />
                            <span>ZHAM</span>
                        </Link>
                    </span>
                    <button className="Hn_button pointer" onClick={() => setZham(true)}>
                        <span>Zham song</span>
                    </button>
                </div>
            </nav>
            <section className="Home_section sect_1">
                <div>
                    <div className="Hs_texts">
                        <h1>Find songs in seconds</h1>
                        <p>Use a click to <b>Zham!</b> a song</p>

                        <div className="Hst_extras">
                            <div className="Hste_img">
                                <img src={qr} alt="qrCode" />
                            </div>
                            <div className="Hste">
                                <h3>The app's still small</h3>
                                <span>
                                    This app is limited by resources and hence limited to only a few songs which you will find below.
                                    <br/>
                                    P.S. It is more of a personal project flex.
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="Hs_img">
                        <img src={hero} alt="hero" />
                    </div>
                </div>
            </section>
            <section className="Home_section sect_2">
                <div className="s2">
                    <h1>All Songs On This App</h1>
                    <div className="all_songs no_scrollbar">
                        <ul>
                            {songs.map((songList, s_index) => (
                                <li className="song_li" key={`song-${s_index}`}>
                                    {songList.map((song, song_index) => (
                                        <Link to={`/song/${song.youtubeId}`} className="song" key={`song-${song.youtubeId}`}>
                                            <span className="song_index">{(s_index*3)+song_index+1}</span>
                                            <div className="song_div">
                                                <div className="song_img">
                                                    <img src={song.img} alt={song.title} />
                                                </div>
                                                <div className="song_desc">
                                                    <h3>{song.title}</h3>
                                                    <span>{song.artiste}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
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
    )
}