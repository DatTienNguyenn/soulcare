import { useEffect, useState } from 'react';
import {
  Container,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from '@mui/material';
import { usePictureSave } from 'src/hooks/use-picture-save';
import { PictureData } from 'src/utils/picture-api';
import { useLocales } from 'src/locale/use-locales';

export default function DrawingHistoryView() {
  const { loadPictures, loadPicture } = usePictureSave();
  const [drawings, setDrawings] = useState<PictureData[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<PictureData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocales();

  // Load drawings on mount
  useEffect(() => {
    const loadDrawings = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await loadPictures();

        // Convert to full PictureData by loading each one
        const fullDrawings = await Promise.all(
          results.map(async (item) => {
            try {
              return await loadPicture(item.id);
            } catch (err) {
              console.error(`Failed to load drawing ${item.id}:`, err);
              return null;
            }
          })
        );

        // Filter out failed loads and sort by date
        const validDrawings = fullDrawings.filter((drawing) => drawing !== null) as PictureData[];

        const sorted = validDrawings.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setDrawings(sorted);
      } catch (err) {
        console.error('Failed to load drawings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load drawings');
      } finally {
        setLoading(false);
      }
    };

    loadDrawings();
  }, []); // Only run once on mount

  const handleOpenDetails = (drawing: PictureData) => {
    setSelectedDrawing(drawing);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDrawing(null);
  };

  const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMetadataSummary = (
    metadata?: string
  ): { duration: string; tools: string; strokes: string } => {
    if (!metadata) {
      return {
        duration: 'N/A',
        tools: 'N/A',
        strokes: 'N/A',
      };
    }

    try {
      const data = JSON.parse(metadata);
      const duration = data.duration ? `${(data.duration / 1000).toFixed(1)}s` : 'N/A';
      const tools = data.toolsUsed?.join(', ') || 'N/A';
      const strokes = data.totalStrokes?.toString() || '0';
      return { duration, tools, strokes };
    } catch {
      return {
        duration: 'N/A',
        tools: 'N/A',
        strokes: 'N/A',
      };
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
            Drawing History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {drawings.length} drawing{drawings.length !== 1 ? 's' : ''} saved
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {drawings.length === 0 ? (
          <Alert severity="info">
            No drawings saved yet. Start creating and saving your drawings!
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {drawings.map((drawing) => {
              const metadata = getMetadataSummary(drawing.metadata);
              return (
                <Grid item xs={12} sm={6} md={4} key={drawing.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      },
                      cursor: 'pointer',
                    }}
                    onClick={() => handleOpenDetails(drawing)}
                  >
                    {drawing.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={drawing.imageUrl}
                        alt={drawing.description || 'Drawing'}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {drawing.description || 'Untitled Drawing'}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        {formatDate(drawing.createdAt)}
                      </Typography>
                      <Stack spacing={0.5}>
                        <Typography variant="caption">
                          <strong>Duration:</strong> {metadata.duration}
                        </Typography>
                        <Typography variant="caption">
                          <strong>Tools:</strong> {metadata.tools}
                        </Typography>
                        <Typography variant="caption">
                          <strong>Strokes:</strong> {metadata.strokes}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Stack>

      {/* Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedDrawing?.description || 'Drawing Details'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            {selectedDrawing?.imageUrl && (
              <Box
                component="img"
                src={selectedDrawing.imageUrl}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                }}
              />
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Created Date
                </Typography>
                <Typography variant="body2">{formatDate(selectedDrawing?.createdAt)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Last Updated
                </Typography>
                <Typography variant="body2">{formatDate(selectedDrawing?.lastUpdate)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Status
                </Typography>
                <Typography variant="body2">{selectedDrawing?.status || 'PUBLISHED'}</Typography>
              </Box>
              {selectedDrawing?.metadata &&
                (() => {
                  const metadata = getMetadataSummary(selectedDrawing.metadata);
                  return (
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        Drawing Time
                      </Typography>
                      <Typography variant="body2">{metadata.duration}</Typography>
                    </Box>
                  );
                })()}
            </Box>
            {selectedDrawing?.metadata &&
              (() => {
                const metadata = getMetadataSummary(selectedDrawing.metadata);
                return (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 1 }}
                    >
                      Drawing Metadata
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tools Used:</strong> {metadata.tools}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Strokes:</strong> {metadata.strokes}
                    </Typography>
                  </Box>
                );
              })()}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
