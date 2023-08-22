import React, {useState} from 'react';
import {StyleSheet, Modal, View} from 'react-native';
import {Button} from './Button';
import {BarCodeScanner} from 'expo-barcode-scanner';

type Props = {
  onCodeScanned: (code: string) => void;
};

export function QRCodeScanner({onCodeScanned}: Props) {
  const [isBarcodeScannerVisible, setIsBarcodeScannerVisible] = useState(false);

  const onPress = async () => {
    if (isBarcodeScannerVisible) {
      setIsBarcodeScannerVisible(false);
      return;
    }
    const {status} = await BarCodeScanner.requestPermissionsAsync();
    if (status === 'granted') {
      setIsBarcodeScannerVisible(true);
    }
  };

  const onBarCodeScanned = ({data}) => {
    onCodeScanned(data);
    setIsBarcodeScannerVisible(false);
  };

  return (
    <>
      <Modal
        visible={isBarcodeScannerVisible}
        onRequestClose={() => setIsBarcodeScannerVisible(false)}
        animationType="slide"
        transparent>
        <View
          style={{
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 8,
            flex: 1,
            margin: 8,
          }}>
          <BarCodeScanner
            onBarCodeScanned={onBarCodeScanned}
            style={{flex: 1, padding: 8, borderRadius: 8}}
          />
        </View>
      </Modal>
      <Button onPress={onPress} title="Scan QR code" />
    </>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
