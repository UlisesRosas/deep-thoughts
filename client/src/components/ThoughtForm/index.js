// this component will show up in the homepage and profile page
import React, { useState } from 'react';

const ThoughtForm = () => {
    // using state
    const [thoughtText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    // getstriggered by the <textarea> tag
    const handleChange = event => {
        // stops updating the value of thoughtText once caracter count reaches 280
        if (event.target.value.length <= 280) {
            // gets the text value
            setText(event.target.value);
            // gets the character count from the textarea
            setCharacterCount(event.target.value.length);
        }
    };
    
   //clears the form values when the form is submited 
    const handleFormSubmit = async event => {
        event.preventDefault();
        setText('');
        setCharacterCount(0);
      };

    return (
        <div>
            {/* this renders when character count reaches 280 */}
            <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
            </p>
            <form   className="flex-row justify-center justify-space-between-md align-stretch"
            onSubmit={handleFormSubmit}>
                <textarea
                    placeholder="Here's a new thought..."
                    value={thoughtText}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}
                ></textarea>
                <button className="btn col-12 col-md-3" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ThoughtForm;
