import React, {useState} from 'react'
import {TouchableOpacity, View} from 'react-native'
import {Text} from 'react-native-paper'
import Background from '../../components/Background'
import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import {passwordValidator} from '../../utils/passwordValidator'
import {usernameValidator} from "../../utils/usernameValidator";
import Toast from '../../components/Toast'
import {styles} from "./style";
import {loginUser} from "../../api/auth-api";

export default function Login({navigation}) {
    const [username, setUsername] = useState({value: '', error: ''})
    const [password, setPassword] = useState({value: '', error: ''})
    const [loading, setLoading] = useState()
    const [error, setError] = useState()

    const onLoginPressed = async () => {
        const usernameError = usernameValidator(username.value)
        const passwordError = passwordValidator(password.value)
        if (usernameError || passwordError) {
            setUsername({...username, error: usernameError})
            setPassword({...password, error: passwordError})
            return
        }
        setLoading(true)

        const response = await loginUser({
            username: username.value,
            password: password.value,
        })
        if (response.error) {
            if (response.error === "username") {
                setUsername({...username, error: "Username not found."})
            } else if (response.error === "password") {
                setPassword({...password, error: "Password incorrect."})
            } else {
                setError(response.error)
            }
        } else {
            console.log(response.uid)
            navigation.navigate('SprayCard')
        }

        setLoading(false)
    }

    return (
        <Background>
            <Logo/>
            <Header>Trac Cloud</Header>
            <TextInput
                label="Username"
                returnKeyType="next"
                value={username.value}
                onChangeText={(text) => setUsername({value: text, error: ''})}
                error={!!username.error}
                errorText={username.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({value: text, error: ''})}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />
            <View style={styles.forgotPassword}>
                <TouchableOpacity
                    onPress={() => setError("Please go to Web for password reset.")}
                >
                    <Text style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>
            <Button loading={loading} mode="contained" onPress={() => onLoginPressed()}>
                Login
            </Button>
            <View style={styles.row}>
                <Text>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => setError("Please go to Web for registration.")}>
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>
            <Toast message={error} onDismiss={() => setError('')}/>
        </Background>
    )
}


