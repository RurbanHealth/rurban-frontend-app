import Button from '@components/Button/Button';
import React from 'react';
import { View } from 'react-native';

interface FormButtonProps {
  title: string;
  onPress: () => void;
  disabled: boolean;
}

const FormButton: React.FC<FormButtonProps> = ({ title, onPress, disabled }) => (
  <View>
    <Button style={{backgroundColor:'#33528b'}} title={title} onPress={onPress} disabled={disabled} />
  </View>
);

export default FormButton;
