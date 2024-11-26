import React from 'react';

import { StyleSheet, View } from 'react-native';

import { ToastConfigParams } from 'react-native-toast-message';

import Typography from '@components/Typography/Typography';
import Box from '@components/Layout/Box';

function RenderCustomToast({ text }: any) {

  const styles = StyleSheet.create({
    container: {
      height: null,
      width: '80%',
      borderRadius: 8,
      flexDirection: 'row',
    },
    leftBar: {
      height: '100%',
      width: 7,
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    rightContainer: {
      flex: 1,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: "#33528b",
    },
  });

  return (
    <Box style={[styles.container, { backgroundColor: "#fff" }]}>
      <Box style={[styles.leftBar, { backgroundColor: "#33528b" }]}><></></Box>
      <Box style={[styles.rightContainer]}>
        <Typography style={[styles.text, { fontSize: 12 }]}>{text}</Typography>
      </Box>
    </Box>
  );
}

const toastConfig = {
  customToast: (props: ToastConfigParams<any>) => <RenderCustomToast text={props.text1!} />,
};

export default toastConfig;