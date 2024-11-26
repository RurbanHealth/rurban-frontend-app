import React from 'react';
import { Modal, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Button from '@components/Button/Button';
import Box from '@components/Layout/Box';
import Typography from '@components/Typography/Typography';

interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  dialogStyle?: StyleProp<ViewStyle>;
  messageStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;  // For custom content if needed
}

const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  dialogStyle,
  messageStyle,
  children,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <Box style={styles.overlay}>
        <Box
          style={[
            styles.dialogContainer,  // Use StyleSheet object for default styles
            dialogStyle              // Custom styles can be passed as props
          ]}
          padding={20}
          backgroundColor="#fff"
        >
          <Typography variant="h3">{title}</Typography>
          <Typography variant="body" style={[styles.message, messageStyle]}>
            {message}
          </Typography>

          {/* Render additional custom content if provided */}
          {children}

          {/* Buttons */}
          <Box flexDirection="row" justifyContent="space-between" style={{ marginTop: 20 }}>
            {onCancel && (
              <Button title={cancelText} onPress={onCancel} />
            )}
            {onConfirm && (
              <Button title={confirmText} onPress={onConfirm} />
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 10,
  },
  message: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default Dialog;
