import React, {useRef, useState, useEffect, useContext} from "react";
import './input-character.scss';
import {CreateUserContext} from "../../../../../../../global-context/create-user-context";

const InputCharacter = (props) => {

    const {
        passwordArray,
        setPasswordArray,
    } = useContext(CreateUserContext);

    const [characters] = useState([
        {type: '0', charCode: 48},
        {type: '1', charCode: 49},
        {type: '2', charCode: 50},
        {type: '3', charCode: 51},
        {type: '4', charCode: 52},
        {type: '5', charCode: 53},
        {type: '6', charCode: 54},
        {type: '7', charCode: 55},
        {type: '8', charCode: 56},
        {type: '9', charCode: 57},
        {type: 'A', charCode: 65},
        {type: 'B', charCode: 66},
        {type: 'C', charCode: 67},
        {type: 'D', charCode: 68},
        {type: 'E', charCode: 69},
        {type: 'F', charCode: 70},
        {type: 'G', charCode: 71},
        {type: 'H', charCode: 72},
        {type: 'I', charCode: 73},
        {type: 'J', charCode: 74},
        {type: 'K', charCode: 75},
        {type: 'L', charCode: 76},
        {type: 'M', charCode: 77},
        {type: 'N', charCode: 78},
        {type: 'O', charCode: 79},
        {type: 'P', charCode: 80},
        {type: 'Q', charCode: 81},
        {type: 'R', charCode: 82},
        {type: 'S', charCode: 83},
        {type: 'T', charCode: 84},
        {type: 'U', charCode: 85},
        {type: 'V', charCode: 86},
        {type: 'W', charCode: 87},
        {type: 'X', charCode: 88},
        {type: 'Y', charCode: 89},
        {type: 'Z', charCode: 90},
        {type: 'a', charCode: 97},
        {type: 'b', charCode: 98},
        {type: 'c', charCode: 99},
        {type: 'd', charCode: 100},
        {type: 'e', charCode: 101},
        {type: 'f', charCode: 102},
        {type: 'g', charCode: 103},
        {type: 'h', charCode: 104},
        {type: 'i', charCode: 105},
        {type: 'j', charCode: 106},
        {type: 'k', charCode: 107},
        {type: 'l', charCode: 108},
        {type: 'm', charCode: 109},
        {type: 'n', charCode: 110},
        {type: 'o', charCode: 111},
        {type: 'p', charCode: 112},
        {type: 'q', charCode: 113},
        {type: 'r', charCode: 114},
        {type: 's', charCode: 115},
        {type: 't', charCode: 116},
        {type: 'u', charCode: 117},
        {type: 'v', charCode: 118},
        {type: 'w', charCode: 119},
        {type: 'x', charCode: 120},
        {type: 'y', charCode: 121},
        {type: 'z', charCode: 122}
    ]);
    const characterRef = useRef();

    useEffect(() => {
        focusFirst();
    }, []);

    useEffect(() => {
        updateCharacter();
        focusNext();
    }, [passwordArray]);

    const focusFirst = () => {
        if (props.index === 0) {
            characterRef.current.focus();
        };
    };

    const focusNext = async () => {
        const nextCharacterItem = await passwordArray.find(item => !item.character);
        if (!!nextCharacterItem) {
            if (nextCharacterItem.index === props.index) {
                characterRef.current.focus();
            }
        }
    };

    const focusPrevious = async () => {
        const newPasswordArray = await getDeletedPreviousArray();
        setPasswordArray(newPasswordArray);
    };

    const getDeletedPreviousArray = () => {console.log(123)
        return new Promise(resolve => {
            const previousIndex = props.index - 1;
            const newArray = passwordArray.map((item, i) => {
                if(i === previousIndex) {
                    return {character: '', index: i};
                } else {
                    return item;
                }
            });
            resolve(newArray);
        });
    };

    const updateCharacter = () => {
        passwordArray.forEach((item, index) => {
            if(index === props.index) {
                characterRef.current.innerText = item.character;
            }
        });
    };

    const handleFocus = () => {
        updatePasswordArray('');
    };

    const getNewArray = (character) => {
        return new Promise(resolve => {
            const newArray = passwordArray.map((item, i) => {
                if(i === props.index) {
                    return {character: character, index: i};
                } else if(i > props.index) {
                    return {character: '', index: i};
                } else {
                    return item;
                }
            });
            resolve(newArray);
        });
    };

    const updatePasswordArray = async (character) => {
        const newArray = await getNewArray(character);
        setPasswordArray(newArray);
    };

    const handleInput = (e) => {
        const character = e.target.innerText;
        if (!!character) {
            characterRef.current.blur();
            updatePasswordArray(character[0]);
        }
    };

    const validateCharCode = (e) => {
        return new Promise(resolve => {
            const characterItem = characters.find(character => character.charCode === e.charCode);
            if (!characterItem) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    };

    const handleKeyPress = async (e) => {
        const validated = await validateCharCode(e);
        if (!validated) {
            e.preventDefault();
        }
    };

    const handleKeyDown = (e) => {
        switch (e.keyCode) {
            case 8:
                focusPrevious();
                break;
        }
    };

    const handlePast = (e) => {
        e.preventDefault();
    };

    return (
        <div
            className='input-character-container'
            onClick={() => characterRef.current.focus()}>
            <p
                suppressContentEditableWarning={true}
                contentEditable={'true'}
                ref={characterRef}
                onFocus={(e) => handleFocus(e)}
                onInput={(e) => handleInput(e)}
                onKeyPress={(e) => handleKeyPress(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                onPaste={(e) => handlePast(e)}>
                </p>
        </div>
    )
}

export default InputCharacter;