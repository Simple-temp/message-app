import React from 'react';

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
    return (
        <div className='form mt-4'>
            <form action="" onSubmit={handleSubmit} className="d-flex">
                <label htmlFor="img" className=" mt-2">
                    <i class="fa-solid fa-cloud-arrow-up upload"></i>
                </label>
                <input
                    onChange={(e) => setImg(e.target.files[0])}
                    type="file"
                    accept='/*'
                    id="img"
                    style={{ display: 'none' }}
                />
                <input
                    type="text"
                    placeholder='send a message'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="form-input w-100"
                />

                <input
                    type="submit"
                    value="send"
                    className='btn btn-dark'
                />
            </form>
        </div>
    );
};

export default MessageForm;