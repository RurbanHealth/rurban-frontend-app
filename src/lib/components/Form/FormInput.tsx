import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

interface FormInputProps {
  control: Control<any>;
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  type?: 'text' | 'date' | 'time' | 'picker' | 'phone';
  options?: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  type = 'text',
  options = [],
  required = false,
  disabled = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerValue, setPickerValue] = useState<Date | null>(null);
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [callingCode, setCallingCode] = useState('1'); // Default calling code for the US

  const handlePickerChange = (onChange: (value: Date) => void) => (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setPickerValue(selectedDate);
      onChange(selectedDate);
    }
  };

  const renderInput = ({ onChange, onBlur, value, ref }: any) => {
    if (type === 'date' || type === 'time') {
      return (
        <>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowPicker(true)}>
            <Text style={[styles.input, { color: pickerValue ? undefined : '#A9A9A9' }]}>
              {pickerValue
                ? pickerValue.toLocaleDateString() + (type === 'time' ? ' ' + pickerValue.toLocaleTimeString() : '')
                : placeholder}
            </Text>
            <Icon name={type === 'date' ? 'calendar-outline' : 'time-outline'} size={20} color="#666" />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={pickerValue || new Date()}
              mode={type}
              display="default"
              onChange={handlePickerChange(onChange)}
            />
          )}
        </>
      );
    }

    if (type === 'picker') {
      return (
        <View style={styles.inputContainer}>
          <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
            <Picker.Item label={placeholder} value="" />
            {options.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      );
    }

    if (type === 'phone') {
      return (
        <View style={styles.inputContainer}>
          <CountryPicker
            countryCode={countryCode}
            withFilter
            withFlag
            withCallingCode
            withCallingCodeButton
            onSelect={(country: Country) => {
              setCountryCode(country.cca2 as CountryCode);
              setCallingCode(country.callingCode[0]);
            }}
          />
          <TextInput
            style={styles.phoneInput}
            placeholder={placeholder}
            keyboardType="phone-pad"
            onBlur={onBlur}
            onChangeText={(text) => onChange(`+${callingCode}${text}`)} // Attach the calling code to the number
            value={value?.replace(`+${callingCode}`, '')} // Show only the phone number in the input
          />
        </View>
      );
    }

    return (
      <View style={styles.inputContainer}>
        <TextInput
          editable={!disabled}
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={isPasswordVisible && secureTextEntry}
          keyboardType={keyboardType}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          ref={ref}
        />
        {secureTextEntry && (
          <TouchableOpacity style={styles.iconContainer} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View>
      <Text>
        {placeholder}
        {required && <Text style={styles.requiredAsterisk}>*</Text>}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => renderInput({ onChange, onBlur, value, ref })}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    height: 40,
  },
  input: {
    flex: 1,
  },
  phoneInput: {
    flex: 1,
    marginLeft: 10,
  },
  picker: {
    flex: 1,
  },
  iconContainer: {
    paddingLeft: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  requiredAsterisk: {
    color: 'red',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default FormInput;