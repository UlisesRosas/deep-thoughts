// this component will show up in the homepage and profile page
import React, { useState } from 'react';
// gives the ability to use mutations
import { useMutation } from '@apollo/client';
// imports the mutation
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';  

const ThoughtForm = () => {
    // using state
    const [thoughtText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {
      
            // could potentially not exist yet, so wrap in a try/catch
          try {
            // update me array's cache
            // NOTE: you only need to update cache when making changes to an array since array items have no ID which apollo tracks for updates
            const { me } = cache.readQuery({ query: QUERY_ME });
            cache.writeQuery({
              query: QUERY_ME,
              data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
            });
          } catch (e) {
            console.warn("First thought insertion by user!")
          }
      
          // update thought array's cache
          const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
          cache.writeQuery({
            query: QUERY_THOUGHTS,
            data: { thoughts: [addThought, ...thoughts] },
          });
        }
      });

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
        try {
            // add thought to database
            await addThought({
                variables: { thoughtText }
            });

            // clear form value
            setText('');
            setCharacterCount(0);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            {/* this renders when character count reaches 280 */}
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {/* if erro occurs */}
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>

            <form className="flex-row justify-center justify-space-between-md align-stretch"
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
