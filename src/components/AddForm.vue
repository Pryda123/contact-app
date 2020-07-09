<template>
    <v-form v-model="valid" class="add-form">
        <v-container>
            <v-row>
                <v-col
                cols="12"
                md="4"
                >
                <v-text-field
                    v-model="firstname"
                    :rules="nameRules"
                    :counter="15"
                    label="Имя"
                    required
                ></v-text-field>
                </v-col>

                <v-col
                cols="12"
                md="4"
                >
                <v-text-field
                    v-model="lastname"
                    :rules="nameRules"
                    :counter="15"
                    label="Фамилия"
                    required
                ></v-text-field>
                </v-col>

                <v-col
                cols="12"
                md="4"
                >
                <v-text-field
                    v-model="phone"
                    label="Phone"
                    :rules="phoneRules"
                    required
                ></v-text-field>
                </v-col>
            </v-row>
            <v-btn class="mr-4" @click="submit" :disabled="!valid">Добавить</v-btn>
        </v-container>  
    </v-form>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AddForm',
    data() {
        return {
            valid: false,
            firstname: '',
            lastname: '',
            phone: '',
            id: null,
            nameRules: [
                v => !!v || 'Field is required',
                v => v.length <= 15 || 'Name must be less than 10 characters'
            ],
            phoneRules: [
                v => !!v || 'Field is required',
                v => /^\d+$/.test(v) || 'Phone must be valid',
                v => v.length >= 3 || 'Phone must be more than 3 characters'
            ],
        }
    },
    created() {
        this.$parent.$on('edit', this.editUser);
    },
    methods: {
        async submit() {
            if(this.id) {
                try {
                    await axios.patch('http://localhost:3000/contacts/' + this.id, {
                        firstname: this.firstname, lastname: this.lastname, phone: this.phone});
                        let obj = {
                            firstname: this.firstname,
                            lastname: this.lastname,
                            phone: this.phone,
                            id: this.id
                        };
                        this.$store.commit('editContact', obj);
                        this.firstname = '';
                        this.lastname = '';
                        this.phone = '';
                        this.id = null;
                } catch(e) {
                    console.error(e)
                }
            } else {
                try {
                    await axios.post('http://localhost:3000/contacts', {firstname: this.firstname, lastname: this.lastname, phone: this.phone, userId: this.$store.state.currentUser[0].id});
                    let obj = {
                        firstname: this.firstname,
                        lastname: this.lastname,
                        phone: this.phone,
                        userId: this.$store.state.currentUser[0].id
                    };
                    this.$store.commit('addContact', obj);
                    this.firstname = '';
                    this.lastname = '';
                    this.phone = '';
                    this.id = null;
                } catch(e) {
                    console.error(e);
                }
            }
            
        },
        editUser(user) {
            this.firstname = user.firstname;
            this.lastname = user.lastname;
            this.phone = user.phone;
            this.id = user.id;
        }
    }
}
</script>

<style>
.add-form {
    text-align: left;
    margin-bottom: 40px;
}
</style>