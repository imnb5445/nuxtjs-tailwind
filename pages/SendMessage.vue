<template>
    <!-- insert Pemain -->
     <form @submit.prevent="SendMessage">
        <label for="Name">Name: </label>
        <input name="Name" type="text" v-model="nama_input">
        <label for="Email">Email:   </label>
        <input name="Email" type="email" v-model="email_input">
        <label for="Message">Message:   </label>
        <textarea name="Message" v-model="message_input"></textarea>
        <input type="submit">
    </form>
    </template>
    
    <script setup>
        const supabase = useSupabaseClient()
        const nama_input = ref('')
        const email_input = ref('')
        const message_input = ref('')
        
        // function ini berfungsi untuk menyimpan komentar komentar para pengguna
        async function SendMessage() {
            const {error} = await supabase 
            .from('table_user_message')
            .insert({nama: nama_input.value, email: email_input.value, message: message_input.value})

            if(error){
                alert('the message has failed to send, please try again')
                console.log(error)
                return 0
            }else{
                alert('the message was succesfuly sent')
                nama_input.value = ''
                email_input.value = ''
                message_input.value = ''
                return 0
            }

        }
        
    
        onMounted(() => {
            
        })
            
        
    </script>