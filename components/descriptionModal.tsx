import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { descriptionModalStyles as styles } from '@/assets';

export const DescriptionModal = () => {
    const { title, description } = useLocalSearchParams();
    return (
        <View style={styles.container}>
            <Text>{title}</Text>
            <Text>{description}</Text>
        </View>
    )

}