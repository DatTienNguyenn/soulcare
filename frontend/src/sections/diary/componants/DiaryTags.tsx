import { Box, Chip } from '@mui/material';

type DiaryTagsProps = {
  tags: string[];
};

export default function DiaryTags({ tags }: DiaryTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} size="small" variant="outlined" />
      ))}
    </Box>
  );
}
