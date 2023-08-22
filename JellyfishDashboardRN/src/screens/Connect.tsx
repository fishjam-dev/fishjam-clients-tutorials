import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  type Permission,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  Button,
  TextInput,
  QRCodeScanner,
} from 'react-native-jellyfish-components';
import {
  useJellyfishClient,
  useCamera,
} from '@jellyfish-dev/react-native-client-sdk';

const JELLYFISH_URL = 'ws://192.168.81.182:4000/socket/peer/websocket';

function ConnectScreen({ navigation }): JSX.Element {
  const [peerToken, setPeerToken] = useState<string>('');

  const { connect, join } = useJellyfishClient();
  const { startCamera } = useCamera();

  const grantedCameraPermissions = async () => {
    if (Platform.OS === 'ios') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA as Permission
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.error('Camera permission denied');
      return false;
    }
    return true;
  };

  const connectToRoom = async () => {
    try {
      await connect(JELLYFISH_URL, peerToken.trim());

      if (!(await grantedCameraPermissions())) {
        return;
      }

      await startCamera();
      await join({ name: 'Mobile RN Client' });
      navigation.navigate('Room');
    } catch (e) {
      console.log('Error while connecting', e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter peer token"
        value={peerToken}
        onChangeText={setPeerToken}
      />
      <Button onPress={connectToRoom} title="Connect" disabled={!peerToken} />
      <QRCodeScanner onCodeScanned={setPeerToken} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#BFE7F8',
    padding: 24,
    rowGap: 24,
  },
});

export default ConnectScreen;
