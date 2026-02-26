import { StyleSheet, Text, View } from 'react-native';
import { WEIGHT_AMOUNTS } from '../utils/constants';
import { WeightPlate } from '@/components';

interface CurrentLiftProps {
    liftName: string;
    lastWeight?: number;
}

export default function currentlift({ liftName, lastWeight}: CurrentLiftProps) {
    return (
        <View>
            <Text>Current Lift</Text>
            <WeightPlate weight={45} onSwipeDown={() => console.log("down")} onSwipeUp={() => console.log("up")}/>
        </View>
    )
}

const styles = StyleSheet.create({
    
})

// export default currentLift;