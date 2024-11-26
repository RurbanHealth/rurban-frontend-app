import React from 'react';
import { View, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Control, Controller } from 'react-hook-form';
import Box from '@components/Layout/Box';

interface TermsCheckboxProps {
  control: Control<any>;
  name: string;
  error?: string;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ control, name, error }) => (
  <Box flexDirection='row' alignItems='center'>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <CheckBox value={value} onValueChange={onChange} />
      )}
    />
    <Text>I agree to the terms and conditions</Text>
    {error && <Text style={{ color: 'red' }}>{error}</Text>}
  </Box>
);

export default TermsCheckbox;
