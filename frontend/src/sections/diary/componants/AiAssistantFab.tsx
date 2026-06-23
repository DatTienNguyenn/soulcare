import { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Box,
  Card,
  Stack,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { chatWithAi, MessageHistory } from 'src/utils/ai-api';
import Scrollbar from 'src/components/scrollbar';
import ReactMarkdown from 'react-markdown';

const Markdown = ReactMarkdown as any;

type Props = {
  diaryContext: string;
};

export default function AiAssistantFab({ diaryContext }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<MessageHistory[]>([
    { role: 'model', content: "Hi there! I'm your Soulcare Companion. How are you feeling today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    if (open) {
      // Give Markdown a brief moment to render before calculating scroll height
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [history, open]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');

    const newHistory: MessageHistory[] = [...history, { role: 'user', content: userMessage }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const response = await chatWithAi({
        message: userMessage,
        context: diaryContext,
        history: history.filter(
          (h) =>
            h.role !== 'model' ||
            h.content !== "Hi there! I'm your Soulcare Companion. How are you feeling today?"
        ),
      });

      setHistory([...newHistory, { role: 'model', content: response.response }]);
    } catch (error) {
      setHistory([
        ...newHistory,
        { role: 'model', content: "I'm sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Talk to AI Assistant">
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}
          onClick={() => setOpen(!open)}
        >
          <Iconify icon={open ? 'eva:close-fill' : 'eva:message-circle-fill'} width={24} />
        </Fab>
      </Tooltip>

      {open && (
        <Card
          sx={{
            position: 'fixed',
            bottom: 88,
            right: 24,
            width: 360,
            height: 480,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: (theme) => theme.customShadows.dialog,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, borderBottom: (theme) => `dashed 1px ${theme.palette.divider}` }}
          >
            <Tooltip
              title="AI chat can not access to your personal data. It only uses the context you provide and
            the conversation history to generate responses."
              placement="top"
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1">Soulcare Companion</Typography>
                <Iconify icon="eva:info-outline" width={16} sx={{ ml: 0.5 }} />
              </Box>
            </Tooltip>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>

          <Box sx={{ flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
            <Scrollbar sx={{ height: '100%' }}>
              <Stack spacing={2} sx={{ p: 2 }}>
                {history.map((msg, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        typography: 'body2',
                        bgcolor: msg.role === 'user' ? 'primary.main' : 'background.neutral',
                        color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                        maxWidth: '80%',
                        // Styling to format Markdown paragraphs and lists cleanly
                        '& p': { m: 0, mb: 1 },
                        '& p:last-of-type': { mb: 0 },
                        '& ul, & ol': { mt: 0, mb: 1, pl: 2.5 },
                        '& li': { mb: 0.5 },
                        wordBreak: 'break-word',
                        whiteSpace: msg.role === 'user' ? 'pre-wrap' : 'normal',
                      }}
                    >
                      {msg.role === 'user' ? msg.content : <Markdown>{msg.content}</Markdown>}
                    </Box>
                  </Stack>
                ))}
                {loading && (
                  <Stack direction="row" justifyContent="flex-start">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: 'background.neutral',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <CircularProgress size={16} />
                    </Box>
                  </Stack>
                )}
                <div ref={messagesEndRef} />
              </Stack>
            </Scrollbar>
          </Box>

          <Box sx={{ p: 2, borderTop: (theme) => `dashed 1px ${theme.palette.divider}` }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                disabled={loading}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!message.trim() || loading}
              >
                <Iconify icon="eva:paper-plane-fill" />
              </IconButton>
            </Stack>
          </Box>
        </Card>
      )}
    </>
  );
}
