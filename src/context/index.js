import { createContext, useState } from 'react';

const AppContext = createContext({
    zham: false,
    setZham: () => {},
    recorder: false,
    setRecorder: () => {},
});

const AppProvider = ({ children }) => {
    const [zham, setZham] = useState(false);
    const [recorder, setRecorder] = useState(false);
    
    return (
        <AppContext.Provider value={{ zham, setZham, recorder, setRecorder }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };