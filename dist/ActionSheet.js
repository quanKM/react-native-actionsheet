var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import { ActionSheetIOS, Animated, Dimensions, Easing, Modal, ScrollView, Text, TouchableHighlight, View, } from 'react-native';
import { PLATFORM_IS_IOS } from './platform';
import defaultStyles from './styles';
var WARN_COLOR = '#FF3B30';
var MAX_HEIGHT = Dimensions.get('window').height * 0.7;
var ActionSheet = React.forwardRef(function (props, ref) {
    var styles = props.styles, cancelButtonIndex = props.cancelButtonIndex, options = props.options, title = props.title, message = props.message, onPress = props.onPress, destructiveButtonIndex = props.destructiveButtonIndex, tintColor = props.tintColor, buttonUnderlayColor = props.buttonUnderlayColor;
    var _a = React.useState(false), isVisible = _a[0], setIsVisible = _a[1];
    var _b = React.useState(false), isScrollEnabled = _b[0], setIsScrollEnabled = _b[1];
    var translateY = React.useMemo(function () {
        var getHeight = function (name) {
            var _a;
            var style = (_a = (styles !== null && styles !== void 0 ? styles : {})[name]) !== null && _a !== void 0 ? _a : defaultStyles[name];
            var h = 0;
            ['height', 'marginTop', 'marginBottom'].forEach(function (attrName) {
                if (typeof style[attrName] !== 'undefined') {
                    h += style[attrName];
                }
            });
            return h;
        };
        var height = 0;
        if (title) {
            height += getHeight('titleBox');
        }
        if (message) {
            height += getHeight('messageBox');
        }
        if (typeof cancelButtonIndex !== 'undefined') {
            height += getHeight('cancelButtonBox');
            height += (options.length - 1) * getHeight('buttonBox');
        }
        else {
            height += options.length * getHeight('buttonBox');
        }
        if (height > MAX_HEIGHT) {
            setIsScrollEnabled(true);
            height = MAX_HEIGHT;
        }
        else {
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
    var combinedStyles = React.useMemo(function () {
        return Object.fromEntries(Object.entries(defaultStyles).map(function (_a) {
            var key = _a[0], value = _a[1];
            if (styles && styles.hasOwnProperty(key)) {
                return [
                    value,
                    styles[key],
                ];
            }
            return value;
        }));
    }, [styles]);
    var animation = React.useState(new Animated.Value(translateY))[0];
    var handleCancel = React.useCallback(function () {
        setIsVisible(false);
    }, []);
    var handleHide = React.useCallback(function (index) { return function () {
        Animated.timing(animation, {
            toValue: translateY,
            useNativeDriver: true,
            duration: 200,
        }).start(function () {
            setIsVisible(false);
            if (typeof onPress === 'function') {
                onPress(index);
            }
        });
    }; }, [animation, onPress, translateY]);
    /**
     * Add action sheet handlers for Ref
     */
    React.useImperativeHandle(ref, function () { return ({
        hide: function (index) {
            if (PLATFORM_IS_IOS) {
                return;
            }
            handleHide(index)();
        },
        show: function () {
            if (PLATFORM_IS_IOS) {
                var callback = props.onPress, iosProps = __rest(props, ["onPress"]);
                if (typeof callback === 'function') {
                    ActionSheetIOS.showActionSheetWithOptions(iosProps, callback);
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
    }); });
    var renderButton = React.useCallback(function (title, index) {
        var fontColor = destructiveButtonIndex === index ? WARN_COLOR : tintColor;
        var buttonBoxStyle = cancelButtonIndex === index
            ? combinedStyles.cancelButtonBox
            : combinedStyles.buttonBox;
        return (<TouchableHighlight key={index} activeOpacity={1} underlayColor={buttonUnderlayColor} style={buttonBoxStyle} onPress={handleHide(index)}>
            {React.isValidElement(title) ? (title) : (<Text style={[combinedStyles.buttonText, { color: fontColor }]}>
                {title}
              </Text>)}
          </TouchableHighlight>);
    }, [
        buttonUnderlayColor,
        cancelButtonIndex,
        combinedStyles.buttonBox,
        combinedStyles.buttonText,
        combinedStyles.cancelButtonBox,
        destructiveButtonIndex,
        handleHide,
        tintColor,
    ]);
    if (PLATFORM_IS_IOS) {
        return null;
    }
    return (<Modal visible={isVisible} animationType="none" transparent onRequestClose={handleCancel}>
        <View style={[defaultStyles.wrapper, styles === null || styles === void 0 ? void 0 : styles.wrapper]}>
          <Text style={[defaultStyles.overlay, styles === null || styles === void 0 ? void 0 : styles.overlay]} onPress={handleCancel}/>
          <Animated.View style={[
        styles === null || styles === void 0 ? void 0 : styles.body,
        {
            height: translateY,
            transform: [
                {
                    translateY: animation,
                },
            ],
        },
    ]}>
            {title && (<View style={[defaultStyles.titleBox, styles === null || styles === void 0 ? void 0 : styles.titleBox]}>
                {React.isValidElement(title) ? (title) : (<Text style={combinedStyles.titleText}>{title}</Text>)}
              </View>)}
            {message && (<View style={combinedStyles.messageBox}>
                {React.isValidElement(message) ? (message) : (<Text style={combinedStyles.messageText}>{message}</Text>)}
              </View>)}
            <ScrollView scrollEnabled={isScrollEnabled}>
              {options.filter(function (buttonTitle, buttonIndex) {
        if (buttonIndex === cancelButtonIndex) {
            return null;
        }
        return renderButton(buttonTitle, buttonIndex);
    })}
            </ScrollView>
            {renderButton(options[cancelButtonIndex], cancelButtonIndex)}
          </Animated.View>
        </View>
      </Modal>);
});
ActionSheet.defaultProps = {
    tintColor: '#007AFF',
    buttonUnderlayColor: '#F4F4F4',
    onPress: function () {
        // Do nothing
    },
};
export default ActionSheet;
//# sourceMappingURL=ActionSheet.js.map