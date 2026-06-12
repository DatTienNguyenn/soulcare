import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Stack,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Save as SaveIcon } from 'lucide-react';
import { usePatientProfile } from 'src/hooks/use-patient-profile';
import { useLocales } from 'src/locale/use-locales';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

export default function UserSettingView() {
  const { loading: apiLoading, error: apiError, fetchProfile, updateProfile } = usePatientProfile();

  const [profileData, setProfileData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    avatar: 'https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_default.jpg',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profileData);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { t } = useLocales();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoadError(null);
      const profile = await fetchProfile();
      const mappedProfile = {
        fullName: profile.fullName || '',
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: profile.gender || '',
        avatar:
          profile.avatarUrl ||
          'https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_default.jpg',
      };
      setProfileData(mappedProfile);
      setEditData(mappedProfile);
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load profile');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile({
        fullName: editData.fullName,
        dateOfBirth: editData.dateOfBirth,
        gender: editData.gender,
        avatarUrl: editData.avatar,
      });

      setProfileData({
        fullName: result.fullName || '',
        dateOfBirth: result.dateOfBirth
          ? new Date(result.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: result.gender || '',
        avatar:
          result.avatarUrl ||
          editData.avatar ||
          'https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_default.jpg',
      });

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setLoadError(err.message || 'Failed to save profile');
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData({ ...editData, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            {t('pages.settings.title')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your personal information and profile settings
          </Typography>
        </Box>

        {loadError && <Alert severity="error">{loadError}</Alert>}
        {apiError && <Alert severity="error">{apiError}</Alert>}
        {saveSuccess && (
          <Alert severity="success">Your profile has been updated successfully!</Alert>
        )}

        {apiLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Card>
            <CardHeader
              title="Personal Profile"
              action={
                !isEditing && (
                  <Button variant="outlined" onClick={handleEditClick}>
                    {t('common.edit')} Profile
                  </Button>
                )
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                  <Stack spacing={2} sx={{ alignItems: 'center' }}>
                    <Avatar
                      src={isEditing ? editData.avatar : profileData.avatar}
                      sx={{ width: 120, height: 120 }}
                    />
                    {isEditing && (
                      <Button variant="outlined" size="small" component="label">
                        Change Avatar
                        <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                      </Button>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={9}>
                  <Stack spacing={2}>
                    {isEditing ? (
                      <>
                        <TextField
                          label="Full Name"
                          fullWidth
                          value={editData.fullName}
                          onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                        />
                        <TextField
                          label="Date of Birth"
                          type="date"
                          fullWidth
                          value={editData.dateOfBirth}
                          onChange={(e) =>
                            setEditData({ ...editData, dateOfBirth: e.target.value })
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <TextField
                          select
                          label="Gender"
                          fullWidth
                          value={editData.gender}
                          onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                        >
                          {GENDER_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>

                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ justifyContent: 'flex-end', pt: 2 }}
                        >
                          <Button variant="outlined" onClick={handleCancel}>
                            {t('common.cancel')}
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon size={20} />}
                            onClick={handleSaveProfile}
                          >
                            {t('common.save')}
                          </Button>
                        </Stack>
                      </>
                    ) : (
                      <>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Full Name
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {profileData.fullName || 'Not specified'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Date of Birth
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {profileData.dateOfBirth || 'Not specified'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Gender
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {GENDER_OPTIONS.find((g) => g.value === profileData.gender)?.label ||
                              profileData.gender ||
                              'Not specified'}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
