import { useState, useRef } from 'react';
import { useAuth } from '../../store/auth-context';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const newPasswordInputRef = useRef();
  const currentPasswordInputRef = useRef();

  const { setLoading } = useAuth();

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
    const enteredCurrentPassword = currentPasswordInputRef.current.value;

    // Basic validation
    if (!enteredNewPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (enteredNewPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Simulate password change API call
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy-token', // In real app, use actual token
        },
        body: JSON.stringify({
          currentPassword: enteredCurrentPassword,
          newPassword: enteredNewPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      setSuccess('Password updated successfully!');
      newPasswordInputRef.current.value = '';
      if (currentPasswordInputRef.current) {
        currentPasswordInputRef.current.value = '';
      }

    } catch (error) {
      setError(error.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {error && <p className={classes.error}>{error}</p>}
      {success && <p className={classes.success}>{success}</p>}
      
      <div className={classes.control}>
        <label htmlFor='current-password'>Current Password</label>
        <input 
          type='password' 
          id='current-password' 
          ref={currentPasswordInputRef}
          disabled={isLoading}
        />
      </div>
      
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input 
          type='password' 
          id='new-password' 
          minLength='6'
          ref={newPasswordInputRef}
          disabled={isLoading}
        />
      </div>
      
      <div className={classes.action}>
        {!isLoading && (
          <button type='submit'>Change Password</button>
        )}
        {isLoading && <p>Updating password...</p>}
      </div>
    </form>
  );
}

export default ProfileForm;