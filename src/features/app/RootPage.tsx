import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { TruncatedTypography } from '../../components/TruncatedTypography';
import { useWeb5Context } from '../../context/Web5Context';
import {
  AccountBalance,
  PriceChange,
  ShoppingBag,
  Wallet,
} from '@mui/icons-material';

export function RootPage() {
  const { profile, web5 } = useWeb5Context();
  const location = useLocation();

  const did = profile.did.id;

  const handleCopyDidClick = () => {
    if (did) {
      navigator.clipboard.writeText(did);
    }
  };

  const handleWipeState = async () => {
    // doesnt work for some reason
    web5.appStorage.clear();

    // hack instead
    await manuallyClearState();
  };

  const manuallyClearState = async () => {
    const databases = await window.indexedDB.databases();

    for (const db of databases) {
      window.indexedDB.deleteDatabase(db.name!);
    }

    document.location.reload();
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {getPrettyRouteName(location.pathname)}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" component={UncoloredLink} to={'/'}>
              DIDPay
            </Typography>
          </Box>
        </Toolbar>
        <List sx={{ display: 'flex', flexDirection: 'column' }}>
          {['Verifiable Credentials', 'Offerings', 'Quotes', 'Orders'].map(
            (text, index) => (
              <ListItem
                key={text}
                component={UncoloredLink}
                to={getDrawerLinkURL(text)}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>{getDrawerIcon(text)}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Active Profile
          </Typography>
          <TruncatedTypography variant="body1" color="text.primary">
            {did}
          </TruncatedTypography>
          <Stack direction="column">
            <Button onClick={handleCopyDidClick}>Copy DID</Button>
            <Button component={Link} to={`/profile`}>
              View JSON
            </Button>
            <Button onClick={handleWipeState}>Wipe State</Button>
          </Stack>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          overflowX: 'hidden',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

const drawerWidth = 240;

const UncoloredLink = (props: any) => {
  return <Link {...props} style={{ color: 'inherit' }} />;
};

function getPrettyRouteName(route: string) {
  switch (route) {
    case '/':
      return 'Index';
    case '/verifiablecredentials':
      return 'Verifiable Credentials';
    case '/offerings':
      return 'Offerings';
    case '/quotes':
      return 'Quotes';
    case '/orders':
      return 'Orders';
    case '/profile':
      return 'Profile';
    default:
      return 'Unknown';
  }
}

function getDrawerIcon(page: string) {
  switch (page) {
    case 'Verifiable Credentials':
      return <Wallet />;
    case 'Offerings':
      return <AccountBalance />;
    case 'Quotes':
      return <PriceChange />;
    case 'Orders':
      return <ShoppingBag />;
    default:
      return undefined;
  }
}

function getDrawerLinkURL(route: string) {
  return route.toLowerCase().replace(/\s/g, '');
}
