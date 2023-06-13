import { Link } from 'react-router-dom';

export const UncoloredRouterLink = (props: any) => {
  return <Link {...props} style={{ color: 'inherit' }} />;
};
