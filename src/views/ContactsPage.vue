<template>
    <div>
        <v-app-bar
            color="deep-purple accent-4"
            dense
            dark
            >
            <v-toolbar-title>Мои контакты</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Search"
                class="hidden-sm-and-down"
                v-model="searchText"
                @input="search"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn @click="logout">
                Выйти
            </v-btn>
        </v-app-bar>
        <add-form></add-form>

        <v-container>
            <ul class="list">
                <li class="list__item">
                    <div class="list__titles">
                        <v-list-item-title>Имя</v-list-item-title>
                        <v-list-item-title>Фамилия</v-list-item-title>
                        <v-list-item-title>Телефон</v-list-item-title>
                    </div>
                    <div class="list__buttons hidden">
                        <v-btn class="mr-15">
                            Редактировать
                        </v-btn>
                        <v-btn>
                            Удалить
                        </v-btn>
                    </div>
                </li>
                <!-- <div v-if="!searchContacts.length">
                    <li v-for="(contact, index) in contacts"
                        :key="contact.id"
                        class="list__item"
                        >
                        <div class="list__titles">
                            <v-list-item-title v-text="contact.firstname"></v-list-item-title>
                            <v-list-item-title v-text="contact.lastname"></v-list-item-title>
                            <v-list-item-title v-text="contact.phone"></v-list-item-title>
                        </div>
                        <div class="list__buttons">
                            <v-btn @click="editContact(index)" class="mr-15">
                                Редактировать
                            </v-btn>
                            <v-btn @click="deleteContact(contact)">
                                Удалить
                            </v-btn>
                        </div>
                    </li>
                </div> -->
                <div v-if="searchContacts.length">
                    <li v-for="(contact, index) in searchContacts"
                        :key="contact.id"
                        class="list__item"
                        >
                        <div class="list__titles">
                            <v-list-item-title v-text="contact.firstname"></v-list-item-title>
                            <v-list-item-title v-text="contact.lastname"></v-list-item-title>
                            <v-list-item-title v-text="contact.phone"></v-list-item-title>
                        </div>
                        <div class="list__buttons">
                            <v-btn @click="editContact(index)" class="mr-15">
                                Редактировать
                            </v-btn>
                            <v-btn @click="deleteContact(contact)">
                                Удалить
                            </v-btn>
                        </div>
                    </li>
                </div>
            </ul>
        </v-container>
    </div>
</template>

<script>
import AddForm from '@/components/AddForm.vue'
import axios from 'axios'

export default {
    components: {
        AddForm
    },
    data() {
        return {
            searchText: null,
            searchContacts: []
        }
    },
    computed: {
        contacts() {
            return this.$store.state.contacts;
        }
    },
    watch: {
        contacts() {
            this.searchContacts = this.contacts;
        }
    },
    async created() {
        try {
            const res = await axios.get('http://localhost:3000/contacts?userId=' + this.$store.state.currentUser[0].id);
            this.$store.commit('setContacts', res.data);
        } catch(e) {
            console.error(e);
        }     
    },
    beforeRouteEnter(to, from, next) {
        const user = sessionStorage.getItem('user');
        if(user) {
            next();
        } else {
            next('/login')
        }
    },
    methods: {
        logout() {
            sessionStorage.removeItem('user');
            this.$store.commit('setUser', null);
            this.$store.commit('setContacts', []);
            this.$router.push('/login');
        },
        editContact(index) {
            this.$emit('edit', this.contacts[index]);
        },
        async deleteContact(contact) {
            try {
                await axios.delete('http://localhost:3000/contacts/' + contact.id);

                this.$store.commit('deleteContact', contact.id);
            } catch(e) {
                console.error(e)
            }
        },
        search() {
            let arr = this.contacts.filter(item => {
                return item.firstname.includes(this.searchText) || item.lastname.includes(this.searchText) || item.phone.includes(this.searchText);
            });
            this.searchContacts = arr;
        }
    }
}
</script>

<style>
.list {
    list-style-type: none;
}
.list__header {
    display: flex;
    width: 75%;
    text-align: left;
}
.list__item {
    display: flex;
    text-align: left;
    margin-bottom: 15px;
}
.v-text-field.v-text-field--solo .v-input__control {
    min-height: auto;
}
.list__titles {
    display: flex;
    width: 100%;
    margin-bottom: 15px;
}
.list__buttons {
    display: flex;
    margin-bottom: 15px;
}
.mr-15 {
    margin-right: 15px;
}
.hidden {
    visibility: hidden;
}
@media (max-width:768px) {
    .list__item {
        flex-wrap: wrap;
    }
}
</style>