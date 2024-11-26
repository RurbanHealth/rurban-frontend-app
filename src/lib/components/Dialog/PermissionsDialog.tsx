import Button from '@components/Button/Button';
import Box from '@components/Layout/Box';
import Typography from '@components/Typography/Typography';
import React from 'react';
import { Modal, StyleSheet } from 'react-native';

interface PermissionDialogProps {
  visible: boolean;
  permissionTitle: string;
  permissionMessage: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const PermissionDialog: React.FC<PermissionDialogProps> = ({
  visible,
  permissionTitle,
  permissionMessage,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <Box style={styles.overlay}>
        <Box style={styles.dialogContainer} padding={20} backgroundColor="#fff">
          <Typography variant="h3">{permissionTitle}</Typography>
          <Typography variant="body" style={styles.message}>
            {permissionMessage}
          </Typography>

          {/* Buttons */}
          <Box flexDirection="row" justifyContent="space-between" style={{marginTop:20}}>
            <Button title="Deny" onPress={onCancel} />
            <Button title="Allow" onPress={onConfirm} />
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
    borderRadius:10
  },
  message: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default PermissionDialog;
