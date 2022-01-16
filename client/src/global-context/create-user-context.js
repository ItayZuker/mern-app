import React, {useState} from "react";
const CreateUserContext = React.createContext();

const CreateUserContextComponent = (props) => {

    const [stage, setStage] = useState('email');
    const [password, setPassword] = useState({
        array: [],
        size: null,
        lifetime: null,
    });
    const [email, setEmail] = useState({
        string: '',
        verified: false,
    });
    const [message, setMessage] = useState({
        one: {
            string: '',
            highlight: false
        },
        two: {
            string: '',
            highlight: false
        }
    });
    const [legal, setLegal] = useState({
        content: 'sldkjf sldkfjs lffj sldfj llkj lskfj sldfj sldkfdsjf lkjfl skjflsdk flkdsjf ldskjf lsdkfj sldfj sldkfj sldfj llkj.',
        agree: false,
    })

    const contextValue = {
        email,
        setEmail,
        stage,
        setStage,
        password,
        setPassword,
        message,
        setMessage,
        legal,
        setLegal
    };

    return (
        <CreateUserContext.Provider value={ contextValue }>
            { props.children }
        </CreateUserContext.Provider>
    )
}

export { CreateUserContext, CreateUserContextComponent }
