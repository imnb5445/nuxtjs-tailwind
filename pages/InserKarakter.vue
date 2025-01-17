<template>
    <form @submit.prevent="InsertDataKarakter">
        <div>
            <input type="text" class="input_nama_karakter" v-model="nama_karakter">
            <select name="series" id="selectTest"  v-model="pemain_karakter">
                <option value="" disabled selected>Choose An Actor/Actress</option>
                <option v-for="pemain in total_pemain" :key="pemain.pemain_id" v-bind:value="pemain.pemain_id">{{ pemain.nama_pemain }} </option>
            </select>
            <select name="pemain" id="selectTest"  v-model="series_karakter">
                <option value="" disabled selected>Choose A Series</option>
                <option v-for="show in series" :key="show.series_id" v-bind:value="show.series_id">{{ show.nama_series }} </option>
            </select>
        </div>
        <input type="submit">
    </form>
</template>

<script setup>

    const supabase = useSupabaseClient()
    const series = ref([])
    const tempatTayangInput = ref([])
    const genresInput = ref([])
    const genres = ref ([])
    const total_pemain = ref([])
    const pemain_karakter = ref('')
    const series_karakter = ref('')
    const nama_karakter = ref('')
    const selected_img = ref('')
    const CurrentUser = ref([])
    const role = ref('')

    async function FetchDataUser() {
        const { data: { user: User } } = await supabase.auth.getUser()
        CurrentUser.value = User
 
        if(!CurrentUser.value){
            navigateTo('/')
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

        console.log(role.value)
        if(role.value !== 'admin'){
            navigateTo('/')
        }


    }



    //Select Function
    async function FecthDataGenre() {
        const {data, error} = await supabase
        .from('table_genre')
        .select()

        genres.value = data
    }

    async function FetchDataPemain() {
        const {data, error} = await supabase
        .from('table_pemain')
        .select()
        
        total_pemain.value = data
    }


    //Insert Function
    async function FetchData() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series')
        series.value = data
    }

    async function InsertDataKarakter() {
        const {error} = await supabase
        .from('table_karakter')
        .insert({nama_karakter: nama_karakter.value, pemain_id: pemain_karakter.value, series_id: series_karakter.value})

        if(error){
            console.log(error)
        }
        else{
            alert("Karakter data Has Been Uploaded")
            nama_karakter.value = ""
            pemain_karakter.value =""
            series_karakter.value = ""
            return
        }

    }

    onMounted(() => {
        FetchDataPemain()/
        FetchData()
    })
        
    
</script>