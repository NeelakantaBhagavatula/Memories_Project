import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate  } from 'react-router-dom';
import Icon from './icon';
import useStyles from './styles';
import Input from './Input';
import { signIn, signUp } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signUp(formData, navigate));
        } else {
            dispatch(signIn(formData, navigate));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false);
    }

    const googleSuccess = async (response) => {
        const result = response?.profileObj;
        const token = response?.tokenId;

        try {
            dispatch({ type : 'AUTH', data : {result, token } });

            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    const googleError = () => alert('Google Sign In was unsuccessful. Try again later');

    return (
    <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avater}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5">{ isSignup ? 'Sign Up' : 'Sign In' }</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    { isSignup && (
                    <>
                        <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                        <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                    </>
                    )}
                    <Input name="email" label=" Email Address" handleChange={handleChange} type="email" />
                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                    { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                </Grid>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </Button>
                <GoogleLogin 
                    clientId="184625210484-6kjdbuc838umq6tih1n7jssscke6v9rb.apps.googleusercontent.com"
                    render={(renderProps) => (
                        <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                            Google Sign In
                        </Button>
                    )}
                    onSuccess={googleSuccess}
                    onFailure={googleError}
                    cookiePolicy="single_host_origin"
                />
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Button onClick={switchMode}>
                            { isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
  );
};

export default Auth;