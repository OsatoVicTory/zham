import gunna from "./assets/cover_pics/gunna_one_of_wun.jpg";
import asake from "./assets/cover_pics/asake_lonely_at_the_top.jpg";
import burnaboy from "./assets/cover_pics/burnaboy_23.jpg";
import cench from "./assets/cover_pics/cench_band4band.jpg";
import roddy from "./assets/cover_pics/roddy_ricch_the_box.jpg";
import victor from "./assets/cover_pics/victor_ft_gunna_this_year.jpg";
import dababy from "./assets/cover_pics/dababy.jpg";
import lil_durk from "./assets/cover_pics/lil_durk.jpeg";
import khalid from "./assets/cover_pics/khalid.jpg";
import rema from "./assets/cover_pics/rema.jpg";

export const Songs = [
    {artiste: "Victor Thompson ft Gunna", title: "This Year", youtubeId: "Ve9dbChhzik", img: victor, genre: "Gospel/AfroBeats"},
    {artiste: "Gunna", title: "One of Wun", youtubeId: "w_JtBYqMgk8", img: gunna, genre: "Hip Hop/Rap"},
    {artiste: "Dababy ft Roddy Ricch", title: "ROCKSTAR", youtubeId: "mxFstYSbBmc", img: dababy, genre: "Hip Hop/Rap"},
    {artiste: "Roddy Ricch", title: "The Box", youtubeId: "UNZqm3dxd2w", img: roddy, genre: "Hip Hop/Rap"},
    {artiste: "Burna Boy", title: "23", youtubeId: "PFPfxcvRshk", img: burnaboy, genre: "R&B/AfroBeats/AfroPop"},
    {artiste: "Lil Durk ft J. Cole", title: "All my life", youtubeId: "Z4N8lzKNfy4", img: lil_durk, genre: "Hip Hop/Rap"},
    {artiste: "Central Cee ft Lil Baby", title: "Band 4 Band", youtubeId: "pDddlvCfTiw", img: cench, genre: "Hip Hop/Rap"},
    {artiste: "Asake", title: "Lonely At The Top", youtubeId: "bbVZo4Yw7pI", img: asake, genre: "AfroBeats"},
    {artiste: "Khalid", title: "Young Dumb & Broke", youtubeId: "IPfJnp1guPc", img: khalid, genre: "Contemporary R&B"},
    {artiste: "Rema, Selena Gomez", title: "Calm Down (Remix)", youtubeId: "WcIcVapfqXw", img: rema, genre: "AfroBeats"},
];

export const splitSongs = (splits) => {
    const res = [];
    for(let i = 0; i < Songs.length; i++) {
        let j = i;
        const splice = [];
        while(j < Songs.length && splice.length < splits) {
            splice.push(Songs[j]);
            j++;
        }
        i = j - 1;
        res.push(splice);
    }
    return res;
};