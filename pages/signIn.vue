<template>
    <div class="flex">
        <form @submit.prevent="SignInUser">
            <label for="UserEmail">Email</label>
            <input type="email" name="UserEmail" v-model="InputEmail">
            <label for="UserPassword">Password</label>
            <input type="password" name="UserPassword" v-model="InputPassword">
            <input type="submit">
        </form>
    </div>
</template>

<script setup>
    const supabase = useSupabaseClient()
    const InputEmail = ref('')
    const InputPassword = ref('')

    async function SignInUser() {
         const {data, error} = await supabase.auth.signInWithPassword({
                email: InputEmail.value,
                password: InputPassword.value,
            })
        if(error){
            console.error("Error fetching data:", error.message);
            InputEmail.value =""
            InputPassword.value =""
        } else{
            window.location.href = '/';
        }
    }
</script>