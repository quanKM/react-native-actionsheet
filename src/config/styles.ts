import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';

export interface ActionSheetStyles {
  overlay: StyleProp<ViewStyle>;

  wrapper: StyleProp<ViewStyle>;

  body: StyleProp<ViewStyle>;

  titleBox: StyleProp<ViewStyle>;

  titleText: StyleProp<TextStyle>;

  messageBox: StyleProp<ViewStyle>;

  messageText: StyleProp<TextStyle>;

  buttonBox: StyleProp<ViewStyle>;

  buttonText: StyleProp<TextStyle>;

  cancelButtonBox: StyleProp<ViewStyle>;
}

const styles: ActionSheetStyles = {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: '#000000',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  body: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end',
    backgroundColor: '#e5e5e5',
  },
  titleBox: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  titleText: {
    color: '#757575',
    fontSize: 14,
  },
  messageBox: {
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  messageText: {
    color: '#9a9a9a',
    fontSize: 12,
  },
  buttonBox: {
    height: 50,
    marginTop: StyleSheet.hairlineWidth as number,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 18,
  },
  cancelButtonBox: {
    height: 50,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
};

export default styles;
