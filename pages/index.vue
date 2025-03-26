<style>

    /* table */
    .table_data  th{
        background-color: black;
        color: rgb(236, 235, 235);
    }
    .table_data  td, th{ 
    border: 1px solid black;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    max-width: 25rem;
    min-width: fit-content;
    }
    .table_data  .item-sinopsis{
        width: 100%;
        max-width: 20rem;
        max-height: 6rem;
        overflow-y: scroll;
    }

    /* edit */
    .edit_panel-container{
        position: fixed;
        display: flex;
        justify-content: end;
        top: 0;
        right: 0;
        background-color: rgba(196, 196, 196, 0.755);
        height: 100%;
        width: 100%;
    }
    .edit_panel{
        background-color: white;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 5rem;
        padding-bottom: 3rem;
        overflow-y: scroll;
        overflow-x: hidden;
        height: 100%;
        width: 20rem;
        z-index: 1;

    }

    .input_text{
        display: flex;
        flex-direction: column;
    }

    .input_text-form{
        background-color: rgb(249, 246, 246);
        border: 1px solid black;
        border-radius: 0.5rem 0.5rem 0 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.4rem;
        padding-bottom: 0.4rem
    }

    




</style>

<template>
    
    <table class="table_data">
        <tr>
            <th>Judul</th>
            <th>Sinopsis</th>
            <th>Cover</th>
            <th>Genre</th>
            <th>Tempat Tayang</th>
            <th>Tools</th>
        </tr>
        <tr v-for="show in series" :key="show.series_id">
            <td><p>{{ show.nama_series }}</p></td>
            <td> <div class="item-sinopsis"> {{ show.sinopsis }} </div></td>
            <td><img :src="show.cover" alt="" class="w-20 h-20 bg-cover" @click="SeriesGoTo(show.series_id)"></td>
            <td><p v-for=" genre in show.table_genre">{{ genre.nama_genre }}</p></td>
            <td><p v-for=" tempat in show.table_tempat_tayang">{{ tempat.nama_tempat_tayang }}</p></td>
            <td><form @submit.prevent="FetchSeries(show.series_id, show.nama_series, show.sinopsis, show.cover)">
            <input type="submit">
        </form>

        <button @click="DeleteData(show.series_id)">Delete</button></td>
        </tr>
    </table>

    <div class="edit_panel-container" v-if="isEditing" >
        <div  class="edit_panel">
            <img src="" alt="" class="close-panel">
            <form @submit.prevent="UpdateData" >
                <div class="input_text">
                    <label for="JudulInput" class="input_text-title">Judul</label>
                    <input type="text" name="JudulInput" v-model="judulInput" class="input_text-form">
                </div>
            
                <div class="input_text">
                    <label for="sinopsis" class="input_text-title">Sinopsis</label>
                    <textarea name="sinopsis" v-model="sinopsisInput" class="input_text-form"></textarea>
                </div>
            
                <div class="input_checkbox">
                    <p class="input_checkbox-title">Genre</p>
                    <div v-for="genre in genres" :key="genre.genre_id" class="input_checkbox-form">
                        <input type="checkbox" name="checkbox" :value="genre.genre_id" v-model="genresInput" class="option-checkbox">
                        <label for="checkbox" class="option-title">{{ genre.nama_genre }}</label>
                    </div>
                </div>
            
                <div class="input_checkbox">
                    <p class="input_checkbox-title">Tempat Tayang</p>
                    <div v-for=" tempat in tempatTayang" :key="tempat.tempat_tayang_id" class="input_checkbox-form">
                        <input type="checkbox" name="checkbox" :value="tempat.tempat_tayang_id" v-model="tempatInput" class="option-checkbox">
                        <label for="checkbox" class="option-title">{{ tempat.nama_tempat_tayang }}</label>
                    </div>
                </div>
                
                <div class="input_file">
                    <p class="input_file-title">cover</p>
                    <input class="input_file-button" type="file" accept="image/png, image/jpeg" @change="handleFileChange">
                </div>
                
                <input type="submit">
            </form>
        </div>
    </div>
    

    <form @submit.prevent="FetchDataFilter">
        <input type="text" v-model="searchInput" @input="SearchEventHandler">
        <div  v-for="genre in genres" :key="genre.genre_id" >
            <input type="checkbox" :value="genre.genre_id" v-model="filterGenre" name="FilterCheckbox">
            <label for="FilterCheckbox">{{ genre.nama_genre }}</label>
        </div>
       <button type="submit">Filter</button>
    </form>
    <div v-for="result in seriesSearch" :key="result.series_id" @click="searchInput = result.nama_series">
        {{ result.nama_series }}
    </div>
 
    <form action="">
        <input type="submit">
    </form>
