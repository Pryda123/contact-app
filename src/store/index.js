import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    contacts: []
  },
  mutations: {
    setUser(state, user) {
      state.currentUser = user;
    },
    addContact(state, contact) {
      state.contacts.push(contact);
    },
    setContacts(state, contacts) {
      state.contacts = contacts;
    },
    editContact(state, contact) {
      let editContact = state.contacts.find(item => {
        return item.id == contact.id
      });
      console.log(editContact)
      editContact.firstname = contact.firstname;
      editContact.lastname = contact.lastname;
      editContact.phone = contact.phone;
    },
    deleteContact(state, contactId) {
      state.contacts.forEach((item, index) => {
        if(item.id == contactId) {
          state.contacts.splice(index, 1);
        }
      })
    }
  }
})
