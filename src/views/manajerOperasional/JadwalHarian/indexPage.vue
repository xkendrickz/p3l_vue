<template>
	<div class="d-flex justify-content-between flex-wrap flex-mdnowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
		<h1 class="h2">LIST JADWAL HARIAN</h1>
	</div>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<button @click.prevent="jadwalHarianCreate()" :disabled="disabled"
							class="btn btn-sm btn-danger ml-1">Generate</button>
						<v-text-field v-model="searchText" prepend-inner-icon="mdi-magnify" label="Cari Kelas"
							placeholder="Enter Class Name" class="custom-text-field-width"></v-text-field>
						<th scope="rowgroup">MORNING CLASS</th>
						<table class="table table-striped table-bordered mt-4">
							<tbody>
								<tr v-for="(jadwalharian, id) in groupedJadwalHarian" :key="id">
									<td>{{ formatDate(jadwalharian[0].hari) }}</td>
									<td>
										{{ jadwalharian[0].jam }} <br>
										{{ jadwalharian[0].nama_kelas }} <br>
										{{ jadwalharian[0].nama_instruktur }} <br>
										{{ jadwalharian[0].status }} <br>
									</td>
									<td>
										<router-link
											:to="{ name: 'mo.jadwalHarian.edit', params: { id: jadwalharian[0].id_jadwal_harian } }"
											class="btn btn-sm btn-primary mr-1">EDIT</router-link>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="card-body">
						<th scope="rowgroup">EVENING CLASS</th>
						<table class="table table-striped table-bordered mt-4">
							<tbody>
								<tr v-for="(jadwalharian, id) in groupedJadwalHarian2" :key="id">
									<td>{{ formatDate(jadwalharian[0].hari) }}</td>
									<td>
										{{ jadwalharian[0].jam }} <br>
										{{ jadwalharian[0].nama_kelas }} <br>
										{{ jadwalharian[0].nama_instruktur }} <br>
										{{ jadwalharian[0].status }} <br>
									</td>
									<td>
										<router-link
											:to="{ name: 'mo.jadwalHarian.edit', params: { id: jadwalharian[0].id_jadwal_harian } }"
											class="btn btn-sm btn-primary mr-1">EDIT</router-link>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'
import { useToast } from "vue-toastification";

export default {

	setup() {
		let jadwal_harian = ref([])
		let toast = useToast();
		const searchText = ref('');
		const disabled = ref(false);
		const lastAccessDate = localStorage.getItem('lastAccessDate');

		const groupedJadwalHarian = computed(() => {
			const filteredData = jadwal_harian.value.filter(item => item.jam >= '00:00' && item.jam < '11:59' && item.nama_kelas.toLowerCase().includes(searchText.value.toLowerCase()));
			const groups = {};
			filteredData.forEach((item) => {
				const key = `${item.hari}-${item.nama_kelas}`;
				if (!groups[key]) {
					groups[key] = [];
				}
				groups[key].push(item);
			});
			return Object.values(groups);
		});

		const groupedJadwalHarian2 = computed(() => {
			const filteredData = jadwal_harian.value.filter(item => item.jam >= '12:00' && item.jam < '23:59' && item.nama_kelas.toLowerCase().includes(searchText.value.toLowerCase()));
			const groups = {};
			filteredData.forEach((item) => {
				const key = `${item.hari}-${item.nama_kelas}`;
				if (!groups[key]) {
					groups[key] = [];
				}
				groups[key].push(item);
			});
			return Object.values(groups);
		});

		const formatDate = computed(() => {
			return function (date) {
				const options = { weekday: 'short', month: 'short', day: 'numeric' }
				const formattedDate = new Date(date).toLocaleDateString('en-us', options)
				const [dayOfWeek, month, day] = formattedDate.split(' ')
				return `${dayOfWeek.toUpperCase()} ${month.toUpperCase()} ${day}`
			}
		})

		if (lastAccessDate) {
			const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik
			const daysSinceLastAccess = (new Date() - new Date(lastAccessDate)) / oneWeekInMilliseconds;
			disabled.value = daysSinceLastAccess < 1;
		}

		onMounted(() => {
			axios.get('http://192.168.1.32:8000/api/jadwalHarian')
				.then(response => {
					jadwal_harian.value = response.data.data;
				})
				.catch(error => {
					console.log(error)
					toast.error('Terjadi Kesalahan!');
				})
		})

		function jadwalHarianCreate() {
			axios.post("http://192.168.1.32:8000/api/jadwalHarian")
				.then(() => {
					toast.success("Berhasil Generate Jadwal Harian !", {
						timeout: 2000
					})
					localStorage.setItem("showToast", "true");
					localStorage.setItem('lastAccessDate', new Date().toString());
					disabled.value = true;
					window.location.reload();
				})
				.catch((error) => {
					//assign state validation with error
					console.log(error.response.data.data);
				});
		}

		// Check for the flag and show the toastification if it's set
		if (localStorage.getItem("showToast")) {
			toast.error("Berhasil Hapus Jadwal Umum !", {
				timeout: 2000
			});
			localStorage.removeItem("showToast"); // Remove the flag
		}

		return {
			jadwal_harian,
			groupedJadwalHarian,
			groupedJadwalHarian2,
			formatDate,
			jadwalHarianCreate,
			disabled,
			searchText
		}
	}
}
</script>