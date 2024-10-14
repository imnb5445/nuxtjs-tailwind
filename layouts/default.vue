<template>
    <div v-for="user in CurrentUser" :key="user.id">
        <p class="fixed" :key="$route.fullPath">{{ user.email }}</p>
    </div>
    <slot />

</template>

<script setup>
    const supabase = useSupabaseClient()
    const route = useRoute()
    const CurrentUser = ref([])

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
    if (event === 'INITIAL_SESSION') {
        // handle initial session
    } else if (event === 'SIGNED_IN') {
        window.location.href = '/';
    }
    })

    async function FetchDataUser() {
        const { data: { user: User } } = await supabase.auth.getUser()

        CurrentUser.value = User
    }

    onMounted(() =>{
        FetchDataUser()
    })
</script>