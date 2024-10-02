<template>
    <form @submit.prevent="InsertData">
        <input type="text" v-model="nama_series">
        <input type="text" v-model="sinopsis_input">
       <input type="file" accept="image/png, image/jpeg" @change="handleFileChange">
       <img v-if="imagePreview" :src="imagePreview" alt="Image Preview" class="w-20 h-20 bg-cover"/>
        <p>Genre</p>
       
        <div v-for="(karakter, index) in nama_karakter" :key="index">
            <input type="text" class="input_nama_karakter" v-model="nama_karakter[index]">
            <input type="text" class="input_nama_karakter">
            <select name="pemain" id="selectTest"  v-model="pemain_karakter[index]">
                <option value="" disabled selected>Choose An Actor/Actress</option>
                <option v-for="pemain in total_pemain" v-bind:value="pemain.pemain_id" :placeholder="'Input ' + (index + 1)">{{ pemain.nama_pemain }} </option>
            </select>
            <select name="awda" id="awda">
                <option value="awda">dwadawda</option>
            </select>
        </div>
        
        <div v-for="tempat in tempatTayang">
            <input type="checkbox" name="checkbox" class="input_checkbox"   v-model="tempatTayangInput" :value="tempat.tempat_tayang_id">
            <label for="checkbox">{{ tempat.nama_tempat_tayang }}</label>
        </div>

        <p>Genre</p>
        <div v-for="genre in genres">
            <input type="checkbox" name="checkbox" class="input_checkbox"   v-model="genresInput" :value="genre.genre_id">
            <label for="checkbox">{{ genre.nama_genre }}</label>

        </div>
        <input type="submit">
    </form>
    

    <button @click="removeInput(index)" class="bg-black text-white">Remove</button>
    <button @click="addInput" class="bg-black">Add Input</button>
    <p>{{ genresInput }}</p>
    <p>{{ tempatTayangInput }}</p>
    <p>{{ selected_img }}</p>
    <p>{{ nama_karakter }}</p>
    <p>{{ pemain_karakter }}</p>
</template>

<script setup>
    const supabase = useSupabaseClient()
    const tempatTayang = ref([])
    const tempatTayangInput = ref([])
    const genresInput = ref([])
    const genres = ref ([])
    const total_pemain = ref([])
    const pemain_karakter = ref([])
    const nama_karakter = ref([])
    const imgurl= ref('')
    const imagePreview = ref('')
    const selected_img = ref('')
    const sinopsis_input = ref('')
    const img_name = ref('')
    const nama_series = ref('')

    //Event Handler
    const handleFileChange = (event) => {
        const file = event.target.files[0];
            if (file) {
                selected_img.value = file;
                img_name.value = file.name;

                // Create a preview URL
                const reader = new FileReader();
                reader.onload = (e) => {
                imagePreview.value = e.target.result; // Set the preview URL
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            }
    };

    const addInput = () => {
        nama_karakter.value.push(''); // Add a new empty string for the new input
    };

    const removeInput = () => {
        if (nama_karakter.value.length > 0) {
        nama_karakter.value.pop(); // Remove the last character name
        pemain_karakter.value.pop(); // Remove the last player selection
    }
    };

    //Select Function
    async function FecthDataGenre() {
        const {data, error} = await supabase
        .from('table_genre')
        .select()

        genres.value = data
    }

    async function FecthDataTempatTayang() {
        const {data, error} = await supabase
        .from('table_tempat_tayang')
        .select()

        tempatTayang.value = data
    }

    async function FetchDataPemain() {
        const {data, error} = await supabase
        .from('table_pemain')
        .select()
        
        total_pemain.value = data
    }

    async function FetchUrl() {
        const { data } = supabase.storage
                .from('series_tumbnail')
                .getPublicUrl(`uploads/${selected_img.value.name}`); //the img url return ass null

            // Now insert the series data
            console.log(data)
            await InsertDataSeries(data.publicUrl);
    }

  

    //Insert Function
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
    async function InsertData() {
        await InsertBucketTumbnail();
    }

    async function InsertDataGenre(x) {
        for (const genreId of genresInput.value) {
        const { error } = await supabase
            .from('table_series_genre')
            .insert({ series_id: x, genre_id: genreId });

        if (error) {
            console.error('Error inserting genre:', error);
        }
    }
    }

    async function InsertDataTempat(x) {
        for (const tempatId of tempatTayangInput.value) {
        const { error } = await supabase
            .from('table_series_tempat_tayang')
            .insert({ series_id: x, tempat_tayang_id:  tempatId});

        if (error) {
            console.error('Error inserting genre:', error);
        }
    }
    }

    async function InsertDataKarakter(SeriesId) {
        const jumlah_karakter = nama_karakter.value.length
        for( let i = 0; i < jumlah_karakter; i++){
            const {error} = await supabase
            .from('table_karakter')
            .insert({nama_karakter: nama_karakter.value[i], pemain_id: pemain_karakter.value[i], series_id: SeriesId})
            console.log
        }
    }

    async function InsertDataSeries( x ) {
        const { data, error} = await supabase
        .from('table_series')
        .insert({nama_series: nama_series.value, sinopsis: sinopsis_input.value, cover: x})
        .select()

        const seriesId = data[0].series_id;
        await InsertDataGenre(seriesId);
        await InsertDataTempat(seriesId)
        await InsertDataKarakter(seriesId)
    }


    onMounted(() => {
        FetchDataPemain()
        FecthDataGenre()
        FecthDataTempatTayang()
    })
        
    
</script>