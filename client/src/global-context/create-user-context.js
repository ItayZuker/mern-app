import React, {useState} from "react";
const CreateUserContext = React.createContext();

const CreateUserContextComponent = (props) => {

    const [email, setEmail] = useState({
        string: '',
    });

    const contextValue = {
        email,
        setEmail,
    }

    return (
        <CreateUserContext.Provider value={ contextValue }>
            { props.children }
        </CreateUserContext.Provider>
    )
}

export { CreateUserContext, CreateUserContextComponent }
