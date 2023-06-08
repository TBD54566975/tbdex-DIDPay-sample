import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardHeader,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

type Props = { creds: any };
export const CredentialCard = ({ creds }: Props) => {
  return (
    <Grid md={4} sm={12}>
      <Card>
        <CardHeader
          title={creds.vc.credentialSubject.type}
          subheader={`Issued: ${new Date(
            creds.vc.credentialSubject.approvalDate
          ).toLocaleString()}`}
        />
        <CardContent>
          <Typography variant="body2">Self attest</Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Button</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
