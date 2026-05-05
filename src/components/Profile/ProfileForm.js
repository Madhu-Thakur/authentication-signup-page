
import { useRef, useState } from 'react';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    if (!enteredNewPassword || enteredNewPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: token,
            password: enteredNewPassword,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Password update failed");
      }

      alert("Password changed successfully!");

      localStorage.setItem('token', data.idToken);

      newPasswordInputRef.current.value = '';

    } catch (err) {
      alert(err.message);
    }

    setIsLoading(false);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input
          type='password'
          id='new-password'
          ref={newPasswordInputRef}
          minLength='6'
        />
      </div>

      <div className={classes.action}>
        {!isLoading && <button>Change Password</button>}
        {isLoading && <p>Updating...</p>}
      </div>
    </form>
  );
};

export default ProfileForm;