/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('chat-message', require('./components/ChatMessage.vue').default);
Vue.component('chat-log', require('./components/ChatLog.vue').default);
Vue.component('chat-composer', require('./components/ChatComposer.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    data: {
        messages: []
    },
    methods: {
        addMessage(message) {
            // Add to existing messages
            this.messages.push(message);

            // Persist to the database etc
            axios.post('/messages', message).then(response => {
                // Do whatever;
                console.log("Message Sent", response.data);
            });
        }
    },
    created() {
        axios.get('/messages').then(response => {
            this.messages = response.data;
        });

        Echo.join('chatroom')
            .here(members => {
                console.log("---------Members-----------");
                console.table(members);
            })
            .joining(function (joiningMember, members) {
                // runs when another member joins
                console.log("---------Another Members-----------");
                console.table(joiningMember);
            })
            .leaving(function (leavingMember, members) {
                // runs when another member leaves
                console.log("---------Another leaving Members-----------");
                console.table(leavingMember);
            })
            .listen('MessageSent', e => {
                this.messages.push({
                    message: e.message.message,
                    user: {
                        name: e.user.name
                    }
                });
            });
        // Echo.channel('chatroom').listen('message.sent', (e) => {
        //     console.log("Message Received", e);
        // });

    }
});
