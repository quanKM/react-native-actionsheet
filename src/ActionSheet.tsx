import * as React from 'react';
import {
  ActionSheetIOS,
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
  StyleProp,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {PLATFORM_IS_IOS} from './platform';
import defaultStyles, {ActionSheetStyles} from './styles';
import {ReactElement} from 'react';

const WARN_COLOR: string = '#FF3B30';
const MAX_HEIGHT: number = Dimensions.get('window').height * 0.7;

export interface ActionSheetProps {
  /**
   * Control the action sheet visibility
   *
   * @type boolean
   */
  visible?: boolean;

  /**
   * a list of button titles (required)
   * @type string[]
   * @example
   *   ['cancel', 'Apple', 'Banana']
   */
  options: string[];

  /**
   * index of cancel button in options
   * @type int
   */
  cancelButtonIndex: number;

  /**
   * index of destructive button in options
   * @type int
   */
  destructiveButtonIndex: number;

  /**
   * a title to show above the action sheet
   * @type string | ReactElement
   */
  title?: string | ReactElement;

  /**
   * a message to show below the title
   * @type string | ReactElement
   */
  message?: string | ReactElement;

  /**
   * the color used for non-destructive button titles
   * @type string
   * @see http://facebook.github.io/react-native/docs/colors.html
   */
  tintColor?: string;

  /**
   * Button underlay color
   *
   * @type string
   */
  buttonUnderlayColor?: string;

  /**
   * Styles
   *
   * @type Partial<ActionSheetStyles>
   */
  styles?: Partial<ActionSheetStyles>;

  /**
   * The 'callback' function takes one parameter, the zero-based index of the selected item
   * @type (index: number) => void
   * @example
   *   (buttonIndex) => if (buttonIndex === 1) { // do something }
   */
  onPress?(index: number): void;
}

export interface ActionSheetRef {
  show?(): any;

  hide?(index: number): any;
}

const ActionSheet = React.forwardRef<ActionSheetRef, ActionSheetProps>(
  (props, ref) => {
    const {
      styles,
      cancelButtonIndex,
      options,
      title,
      message,
      onPress,
      destructiveButtonIndex,
      tintColor,
      buttonUnderlayColor,
    } = props;

    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [isScrollEnabled, setIsScrollEnabled] = React.useState<boolean>(
      false,
    );
    const translateY: number = React.useMemo(() => {
      const getHeight = (name: keyof ActionSheetStyles) => {
        const style: StyleProp<any> =
          (styles ?? {})[name] ?? defaultStyles[name];
        let h: number = 0;
        ['height', 'marginTop', 'marginBottom'].forEach((attrName: string) => {
          if (typeof style[attrName] !== 'undefined') {
            h += style[attrName];
          }
        });
        return h;
      };

      let height: number = 0;
      if (title) {
        height += getHeight('titleBox');
      }
      if (message) {
        height += getHeight('messageBox');
      }
      if (typeof cancelButtonIndex !== 'undefined') {
        height += getHeight('cancelButtonBox');
        height += (options.length - 1) * getHeight('buttonBox');
      } else {
        height += options.length * getHeight('buttonBox');
      }

      if (height > MAX_HEIGHT) {
        setIsScrollEnabled(true);
        height = MAX_HEIGHT;
      } else {
        setIsScrollEnabled(false);
      }

      return height;
    }, [
      styles,
      cancelButtonIndex,
      message,
      options,
      title,
      setIsScrollEnabled,
    ]);

    const combinedStyles: ActionSheetStyles = React.useMemo(() => {
      return Object.fromEntries(
        Object.entries(defaultStyles).map(([key, value]) => {
          if (styles && styles.hasOwnProperty(key)) {
            return [
              value,
              styles[key as keyof ActionSheetStyles] as StyleProp<any>,
            ];
          }
          return value;
        }),
      ) as ActionSheetStyles;
    }, [styles]);

    const [animation] = React.useState(new Animated.Value(translateY));

    const handleCancel = React.useCallback(() => {
      setIsVisible(false);
    }, []);

    const handleHide = React.useCallback(
      (index: number) => () => {
        Animated.timing(animation, {
          toValue: translateY,
          useNativeDriver: true,
          duration: 200,
        }).start(() => {
          setIsVisible(false);
          if (typeof onPress === 'function') {
            onPress(index);
          }
        });
      },
      [animation, onPress, translateY],
    );

    /**
     * Add action sheet handlers for Ref
     */
    React.useImperativeHandle(ref, () => ({
      hide(index: number): any {
        if (PLATFORM_IS_IOS) {
          return;
        }
        handleHide(index)();
      },
      show(): any {
        if (PLATFORM_IS_IOS) {
          const {onPress: callback, ...iosProps} = props;
          if (typeof callback === 'function') {
            ActionSheetIOS.showActionSheetWithOptions(
              iosProps as any,
              callback as (index: number) => void,
            );
          }
          return;
        }
        setIsVisible(true);
        Animated.timing(animation, {
          toValue: 0,
          useNativeDriver: true,
          duration: 250,
          easing: Easing.out(Easing.ease),
        }).start();
      },
    }));

    const renderButton = React.useCallback(
      (title: string, index: number) => {
        const fontColor =
          destructiveButtonIndex === index ? WARN_COLOR : tintColor;
        const buttonBoxStyle: StyleProp<any> =
          cancelButtonIndex === index
            ? combinedStyles.cancelButtonBox
            : combinedStyles.buttonBox;
        return (
          <TouchableHighlight
            key={index}
            activeOpacity={1}
            underlayColor={buttonUnderlayColor}
            style={buttonBoxStyle}
            onPress={handleHide(index)}
          >
            {React.isValidElement(title) ? (
              title
            ) : (
              <Text style={[combinedStyles.buttonText, {color: fontColor}]}>
                {title}
              </Text>
            )}
          </TouchableHighlight>
        );
      },
      [
        buttonUnderlayColor,
        cancelButtonIndex,
        combinedStyles.buttonBox,
        combinedStyles.buttonText,
        combinedStyles.cancelButtonBox,
        destructiveButtonIndex,
        handleHide,
        tintColor,
      ],
    );

    if (PLATFORM_IS_IOS) {
      return null;
    }

    return (
      <Modal
        visible={isVisible}
        animationType="none"
        transparent
        onRequestClose={handleCancel}
      >
        <View style={[defaultStyles.wrapper, styles?.wrapper]}>
          <Text
            style={[defaultStyles.overlay, styles?.overlay]}
            onPress={handleCancel}
          />
          <Animated.View
            style={[
              styles?.body,
              {
                height: translateY,
                transform: [
                  {
                    translateY: animation,
                  },
                ],
              },
            ]}
          >
            {title && (
              <View style={[defaultStyles.titleBox, styles?.titleBox]}>
                {React.isValidElement(title) ? (
                  title
                ) : (
                  <Text style={combinedStyles.titleText}>{title}</Text>
                )}
              </View>
            )}
            {message && (
              <View style={combinedStyles.messageBox}>
                {React.isValidElement(message) ? (
                  message
                ) : (
                  <Text style={combinedStyles.messageText}>{message}</Text>
                )}
              </View>
            )}
            <ScrollView scrollEnabled={isScrollEnabled}>
              {options.filter((buttonTitle, buttonIndex) => {
                if (buttonIndex === cancelButtonIndex) {
                  return null;
                }
                return renderButton(buttonTitle, buttonIndex);
              })}
            </ScrollView>
            {renderButton(options[cancelButtonIndex], cancelButtonIndex)}
          </Animated.View>
        </View>
      </Modal>
    );
  },
);

ActionSheet.defaultProps = {
  tintColor: '#007AFF',
  buttonUnderlayColor: '#F4F4F4',
  onPress: () => {
    // Do nothing
  },
};

export default ActionSheet;
