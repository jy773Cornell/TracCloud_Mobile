import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/screens/Login/Login'
import SprayCard from "./src/screens/SprayCard/SprayCard";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="SprayCard" component={SprayCard} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
