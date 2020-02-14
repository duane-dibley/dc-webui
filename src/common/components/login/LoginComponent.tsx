import withStyles from 'isomorphic-style-loader/withStyles';
import React, { ChangeEvent, Component, FormEvent, ReactNode } from 'react';
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
import { IStore } from '@store-model';
import Styles from './login.styl';
import { loginClick } from './loginActions';

class LoginComponent extends Component<IProps, IState> {

  private handleChange: (evt: ChangeEvent) => void;

  constructor(props: IProps) {
    super(props);

    // Bound actions for local state
    this.handleChange = this.onHandleChange.bind(this);

    this.state = {
      user: '',
      pass: '',
      remember: false
    };
  }

  private onHandleChange(evt: ChangeEvent<HTMLInputElement>): void {
    evt.stopPropagation();
    const { state } = this;
    const { checked, name, value } = evt.currentTarget;
    this.setState(Object.assign(state, { [name]: name === 'remember' ? checked : value }));
  }

  render(): ReactNode {
    const { state } = this;
    const { user, pass, remember } = state;
    const { actions } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <Avatar className={Styles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form noValidate
            onSubmit={
              (e: FormEvent): AnyAction => {
                e.preventDefault();
                return actions.loginClick(state.user, state.pass, state.remember);
              }
            }
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="user"
              label="User"
              name="user"
              autoComplete="user"
              autoFocus
              onChange={(evt: ChangeEvent<HTMLInputElement>): void => this.handleChange(evt)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="pass"
              label="Password"
              type="password"
              id="pass"
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
  user: string;
  pass: string;
  remember: boolean;
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(LoginComponent));
