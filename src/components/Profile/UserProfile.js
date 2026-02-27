import { useEffect } from 'react';
import { useAuth } from '../../store/auth-context';

import ProfileForm from './ProfileForm';
import classes from './UserProfile.module.css';

const UserProfile = () => {
  const { checkAuthStatus, isLoggedIn } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (!isLoggedIn) {
    return (
      <section className={classes.profile}>
        <h1>Access Denied</h1>
        <p>Please log in to view your profile.</p>
      </section>
    );
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
};

export default UserProfile;