</template>

<script setup>

    const router = useRouter()
    const series = ref([])
    const genres = ref([])
    const tempatTayang = ref([])
    const tempatInput = ref([])
    const genresInput = ref([])
    const url_input = ref('')
    const seriesSearch = ref([])
    const filterGenre = ref([])
    const sinopsisInput = ref('')
    const judulInput = ref('')
    const searchInput=ref('')
    const id_input =  ref('')
    const selected_img=ref('')
    const img_name = ref('')
    const imagePreview = ref('')
    const supabase = useSupabaseClient()
    const nama_series = ref('')
    const test = searchInput.value.length
    var fileIsChange = false
    const isEditing = ref(false)
    // Navigation
    function  SeriesGoTo(id){
        router.push({ name: 'series-id', params: { id } });
    }
    // Event handeling
    const handleFileChange = (event) => {
        const file = event.target.files[0];
            if (file) {
                selected_img.value = file;
                img_name.value = file.name;
                fileIsChange = true


                // Create a preview URL
                const reader = new FileReader();
                reader.onload = (e) => {
                imagePreview.value = e.target.result; // Set the preview URL
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            }
    };

    async function SearchEventHandler(event){

        if(searchInput.value.length < 2){
            seriesSearch.value = []
            return
        }

        const {data, error} = await supabase
        .from('table_series')
        .select()
        .ilike('nama_series', `%${searchInput.value}%`);

        if(error){
            console.error("Error fetching data:", error.message);
            seriesSearch.value = []; // Clear results on error
        }
        else{
            seriesSearch.value = data
        }

    }

    async function closePanel() {
        id_input.value = ''
        judulInput.value = ''
        sinopsisInput.value = ''
        genresInput.value = []
        tempatInput.value = []
        url_input.value = ''
        isEditing.value = false
        fileIsChange = false
    }


    //delete function
    async function DeleteData(x){
        const {error: deleteError} = await supabase
            .from('table_series')
            .delete()
            .eq('series_id', x)
            if(deleteError){
            console.error("Data selection failed:", error.message);
            alert("Data selection failed");
            }

            FetchData()
    }
   
    //insert function
    async function InsertBucketTumbnail(){
        if (selected_img.value) {
            const { data, error } = await supabase.storage
            .from('series_tumbnail')
            .upload(`uploads/${selected_img.value.name}`, selected_img.value, {
                cacheControl: '3600',
                upsert: false,
            });

            if (error) {
            console.error('Error uploading file:', error);
            alert('Upload failed. Please try again.');
            } else {
            console.log('File uploaded successfully:', data);
            alert('File uploaded successfully!');

            FetchUrl()
           
            }
        } else {
            alert('Please select a file to upload.');
        }
    }


    //update function

    async function UpdateData() {
        if(id_input.value == '' && judulInput.value == '' && sinopsisInput.value == '' && genresInput.value == null && tempatInput.value == null && url_input.value == null){
            alert('please fill out all the form')
            return 
        }

        await UpdateDataGenre()
        await UpdateDataTempat()

        if(fileIsChange){
            await InsertBucketTumbnail()
        }
        else{
            await UpdateDataSeries()
        }
        

        id_input.value = ''
        isEditing.value = false
        fileIsChange = false
    }

    async function UpdateDataSeries() {
        const {error} = await supabase
        .from('table_series')
        .update({nama_series : judulInput.value, sinopsis : sinopsisInput.value, cover : url_input.value})
        .eq('series_id', id_input.value)

        if(error){
            console.error("Data Update failed:", error.message);
            alert("Data Update failed");
         }
    }

    async function UpdateDataTempat() {
        for( const tempat of tempatInput.value){
            const {error} = await supabase
            .from('table_series_tempat_tayang')
            .upsert({series_id: id_input.value, tempat_tayang_id : tempat})
            
            console.log(tempat)

            if (error) {
                alert('data Upserting failed')
                return
            }

           
            
        }

        for(const tempatData of tempatTayang.value){
            if(tempatInput.value.includes(tempatData.tempat_tayang_id)){
                console.log(tempatData.tempat_tayang_id)
            }
            else{
                const {error: deleteError} = await supabase
                .from('table_series_tempat_tayang')
                .delete()
                .eq('series_id', id_input.value)
                .eq('tempat_tayang_id', tempatData.tempat_tayang_id)
                if(deleteError){
                    console.error("Data selection failed:", error.message);
                    alert("Data selection failed");
                }
            }
        }
        tempatInput.value = []
        await FetchData()
    }
    async function UpdateDataGenre() {
        for( const genre of genresInput.value){
            const {error} = await supabase
            .from('table_series_genre')
            .upsert({series_id: id_input.value, genre_id : genre})
            
            console.log(genre)

            if (error) {
                alert('data Upserting failed')
                return
            }
            
        }

        for(const genreData of genres.value){
            if(genresInput.value.includes(genreData.genre_id)){
                console.log('a')
            }
            else{
                const {error: deleteError} = await supabase
                .from('table_series_genre')
                .delete()
                .eq('series_id', id_input.value)
                .eq('genre_id', genreData.genre_id)
                if(deleteError){
                    console.error("Data selection failed:", error.message);
                    alert("Data selection failed");
                }
            }
        }
        genresInput.value = []
        await FetchData()
    }

    //fetch Function

    async function FetchUrl() {
        const { data } = supabase.storage
                .from('series_tumbnail')
                .getPublicUrl(`uploads/${selected_img.value.name}`); //the img url return ass null

            // Now insert the series data
            url_input.value = data.publicUrl
            await UpdateDataSeries();
    }

    async function FetchData() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series, sinopsis, cover, table_genre!inner(*), table_tempat_tayang!inner(*) ')
        // .filter('table_genre.genre_id', 'in', test)
        series.value = data
    }
        //filter function 
    async function FetchDataFilter() {
        console.log('this function is running')
        let query = supabase
        .from('table_series')
        .select('series_id, nama_series, sinopsis, cover, table_genre!inner(*), table_tempat_tayang!inner(*) ')

        if(searchInput.value.length > 1){
            query = query.ilike('nama_series', `%${searchInput.value}%`);
            console.log('filter nama')
        }

        // (note: ketika memfilter function ini mengngeluar kan semua series yang memiliki salah satu genre yang dipilig bukan kobinasi)
        // if(filterGenre.value !=[]){
        //     query = query.in('table_genre.genre_id', filterGenre.value)
        //     console.log('filter genre')
        // }

        const {data, error} = await query

        if(error){
            console.error("Data selection failed:", error.message);
            alert("Data selection failed");
            return
        }

        console.log(data)
        series.value = data
    }

    async function FetchDataGenre() {
        const { data, error} = await supabase
        .from('table_genre')
        .select()

        genres.value = data

    }

    async function FetchDataTempat() {
        const { data, error} = await supabase
        .from('table_tempat_tayang')
        .select()

        tempatTayang.value = data

    }

    async function FetchSeries(id, judul, sinopsis, cover){
        FetchSeriesGenre(id)
        FetchSeriesTempat(id)
        id_input.value = id
        judulInput.value = judul
        sinopsisInput.value = sinopsis
        url_input.value = cover
        isEditing.value = true
    }

    async function FetchSeriesGenre(x) {
        const {data, error} = await supabase
        .from('table_series_genre')
        .select('genre_id')
        .eq('series_id', x)

        
        genresInput.value = data.map(item => item.genre_id)
    }

    async function FetchSeriesTempat(x) {
        const {data, error} = await supabase
        .from('table_series_tempat_tayang')
        .select('tempat_tayang_id')
        .eq('series_id', x)

        
        tempatInput.value = data.map(item => item.tempat_tayang_id)

    }

    

    onMounted(() => {
        FetchData()
        FetchDataGenre()
        FetchDataTempat()
    })
        
    
</script>