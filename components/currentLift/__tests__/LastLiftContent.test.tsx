import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { LastLiftContent } from '../LastLiftContent';

describe('LastLiftContent', () => {
    it('renders null when lastWeight is undefined, null, or 0', async () => {
        let treeUndefined: any;
        await act(async () => {
            treeUndefined = renderer.create(<LastLiftContent lastWeight={undefined} />).toJSON();
        });
        expect(treeUndefined).toBeNull();

        let treeNull: any;
        await act(async () => {
            treeNull = renderer.create(<LastLiftContent lastWeight={null} />).toJSON();
        });
        expect(treeNull).toBeNull();

        let treeZero: any;
        await act(async () => {
            treeZero = renderer.create(<LastLiftContent lastWeight={0} />).toJSON();
        });
        expect(treeZero).toBeNull();
    });

    it('renders weight in lbs when lastWeight is positive number', async () => {
        let component: any;
        await act(async () => {
            component = renderer.create(<LastLiftContent lastWeight={185} />);
        });
        const instance = component.root;
        const { Text } = require('react-native');
        const textElements = instance.findAllByType(Text);
        const textValues = textElements.map((t: any) => t.props.children);

        expect(textValues).toContain('Last lift:');
        expect(textValues).toContain(185);
        expect(textValues).toContain('lbs');
    });
});
