<template>
    <div class="flex">
        <form @submit.prevent="SignUpUser">
            <label for="UserEmail">Email</label>
            <input type="email" name="UserEmail" v-model="InputEmail">
            <label for="UserPassword">Password</label>
            <input type="password" name="UserPassword" v-model="InputPassword">
            <label for="UserEmail">Match Password</label>
            <input type="password" name="UserMatchPassword" v-model="MatchPassword">
            <input type="submit">
        </form>
    </div>
</template>

<script setup>
    const supabase = useSupabaseClient()
    const InputEmail = ref('')
    const InputPassword = ref('')
    const MatchPassword = ref('')
    
    async function SignUpUser() {
        if( InputPassword.value == MatchPassword.value){
            const {data, error} = await supabase.auth.signUp({
                email: InputEmail.value,
                password: InputPassword.value,
            })
            if(error){
                console.error("Error fetching data:", error.message);
                InputEmail.value =""
                InputPassword.value =""
                MatchPassword.value = ""
            }else{
                const userEmail = data.user.email
                const UserId = data.user.id
                addRole(UserId)
                navigateTo('/')
            }
        }else{
            alert('Password does not match')
        }
    }

    async function addRole(id) {
        const { data, error } = await supabase
        .from('table_user_role')
        .insert({ user_id: id, email: InputEmail.value})
        if(error){
                console.error("Error fetching data:", error.message);
                InputEmail.value =""
                InputPassword.value =""
                MatchPassword.value = ""
            }else{
                navigateTo('/')
            }
    }

</script>