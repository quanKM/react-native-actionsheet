import { StyleProp, TextStyle, ViewStyle } from 'react-native';
export declare const hairlineWidth: number;
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
declare const styles: ActionSheetStyles;
export default styles;
