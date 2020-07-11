import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ActionSheet from './ActionSheet';

function ExampleActionSheetUsage() {
  return (
    <ActionSheet
      options={['Option 1', 'Option 2', 'Cancel']}
      cancelButtonIndex={2}
      destructiveButtonIndex={2}
    />
  );
}

test('ActionSheet render correctly', () => {
  const tree = renderer.create(<ExampleActionSheetUsage />).toJSON();
  expect(tree).toMatchSnapshot();
});
