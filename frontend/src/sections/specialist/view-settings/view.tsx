import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
  FormControlLabel,
  Checkbox,
  FormGroup,
  Chip,
} from '@mui/material';
import { Save as SaveIcon } from 'lucide-react';
import { useSpecialistProfile } from 'src/hooks/use-specialist-profile';
import PricingManagement from '../components/PricingManagement';
import AvailabilityManagement from '../components/AvailabilityManagement';

const SPECIALTY_OPTIONS = ['PSYCHOLOGY', 'COUNSELING', 'BEHAVIORAL', 'MEDITATION', 'GENERAL'];

export default function SpecialistSettingsView() {
  const {
    loading: apiLoading,
    error: apiError,
    fetchProfile,
    updateProfile,
  } = useSpecialistProfile();

  const [profileData, setProfileData] = useState({
    fullName: '',
    specialty: [] as string[],
    bio: '',
    avatar: 'https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_default.jpg',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profileData);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoadError(null);
      const profile = await fetchProfile();
      setProfileData({
        fullName: profile.fullName || '',
        specialty: Array.isArray(profile.specialtyTags) ? profile.specialtyTags : [],
        bio: '', // Backend doesn't have bio field in current model
        avatar: 'https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_default.jpg',
      });
      setEditData({
        fullName: profile.fullName || '',
        specialty: Array.isArray(profile.specialtyTags) ? profile.specialtyTags : [],
        bio: '',
        avatar: 'https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_default.jpg',
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load profile';
      setLoadError(errorMsg);
      console.error('Error loading profile:', err);
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
        specialtyTags: editData.specialty,
      });

      // Update local state with successful response
      setProfileData({
        fullName: result.fullName || '',
        specialty: Array.isArray(result.specialtyTags) ? result.specialtyTags : [],
        bio: '',
        avatar: 'https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_default.jpg',
      });

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save profile';
      setLoadError(errorMsg);
      console.error('Error saving profile:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <Helmet>
        <title>Settings | Specialist</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Page Title */}
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
              Settings & Profile Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage your professional information, pricing, and availability
            </Typography>
          </Box>

          {/* Alerts */}
          {loadError && <Alert severity="error">{loadError}</Alert>}
          {apiError && <Alert severity="error">{apiError}</Alert>}
          {saveSuccess && (
            <Alert severity="success">Your profile has been updated successfully!</Alert>
          )}

          {/* Loading State */}
          {apiLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <CardHeader
                title="Professional Profile"
                action={
                  !isEditing && (
                    <Button variant="outlined" onClick={handleEditClick}>
                      Edit Profile
                    </Button>
                  )
                }
              />
              <CardContent>
                <Grid container spacing={3}>
                  {/* Avatar Section */}
                  <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                    <Stack spacing={2} sx={{ alignItems: 'center' }}>
                      <Avatar src={profileData.avatar} sx={{ width: 120, height: 120 }} />
                      {isEditing && (
                        <Button variant="outlined" size="small">
                          Change Avatar
                        </Button>
                      )}
                    </Stack>
                  </Grid>

                  {/* Profile Fields */}
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
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500 }}>
                              Specialties
                            </Typography>
                            <FormGroup>
                              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                                {SPECIALTY_OPTIONS.map((option) => (
                                  <FormControlLabel
                                    key={option}
                                    control={
                                      <Checkbox
                                        checked={editData.specialty.includes(option)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setEditData({
                                              ...editData,
                                              specialty: [...editData.specialty, option],
                                            });
                                          } else {
                                            setEditData({
                                              ...editData,
                                              specialty: editData.specialty.filter(
                                                (s) => s !== option
                                              ),
                                            });
                                          }
                                        }}
                                      />
                                    }
                                    label={option}
                                  />
                                ))}
                              </Stack>
                            </FormGroup>
                          </Box>
                          <TextField
                            label="Bio"
                            fullWidth
                            multiline
                            rows={4}
                            value={editData.bio}
                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                          />
                          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="outlined" onClick={handleCancel}>
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={<SaveIcon size={20} />}
                              onClick={handleSaveProfile}
                            >
                              Save Changes
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
                              {profileData.fullName}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                              Specialty
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ mt: 0.5, flexWrap: 'wrap', gap: 1 }}
                            >
                              {profileData.specialty && profileData.specialty.length > 0 ? (
                                profileData.specialty.map((spec) => (
                                  <Chip key={spec} label={spec} variant="outlined" />
                                ))
                              ) : (
                                <Typography variant="body2" color="textSecondary">
                                  No specialties selected
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                              Bio
                            </Typography>
                            <Typography variant="body2">{profileData.bio}</Typography>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
              {/* </Card> */}

              {/* Pricing Section */}
              <PricingManagement />

              {/* Availability Section */}
              <AvailabilityManagement />
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}
