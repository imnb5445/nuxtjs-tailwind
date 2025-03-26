<template>
    <div class="flex container h-10 mx-auto px-4 bg-slate-900 justify-between fixed z-10">
        <div class="flex flex-row columns-3 items-center text-white gap-2">
            <NuxtLink to="/" class="text-f">Index</NuxtLink>
            <NuxtLink to="/insert" v-if="role == 'admin'">Insert</NuxtLink>
            <NuxtLink to="/signIn" v-if="!CurrentUser">Sign</NuxtLink>
        </div>

        <div class="flex flex-row columns-3 items-center text-white gap-1">
            <button @click="SignOutUser" v-if="CurrentUser">Log Out</button>
            <p v-for="user in CurrentUser" :key="user.id" class="text-white" >{{ user.email }}</p>
            
        </div>
        <div >
            
        </div>
    </div>

    <sidebar />
    <div class="slot-container">
        <slot />
    </div>
   
  
</template>

<style>
    .slot-container{
        padding-top: 2.5rem !important;
        padding-left: 15rem !important;
    }
</style>

<script setup>
    const supabase = useSupabaseClient()
    const route = useRoute()
    const CurrentUser = ref([])
    const role = ref('')
    provide('role', role)

    async function SignOutUser() {
        const { error } = await supabase.auth.signOut()
        reloadNuxtApp()
    }

    // const { data } = supabase.auth.onAuthStateChange((event, session) => {
    // console.log(event, session)
    // if (event === 'INITIAL_SESSION') {
    //     // handle initial session
    // } else if (event === 'SIGNED_IN') {
    //     NotSignIn.value = false

    // } else if (event === 'SIGNED_OUT'){
    //     NotSignIn.value = true
    // }
    // })

    async function FetchDataUser() {
        const { data: { user: User } } = await supabase.auth.getUser()
        CurrentUser.value = User
 
        if(!CurrentUser.value){
            return
        }
        const UserId = User.id
        FetchUserRole(UserId)
    }

    async function FetchUserRole(id) {
        const {data} = await supabase
        .from('table_user_role')
        .select('*, table_role!inner(*)')
        .eq('user_id', id)
        .eq('table_role.nama_role', 'admin')

        const UserRole = data[0].table_role.nama_role
        role.value = UserRole


    }

    onMounted(() =>{
        FetchDataUser()
    })

   
</script>