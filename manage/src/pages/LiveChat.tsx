import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';

// componets
import Box from '../components/Box';
// hooks
import useSocket from '../hooks/useSocket';

const { Text } = Typography;

const LiveChat = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  useEffect(() => {
    socket?.on('manage-receive-message', (message: { sender: string; content: string }) => {
      console.log(message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket?.off('manage-receive-message');
    };
    // eslint-disable-next-line
  }, []);
  return (
    <RootStyle>
      <Box style={{ flexGrow: 1 }}>chat</Box>
      <Box direction="vertical" align="center" style={{ width: '450px', marginLeft: '20px' }}>
        {messages.map((message, index) => {
          const { sender, content } = message;
          return (
            <Text strong key={index}>
              {sender}: {content}
            </Text>
          );
        })}
      </Box>
    </RootStyle>
  );
};

const RootStyle = styled('div')({
  display: 'flex',
  padding: '10px 100px',
  height: '100%',
});

export default LiveChat;
