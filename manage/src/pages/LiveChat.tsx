import { useState, useEffect, ChangeEvent, MouseEvent, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { Typography, Tabs, Input, Button, Alert, Modal, Empty, message, Badge } from 'antd';
import { SendOutlined } from '@ant-design/icons';

// componets
import Box from '../components/Box';
// hooks
import useSocket from '../hooks/useSocket';
// models
import type { Client, Message } from '../models';

const { Text } = Typography;
const { TextArea } = Input;

const CHAT_TAB_HEIGHT = '170px';
const CHAT_CONTENT_HEIGHT = '500px';

interface ChatInputProps {
  room: Client['room'];
  onSendMessage: (room: Client['room'], input: Message['content']) => void;
}

const ChatInput = ({ room, onSendMessage }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input) return;
    onSendMessage(room, input);
    setInput('');
  };
  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextArea
        value={input}
        allowClear
        autoSize={{ minRows: 2, maxRows: 4 }}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
        onChange={handleChangeInput}
      />
      <Button
        type="text"
        shape="round"
        size="large"
        style={{ width: '70px', margin: '0 10px' }}
        onClick={handleSubmit}
      >
        <SendOutlined />
      </Button>
    </div>
  );
};

const LiveChat = () => {
  const socket = useSocket();
  const [activeRoom, setActiveRoom] = useState<Client['room'] | undefined>();
  const [clients, setClients] = useState<Client[]>([]);
  useEffect(() => {
    socket?.on('chat:server-manage(client-joined)', (client: Client) => {
      message.info(`Client [${client.name}] joined`);
      if (!activeRoom) setActiveRoom(client.room);
      setClients((prev) => [...prev, client]);
    });
    socket?.on('chat:server-manage(client-disconnected)', (room: Client['room']) => {
      setClients((prev) => {
        const newClient = prev.map((client) =>
          client.room === room ? { ...client, isActive: false } : client
        );
        return newClient;
      });
    });
    socket?.on('chat:server-manage(message)', (room: Client['room'], message: Message) => {
      setClients((prev) => {
        const newClient = prev.map((client) =>
          client.room === room
            ? {
                ...client,
                messages: [...client.messages, message],
                unread: room === activeRoom ? 0 : client.unread + 1,
              }
            : client
        );
        return newClient;
      });
    });

    return () => {
      socket?.off('chat:server-manage(client-joined)');
      socket?.off('chat:server-manage(client-disconnected)');
      socket?.off('chat:server-manage(message)');
    };
    // eslint-disable-next-line
  }, [activeRoom]);

  const handleSendMessage = (room: Client['room'], input: Message['content']) => {
    const message: Message = {
      sender: 'Tipe',
      content: input,
    };
    socket?.emit('chat:manage-server(message)', room, message);
    setClients((prev) => {
      const newClient = prev.map((client) =>
        client.room === room ? { ...client, messages: [...client.messages, message] } : client
      );
      return newClient;
    });
  };
  const handleChangeTab = (room: string) => {
    setActiveRoom(room);
    setClients((prev) => {
      const newClient = prev.map((client) =>
        client.room === room
          ? {
              ...client,
              unread: 0,
            }
          : client
      );
      return newClient;
    });
  };
  const handleEditTabs = (
    targetRoom: string | MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
    } else {
      Modal.confirm({
        centered: true,
        title: 'Are you sure you want to close the Room?',
        content:
          'Once closed, the conversation will disappear without either party being able to continue',
        okButtonProps: {
          danger: true,
        },
        okText: 'Close Room',
        onOk() {
          const targetIndex = clients.findIndex((client) => client.room === targetRoom);
          const newClients = clients.filter((client) => client.room !== targetRoom);
          if (newClients.length && targetRoom === activeRoom) {
            const { room } =
              newClients[targetIndex === newClients.length ? targetIndex - 1 : targetIndex];
            setActiveRoom(room);
          }
          socket?.emit('chat:manage-server(close-room)', targetRoom);
          setClients(newClients);
        },
      });
    }
  };
  return (
    <RootStyle>
      <Box>
        {clients.length > 0 && (
          <Tabs
            activeKey={activeRoom}
            tabPosition="left"
            hideAdd={true}
            type="editable-card"
            onChange={handleChangeTab}
            onEdit={handleEditTabs}
            style={{ height: CHAT_CONTENT_HEIGHT }}
            items={clients.map((client) => {
              const { room, name, isActive, messages, unread } = client;
              const Tab = () => (
                <div>
                  <Text
                    strong
                    style={{ width: CHAT_TAB_HEIGHT, display: 'block' }}
                    ellipsis={{ tooltip: name }}
                  >
                    {name}
                  </Text>
                  <Text type={isActive ? 'success' : 'danger'} className="caption">
                    {isActive ? 'Is Active' : 'Disconnected'}
                  </Text>
                </div>
              );
              return {
                label:
                  unread > 0 ? (
                    <Badge.Ribbon text={unread} placement="start">
                      <Tab />
                    </Badge.Ribbon>
                  ) : (
                    <Tab />
                  ),
                key: room,
                children: (
                  <ChatTable>
                    <Scroll>
                      {messages.map((message, index) => {
                        const { sender, content } = message;
                        return (
                          <MessageText
                            key={index}
                            className={sender === name ? 'box-default' : 'box-primary'}
                            object={sender === name ? 'other' : 'sender'}
                          >
                            {content}
                          </MessageText>
                        );
                      })}
                    </Scroll>
                    {isActive && <ChatInput room={room} onSendMessage={handleSendMessage} />}
                    {!isActive && <Alert description="Client has left the chat 🥳" type="error" />}
                  </ChatTable>
                ),
              };
            })}
          />
        )}
        {clients.length <= 0 && <Empty description="No any chat yet" />}
      </Box>
    </RootStyle>
  );
};

const RootStyle = styled('div')({
  display: 'flex',
  padding: '10px 100px',
  height: '100%',
});

const ChatTable = styled('div')({
  height: CHAT_CONTENT_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 24px 10px 0',
});

const Scroll = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'scroll',
  flexGrow: 1,
  padding: '5px',
  margin: '10px 0',
});

const MessageText = styled(Text)<{ object: 'sender' | 'other' }>(({ object }) => ({
  padding: '10px',
  margin: '2px 0',
  borderRadius: '15px',
  alignSelf: object === 'sender' ? 'end' : 'start',
}));

export default LiveChat;
