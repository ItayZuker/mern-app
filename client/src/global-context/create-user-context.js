import React, {useState} from "react";
const CreateUserContext = React.createContext();

const CreateUserContextComponent = (props) => {

    const [email, setEmail] = useState('');
    const [passwordSize, setPasswordSize] = useState(null);
    const [stage, setStage] = useState('email');
    const [passwordArray, setPasswordArray] = useState([]);

    const contextValue = {
        email,
        setEmail,
        passwordSize,
        setPasswordSize,
        stage,
        setStage,
        passwordArray,
        setPasswordArray,
    };

    return (
        <CreateUserContext.Provider value={ contextValue }>
            { props.children }
        </CreateUserContext.Provider>
    )
}

export { CreateUserContext, CreateUserContextComponent }
