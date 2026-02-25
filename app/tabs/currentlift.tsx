import { StyleSheet, Text, View } from 'react-native';
import { WEIGHT_AMOUNTS } from '../utils/constants';

interface CurrentLiftProps {
    liftName: string;
    lastWeight?: number;
}

export default function currentlift({ liftName, lastWeight}: CurrentLiftProps) {
    return (
        <View>
            <Text>Current Lift</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    
})

// export default currentLift;