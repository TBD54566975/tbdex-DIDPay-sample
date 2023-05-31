import React from 'react';
import { Profile } from '@tbd54566975/web5-user-agent';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { TruncatedTypography } from './styled/TruncatedTypography';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card sx={{ maxWidth: 450, margin: 'auto', textAlign: 'left' }}>
      <CardContent>
        <Typography variant="h5">Profile</Typography>
        <Typography color="text.secondary" variant="subtitle2">
          ID
        </Typography>
        <TruncatedTypography variant="body1">{profile.id}</TruncatedTypography>
        <Typography color="text.secondary" variant="subtitle2">
          Name
        </Typography>
        <TruncatedTypography variant="body1">
          {profile.name}
        </TruncatedTypography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/profile/${profile.id}`} size="small">
          View JSON
        </Button>
      </CardActions>
    </Card>
  );
}
