import { Route, Routes } from 'react-router-dom';
import './App.css';
import Zham from './component/zham';
import ZhamButton from './component/zhamButton';
import Home from './pages/home';
import Song from './pages/song';
import { useContext } from 'react';
import { AppContext } from './context';
import UploadPage from './component/uploadPage';

function App() {

  const { zham } = useContext(AppContext);

  return (
    <div className="App" id="main-scroll">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/song/:id" element={<Song />} />
      </Routes>
      
      <ZhamButton />

      {zham && <Zham />}

    </div>
  );
}

export default App;
