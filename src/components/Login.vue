<template>
    <v-card class="elevation-12">
        <v-toolbar
        color="primary"
        dark
        flat
        >
            <v-tabs v-model="tab" centered>
                <v-tab>
                    Вход
                </v-tab>
                <v-tab >
                    Регистрация
                </v-tab>
            </v-tabs>
        </v-toolbar>

        <v-tabs-items v-model="tab">
            <v-tab-item >
                <v-card flat>
                    <v-card-text>
                        <v-form v-model="validAuth">
                            <v-text-field
                            label="Email"
                            name="login"
                            prepend-icon="mdi-account"
                            type="text"
                            v-model="login"
                            :rules="emailRules"
                            required
                            ></v-text-field>
                            <v-text-field
                            id="password"
                            label="Пароль"
                            name="password"
                            prepend-icon="mdi-lock"
                            type="password"
                            v-model="password"
                            :rules="passwordRules"
                            required
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="submit" :disabled="!validAuth">Войти</v-btn>
                    </v-card-actions>
                </v-card>
            </v-tab-item>
            <v-tab-item >
                <v-card flat>
                    <v-card-text>
                        <v-form v-model="validReg">
                            <v-text-field
                            label="Email"
                            name="login"
                            prepend-icon="mdi-account"
                            type="text"
                            v-model="login"
                            :rules="emailRules"
                            required
                            ></v-text-field>
                            <v-text-field
                            id="password"
                            label="Пароль"
                            name="password"
                            prepend-icon="mdi-lock"
                            type="password"
                            v-model="password"
                            :rules="passwordRules"
                            required
                            ></v-text-field>
                            <v-text-field
                            id="checkPassword"
                            label="Повторите пароль"
                            name="checkPassword"
                            prepend-icon="mdi-lock"
                            type="password"
                            v-model="checkPassword"
                            :rules="passwordRules"
                            required
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                        <p v-if="errorMessage">Пользователь с таким email уже существует</p>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="register" :disabled="!validReg">Зарегистрироваться</v-btn>
                    </v-card-actions>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
         
    </v-card>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Login',
    data() {
        return {
            validReg: true,
            validAuth: true,
            tab: null,
            login: null,
            password: null,
            checkPassword: null,
            errorMessage: false,
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            passwordRules: [
                v => !!v || 'Password is required'
            ]  
        }
    },
    methods: {
        async submit() {
            try {
                const res = await axios.get('http://localhost:3000/users?email=' + this.login + '&password=' + this.password);
                if(res.data.length) {
                    this.$store.commit('setUser', res.data);
                    sessionStorage.setItem('user', JSON.stringify(res.data));
                    this.$router.push('/');
                } else {
                    this.emailRules = ['Неверный логин или пароль'];
                    this.passwordRules = ['Неверный логин или пароль'];
                }
            } catch(e) {
                console.error(e);
            }
        },
        async register() {
            if(this.password != this.checkPassword) {
                this.passwordRules = ['Пароли должны совпадать'];
                return;
            }
            try {
                const res = await axios.get('http://localhost:3000/users?email=' + this.login);
                if(res.data.length) {
                    this.errorMessage = true;
                    return;
                }
                await axios.post('http://localhost:3000/users', {email: this.login, password: this.password});
            } catch(e) {
                console.error(e);
            }
        } // Авторизация и регистрация сделаны чисто кустарным способом, у json-server нет API для правильной организации подобного функционала (есть json-server-auth, который предоставлял такой функционал, но он работает некорректно, в issue на гитхабе такая проблема описана и еще не решена)
    }
}
</script>