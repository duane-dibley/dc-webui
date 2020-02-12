import withStyles from 'isomorphic-style-loader/withStyles';
import React, { ChangeEvent, Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { AnyAction, Dispatch, bindActionCreators } from 'redux';
//
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
//
import Styles from './login.styl';
import { loginClick } from './loginActions';

class LoginComponent extends Component<IProps, IState> {

  private handleChange: (evt: ChangeEvent) => void;

  constructor(props: IProps) {
    super(props);

    this.handleChange = this.onHandleChange.bind(this);

    this.state = {
      email: '',
      password: '',
      remember: ''
    };
  }

  private onHandleChange(evt: ChangeEvent<HTMLInputElement>): void {
    evt.stopPropagation();
    const { checked, name, value } = evt.currentTarget;
    this.setState((state: IState) => Object.assign(state, { [name]: name === 'remember' ? checked : value }));
  }

  render(): ReactNode {
    const { state } = this;
    const { actions } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {/* <div className={Styles.paper}> */}
        <div>
          <Avatar className={Styles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {/* <form className={Styles.form} noValidate> */}
          <form noValidate onSubmit={(): AnyAction => actions.loginClick(state.email, state.password, state.remember)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(evt: ChangeEvent<HTMLInputElement>): void => this.handleChange(evt)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(evt: ChangeEvent<HTMLInputElement>): void => this.handleChange(evt)}
            />
            <FormControlLabel
              control={(
                <Checkbox name="remember"
                  value="remember"
                  color="primary"
                  onChange={(evt: ChangeEvent<HTMLInputElement>): void => this.handleChange(evt)}
                />
              )}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            // className={Styles.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#/" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#/" variant="body2">
                  Dont have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

/* * * * * * * * * * UI - JSX Components * * * * * * * * * */

function Copyright(): JSX.Element {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
  );
}

/* * * * * * * * * * Redux connect * * * * * * * * * */

function mapDispatchToProps(dispatch: Dispatch): IProps {
  return { actions: bindActionCreators({ loginClick }, dispatch) };
}

function mapStateToProps(store: IStore): IProps {
  return { store };
}

/* * * * * * * * * * Props interface * * * * * * * * * */
interface IProps {
  actions?: { loginClick: typeof loginClick };
  store?: IStore;
}

interface IState {
  email: string;
  password: string;
  remember: string;
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(LoginComponent));
