import * as React from 'react';
import { ActionSheetStyles } from './styles';
import { ReactElement } from 'react';
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
declare const ActionSheet: React.ForwardRefExoticComponent<ActionSheetProps & React.RefAttributes<ActionSheetRef>>;
export default ActionSheet;
