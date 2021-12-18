import React, {useState, useEffect} from "react";
const GlobalContext = React.createContext();

const GlobalContextComponent = (props) => {

    const [appTitle, setAppTitle] = useState('Hello World');
    const [geoData, setGeoData] = useState({});
    const [date, setDate] = useState(new Date());

    const getGeoData = async () => {
        const data = await fetch(`https://geolocation-db.com/json/`);
        const geoData = await data.json();
        setGeoData(geoData);
    };

    const contextValue = {
        appTitle,
        geoData,
        date
    };

    useEffect(() => {
        getGeoData();
    }, []);

    return (
        <GlobalContext.Provider value={ contextValue }>
            { props.children }
        </GlobalContext.Provider>
    )
}

export { GlobalContext, GlobalContextComponent }
