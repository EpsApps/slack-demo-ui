import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import SlackUsers from 'dashboards/SlackUsers';
import { isMobile } from 'Browser';
import './ApplicationContainer.css';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: (isMobile()) ? '0px' : theme.spacing.unit * 3,
        overflow: 'hidden'
    },
});

class ApplicationContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        }
    }

    static propTypes = {
    }

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    render() {
        const { classes, theme } = this.props;

        const drawer = (
            <div>
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    <ListItem onClick={() => {}} button key='listItemSlackUsers'>
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary='Slack Users' />
                    </ListItem>
                </List>
            </div>
        );

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position='fixed' className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color='inherit'
                            aria-label='Open drawer'
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton} >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h6' color='inherit' noWrap>
                            WorkOS Demo
                        </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer}>
                    <Hidden smUp implementation='css'>
                        <Drawer
                            container={this.props.container}
                            variant='temporary'
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{ paper: classes.drawerPaper }} >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation='css'>
                        <Drawer
                            classes={{ paper: classes.drawerPaper }}
                            variant='permanent'
                            open >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <div>
                        <SlackUsers />
                    </div>
                </main>
            </div>
        );
    }



}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps() {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps())(withStyles(styles, { withTheme: true })(ApplicationContainer));