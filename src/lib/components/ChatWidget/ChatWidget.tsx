import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';

type MessageType = 'user' | 'bot' | 'agent' | 'file' | 'image';

interface Message {
  type: MessageType;
  message: string;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const botResponses = ['Let me think...', 'Can you clarify?', 'Sure!'];
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgent, setIsAgent] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false); // For typing indicator

  // Animation setup
  const chatHeight = useSharedValue(0);
  const isVisible = useSharedValue(false);

  const toggleChat = () => {
    if (isVisible.value) {
      chatHeight.value = withTiming(0, { duration: 300, easing: Easing.ease });
    } else {
      setMessages([]); // Clear messages when opening
      chatHeight.value = withTiming(400, { duration: 300, easing: Easing.ease });
    }
    isVisible.value = !isVisible.value;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: chatHeight.value,
    overflow: 'hidden',
  }));

  const addMessage = (msg: Message) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  };

  const handleBotResponse = () => {
    setIsTyping(true); // Start typing animation
    setTimeout(() => {
      const randomResponse = isAgent
        ? 'Thanks for reaching out! How can I assist?'
        : botResponses[Math.floor(Math.random() * botResponses.length)];
      addMessage({ type: isAgent ? 'agent' : 'bot', message: randomResponse, timestamp: new Date() });
      setIsTyping(false); // End typing animation
    }, 1000); // Simulate delay for response
  };

  const checkAgentSwitch = (userInput: string) => {
    if (userInput.toLowerCase().includes('talk to an expert')) {
      setIsAgent(true);
    }
  };

  const handleSend = (userMessage: string) => {
    addMessage({ type: 'user', message: userMessage, timestamp: new Date() });
    checkAgentSwitch(userMessage);
    handleBotResponse();
  };

  const handleDocumentPicker = async () => {
    try {
      const result: DocumentPickerResponse | any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      addMessage({ type: 'file', message: result.name, timestamp: new Date() });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User canceled the picker
      } else {
        Alert.alert('Error', 'Failed to pick a document');
      }
    }
  };

  const handleImagePicker = async() => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };
  
    await launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert('Error', 'Failed to pick an image');
      } else if (response.assets) {
        const imageUri = response.assets[0].uri;
        addMessage({ type: 'image', message: imageUri, timestamp: new Date() });
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleChat} style={styles.fab}>
        <Text style={styles.fabText}>💬</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.chatContainer, animatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Chat Widget</Text>
          <TouchableOpacity onPress={toggleChat} style={styles.closeButton}>
            <Text style={styles.closeText}>✖️</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <MessageBubble key={index} {...msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>
        <InputBar 
          onSend={handleSend} 
          onImagePick={handleImagePicker} 
          onDocumentPick={handleDocumentPicker} 
        />
      </Animated.View>
    </View>
  );
};

// Message bubble for displaying user, bot, or agent messages
const MessageBubble: React.FC<Message> = ({ message, type, timestamp }) => (
  <View style={[styles.bubble, type === 'user' ? styles.userBubble : styles.botAgentBubble]}>
    {type === 'image' && <Image source={{ uri: message }} style={styles.image} />}
    {type === 'file' && (
      <View style={styles.fileContainer}>
        <Text>{message}</Text>
      </View>
    )}
    {type !== 'image' && type !== 'file' && <Text>{message}</Text>}
    <Text style={styles.timestamp}>{timestamp.toLocaleTimeString()}</Text>
  </View>
);

// Typing indicator component
const TypingIndicator: React.FC = () => (
  <View style={styles.typingContainer}>
    <Text style={styles.typingText}>Username is typing...</Text>
    <View style={styles.dots}>
      <View style={styles.dot} />
      <View style={styles.dot} />
      <View style={styles.dot} />
    </View>
  </View>
);

// Input bar for sending user messages
const InputBar: React.FC<{
  onSend: (userMessage: string) => void;
  onImagePick: () => void;
  onDocumentPick: () => void;
}> = ({ onSend, onImagePick, onDocumentPick }) => {
  const [inputText, setInputText] = useState<string>('');

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  };

  return (
    <View style={styles.inputBar}>
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        style={styles.input}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={handleSend} />
      <TouchableOpacity onPress={onImagePick} style={styles.iconButton}>
        <Text style={styles.iconText}>📷</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDocumentPick} style={styles.iconButton}>
        <Text style={styles.iconText}>📄</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f0a500',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
  },
  chatContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: '90%',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 18,
  },
  messagesContainer: {
    padding: 10,
    maxHeight: 300,
  },
  bubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  botAgentBubble: {
    backgroundColor: '#f0a500',
    alignSelf: 'flex-start',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
    color: '#666',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 24,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  fileContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontStyle: 'italic',
    marginRight: 5,
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#888',
    marginHorizontal: 2,
    opacity: 0.7,
  },
});

export default ChatWidget;
