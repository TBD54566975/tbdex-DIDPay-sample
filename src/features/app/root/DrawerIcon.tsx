import {
  AccountBalance,
  PriceChange,
  ShoppingBag,
  Wallet,
} from '@mui/icons-material';

type Props = { page: string };

export const DrawerIcon = ({ page }: Props) => {
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
      return null;
  }
};
